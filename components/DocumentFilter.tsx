"use client";

import { useState, useEffect, useTransition, ChangeEvent } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { NADOR_FACULTIES, Faculty, Filiere, Semester } from "@/lib/nadorData";
import { useI18n } from "@/lib/i18nContext";
import {
  Search,
  Filter,
  X,
  ChevronDown,
  Building2,
  FolderTree,
  Calendar,
  BookOpen,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";

export default function DocumentFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { t, isRTL } = useI18n();

  const documentTypeOptions = [
    { value: "", label: t("filter.all_types", "Tous les types") },
    { value: "COURSE", label: t("type.course", "Cours / Notes") },
    { value: "EXAM", label: t("type.exam", "Examens / Past Papers") },
    { value: "TD_TP", label: t("type.td_tp", "TD / TP / Travaux") },
    { value: "SUMMARY", label: t("type.summary", "Résumés / Cheatsheets") },
  ];

  // Read current filter values from URL
  const currentSearch = searchParams.get("search") || "";
  const currentFaculty = searchParams.get("faculty") || "";
  const currentFiliere = searchParams.get("filiere") || "";
  const currentSemester = searchParams.get("semester") || "";
  const currentModule = searchParams.get("module") || "";
  const currentType = searchParams.get("type") || "";

  // Local state for immediate input feedback
  const [searchInput, setSearchInput] = useState(currentSearch);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Sync search input if URL changes externally
  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  // Derived cascade options from NADOR_FACULTIES
  const selectedFacultyObj: Faculty | undefined = NADOR_FACULTIES.find(
    (f) => f.id === currentFaculty
  );
  const availableFilieres: Filiere[] = selectedFacultyObj?.filieres || [];
  const selectedFiliereObj: Filiere | undefined = availableFilieres.find(
    (fil) => fil.id === currentFiliere
  );
  const availableSemesters: Semester[] = selectedFiliereObj?.semesters || [];
  const selectedSemesterObj: Semester | undefined = availableSemesters.find(
    (sem) => sem.id === currentSemester
  );
  const availableModules: string[] = selectedSemesterObj?.modules || [];

  // Helper to push URL updates
  const updateUrlFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Reset pagination to page 1 on filter changes
    params.delete("page");

    Object.entries(updates).forEach(([key, value]) => {
      if (value && value.trim()) {
        params.set(key, value.trim());
      } else {
        params.delete(key);
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  // Debounced search input handler
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== currentSearch) {
        updateUrlFilters({ search: searchInput });
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Cascading change handlers
  const handleFacultyChange = (newFacultyId: string) => {
    updateUrlFilters({
      faculty: newFacultyId || null,
      filiere: null,
      semester: null,
      module: null,
    });
  };

  const handleFiliereChange = (newFiliereId: string) => {
    updateUrlFilters({
      filiere: newFiliereId || null,
      semester: null,
      module: null,
    });
  };

  const handleSemesterChange = (newSemesterId: string) => {
    updateUrlFilters({
      semester: newSemesterId || null,
      module: null,
    });
  };

  const handleModuleChange = (newModuleName: string) => {
    updateUrlFilters({
      module: newModuleName || null,
    });
  };

  const handleTypeChange = (newType: string) => {
    updateUrlFilters({
      type: newType || null,
    });
  };

  const handleResetFilters = () => {
    setSearchInput("");
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  const hasActiveFilters = Boolean(
    currentSearch ||
      currentFaculty ||
      currentFiliere ||
      currentSemester ||
      currentModule ||
      currentType
  );

  return (
    <aside className="w-full lg:w-72 xl:w-80 shrink-0">
      {/* Mobile Toggle Button */}
      <div className="lg:hidden mb-4">
        <button
          type="button"
          onClick={() => setIsMobileOpen((prev) => !prev)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-gray-200 text-sm font-semibold text-gray-800 shadow-2xs active:bg-gray-50 transition cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <span>{t("filter.title", "Filtres")}</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-blue-600" />
            )}
          </div>
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform ${
              isMobileOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Filter Card Container */}
      <div
        className={`bg-white rounded-2xl border border-gray-200 shadow-xs p-5 lg:sticky lg:top-24 transition-all ${
          isMobileOpen ? "block" : "hidden lg:block"
        }`}
      >
        {/* Header with Reset button */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-gray-900 font-bold text-sm">
            <Filter className="w-4 h-4 text-blue-600" />
            <span>{t("filter.title", "Filtres")}</span>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t("filter.reset", "Réinitialiser")}</span>
            </button>
          )}
        </div>

        <div className="space-y-4">
          {/* 1. Document Title Search Input */}
          <div>
            <label
              htmlFor="filter-search"
              className="block text-xs font-semibold text-gray-700 mb-1.5"
            >
              {t("filter.search_label", "Recherche par titre")}
            </label>
            <div className="relative">
              <input
                id="filter-search"
                type="text"
                value={searchInput}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSearchInput(e.target.value)
                }
                placeholder={t("filter.search_placeholder", "Ex: Microéconomie, Algèbre...")}
                className={`w-full ${
                  isRTL ? "pr-8 pl-8" : "pl-8 pr-8"
                } py-2 rounded-lg border border-gray-300 bg-white text-xs text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20`}
              />
              <Search
                className={`w-4 h-4 text-gray-400 absolute ${
                  isRTL ? "right-2.5" : "left-2.5"
                } top-2.5 pointer-events-none`}
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  className={`absolute ${
                    isRTL ? "left-2.5" : "right-2.5"
                  } top-2.5 text-gray-400 hover:text-gray-600 cursor-pointer`}
                  aria-label="Effacer recherche"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* 2. Document Type */}
          <div>
            <label
              htmlFor="filter-type"
              className="block text-xs font-semibold text-gray-700 mb-1.5"
            >
              {t("filter.type", "Type de document")}
            </label>
            <div className="relative">
              <select
                id="filter-type"
                value={currentType}
                onChange={(e) => handleTypeChange(e.target.value)}
                className={`w-full appearance-none ${
                  isRTL ? "pl-8 pr-3" : "pr-8 pl-3"
                } py-2 rounded-lg border border-gray-300 bg-white text-xs text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 cursor-pointer font-medium`}
              >
                {documentTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className={`w-3.5 h-3.5 text-gray-400 absolute ${
                  isRTL ? "left-2.5" : "right-2.5"
                } top-3 pointer-events-none`}
              />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-3 space-y-3">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
              {t("filter.academic_hierarchy", "Parcours académique")}
            </span>

            {/* 3. Faculty Dropdown */}
            <div>
              <label
                htmlFor="filter-faculty"
                className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5"
              >
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                <span>{t("filter.faculty", "Faculté")}</span>
              </label>
              <div className="relative">
                <select
                  id="filter-faculty"
                  value={currentFaculty}
                  onChange={(e) => handleFacultyChange(e.target.value)}
                  className={`w-full appearance-none ${
                    isRTL ? "pl-8 pr-3" : "pr-8 pl-3"
                  } py-2 rounded-lg border border-gray-300 bg-white text-xs text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 cursor-pointer`}
                >
                  <option value="">{t("filter.all_faculties", "Toutes les facultés")}</option>
                  {NADOR_FACULTIES.map((fac) => (
                    <option key={fac.id} value={fac.id}>
                      {fac.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-gray-400 absolute ${
                    isRTL ? "left-2.5" : "right-2.5"
                  } top-3 pointer-events-none`}
                />
              </div>
            </div>

            {/* 4. Filière Dropdown */}
            <div>
              <label
                htmlFor="filter-filiere"
                className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5"
              >
                <FolderTree className="w-3.5 h-3.5 text-blue-600" />
                <span>{t("filter.filiere", "Filière")}</span>
              </label>
              <div className="relative">
                <select
                  id="filter-filiere"
                  value={currentFiliere}
                  onChange={(e) => handleFiliereChange(e.target.value)}
                  disabled={!currentFaculty}
                  className={`w-full appearance-none ${
                    isRTL ? "pl-8 pr-3" : "pr-8 pl-3"
                  } py-2 rounded-lg border text-xs outline-none transition ${
                    !currentFaculty
                      ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white border-gray-300 text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 cursor-pointer"
                  }`}
                >
                  <option value="">
                    {!currentFaculty
                      ? t("upload.select_faculty", "Choisir l'établissement d'abord")
                      : t("filter.all_filieres", "Toutes les filières")}
                  </option>
                  {availableFilieres.map((fil) => (
                    <option key={fil.id} value={fil.id}>
                      {fil.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-gray-400 absolute ${
                    isRTL ? "left-2.5" : "right-2.5"
                  } top-3 pointer-events-none`}
                />
              </div>
            </div>

            {/* 5. Semester Dropdown */}
            <div>
              <label
                htmlFor="filter-semester"
                className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>{t("filter.semester", "Semestre")}</span>
              </label>
              <div className="relative">
                <select
                  id="filter-semester"
                  value={currentSemester}
                  onChange={(e) => handleSemesterChange(e.target.value)}
                  disabled={!currentFiliere}
                  className={`w-full appearance-none ${
                    isRTL ? "pl-8 pr-3" : "pr-8 pl-3"
                  } py-2 rounded-lg border text-xs outline-none transition ${
                    !currentFiliere
                      ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white border-gray-300 text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 cursor-pointer"
                  }`}
                >
                  <option value="">
                    {!currentFiliere
                      ? t("upload.select_filiere", "Choisir la filière d'abord")
                      : t("filter.all_semesters", "Tous les semestres")}
                  </option>
                  {availableSemesters.map((sem) => (
                    <option key={sem.id} value={sem.id}>
                      {sem.id} (Semestre {sem.id.replace("S", "")})
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-gray-400 absolute ${
                    isRTL ? "left-2.5" : "right-2.5"
                  } top-3 pointer-events-none`}
                />
              </div>
            </div>

            {/* 6. Module Dropdown */}
            <div>
              <label
                htmlFor="filter-module"
                className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                <span>{t("filter.module", "Module / Matière")}</span>
              </label>
              <div className="relative">
                <select
                  id="filter-module"
                  value={currentModule}
                  onChange={(e) => handleModuleChange(e.target.value)}
                  disabled={!currentSemester}
                  className={`w-full appearance-none ${
                    isRTL ? "pl-8 pr-3" : "pr-8 pl-3"
                  } py-2 rounded-lg border text-xs outline-none transition ${
                    !currentSemester
                      ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-white border-gray-300 text-gray-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 cursor-pointer"
                  }`}
                >
                  <option value="">
                    {!currentSemester
                      ? t("upload.select_semester", "Choisir le semestre d'abord")
                      : t("filter.all_modules", "Tous les modules")}
                  </option>
                  {availableModules.map((mod) => (
                    <option key={mod} value={mod}>
                      {mod}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-gray-400 absolute ${
                    isRTL ? "left-2.5" : "right-2.5"
                  } top-3 pointer-events-none`}
                />
              </div>
            </div>
          </div>

          {/* Pending indicator */}
          {isPending && (
            <div className="pt-2 flex items-center justify-center gap-2 text-xs text-blue-600">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span>{t("filter.updating", "Mise à jour des résultats...")}</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
