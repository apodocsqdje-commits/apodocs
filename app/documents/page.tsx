import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import DocumentsExplorerView from "@/components/DocumentsExplorerView";
import { DocumentGridSkeleton } from "@/components/DocumentCardSkeleton";
import { prisma } from "@/lib/prisma";
import { NADOR_FACULTIES } from "@/lib/nadorData";
import { Prisma, DocType } from "@prisma/client";
import { documentCardSelect } from "@/lib/cachedData";

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

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

async function DocumentsContent({ searchParams }: { searchParams: SearchParamsPromise }) {
  const resolvedParams = await searchParams;
  const search = typeof resolvedParams.search === "string" ? resolvedParams.search.trim() : "";
  const faculty = typeof resolvedParams.faculty === "string" ? resolvedParams.faculty.trim() : "";
  const filiere = typeof resolvedParams.filiere === "string" ? resolvedParams.filiere.trim() : "";
  const semester = typeof resolvedParams.semester === "string" ? resolvedParams.semester.trim() : "";
  const moduleName = typeof resolvedParams.module === "string" ? resolvedParams.module.trim() : "";
  const docType = typeof resolvedParams.type === "string" ? resolvedParams.type.trim() : "";
  const pageRaw = typeof resolvedParams.page === "string" ? parseInt(resolvedParams.page, 10) : 1;
  const currentPage = !isNaN(pageRaw) && pageRaw > 0 ? pageRaw : 1;
  const skip = (currentPage - 1) * PAGE_SIZE;

  // Public search results must only display APPROVED documents
  const where: Prisma.DocumentWhereInput = {
    status: "APPROVED",
  };

  if (search) {
    where.title = {
      contains: search,
      mode: "insensitive",
    };
  }

  if (docType && ["COURSE", "EXAM", "TD_TP", "SUMMARY"].includes(docType)) {
    where.type = docType as DocType;
  }

  const subjectWhere: Prisma.SubjectWhereInput = {};

  if (moduleName) {
    subjectWhere.name = {
      contains: moduleName,
      mode: "insensitive",
    };
  }

  if (semester) {
    const semNumber = parseInt(semester.replace(/\D/g, ""), 10);
    if (!isNaN(semNumber)) {
      subjectWhere.semester = semNumber;
    }
  }

  const departmentWhere: Prisma.DepartmentWhereInput = {};

  if (filiere) {
    const foundFiliere = NADOR_FACULTIES.flatMap((f) => f.filieres).find(
      (fil) => fil.id === filiere
    );
    const targetFiliereName = foundFiliere?.name || filiere;
    departmentWhere.name = {
      contains: targetFiliereName,
      mode: "insensitive",
    };
  }

  if (faculty) {
    departmentWhere.faculty = {
      acronym: {
        equals: faculty,
        mode: "insensitive",
      },
    };
  }

  if (Object.keys(departmentWhere).length > 0) {
    subjectWhere.department = departmentWhere;
  }

  if (Object.keys(subjectWhere).length > 0) {
    where.subject = subjectWhere;
  }

  let totalCount = 0;
  let documents: any[] = [];

  try {
    const [countResult, docsResult] = await Promise.all([
      prisma.document.count({ where }),
      prisma.document.findMany({
        where,
        skip,
        take: PAGE_SIZE,
        orderBy: {
          createdAt: "desc",
        },
        select: documentCardSelect,
      }),
    ]);
    totalCount = countResult;
    documents = docsResult;
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

export default async function DocumentsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <Suspense
        key={JSON.stringify(resolvedParams)}
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
