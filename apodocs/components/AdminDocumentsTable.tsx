"use client";

import { useState, useMemo } from "react";
import {
  FileText,
  ExternalLink,
  Calendar,
  Lock,
  User,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Building2,
  ArrowUpDown,
  BookOpen,
  GraduationCap,
  Layers,
  Download,
  XCircle,
  Trash2,
  CheckSquare,
  Square,
  Loader2,
  Check,
} from "lucide-react";
import ApproveButton from "./ApproveButton";
import RejectButton from "./RejectButton";
import DeleteButton from "./DeleteButton";
import DocumentPreviewModal, { PreviewDocumentData } from "./DocumentPreviewModal";
import {
  bulkApproveDocuments,
  bulkRejectDocuments,
  bulkDeleteDocuments,
} from "@/actions/bulkActions";

export type AdminDocItem = {
  id: string;
  title: string;
  type: string;
  fileUrl: string;
  status: string;
  realName: string;
  authorName: string | null;
  likes: number;
  createdAt: string | Date;
  subject?: {
    name: string;
    semester: number;
    department?: {
      name: string;
      faculty?: {
        name: string;
        acronym: string;
      } | null;
    } | null;
  } | null;
};

interface AdminDocumentsTableProps {
  documents: AdminDocItem[];
  isSuperAdmin: boolean;
  isModerator: boolean;
}

