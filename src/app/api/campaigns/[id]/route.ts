import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, apiServerError, requireCurrentUser } from "@/lib/api";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        influencer: { select: { id: true, name: true, avatarUrl: true } },
        campaignVideos: { include: { video: true } },
        clips: {
          include: {
            clipper: { select: { id: true, name: true, avatarUrl: true } },
            socialAccount: { select: { id: true, handle: true, platform: true } },
            video: { select: { id: true, title: true, thumbnailUrl: true } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!campaign) return apiError("Campanha não encontrada", 404);
    return apiSuccess(campaign);
  } catch (err) {
    return apiServerError(err);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUserId = requireCurrentUser(request);
    if (currentUserId instanceof Response) return currentUserId;

    const existing = await prisma.campaign.findUnique({
      where: { id },
      select: { influencerId: true },
    });
    if (!existing) return apiError("Campanha não encontrada", 404);
    if (existing.influencerId !== currentUserId) return apiError("Acesso negado", 403);

    const body = await request.json();
    const { name, budget, paymentModel, cpvRate, fixedRate, platforms, instructions, startDate, endDate, status } = body;

    const campaign = await prisma.campaign.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(budget !== undefined && { budget }),
        ...(paymentModel !== undefined && { paymentModel }),
        ...(cpvRate !== undefined && { cpvRate }),
        ...(fixedRate !== undefined && { fixedRate }),
        ...(platforms !== undefined && { platforms: JSON.stringify(platforms) }),
        ...(instructions !== undefined && { instructions }),
        ...(startDate !== undefined && { startDate: new Date(startDate) }),
        ...(endDate !== undefined && { endDate: new Date(endDate) }),
        ...(status !== undefined && { status }),
      },
    });

    return apiSuccess(campaign);
  } catch (err) {
    return apiServerError(err);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUserId = requireCurrentUser(request);
    if (currentUserId instanceof Response) return currentUserId;

    const existing = await prisma.campaign.findUnique({
      where: { id },
      select: { influencerId: true },
    });
    if (!existing) return apiError("Campanha não encontrada", 404);
    if (existing.influencerId !== currentUserId) return apiError("Acesso negado", 403);

    await prisma.campaign.delete({ where: { id } });
    return apiSuccess({ deleted: true });
  } catch (err) {
    return apiServerError(err);
  }
}
