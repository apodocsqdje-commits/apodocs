import { config } from "dotenv";
config();

function parseConnectionString(rawUrl: string | undefined) {
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

const cfg = parseConnectionString(process.env.DATABASE_URL);
console.log("Parsed config:", { ...cfg, password: cfg.password ? "[SET]" : "MISSING" });
console.log("Password value:", cfg.password);

// Test with pg directly
import pkg from "pg";
const { Pool } = pkg;
const pool = new Pool({ ...cfg, max: 1, connectionTimeoutMillis: 10000 });

async function test() {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT NOW()");
    console.log("✅ DB Connection works! Time:", result.rows[0].now);
    client.release();
  } catch (err) {
    console.error("❌ Connection failed:", err instanceof Error ? err.message : err);
  } finally {
    await pool.end();
  }
}

test();
