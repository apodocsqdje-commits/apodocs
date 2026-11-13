import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import LikeButton from "@/components/LikeButton";
import {
  ArrowLeft,
  Download,
  ExternalLink,
  BookOpen,
  GraduationCap,
  Layers,
  FileCheck2,
  Building2,
  Calendar,
  User,
} from "lucide-react";

type DocType = "COURSE" | "EXAM" | "TD_TP" | "SUMMARY";

interface DocTypeConfig {
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  icon: typeof BookOpen;
}

const docTypeConfigs: Record<DocType, DocTypeConfig> = {
  COURSE: {
    label: "Cours",
    badgeBg: "bg-blue-50",
    badgeText: "text-ump-blue",
    badgeBorder: "border-blue-200",
    icon: BookOpen,
  },
  EXAM: {
    label: "Examen",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-800",
    badgeBorder: "border-amber-200",
    icon: GraduationCap,
  },
  TD_TP: {
    label: "TD / TP",
    badgeBg: "bg-purple-50",
    badgeText: "text-purple-800",
    badgeBorder: "border-purple-200",
    icon: Layers,
  },
  SUMMARY: {
    label: "Résumé",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-800",
    badgeBorder: "border-emerald-200",
    icon: FileCheck2,
  },
};

type PageParams = Promise<{
  id: string;
}>;

interface DocumentViewerPageProps {
  params: PageParams;
}



export const dynamic = "force-dynamic";

export default async function DocumentViewerPage({ params }: DocumentViewerPageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const document = await prisma.document.findUnique({
    where: { id },
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

  if (!document) {
    notFound();
  }

  const faculty = document.subject?.department?.faculty;
  const department = document.subject?.department;
  const subject = document.subject;

  const typeConfig =
    docTypeConfigs[document.type as DocType] || docTypeConfigs.COURSE;
  const TypeIcon = typeConfig.icon;

  const formattedDate = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(document.createdAt));

  // Detect image files vs PDFs
  const isPdf = /\.pdf($|\?)/i.test(document.fileUrl);
  const isImage =
    !isPdf &&
    (/\.(png|jpe?g|webp|gif|svg)($|\?)/i.test(document.fileUrl) ||
      document.fileUrl.includes("/image/upload/"));

  return (
    // Step 1: Strictly full-height, overflow-hidden container
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50">
      {/* Step 2: Clean top header */}
      <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-white border-b border-gray-200 shadow-sm shrink-0 z-10">
        {/* Left: Back button, divider, and document breadcrumbs */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <Link
            href="/documents"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 hover:text-ump-blue hover:bg-blue-50 border border-gray-200 transition-colors shrink-0 cursor-pointer"
            title="Back to Documents"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Link>

          <div className="h-6 w-px bg-gray-200 hidden sm:block shrink-0" />

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1
                className="text-sm sm:text-base font-bold text-gray-900 truncate"
                title={document.title}
              >
                {document.title}
              </h1>

              <span
                className={`hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 ${typeConfig.badgeBg} ${typeConfig.badgeText} ${typeConfig.badgeBorder}`}
              >
                <TypeIcon className="w-3 h-3" />
                <span>{typeConfig.label}</span>
              </span>
            </div>

            {/* Breadcrumbs */}
            <div className="flex items-center gap-1.5 text-xs text-gray-500 truncate pt-0.5">
              <Building2 className="w-3 h-3 text-gray-400 shrink-0" />
              <span className="font-semibold text-gray-700">
                {faculty?.acronym || "UMP"}
              </span>
              <span>/</span>
              <span className="truncate">{department?.name}</span>
              {subject?.semester && (
                <>
                  <span>/</span>
                  <span className="font-semibold text-ump-blue">
                    S{subject.semester}
                  </span>
                </>
              )}
              {subject?.name && (
                <>
                  <span>•</span>
                  <span className="font-medium text-gray-800 truncate">
                    {subject.name}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Like Button */}
          <LikeButton
            documentId={document.id}
            initialLikes={document.likes || 0}
            size="sm"
            showLabel={true}
          />

          {/* Public Author Pseudonym */}
          <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-gray-700 bg-gray-50 border border-gray-200/80 px-2.5 py-1.5 rounded-lg mr-1">
            <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="text-gray-500 font-normal">Auteur :</span>
            <span className="font-semibold text-gray-900 truncate max-w-[150px]">
              {document.authorName || "طالب"}
            </span>
          </span>

          <span className="hidden xl:inline-flex items-center gap-1 text-xs text-gray-400 mr-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </span>

          <a
            href={document.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 sm:px-3 sm:py-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200 transition-colors text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            title="Open original file in new tab"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden md:inline">Open in Tab</span>
          </a>

          <a
            href={document.fileUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-ump-blue hover:bg-blue-800 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer active:scale-[0.98]"
            title="Download file directly"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </a>
        </div>
      </header>

      {/* Steps 1 & 3: Centered, padded viewer wrapper */}
      <main className="flex-grow overflow-auto flex items-center justify-center bg-slate-200/50 p-4 sm:p-8">
        {isImage ? (
          // Step 2: Compact, perfectly centered image styling
          <img
            src={document.fileUrl}
            alt={document.title}
            className="w-auto h-auto max-w-[90%] sm:max-w-[40%] max-h-[60vh] object-contain shadow-md rounded-lg border border-gray-200 bg-white"
          />
        ) : (
          // Step 3: Compact, comfortable PDF iframe sizing
          <iframe
            src={document.fileUrl}
            className="w-[95%] sm:w-[50%] max-w-2xl h-[65vh] bg-white shadow-md rounded-lg border border-gray-300"
            title={document.title}
            allow="fullscreen"
          />
        )}
      </main>
    </div>
  );
}
