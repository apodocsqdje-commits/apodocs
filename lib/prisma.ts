import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { pool } from "@/lib/dbPool";

/**
 * Prisma Client singleton for write paths and admin queries. Read-only hot
 * paths use `lib/dbPool` directly, so they never pay Prisma's cold-start cost.
 * Attaching to globalThis avoids spawning multiple clients across hot reloads.
 */
interface GlobalPrismaContext {
  prisma: PrismaClient | undefined;
}

const globalForPrisma = globalThis as unknown as GlobalPrismaContext;

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });

globalForPrisma.prisma = prisma;
