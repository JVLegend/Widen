import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, apiServerError, parsePagination, paginatedResponse } from "@/lib/api";
import { syncClipFromYouTube, extractYouTubeVideoId } from "@/lib/youtube";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clipperId = searchParams.get("clipperId");
    const campaignId = searchParams.get("campaignId");
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (clipperId) where.clipperId = clipperId;
    if (campaignId) where.campaignId = campaignId;
    if (status) where.status = status;

    const { page, limit, skip } = parsePagination(searchParams);
    const [clips, total] = await Promise.all([
      prisma.clip.findMany({
        where,
        skip,
        take: limit,
        include: {
          clipper: { select: { id: true, name: true, avatarUrl: true } },
          campaign: { select: { id: true, name: true, paymentModel: true, cpvRate: true, fixedRate: true } },
          video: { select: { id: true, title: true, platform: true, thumbnailUrl: true } },
          socialAccount: { select: { id: true, platform: true, handle: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.clip.count({ where }),
    ]);

    return paginatedResponse(clips, total, page, limit);
  } catch (err) {
    return apiServerError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clipperId, campaignId, videoId, socialAccountId, clipUrl, platform, publishedAt } = body;

    if (!clipperId || !campaignId || !videoId || !socialAccountId || !clipUrl || !platform) {
      return apiError("Campos obrigatórios: clipperId, campaignId, videoId, socialAccountId, clipUrl, platform");
    }

    const account = await prisma.socialAccount.findFirst({
      where: { id: socialAccountId, userId: clipperId },
    });
    if (!account) {
      return apiError("Conta social não pertence a este cortador", 403);
    }

    // Fetch campaign payment info so we can auto-compute earnings on creation
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      select: { paymentModel: true, cpvRate: true, fixedRate: true },
    });

    // Try to auto-fetch YouTube metrics right on creation
    let ytMetrics: { views: number; likes: number; comments: number; earnings: number } | null = null;
    if (campaign) {
      ytMetrics = await syncClipFromYouTube(
        clipUrl,
        campaign.paymentModel,
        campaign.cpvRate,
        campaign.fixedRate,
      );
    }

    const ytId = extractYouTubeVideoId(clipUrl);
    const thumbnailUrl = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null;

    const clip = await prisma.clip.create({
      data: {
        clipperId,
        campaignId,
        videoId,
        socialAccountId,
        clipUrl,
        thumbnailUrl,
        platform,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        ...(ytMetrics
          ? {
              views: ytMetrics.views,
              likes: ytMetrics.likes,
              comments: ytMetrics.comments,
              earnings: ytMetrics.earnings,
              status: "metrics_collected",
            }
          : {}),
      },
      include: {
        campaign: { select: { id: true, name: true } },
        video: { select: { id: true, title: true } },
        socialAccount: { select: { id: true, handle: true } },
      },
    });

    return apiSuccess({ ...clip, _ytAutoSync: !!ytMetrics }, 201);
  } catch (err) {
    return apiServerError(err);
  }
}
