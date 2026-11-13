"use client";

import { useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/lib/i18nContext";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { t, isRTL } = useI18n();

  if (totalPages <= 1) return null;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;

    const params = new URLSearchParams(searchParams.toString());
    if (newPage === 1) {
      params.delete("page");
    } else {
      params.set("page", String(newPage));
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
      // Smoothly scroll back to the top of the documents results container
      const target = document.getElementById("documents-results-top");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const from = Math.min((currentPage - 1) * pageSize + 1, totalCount);
  const to = Math.min(currentPage * pageSize, totalCount);

  const PrevIcon = isRTL ? ChevronRight : ChevronLeft;
  const NextIcon = isRTL ? ChevronLeft : ChevronRight;

  return (
    <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
      {/* Items count summary */}
      <div className="text-xs sm:text-sm text-gray-500 font-medium order-2 sm:order-1 text-center sm:text-start">
        {t("pagination.showing", `Affichage de ${from}-${to} sur ${totalCount} documents`)
          .replace("{from}", String(from))
          .replace("{to}", String(to))
          .replace("{total}", String(totalCount))}
      </div>

      {/* Pagination controls */}
      <nav
        aria-label="Pagination"
        className="inline-flex items-center gap-1.5 order-1 sm:order-2"
      >
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isPending}
          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
            currentPage <= 1 || isPending
              ? "border-gray-200 text-gray-300 bg-gray-50/50 cursor-not-allowed"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100 cursor-pointer shadow-2xs"
          }`}
          title={t("pagination.previous", "Précédent")}
        >
          <PrevIcon className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{t("pagination.previous", "Précédent")}</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((item, index) => {
            if (typeof item === "string") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 py-1 text-xs text-gray-400 font-bold select-none"
                >
                  •••
                </span>
              );
            }

            const isCurrent = item === currentPage;
            return (
              <button
                key={`page-${item}`}
                type="button"
                onClick={() => handlePageChange(item)}
                disabled={isPending || isCurrent}
                className={`min-w-[32px] h-8 px-2.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  isCurrent
                    ? "bg-blue-600 text-white font-bold shadow-xs cursor-default"
                    : "text-gray-700 hover:bg-gray-100 active:bg-gray-200 border border-transparent hover:border-gray-200"
                } ${isPending ? "opacity-60 cursor-not-allowed" : ""}`}
                aria-current={isCurrent ? "page" : undefined}
              >
                {item}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages || isPending}
          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
            currentPage >= totalPages || isPending
              ? "border-gray-200 text-gray-300 bg-gray-50/50 cursor-not-allowed"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100 cursor-pointer shadow-2xs"
          }`}
          title={t("pagination.next", "Suivant")}
        >
          <span className="hidden md:inline">{t("pagination.next", "Suivant")}</span>
          <NextIcon className="w-3.5 h-3.5" />
        </button>
      </nav>
    </div>
  );
}
