import "dotenv/config";
import { prisma } from "../lib/prisma";

async function testTiming() {
  const faculty = "FSAN";
  const where = {
    status: "APPROVED" as const,
    subject: {
      department: {
        faculty: {
          acronym: {
            equals: faculty,
            mode: "insensitive" as const,
          },
        },
      },
    },
  };

  console.time("Prisma Count + FindMany");
  const [count, docs] = await Promise.all([
    prisma.document.count({ where }),
    prisma.document.findMany({
      where,
      take: 12,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
      },
    }),
  ]);
  console.timeEnd("Prisma Count + FindMany");
  console.log("Count:", count, "Docs length:", docs.length);
}

testTiming()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
