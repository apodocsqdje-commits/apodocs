"use client";

import { useState, useRef, useEffect } from "react";
import { useI18n } from "@/lib/i18nContext";
import { Language } from "@/locales";
import { ChevronDown, Check } from "lucide-react";

const languages: { code: Language; label: string; flag: string; nativeName: string }[] = [
  { code: "ar", label: "العربية", flag: "🇲🇦", nativeName: "العربية" },
  { code: "fr", label: "Français", flag: "🇫🇷", nativeName: "Français" },
  { code: "en", label: "English", flag: "🇬🇧", nativeName: "English" },
];

export default function LanguageSwitcher() {
  const { language, setLanguage, isRTL } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click or touch
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const currentLang = languages.find((l) => l.code === language) || languages[1];

  return (
    <div className="relative inline-block text-start" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-gray-700 hover:text-gray-900 border border-gray-200 text-xs font-semibold transition cursor-pointer select-none"
        title="Changer de langue / تغيير اللغة / Change language"
        aria-expanded={isOpen}
      >
        <span className="text-sm leading-none">{currentLang.flag}</span>
        <span className="font-bold uppercase text-[11px] tracking-wide">{currentLang.code}</span>
        <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            isRTL ? "left-0" : "right-0"
          } mt-2 w-44 max-w-[calc(100vw-1.5rem)] rounded-xl bg-white border border-gray-200 shadow-xl py-1.5 z-50 focus:outline-none animate-in fade-in zoom-in-95 duration-150`}
        >
          <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 text-start">
            {language === "ar" ? "اختر اللغة" : language === "fr" ? "Choisir la langue" : "Select language"}
          </div>
          {languages.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full text-start flex items-center justify-between px-3 py-2 text-xs transition cursor-pointer ${
                  isSelected
                    ? "bg-blue-50 text-blue-600 font-bold"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{lang.flag}</span>
                  <span>{lang.nativeName}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
