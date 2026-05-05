import { NextRequest, NextResponse } from "next/server";
import { buildAuthorizeUrl } from "@/lib/instagram";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  try {
    const state = encodeURIComponent(JSON.stringify({ userId, n: crypto.randomUUID() }));
    return NextResponse.redirect(buildAuthorizeUrl(state));
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
