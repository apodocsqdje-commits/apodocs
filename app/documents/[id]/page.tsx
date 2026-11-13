import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { documentCardSelect } from "@/lib/cachedData";
import DocumentViewerHeader from "@/components/DocumentViewerHeader";

type PageParams = Promise<{
  id: string;
}>;

interface DocumentViewerPageProps {
  params: PageParams;
}

export const dynamic = "force-dynamic";

export default async function DocumentViewerPage({ params }: DocumentViewerPageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const document = await prisma.document.findUnique({
    where: { id },
    select: documentCardSelect,
  });

  if (!document) {
    notFound();
  }

  const faculty = document.subject?.department?.faculty;
  const department = document.subject?.department;
  const subject = document.subject;

  // Detect image files vs PDFs
  const isPdf = /\.pdf($|\?)/i.test(document.fileUrl);
  const isImage =
    !isPdf &&
    (/\.(png|jpe?g|webp|gif|svg)($|\?)/i.test(document.fileUrl) ||
      document.fileUrl.includes("/image/upload/"));

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-50 font-sans">
      <DocumentViewerHeader
        document={{
          id: document.id,
          title: document.title,
          type: document.type,
          fileUrl: document.fileUrl,
          likes: document.likes || 0,
          authorName: document.authorName,
          createdAt: document.createdAt,
          facultyAcronym: faculty?.acronym,
          departmentName: department?.name,
          subjectName: subject?.name,
          semester: subject?.semester,
        }}
      />

      {/* Centered Viewer Body */}
      <main className="flex-grow overflow-auto flex items-center justify-center bg-slate-200/50 p-3 sm:p-6 md:p-8">
        {isImage ? (
          <img
            src={document.fileUrl}
            alt={document.title}
            className="w-auto h-auto max-w-[95%] sm:max-w-[70%] max-h-[85vh] object-contain shadow-md rounded-xl border border-gray-200 bg-white"
          />
        ) : (
          <iframe
            src={document.fileUrl}
            className="w-full sm:w-[85%] max-w-4xl h-[85vh] bg-white shadow-md rounded-xl border border-gray-300"
            title={document.title}
            allow="fullscreen"
          />
        )}
      </main>
    </div>
  );
}
