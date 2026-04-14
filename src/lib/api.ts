import { NextResponse } from "next/server";

/**
 * Standard API response helper.
 * Ensures consistent response shape across all endpoints.
 */
export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ data, error: null }, { status });
}

export function apiError(message: string, status = 400) {
  return NextResponse.json({ data: null, error: message }, { status });
}

export function apiServerError(err: unknown) {
  const message = err instanceof Error ? err.message : "Erro interno do servidor";
  console.error("[API Error]", err);
  return NextResponse.json({ data: null, error: message }, { status: 500 });
}

/**
 * Parse pagination params from search params.
 * Defaults: page=1, limit=50, max limit=100
 */
export function parsePagination(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
) {
  return NextResponse.json({
    data,
    error: null,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
