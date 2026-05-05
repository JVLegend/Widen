import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const creators = [
    {
      email: "creator1@widen.com",
      password: "123456",
      name: "Test Creator 1",
      role: "clipper",
      avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=creator1",
      bio: "Test creator account for QA.",
    },
    {
      email: "creator2@widen.com",
      password: "123456",
      name: "Test Creator 2",
      role: "clipper",
      avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=creator2",
      bio: "Test creator account for QA.",
    },
  ];

  for (const c of creators) {
    const existing = await prisma.user.findUnique({ where: { email: c.email } });
    if (existing) {
      console.log(`  skip: ${c.email} already exists`);
      continue;
    }
    const u = await prisma.user.create({ data: c });
    console.log(`  created: ${u.email} (${u.id})`);
  }

  const all = await prisma.user.findMany({ select: { email: true, name: true, role: true } });
  console.log("\nAll users:");
  all.forEach((u) => console.log(`  ${u.role.padEnd(10)} ${u.email.padEnd(35)} ${u.name}`));
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
