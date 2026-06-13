import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, apiServerError, requireCurrentUser } from "@/lib/api";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const clip = await prisma.clip.findUnique({
      where: { id },
      include: {
        clipper: { select: { id: true, name: true, avatarUrl: true } },
        campaign: { select: { id: true, name: true, paymentModel: true, cpvRate: true, fixedRate: true } },
        video: { select: { id: true, title: true, platform: true, thumbnailUrl: true } },
        socialAccount: { select: { id: true, platform: true, handle: true } },
      },
    });

    if (!clip) return apiError("Corte não encontrado", 404);
    return apiSuccess(clip);
  } catch (err) {
    return apiServerError(err);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const currentUserId = requireCurrentUser(request);
    if (currentUserId instanceof Response) return currentUserId;

    const existing = await prisma.clip.findUnique({
      where: { id },
      select: { clipperId: true },
    });
    if (!existing) return apiError("Corte não encontrado", 404);
    if (existing.clipperId !== currentUserId) return apiError("Acesso negado", 403);

    const body = await request.json();

    const allowed = ["status", "views", "likes", "comments", "shares", "earnings", "clipUrl", "publishedAt"];
    const data: Record<string, unknown> = {};
    for (const key of allowed) {
      if (body[key] !== undefined) {
        data[key] = key === "publishedAt" ? new Date(body[key]) : body[key];
      }
    }

    const clip = await prisma.clip.update({
      where: { id },
      data,
      include: {
        campaign: { select: { id: true, name: true } },
        socialAccount: { select: { id: true, handle: true } },
      },
    });

    return apiSuccess(clip);
  } catch (err) {
    return apiServerError(err);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const currentUserId = requireCurrentUser(request);
    if (currentUserId instanceof Response) return currentUserId;

    const existing = await prisma.clip.findUnique({
      where: { id },
      select: { clipperId: true },
    });
    if (!existing) return apiError("Corte não encontrado", 404);
    if (existing.clipperId !== currentUserId) return apiError("Acesso negado", 403);

    await prisma.clip.delete({ where: { id } });
    return apiSuccess({ deleted: true });
  } catch (err) {
    return apiServerError(err);
  }
}
