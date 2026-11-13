import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { NADOR_FACULTIES } from "@/lib/nadorData";

/**
 * Standard field selection for DocumentCard to avoid fetching
 * unneeded columns (like realName, uploaderToken, fileHash) over the wire.
 */
export const documentCardSelect = {
  id: true,
  title: true,
  type: true,
  fileUrl: true,
  status: true,
  authorName: true,
  likes: true,
  createdAt: true,
  subject: {
    select: {
      name: true,
      semester: true,
      department: {
        select: {
          name: true,
          faculty: {
            select: {
              name: true,
              acronym: true,
            },
          },
        },
      },
    },
  },
} as const;

/**
 * Cached approved documents count for homepage and badges.
 * Revalidates every 60s or on demand via 'documents' tag.
 */
export const getCachedApprovedCount = unstable_cache(
  async (): Promise<number> => {
    try {
      return await prisma.document.count({
        where: { status: "APPROVED" },
      });
    } catch (error) {
      console.error("Error fetching cached approved count:", error);
      return 0;
    }
  },
  ["approved-documents-count"],
  {
    revalidate: 60,
    tags: ["documents", "documents-count"],
  }
);

/**
 * Cached featured documents for the homepage.
 * Revalidates every 60s or on demand via 'documents' tag.
 */
export const getCachedFeaturedDocuments = unstable_cache(
  async (limit: number = 6) => {
    try {
      return await prisma.document.findMany({
        where: { status: "APPROVED" },
        orderBy: [
          { likes: "desc" },
          { createdAt: "desc" },
        ],
        take: limit,
        select: documentCardSelect,
      });
    } catch (error) {
      console.error("Error fetching cached featured documents:", error);
      return [];
    }
  },
  ["featured-documents"],
  {
    revalidate: 60,
    tags: ["documents", "featured-documents"],
  }
);

/**
 * Cached counts of approved documents per faculty.
 * Prevents 4 separate queries on every visit to /faculties.
 * Revalidates every 120s or on demand via 'documents' tag.
 */
export const getCachedFacultyCounts = unstable_cache(
  async (): Promise<Record<string, number>> => {
    try {
      const counts: Record<string, number> = {};

      await Promise.all(
        NADOR_FACULTIES.map(async (faculty) => {
          try {
            const count = await prisma.document.count({
              where: {
                status: "APPROVED",
                subject: {
                  department: {
                    faculty: {
                      acronym: faculty.id,
                    },
                  },
                },
              },
            });
            counts[faculty.id] = count;
          } catch {
            counts[faculty.id] = 0;
          }
        })
      );

      return counts;
    } catch (error) {
      console.error("Error fetching cached faculty counts:", error);
      return {};
    }
  },
  ["faculty-document-counts"],
  {
    revalidate: 120,
    tags: ["documents", "faculty-counts"],
  }
);
