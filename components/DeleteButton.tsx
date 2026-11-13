"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteDocument } from "@/actions/deleteAction";

interface DeleteButtonProps {
  documentId: string;
  documentUrl: string;
  documentTitle?: string;
}

export default function DeleteButton({
  documentId,
  documentUrl,
  documentTitle,
}: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Confirmer la suppression définitive du document ${
          documentTitle ? `"${documentTitle}"` : ""
        } ? Cette action est irréversible.`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const result = await deleteDocument(documentId, documentUrl);
      if (!result.success) {
        alert(result.error || "Échec de la suppression du document.");
      }
    } catch (err) {
      console.error("Delete action error:", err);
      alert("Une erreur inattendue est survenue lors de la suppression.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 active:bg-red-200/80 border border-red-200 rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 cursor-pointer select-none"
      title={documentTitle ? `Supprimer "${documentTitle}"` : "Supprimer ce document"}
      aria-label="Supprimer le document"
    >
      {isDeleting ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin text-red-600" />
          <span>Deleting...</span>
        </>
      ) : (
        <>
          <Trash2 className="w-3.5 h-3.5 text-red-600" />
          <span>Delete</span>
        </>
      )}
    </button>
  );
}
