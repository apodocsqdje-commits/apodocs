export default function DocumentViewerLoading() {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50 font-sans animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="h-8 w-24 rounded-lg bg-slate-200" />
          <div className="hidden sm:flex flex-col gap-1">
            <div className="h-5 w-48 bg-slate-200 rounded" />
            <div className="h-3 w-64 bg-slate-100 rounded" />
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="h-8 w-20 rounded-xl bg-slate-200" />
          <div className="h-8 w-24 rounded-xl bg-blue-100" />
        </div>
      </div>

      {/* Viewer body skeleton */}
      <main className="flex-grow overflow-auto flex items-center justify-center bg-slate-200/50 p-3 sm:p-6 md:p-8">
        <div className="w-full sm:w-[85%] max-w-4xl h-[85vh] bg-white shadow-md rounded-xl border border-gray-300" />
      </main>
    </div>
  );
}
