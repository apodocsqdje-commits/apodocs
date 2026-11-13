"use client";

import { useEffect } from "react";
import {
  X,
  ExternalLink,
  Download,
  User,
  Lock,
} from "lucide-react";
import LikeButton from "./LikeButton";
import ApproveButton from "./ApproveButton";
import RejectButton from "./RejectButton";
import { useI18n } from "@/lib/i18nContext";

export interface PreviewDocumentData {
  id: string;
  title: string;
  type: string;
  fileUrl: string;
  status?: string;
  realName?: string | null;
  authorName?: string | null;
  likes?: number;
  createdAt: string | Date;
  facultyName?: string;
  facultyAcronym?: string;
  departmentName?: string;
  subjectName?: string;
  semester?: number;
}

interface DocumentPreviewModalProps {
  document: PreviewDocumentData | null;
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

export default function DocumentPreviewModal({
  document,
  isOpen,
  onClose,
  isAdmin = false,
}: DocumentPreviewModalProps) {
  const { t, isRTL } = useI18n();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      window.document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !document) return null;

  const isPdf = /\.pdf($|\?)/i.test(document.fileUrl);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl h-[92vh] sm:h-[90vh] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-4 sm:px-5 py-3 sm:py-3.5 border-b border-gray-200 flex items-center justify-between gap-2 sm:gap-3 bg-white shrink-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {document.type}
              </span>
              {document.status === "PENDING" && (
                <span className="px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  {t("myuploads.pending", "En attente de validation")}
                </span>
              )}
              {document.status === "APPROVED" && (
                <span className="px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {t("myuploads.approved", "Approuvé")}
                </span>
              )}
              {document.status === "REJECTED" && (
                <span className="px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                  {t("myuploads.rejected", "Rejeté")}
                </span>
              )}
            </div>

            <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 truncate" title={document.title}>
              {document.title}
            </h2>

            <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-500 pt-0.5 flex-wrap">
              {document.facultyAcronym && (
                <span className="font-semibold text-gray-700">{document.facultyAcronym}</span>
              )}
              {document.departmentName && (
                <>
                  <span>•</span>
                  <span className="truncate max-w-[120px] sm:max-w-[160px]">{document.departmentName}</span>
                </>
              )}
              {document.subjectName && (
                <>
                  <span>•</span>
                  <span className="font-medium text-blue-600 truncate max-w-[120px] sm:max-w-[160px]">
                    {document.subjectName}
                  </span>
                </>
              )}
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <User className="w-3 h-3 text-blue-500" />
                <span>{document.authorName || t("card.default_author", "طالب")}</span>
              </span>
              {isAdmin && document.realName && (
                <span className="inline-flex items-center gap-1 font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded text-[10px]">
                  <Lock className="w-2.5 h-2.5 text-amber-600" />
                  <span>{t("documentViewer.admin_real_name", "Réel:")} {document.realName}</span>
                </span>
              )}
            </div>
          </div>

          {/* Action buttons on top right */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <LikeButton documentId={document.id} initialLikes={document.likes || 0} size="sm" />

            <a
              href={document.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:px-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200 transition text-xs font-semibold inline-flex items-center gap-1 cursor-pointer active:scale-95"
              title={t("card.fullscreen", "Plein écran")}
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden md:inline">{t("card.fullscreen", "Plein écran")}</span>
            </a>

            <a
              href={document.fileUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:px-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-semibold shadow-xs transition inline-flex items-center gap-1 cursor-pointer active:scale-95"
              title={t("card.download", "Télécharger le fichier")}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">{t("card.download", "Télécharger")}</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="p-2 sm:p-2.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer transition active:scale-95"
              aria-label={t("card.close", "Fermer")}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Viewer */}
        <div className="flex-1 bg-slate-100 overflow-hidden flex items-center justify-center p-2 sm:p-4">
          {isPdf ? (
            <iframe
              src={document.fileUrl}
              className="w-full h-full bg-white rounded-xl shadow-inner border border-gray-200"
              title={document.title}
              allow="fullscreen"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center overflow-auto p-2 sm:p-4">
              <img
                src={document.fileUrl}
                alt={document.title}
                className="max-w-full max-h-full object-contain rounded-xl shadow-md border border-gray-200 bg-white"
              />
            </div>
          )}
        </div>

        {/* Admin Quick Action Footer */}
        {isAdmin && (
          <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between gap-3 shrink-0">
            <span className="text-xs text-gray-500">
              Modération directe depuis la prévisualisation
            </span>

            <div className="flex items-center gap-2">
              {document.status !== "REJECTED" && (
                <RejectButton
                  documentId={document.id}
                  documentTitle={document.title}
                  variant="modal"
                  onSuccess={onClose}
                />
              )}

              {document.status !== "APPROVED" && (
                <ApproveButton
                  documentId={document.id}
                  documentTitle={document.title}
                  variant="modal"
                  onSuccess={onClose}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
