import Link from "next/link";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import DocumentCard from "@/components/DocumentCard";
import { prisma } from "@/lib/prisma";
import { Sparkles, ArrowRight, FolderSearch } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch total count of approved documents
  const totalCount = await prisma.document.count({
    where: { status: "APPROVED" },
  });

  // Fetch featured / top liked / recent approved documents
  const featuredDocuments = await prisma.document.findMany({
    where: { status: "APPROVED" },
    orderBy: [
      { likes: "desc" },
      { createdAt: "desc" },
    ],
    take: 6,
    include: {
      subject: {
        include: {
          department: {
            include: {
              faculty: true,
            },
          },
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-ump-gray flex flex-col selection:bg-blue-100 selection:text-ump-blue">
      <Navbar />

      <main className="flex-1 pb-16">
        <Hero totalCount={totalCount} />

        {/* Featured / Recent Documents Section on Homepage */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 pt-10 border-t border-gray-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2 border border-blue-200">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Ressources Populaires</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Derniers Documents & Examens Partagés
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Cours complets, résumés et examens validés par les modérateurs universitaires
              </p>
            </div>

            <Link
              href="/documents"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 transition group self-start sm:self-auto"
            >
              <span>Explorer tout l&apos;annuaire ({totalCount})</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {featuredDocuments.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                <FolderSearch className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">
                Aucun document public pour le moment
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto mb-4">
                Partagez le premier cours ou examen de votre filière et aidez vos camarades de Nador !
              </p>
              <Link
                href="/upload"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition"
              >
                <span>Téléverser un document</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredDocuments.map((doc) => (
                <DocumentCard key={doc.id} document={doc} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
