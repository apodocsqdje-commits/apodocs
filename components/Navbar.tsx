"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderSearch,
  Library,
  UploadCloud,
  Info,
  ShieldCheck,
  FileText,
  Menu,
  X,
  Home,
} from "lucide-react";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import { useI18n } from "@/lib/i18nContext";

export default function Navbar() {
  const pathname = usePathname();
  const { t, isRTL } = useI18n();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu whenever route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { href: "/", label: t("nav.home", "Accueil"), icon: Home },
    { href: "/documents", label: t("nav.documents", "Explorer"), icon: FolderSearch },
    { href: "/faculties", label: t("nav.faculties", "Facultés"), icon: Library },
    { href: "/upload", label: t("nav.upload", "Déposer"), icon: UploadCloud },
    { href: "/my-uploads", label: t("nav.my_uploads", "Mes Dépôts"), icon: FileText },
    { href: "/about", label: t("nav.about", "À propos"), icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
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

        {/* Center Section: Desktop Navigation Pills */}
        <nav className="hidden md:flex items-center justify-center gap-1 sm:gap-1.5">
          {navLinks
            .filter((l) => l.href !== "/") // On desktop, Logo links to home
            .map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-blue-50 text-blue-600 shadow-2xs font-semibold"
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

        {/* Right Section: Language Switcher, Admin & Mobile Hamburger Toggle */}
        <div className="flex items-center justify-end gap-2 sm:gap-2.5">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Admin link on desktop */}
          <Link
            href="/admin"
            className={`hidden sm:inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 border cursor-pointer ${
              pathname.startsWith("/admin")
                ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                : "text-gray-700 bg-gray-50 border-gray-200 hover:bg-gray-100 hover:text-gray-900"
            }`}
            title={t("nav.admin", "Administration")}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500 group-hover:text-blue-600" />
            <span>{t("nav.admin", "Admin")}</span>
          </Link>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors cursor-pointer select-none"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? t("nav.close_menu", "Fermer") : t("nav.menu", "Menu")}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-gray-800" /> : <Menu className="w-5 h-5 text-gray-800" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer / Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-40 md:hidden animate-in fade-in duration-200">
          {/* Backdrop blur */}
          <div
            className="fixed inset-0 top-16 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sliding Menu Sheet */}
          <div
            className={`relative bg-white border-b border-gray-200 shadow-xl px-4 py-5 flex flex-col gap-1 max-h-[calc(100vh-4rem)] overflow-y-auto ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 pb-1">
              {t("nav.menu", "Navigation")}
            </div>

            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-blue-50 text-blue-600 border border-blue-100"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                  <span>{label}</span>
                </Link>
              );
            })}

            {/* Admin Link in Mobile Drawer */}
            <div className="pt-3 mt-2 border-t border-gray-100">
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  pathname.startsWith("/admin")
                    ? "bg-blue-600 text-white"
                    : "bg-gray-50 text-gray-800 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <ShieldCheck className="w-5 h-5 text-blue-500" />
                <span>{t("nav.admin", "Administration (Moderation)")}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
