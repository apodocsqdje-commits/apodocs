import Link from "next/link";
import Navbar from "@/components/Navbar";
import DocumentFilter from "@/components/DocumentFilter";
import DocumentCard from "@/components/DocumentCard";
import MyUploadsSection from "@/components/MyUploadsSection";
import { prisma } from "@/lib/prisma";
import { NADOR_FACULTIES } from "@/lib/nadorData";
import { Prisma, DocType } from "@prisma/client";
import {
  FolderSearch,
  BookOpen,
  GraduationCap,
  Layers,
  FileCheck2,
  FileText,
  ExternalLink,
  Calendar,
  Building2,
  FolderTree,
  UploadCloud,
  CheckCircle2,
  RotateCcw,
  Eye,
  User,
} from "lucide-react";

interface DocTypeConfig {
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  icon: typeof BookOpen;
}

const docTypeConfigs: Record<DocType, DocTypeConfig> = {
  COURSE: {
    label: "Cours / Notes",
    badgeBg: "bg-blue-50",
    badgeText: "text-ump-blue",
    badgeBorder: "border-blue-200",
    icon: BookOpen,
  },
  EXAM: {
    label: "Examen / Past Paper",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-800",
    badgeBorder: "border-amber-200",
    icon: GraduationCap,
  },
  TD_TP: {
    label: "TD / TP / Travaux",
    badgeBg: "bg-purple-50",
    badgeText: "text-purple-800",
    badgeBorder: "border-purple-200",
    icon: Layers,
  },
  SUMMARY: {
    label: "Résumé / Cheatsheet",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-800",
    badgeBorder: "border-emerald-200",
    icon: FileCheck2,
  },
};

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
  // Step 2: Accept searchParams as a prop (Next.js 15+ Promise)
  const resolvedParams = await searchParams;
  const search = typeof resolvedParams.search === "string" ? resolvedParams.search.trim() : "";
  const faculty = typeof resolvedParams.faculty === "string" ? resolvedParams.faculty.trim() : "";
  const filiere = typeof resolvedParams.filiere === "string" ? resolvedParams.filiere.trim() : "";
  const semester = typeof resolvedParams.semester === "string" ? resolvedParams.semester.trim() : "";
  const moduleName = typeof resolvedParams.module === "string" ? resolvedParams.module.trim() : "";
  const docType = typeof resolvedParams.type === "string" ? resolvedParams.type.trim() : "";

  // Step 3: Build Prisma findMany query conditionally filtering by searchParams
  // Public search results must only display APPROVED documents
  const where: Prisma.DocumentWhereInput = {
    status: "APPROVED",
  };

  // Case-insensitive text search on document title
  if (search) {
    where.title = {
      contains: search,
      mode: "insensitive",
    };
  }

  // Filter by document type
  if (docType && ["COURSE", "EXAM", "TD_TP", "SUMMARY"].includes(docType)) {
    where.type = docType as DocType;
  }

  // Construct relational filters (Subject -> Department -> Faculty)
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

  // Query database
  let documents: any[] = [];
  try {
    documents = await prisma.document.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        subject: {
          include: {
            department: {
              include: {
                faculty: true,
              },
            },
          },
        },
      },
    });
  } catch (err) {
    console.error("Documents query error:", err);
  }

  const hasFiltersApplied = Boolean(
    search || faculty || filiere || semester || moduleName || docType
  );

  return (
    <div className="min-h-screen bg-ump-gray flex flex-col">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-ump-blue text-xs font-semibold mb-2">
              <FolderSearch className="w-3.5 h-3.5 text-ump-blue" />
              <span>Nador Academic Repository</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ump-dark tracking-tight">
              Documents Explorer
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Browse, filter, and download verified university course materials and past exams.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-ump-blue hover:bg-blue-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Document</span>
            </Link>
          </div>
        </div>

        {/* Step 4: Layout with Sticky Sidebar (Desktop) and Documents Grid */}
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* DocumentFilter Sticky Sidebar */}
          <DocumentFilter />

          {/* Results Area */}
          <div className="flex-1 w-full min-w-0">
            {/* Uploader's Pending and Approved Uploads */}
            <MyUploadsSection />

            {/* Results Status Bar */}
            <div className="flex items-center justify-between mb-4 pb-2">
              <p className="text-xs sm:text-sm font-semibold text-gray-700">
                Found{" "}
                <span className="text-ump-blue font-bold">{documents.length}</span>{" "}
                {documents.length === 1 ? "document" : "documents"}
                {hasFiltersApplied && (
                  <span className="text-gray-400 font-normal"> (filtered)</span>
                )}
              </p>

              {hasFiltersApplied && (
                <Link
                  href="/documents"
                  className="inline-flex items-center gap-1 text-xs font-medium text-ump-blue hover:underline"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Clear all filters</span>
                </Link>
              )}
            </div>

            {/* Empty States */}
            {documents.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-xs my-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-ump-blue flex items-center justify-center mx-auto mb-4 border border-blue-100">
                  <FileText className="w-7 h-7" />
                </div>
                {hasFiltersApplied ? (
                  <>
                    <h2 className="text-lg font-bold text-gray-900 mb-1">
                      No Documents Match Your Filters
                    </h2>
                    <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                      Try adjusting or clearing your search filters to find what you are looking for.
                    </p>
                    <Link
                      href="/documents"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs sm:text-sm font-semibold transition"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset All Filters</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <h2 className="text-lg font-bold text-gray-900 mb-1">
                      No Documents Uploaded Yet
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">
                      Be the first to share notes, exams, or summaries with students across Nador faculties!
                    </p>
                    <Link
                      href="/upload"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-ump-blue hover:bg-blue-800 text-white text-sm font-semibold shadow-sm transition"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>Upload Document</span>
                    </Link>
                  </>
                )}
              </div>
            ) : (
              /* Rich Document Cards Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {documents.map((doc) => (
                  <DocumentCard key={doc.id} document={doc} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
