"use client";

import Link from "next/link";
import {
  GraduationCap,
  ShieldCheck,
  FileCheck2,
  Lock,
  Heart,
  ArrowRight,
  UploadCloud,
  FolderSearch,
  CheckCircle2,
} from "lucide-react";
import { useI18n } from "@/lib/i18nContext";

export default function AboutView() {
  const { t, isRTL } = useI18n();

  return (
    <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
      {/* Hero Welcome Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-4 shadow-2xs">
          <GraduationCap className="w-4 h-4 text-blue-600" />
          <span>{t("about.badge", "Université Mohammed Premier • Campus de Nador")}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
          {t("about.title", "À Propos d'ApoDocs Nador")}
        </h1>
        <p className="mt-2 text-lg sm:text-xl font-bold text-blue-600">
          {t("about.subtitle", "عن منصة ApoDocs لكليات التعليم العالي بالناظور")}
        </p>

        <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
          {t(
            "about.lead",
            "La plateforme académique de référence dédiée au partage solidaire, sécurisé et modéré de documents universitaires, cours magistraux, travaux dirigés et annales d'examens pour les étudiants de la province de Nador et de la région de l'Oriental."
          )}
        </p>
      </div>

      {/* Bilingual Mission Statements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
        {/* French Mission Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-xs hover:border-blue-400 transition-all flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-4">
              <span>🇫🇷 {t("about.mission_fr_title", "Notre Mission")}</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Démocratiser l&apos;Accès au Savoir Universitaire
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {t(
                "about.mission_fr_desc",
                "ApoDocs est née d'une volonté commune d'entraide étudiante à Nador. Notre objectif est de rassembler en un point d'accès unique l'ensemble des ressources pédagogiques des facultés de Nador (FSAN, FEGN, FSJPN, FLLAN)."
              )}
            </p>
          </div>
          <div className="pt-4 mt-6 border-t border-gray-100 flex items-center gap-2 text-xs text-blue-600 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{t("about.free_badge", "100% Gratuit, Ouvert et Indépendant")}</span>
          </div>
        </div>

        {/* Arabic Mission Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-xs hover:border-blue-400 transition-all flex flex-col justify-between text-start" dir="rtl">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-4 font-arabic">
              <span>🇲🇦 {t("about.mission_ar_title", "رسالتنا وأهدافنا")}</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3 font-arabic">
              تيسير التحصيل العلمي والتعاون الطلابي بالناظور
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed font-arabic">
              {t(
                "about.mission_ar_desc",
                "تأسست منصة ApoDocs استجابةً لحاجة طلبة التعليم العالي بإقليم الناظور إلى فضاء أكاديمي منظم وموثوق لتبادل المحاضرات، وملخصات الدروس، ونماذج الامتحانات السابقة مع التصحيح."
              )}
            </p>
          </div>
          <div className="pt-4 mt-6 border-t border-gray-100 flex items-center gap-2 text-xs text-emerald-700 font-semibold font-arabic">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{t("about.free_badge", "مبادرة غير ربحية مفتوحة لجميع الطلبة والباحثين")}</span>
          </div>
        </div>
      </div>

      {/* Core Pillars Grid */}
      <div className="mb-14">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            {t("about.features_title", "Nos Engagements & Piliers Fondamentaux")}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            مبادئ المنصة وضمانات الأمان والمصداقية الأكاديمية
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 1. Moderation */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1.5">
              {t("about.feature_verified_title", "Contenu 100% Modéré et Vérifié")}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {t(
                "about.feature_verified_desc",
                "Chaque document soumis fait l'objet d'une vérification rigoureuse avant publication afin de garantir sa pertinence."
              )}
            </p>
          </div>

          {/* 2. Privacy & Real Name */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 border border-amber-100">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1.5">
              {t("about.feature_privacy_title", "Respect de la Vie Privée et Intégrité")}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {t(
                "about.feature_privacy_desc",
                "Le nom réel reste strictement confidentiel pour l'administration et un pseudonyme protège votre identité publique."
              )}
            </p>
          </div>

          {/* 3. Open Community */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs hover:shadow-md transition">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-100">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1.5">
              {t("about.feature_free_title", "Accès Gratuit et Ouvert")}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {t(
                "about.feature_free_desc",
                "Aucune inscription ni abonnement n'est nécessaire pour consulter et télécharger les ressources pédagogiques."
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Call to Action Footer */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-10 text-white text-center shadow-lg shadow-blue-500/10">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Prêt à Partager Vos Connaissances ?
        </h2>
        <p className="mt-2 text-sm sm:text-base text-blue-100 max-w-xl mx-auto">
          Chaque cours partagé ou examen corrigé contribue directement à la réussite de centaines d&apos;étudiants à Nador. Rejoignez la communauté ApoDocs dès aujourd&apos;hui.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs sm:text-sm shadow-sm transition cursor-pointer select-none active:scale-95"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{t("upload.submit_btn", "Déposer un document")}</span>
          </Link>
          <Link
            href="/documents"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-800/60 hover:bg-blue-800 text-white font-semibold text-xs sm:text-sm border border-white/20 transition cursor-pointer select-none active:scale-95"
          >
            <FolderSearch className="w-4 h-4" />
            <span>{t("hero.browse_all", "Explorer les documents")}</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
