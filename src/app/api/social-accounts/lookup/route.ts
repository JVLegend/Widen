import { NextRequest } from "next/server";
import { apiSuccess, apiError, apiServerError } from "@/lib/api";
import { extractHandle, lookupYouTubeChannel, type Platform } from "@/lib/social";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    const platform = searchParams.get("platform") as Platform | null;
    if (!url || !platform) return apiError("Missing url or platform", 400);

    const handle = extractHandle(url, platform);

    let followers: number | null = null;
    let resolvedHandle = handle;
    let resolvedUrl = url;

    if (platform === "youtube") {
      const yt = await lookupYouTubeChannel(url);
      if (yt) {
        followers = yt.followers;
        resolvedHandle = yt.handle ?? handle;
        resolvedUrl = yt.profileUrl;
      }
    }

    return apiSuccess({ handle: resolvedHandle, followers, profileUrl: resolvedUrl });
  } catch (err) {
    return apiServerError(err);
  }
}
