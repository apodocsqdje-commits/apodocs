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

// Decode percent-encoded characters in the connection string (e.g. %40 → @)
// so that pg Pool correctly parses the password.
// Returns separate config object to avoid URL class re-encoding issue.
function parseConnectionString(rawUrl: string | undefined): {
  connectionString?: string;
  user?: string;
  password?: string;
  host?: string;
  port?: number;
  database?: string;
  ssl?: boolean | object;
} {
  if (!rawUrl) return {};
  try {
    const u = new URL(rawUrl);
    const password = decodeURIComponent(u.password);
    const user = decodeURIComponent(u.username);
    const host = u.hostname;
    const port = u.port ? parseInt(u.port, 10) : 5432;
    const database = u.pathname.replace(/^\//, "");
    const isRemote = !host.includes("localhost") && !host.includes("127.0.0.1");
    return {
      user,
      password,
      host,
      port,
      database,
      ssl: isRemote ? { rejectUnauthorized: false } : undefined,
    };
  } catch {
    return { connectionString: rawUrl };
  }
}

function createPool(): Pool {
  const rawUrl = process.env.DATABASE_URL;
  const dbConfig = parseConnectionString(rawUrl);

  const configuredPoolSize = Number.parseInt(process.env.PG_MAX_POOL ?? "", 10);
  const maxPoolSize =
    Number.isFinite(configuredPoolSize) && configuredPoolSize > 0
      ? Math.min(configuredPoolSize, 50)
      : 10;

  if (!rawUrl) {
    console.error(
      "[prisma] DATABASE_URL is not set. Database queries will fail."
    );
  }

  const p = new Pool({
    ...dbConfig,
    max: maxPoolSize,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    // Keep TCP connections warm. Remote poolers (e.g. Supabase/PgBouncer)
    // silently drop idle sockets; without keep-alive the next query can stall
    // until the OS TCP timeout.
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
    application_name: "apodocs",
  });

  p.on("error", (err) => {
    console.error("Unexpected error on idle PostgreSQL pool client:", err);
  });

  return p;
}

const pool = globalForPrisma.pgPool ?? createPool();
// Always bind to globalThis so every module graph (RSC, server actions, route
// handlers) reuses the same pool instead of creating a new one per import.
globalForPrisma.pgPool = pool;

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
