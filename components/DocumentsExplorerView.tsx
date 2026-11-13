"use client";

import Link from "next/link";
import {
  FolderSearch,
  UploadCloud,
  RotateCcw,
  FileText,
} from "lucide-react";
import DocumentFilter from "./DocumentFilter";
import DocumentCard, { DocumentCardItem } from "./DocumentCard";
import MyUploadsSection from "./MyUploadsSection";
import Pagination from "./Pagination";
import { useI18n } from "@/lib/i18nContext";

interface DocumentsExplorerViewProps {
  documents: DocumentCardItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  hasFiltersApplied: boolean;
}

export default function DocumentsExplorerView({
  documents,
  totalCount,
  currentPage,
  totalPages,
  pageSize,
  hasFiltersApplied,
}: DocumentsExplorerViewProps) {
  const { t, isRTL } = useI18n();

  return (
    <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-2 shadow-2xs">
            <FolderSearch className="w-3.5 h-3.5 text-blue-600" />
            <span>{t("documents.explorer_pill", "Nador Academic Repository")}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {t("documents.explorer_title", "Documents Explorer")}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {t(
              "documents.explorer_subtitle",
              "Browse, filter, and download verified university course materials and past exams."
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer select-none"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{t("upload.submit_btn", "Upload Document")}</span>
          </Link>
        </div>
      </div>

      {/* Main Layout with Sticky Filter Sidebar and Results Grid */}
      <div className="flex flex-col lg:flex-row items-start gap-8">
        {/* DocumentFilter Sidebar */}
        <DocumentFilter />

        {/* Results Area */}
        <div className="flex-1 w-full min-w-0">
          {/* Scroll anchor for pagination */}
          <div id="documents-results-top" className="scroll-mt-24" />

          {/* Uploader's Live Tracker */}
          <MyUploadsSection />

          {/* Results Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-2">
            <p className="text-xs sm:text-sm font-semibold text-gray-700">
              {t("filter.found_prefix", "Résultats :")}{" "}
              <span className="text-blue-600 font-bold">{totalCount}</span>{" "}
              {t("filter.found_suffix", "document(s)")}
              {totalPages > 1 && (
                <span className="text-gray-400 font-normal">
                  {" "}
                  •{" "}
                  {t("pagination.page_info", `Page ${currentPage} sur ${totalPages}`)
                    .replace("{current}", String(currentPage))
                    .replace("{total}", String(totalPages))}
                </span>
              )}
              {hasFiltersApplied && (
                <span className="text-gray-400 font-normal"> {t("filter.filtered", "(filtré)")}</span>
              )}
            </p>

            {hasFiltersApplied && (
              <Link
                href="/documents"
                className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t("filter.reset", "Effacer tous les filtres")}</span>
              </Link>
            )}
          </div>

          {/* Empty States */}
          {documents.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-xs my-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
                <FileText className="w-7 h-7" />
              </div>
              {hasFiltersApplied ? (
                <>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">
                    {t("documents.no_results_title", "Aucun document ne correspond à vos filtres")}
                  </h2>
                  <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                    {t(
                      "documents.no_results_desc",
                      "Essayez de modifier ou réinitialiser vos filtres pour trouver ce que vous cherchez."
                    )}
                  </p>
                  <Link
                    href="/documents"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs sm:text-sm font-semibold transition cursor-pointer select-none"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{t("filter.reset", "Réinitialiser les filtres")}</span>
                  </Link>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">
                    {t("documents.no_uploads_yet", "Aucun document partagé pour le moment")}
                  </h2>
                  <p className="text-sm text-gray-500 mb-6">
                    {t(
                      "documents.no_uploads_desc",
                      "Soyez le premier à partager un cours ou examen pour aider vos camarades de Nador !"
                    )}
                  </p>
                  <Link
                    href="/upload"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition cursor-pointer select-none"
                  >
                    <UploadCloud className="w-4 h-4" />
                    <span>{t("upload.submit_btn", "Déposer un document")}</span>
                  </Link>
                </>
              )}
            </div>
          ) : (
            <>
              {/* Document Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {documents.map((doc) => (
                  <DocumentCard key={doc.id} document={doc} />
                ))}
              </div>

              {/* Clean Pagination Bar */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalCount}
                pageSize={pageSize}
              />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
