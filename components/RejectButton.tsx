"use client";

import { useState } from "react";
import { XCircle, Loader2 } from "lucide-react";
import { rejectDocument } from "@/actions/rejectAction";

interface RejectButtonProps {
  documentId: string;
  documentTitle?: string;
  onSuccess?: () => void;
  variant?: "table" | "modal";
}

export default function RejectButton({
  documentId,
  documentTitle,
  onSuccess,
  variant = "table",
}: RejectButtonProps) {
  const [isRejecting, setIsRejecting] = useState(false);

  const handleReject = async () => {
    if (
      !window.confirm(
        `Confirmer le rejet du document ${
          documentTitle ? `"${documentTitle}"` : ""
        } ? Il ne sera plus visible sur le site public.`
      )
    ) {
      return;
    }

    setIsRejecting(true);
    try {
      const result = await rejectDocument(documentId);
      if (!result.success) {
        alert(result.error || "Échec du rejet du document.");
      } else {
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      console.error("Reject action error:", err);
      alert("Une erreur inattendue est survenue lors du rejet.");
    } finally {
      setIsRejecting(false);
    }
  };

  if (variant === "modal") {
    return (
      <button
        type="button"
        onClick={handleReject}
        disabled={isRejecting}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 border border-rose-200 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs cursor-pointer"
        title="Rejeter ce document"
      >
        {isRejecting ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600" />
            <span>Rejet en cours...</span>
          </>
        ) : (
          <>
            <XCircle className="w-4 h-4 text-rose-600" />
            <span>Rejeter le document</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleReject}
      disabled={isRejecting}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 border border-rose-200 rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-1 cursor-pointer"
      title={
        documentTitle ? `Rejeter "${documentTitle}"` : "Rejeter ce document"
      }
      aria-label="Rejeter le document"
    >
      {isRejecting ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600" />
          <span>Rejet...</span>
        </>
      ) : (
        <>
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>Rejeter</span>
        </>
      )}
    </button>
  );
}
