export default function DocumentCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white overflow-hidden shadow-xs flex flex-col h-full animate-pulse">
      {/* Top Thumbnail Skeleton */}
      <div className="relative h-44 bg-slate-100/90 border-b border-gray-100 flex items-center justify-center">
        {/* Mock preview document paper */}
        <div className="w-24 h-32 bg-slate-200/80 rounded-lg shadow-xs flex flex-col justify-between p-2.5">
          <div className="flex justify-between items-center">
            <div className="w-6 h-2 bg-slate-300 rounded" />
            <div className="w-8 h-2 bg-slate-300 rounded" />
          </div>
          <div className="space-y-1.5 py-2">
            <div className="h-1.5 bg-slate-300 rounded w-full" />
            <div className="h-1.5 bg-slate-300 rounded w-4/5" />
            <div className="h-1.5 bg-slate-300 rounded w-2/3" />
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-slate-300/40">
            <div className="w-6 h-1.5 bg-slate-300 rounded" />
            <div className="w-4 h-1.5 bg-slate-300 rounded" />
          </div>
        </div>

        {/* Floating badge placeholders */}
        <div className="absolute top-2.5 left-2.5 w-16 h-5 rounded-full bg-slate-200/80" />
        <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-slate-200/80" />
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Classification tags */}
          <div className="flex items-center gap-2 mb-3">
            <div className="h-4 w-12 bg-slate-200 rounded" />
            <div className="h-4 w-24 bg-slate-200 rounded" />
            <div className="h-4 w-8 bg-slate-200 rounded" />
          </div>

          {/* Title lines */}
          <div className="space-y-2 mb-3">
            <div className="h-4 bg-slate-200 rounded w-5/6" />
            <div className="h-3.5 bg-slate-100 rounded w-1/2" />
          </div>

          {/* Module name */}
          <div className="h-3 bg-slate-100 rounded w-2/3 mb-4" />
        </div>

        {/* Card Footer */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-slate-200" />
            <div className="h-3 w-16 bg-slate-100 rounded" />
          </div>
          <div className="h-8 w-20 bg-slate-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function DocumentGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <DocumentCardSkeleton key={i} />
      ))}
    </div>
  );
}
