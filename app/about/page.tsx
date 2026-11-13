import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  GraduationCap,
  ShieldCheck,
  FileCheck2,
  Lock,
  Sparkles,
  Users,
  Compass,
  ArrowRight,
  UploadCloud,
  FolderSearch,
  BookOpen,
  CheckCircle2,
  Building2,
  HelpCircle,
  Mail,
  Heart,
} from "lucide-react";

export const metadata = {
  title: "À Propos & Mission | ApoDocs Nador",
  description:
    "Découvrez ApoDocs, la plateforme collaborative ouverte dédiée aux étudiants des facultés de Nador (Université Mohammed Premier).",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Hero Welcome Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-4 shadow-2xs">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span>Université Mohammed Premier • Campus de Nador</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
            À Propos d&apos;ApoDocs Nador
          </h1>
          <p className="mt-2 text-xl font-bold text-blue-600 font-serif">
            عن منصة ApoDocs لكليات التعليم العالي بالناظور
          </p>

          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            La plateforme académique de référence dédiée au partage solidaire, sécurisé et modéré de documents universitaires, cours magistraux, travaux dirigés et annales d&apos;examens pour les étudiants de la province de Nador et de la région de l&apos;Oriental.
          </p>
        </div>

        {/* Bilingual Mission Statements (French & Arabic Side by Side / Stacked) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          {/* French Mission Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-xs hover:border-blue-400 transition-all flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 mb-4">
                <span>🇫🇷 Notre Mission</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Démocratiser l&apos;Accès au Savoir Universitaire
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed space-y-2">
                ApoDocs est née d&apos;une volonté commune d&apos;entraide étudiante à Nador. Notre objectif est de rassembler en un point d&apos;accès unique l&apos;ensemble des ressources pédagogiques des facultés de Nador (FSAN, FEGN, FSJPN, FLLAN).
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mt-3">
                Chaque document soumis fait l&apos;objet d&apos;une vérification rigoureuse par notre équipe de modération avant d&apos;être mis à la disposition de la communauté étudiante, garantissant ainsi pertinence, authenticité et qualité académique.
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-gray-100 flex items-center gap-2 text-xs text-blue-600 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>100% Gratuit, Ouvert et Indépendant</span>
            </div>
          </div>

          {/* Arabic Mission Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-xs hover:border-blue-400 transition-all flex flex-col justify-between text-right" dir="rtl">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-4">
                <span>🇲🇦 رسالتنا وأهدافنا</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3 font-arabic">
                تيسير التحصيل العلمي والتعاون الطلابي بالناظور
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed font-arabic">
                تأسست منصة **ApoDocs** استجابةً لحاجة طلبة التعليم العالي بإقليم الناظور إلى فضاء أكاديمي منظم وموثوق لتبادل المحاضرات، وملخصات الدروس، ونماذج الامتحانات السابقة مع التصحيح.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mt-3 font-arabic">
                تغطي المنصة مختلف المسالك الجامعية (العلوم التطبيقية، الاقتصاد والتدبير، العلوم القانونية والسياسية، والآداب واللغات).
              </p>
            </div>
            <div className="pt-4 mt-6 border-t border-gray-100 flex items-center justify-start gap-2 text-xs text-emerald-700 font-semibold font-arabic">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>مبادرة غير ربحية مفتوحة لجميع الطلبة والباحثين</span>
            </div>
          </div>
        </div>

        {/* Core Pillars Grid */}
        <div className="mb-14">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Nos Engagements & Piliers Fondamentaux
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              مبادئ المنصة وضمانات الأمان والمصداقية الأكاديمية
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. Moderation */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1.5">
                Modération & Vérification
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Toutes les contributions sont examinées par nos modérateurs avant publication pour éviter les contenus hors-sujet ou erronés.
              </p>
            </div>

            {/* 2. Privacy & Real Name */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 border border-amber-100">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1.5">
                Confidentialité & Intégrité
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Le nom réel de l&apos;auteur reste strictement confidentiel pour l&apos;administration, tandis qu&apos;un pseudonyme protège sa vie privée en public.
              </p>
            </div>

            {/* 3. Anti-Duplicate Hash */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 border border-purple-100">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1.5">
                Détection des Doublons
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Calcul cryptographique systématique (SHA-256) pour bloquer les fichiers identiques et maintenir un catalogue épuré.
              </p>
            </div>

            {/* 4. Open Community */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-2xs hover:shadow-md transition">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 border border-emerald-100">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1.5">
                Entraide & Gratuité
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Un système de mentions « J&apos;aime » sans compte requis, encourageant la reconnaissance des meilleurs partages d&apos;étudiants.
              </p>
            </div>
          </div>
        </div>

        {/* Institutions Covered */}
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xs mb-14">
          <div className="max-w-2xl mb-6">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Couverture Académique & Régionale
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
              Les Facultés Desservies à Nador
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              ApoDocs regroupe les ressources des 4 facultés universitaires de Nador :
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200/80">
              <span className="font-bold text-gray-900 block mb-0.5">FSAN - Sciences Appliquées</span>
              <p className="text-gray-500">Informatique, IA, Mathématiques, Physique, Biologie, Chimie.</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200/80">
              <span className="font-bold text-gray-900 block mb-0.5">FEGN - Économie & Gestion</span>
              <p className="text-gray-500">Finance, Comptabilité, Audit, Management Portuaire Nador West Med.</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200/80">
              <span className="font-bold text-gray-900 block mb-0.5">FSJPN - Droit & Sciences Politiques</span>
              <p className="text-gray-500">Droit Privé, Droit Public, Carrières Juridiques et Administratives.</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200/80">
              <span className="font-bold text-gray-900 block mb-0.5">FLLAN - Lettres, Langues & Arts</span>
              <p className="text-gray-500">Études Anglaises, Françaises, Arabes, Hispaniques et Amazighes.</p>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-gray-500">
              Consultez les liens officiels de chaque établissement dans notre annuaire dédié.
            </span>
            <Link
              href="/faculties"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              <span>Accéder aux portails officiels</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
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
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs sm:text-sm shadow-sm transition"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Déposer un document</span>
            </Link>
            <Link
              href="/documents"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-800/60 hover:bg-blue-800 text-white font-semibold text-xs sm:text-sm border border-white/20 transition"
            >
              <FolderSearch className="w-4 h-4" />
              <span>Explorer la bibliothèque</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
