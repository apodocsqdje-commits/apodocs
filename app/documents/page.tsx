import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import DocumentsExplorerView from "@/components/DocumentsExplorerView";
import { DocumentGridSkeleton } from "@/components/DocumentCardSkeleton";
import { NADOR_FACULTIES } from "@/lib/nadorData";
import type { DocType } from "@prisma/client";
import { unstable_cache } from "next/cache";
import type { DocumentCardItem } from "@/components/DocumentCard";
import {
  PAGE_SIZE,
  queryDocumentsPage,
  type DocumentsQueryArgs,
} from "@/lib/documentQueries";

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

const VALID_DOC_TYPES: readonly DocType[] = ["COURSE", "EXAM", "TD_TP", "SUMMARY"];

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
