import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiSuccess, apiError, apiServerError, parsePagination, paginatedResponse } from "@/lib/api";
import { hashPassword } from "@/lib/password";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const publicSelect = {
      id: true,
      email: true,
      name: true,
      role: true,
      avatarUrl: true,
      bio: true,
      createdAt: true,
      updatedAt: true,
    };

    if (email) {
      const users = await prisma.user.findMany({ where: { email }, select: publicSelect });
      return apiSuccess(users);
    }

    const { page, limit, skip } = parsePagination(searchParams);
    const [users, total] = await Promise.all([
      prisma.user.findMany({ skip, take: limit, orderBy: { createdAt: "desc" }, select: publicSelect }),
      prisma.user.count(),
    ]);

    return paginatedResponse(users, total, page, limit);
  } catch (err) {
    return apiServerError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, role, avatarUrl, bio, socialAccounts } = body;

    if (!email || !password || !name || !role) {
      return apiError("Campos obrigatórios: email, password, name, role");
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return apiError("E-mail já cadastrado", 409);
    }

    const user = await prisma.user.create({
      data: {
        email,
        password: hashPassword(password),
        name,
        role,
        avatarUrl: avatarUrl || null,
        bio: bio || null,
      },
    });

    if (socialAccounts && Array.isArray(socialAccounts)) {
      for (const account of socialAccounts) {
        await prisma.socialAccount.create({
          data: {
            userId: user.id,
            platform: account.platform,
            handle: account.handle,
            profileUrl: account.profileUrl,
            followers: account.followers || null,
          },
        });
      }
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return apiSuccess(safeUser, 201);
  } catch (err) {
    return apiServerError(err);
  }
}
