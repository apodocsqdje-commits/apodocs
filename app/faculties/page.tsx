import Navbar from "@/components/Navbar";
import { NADOR_FACULTIES } from "@/lib/nadorData";
import { getCachedFacultyCounts } from "@/lib/cachedData";
import FacultiesDirectoryView, { FacultyItemData } from "@/components/FacultiesDirectoryView";

export const metadata = {
  title: "Facultés & Portails Officiels | ApoDocs Nador",
  description:
    "Découvrez les 4 facultés de Nador (FSAN, FEGN, FSJPN, FLLAN) avec accès direct à leurs portails officiels.",
};

const facultyDetails: Record<
  string,
  {
    nameAr: string;
    badgeColor: string;
    themeColor: string;
    borderColor: string;
    description: string;
    specialties: string[];
  }
> = {
  FSAN: {
    nameAr: "كلية العلوم التطبيقية بالناظور",
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
    nameAr: "كلية الاقتصاد والتدبير بالناظور",
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
    nameAr: "كلية العلوم القانونية والسياسية بالناظور",
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
    nameAr: "كلية اللغات والآداب والفنون بالناظور",
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
  const counts = await getCachedFacultyCounts();

  const facultiesData: FacultyItemData[] = NADOR_FACULTIES.map((faculty) => {
    const config = facultyDetails[faculty.id] || {
      nameAr: faculty.name,
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
      id: faculty.id,
      acronym: faculty.id,
      name: faculty.name,
      nameAr: config.nameAr,
      officialUrl: `https://${faculty.id.toLowerCase()}.ump.ma`,
      entUrl: "https://ent.ump.ma",
      badgeColor: config.badgeColor,
      themeColor: config.themeColor,
      borderColor: config.borderColor,
      description: config.description,
      specialties: config.specialties,
      docCount: counts[faculty.id] || 0,
      totalFilieres: faculty.filieres.length,
      totalModules,
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <FacultiesDirectoryView facultiesData={facultiesData} />
    </div>
  );
}
