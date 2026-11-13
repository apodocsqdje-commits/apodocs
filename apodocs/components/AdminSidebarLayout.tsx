"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";
import {
  LayoutDashboard,
  Files,
  Clock,
  Users,
  UploadCloud,
  Globe,
  Menu,
  X,
  ShieldCheck,
  Shield,
  Lock,
  Database,
  Sparkles,
  GraduationCap,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  FileText,
  Activity,
} from "lucide-react";

interface AdminSidebarLayoutProps {
  children: ReactNode;
  user: {
    username: string;
    role: string;
  };
  pendingCount: number;
  totalCount: number;
  moderatorCount?: number;
}

export default function AdminSidebarLayout({
  children,
  user,
  pendingCount,
  totalCount,
  moderatorCount = 0,
}: AdminSidebarLayoutProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showGuidelines, setShowGuidelines] = useState(false);

  const isSuperAdmin = user.role === "SUPER_ADMIN";
  const isModerator = user.role === "MODERATOR";

  const navItems = [
    {
      label: "Tableau de Bord",
      href: "/admin",
      icon: LayoutDashboard,
      active: pathname === "/admin",
      badge: null,
    },
    ...(isSuperAdmin
      ? [
          {
            label: "Gestion des Modérateurs",
            href: "/admin/manage-admins",
            icon: Users,
            active: pathname === "/admin/manage-admins",
            badge: moderatorCount > 0 ? `${moderatorCount}` : null,
            badgeColor: "bg-purple-100 text-purple-700",
          },
        ]
      : []),
    ...(isSuperAdmin
      ? [
          {
            label: "Ajouter un Document",
            href: "/upload",
            icon: UploadCloud,
            active: pathname === "/upload",
            badge: "Nouveau",
            badgeColor: "bg-blue-100 text-blue-700",
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50/70 flex flex-col lg:flex-row font-sans text-gray-900">
      {/* Mobile Top Header */}
      <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none transition cursor-pointer"
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-blue-500/20">
              A
            </div>
            <div>
              <span className="font-extrabold text-sm text-gray-900 tracking-tight">
                ApoDocs
              </span>
              <span className="text-[10px] block font-bold text-blue-600 uppercase tracking-wider leading-none">
                Admin Panel
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              {pendingCount}
            </span>
          )}
          <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg">
            @{user.username}
          </span>
        </div>
      </header>

      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200/90 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Top Brand Header */}
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <Link
              href="/admin"
              className="flex items-center gap-3 group"
              onClick={() => setIsMobileOpen(false)}
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base text-gray-900 tracking-tight">
                    ApoDocs
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                    Admin
                  </span>
                </div>
                <span className="text-[11px] text-gray-400 font-medium block">
                  Campus Nador • UMP
                </span>
              </div>
            </Link>

            {/* Close button for mobile */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
              aria-label="Fermer le menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Role Identity Badge Banner */}
          <div className="px-5 py-3 bg-gray-50/70 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                  isSuperAdmin
                    ? "bg-purple-100 text-purple-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <span className="text-xs font-bold text-gray-900 block truncate">
                  @{user.username}
                </span>
                <span className="text-[10px] text-gray-500 font-medium block">
                  {isSuperAdmin ? "Super Admin" : "Modérateur"}
                </span>
              </div>
            </div>

            {isSuperAdmin ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                <Shield className="w-3 h-3" />
                SUPER
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                <Lock className="w-3 h-3" />
                MOD
              </span>
            )}
          </div>

          {/* Navigation Items */}
          <div className="p-3 flex-1 overflow-y-auto space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
              Menu Principal
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all group ${
                    item.active
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        item.active ? "text-white" : "text-gray-500 group-hover:text-gray-800"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        item.active
                          ? "bg-white/20 text-white"
                          : item.badgeColor || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Quick Status / Moderation Link */}
            <div className="pt-4 mt-3 border-t border-gray-100">
              <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-gray-400">
                Accès Rapide
              </div>

              <Link
                href="/documents"
                target="_blank"
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition group"
              >
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                  <span>Site Public ApoDocs</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600" />
              </Link>

              <button
                type="button"
                onClick={() => setShowGuidelines(true)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition group cursor-pointer text-left"
              >
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-gray-400 group-hover:text-amber-600" />
                  <span>Charte de Modération</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* System Status Mini Widget in Sidebar */}
            <div className="p-3 mx-1 mt-4 rounded-2xl bg-gradient-to-br from-gray-50 to-blue-50/40 border border-gray-200/80">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-bold text-gray-800">
                  Système En Ligne
                </span>
              </div>
              <div className="space-y-1 text-[10px] text-gray-500">
                <div className="flex justify-between">
                  <span>Base de données :</span>
                  <span className="font-semibold text-gray-700">PostgreSQL</span>
                </div>
                <div className="flex justify-between">
                  <span>Stockage Media :</span>
                  <span className="font-semibold text-gray-700">Cloudinary</span>
                </div>
                <div className="flex justify-between">
                  <span>Total ressources :</span>
                  <span className="font-bold text-blue-600">{totalCount} docs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Footer with Logout */}
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-xs text-gray-700">
                  {user.username.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-gray-900 block truncate">
                    {user.username}
                  </span>
                  <span className="text-[10px] text-gray-400 block truncate">
                    Session active
                  </span>
                </div>
              </div>

              <LogoutButton />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </div>

      {/* Moderation Guidelines Modal */}
      {showGuidelines && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 border border-gray-200 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setShowGuidelines(false)}
              className="absolute right-5 top-5 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Charte & Guide de Modération
                </h3>
                <p className="text-xs text-gray-500">
                  Règles d&apos;approbation pour la communauté ApoDocs
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-gray-600 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200/80">
                <span className="font-bold text-gray-900 block mb-0.5">
                  1. Vérification de la Faculté et de la Matière
                </span>
                <p>
                  Assurez-vous que le document correspond bien à l&apos;une des 4 facultés de Nador (FSAN, FEGN, FSJPN, FLLAN) et au module sélectionné.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200/80">
                <span className="font-bold text-gray-900 block mb-0.5">
                  2. Confidentialité & Protection de l&apos;Étudiant
                </span>
                <p>
                  Le nom réel de l&apos;étudiant est strictement réservé à l&apos;administration. En public, seul le pseudonyme sera affiché pour préserver sa vie privée.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200/80">
                <span className="font-bold text-gray-900 block mb-0.5">
                  3. Lisibilité & Intégrité Académique
                </span>
                <p>
                  Rejetez ou supprimez les documents illisibles, les pages blanches, les examens non liés ou tout contenu à caractère publicitaire/inapproprié.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200/80">
                <span className="font-bold text-gray-900 block mb-0.5">
                  4. Non-Duplication
                </span>
                <p>
                  Le système intègre déjà un hachage SHA-256 pour bloquer les fichiers identiques, mais vérifiez que le même sujet n&apos;est pas réuploadé inutilement.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowGuidelines(false)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                J&apos;ai compris
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
