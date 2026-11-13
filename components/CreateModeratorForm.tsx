"use client";

import { useActionState, useEffect, useRef } from "react";
import { createModeratorAccount, ManageAdminResult } from "@/actions/manageAdminAction";
import { UserPlus, User, Lock, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function CreateModeratorForm() {
  const [state, formAction, isPending] = useActionState<ManageAdminResult | null, FormData>(
    createModeratorAccount,
    null
  );

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      {state?.error && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
          <span>{state.error}</span>
        </div>
      )}

      {state?.success && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{state.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="mod-username"
            className="block text-xs font-semibold text-gray-700 mb-1"
          >
            Nom d&apos;utilisateur (Modérateur)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <User className="w-4 h-4" />
            </div>
            <input
              id="mod-username"
              name="username"
              type="text"
              required
              minLength={3}
              placeholder="Ex: mod_nador"
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="mod-password"
            className="block text-xs font-semibold text-gray-700 mb-1"
          >
            Mot de passe initial
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="mod-password"
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="Au moins 6 caractères"
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Création du compte...</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Créer le Modérateur</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
