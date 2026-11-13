"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { approveDocument } from "@/actions/approveAction";

interface ApproveButtonProps {
  documentId: string;
  documentTitle?: string;
  onSuccess?: () => void;
  variant?: "table" | "modal";
}

export default function ApproveButton({
  documentId,
  documentTitle,
  onSuccess,
  variant = "table",
}: ApproveButtonProps) {
  const [isApproving, setIsApproving] = useState(false);

  const handleApprove = async () => {
    if (
      !window.confirm(
        `Confirmer l'approbation du document ${
          documentTitle ? `"${documentTitle}"` : ""
        } ? Il sera rendu public immédiatement.`
      )
    ) {
      return;
    }

    setIsApproving(true);
    try {
      const result = await approveDocument(documentId);
      if (!result.success) {
        alert(result.error || "Échec de l'approbation du document.");
      } else {
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      console.error("Approve action error:", err);
      alert("Une erreur inattendue est survenue lors de l'approbation.");
    } finally {
      setIsApproving(false);
    }
  };

  if (variant === "modal") {
    return (
      <button
        type="button"
        onClick={handleApprove}
        disabled={isApproving}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xs cursor-pointer"
        title="Approuver et publier ce document"
      >
        {isApproving ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
            <span>Validation en cours...</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>Approuver & Publier</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleApprove}
      disabled={isApproving}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200/80 border border-emerald-200 rounded-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1 cursor-pointer"
      title={
        documentTitle ? `Approuver "${documentTitle}"` : "Approuver ce document"
      }
      aria-label="Approuver le document"
    >
      {isApproving ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
          <span>Approbation...</span>
        </>
      ) : (
        <>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Approuver</span>
        </>
      )}
    </button>
  );
}
