"use client";

import { useState } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { logoutAdmin } from "@/actions/authAction";

export default function LogoutButton() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutAdmin();
      window.location.href = "/admin/login";
    } catch (err) {
      console.error("Logout error:", err);
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-gray-600 hover:text-red-600 bg-white hover:bg-red-50 border border-gray-300 hover:border-red-200 rounded-xl transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
      title="Se déconnecter"
      aria-label="Se déconnecter"
    >
      {isLoggingOut ? (
        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
      ) : (
        <LogOut className="w-4 h-4 text-gray-500 hover:text-red-600 transition-colors" />
      )}
      <span className="hidden sm:inline">Déconnexion</span>
    </button>
  );
}
