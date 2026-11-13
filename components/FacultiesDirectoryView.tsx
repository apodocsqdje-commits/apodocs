"use client";

import Link from "next/link";
import {
  GraduationCap,
  Building2,
  ExternalLink,
  BookOpen,
  FolderTree,
  ArrowRight,
  Globe,
  Sparkles,
  FileText,
} from "lucide-react";
import { useI18n } from "@/lib/i18nContext";

export interface FacultyItemData {
  id: string;
  acronym: string;
  name: string;
  nameAr: string;
  officialUrl: string;
  entUrl: string;
  badgeColor: string;
  themeColor: string;
  borderColor: string;
  description: string;
  specialties: string[];
  docCount: number;
  totalFilieres: number;
  totalModules: number;
}

interface FacultiesDirectoryViewProps {
  facultiesData: FacultyItemData[];
}

export default function FacultiesDirectoryView({
  facultiesData,
}: FacultiesDirectoryViewProps) {
  const { t, isRTL } = useI18n();

  return (
    <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-4 shadow-2xs">
          <GraduationCap className="w-4 h-4 text-blue-600" />
          <span>{t("faculties.badge", "Université Mohammed Premier • Campus Universitaire de Nador")}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          {t("faculties.title", "Les 4 Facultés de Nador")}
        </h1>
        <p className="mt-3 text-base text-gray-600 leading-relaxed">
          {t(
            "faculties.subtitle",
            "Accédez directement aux portails web officiels vérifiés des 4 facultés de Nador (FSAN, FEGN, FSJPN, FLLAN), ainsi qu'aux documents partagés sur ApoDocs."
          )}
        </p>
      </div>

      {/* Faculties Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {facultiesData.map((faculty) => (
          <div
            key={faculty.id}
            className={`bg-white rounded-3xl border border-gray-200/90 ${faculty.borderColor} hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group`}
          >
            {/* Card Top Banner with Theme Gradient */}
            <div className={`p-6 sm:p-7 bg-gradient-to-r ${faculty.themeColor} border-b border-gray-100`}>
              <div className="flex items-start justify-between gap-3 mb-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${faculty.badgeColor}`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{faculty.acronym}</span>
                </span>

                <span className="text-xs font-medium text-gray-500 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full border border-gray-200">
                  Université Mohammed Premier
                </span>
              </div>

              {/* Faculty Name (Academic French/Standard) */}
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">
                {faculty.name}
              </h2>
              {faculty.nameAr && (
                <p className="text-sm font-medium text-gray-500 mt-1 font-arabic">
                  {faculty.nameAr}
                </p>
              )}

              <p className="text-xs sm:text-sm text-gray-600 mt-3 leading-relaxed">
                {faculty.description}
              </p>

              {/* Faculty Quick Stats */}
              <div className="mt-5 pt-4 border-t border-gray-200/60 grid grid-cols-3 gap-3 text-center">
                <div className="bg-white/80 rounded-xl p-2.5 border border-gray-200/60">
                  <span className="block text-base sm:text-lg font-bold text-gray-900">
                    {faculty.totalFilieres}
                  </span>
                  <span className="text-[11px] text-gray-500 font-medium">
                    {t("filter.filiere", "Filières")}
                  </span>
                </div>
                <div className="bg-white/80 rounded-xl p-2.5 border border-gray-200/60">
                  <span className="block text-base sm:text-lg font-bold text-gray-900">
                    {faculty.totalModules}+
                  </span>
                  <span className="text-[11px] text-gray-500 font-medium">
                    {t("filter.module", "Modules")}
                  </span>
                </div>
                <div className="bg-white/80 rounded-xl p-2.5 border border-gray-200/60">
                  <span className="block text-base sm:text-lg font-bold text-blue-600">
                    {faculty.docCount}
                  </span>
                  <span className="text-[11px] text-gray-500 font-medium">
                    {t("hero.stats_docs", "Documents")}
                  </span>
                </div>
              </div>
            </div>

            {/* Specialties / Highlights */}
            <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>{t("faculties.specialties", "Filières & Spécialités")}</span>
                </h3>
                <ul className="space-y-1.5 text-xs text-gray-600">
                  {faculty.specialties.map((spec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                      <span className="leading-snug">{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Official Links & ApoDocs Actions */}
              <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  {/* Official Portal Web Link */}
                  <a
                    href={faculty.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-800 text-xs font-semibold border border-gray-200 transition cursor-pointer select-none active:scale-95"
                    title={`Visiter le portail officiel de ${faculty.acronym}`}
                  >
                    <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{t("faculties.official_portal", "Portail Officiel")}</span>
                    <ExternalLink className="w-3 h-3 text-gray-400" />
                  </a>

                  {/* ENT Portal Link */}
                  <a
                    href={faculty.entUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold border border-gray-200 transition cursor-pointer select-none active:scale-95"
                    title="Espace Numérique de Travail (ENT UMP)"
                  >
                    <span>{t("faculties.ent_portal", "ENT Étudiant")}</span>
                    <ExternalLink className="w-3 h-3 text-gray-400" />
                  </a>
                </div>

                {/* ApoDocs Filter Shortcut Button */}
                <Link
                  href={`/documents?faculty=${faculty.id}`}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer select-none active:scale-95"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{t("faculties.browse_docs", "Voir les documents")}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? "rotate-180" : ""}`} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
