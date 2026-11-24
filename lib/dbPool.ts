import { Pool } from "pg";

/**
 * Shared PostgreSQL pool used by both Prisma's adapter and the raw read paths.
 * Kept in its own module so hot read routes can import `pg` without importing
 * (or constructing) Prisma Client at all.
 */

interface GlobalPoolContext {
  pgPool: Pool | undefined;
}

const globalForPool = globalThis as unknown as GlobalPoolContext;

/** Decode percent-encoded characters (e.g. %40 → @) before parsing the URL. */
function cleanUrl(url: string | undefined): string {
  if (!url) return "";
  let cleaned = url.trim();
  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  return cleaned;
}

function parseConnectionString(rawUrl: string | undefined): {
  connectionString?: string;
  user?: string;
  password?: string;
  host?: string;
  port?: number;
  database?: string;
  ssl?: boolean | object;
} {
  const cleaned = cleanUrl(rawUrl);
  if (!cleaned) return {};
  try {
    const u = new URL(cleaned);
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
    return { connectionString: cleaned };
  }
}

function createPool(): Pool {
  const rawUrl = cleanUrl(process.env.DATABASE_URL || process.env.DIRECT_URL);

  if (!rawUrl) {
    console.error(
      "[db] DATABASE_URL is not set in environment variables. Database queries will fail."
    );
    const dummyPool = new Pool({
      connectionTimeoutMillis: 500,
      host: "unconfigured-database-url.invalid",
    });
    dummyPool.on("error", () => {});
    return dummyPool;
  }

  const dbConfig = parseConnectionString(rawUrl);

  const configuredPoolSize = Number.parseInt(process.env.PG_MAX_POOL ?? "", 10);
  const maxPoolSize =
    Number.isFinite(configuredPoolSize) && configuredPoolSize > 0
      ? Math.min(configuredPoolSize, 50)
      : 10;

  const p = new Pool({
    ...dbConfig,
    max: maxPoolSize,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 20000,
    // Remote poolers (Supabase/PgBouncer) drop idle sockets; keep-alive avoids
    // waiting for the OS TCP timeout on the next query.
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
    application_name: "apodocs",
  });

  p.on("error", (err) => {
    console.error("Unexpected error on idle PostgreSQL pool client:", err);
  });

  return p;
}

export const pool = globalForPool.pgPool ?? createPool();
// Always bind to globalThis so every module graph (RSC, server actions, route
// handlers) reuses the same pool instead of creating a new one per import.
globalForPool.pgPool = pool;
