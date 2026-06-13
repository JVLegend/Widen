import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, apiServerError, parsePagination, paginatedResponse, requireCurrentUser } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const influencerId = searchParams.get("influencerId");
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (influencerId) where.influencerId = influencerId;
    if (status) where.status = status;

    const { page, limit, skip } = parsePagination(searchParams);
    const [videos, total] = await Promise.all([
      prisma.video.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { clips: true, campaignVideos: true } } },
      }),
      prisma.video.count({ where }),
    ]);

    return paginatedResponse(videos, total, page, limit);
  } catch (err) {
    return apiServerError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUserId = requireCurrentUser(request);
    if (currentUserId instanceof Response) return currentUserId;

    const body = await request.json();
    const { influencerId, title, description, originalUrl, platform, thumbnailUrl, tags, status } = body;

    if (!influencerId || !title || !originalUrl || !platform) {
      return apiError("Campos obrigatórios: influencerId, title, originalUrl, platform");
    }
    if (currentUserId !== influencerId) return apiError("Acesso negado", 403);

    const video = await prisma.video.create({
      data: {
        influencerId,
        title,
        description: description || null,
        originalUrl,
        platform,
        thumbnailUrl: thumbnailUrl || null,
        tags: tags ? JSON.stringify(tags) : "[]",
        status: status || "available",
      },
    });

    return apiSuccess(video, 201);
  } catch (err) {
    return apiServerError(err);
  }
}
