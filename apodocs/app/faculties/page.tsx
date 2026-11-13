import Link from "next/link";
import Navbar from "@/components/Navbar";
import { NADOR_FACULTIES } from "@/lib/nadorData";
import { prisma } from "@/lib/prisma";
import {
  GraduationCap,
  Building2,
  ExternalLink,
  BookOpen,
  FolderTree,
  ArrowRight,
  Globe,
  Compass,
  FileText,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Briefcase,
  Award,
} from "lucide-react";

export const instant = false;

export const metadata = {
  title: "Facultés & Portails Officiels | ApoDocs Nador",
  description:
    "Découvrez les 4 facultés de Nador (FSAN, FEGN, FSJPN, FLLAN) avec accès direct à leurs portails officiels.",
};

interface FacultyConfig {
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
}

const facultyDetails: Record<string, FacultyConfig> = {
  FSAN: {
    id: "FSAN",
    acronym: "FSAN",
    name: "Faculté des Sciences Appliquées de Nador",
    nameAr: "كلية العلوم التطبيقية بالناظور",
    officialUrl: "https://fsan.ump.ma",
    entUrl: "https://ent.ump.ma",
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
    themeColor: "from-sky-500/10 via-blue-500/5 to-transparent",
    borderColor: "hover:border-sky-400",
    description:
      "Pôle d'excellence dédié aux sciences exactes, à l'ingénierie logicielle, à l'IA, aux sciences biomédicales et aux technologies émergentes dans la région de l'Oriental.",
    specialties: [
      "Informatique et Intelligence Artificielle (Python, C++, Web, Machine Learning)",
      "Mathématiques Appliquées & Modélisation",
      "Physique des Matériaux & Électronique",
      "Biologie Biomédicale & Écologie",
      "Chimie Organique & Matériaux Inorganiques",
    ],
  },
  FEGN: {
    id: "FEGN",
    acronym: "FEGN",
    name: "Faculté d'Économie et de Gestion de Nador",
    nameAr: "كلية الاقتصاد والتدبير بالناظور",
    officialUrl: "https://fegn.ump.ma",
    entUrl: "https://ent.ump.ma",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    themeColor: "from-blue-500/10 via-indigo-500/5 to-transparent",
    borderColor: "hover:border-blue-400",
    description:
      "Formation de pointe en sciences économiques, management des PME, finance, audit, et logistique portuaire en synergie avec le grand projet portuaire Nador West Med.",
    specialties: [
      "Management Portuaire et Logistique Maritime (Nador West Med)",
      "Comptabilité, Contrôle et Audit (CCA)",
      "Comptabilité, Finance et Fiscalité (CFF)",
      "Management des PME / PMI & Entrepreneuriat",
      "Économie & Gestion (Tronc Commun S1-S4)",
    ],
  },
  FSJPN: {
    id: "FSJPN",
    acronym: "FSJPN",
    name: "Faculté des Sciences Juridiques et Politiques de Nador",
    nameAr: "كلية العلوم القانونية والسياسية بالناظور",
    officialUrl: "https://fsjpn.ump.ma",
    entUrl: "https://ent.ump.ma",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
    themeColor: "from-indigo-500/10 via-purple-500/5 to-transparent",
    borderColor: "hover:border-indigo-400",
    description:
      "Établissement formant les futurs juristes, magistrats, administrateurs et spécialistes des politiques publiques et des relations internationales.",
    specialties: [
      "Droit Privé : Professions Juridiques et Judiciaires",
      "Droit Privé : Droit des Affaires et de la Finance",
      "Droit Public : Études Administratives et Financières",
      "Droit Public : Études Politiques et Internationales",
      "Troncs Communs Droit Français et Arabe",
    ],
  },
  FLLAN: {
    id: "FLLAN",
    acronym: "FLLAN",
    name: "Faculté des Langues, des Lettres et des Arts de Nador",
    nameAr: "كلية اللغات والآداب والفنون بالناظور",
    officialUrl: "https://fllan.ump.ma",
    entUrl: "https://ent.ump.ma",
    badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
    themeColor: "from-amber-500/10 via-orange-500/5 to-transparent",
    borderColor: "hover:border-amber-400",
    description:
      "Centre multiculturel valorisant la diversité linguistique, le patrimoine amazigh du Rif, les littératures mondiales et les sciences humaines.",
    specialties: [
      "English Studies (Linguistics & Literature)",
      "Langues et Culture Amazighes (Patrimoine & Linguistique)",
      "Études Arabes (Littérature, Critique & Linguistique)",
      "Études Hispaniques & Civilisation Ibérique",
      "Études Françaises (Linguistique & Littérature)",
      "Études Islamiques, Géographie & Philosophie",
    ],
  },
};



