import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import AdminSidebarLayout from "@/components/AdminSidebarLayout";
import AdminDocumentsTable from "@/components/AdminDocumentsTable";
import {
  FileText,
  ShieldCheck,
  UploadCloud,
  CheckCircle2,
  Clock,
  Users,
  Shield,
  Lock,
  Heart,
  Building2,
  Sparkles,
  Layers,
  AlertCircle,
  ExternalLink,
  Activity,
  Calendar,
  Check,
  TrendingUp,
  User,
  XCircle,
  BookOpen,
} from "lucide-react";

export const metadata = {
  title: "Tableau de Bord Administration | ApoDocs Nador",
  description: "Panneau d'administration sécurisé RBAC (SUPER_ADMIN / MODERATOR) pour ApoDocs Nador.",
};

function formatRelativeTime(date: Date | string): string {
  try {
    const now = new Date();
    const d = new Date(date);
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays} j`;
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
  } catch {
    return "Récemment";
  }
}

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const isSuperAdmin = session.role === "SUPER_ADMIN";
  const isModerator = session.role === "MODERATOR";

  // Step 4 Requirements:
  // - If MODERATOR: Only display pending documents by default.
  // - If SUPER_ADMIN: Display all documents.
  const documents = await prisma.document.findMany({
    where: isModerator ? { status: "PENDING" } : undefined,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      subject: {
        include: {
          department: {
            include: {
              faculty: true,
            },
          },
        },
      },
    },
  });

  // Calculate statistics (for SUPER_ADMIN)
  const totalDocuments = documents.length;
  const pendingCount = documents.filter((d) => d.status === "PENDING").length;
  const approvedCount = documents.filter((d) => d.status === "APPROVED").length;
  const rejectedCount = documents.filter((d) => d.status === "REJECTED").length;
  const totalLikes = documents.reduce((acc, d) => acc + (d.likes || 0), 0);

  // Document types breakdown
  const typeCounts = {
    COURSE: documents.filter((d) => d.type === "COURSE").length,
    EXAM: documents.filter((d) => d.type === "EXAM").length,
    TD_TP: documents.filter((d) => d.type === "TD_TP").length,
    SUMMARY: documents.filter((d) => d.type === "SUMMARY").length,
  };

  // Faculty document distribution (the 4 faculties of Nador)
  const facultyCounts = {
    FSAN: documents.filter((d) => d.subject?.department?.faculty?.acronym === "FSAN").length,
    FEGN: documents.filter((d) => d.subject?.department?.faculty?.acronym === "FEGN").length,
    FSJPN: documents.filter((d) => d.subject?.department?.faculty?.acronym === "FSJPN").length,
    FLLAN: documents.filter((d) => d.subject?.department?.faculty?.acronym === "FLLAN").length,
  };

  // Moderator count (for Super Admin glance)
  const moderatorCount = isSuperAdmin
    ? await prisma.admin.count({ where: { role: "MODERATOR" } })
    : 0;

  // Recent 4 submissions for the Activity Feed widget
  const recentSubmissions = documents.slice(0, 4);

  return (
    <AdminSidebarLayout
      user={{
        username: session.username,
        role: session.role,
      }}
      pendingCount={pendingCount}
      totalCount={totalDocuments}
      moderatorCount={moderatorCount}
    >
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Top Header & Breadcrumb Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200/80">
          <div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
              <span>Administration</span>
              <span>/</span>
              <span className="font-semibold text-gray-900">
                {isModerator ? "File de Modération" : "Vue d'ensemble"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {isModerator ? "Modération des Documents" : "Tableau de Bord"}
            </h1>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Link
              href="/documents"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition shadow-2xs cursor-pointer"
            >
              <span>Site Public</span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
            </Link>

            {isSuperAdmin && (
              <Link
                href="/upload"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition shadow-sm shadow-blue-500/20 cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Nouveau Document</span>
              </Link>
            )}
          </div>
        </div>

        {/* Super Admin Top KPI Cards */}
        {isSuperAdmin && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* 1. Total Documents */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs hover:shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Total Docs
                </span>
                <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  {totalDocuments}
                </p>
                <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  <span>Tous types</span>
                </p>
              </div>
            </div>

            {/* 2. Pending Review (Dynamic Alert) */}
            <div
              className={`p-5 rounded-2xl border shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between ${
                pendingCount > 0
                  ? "bg-amber-50/40 border-amber-300 hover:border-amber-400"
                  : "bg-white border-gray-200/90"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  En Attente
                </span>
                <div className="w-9 h-9 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center border border-amber-200">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl sm:text-3xl font-extrabold text-amber-600">
                    {pendingCount}
                  </p>
                  {pendingCount > 0 && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                      Action
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-amber-800/80 mt-1">
                  {pendingCount > 0
                    ? "À modérer"
                    : "File vide 🎉"}
                </p>
              </div>
            </div>

            {/* 3. Approved Documents */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs hover:shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Approuvés
                </span>
                <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
                  {approvedCount}
                </p>
                <p className="text-[11px] text-gray-500 mt-1">
                  {totalDocuments > 0
                    ? `${Math.round((approvedCount / totalDocuments) * 100)}% validés`
                    : "0% validés"}
                </p>
              </div>
            </div>

            {/* 4. Rejected Documents */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs hover:shadow-xs hover:border-rose-300 transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Rejetés
                </span>
                <div className="w-9 h-9 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center border border-rose-100">
                  <XCircle className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-rose-600">
                  {rejectedCount}
                </p>
                <p className="text-[11px] text-gray-500 mt-1">
                  Documents non retenus
                </p>
              </div>
            </div>

            {/* 5. Total Likes */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200/90 shadow-2xs hover:shadow-xs hover:border-pink-300 transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Likes
                </span>
                <div className="w-9 h-9 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center border border-pink-100">
                  <Heart className="w-4 h-4 text-pink-600 fill-pink-100" />
                </div>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-pink-600">
                  {totalLikes}
                </p>
                <p className="text-[11px] text-gray-500 mt-1">
                  Engagement global
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Super Admin Middle Row: Faculty Distribution + Document Types & Activity Feed */}
        {isSuperAdmin && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Faculty Distribution Bar (2 columns on lg) */}
            <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-3xl border border-gray-200/90 shadow-xs flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                      Répartition par Faculté (Nador)
                    </h2>
                  </div>
                  <span className="text-xs font-medium text-gray-400">
                    4 pôles universitaires
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 flex flex-col justify-between">
                    <div>
                      <span className="font-extrabold text-sky-900 block text-xs">
                        FSAN
                      </span>
                      <span className="text-[10px] text-sky-700 block truncate">
                        Sciences Appliquées
                      </span>
                    </div>
                    <span className="text-xl font-extrabold text-sky-700 mt-2 block">
                      {facultyCounts.FSAN}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex flex-col justify-between">
                    <div>
                      <span className="font-extrabold text-blue-900 block text-xs">
                        FEGN
                      </span>
                      <span className="text-[10px] text-blue-700 block truncate">
                        Économie & Gestion
                      </span>
                    </div>
                    <span className="text-xl font-extrabold text-blue-700 mt-2 block">
                      {facultyCounts.FEGN}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col justify-between">
                    <div>
                      <span className="font-extrabold text-indigo-900 block text-xs">
                        FSJPN
                      </span>
                      <span className="text-[10px] text-indigo-700 block truncate">
                        Droit & Politiques
                      </span>
                    </div>
                    <span className="text-xl font-extrabold text-indigo-700 mt-2 block">
                      {facultyCounts.FSJPN}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-100 flex flex-col justify-between">
                    <div>
                      <span className="font-extrabold text-amber-900 block text-xs">
                        FLLAN
                      </span>
                      <span className="text-[10px] text-amber-800 block truncate">
                        Lettres & Arts
                      </span>
                    </div>
                    <span className="text-xl font-extrabold text-amber-800 mt-2 block">
                      {facultyCounts.FLLAN}
                    </span>
                  </div>
                </div>
              </div>

              {/* Document Type Overview Mini Grid */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-700">Par Type de Ressource</span>
                  <span className="text-[11px] text-gray-400">Total: {totalDocuments}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-between">
                    <span className="text-blue-800 font-medium">Cours</span>
                    <span className="font-bold text-blue-900">{typeCounts.COURSE}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-between">
                    <span className="text-amber-800 font-medium">Examens</span>
                    <span className="font-bold text-amber-900">{typeCounts.EXAM}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-between">
                    <span className="text-emerald-800 font-medium">TD / TP</span>
                    <span className="font-bold text-emerald-900">{typeCounts.TD_TP}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-between">
                    <span className="text-purple-800 font-medium">Résumés</span>
                    <span className="font-bold text-purple-900">{typeCounts.SUMMARY}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Feed Widget (1 column on lg) */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-200/90 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                      Dernières Soumissions
                    </h2>
                  </div>
                  <span className="text-[11px] text-gray-400">Temps réel</span>
                </div>

                {recentSubmissions.length === 0 ? (
                  <p className="text-xs text-gray-400 py-6 text-center">
                    Aucune activité récente.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {recentSubmissions.map((doc) => {
                      const isPending = doc.status === "PENDING";
                      const isApproved = doc.status === "APPROVED";
                      const isRejected = doc.status === "REJECTED";

                      return (
                        <div
                          key={doc.id}
                          className="flex items-start justify-between gap-2 p-2.5 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100"
                        >
                          <div className="min-w-0">
                            <p
                              className="text-xs font-bold text-gray-900 truncate"
                              title={doc.title}
                            >
                              {doc.title}
                            </p>
                            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 mt-0.5">
                              <span className="font-semibold text-blue-600">
                                {doc.subject?.department?.faculty?.acronym || "N/A"}
                              </span>
                              <span>•</span>
                              <span className="truncate max-w-[100px]">
                                {doc.authorName || doc.realName}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end shrink-0">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                isPending
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : isApproved
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-rose-50 text-rose-700 border border-rose-200"
                              }`}
                            >
                              {isPending ? "Attente" : isApproved ? "Validé" : "Rejeté"}
                            </span>
                            <span className="text-[9px] text-gray-400 mt-0.5">
                              {formatRelativeTime(doc.createdAt)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 text-center">
                <span className="text-[11px] text-gray-400">
                  Modération continue par l&apos;équipe UMP
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Moderator Information Notice */}
        {isModerator && (
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs sm:text-sm text-amber-900 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Instructions pour Modérateurs</p>
              <p className="text-amber-800 text-xs mt-0.5 leading-relaxed">
                Vous examinez actuellement les documents en attente. Vérifiez que le document appartient bien à l&apos;une des 4 facultés de Nador, qu&apos;il ne contient pas de données sensibles, puis validez-le pour qu&apos;il soit consultable publiquement, ou rejetez-le si non conforme.
              </p>
            </div>
          </div>
        )}

        {/* Main Document Table Container */}
        <div className="bg-white rounded-3xl border border-gray-200/90 shadow-xs overflow-hidden">
          <div className="px-6 py-4.5 border-b border-gray-200/90 bg-gray-50/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <h2 className="text-base font-bold text-gray-900">
                  {isModerator
                    ? "Documents en attente d'approbation"
                    : "Catalogue des Documents Académiques"}
                </h2>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {isModerator
                  ? "Consultez les fichiers PDF et validez-les ou rejetez-les."
                  : "Recherchez, filtrez, exportez en CSV, traitez en masse et prévisualisez toutes les ressources."}
              </p>
            </div>

            <div className="text-xs font-semibold text-gray-700 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-2xs self-start sm:self-auto flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span>
                {isModerator ? "En attente : " : "Total répertorié : "}
                <strong className="text-gray-900">{documents.length}</strong>
              </span>
            </div>
          </div>

          <AdminDocumentsTable
            documents={documents}
            isSuperAdmin={isSuperAdmin}
            isModerator={isModerator}
          />
        </div>
      </div>
    </AdminSidebarLayout>
  );
}
