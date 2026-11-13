import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

/**
 * Global singleton pattern for PrismaClient and pg Pool.
 * Attaching to globalThis ensures that across serverless hot reloads,
 * multiple imports, or container request handling (e.g. DigitalPlat, Docker),
 * we never spawn multiple connection pools that exhaust database connections.
 */
interface GlobalPrismaContext {
  prisma: PrismaClient | undefined;
  pgPool: Pool | undefined;
}

const globalForPrisma = globalThis as unknown as GlobalPrismaContext;

const connectionString = process.env.DATABASE_URL;
const isRemoteDb = Boolean(
  connectionString &&
    !connectionString.includes("localhost") &&
    !connectionString.includes("127.0.0.1")
);

// Connection pool configuration optimized for shared/container hosting
const maxPoolSize = process.env.PG_MAX_POOL
  ? parseInt(process.env.PG_MAX_POOL, 10)
  : 10;

const pool =
  globalForPrisma.pgPool ??
  new Pool({
    connectionString,
    max: maxPoolSize,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    ssl: isRemoteDb ? { rejectUnauthorized: false } : undefined,
  });

// Handle idle connection errors gracefully without crashing Node
pool.on("error", (err) => {
  console.error("Unexpected error on idle PostgreSQL pool client:", err);
});

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

// Always bind to globalThis to preserve singletons across all module re-evaluations
globalForPrisma.pgPool = pool;
globalForPrisma.prisma = prisma;
