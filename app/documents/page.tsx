import Navbar from "@/components/Navbar";
import DocumentsExplorerView from "@/components/DocumentsExplorerView";
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
}>;

interface PageProps {
  searchParams: SearchParamsPromise;
}

export const dynamic = "force-dynamic";

export default async function DocumentsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const search = typeof resolvedParams.search === "string" ? resolvedParams.search.trim() : "";
  const faculty = typeof resolvedParams.faculty === "string" ? resolvedParams.faculty.trim() : "";
  const filiere = typeof resolvedParams.filiere === "string" ? resolvedParams.filiere.trim() : "";
  const semester = typeof resolvedParams.semester === "string" ? resolvedParams.semester.trim() : "";
  const moduleName = typeof resolvedParams.module === "string" ? resolvedParams.module.trim() : "";
  const docType = typeof resolvedParams.type === "string" ? resolvedParams.type.trim() : "";

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

  let documents: any[] = [];
  try {
    documents = await prisma.document.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      select: documentCardSelect,
    });
  } catch (err) {
    console.error("Documents query error:", err);
  }

  const hasFiltersApplied = Boolean(
    search || faculty || filiere || semester || moduleName || docType
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <DocumentsExplorerView
        documents={documents}
        hasFiltersApplied={hasFiltersApplied}
      />
    </div>
  );
}
