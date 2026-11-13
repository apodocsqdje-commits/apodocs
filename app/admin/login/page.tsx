import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/AdminLoginForm";
import Navbar from "@/components/Navbar";
import { ShieldCheck, GraduationCap, LockKeyhole } from "lucide-react";




export const metadata = {
  title: "Connexion Administration | ApoDocs",
  description: "Espace sécurisé réservé aux administrateurs et modérateurs ApoDocs Nador.",
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const session = await getSession();

  // If already authenticated, redirect to dashboard
  if (session) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          {/* Identity Pill */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3 shadow-xs">
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>Université Mohammed Premier • Nador</span>
            </div>

            <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/25 mb-4">
              <LockKeyhole className="w-6 h-6" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Espace Administration
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-gray-600">
              Accès protégé pour les rôles <span className="font-semibold text-blue-700">SUPER_ADMIN</span> et{" "}
              <span className="font-semibold text-emerald-700">MODERATOR</span>.
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
            <AdminLoginForm />
          </div>

          {/* Quick Notice & Default Credentials Hint */}
          <div className="mt-6 text-center space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50/80 border border-blue-200/80 text-xs text-blue-800 shadow-2xs">
              <span className="font-semibold">Identifiants par défaut :</span>
              <code className="bg-white px-1.5 py-0.5 rounded-md border border-blue-200 font-mono font-bold text-xs text-blue-900">admin</code>
              <span>/</span>
              <code className="bg-white px-1.5 py-0.5 rounded-md border border-blue-200 font-mono font-bold text-xs text-blue-900">admin123</code>
            </div>
            <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-gray-400" />
              <span>Sécurité RBAC garantie par session chiffrée JWT HTTP-Only</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
