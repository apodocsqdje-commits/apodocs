"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  Layers,
  FileCheck2,
  User,
  Eye,
} from "lucide-react";
import LikeButton from "./LikeButton";
import DocumentPreviewModal, { PreviewDocumentData } from "./DocumentPreviewModal";
import { useI18n } from "@/lib/i18nContext";

export type DocumentCardItem = {
  id: string;
  title: string;
  type: string;
  fileUrl: string;
  status: string;
  authorName?: string | null;
  likes?: number;
  createdAt: string | Date;
  subject?: {
    name: string;
    semester: number;
    department?: {
      name: string;
      faculty?: {
        name: string;
        acronym: string;
      } | null;
    } | null;
  } | null;
};

interface DocumentCardProps {
  document: DocumentCardItem;
  compact?: boolean;
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
    badgeBg: "bg-blue-500/10",
    badgeText: "text-blue-700",
    badgeBorder: "border-blue-200",
    icon: BookOpen,
  },
  EXAM: {
    labelKey: "type.exam",
    defaultLabel: "Examen",
    badgeBg: "bg-amber-500/10",
    badgeText: "text-amber-800",
    badgeBorder: "border-amber-200",
    icon: GraduationCap,
  },
  TD_TP: {
    labelKey: "type.td_tp",
    defaultLabel: "TD / TP",
    badgeBg: "bg-purple-500/10",
    badgeText: "text-purple-800",
    badgeBorder: "border-purple-200",
    icon: Layers,
  },
  SUMMARY: {
    labelKey: "type.summary",
    defaultLabel: "Résumé",
    badgeBg: "bg-emerald-500/10",
    badgeText: "text-emerald-800",
    badgeBorder: "border-emerald-200",
    icon: FileCheck2,
  },
};

