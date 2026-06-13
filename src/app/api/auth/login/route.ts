import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiError, apiServerError, apiSuccess } from "@/lib/api";
import { hashPassword, isHashedPassword, verifyPassword } from "@/lib/password";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return apiError("Campos obrigatórios: email, password");
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !verifyPassword(password, user.password)) {
      return apiError("E-mail ou senha inválidos", 401);
    }

    if (!isHashedPassword(user.password)) {
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashPassword(password) },
      });
    }

    return apiSuccess({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
    });
  } catch (err) {
    return apiServerError(err);
  }
}
