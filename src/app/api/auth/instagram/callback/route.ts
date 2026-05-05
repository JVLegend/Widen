import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { exchangeCode, fetchProfile } from "@/lib/instagram";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const stateRaw = searchParams.get("state");
  const error = searchParams.get("error");

  if (error) return NextResponse.redirect(`${origin}/en/creator/social-accounts?ig=error&reason=${encodeURIComponent(error)}`);
  if (!code || !stateRaw) return NextResponse.redirect(`${origin}/en/creator/social-accounts?ig=error&reason=missing_code`);

  let userId: string | null = null;
  try { userId = JSON.parse(decodeURIComponent(stateRaw)).userId; } catch { /* noop */ }
  if (!userId) return NextResponse.redirect(`${origin}/en/creator/social-accounts?ig=error&reason=bad_state`);

  try {
    const tokens = await exchangeCode(code);
    const profile = await fetchProfile(tokens.longLivedToken);

    const profileUrl = `https://instagram.com/${profile.username}`;

    const existing = await prisma.socialAccount.findFirst({
      where: { userId, platform: "instagram", handle: profile.username },
    });

    if (existing) {
      await prisma.socialAccount.update({
        where: { id: existing.id },
        data: { followers: profile.followers, profileUrl },
      });
    } else {
      await prisma.socialAccount.create({
        data: {
          userId,
          platform: "instagram",
          handle: profile.username,
          profileUrl,
          followers: profile.followers,
        },
      });
    }

    return NextResponse.redirect(`${origin}/en/creator/social-accounts?ig=connected`);
  } catch (err) {
    console.error("[ig oauth callback]", err);
    return NextResponse.redirect(`${origin}/en/creator/social-accounts?ig=error&reason=exchange_failed`);
  }
}
