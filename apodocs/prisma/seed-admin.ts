import "dotenv/config";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  const username = process.env.INITIAL_ADMIN_USERNAME || process.argv[2] || "admin";
  const password = process.env.INITIAL_ADMIN_PASSWORD || process.argv[3] || "admin123";

  console.log(`🔐 Creating or updating initial SUPER_ADMIN: "${username}"...`);

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.upsert({
    where: { username },
    update: {
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
    create: {
      username,
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
  });

  console.log(`✅ SUPER_ADMIN successfully configured!`);
  console.log(`👤 Username: ${admin.username}`);
  console.log(`🔑 Password: ${password}`);
  console.log(`🛡️ Role: ${admin.role}`);
}

main()
  .catch((e) => {
    console.error("❌ Failed to create initial SUPER_ADMIN:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