export default async function FacultiesPage() {
  // Count approved documents per faculty from database
  const facultiesData = await Promise.all(
    NADOR_FACULTIES.map(async (faculty) => {
      const docCount = await prisma.document.count({
        where: {
          status: "APPROVED",
          subject: {
            department: {
              faculty: {
                acronym: faculty.id,
              },
            },
          },
        },
      });

      const config = facultyDetails[faculty.id] || {
        id: faculty.id,
        acronym: faculty.id,
        name: faculty.name,
        nameAr: faculty.name,
        officialUrl: `https://${faculty.id.toLowerCase()}.ump.ma`,
        entUrl: "https://ent.ump.ma",
        badgeColor: "bg-gray-50 text-gray-700 border-gray-200",
        themeColor: "from-gray-500/10 to-transparent",
        borderColor: "hover:border-gray-400",
        description: faculty.name,
        specialties: [],
      };

      const totalModules = faculty.filieres.reduce(
        (acc, fil) =>
          acc + fil.semesters.reduce((sAcc, sem) => sAcc + sem.modules.length, 0),
        0
      );

      return {
        ...faculty,
        ...config,
        docCount,
        totalFilieres: faculty.filieres.length,
        totalModules,
      };
    })
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-4 shadow-2xs">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span>Université Mohammed Premier • Campus Universitaire de Nador</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Les 4 Facultés de Nador
          </h1>
          <p className="mt-3 text-base text-gray-600 leading-relaxed">
            Accédez directement aux portails web officiels vérifiés des 4 facultés de Nador (FSAN, FEGN, FSJPN, FLLAN), ainsi qu&apos;aux documents partagés sur ApoDocs.
          </p>
        </div>

        {/* Faculties Grid (Core Campus Branches) */}
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

                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">
                  {faculty.name}
                </h2>
                <p className="text-sm font-medium text-gray-500 mt-1 font-serif">
                  {faculty.nameAr}
                </p>

                <p className="text-xs sm:text-sm text-gray-600 mt-3 leading-relaxed">
                  {faculty.description}
                </p>

                {/* Faculty Quick Stats */}
                <div className="mt-5 pt-4 border-t border-gray-200/60 grid grid-cols-3 gap-3 text-center">
                  <div className="bg-white/80 rounded-xl p-2.5 border border-gray-200/60">
                    <span className="block text-base sm:text-lg font-bold text-gray-900">
                      {faculty.totalFilieres}
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium">Filières</span>
                  </div>
                  <div className="bg-white/80 rounded-xl p-2.5 border border-gray-200/60">
                    <span className="block text-base sm:text-lg font-bold text-gray-900">
                      {faculty.totalModules}+
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium">Modules</span>
                  </div>
                  <div className="bg-white/80 rounded-xl p-2.5 border border-gray-200/60">
                    <span className="block text-base sm:text-lg font-bold text-blue-600">
                      {faculty.docCount}
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium">Documents</span>
                  </div>
                </div>
              </div>

              {/* Specialties / Highlights */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Filières & Spécialités Phares</span>
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
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-800 text-xs font-semibold border border-gray-200 transition"
                      title={`Visiter le portail officiel de ${faculty.acronym}`}
                    >
                      <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>Portail Officiel</span>
                      <ExternalLink className="w-3 h-3 text-gray-400" />
                    </a>

                    {/* ENT Portal Link */}
                    <a
                      href={faculty.entUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold border border-gray-200 transition"
                      title="Espace Numérique de Travail (ENT UMP)"
                    >
                      <span>ENT Étudiant</span>
                      <ExternalLink className="w-3 h-3 text-gray-400" />
                    </a>
                  </div>

                  {/* ApoDocs Browse Documents Link */}
                  <Link
                    href={`/documents?faculty=${faculty.id}`}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition"
                  >
                    <span>Explorer les documents</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>


        {/* Central UMP Institutional Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                Université Mohammed Premier d&apos;Oujda (UMP)
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-xl">
                Portail central de l&apos;université tutrice regroupant l&apos;ensemble des facultés, écoles d&apos;ingénieurs et instituts de la région de l&apos;Oriental (Oujda, Nador, Al Hoceima, Berkane).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
            <a
              href="https://www.ump.ma"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold transition"
            >
              <Globe className="w-4 h-4" />
              <span>Site Web UMP</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <a
              href="https://fpn.ump.ma"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold transition"
            >
              <span>Portail Nador</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>


          </div>
        </div>
      </main>
    </div>
  );
}
