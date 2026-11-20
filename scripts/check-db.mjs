import { readFileSync } from "fs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";
const { Pool } = pkg;

// Load .env manually
const env = readFileSync(".env", "utf8");
let dbUrl = "";
for (const line of env.split("\n")) {
  if (line.startsWith("DATABASE_URL=")) {
    dbUrl = line.split("=").slice(1).join("=").trim().replace(/^"|"$/g, "");
    break;
  }
}

const pool = new Pool({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

console.log("=== FACULTIES ===");
const faculties = await prisma.faculty.findMany({ select: { name: true, acronym: true } });
console.log(JSON.stringify(faculties, null, 2));

console.log("\n=== DEPARTMENTS (first 15) ===");
const depts = await prisma.department.findMany({ select: { name: true }, take: 15 });
console.log(JSON.stringify(depts, null, 2));

console.log("\n=== DOCUMENTS count ===");
const total = await prisma.document.count();
const approved = await prisma.document.count({ where: { status: "APPROVED" } });
console.log("Total:", total, "| Approved:", approved);

await prisma.$disconnect();
await pool.end();
