import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, apiServerError } from "@/lib/api";
import { syncClipFromYouTube } from "@/lib/youtube";

/**
 * POST /api/clips/[id]/sync
 * Fetches the latest stats from YouTube and updates the clip record.
 * Works only for YouTube URLs (youtube.com/shorts, youtu.be, watch?v=).
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const clip = await prisma.clip.findUnique({
      where: { id },
      include: {
        campaign: {
          select: { paymentModel: true, cpvRate: true, fixedRate: true },
        },
      },
    });

    if (!clip) return apiError("Content not found", 404);

    const result = await syncClipFromYouTube(
      clip.clipUrl,
      clip.campaign.paymentModel,
      clip.campaign.cpvRate,
      clip.campaign.fixedRate,
    );

    if (!result) {
      return apiError(
        "Could not fetch metrics. Check that the URL is from YouTube and that YOUTUBE_API_KEY is configured.",
        422,
      );
    }

    const updated = await prisma.clip.update({
      where: { id },
      data: {
        views: result.views,
        likes: result.likes,
        comments: result.comments,
        earnings: result.earnings,
        status: "metrics_collected",
      },
      include: {
        campaign: { select: { id: true, name: true, paymentModel: true, cpvRate: true, fixedRate: true } },
        socialAccount: { select: { id: true, handle: true } },
      },
    });

    return apiSuccess({ clip: updated, synced: result });
  } catch (err) {
    return apiServerError(err);
  }
}
