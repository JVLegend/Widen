import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, apiServerError, requireCurrentUser } from "@/lib/api";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentUserId = requireCurrentUser(request);
    if (currentUserId instanceof Response) return currentUserId;

    const existing = await prisma.socialAccount.findUnique({
      where: { id },
      select: { userId: true },
    });
    if (!existing) return apiError("Conta social não encontrada", 404);
    if (existing.userId !== currentUserId) return apiError("Acesso negado", 403);

    const body = await request.json();
    const { platform, handle, profileUrl, followers } = body;

    const account = await prisma.socialAccount.update({
      where: { id },
      data: {
        ...(platform !== undefined && { platform }),
        ...(handle !== undefined && { handle }),
        ...(profileUrl !== undefined && { profileUrl }),
        ...(followers !== undefined && { followers }),
      },
    });

    return apiSuccess(account);
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

    const existing = await prisma.socialAccount.findUnique({
      where: { id },
      select: { userId: true },
    });
    if (!existing) return apiError("Conta social não encontrada", 404);
    if (existing.userId !== currentUserId) return apiError("Acesso negado", 403);

    await prisma.socialAccount.delete({ where: { id } });
    return apiSuccess({ deleted: true });
  } catch (err) {
    return apiServerError(err);
  }
}
