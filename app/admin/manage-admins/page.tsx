import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminSidebarLayout from "@/components/AdminSidebarLayout";
import CreateModeratorForm from "@/components/CreateModeratorForm";
import RevokeModeratorButton from "@/components/RevokeModeratorButton";
import {
  ShieldCheck,
  Users,
  ArrowLeft,
  Calendar,
  Lock,
  UserCheck,
  Shield,
  ExternalLink,
} from "lucide-react";

export const instant = false;

export const metadata = {
  title: "Gestion des Modérateurs | ApoDocs Admin",
  description: "Espace SUPER_ADMIN pour gérer et révoquer les accès des modérateurs.",
};

function formatAdminDate(date: Date): string {
  try {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return "N/A";
  }
}

export default async function ManageAdminsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  if (session.role !== "SUPER_ADMIN") {
    redirect("/admin");
  }

  // Fetch all admins and counts in parallel
  const [admins, pendingCount, totalDocuments] = await Promise.all([
    prisma.admin.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true,
      },
    }),
    prisma.document.count({ where: { status: "PENDING" } }),
    prisma.document.count(),
  ]);

  const moderatorCount = admins.filter((a) => a.role === "MODERATOR").length;
  const superAdminCount = admins.filter((a) => a.role === "SUPER_ADMIN").length;

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
      <div className="p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-6">
        {/* Navigation & Header */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-200/80">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Tableau de Bord</span>
                </Link>
                <span className="text-xs text-gray-400">•</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Super Admin
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Gestion des Modérateurs
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-gray-600">
                Créez de nouveaux comptes modérateurs pour le campus ou révoquez les accès existants.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                href="/documents"
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl transition shadow-2xs cursor-pointer"
              >
                <span>Site Public</span>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
              </Link>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Modérateurs Actifs
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{moderatorCount}</p>
                <p className="text-xs text-gray-400 mt-0.5">Rôle MODERATOR (Approbation & Rejet)</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                  Super Administrateurs
                </p>
                <p className="text-2xl font-bold text-purple-700 mt-1">{superAdminCount}</p>
                <p className="text-xs text-gray-400 mt-0.5">Accès total (Suppression & Gestion)</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center border border-purple-100">
                <Shield className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Create New Moderator Form */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Ajouter un nouveau Modérateur
              </h2>
              <p className="text-xs text-gray-500">
                Le compte modérateur pourra examiner, approuver et rejeter les documents soumis par les étudiants.
              </p>
            </div>
          </div>

          <CreateModeratorForm />
        </div>

        {/* Section 2: List of Existing Admins & Moderators */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Comptes Administrateurs & Modérateurs
              </h2>
              <p className="text-xs text-gray-500">
                Liste complète des utilisateurs autorisés à modérer le contenu académique.
              </p>
            </div>
            <div className="text-xs font-medium text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
              Total: <span className="font-bold text-gray-800">{admins.length}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead>
                <tr className="bg-gray-50/75 text-gray-600 uppercase text-[11px] font-semibold tracking-wider">
                  <th scope="col" className="px-6 py-3.5">
                    Utilisateur
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Rôle
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Date de création
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {admins.map((adm) => {
                  const isCurrentSession = adm.id === session.id;
                  const isSuperAdminRole = adm.role === "SUPER_ADMIN";

                  return (
                    <tr
                      key={adm.id}
                      className="hover:bg-blue-50/30 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                              isSuperAdminRole
                                ? "bg-purple-100 text-purple-800 border border-purple-200"
                                : "bg-blue-50 text-blue-700 border border-blue-100"
                            }`}
                          >
                            {adm.username.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              {adm.username}
                            </p>
                            <span className="text-[11px] text-gray-400 font-mono">
                              ID: {adm.id.slice(0, 8)}...
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {isSuperAdminRole ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
                            <Shield className="w-3.5 h-3.5" />
                            SUPER_ADMIN
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            <Lock className="w-3.5 h-3.5" />
                            MODERATOR
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>{formatAdminDate(adm.createdAt)}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <RevokeModeratorButton
                          adminId={adm.id}
                          username={adm.username}
                          isSelf={isCurrentSession}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminSidebarLayout>
  );
}
