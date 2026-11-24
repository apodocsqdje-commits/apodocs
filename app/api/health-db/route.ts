import { NextResponse } from "next/server";
import { pool } from "@/lib/dbPool";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const envCheck = {
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    databaseUrlHost: process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL.trim().replace(/^["']|["']$/g, "")).hostname : null,
    databaseUrlPort: process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL.trim().replace(/^["']|["']$/g, "")).port : null,
    hasDirectUrl: Boolean(process.env.DIRECT_URL),
    hasJwtSecret: Boolean(process.env.JWT_SECRET),
    nodeEnv: process.env.NODE_ENV,
    isVercel: Boolean(process.env.VERCEL),
  };

  const startTime = Date.now();
  try {
    // 1. Test direct pool query
    const poolRes = await pool.query("SELECT 1 AS pool_check, current_database() AS db_name, current_user AS db_user");
    const poolLatency = Date.now() - startTime;

    // 2. Test Prisma query
    const prismaStartTime = Date.now();
    const adminCount = await prisma.admin.count();
    const prismaLatency = Date.now() - prismaStartTime;

    return NextResponse.json({
      status: "ok",
      env: envCheck,
      pool: {
        success: true,
        latencyMs: poolLatency,
        data: poolRes.rows[0],
      },
      prisma: {
        success: true,
        latencyMs: prismaLatency,
        adminCount,
      },
    });
  } catch (error) {
    const errorLatency = Date.now() - startTime;
    return NextResponse.json(
      {
        status: "error",
        env: envCheck,
        latencyMs: errorLatency,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
