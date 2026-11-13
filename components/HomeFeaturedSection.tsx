"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, FolderSearch } from "lucide-react";
import DocumentCard, { DocumentCardItem } from "./DocumentCard";
import { useI18n } from "@/lib/i18nContext";

interface HomeFeaturedSectionProps {
  documents: DocumentCardItem[];
  totalCount: number;
}

export default function HomeFeaturedSection({
  documents,
  totalCount,
}: HomeFeaturedSectionProps) {
  const { t, isRTL } = useI18n();

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 pt-10 border-t border-gray-200/80">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2 border border-blue-200 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>{t("hero.popular_resources", "Ressources Populaires")}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {t("hero.recent_docs", "Derniers Documents & Examens Partagés")}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {t(
              "hero.recent_desc",
              "Cours complets, résumés et examens validés par les modérateurs universitaires"
            )}
          </p>
        </div>

        <Link
          href="/documents"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 transition group self-start sm:self-auto cursor-pointer"
        >
          <span>
            {t("hero.explore_directory", "Explorer tout l'annuaire")} ({totalCount})
          </span>
          <ArrowRight
            className={`w-4 h-4 group-hover:translate-x-0.5 transition-transform ${
              isRTL ? "rotate-180" : ""
            }`}
          />
        </Link>
      </div>

      {documents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <FolderSearch className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">
            {t("hero.no_docs_title", "Aucun document public pour le moment")}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto mb-4">
            {t(
              "hero.no_docs_desc",
              "Partagez le premier cours ou examen de votre filière et aidez vos camarades de Nador !"
            )}
          </p>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <span>{t("hero.upload_first", "Téléverser un document")}</span>
            <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? "rotate-180" : ""}`} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      )}
    </section>
  );
}
