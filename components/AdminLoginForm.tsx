"use client";

import { useActionState } from "react";
import { loginAdmin, AuthActionResult } from "@/actions/authAction";
import { ShieldCheck, Lock, User, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState<AuthActionResult | null, FormData>(
    loginAdmin,
    null
  );

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
          <span>{state.error}</span>
        </div>
      )}

      {state?.success && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm">
          <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>Connexion réussie ! Redirection en cours...</span>
          <script
            dangerouslySetInnerHTML={{
              __html: `window.location.href = "/admin";`,
            }}
          />
        </div>
      )}

      <div>
        <label
          htmlFor="username"
          className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5"
        >
          Nom d&apos;utilisateur
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <User className="w-4 h-4" />
          </div>
          <input
            id="username"
            name="username"
            type="text"
            required
            autoComplete="username"
            placeholder="Ex: admin ou mod_aissa"
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5"
        >
          Mot de passe
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Lock className="w-4 h-4" />
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••••••"
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-md shadow-blue-600/20 hover:shadow-lg transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>Vérification des accès...</span>
          </>
        ) : (
          <>
            <span>Se connecter au Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}
