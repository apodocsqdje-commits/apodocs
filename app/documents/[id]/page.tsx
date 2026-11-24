import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import { getDocumentByIdRaw } from "@/lib/documentQueries";
import DocumentViewerHeader from "@/components/DocumentViewerHeader";
import DocumentViewerBody from "@/components/DocumentViewerBody";

type PageParams = Promise<{
  id: string;
}>;

interface DocumentViewerPageProps {
  params: PageParams;
}

export const dynamic = "force-dynamic";

const getCachedDocumentById = (id: string) =>
  unstable_cache(
    async () => getDocumentByIdRaw(id),
    [`document-${id}`],
    { revalidate: 60, tags: ["documents", `doc-${id}`] }
  )();

export default async function DocumentViewerPage({ params }: DocumentViewerPageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const document = await getCachedDocumentById(id);

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

      <DocumentViewerBody
        fileUrl={document.fileUrl}
        title={document.title}
        isImage={isImage}
      />
    </div>
  );
}
