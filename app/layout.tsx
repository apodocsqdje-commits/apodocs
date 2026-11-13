import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18nContext";

export const metadata: Metadata = {
  title: "ApoDocs - Nador University Platform",
  description: "Access lectures, exams, and summaries for all Nador faculties",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <I18nProvider>
          <div className="min-h-screen bg-gray-50">{children}</div>
        </I18nProvider>
      </body>
    </html>
  );
}