function formatDocumentDate(date: Date | string): string {
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

function getDocTypeBadge(type: string) {
  switch (type) {
    case "COURSE":
      return { label: "Cours", color: "bg-blue-50 text-blue-700 border-blue-200" };
    case "EXAM":
      return { label: "Examen", color: "bg-amber-50 text-amber-700 border-amber-200" };
    case "TD_TP":
      return { label: "TD / TP", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    case "SUMMARY":
      return { label: "Résumé", color: "bg-purple-50 text-purple-700 border-purple-200" };
    default:
      return { label: type, color: "bg-gray-50 text-gray-700 border-gray-200" };
  }
}

function getFacultyBadge(acronym?: string) {
  switch (acronym) {
    case "FSAN":
      return { color: "bg-sky-50 text-sky-700 border-sky-200" };
    case "FEGN":
      return { color: "bg-blue-50 text-blue-700 border-blue-200" };
    case "FSJPN":
      return { color: "bg-indigo-50 text-indigo-700 border-indigo-200" };
    case "FLLAN":
      return { color: "bg-amber-50 text-amber-800 border-amber-200" };
    default:
      return { color: "bg-gray-100 text-gray-700 border-gray-200" };
  }
}

const ITEMS_PER_PAGE = 12;

export default function AdminDocumentsTable({
  documents,
  isSuperAdmin,
  isModerator,
}: AdminDocumentsTableProps) {
  const [selectedDoc, setSelectedDoc] = useState<PreviewDocumentData | null>(null);

  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
  const [facultyFilter, setFacultyFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "likes" | "title">("newest");
  const [currentPage, setCurrentPage] = useState(1);

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  const openPreview = (doc: AdminDocItem) => {
    setSelectedDoc({
      id: doc.id,
      title: doc.title,
      type: doc.type,
      fileUrl: doc.fileUrl,
      status: doc.status,
      realName: doc.realName,
      authorName: doc.authorName,
      likes: doc.likes,
      createdAt: doc.createdAt,
      facultyName: doc.subject?.department?.faculty?.name,
      facultyAcronym: doc.subject?.department?.faculty?.acronym,
      departmentName: doc.subject?.department?.name,
      subjectName: doc.subject?.name,
      semester: doc.subject?.semester,
    });
  };

  // Filtered and Sorted Documents
  const filteredDocuments = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return documents
      .filter((doc) => {
        // Search query filter
        if (q) {
          const matchTitle = doc.title.toLowerCase().includes(q);
          const matchRealName = doc.realName?.toLowerCase().includes(q);
          const matchAuthorName = doc.authorName?.toLowerCase().includes(q);
          const matchSubject = doc.subject?.name?.toLowerCase().includes(q);
          const matchDept = doc.subject?.department?.name?.toLowerCase().includes(q);
          const matchFaculty = doc.subject?.department?.faculty?.acronym?.toLowerCase().includes(q);
          if (
            !matchTitle &&
            !matchRealName &&
            !matchAuthorName &&
            !matchSubject &&
            !matchDept &&
            !matchFaculty
          ) {
            return false;
          }
        }

        // Status Filter
        if (statusFilter !== "ALL" && doc.status !== statusFilter) {
          return false;
        }

        // Faculty Filter
        if (
          facultyFilter !== "ALL" &&
          doc.subject?.department?.faculty?.acronym !== facultyFilter
        ) {
          return false;
        }

        // Type Filter
        if (typeFilter !== "ALL" && doc.type !== typeFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === "oldest") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === "likes") {
          return (b.likes || 0) - (a.likes || 0);
        }
        if (sortBy === "title") {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [documents, searchQuery, statusFilter, facultyFilter, typeFilter, sortBy]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredDocuments.length / ITEMS_PER_PAGE));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const paginatedDocuments = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredDocuments.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredDocuments, validCurrentPage]);

  // Bulk Selection Helpers
  const isAllPaginatedSelected =
    paginatedDocuments.length > 0 &&
    paginatedDocuments.every((d) => selectedIds.includes(d.id));

  const toggleSelectAllPaginated = () => {
    if (isAllPaginatedSelected) {
      const pageIds = new Set(paginatedDocuments.map((d) => d.id));
      setSelectedIds((prev) => prev.filter((id) => !pageIds.has(id)));
    } else {
      const pageIds = paginatedDocuments.map((d) => d.id);
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Bulk Handlers
  const handleBulkApprove = async () => {
    if (!selectedIds.length) return;
    if (
      !window.confirm(
        `Confirmer l'approbation groupée de ${selectedIds.length} document(s) ?`
      )
    ) {
      return;
    }
    setIsBulkLoading(true);
    try {
      const res = await bulkApproveDocuments(selectedIds);
      if (res.success) {
        setSelectedIds([]);
      } else {
        alert(res.error || "Erreur lors de l'approbation groupée.");
      }
    } catch (e) {
      console.error(e);
      alert("Une erreur inattendue est survenue.");
    } finally {
      setIsBulkLoading(false);
    }
  };

  const handleBulkReject = async () => {
    if (!selectedIds.length) return;
    if (
      !window.confirm(
        `Confirmer le rejet groupé de ${selectedIds.length} document(s) ?`
      )
    ) {
      return;
    }
    setIsBulkLoading(true);
    try {
      const res = await bulkRejectDocuments(selectedIds);
      if (res.success) {
        setSelectedIds([]);
      } else {
        alert(res.error || "Erreur lors du rejet groupé.");
      }
    } catch (e) {
      console.error(e);
      alert("Une erreur inattendue est survenue.");
    } finally {
      setIsBulkLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedIds.length) return;
    if (
      !window.confirm(
        `ATTENTION : Vous allez supprimer définitivement ${selectedIds.length} document(s) de Cloudinary et de la base de données. Continuer ?`
      )
    ) {
      return;
    }
    setIsBulkLoading(true);
    try {
      const itemsToDelete = documents
        .filter((d) => selectedIds.includes(d.id))
        .map((d) => ({ id: d.id, fileUrl: d.fileUrl }));

      const res = await bulkDeleteDocuments(itemsToDelete);
      if (res.success) {
        setSelectedIds([]);
      } else {
        alert(res.error || "Erreur lors de la suppression groupée.");
      }
    } catch (e) {
      console.error(e);
      alert("Une erreur inattendue est survenue.");
    } finally {
      setIsBulkLoading(false);
    }
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    statusFilter !== "ALL" ||
    facultyFilter !== "ALL" ||
    typeFilter !== "ALL" ||
    sortBy !== "newest";

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("ALL");
    setFacultyFilter("ALL");
    setTypeFilter("ALL");
    setSortBy("newest");
    setCurrentPage(1);
  };

  const exportToCSV = () => {
    const headers = [
      "ID",
      "Titre",
      "Type",
      "Statut",
      "Faculte",
      "Filiere",
      "Module",
      "Semestre",
      "Nom Reel Confidentiel",
      "Auteur Public",
      "Likes",
      "Date de Depot",
      "URL Fichier",
    ];

    const rows = filteredDocuments.map((doc) => [
      `"${doc.id}"`,
      `"${(doc.title || "").replace(/"/g, '""')}"`,
      `"${doc.type}"`,
      `"${doc.status}"`,
      `"${doc.subject?.department?.faculty?.acronym || ""}"`,
      `"${(doc.subject?.department?.name || "").replace(/"/g, '""')}"`,
      `"${(doc.subject?.name || "").replace(/"/g, '""')}"`,
      `"S${doc.subject?.semester || ""}"`,
      `"${(doc.realName || "").replace(/"/g, '""')}"`,
      `"${(doc.authorName || "").replace(/"/g, '""')}"`,
      doc.likes || 0,
      `"${formatDocumentDate(doc.createdAt)}"`,
      `"${doc.fileUrl}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `apodocs-documents-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Status counts for tab badges
  const pendingCount = documents.filter((d) => d.status === "PENDING").length;
  const approvedCount = documents.filter((d) => d.status === "APPROVED").length;
  const rejectedCount = documents.filter((d) => d.status === "REJECTED").length;

  return (
    <>
      {/* Interactive Control & Search Bar */}
      <div className="p-4 sm:p-5 border-b border-gray-200/90 bg-white">
        <div className="flex flex-col gap-3.5">
          {/* Top Search + Status Tabs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Rechercher par titre, étudiant, matière, filière..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-9 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm bg-gray-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded-full hover:bg-gray-100 transition"
                  title="Effacer la recherche"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Status Tabs (SuperAdmin or when multiple statuses exist) */}
            {isSuperAdmin && (
              <div className="flex items-center gap-1.5 p-1 bg-gray-100/80 rounded-xl border border-gray-200/70 self-start md:self-auto overflow-x-auto max-w-full">
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter("ALL");
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    statusFilter === "ALL"
                      ? "bg-white text-gray-900 shadow-xs"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                  }`}
                >
                  <span>Tous</span>
                  <span className="px-1.5 py-0.2 rounded-md bg-gray-200/70 text-gray-700 text-[10px]">
                    {documents.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter("PENDING");
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    statusFilter === "PENDING"
                      ? "bg-amber-500 text-white shadow-xs"
                      : "text-amber-700 hover:bg-amber-50"
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  <span>En Attente</span>
                  {pendingCount > 0 && (
                    <span
                      className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${
                        statusFilter === "PENDING"
                          ? "bg-amber-600 text-white"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {pendingCount}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter("APPROVED");
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    statusFilter === "APPROVED"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-emerald-700 hover:bg-emerald-50"
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Approuvés</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${
                      statusFilter === "APPROVED"
                        ? "bg-emerald-700 text-white"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {approvedCount}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter("REJECTED");
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    statusFilter === "REJECTED"
                      ? "bg-rose-600 text-white shadow-xs"
                      : "text-rose-700 hover:bg-rose-50"
                  }`}
                >
                  <XCircle className="w-3 h-3" />
                  <span>Rejetés</span>
                  {rejectedCount > 0 && (
                    <span
                      className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${
                        statusFilter === "REJECTED"
                          ? "bg-rose-700 text-white"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {rejectedCount}
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Secondary Dropdown Filters Row */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-gray-100">
            <div className="flex flex-wrap items-center gap-2">
              {/* Faculty Filter */}
              <div className="flex items-center gap-1 text-xs">
                <span className="text-gray-400 text-[11px] font-medium hidden sm:inline">
                  Faculté :
                </span>
                <select
                  value={facultyFilter}
                  onChange={(e) => {
                    setFacultyFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-medium bg-white text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="ALL">Toutes les facultés (4)</option>
                  <option value="FSAN">FSAN - Sciences Appliquées</option>
                  <option value="FEGN">FEGN - Économie & Gestion</option>
                  <option value="FSJPN">FSJPN - Droit & Politiques</option>
                  <option value="FLLAN">FLLAN - Langues, Lettres & Arts</option>
                </select>
              </div>

              {/* Type Filter */}
              <div className="flex items-center gap-1 text-xs">
                <span className="text-gray-400 text-[11px] font-medium hidden sm:inline">
                  Type :
                </span>
                <select
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-medium bg-white text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="ALL">Tous les types</option>
                  <option value="COURSE">Cours</option>
                  <option value="EXAM">Examens</option>
                  <option value="TD_TP">TD / TP</option>
                  <option value="SUMMARY">Résumés</option>
                </select>
              </div>

              {/* Sort By Filter */}
              <div className="flex items-center gap-1 text-xs">
                <span className="text-gray-400 text-[11px] font-medium hidden sm:inline">
                  Tri :
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-medium bg-white text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="newest">Plus récents d&apos;abord</option>
                  <option value="oldest">Plus anciens d&apos;abord</option>
                  <option value="likes">Plus aimés (Likes)</option>
                  <option value="title">Titre alphabétique (A-Z)</option>
                </select>
              </div>

              {/* Reset Filters Pill */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 text-xs font-medium transition cursor-pointer"
                  title="Réinitialiser tous les filtres"
                >
                  <X className="w-3 h-3" />
                  <span>Réinitialiser</span>
                </button>
              )}
            </div>

            {/* Results Count Summary & CSV Export */}
            <div className="flex items-center gap-3 self-end sm:self-auto flex-wrap">
              <div className="text-xs text-gray-500">
                Affichage de{" "}
                <span className="font-bold text-gray-900">
                  {filteredDocuments.length}
                </span>{" "}
                sur {documents.length} document{documents.length > 1 ? "s" : ""}
              </div>

              {filteredDocuments.length > 0 && (
                <button
                  type="button"
                  onClick={exportToCSV}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold shadow-2xs hover:shadow-xs transition cursor-pointer"
                  title="Télécharger la liste sous format CSV / Excel"
                >
                  <Download className="w-3.5 h-3.5 text-blue-600" />
                  <span>Exporter CSV</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating / Sticky Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="sticky top-2 z-30 mx-4 sm:mx-6 my-3 p-3 sm:p-4 rounded-2xl bg-gray-900 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold">
              {selectedIds.length}
            </span>
            <span className="text-xs sm:text-sm font-semibold">
              {selectedIds.length} document{selectedIds.length > 1 ? "s" : ""}{" "}
              sélectionné{selectedIds.length > 1 ? "s" : ""}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleBulkApprove}
              disabled={isBulkLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isBulkLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5" />
              )}
              <span>Approuver</span>
            </button>

            <button
              type="button"
              onClick={handleBulkReject}
              disabled={isBulkLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-200 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 rounded-xl transition disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isBulkLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <XCircle className="w-3.5 h-3.5" />
              )}
              <span>Rejeter</span>
            </button>

            {isSuperAdmin && (
              <button
                type="button"
                onClick={handleBulkDelete}
                disabled={isBulkLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {isBulkLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>Supprimer</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="text-xs text-gray-400 hover:text-white px-2 py-1 transition cursor-pointer"
            >
              Désélectionner
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredDocuments.length === 0 ? (
        <div className="text-center py-16 px-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center text-gray-400">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-gray-900">
            Aucun document ne correspond à vos critères
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
            Essayez de modifier vos filtres de recherche ou de réinitialiser la vue.
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Réinitialiser les filtres</span>
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Main Professional Data Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-50/80 text-gray-600 uppercase text-[11px] font-semibold tracking-wider border-b border-gray-200/90">
                  <th scope="col" className="px-3 sm:px-4 py-3.5 w-10 text-center">
                    <button
                      type="button"
                      onClick={toggleSelectAllPaginated}
                      className="text-gray-400 hover:text-blue-600 transition cursor-pointer"
                      title={
                        isAllPaginatedSelected
                          ? "Tout désélectionner sur cette page"
                          : "Tout sélectionner sur cette page"
                      }
                    >
                      {isAllPaginatedSelected ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th scope="col" className="px-3 sm:px-4 py-3.5 w-16">
                    Aperçu
                  </th>
                  <th scope="col" className="px-3 sm:px-4 py-3.5">
                    Titre & Type
                  </th>
                  <th scope="col" className="px-3 sm:px-4 py-3.5">
                    Faculté & Filière
                  </th>
                  <th scope="col" className="px-3 sm:px-4 py-3.5">
                    Matière / Module
                  </th>
                  <th scope="col" className="px-3 sm:px-4 py-3.5">
                    Auteur (Confidentiel & Public)
                  </th>
                  <th scope="col" className="px-3 sm:px-4 py-3.5">
                    Date & Likes
                  </th>
                  <th scope="col" className="px-3 sm:px-4 py-3.5 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {paginatedDocuments.map((doc) => {
                  const badge = getDocTypeBadge(doc.type);
                  const faculty = doc.subject?.department?.faculty;
                  const department = doc.subject?.department;
                  const subject = doc.subject;
                  const isPending = doc.status === "PENDING";
                  const isApproved = doc.status === "APPROVED";
                  const isRejected = doc.status === "REJECTED";
                  const isPdf = /\.pdf($|\?)/i.test(doc.fileUrl);
                  const facultyBadge = getFacultyBadge(faculty?.acronym);
                  const isSelected = selectedIds.includes(doc.id);

                  return (
                    <tr
                      key={doc.id}
                      className={`hover:bg-blue-50/30 transition-colors duration-150 group ${
                        isSelected ? "bg-blue-50/40" : ""
                      }`}
                    >
                      {/* Checkbox Column */}
                      <td className="px-3 sm:px-4 py-3.5 align-middle text-center">
                        <button
                          type="button"
                          onClick={() => toggleSelectOne(doc.id)}
                          className="text-gray-400 hover:text-blue-600 transition cursor-pointer"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* 1. Thumbnail Preview Column */}
                      <td className="px-3 sm:px-4 py-3.5 align-middle">
                        <button
                          type="button"
                          onClick={() => openPreview(doc)}
                          title="Cliquer pour prévisualiser immédiatement"
                          className="relative w-12 h-14 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center group/thumb hover:border-blue-500 hover:shadow-sm transition-all cursor-pointer shrink-0"
                        >
                          {isPdf ? (
                            <div className="w-full h-full flex flex-col items-center justify-center p-1 bg-gradient-to-b from-red-50 to-red-100/50 text-red-600">
                              <FileText className="w-5 h-5 mb-0.5" />
                              <span className="text-[9px] font-extrabold uppercase">
                                PDF
                              </span>
                            </div>
                          ) : (
                            <img
                              src={doc.fileUrl}
                              alt={doc.title}
                              className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform"
                              loading="lazy"
                            />
                          )}
                          <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity">
                            <Eye className="w-4 h-4 text-white" />
                          </div>
                        </button>
                      </td>

                      {/* 2. Document Title Column */}
                      <td className="px-3 sm:px-4 py-3.5 align-middle max-w-xs sm:max-w-sm">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${badge.color}`}
                          >
                            {badge.label}
                          </span>
                          {isPending && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              <span>En attente</span>
                            </span>
                          )}
                          {isApproved && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Approuvé</span>
                            </span>
                          )}
                          {isRejected && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                              <XCircle className="w-3 h-3 text-rose-600" />
                              <span>Rejeté</span>
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => openPreview(doc)}
                          className="text-left font-bold text-gray-900 truncate mt-1 text-xs sm:text-sm block group-hover:text-blue-600 transition-colors cursor-pointer w-full"
                          title={doc.title}
                        >
                          {doc.title}
                        </button>

                        <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400">
                          <button
                            type="button"
                            onClick={() => openPreview(doc)}
                            className="hover:text-blue-600 transition inline-flex items-center gap-1 cursor-pointer font-medium"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Aperçu modal</span>
                          </button>
                          <span>•</span>
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-blue-600 transition inline-flex items-center gap-1 font-medium"
                            title="Ouvrir le fichier original Cloudinary"
                          >
                            <span>Lien direct</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </td>

                      {/* 3. Faculty & Filière Column */}
                      <td className="px-3 sm:px-4 py-3.5 align-middle whitespace-nowrap">
                        <div>
                          <span
                            className={`inline-block px-2 py-0.5 rounded-md font-bold text-xs border mb-1 ${facultyBadge.color}`}
                          >
                            {faculty?.acronym || "N/A"}
                          </span>
                          <p
                            className="text-gray-500 text-[11px] max-w-[150px] truncate"
                            title={department?.name}
                          >
                            {department?.name || "Non spécifiée"}
                          </p>
                        </div>
                      </td>

                      {/* 4. Module Column */}
                      <td className="px-3 sm:px-4 py-3.5 align-middle whitespace-nowrap">
                        <div>
                          <p
                            className="text-xs font-semibold text-gray-900 max-w-[160px] truncate"
                            title={subject?.name || ""}
                          >
                            {subject?.name || "Non spécifié"}
                          </p>
                          {subject?.semester && (
                            <span className="inline-block mt-0.5 text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-100">
                              Semestre {subject.semester}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 5. Author Column (Confidential Real Name & Public Pseudonym) */}
                      <td className="px-3 sm:px-4 py-3.5 align-middle whitespace-nowrap">
                        <div className="space-y-1">
                          {/* Confidential Real Name */}
                          <div className="flex items-center gap-1.5">
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200/90 shadow-2xs"
                              title="Nom réel de l'étudiant (Strictement Confidentiel - Visible uniquement par l'Administration)"
                            >
                              <Lock className="w-3 h-3 text-amber-600 shrink-0" />
                              <span className="font-mono">{doc.realName}</span>
                            </span>
                          </div>

                          {/* Public Author Pseudonym */}
                          <div className="flex items-center gap-1 text-[11px] text-gray-500 pl-0.5">
                            <User className="w-3 h-3 text-blue-500 shrink-0" />
                            <span className="text-gray-400">Public:</span>
                            <span className="font-medium text-gray-700">
                              {doc.authorName || "طالب"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 6. Date & Likes Column */}
                      <td className="px-3 sm:px-4 py-3.5 align-middle whitespace-nowrap text-xs text-gray-500">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" />
                            <span>{formatDocumentDate(doc.createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-gray-400">
                            <Heart className="w-3 h-3 text-rose-500 fill-rose-100" />
                            <span>{doc.likes || 0} mentions j&apos;aime</span>
                          </div>
                        </div>
                      </td>

                      {/* 7. Action Column */}
                      <td className="px-3 sm:px-4 py-3.5 align-middle whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Preview Button */}
                          <button
                            type="button"
                            onClick={() => openPreview(doc)}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition border border-transparent hover:border-blue-100 cursor-pointer"
                            title="Aperçu rapide modal"
                            aria-label="Aperçu modal"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Approve Button (Visible if not already approved) */}
                          {!isApproved && (
                            <ApproveButton
                              documentId={doc.id}
                              documentTitle={doc.title}
                            />
                          )}

                          {/* Reject Button (Visible if not already rejected) */}
                          {!isRejected && (
                            <RejectButton
                              documentId={doc.id}
                              documentTitle={doc.title}
                            />
                          )}

                          {/* Delete button (STRICTLY for SUPER_ADMIN - NEVER for MODERATOR) */}
                          {isSuperAdmin && (
                            <DeleteButton
                              documentId={doc.id}
                              documentUrl={doc.fileUrl}
                              documentTitle={doc.title}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Footer */}
          {totalPages > 1 && (
            <div className="px-4 sm:px-6 py-3.5 bg-gray-50/75 border-t border-gray-200/90 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-gray-500">
                Page <span className="font-semibold text-gray-900">{validCurrentPage}</span> sur{" "}
                <span className="font-semibold text-gray-900">{totalPages}</span>
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={validCurrentPage === 1}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-2xs cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Précédent</span>
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= validCurrentPage - 1 && page <= validCurrentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={`w-7 h-7 rounded-lg text-xs font-semibold transition cursor-pointer ${
                            page === validCurrentPage
                              ? "bg-blue-600 text-white shadow-xs"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    }
                    if (page === validCurrentPage - 2 || page === validCurrentPage + 2) {
                      return (
                        <span key={page} className="px-1 text-gray-400 text-xs">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={validCurrentPage === totalPages}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-2xs cursor-pointer"
                >
                  <span>Suivant</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Lightbox / Preview Modal */}
      <DocumentPreviewModal
        document={selectedDoc}
        isOpen={Boolean(selectedDoc)}
        onClose={() => setSelectedDoc(null)}
        isAdmin={true}
      />
    </>
  );
}
