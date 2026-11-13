"use client";

import { useState } from "react";
import { UserX, Loader2 } from "lucide-react";
import { revokeAdminAccess } from "@/actions/manageAdminAction";

interface RevokeModeratorButtonProps {
  adminId: string;
  username: string;
  isSelf: boolean;
}

export default function RevokeModeratorButton({
  adminId,
  username,
  isSelf,
}: RevokeModeratorButtonProps) {
  const [isRevoking, setIsRevoking] = useState(false);

  if (isSelf) {
    return (
      <span className="text-[11px] font-medium text-gray-400 italic">
        (Votre compte)
      </span>
    );
  }

  const handleRevoke = async () => {
    if (
      !window.confirm(
        `Êtes-vous sûr de vouloir révoquer l'accès pour le modérateur "${username}" ?`
      )
    ) {
      return;
    }

    setIsRevoking(true);
    try {
      const result = await revokeAdminAccess(adminId);
      if (!result.success) {
        alert(result.error || "Échec de la révocation de l'accès.");
      }
    } catch (err) {
      console.error("Revoke error:", err);
      alert("Une erreur inattendue est survenue.");
    } finally {
      setIsRevoking(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleRevoke}
      disabled={isRevoking}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 active:bg-red-200/80 border border-red-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-xs cursor-pointer"
      title={`Révoquer l'accès pour ${username}`}
      aria-label={`Révoquer l'accès pour ${username}`}
    >
      {isRevoking ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin text-red-600" />
          <span>Révocation...</span>
        </>
      ) : (
        <>
          <UserX className="w-3.5 h-3.5 text-red-600" />
          <span>Revoke Access</span>
        </>
      )}
    </button>
  );
}
