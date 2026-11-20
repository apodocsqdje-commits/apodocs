import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import DocumentsExplorerView from "@/components/DocumentsExplorerView";
import { DocumentGridSkeleton } from "@/components/DocumentCardSkeleton";
import { prisma } from "@/lib/prisma";
import { NADOR_FACULTIES } from "@/lib/nadorData";
import { Prisma, DocType } from "@prisma/client";
import { unstable_cache } from "next/cache";
import type { DocumentCardItem } from "@/components/DocumentCard";

type SearchParamsPromise = Promise<{
  search?: string;
  faculty?: string;
  filiere?: string;
  semester?: string;
  module?: string;
  type?: string;
  page?: string;
}>;

interface PageProps {
  searchParams: SearchParamsPromise;
}

// The results depend on per-request search params, so the route itself stays
// dynamic. The (expensive) database query is cached separately below.
export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;
const VALID_DOC_TYPES: readonly DocType[] = ["COURSE", "EXAM", "TD_TP", "SUMMARY"];

/**
 * Filters are kept as plain primitives so they can be used as cache-key parts
 * by `unstable_cache` (objects/SQL fragments would not serialize well).
 */
interface DocumentsQueryArgs {
  search: string;
  faculty: string;
  filiereName: string;
  semester: number | null;
  moduleName: string;
  docType: DocType | null;
  skip: number;
}

interface DocumentsQueryResult {
  totalCount: number;
  documents: DocumentCardItem[];
}

interface DocumentRow {
  id: string;
  title: string;
  type: string;
  fileUrl: string;
  status: string;
  authorName: string | null;
  likes: number;
  createdAt: Date;
  subjectName: string;
  subjectSemester: number;
  departmentName: string;
  facultyName: string;
  facultyAcronym: string;
  totalCount: number;
}

function resolveFiliereName(filiere: string): string {
  if (!filiere) return "";
  const found = NADOR_FACULTIES.flatMap((f) => f.filieres).find(
    (fil) => fil.id === filiere
  );
  return found?.name || filiere;
}

function parseSemester(value: string): number | null {
  if (!value) return null;
  const parsed = Number.parseInt(value.replace(/\D/g, ""), 10);
  return Number.isNaN(parsed) ? null : parsed;
}

/** Escape LIKE wildcards so user input is matched literally. */
function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, "\\$&");
}

/**
 * A single JOIN query replaces Prisma's default nested-relation loading,
 * which used to fan out into 4 separate round-trips (Document -> Subject ->
 * Department -> Faculty). On a remote/pooled database those round-trips are
 * what made every request slow.
 */
function buildWhereClause(args: DocumentsQueryArgs): Prisma.Sql {
  const conditions: Prisma.Sql[] = [Prisma.sql`d.status = 'APPROVED'`];

  if (args.search) {
    conditions.push(
      Prisma.sql`d.title ILIKE ${`%${escapeLike(args.search)}%`}`
    );
  }

  if (args.docType) {
    conditions.push(
      Prisma.sql`d.type = CAST(${args.docType} AS "DocType")`
    );
  }

  if (args.moduleName) {
    conditions.push(
      Prisma.sql`s.name ILIKE ${`%${escapeLike(args.moduleName)}%`}`
    );
  }

  if (args.semester !== null) {
    conditions.push(Prisma.sql`s.semester = ${args.semester}`);
  }

  if (args.filiereName) {
    conditions.push(
      Prisma.sql`dep.name ILIKE ${`%${escapeLike(args.filiereName)}%`}`
    );
  }

  if (args.faculty) {
    conditions.push(
      Prisma.sql`LOWER(f.acronym) = LOWER(${args.faculty})`
    );
  }

  return Prisma.join(conditions, " AND ");
}

function mapDocumentRow(row: DocumentRow): DocumentCardItem {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    fileUrl: row.fileUrl,
    status: row.status,
    authorName: row.authorName,
    likes: row.likes,
    createdAt: row.createdAt,
    subject: {
      name: row.subjectName,
      semester: row.subjectSemester,
      department: {
        name: row.departmentName,
        faculty: {
          name: row.facultyName,
          acronym: row.facultyAcronym,
        },
      },
    },
  };
}

