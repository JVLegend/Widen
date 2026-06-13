import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, apiServerError, requireCurrentUser } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) return apiError("userId é obrigatório");

    const accounts = await prisma.socialAccount.findMany({ where: { userId } });
    return apiSuccess(accounts);
  } catch (err) {
    return apiServerError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUserId = requireCurrentUser(request);
    if (currentUserId instanceof Response) return currentUserId;

    const body = await request.json();
    const { userId, platform, handle, profileUrl, followers } = body;

    if (!userId || !platform || !handle || !profileUrl) {
      return apiError("Campos obrigatórios: userId, platform, handle, profileUrl");
    }
    if (currentUserId !== userId) return apiError("Acesso negado", 403);

    const account = await prisma.socialAccount.create({
      data: { userId, platform, handle, profileUrl, followers: followers || null },
    });

    return apiSuccess(account, 201);
  } catch (err) {
    return apiServerError(err);
  }
}
