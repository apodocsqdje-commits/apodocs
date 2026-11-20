import "dotenv/config";
import pkg from "pg";
const { Pool } = pkg;
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

try {
  console.log("1. Finding admin...");
  const admin = await prisma.admin.findUnique({
    where: { username: "admin" },
    select: { id: true, username: true, password: true, role: true },
  });
  console.log("Admin found:", admin);

  console.log("2. Counting documents...");
  const docCount = await prisma.document.count();
  console.log("Doc count:", docCount);
} catch (err) {
  console.error("Query failed:", err);
} finally {
  await prisma.$disconnect();
  await pool.end();
}