async function queryDocumentsPage(
  args: DocumentsQueryArgs
): Promise<DocumentsQueryResult> {
  const whereClause = buildWhereClause(args);

  // `COUNT(*) OVER()` returns the filtered total in the same round-trip as the
  // page rows, removing the separate count query from the hot path.
  const rows = await prisma.$queryRaw<DocumentRow[]>(Prisma.sql`
    SELECT
      d.id,
      d.title,
      d.type::text AS "type",
      d."fileUrl" AS "fileUrl",
      d.status::text AS "status",
      d."authorName" AS "authorName",
      d.likes,
      d."createdAt" AS "createdAt",
      s.name AS "subjectName",
      s.semester AS "subjectSemester",
      dep.name AS "departmentName",
      f.name AS "facultyName",
      f.acronym AS "facultyAcronym",
      COUNT(*) OVER()::int AS "totalCount"
    FROM "Document" d
    INNER JOIN "Subject" s ON s.id = d."subjectId"
    INNER JOIN "Department" dep ON dep.id = s."departmentId"
    INNER JOIN "Faculty" f ON f.id = dep."facultyId"
    WHERE ${whereClause}
    ORDER BY d."createdAt" DESC, d.id DESC
    LIMIT ${PAGE_SIZE}
    OFFSET ${args.skip}
  `);

  if (rows.length > 0) {
    return {
      totalCount: rows[0].totalCount,
      documents: rows.map(mapDocumentRow),
    };
  }

  // Empty page (either no matches or a page past the end): we still need the
  // real total so pagination renders correctly.
  const [{ count }] = await prisma.$queryRaw<{ count: number }[]>(Prisma.sql`
    SELECT COUNT(*)::int AS count
    FROM "Document" d
    INNER JOIN "Subject" s ON s.id = d."subjectId"
    INNER JOIN "Department" dep ON dep.id = s."departmentId"
    INNER JOIN "Faculty" f ON f.id = dep."facultyId"
    WHERE ${whereClause}
  `);

  return { totalCount: count, documents: [] };
}

/**
 * Filter-only pages are cached for 30s (invalidated by the `documents` tag on
 * upload/approve/delete/like). Text searches bypass the cache because they can
 * generate an unbounded number of cache keys.
 */
const getCachedDocumentsPage = unstable_cache(
  queryDocumentsPage,
  ["documents-page"],
  {
    revalidate: 30,
    tags: ["documents"],
  }
);

async function DocumentsContent({ searchParams }: { searchParams: SearchParamsPromise }) {
  const resolvedParams = await searchParams;
  const search = typeof resolvedParams.search === "string" ? resolvedParams.search.trim() : "";
  const faculty = typeof resolvedParams.faculty === "string" ? resolvedParams.faculty.trim() : "";
  const filiere = typeof resolvedParams.filiere === "string" ? resolvedParams.filiere.trim() : "";
  const semester = typeof resolvedParams.semester === "string" ? resolvedParams.semester.trim() : "";
  const moduleName = typeof resolvedParams.module === "string" ? resolvedParams.module.trim() : "";
  const rawType = typeof resolvedParams.type === "string" ? resolvedParams.type.trim() : "";
  const pageRaw = typeof resolvedParams.page === "string" ? parseInt(resolvedParams.page, 10) : 1;
  const currentPage = !isNaN(pageRaw) && pageRaw > 0 ? pageRaw : 1;
  const skip = (currentPage - 1) * PAGE_SIZE;

  const docType = VALID_DOC_TYPES.includes(rawType as DocType)
    ? (rawType as DocType)
    : null;

  const queryArgs: DocumentsQueryArgs = {
    search,
    faculty,
    filiereName: resolveFiliereName(filiere),
    semester: parseSemester(semester),
    moduleName,
    docType,
    skip,
  };

  let totalCount = 0;
  let documents: DocumentCardItem[] = [];

  try {
    // Text search is never cached; filter-only pages use the shared cache.
    const result = search
      ? await queryDocumentsPage(queryArgs)
      : await getCachedDocumentsPage(queryArgs);
    totalCount = result.totalCount;
    documents = result.documents;
  } catch (err) {
    console.error("Documents query error:", err);
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const hasFiltersApplied = Boolean(
    search || faculty || filiere || semester || moduleName || docType
  );

  return (
    <DocumentsExplorerView
      documents={documents}
      totalCount={totalCount}
      currentPage={currentPage}
      totalPages={totalPages}
      pageSize={PAGE_SIZE}
      hasFiltersApplied={hasFiltersApplied}
    />
  );
}

export default function DocumentsPage({ searchParams }: PageProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <Suspense
        fallback={
          <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            <div className="flex flex-col lg:flex-row items-start gap-8">
              <div className="w-full lg:w-72 xl:w-80 shrink-0 h-96 bg-white rounded-2xl border border-gray-200 animate-pulse" />
              <div className="flex-1 w-full min-w-0">
                <DocumentGridSkeleton count={6} />
              </div>
            </div>
          </main>
        }
      >
        <DocumentsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
