import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Fake seed users to remove. Anything created in prod (unknown emails) is preserved.
const FAKE_EMAILS = [
  // Churches (fake demo)
  "faith@example.com",
  "livingwater@example.com",
  "harvest@example.com",
  "newlife@example.com",
  "refuge@example.com",
  "cariani@widen.com",
  // Creators (fake demo)
  "daniel@example.com",
  "emily@example.com",
  "michael@example.com",
  "rachel@example.com",
  "joshua@example.com",
  "hannah@example.com",
  "caleb@example.com",
  "grace.lee@example.com",
  "nathan@example.com",
  "olivia@example.com",
  "maria.tela@widen.com",
  "joao.tela@widen.com",
];

async function main() {
  console.log("Cleanup: removing fake seed users + their content...");

  const fakeUsers = await prisma.user.findMany({
    where: { email: { in: FAKE_EMAILS } },
    select: { id: true, email: true, name: true },
  });
  console.log(`  found ${fakeUsers.length} fake users to delete`);

  const fakeIds = fakeUsers.map((u) => u.id);

  // Wipe rankings entirely (they're aggregate snapshots and reference fake creators)
  const r = await prisma.ranking.deleteMany();
  console.log(`  deleted ${r.count} ranking rows`);

  // Delete fake users — cascades to videos, campaigns, clips, social accounts
  const u = await prisma.user.deleteMany({ where: { id: { in: fakeIds } } });
  console.log(`  deleted ${u.count} fake users (cascades to their content)`);

  // Find currently paused campaigns belonging to remaining users — caller said the only paused mission is fake
  const paused = await prisma.campaign.findMany({
    where: { status: "paused" },
    select: { id: true, name: true, influencer: { select: { email: true } } },
  });
  console.log(`  paused missions remaining: ${paused.length}`);
  paused.forEach((p) => console.log(`    - "${p.name}" (owner: ${p.influencer.email})`));
  if (paused.length > 0) {
    const d = await prisma.campaign.deleteMany({ where: { status: "paused" } });
    console.log(`  deleted ${d.count} paused mission(s)`);
  }

  // Rebuild rankings from remaining (real) users' clips
  const realClippers = await prisma.user.findMany({
    where: { role: "clipper" },
    select: { id: true, name: true },
  });

  const rankingRows: { clipperId: string; totalViews: number; totalClips: number; rankPosition: number; badge: string | null }[] = [];
  for (const c of realClippers) {
    const agg = await prisma.clip.aggregate({
      where: { clipperId: c.id },
      _sum: { views: true },
      _count: { _all: true },
    });
    const totalViews = agg._sum.views || 0;
    const totalClips = agg._count._all || 0;
    if (totalClips === 0) continue;
    rankingRows.push({ clipperId: c.id, totalViews, totalClips, rankPosition: 0, badge: null });
  }
  rankingRows.sort((a, b) => b.totalViews - a.totalViews);
  rankingRows.forEach((row, i) => {
    row.rankPosition = i + 1;
    row.badge = i === 0 ? "top1" : i < 3 ? "top3" : i < 10 ? "top10" : null;
  });

  if (rankingRows.length > 0) {
    const periodDate = new Date();
    periodDate.setDate(1);
    await prisma.ranking.createMany({
      data: [
        ...rankingRows.map((r) => ({ ...r, period: "all_time" as const })),
        ...rankingRows.map((r) => ({ ...r, period: "monthly" as const, periodDate })),
      ],
    });
    console.log(`  rebuilt ${rankingRows.length * 2} ranking rows from real clippers`);
  } else {
    console.log("  no real clippers with clips — ranking left empty");
  }

  // Summary
  const remaining = await prisma.user.findMany({ select: { email: true, name: true, role: true } });
  console.log("\nRemaining users:");
  remaining.forEach((u) => console.log(`  ${u.role.padEnd(10)} ${u.email.padEnd(40)} ${u.name}`));
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
