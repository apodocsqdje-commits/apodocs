/**
 * Full seed script: populates Faculty → Department → Subject
 * from NADOR_FACULTIES (nadorData.ts) into the database.
 *
 * Run with:  npm run seed:full
 * or:        npx tsx prisma/seed-full.ts
 */

// dotenv/config must be first import so DATABASE_URL is set
// before lib/prisma.ts Pool is instantiated
import "dotenv/config";

import { prisma } from "../lib/prisma";
import { NADOR_FACULTIES } from "../lib/nadorData";

async function main() {
  console.log("🌱 Starting full seed from nadorData...\n");

  for (const faculty of NADOR_FACULTIES) {
    // Find or create faculty by acronym
    const existingFaculty = await prisma.faculty.findFirst({
      where: { acronym: faculty.id },
    });
    const dbFaculty = existingFaculty
      ? await prisma.faculty.update({
          where: { id: existingFaculty.id },
          data: { name: faculty.name },
        })
      : await prisma.faculty.create({
          data: { name: faculty.name, acronym: faculty.id },
        });
    console.log(`✅ Faculty: ${dbFaculty.name} (${dbFaculty.acronym})`);

    for (const filiere of faculty.filieres) {
      // Upsert department by name + facultyId
      const existingDept = await prisma.department.findFirst({
        where: { name: filiere.name, facultyId: dbFaculty.id },
      });

      const dbDept = existingDept
        ? await prisma.department.update({
            where: { id: existingDept.id },
            data: { name: filiere.name },
          })
        : await prisma.department.create({
            data: { name: filiere.name, facultyId: dbFaculty.id },
          });

      console.log(`  📁 Department: ${dbDept.name}`);

      for (const semester of filiere.semesters) {
        const semesterNumber = parseInt(semester.id.replace(/\D/g, ""), 10);
        if (isNaN(semesterNumber)) continue;

        for (const moduleName of semester.modules) {
          // Upsert subject by name + semester + departmentId
          const existing = await prisma.subject.findFirst({
            where: {
              name: moduleName,
              semester: semesterNumber,
              departmentId: dbDept.id,
            },
          });

          if (!existing) {
            await prisma.subject.create({
              data: {
                name: moduleName,
                semester: semesterNumber,
                departmentId: dbDept.id,
              },
            });
          }
        }
        console.log(
          `    📚 Semester ${semester.id}: ${semester.modules.length} modules seeded`
        );
      }
    }
    console.log("");
  }

  // Summary
  const facultyCount = await prisma.faculty.count();
  const deptCount = await prisma.department.count();
  const subjectCount = await prisma.subject.count();

  console.log("🎉 Seed completed!");
  console.log(`   Faculties:   ${facultyCount}`);
  console.log(`   Departments: ${deptCount}`);
  console.log(`   Subjects:    ${subjectCount}`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
