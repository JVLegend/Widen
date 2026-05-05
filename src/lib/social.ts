/**
 * Helpers to extract handles from social profile URLs and to look up
 * follower counts on platforms that expose a public API.
 */

export type Platform = "youtube" | "instagram" | "tiktok";

export function extractHandle(url: string, platform: Platform): string | null {
  try {
    const u = new URL(url.trim());
    const host = u.hostname.replace(/^www\./, "");
    const segments = u.pathname.split("/").filter(Boolean);

    if (platform === "youtube") {
      // youtube.com/@handle, youtube.com/c/handle, youtube.com/channel/UC...
      const at = segments.find((s) => s.startsWith("@"));
      if (at) return at.slice(1);
      if (segments[0] === "c" || segments[0] === "user") return segments[1] ?? null;
      if (segments[0] === "channel") return segments[1] ?? null;
      return null;
    }

    if (platform === "instagram") {
      // instagram.com/handle (ignore /reel/, /p/, /stories/, etc.)
      if (!host.includes("instagram.com")) return null;
      const reserved = new Set(["reel", "reels", "p", "stories", "explore", "tv", "accounts"]);
      const first = segments[0];
      if (!first || reserved.has(first)) return null;
      return first.replace(/^@/, "");
    }

    if (platform === "tiktok") {
      // tiktok.com/@handle, tiktok.com/@handle/video/...
      const at = segments.find((s) => s.startsWith("@"));
      if (at) return at.slice(1);
      return null;
    }
  } catch {
    // not a URL
  }
  return null;
}

export interface ChannelLookupResult {
  handle: string | null;
  followers: number | null;
  profileUrl: string;
}

export async function lookupYouTubeChannel(handleOrUrl: string): Promise<ChannelLookupResult | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return null;

  const handle = handleOrUrl.startsWith("http")
    ? extractHandle(handleOrUrl, "youtube")
    : handleOrUrl.replace(/^@/, "");
  if (!handle) return null;

  const isChannelId = /^UC[A-Za-z0-9_-]{20,}$/.test(handle);
  const params = isChannelId
    ? `part=statistics,snippet&id=${encodeURIComponent(handle)}`
    : `part=statistics,snippet&forHandle=${encodeURIComponent("@" + handle)}`;

  const url = `https://www.googleapis.com/youtube/v3/channels?${params}&key=${encodeURIComponent(apiKey)}`;

  try {
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) {
      console.error(`[youtube] channel lookup ${res.status}:`, await res.text());
      return null;
    }
    const json = await res.json();
    const item = json?.items?.[0];
    if (!item) return null;
    const followers = parseInt(item.statistics?.subscriberCount ?? "0", 10);
    const customUrl: string | undefined = item.snippet?.customUrl;
    const resolvedHandle = (customUrl?.replace(/^@/, "") ?? handle).toLowerCase();
    return {
      handle: resolvedHandle,
      followers: Number.isFinite(followers) ? followers : null,
      profileUrl: `https://www.youtube.com/@${resolvedHandle}`,
    };
  } catch (err) {
    console.error("[youtube] channel lookup failed:", err);
    return null;
  }
}
