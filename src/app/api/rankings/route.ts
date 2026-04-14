import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiServerError, parsePagination, paginatedResponse } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "all_time";

    const where: Record<string, unknown> = { period };

    const { page, limit, skip } = parsePagination(searchParams);
    const [rankings, total] = await Promise.all([
      prisma.ranking.findMany({
        where,
        skip,
        take: limit,
        include: {
          clipper: { select: { id: true, name: true, avatarUrl: true } },
        },
        orderBy: { totalViews: "desc" },
      }),
      prisma.ranking.count({ where }),
    ]);

    return paginatedResponse(rankings, total, page, limit);
  } catch (err) {
    return apiServerError(err);
  }
}
