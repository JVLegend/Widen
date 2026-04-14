import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, apiServerError } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clipperId = searchParams.get("clipperId");

    if (!clipperId) return apiError("clipperId é obrigatório");

    const clips = await prisma.clip.findMany({
      where: { clipperId },
      include: {
        campaign: { select: { id: true, name: true, paymentModel: true } },
        socialAccount: { select: { platform: true, handle: true } },
      },
    });

    const totalViews = clips.reduce((s, c) => s + c.views, 0);
    const totalEarnings = clips.reduce((s, c) => s + c.earnings, 0);
    const totalClips = clips.length;

    const viewsByPlatform: Record<string, number> = {};
    for (const clip of clips) {
      viewsByPlatform[clip.platform] = (viewsByPlatform[clip.platform] || 0) + clip.views;
    }

    const earningsByCampaign: Record<string, { name: string; earnings: number; views: number; clips: number }> = {};
    for (const clip of clips) {
      if (!earningsByCampaign[clip.campaignId]) {
        earningsByCampaign[clip.campaignId] = { name: clip.campaign.name, earnings: 0, views: 0, clips: 0 };
      }
      earningsByCampaign[clip.campaignId].earnings += clip.earnings;
      earningsByCampaign[clip.campaignId].views += clip.views;
      earningsByCampaign[clip.campaignId].clips += 1;
    }
    const campaignPerformance = Object.entries(earningsByCampaign)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.views - a.views);

    const viewsByDate: Record<string, number> = {};
    for (const clip of clips) {
      const date = clip.createdAt.toISOString().split("T")[0];
      viewsByDate[date] = (viewsByDate[date] || 0) + clip.views;
    }
    const viewsTimeline = Object.entries(viewsByDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, views]) => ({ date, views }));

    const earningsByDate: Record<string, number> = {};
    for (const clip of clips) {
      const date = clip.createdAt.toISOString().split("T")[0];
      earningsByDate[date] = (earningsByDate[date] || 0) + clip.earnings;
    }
    const earningsTimeline = Object.entries(earningsByDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, earnings]) => ({ date, earnings }));

    return apiSuccess({
      totalViews,
      totalEarnings,
      totalClips,
      viewsByPlatform,
      campaignPerformance,
      viewsTimeline,
      earningsTimeline,
    });
  } catch (err) {
    return apiServerError(err);
  }
}
