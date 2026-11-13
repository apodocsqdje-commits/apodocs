"use client";

import { useState, useEffect } from "react";
import { getMyUploads } from "@/actions/getMyUploadsAction";
import { useI18n } from "@/lib/i18nContext";
import {
  UploadCloud,
  Clock,
  CheckCircle2,
  FileText,
  Eye,
  ChevronRight,
} from "lucide-react";
import DocumentPreviewModal, { PreviewDocumentData } from "./DocumentPreviewModal";
import LikeButton from "./LikeButton";

export default function MyUploadsSection() {
  const [uploads, setUploads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<PreviewDocumentData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { t, isRTL } = useI18n();

  const fetchUploads = async () => {
    try {
      const token = localStorage.getItem("apodocs_token") || undefined;
      let ids: string[] = [];
      const stored = localStorage.getItem("apodocs_my_uploads");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) ids = parsed;
        } catch {
          // Ignore JSON errors
        }
      }

      if (!token && ids.length === 0) {
        setUploads([]);
        setLoading(false);
        return;
      }

      const data = await getMyUploads(ids, token);
      setUploads(data);
    } catch {
      setUploads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  if (loading) {
    return null;
  }

  if (uploads.length === 0) {
    return null;
  }

  const pendingCount = uploads.filter((u) => u.status === "PENDING").length;

  return (
    <div className="mb-8 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white rounded-2xl border border-blue-100 p-5 shadow-xs">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <UploadCloud className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">
              {t("myuploads.title", "Mes Téléversements")} ({uploads.length})
            </h2>
            {pendingCount > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                <Clock className="w-3 h-3" />
                <span>
                  {pendingCount} {isRTL ? "قيد المراجعة" : "en attente"}
                </span>
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-600">
            {t(
              "myuploads.subtitle",
              "Retrouvez ici tous les documents que vous avez partagés. Vos documents en attente sont visibles pour vous mais restent masqués du public jusqu'à leur validation."
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer self-start sm:self-auto shadow-2xs"
        >
          <span>
            {isOpen
              ? isRTL
                ? "إخفاء القائمة"
                : "Masquer la section"
              : isRTL
              ? "عرض وثائقي"
              : "Afficher mes fichiers"}
          </span>
          <ChevronRight
            className={`w-3.5 h-3.5 transition-transform ${
              isOpen ? "rotate-90" : isRTL ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Uploads List Cards */}
      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-3 border-t border-blue-100/60 animate-in fade-in duration-200">
          {uploads.map((doc) => {
            const isPending = doc.status === "PENDING";
            const faculty = doc.subject?.department?.faculty;
            const department = doc.subject?.department;
            const subject = doc.subject;

            return (
              <div
                key={doc.id}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Status Banner */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    {isPending ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3 h-3 shrink-0" />
                        <span>{t("myuploads.pending", "En cours de révision")}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 shrink-0 text-emerald-600" />
                        <span>{t("myuploads.approved", "Vérifié & Public")}</span>
                      </span>
                    )}

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                      {doc.type}
                    </span>
                  </div>

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

                  <div className="mt-2 text-xs text-gray-500 space-y-1">
                    <p className="truncate">
                      <span className="font-semibold text-gray-700">{faculty?.acronym}</span> • {department?.name}
                    </p>
                    {subject && (
                      <p className="text-blue-600 font-medium truncate">
                        S{subject.semester} - {subject.name}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <LikeButton documentId={doc.id} initialLikes={doc.likes || 0} size="sm" />

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
                    <span>{t("card.quick_preview", "Aperçu rapide")}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Preview Lightbox */}
      <DocumentPreviewModal
        document={selectedDoc}
        isOpen={Boolean(selectedDoc)}
        onClose={() => setSelectedDoc(null)}
      />
    </div>
  );
}
