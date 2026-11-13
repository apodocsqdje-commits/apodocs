import { prisma } from "../lib/prisma";


async function main() {
  console.log("🌱 Starting seed...");

  // Create Faculty: FPN
  const fpn = await prisma.faculty.create({
    data: {
      name: "Faculté Pluridisciplinaire de Nador",
      acronym: "FPN",
      departments: {
        create: [
          {
            name: "Informatique",
            subjects: {
              create: [
                {
                  name: "Programmation Web",
                  semester: 1,
                },
              ],
            },
          },
          {
            name: "Droit",
          },
        ],
      },
    },
  });

  console.log(`✅ Faculty created: ${fpn.name} (${fpn.acronym})`);
  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
