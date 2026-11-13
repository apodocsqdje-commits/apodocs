"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations } from "./translations";

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  dir: "rtl" | "ltr";
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const STORAGE_KEY = "apodocs_lang";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("fr");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY) as Language | null;
      if (savedLang && (savedLang === "ar" || savedLang === "fr" || savedLang === "en")) {
        setLanguageState(savedLang);
        applyDocumentAttributes(savedLang);
      } else {
        // Default to Arabic or French
        applyDocumentAttributes("fr");
      }
    } catch {
      applyDocumentAttributes("fr");
    }
    setMounted(true);
  }, []);

  const applyDocumentAttributes = (lang: Language) => {
    if (typeof document !== "undefined") {
      const dir = lang === "ar" ? "rtl" : "ltr";
      document.documentElement.setAttribute("lang", lang);
      document.documentElement.setAttribute("dir", dir);
    }
  };

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
    } catch {
      // Ignore storage errors
    }
    applyDocumentAttributes(newLang);
  };

  const t = (key: string, fallback?: string): string => {
    const item = translations[key];
    if (item && item[language]) {
      return item[language];
    }
    return fallback || key;
  };

  const dir: "rtl" | "ltr" = language === "ar" ? "rtl" : "ltr";
  const isRTL = language === "ar";

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t,
        dir,
        isRTL,
      }}
    >
      <div dir={dir} className={isRTL ? "font-arabic" : ""}>
        {children}
      </div>
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    // Graceful fallback if called outside provider
    return {
      language: "fr",
      setLanguage: () => {},
      t: (key: string, fallback?: string) => translations[key]?.fr || fallback || key,
      dir: "ltr",
      isRTL: false,
    };
  }
  return context;
}
