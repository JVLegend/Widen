import { NextRequest } from "next/server";
import { apiError, apiServerError, apiSuccess } from "@/lib/api";
import { extractYouTubeVideoId, fetchYouTubeVideoMetadata } from "@/lib/youtube";

type VideoMetadata = {
  title: string;
  description: string;
  thumbnailUrl: string;
  tags: string[];
  platform: string;
};

const SUPPORTED_HOSTS = [
  "youtube.com",
  "youtu.be",
  "instagram.com",
  "tiktok.com",
];

function detectPlatform(url: string): string {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("instagram.com")) return "instagram";
  if (url.includes("tiktok.com")) return "tiktok";
  return "";
}

function isSupportedUrl(url: URL): boolean {
  if (!["http:", "https:"].includes(url.protocol)) return false;
  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  return SUPPORTED_HOSTS.some((supported) => host === supported || host.endsWith(`.${supported}`));
}

type NextFetchInit = RequestInit & { next?: { revalidate?: number } };

async function fetchWithTimeout(url: string, init: NextFetchInit = {}, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function getMeta(html: string, key: string): string {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']*)["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${escaped}["'][^>]*>`, "i"),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeHtml(match[1]);
  }

  return "";
}

function getArticleTags(html: string): string[] {
  return Array.from(html.matchAll(/<meta[^>]+property=["']article:tag["'][^>]+content=["']([^"']+)["'][^>]*>/gi))
    .map((match) => decodeHtml(match[1]))
    .filter(Boolean);
}

async function fetchYouTubeOEmbed(url: string, videoId: string): Promise<Partial<VideoMetadata> | null> {
  try {
    const res = await fetchWithTimeout(
      `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(url)}`,
      { next: { revalidate: 0 } },
    );
    if (!res.ok) return null;

    const json = await res.json();
    return {
      title: json.title || "",
      thumbnailUrl: json.thumbnail_url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    };
  } catch {
    return null;
  }
}

async function fetchOpenGraphMetadata(url: string): Promise<Partial<VideoMetadata> | null> {
  try {
    const res = await fetchWithTimeout(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; WidenBot/1.0)",
        Accept: "text/html,application/xhtml+xml",
      },
      next: { revalidate: 0 },
    });
    if (!res.ok) return null;

    const html = await res.text();
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const keywords = getMeta(html, "keywords")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    return {
      title: getMeta(html, "og:title") || (titleMatch?.[1] ? decodeHtml(titleMatch[1]) : ""),
      description: getMeta(html, "og:description") || getMeta(html, "description"),
      thumbnailUrl: getMeta(html, "og:image") || getMeta(html, "twitter:image"),
      tags: [...new Set([...getArticleTags(html), ...keywords])],
    };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url")?.trim();

    if (!url) return apiError("URL obrigatória");

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return apiError("URL inválida");
    }
    if (!isSupportedUrl(parsedUrl)) return apiError("Plataforma de vídeo não suportada", 400);

    const platform = detectPlatform(url);
    const youtubeId = extractYouTubeVideoId(url);

    if (youtubeId) {
      const [youtubeApi, oembed, openGraph] = await Promise.all([
        fetchYouTubeVideoMetadata(youtubeId),
        fetchYouTubeOEmbed(url, youtubeId),
        fetchOpenGraphMetadata(url),
      ]);

      return apiSuccess<VideoMetadata>({
        title: youtubeApi?.title || oembed?.title || openGraph?.title || "",
        description: youtubeApi?.description || openGraph?.description || "",
        thumbnailUrl:
          youtubeApi?.thumbnailUrl ||
          oembed?.thumbnailUrl ||
          openGraph?.thumbnailUrl ||
          `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
        tags: youtubeApi?.tags?.length ? youtubeApi.tags : openGraph?.tags || [],
        platform: "youtube",
      });
    }

    const openGraph = await fetchOpenGraphMetadata(url);
    if (!openGraph?.title && !openGraph?.thumbnailUrl) {
      return apiError("Não foi possível buscar os dados desse vídeo", 404);
    }

    return apiSuccess<VideoMetadata>({
      title: openGraph.title || "",
      description: openGraph.description || "",
      thumbnailUrl: openGraph.thumbnailUrl || "",
      tags: openGraph.tags || [],
      platform,
    });
  } catch (err) {
    return apiServerError(err);
  }
}
