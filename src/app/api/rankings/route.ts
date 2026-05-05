import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiServerError, parsePagination, paginatedResponse } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "all_time";
    const { page, limit, skip } = parsePagination(searchParams);

    // Compute live from Clip aggregates — no stale snapshot.
    const clipWhere: Record<string, unknown> = {};
    if (period === "monthly") {
      const start = new Date();
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      clipWhere.publishedAt = { gte: start };
    }

    const grouped = await prisma.clip.groupBy({
      by: ["clipperId"],
      where: clipWhere,
      _sum: { views: true },
      _count: { _all: true },
      orderBy: { _sum: { views: "desc" } },
    });

    const clipperIds = grouped.map((g) => g.clipperId);
    const clippers = clipperIds.length
      ? await prisma.user.findMany({
          where: { id: { in: clipperIds }, role: "clipper" },
          select: { id: true, name: true, avatarUrl: true },
        })
      : [];
    const byId = new Map(clippers.map((c) => [c.id, c]));

    const rows = grouped
      .filter((g) => byId.has(g.clipperId))
      .map((g, i) => {
        const totalViews = g._sum.views ?? 0;
        const totalClips = g._count._all;
        const rankPosition = i + 1;
        const badge =
          rankPosition === 1 ? "top1" :
          rankPosition <= 3 ? "top3" :
          rankPosition <= 10 ? "top10" : null;
        return {
          id: `${period}-${g.clipperId}`,
          totalViews,
          totalClips,
          rankPosition,
          badge,
          platform: null as string | null,
          period,
          clipper: byId.get(g.clipperId)!,
        };
      });

    const total = rows.length;
    const slice = rows.slice(skip, skip + limit);
    return paginatedResponse(slice, total, page, limit);
  } catch (err) {
    return apiServerError(err);
  }
}
