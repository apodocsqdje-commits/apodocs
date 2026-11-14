"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18nContext";

export default function DocumentViewerBody({
  fileUrl,
  title,
  isImage,
}: {
  fileUrl: string;
  title: string;
  isImage: boolean;
}) {
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();

  return (
    <main className="flex-grow overflow-auto flex items-center justify-center bg-slate-200/50 p-3 sm:p-6 md:p-8 relative">
      {isImage ? (
        <img
          src={fileUrl}
          alt={title}
          className="w-auto h-auto max-w-[95%] sm:max-w-[70%] max-h-[85vh] object-contain shadow-md rounded-xl border border-gray-200 bg-white"
        />
      ) : (
        <div className="w-full sm:w-[85%] max-w-4xl h-[85vh] relative rounded-xl shadow-md border border-gray-300 bg-white overflow-hidden">
          {loading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white">
              <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold text-gray-700 animate-pulse">
                {t("documentViewer.loading", "Chargement du document...")}
              </p>
            </div>
          )}
          <iframe
            src={fileUrl}
            className="w-full h-full"
            title={title}
            allow="fullscreen"
            onLoad={() => setLoading(false)}
          />
        </div>
      )}
    </main>
  );
}
