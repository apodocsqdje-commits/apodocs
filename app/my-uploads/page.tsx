"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getMyUploads } from "@/actions/getMyUploadsAction";
import { useI18n } from "@/lib/i18nContext";
import DocumentPreviewModal, {
  PreviewDocumentData,
} from "@/components/DocumentPreviewModal";
import LikeButton from "@/components/LikeButton";
import {
  UploadCloud,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Eye,
  RefreshCw,
  PlusCircle,
  ShieldCheck,
  Search,
  ExternalLink,
  BookOpen,
  Calendar,
  Layers,
  GraduationCap,
  Copy,
  Check,
} from "lucide-react";

export default function MyUploadsPage() {
  const [uploads, setUploads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<PreviewDocumentData | null>(null);
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [token, setToken] = useState<string>("");
  const [copiedToken, setCopiedToken] = useState(false);
  const { t, isRTL } = useI18n();

  const fetchUploads = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      let currentToken = "";
      let legacyIds: string[] = [];

      if (typeof window !== "undefined") {
        currentToken = localStorage.getItem("apodocs_token") || "";
        if (!currentToken) {
          currentToken = crypto.randomUUID();
          localStorage.setItem("apodocs_token", currentToken);
        }
        setToken(currentToken);

        const storedIds = localStorage.getItem("apodocs_my_uploads");
        if (storedIds) {
          try {
            const parsed = JSON.parse(storedIds);
            if (Array.isArray(parsed)) legacyIds = parsed;
          } catch {
            // Ignore parse error
          }
        }
      }

      const docs = await getMyUploads(legacyIds, currentToken);
      setUploads(docs || []);
    } catch (err) {
      console.error("Error fetching my uploads:", err);
      setUploads([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  const handleCopyToken = () => {
    if (!token) return;
    navigator.clipboard.writeText(token);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  // Metrics
  const totalCount = uploads.length;
  const pendingCount = uploads.filter((u) => u.status === "PENDING").length;
  const approvedCount = uploads.filter((u) => u.status === "APPROVED").length;
  const rejectedCount = uploads.filter((u) => u.status === "REJECTED").length;

  // Filtered documents
  const filteredUploads = uploads.filter((doc) => {
    const matchesStatus =
      filterStatus === "ALL" || doc.status === filterStatus;
    const matchesSearch =
      searchQuery.trim() === "" ||
      doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.subject?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.subject?.department?.faculty?.acronym?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-2">
              <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
              <span>{isRTL ? "تتبع الوثائق بدون حساب" : "Suivi Anonyme sans Compte"}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {t("myuploads.title", "Mes Documents Déposés")}
            </h1>
            <p className="mt-1 text-sm text-gray-600 max-w-2xl">
              {t(
                "myuploads.subtitle",
                "Retrouvez ici tous les documents que vous avez partagés depuis ce navigateur. Suivez l'état de validation en direct."
              )}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => fetchUploads(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-2xs transition cursor-pointer disabled:opacity-50"
              title={isRTL ? "تحديث القائمة" : "Actualiser"}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
              <span>{isRTL ? "تحديث" : "Actualiser"}</span>
            </button>

            <Link
              href="/upload"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-xs transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isRTL ? "رفع مستند جديد" : "Déposer un fichier"}</span>
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-2xs">
            <div className="flex items-center justify-between text-gray-500 mb-1">
              <span className="text-xs font-medium">{isRTL ? "إجمالي المرفوعات" : "Total Dépôts"}</span>
              <FileText className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{totalCount}</div>
          </div>

          <div className="bg-white rounded-xl border border-amber-200 p-4 bg-gradient-to-br from-amber-50/50 to-white shadow-2xs">
            <div className="flex items-center justify-between text-amber-700 mb-1">
              <span className="text-xs font-medium">{isRTL ? "قيد المراجعة" : "En Attente"}</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-amber-900">{pendingCount}</div>
          </div>

          <div className="bg-white rounded-xl border border-emerald-200 p-4 bg-gradient-to-br from-emerald-50/50 to-white shadow-2xs">
            <div className="flex items-center justify-between text-emerald-700 mb-1">
              <span className="text-xs font-medium">{isRTL ? "معتمد ومنشور" : "Validés & Publics"}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-emerald-900">{approvedCount}</div>
          </div>

          {rejectedCount > 0 ? (
            <div className="bg-white rounded-xl border border-rose-200 p-4 bg-gradient-to-br from-rose-50/50 to-white shadow-2xs">
              <div className="flex items-center justify-between text-rose-700 mb-1">
                <span className="text-xs font-medium">{isRTL ? "مرفوض" : "Rejetés"}</span>
                <XCircle className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-bold text-rose-900">{rejectedCount}</div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-gray-500 mb-1">
                <span className="text-xs font-medium">{isRTL ? "معرف المتصفح" : "Clé Navigateur"}</span>
                <ShieldCheck className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 truncate font-mono">
                <span className="truncate">{token ? `${token.slice(0, 10)}...` : "—"}</span>
                {token && (
                  <button
                    onClick={handleCopyToken}
                    className="p-1 hover:text-gray-900 text-gray-400 cursor-pointer"
                    title={isRTL ? "نسخ رمز التتبع" : "Copier le jeton"}
                  >
                    {copiedToken ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-3 mb-6 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFilterStatus("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
                filterStatus === "ALL"
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {isRTL ? "الكل" : "Tous"} ({totalCount})
            </button>
            <button
              onClick={() => setFilterStatus("PENDING")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
                filterStatus === "PENDING"
                  ? "bg-amber-600 text-white shadow-2xs"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {isRTL ? "قيد المراجعة" : "En attente"} ({pendingCount})
            </button>
            <button
              onClick={() => setFilterStatus("APPROVED")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
                filterStatus === "APPROVED"
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {isRTL ? "معتمد" : "Validés"} ({approvedCount})
            </button>
            {rejectedCount > 0 && (
              <button
                onClick={() => setFilterStatus("REJECTED")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
                  filterStatus === "REJECTED"
                    ? "bg-rose-600 text-white shadow-2xs"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {isRTL ? "مرفوض" : "Rejetés"} ({rejectedCount})
              </button>
            )}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRTL ? "بحث في مرفوعاتك..." : "Rechercher dans mes dépôts..."}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Content list */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse flex flex-col justify-between h-48"
              >
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
                <div className="h-8 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : filteredUploads.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300 p-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {uploads.length === 0
                ? isRTL
                  ? "لا توجد مستندات مرفوعة من هذا المتصفح"
                  : "Aucun document téléversé depuis ce navigateur"
                : isRTL
                ? "لا توجد نتائج تطابق بحثك"
                : "Aucun résultat trouvé"}
            </h3>
            <p className="text-xs text-gray-500 max-w-md mx-auto mb-6">
              {uploads.length === 0
                ? isRTL
                  ? "يتم تتبع أي ملف ترفعه تلقائياً عبر معرف متصفحك الفريد دون الحاجة لتسجيل حساب. يمكنك البدء بمشاركة أول مستند الآن!"
                  : "Chaque document déposé est automatiquement associé à votre navigateur. Vous pourrez suivre sa validation en temps réel ici."
                : isRTL
                ? "جرب تغيير فلاتر الحالة أو مسح خانة البحث."
                : "Essayez de modifier vos filtres ou termes de recherche."}
            </p>
            {uploads.length === 0 && (
              <Link
                href="/upload"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{isRTL ? "مشاركة أول ملف الآن" : "Déposer mon premier document"}</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredUploads.map((doc) => {
              const isPending = doc.status === "PENDING";
              const isApproved = doc.status === "APPROVED";
              const isRejected = doc.status === "REJECTED";
              const faculty = doc.subject?.department?.faculty;
              const department = doc.subject?.department;
              const subject = doc.subject;

              return (
                <div
                  key={doc.id}
                  className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Status & Type Header */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      {isPending && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span>{t("myuploads.pending", "En attente")}</span>
                        </span>
                      )}
                      {isApproved && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                          <span>{t("myuploads.approved", "Approuvé")}</span>
                        </span>
                      )}
                      {isRejected && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <XCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                          <span>{isRTL ? "مرفوض" : "Rejeté"}</span>
                        </span>
                      )}

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                        {doc.type}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className="font-bold text-gray-900 text-sm line-clamp-2 hover:text-blue-600 transition cursor-pointer"
                      onClick={() =>
                        setSelectedDoc({
                          id: doc.id,
                          title: doc.title,
                          type: doc.type,
                          fileUrl: doc.fileUrl,
                          status: doc.status,
                          authorName: doc.authorName,
                          likes: doc.likes,
                          createdAt: doc.createdAt,
                          facultyAcronym: faculty?.acronym,
                          departmentName: department?.name,
                          subjectName: subject?.name,
                          semester: subject?.semester,
                        })
                      }
                    >
                      {doc.title}
                    </h3>

                    {/* Academic details */}
                    <div className="mt-3 text-xs text-gray-500 space-y-1.5">
                      <p className="truncate">
                        <span className="font-semibold text-gray-700">{faculty?.acronym}</span> • {department?.name}
                      </p>
                      {subject && (
                        <p className="text-blue-600 font-medium truncate">
                          S{subject.semester} - {subject.name}
                        </p>
                      )}
                      <p className="text-[11px] text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                    <LikeButton documentId={doc.id} initialLikes={doc.likes || 0} size="sm" />

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedDoc({
                            id: doc.id,
                            title: doc.title,
                            type: doc.type,
                            fileUrl: doc.fileUrl,
                            status: doc.status,
                            authorName: doc.authorName,
                            likes: doc.likes,
                            createdAt: doc.createdAt,
                            facultyAcronym: faculty?.acronym,
                            departmentName: department?.name,
                            subjectName: subject?.name,
                            semester: subject?.semester,
                          })
                        }
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{t("card.quick_preview", "Aperçu")}</span>
                      </button>

                      {doc.fileUrl && (
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-gray-400 hover:text-gray-700 transition"
                          title={isRTL ? "فتح الملف" : "Ouvrir"}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Document Lightbox Modal */}
        <DocumentPreviewModal
          document={selectedDoc}
          isOpen={Boolean(selectedDoc)}
          onClose={() => setSelectedDoc(null)}
        />
      </main>
    </div>
  );
}
