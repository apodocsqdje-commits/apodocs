"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderSearch, Library, UploadCloud, Info, User, ShieldCheck, FileText } from "lucide-react";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import { useI18n } from "@/lib/i18nContext";

export default function Navbar() {
  const pathname = usePathname();
  const { t } = useI18n();

  const navLinks = [
    { href: "/documents", label: t("nav.documents", "Explorer"), icon: FolderSearch },
    { href: "/faculties", label: t("nav.faculties", "Facultés"), icon: Library },
    { href: "/upload", label: t("nav.upload", "Déposer"), icon: UploadCloud },
    { href: "/my-uploads", label: t("nav.my_uploads", "Mes Dépôts"), icon: FileText },
    { href: "/about", label: t("nav.about", "À propos"), icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left Section: Brand Logo */}
        <div className="flex items-center justify-start shrink-0">
          <Link
            href="/"
            className="group inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
          >
            <Logo />
          </Link>
        </div>

        {/* Center Section: Minimalist Navigation Pills */}
        <nav className="hidden md:flex items-center justify-center gap-1 sm:gap-1.5">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-50 text-blue-600 shadow-xs"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-900"
                  }`}
                />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Language Switcher, Admin & User Avatar */}
        <div className="flex items-center justify-end gap-2 sm:gap-2.5">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Mobile compact nav button */}
          <div className="flex md:hidden items-center gap-1">
            <Link
              href="/documents"
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg"
              title={t("nav.documents")}
            >
              <FolderSearch className="w-4 h-4" />
            </Link>
            <Link
              href="/upload"
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg"
              title={t("nav.upload")}
            >
              <UploadCloud className="w-4 h-4" />
            </Link>
            <Link
              href="/my-uploads"
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg"
              title={t("nav.my_uploads", "Mes Dépôts")}
            >
              <FileText className="w-4 h-4" />
            </Link>
          </div>

          <Link
            href="/admin"
            className={`inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 border ${
              pathname === "/admin"
                ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                : "text-gray-700 bg-gray-50 border-gray-200 hover:bg-gray-100 hover:text-gray-900"
            }`}
            title={t("nav.admin", "Administration")}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500 group-hover:text-blue-600" />
            <span className="hidden sm:inline">{t("nav.admin", "Admin")}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
