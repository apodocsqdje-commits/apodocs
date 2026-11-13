"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useI18n } from "@/lib/i18nContext";

export default function HomeSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { t, isRTL } = useI18n();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/documents?search=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/documents");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto relative group"
    >
      <div className="flex items-center gap-2 p-1.5 sm:p-2 bg-white rounded-2xl border border-gray-200 shadow-md shadow-blue-900/5 hover:border-blue-300 transition-all focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-600/10">
        <div className="px-3 text-gray-400 group-focus-within:text-blue-600 transition-colors">
          <Search className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("hero.search_placeholder", "Search documents, courses, exams, or subjects...")}
          className="flex-1 px-2 sm:px-3 py-2 text-sm sm:text-base text-gray-900 placeholder-gray-400 bg-transparent outline-none"
        />

        <button
          type="submit"
          className="px-5 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-all active:scale-[0.98] cursor-pointer flex items-center gap-2 shrink-0 select-none"
        >
          <span>{t("hero.search_btn", "Search")}</span>
        </button>
      </div>

      {/* Suggested Quick Tags (Standard Academic format) */}
      <div className="mt-3 flex items-center justify-center flex-wrap gap-2 text-xs text-gray-500">
        <span className="font-medium text-gray-400">
          {t("hero.suggestions", "Suggestions :")}
        </span>
        {[
          { label: "Python & IA", query: "Python" },
          { label: "Microéconomie", query: "Microéconomie" },
          { label: "Droit Privé", query: "Droit" },
          { label: "Physique", query: "Physique" },
          { label: "Mathématiques", query: "Mathématiques" },
        ].map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => {
              setQuery(item.query);
              router.push(`/documents?search=${encodeURIComponent(item.query)}`);
            }}
            className="px-2.5 py-1 rounded-full bg-white/80 border border-gray-200 text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 transition cursor-pointer text-[11px] font-medium active:scale-95 select-none"
          >
            {item.label}
          </button>
        ))}
      </div>
    </form>
  );
}