export default function DocumentCard({ document, compact = false }: DocumentCardProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { t, isRTL } = useI18n();

  const typeConfig = docTypeConfigs[document.type] || docTypeConfigs.COURSE;
  const TypeIcon = typeConfig.icon;
  const typeLabel = t(typeConfig.labelKey, typeConfig.defaultLabel);
  const faculty = document.subject?.department?.faculty;
  const department = document.subject?.department;
  const subject = document.subject;

  const isPdf = /\.pdf($|\?)/i.test(document.fileUrl);

  const previewData: PreviewDocumentData = {
    id: document.id,
    title: document.title,
    type: document.type,
    fileUrl: document.fileUrl,
    status: document.status,
    authorName: document.authorName,
    likes: document.likes || 0,
    createdAt: document.createdAt,
    facultyAcronym: faculty?.acronym,
    departmentName: department?.name,
    subjectName: subject?.name,
    semester: subject?.semester,
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200/90 hover:border-blue-400 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between group relative">
        {/* Top Visual Thumbnail Area */}
        <div
          onClick={() => setIsPreviewOpen(true)}
          className="relative h-44 bg-gradient-to-br from-slate-100 to-slate-200/80 border-b border-gray-100 flex items-center justify-center overflow-hidden cursor-pointer select-none"
        >
          {isPdf ? (
            /* Styled Realistic PDF Page Mockup Preview */
            <div className="relative w-28 h-36 bg-white rounded-lg shadow-md border border-gray-200 p-2.5 flex flex-col justify-between group-hover:scale-105 group-hover:shadow-lg transition-transform duration-200">
              {/* PDF Header bar */}
              <div className="flex items-center justify-between pb-1.5 border-b border-gray-100">
                <span className="text-[8px] font-black tracking-wider text-red-600 uppercase">PDF</span>
                <span className="text-[8px] font-semibold text-gray-400">{faculty?.acronym || "UMP"}</span>
              </div>
              {/* Page lines simulation */}
              <div className="space-y-1 py-1">
                <div className="h-1.5 bg-gray-200 rounded-full w-4/5" />
                <div className="h-1 bg-gray-100 rounded-full w-full" />
                <div className="h-1 bg-gray-100 rounded-full w-5/6" />
                <div className="h-1 bg-gray-100 rounded-full w-2/3" />
              </div>
              {/* Mock footer stamp */}
              <div className="pt-1 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[7px] text-gray-400">ApoDocs</span>
                <span className="text-[7px] font-bold text-blue-600">S{subject?.semester || 1}</span>
              </div>
            </div>
          ) : (
            /* Image Preview */
            <img
              src={document.fileUrl}
              alt={document.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          )}

          {/* Type Badge Floating on Top (Responsive LTR/RTL) */}
          <div className="absolute top-2.5 ltr:left-2.5 rtl:right-2.5 z-10 flex items-center gap-1.5 pointer-events-none">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md bg-white/95 shadow-2xs border ${typeConfig.badgeBorder} ${typeConfig.badgeText}`}
            >
              <TypeIcon className="w-3 h-3" />
              <span>{typeLabel}</span>
            </span>
          </div>

          {/* Like Heart Button Floating on Top (Responsive LTR/RTL) */}
          <div
            className="absolute top-2.5 ltr:right-2.5 rtl:left-2.5 z-20 pointer-events-auto"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <LikeButton documentId={document.id} initialLikes={document.likes || 0} size="sm" />
          </div>

          {/* Hover Overlay Hint with pointer-events-none so it NEVER blocks clicks */}
          <div className="absolute inset-0 bg-blue-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-semibold backdrop-blur-2xs pointer-events-none">
            <Eye className="w-4 h-4" />
            <span>{t("card.quick_preview", "Aperçu rapide")}</span>
          </div>
        </div>

        {/* Card Content Area */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Academic Classification tags */}
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2 flex-wrap">
              <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 font-bold text-[10px] border border-gray-200">
                {faculty?.acronym || "UMP"}
              </span>
              <span>•</span>
              <span className="truncate max-w-[130px]" title={department?.name}>
                {department?.name}
              </span>
              {subject?.semester && (
                <>
                  <span>•</span>
                  <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 font-bold text-[10px] rounded border border-blue-100">
                    S{subject.semester}
                  </span>
                </>
              )}
            </div>

            {/* Document Title */}
            <h2 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug mb-2">
              <Link href={`/documents/${document.id}`} title={document.title} className="hover:underline">
                {document.title}
              </Link>
            </h2>

            {/* Subject/Module (Strict Academic French/Standard Name) */}
            {subject?.name && (
              <p className="text-xs font-semibold text-blue-700 truncate flex items-center gap-1 mb-3">
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span title={subject.name}>{subject.name}</span>
              </p>
            )}
          </div>

          {/* Card Bottom: Author Pseudonym & Action */}
          <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2 mt-auto text-xs">
            {/* Author Public Pseudonym */}
            <div className="flex items-center gap-1.5 text-gray-600 min-w-0">
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-50 border border-gray-200/80 font-medium truncate max-w-[120px]"
                title={`${t("card.author_prefix", "Publié par:")} ${document.authorName || t("card.default_author", "طالب")}`}
              >
                <User className="w-3 h-3 text-blue-600 shrink-0" />
                <span className="truncate">{document.authorName || t("card.default_author", "طالب")}</span>
              </span>
            </div>

            {/* View / Preview Buttons */}
            <div className="flex items-center gap-1.5 shrink-0 relative z-10">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 border border-gray-200 text-xs font-semibold transition cursor-pointer active:scale-95 select-none"
                title={t("card.quick_preview", "Aperçu modal")}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{t("card.quick_preview", "Aperçu")}</span>
              </button>

              <Link
                href={`/documents/${document.id}`}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold shadow-2xs transition cursor-pointer active:scale-95 select-none"
                title={t("card.details", "Consulter le document")}
              >
                <span>{t("card.details", "Voir")}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Instant Preview Modal */}
      <DocumentPreviewModal
        document={previewData}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </>
  );
}
