"use client";

import Link from "next/link";
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
import LikeButton from "./LikeButton";
import { useI18n } from "@/lib/i18nContext";

interface DocumentViewerHeaderProps {
  document: {
    id: string;
    title: string;
    type: string;
    fileUrl: string;
    likes: number;
    authorName?: string | null;
    createdAt: string | Date;
    facultyAcronym?: string;
    departmentName?: string;
    subjectName?: string;
    semester?: number;
  };
}

const docTypeConfigs: Record<
  string,
  {
    labelKey: string;
    defaultLabel: string;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    icon: typeof BookOpen;
  }
> = {
  COURSE: {
    labelKey: "type.course",
    defaultLabel: "Cours",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-700",
    badgeBorder: "border-blue-200",
    icon: BookOpen,
  },
  EXAM: {
    labelKey: "type.exam",
    defaultLabel: "Examen",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-800",
    badgeBorder: "border-amber-200",
    icon: GraduationCap,
  },
  TD_TP: {
    labelKey: "type.td_tp",
    defaultLabel: "TD / TP",
    badgeBg: "bg-purple-50",
    badgeText: "text-purple-800",
    badgeBorder: "border-purple-200",
    icon: Layers,
  },
  SUMMARY: {
    labelKey: "type.summary",
    defaultLabel: "Résumé",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-800",
    badgeBorder: "border-emerald-200",
    icon: FileCheck2,
  },
};

export default function DocumentViewerHeader({ document }: DocumentViewerHeaderProps) {
  const { t, isRTL } = useI18n();

  const typeConfig = docTypeConfigs[document.type] || docTypeConfigs.COURSE;
  const TypeIcon = typeConfig.icon;
  const typeLabel = t(typeConfig.labelKey, typeConfig.defaultLabel);

  return (
    <header className="h-16 flex items-center justify-between px-3 sm:px-6 bg-white border-b border-gray-200 shadow-xs shrink-0 z-10 gap-2">
      {/* Left: Back button & Breadcrumbs */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <Link
          href="/documents"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 border border-gray-200 transition-colors shrink-0 cursor-pointer select-none active:scale-95"
          title={t("documentViewer.back_to_docs", "Retour aux documents")}
        >
          <ArrowLeft className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
          <span className="hidden sm:inline">{t("documentViewer.back", "Retour")}</span>
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
              <span>{typeLabel}</span>
            </span>
          </div>

          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 truncate pt-0.5">
            <Building2 className="w-3 h-3 text-gray-400 shrink-0" />
            <span className="font-semibold text-gray-700">
              {document.facultyAcronym || "UMP"}
            </span>
            <span>/</span>
            <span className="truncate">{document.departmentName}</span>
            {document.semester && (
              <>
                <span>/</span>
                <span className="font-semibold text-blue-600">
                  S{document.semester}
                </span>
              </>
            )}
            {document.subjectName && (
              <>
                <span>•</span>
                <span className="font-medium text-gray-800 truncate">
                  {document.subjectName}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Like Button */}
        <LikeButton
          documentId={document.id}
          initialLikes={document.likes || 0}
          size="sm"
          showLabel={true}
        />

        {/* Public Author Pseudonym */}
        <span className="hidden lg:inline-flex items-center gap-1.5 text-xs text-gray-700 bg-gray-50 border border-gray-200/80 px-2.5 py-1.5 rounded-lg">
          <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="text-gray-500 font-normal">{t("card.author_prefix", "Par :")}</span>
          <span className="font-semibold text-gray-900 truncate max-w-[120px]">
            {document.authorName || t("card.default_author", "طالب")}
          </span>
        </span>

        <a
          href={document.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200 transition-colors text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer active:scale-95"
          title={t("documentViewer.open_original", "Ouvrir le fichier original")}
        >
          <ExternalLink className="w-4 h-4" />
          <span className="hidden md:inline">{t("card.fullscreen", "Plein écran")}</span>
        </a>

        <a
          href={document.fileUrl}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer select-none active:scale-95"
          title={t("documentViewer.download", "Télécharger")}
        >
          <Download className="w-4 h-4" />
          <span>{t("documentViewer.download", "Télécharger")}</span>
        </a>
      </div>
    </header>
  );
}
