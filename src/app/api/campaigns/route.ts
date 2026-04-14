import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, apiServerError, parsePagination, paginatedResponse } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const influencerId = searchParams.get("influencerId");
    const status = searchParams.get("status");
    const active = searchParams.get("active");

    const where: Record<string, unknown> = {};
    if (influencerId) where.influencerId = influencerId;
    if (status) where.status = status;
    if (active === "true") where.status = "active";

    const { page, limit, skip } = parsePagination(searchParams);
    const [campaigns, total] = await Promise.all([
      prisma.campaign.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          influencer: { select: { id: true, name: true, avatarUrl: true } },
          campaignVideos: { include: { video: true } },
          _count: { select: { clips: true } },
        },
      }),
      prisma.campaign.count({ where }),
    ]);

    return paginatedResponse(campaigns, total, page, limit);
  } catch (err) {
    return apiServerError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      influencerId, name, budget, paymentModel, cpvRate, fixedRate,
      platforms, instructions, startDate, endDate, status, videoIds,
    } = body;

    if (!influencerId || !name || budget === undefined || !paymentModel || !startDate || !endDate) {
      return apiError("Campos obrigatórios faltando");
    }

    const campaign = await prisma.campaign.create({
      data: {
        influencerId,
        name,
        budget,
        paymentModel,
        cpvRate: cpvRate || null,
        fixedRate: fixedRate || null,
        platforms: platforms ? JSON.stringify(platforms) : "[]",
        instructions: instructions || null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: status || "draft",
        ...(videoIds && videoIds.length > 0 && {
          campaignVideos: {
            create: videoIds.map((videoId: string) => ({ videoId })),
          },
        }),
      },
      include: {
        campaignVideos: { include: { video: true } },
      },
    });

    return apiSuccess(campaign, 201);
  } catch (err) {
    return apiServerError(err);
  }
}
