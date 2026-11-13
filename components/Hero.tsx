"use client";

import Link from "next/link";
import HomeSearch from "./HomeSearch";
import { useI18n } from "@/lib/i18nContext";
import {
  GraduationCap,
  FolderSearch,
  UploadCloud,
  FileText,
  Building2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Globe,
  ExternalLink,
  Library,
} from "lucide-react";

interface HeroProps {
  totalCount: number;
}

const faculties = [
  {
    id: "FEGN",
    acronym: "FEGN",
    name: "Faculté d'économie et de gestion (FEGN)",
    officialUrl: "https://fegn.ump.ma",
    color: "from-blue-500/10 to-blue-600/5",
    border: "hover:border-blue-300",
  },
  {
    id: "FSAN",
    acronym: "FSAN",
    name: "Faculté des sciences appliquées (FSAN)",
    officialUrl: "https://fsan.ump.ma",
    color: "from-sky-500/10 to-sky-600/5",
    border: "hover:border-sky-300",
  },
  {
    id: "FSJPN",
    acronym: "FSJPN",
    name: "Faculté des sciences juridiques et politiques (FSJPN)",
    officialUrl: "https://fsjpn.ump.ma",
    color: "from-indigo-500/10 to-indigo-600/5",
    border: "hover:border-indigo-300",
  },
  {
    id: "FLLAN",
    acronym: "FLLAN",
    name: "Faculté des Langues, Lettres et Arts (FLLAN)",
    officialUrl: "https://fllan.ump.ma",
    color: "from-amber-500/10 to-amber-600/5",
    border: "hover:border-amber-300",
  },
];

export default function Hero({ totalCount }: HeroProps) {
  const { t, isRTL } = useI18n();

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Academic Identity Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-6 shadow-xs">
          <GraduationCap className="w-4 h-4 text-blue-600" />
          <span>{t("hero.pill", "Université Mohammed Premier • Nador")}</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.15]">
          {t("hero.title_prefix", "Your Digital University")}{" "}
          <span className="text-blue-600">{t("hero.title_highlight", "Library")}</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 sm:mt-5 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          {t(
            "hero.subtitle",
            "Access verified lectures, exams, and summaries for all Nador faculties. Free, open, and community-driven."
          )}
        </p>

        {/* HomeSearch Client Component */}
        <div className="mt-8 sm:mt-10">
          <HomeSearch />
        </div>

        {/* Dynamic Statistics */}
        <div className="mt-10 pt-8 border-t border-gray-200/80 max-w-2xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-3 rounded-xl bg-white border border-gray-200/80 shadow-xs flex flex-col items-center">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900">
                {totalCount > 0 ? `${totalCount}+` : "0"}
              </span>
              <span className="text-[11px] font-medium text-gray-500">
                {t("hero.stats_docs", "Documents")}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-gray-200/80 shadow-xs flex flex-col items-center">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-1.5">
                <Building2 className="w-4 h-4" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900">
                4+
              </span>
              <span className="text-[11px] font-medium text-gray-500">
                {t("hero.stats_faculties", "Faculties")}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-gray-200/80 shadow-xs flex flex-col items-center">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-1.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900">
                100%
              </span>
              <span className="text-[11px] font-medium text-gray-500">
                {t("hero.stats_verified", "Verified")}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-gray-200/80 shadow-xs flex flex-col items-center">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-1.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900">
                Free
              </span>
              <span className="text-[11px] font-medium text-gray-500">
                {t("hero.stats_free", "Open Access")}
              </span>
            </div>
          </div>
        </div>

        {/* Primary CTA button linking to /documents */}
        <div className="mt-8 flex items-center justify-center flex-wrap gap-3.5">
          <Link
            href="/documents"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-600/20 hover:shadow-lg transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            <FolderSearch className="w-4 h-4" />
            <span>{t("hero.browse_all", "Browse All Documents")}</span>
            <ArrowRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
          </Link>

          <Link
            href="/upload"
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm border border-gray-200 shadow-xs transition-colors cursor-pointer"
          >
            <UploadCloud className="w-4 h-4 text-blue-600" />
            <span>{t("hero.upload_cta", "Upload Document")}</span>
          </Link>

          <Link
            href="/faculties"
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold text-sm border border-gray-200 transition-colors cursor-pointer"
          >
            <Library className="w-4 h-4 text-gray-600" />
            <span>{t("hero.official_portals", "Portails Officiels")}</span>
          </Link>
        </div>

        {/* Quick Faculties Grid */}
        <div className="mt-16 text-start">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                {t("hero.browse_faculties_title", "Browse by Faculty (Facultés de Nador)")}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {t(
                  "hero.browse_faculties_desc",
                  "Explorez les établissements universitaires régionaux et leurs portails officiels"
                )}
              </p>
            </div>

            <Link
              href="/faculties"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1 group cursor-pointer"
            >
              <span>{t("hero.view_full_dir", "Voir l'annuaire complet")}</span>
              <ArrowRight className={`w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform ${isRTL ? "rotate-180" : ""}`} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {faculties.map((fac) => (
              <div
                key={fac.id}
                className={`p-4 rounded-xl bg-white border border-gray-200/90 ${fac.border} hover:shadow-md transition-all group flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-bold text-xs">
                      {fac.acronym}
                    </span>
                    <a
                      href={fac.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-600 p-1 rounded transition cursor-pointer"
                      title="Portail Web Officiel UMP/FPN"
                    >
                      <Globe className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <h3 className="text-xs font-semibold text-gray-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                    {fac.name}
                  </h3>
                </div>

                <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
                  <Link
                    href={`/documents?faculty=${fac.id}`}
                    className="font-semibold text-blue-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>{t("hero.documents_count", "Documents")}</span>
                    <ArrowRight className={`w-3 h-3 ${isRTL ? "rotate-180" : ""}`} />
                  </Link>

                  <a
                    href={fac.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-700 inline-flex items-center gap-0.5 cursor-pointer"
                    title="Visiter le site officiel"
                  >
                    <span>{t("hero.portal", "Portail")}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
