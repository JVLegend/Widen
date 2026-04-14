import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiServerError } from "@/lib/api";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.socialAccount.delete({ where: { id } });
    return apiSuccess({ deleted: true });
  } catch (err) {
    return apiServerError(err);
  }
}
