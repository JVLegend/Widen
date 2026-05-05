/**
 * YouTube Data API v3 — helper utilities
 * Requires YOUTUBE_API_KEY environment variable.
 */

export interface YouTubeStats {
  views: number;
  likes: number;
  comments: number;
  publishedAt: string | null;
}

export interface YouTubeVideoMetadata {
  title: string;
  description: string;
  thumbnailUrl: string;
  tags: string[];
}

/**
 * Extracts a YouTube video ID from any of these URL formats:
 *   https://www.youtube.com/watch?v=VIDEO_ID
 *   https://www.youtube.com/shorts/VIDEO_ID
 *   https://youtu.be/VIDEO_ID
 *   https://m.youtube.com/watch?v=VIDEO_ID
 */
export function extractYouTubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);

    if (parsed.hostname === "youtu.be") {
      const id = parsed.pathname.slice(1).split("/")[0];
      return id || null;
    }

    if (parsed.hostname.endsWith("youtube.com")) {
      const shortsMatch = parsed.pathname.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
      if (shortsMatch) return shortsMatch[1];

      const v = parsed.searchParams.get("v");
      if (v) return v;

      const embedMatch = parsed.pathname.match(/\/(embed|v)\/([a-zA-Z0-9_-]{11})/);
      if (embedMatch) return embedMatch[2];
    }
  } catch {
    // not a valid URL
  }
  return null;
}

/**
 * Fetches public statistics for a YouTube video via the Data API v3.
 * Returns null if the video is not found, the API key is missing, or the
 * request fails (so callers can fall back gracefully).
 */
export async function fetchYouTubeStats(videoId: string): Promise<YouTubeStats | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.warn("[youtube] YOUTUBE_API_KEY not set — skipping metrics fetch");
    return null;
  }

  const url =
    `https://www.googleapis.com/youtube/v3/videos` +
    `?part=statistics,snippet&id=${encodeURIComponent(videoId)}&key=${encodeURIComponent(apiKey)}`;

  try {
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) {
      console.error(`[youtube] API error ${res.status}:`, await res.text());
      return null;
    }

    const json = await res.json();
    const item = json?.items?.[0];
    if (!item) return null;

    const stats = item.statistics;
    return {
      views: parseInt(stats.viewCount ?? "0", 10),
      likes: parseInt(stats.likeCount ?? "0", 10),
      comments: parseInt(stats.commentCount ?? "0", 10),
      publishedAt: item.snippet?.publishedAt ?? null,
    };
  } catch (err) {
    console.error("[youtube] fetch failed:", err);
    return null;
  }
}

export async function fetchYouTubeVideoMetadata(videoId: string): Promise<YouTubeVideoMetadata | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return null;

  const url =
    `https://www.googleapis.com/youtube/v3/videos` +
    `?part=snippet&id=${encodeURIComponent(videoId)}&key=${encodeURIComponent(apiKey)}`;

  try {
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) {
      console.error(`[youtube] metadata API error ${res.status}:`, await res.text());
      return null;
    }

    const json = await res.json();
    const snippet = json?.items?.[0]?.snippet;
    if (!snippet?.title) return null;

    const thumbnails = snippet.thumbnails || {};
    const thumbnailUrl =
      thumbnails.maxres?.url ||
      thumbnails.standard?.url ||
      thumbnails.high?.url ||
      thumbnails.medium?.url ||
      thumbnails.default?.url ||
      `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    return {
      title: snippet.title,
      description: snippet.description || "",
      thumbnailUrl,
      tags: Array.isArray(snippet.tags) ? snippet.tags : [],
    };
  } catch (err) {
    console.error("[youtube] metadata fetch failed:", err);
    return null;
  }
}

/**
 * Given a clip URL and the associated mission's payment model, tries to
 * fetch YouTube stats and compute earnings (impact points).
 *
 * Returns null for non-YouTube URLs or when the API key is absent.
 */
export async function syncClipFromYouTube(
  clipUrl: string,
  paymentModel: string,
  cpvRate: number | null,
  fixedRate: number | null,
): Promise<(YouTubeStats & { earnings: number }) | null> {
  const videoId = extractYouTubeVideoId(clipUrl);
  if (!videoId) return null;

  const stats = await fetchYouTubeStats(videoId);
  if (!stats) return null;

  let earnings = 0;
  if (paymentModel === "cpv" && cpvRate) {
    earnings = stats.views * cpvRate;
  } else if (paymentModel === "fixed_per_clip" && fixedRate) {
    earnings = fixedRate;
  }

  return { ...stats, earnings };
}
