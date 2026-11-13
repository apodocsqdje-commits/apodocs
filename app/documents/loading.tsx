import Navbar from "@/components/Navbar";
import { DocumentGridSkeleton } from "@/components/DocumentCardSkeleton";

export default function DocumentsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-gray-200 animate-pulse">
          <div>
            <div className="h-6 w-44 rounded-full bg-slate-200 mb-2" />
            <div className="h-8 w-64 bg-slate-200 rounded-lg mb-2" />
            <div className="h-4 w-96 max-w-full bg-slate-100 rounded" />
          </div>
          <div className="h-10 w-36 rounded-xl bg-slate-200" />
        </div>

        {/* Layout with Sidebar & Grid */}
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Sidebar Skeleton */}
          <aside className="w-full lg:w-72 xl:w-80 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs p-5 space-y-4 animate-pulse">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="h-4 w-20 bg-slate-200 rounded" />
              </div>
              <div className="space-y-3">
                <div className="h-3 w-28 bg-slate-200 rounded" />
                <div className="h-9 w-full bg-slate-100 rounded-lg" />
              </div>
              <div className="space-y-3">
                <div className="h-3 w-24 bg-slate-200 rounded" />
                <div className="h-9 w-full bg-slate-100 rounded-lg" />
              </div>
              <div className="pt-2 border-t border-gray-100 space-y-3">
                <div className="h-3 w-20 bg-slate-200 rounded" />
                <div className="h-9 w-full bg-slate-100 rounded-lg" />
              </div>
            </div>
          </aside>

          {/* Results Grid Skeleton */}
          <div className="flex-1 w-full min-w-0">
            {/* Status bar skeleton */}
            <div className="flex items-center justify-between mb-4 pb-2 animate-pulse">
              <div className="h-4 w-36 bg-slate-200 rounded" />
            </div>

            {/* Document cards skeleton grid */}
            <DocumentGridSkeleton count={6} />
          </div>
        </div>
      </main>
    </div>
  );
}
