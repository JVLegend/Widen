import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, apiServerError, requireCurrentUser } from "@/lib/api";

const userSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  avatarUrl: true,
  bio: true,
  createdAt: true,
  updatedAt: true,
  socialAccounts: true,
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });

    if (!user) return apiError("Usuário não encontrado", 404);
    return apiSuccess(user);
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
    if (currentUserId !== id) return apiError("Acesso negado", 403);

    const body = await request.json();
    const { name, avatarUrl, bio } = body;

    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(avatarUrl !== undefined && { avatarUrl }),
        ...(bio !== undefined && { bio }),
      },
      select: userSelect,
    });

    return apiSuccess(user);
  } catch (err) {
    return apiServerError(err);
  }
}
