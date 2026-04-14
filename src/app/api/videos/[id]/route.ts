import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, apiServerError } from "@/lib/api";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const video = await prisma.video.findUnique({
      where: { id },
      include: {
        influencer: { select: { id: true, name: true, avatarUrl: true } },
        campaignVideos: { include: { campaign: true } },
        clips: {
          select: { id: true, platform: true, status: true, views: true, clipUrl: true },
        },
      },
    });

    if (!video) return apiError("Vídeo não encontrado", 404);
    return apiSuccess(video);
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
    const body = await request.json();
    const { title, description, originalUrl, platform, thumbnailUrl, tags, status } = body;

    const video = await prisma.video.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(originalUrl !== undefined && { originalUrl }),
        ...(platform !== undefined && { platform }),
        ...(thumbnailUrl !== undefined && { thumbnailUrl }),
        ...(tags !== undefined && { tags: JSON.stringify(tags) }),
        ...(status !== undefined && { status }),
      },
    });

    return apiSuccess(video);
  } catch (err) {
    return apiServerError(err);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.video.delete({ where: { id } });
    return apiSuccess({ deleted: true });
  } catch (err) {
    return apiServerError(err);
  }
}
