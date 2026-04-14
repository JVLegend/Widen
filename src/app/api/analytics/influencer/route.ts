import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, apiServerError } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const influencerId = searchParams.get("influencerId");

    if (!influencerId) return apiError("influencerId é obrigatório");

    const campaigns = await prisma.campaign.findMany({
      where: { influencerId },
      include: {
        clips: {
          include: {
            clipper: { select: { id: true, name: true, avatarUrl: true } },
            socialAccount: { select: { platform: true, handle: true } },
          },
        },
      },
    });

    const allClips = campaigns.flatMap((c) => c.clips);
    const totalViews = allClips.reduce((s, c) => s + c.views, 0);
    const totalClips = allClips.length;
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter((c) => c.status === "active").length;

    const viewsByPlatform: Record<string, number> = {};
    for (const clip of allClips) {
      viewsByPlatform[clip.platform] = (viewsByPlatform[clip.platform] || 0) + clip.views;
    }

    const clipperMap: Record<string, { name: string; avatarUrl: string | null; views: number; clips: number }> = {};
    for (const clip of allClips) {
      if (!clipperMap[clip.clipperId]) {
        clipperMap[clip.clipperId] = { name: clip.clipper.name, avatarUrl: clip.clipper.avatarUrl, views: 0, clips: 0 };
      }
      clipperMap[clip.clipperId].views += clip.views;
      clipperMap[clip.clipperId].clips += 1;
    }
    const topClippers = Object.entries(clipperMap)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    const viewsByDate: Record<string, number> = {};
    for (const clip of allClips) {
      const date = clip.createdAt.toISOString().split("T")[0];
      viewsByDate[date] = (viewsByDate[date] || 0) + clip.views;
    }
    const viewsTimeline = Object.entries(viewsByDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, views]) => ({ date, views }));

    const clipsByStatus: Record<string, number> = {};
    for (const clip of allClips) {
      clipsByStatus[clip.status] = (clipsByStatus[clip.status] || 0) + 1;
    }

    return apiSuccess({
      totalViews,
      totalClips,
      totalCampaigns,
      activeCampaigns,
      viewsByPlatform,
      topClippers,
      viewsTimeline,
      clipsByStatus,
    });
  } catch (err) {
    return apiServerError(err);
  }
}
