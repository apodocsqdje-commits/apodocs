"use client";

import { useState, useRef, DragEvent, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { NADOR_FACULTIES, Faculty, Filiere, Semester } from "@/lib/nadorData";
import { uploadDocument } from "@/actions/uploadAction";
import {
  GraduationCap,
  FileText,
  UploadCloud,
  CheckCircle2,
  Trash2,
  ChevronDown,
  Loader2,
  AlertCircle,
  X,
  ExternalLink,
  User,
  Lock,
  Clock,
} from "lucide-react";
import MyUploadsSection from "@/components/MyUploadsSection";
import { useI18n } from "@/lib/i18nContext";

const documentTypes = [
  { value: "COURSE", label: "Course / Lecture Notes (Cours)" },
  { value: "EXAM", label: "Exam / Past Paper (Examen)" },
  { value: "TD_TP", label: "TD / TP / Lab Exercise (Travaux Dirigés)" },
  { value: "SUMMARY", label: "Summary / Cheatsheet (Résumé)" },
] as const;

export default function UploadPage() {
  const { t, isRTL } = useI18n();

  // Initial state derived from the first faculty in NADOR_FACULTIES
  const initialFaculty = NADOR_FACULTIES[0];
  const initialFiliere = initialFaculty.filieres[0];
  const initialSemester = initialFiliere.semesters[0];
  const initialModule = initialSemester.modules[0] || "";

  const [facultyId, setFacultyId] = useState<string>(initialFaculty.id);
  const [filiereId, setFiliereId] = useState<string>(initialFiliere.id);
  const [semesterId, setSemesterId] = useState<string>(initialSemester.id);
  const [selectedModule, setSelectedModule] = useState<string>(initialModule);

  const [docType, setDocType] = useState<string>("COURSE");
  const [title, setTitle] = useState("");
  const [realName, setRealName] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Server Action state
  const [isUploading, setIsUploading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
    document?: {
      id: string;
      title: string;
      fileUrl: string;
      type: string;
    };
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derived current selections
  const currentFaculty: Faculty | undefined = NADOR_FACULTIES.find(
    (f) => f.id === facultyId
  );
  const availableFilieres: Filiere[] = currentFaculty?.filieres || [];
  const currentFiliere: Filiere | undefined = availableFilieres.find(
    (f) => f.id === filiereId
  );
  const availableSemesters: Semester[] = currentFiliere?.semesters || [];
  const currentSemester: Semester | undefined = availableSemesters.find(
    (s) => s.id === semesterId
  );
  const availableModules: string[] = currentSemester?.modules || [];

  // Dynamic Cascading Handlers
  const handleFacultyChange = (newFacultyId: string) => {
    setFacultyId(newFacultyId);
    const newFaculty = NADOR_FACULTIES.find((f) => f.id === newFacultyId);
    const firstFiliere = newFaculty?.filieres[0];
    const firstSemester = firstFiliere?.semesters[0];
    const firstModule = firstSemester?.modules[0] || "";

    setFiliereId(firstFiliere?.id || "");
    setSemesterId(firstSemester?.id || "");
    setSelectedModule(firstModule);
  };

  const handleFiliereChange = (newFiliereId: string) => {
    setFiliereId(newFiliereId);
    const newFiliere = availableFilieres.find((f) => f.id === newFiliereId);
    const firstSemester = newFiliere?.semesters[0];
    const firstModule = firstSemester?.modules[0] || "";

    setSemesterId(firstSemester?.id || "");
    setSelectedModule(firstModule);
  };

  const handleSemesterChange = (newSemesterId: string) => {
    setSemesterId(newSemesterId);
    const newSemester = availableSemesters.find((s) => s.id === newSemesterId);
    const firstModule = newSemester?.modules[0] || "";

    setSelectedModule(firstModule);
  };

  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!realName.trim()) {
      setFeedback({
        type: "error",
        message: "يرجى إدخال الاسم الحقيقي (مطلوب لأغراض التحقق والمصداقية).",
      });
      return;
    }

    if (!file) {
      setFeedback({
        type: "error",
        message: "Veuillez joindre un fichier (PDF ou Image) à téléverser.",
      });
      return;
    }

    setIsUploading(true);
    setFeedback(null);

    try {
      // Get or initialize persistent anonymous student token
      let token = "";
      try {
        token = localStorage.getItem("apodocs_token") || "";
        if (!token) {
          token = crypto.randomUUID();
          localStorage.setItem("apodocs_token", token);
        }
      } catch {
        token = crypto.randomUUID();
      }

      const formData = new FormData();
      formData.append("facultyId", facultyId);
      formData.append("filiereId", filiereId);
      formData.append("semesterId", semesterId);
      formData.append("moduleName", selectedModule);
      formData.append("documentTitle", title);
      formData.append("documentType", docType);
      formData.append("realName", realName);
      formData.append("authorName", authorName.trim() || "طالب");
      formData.append("uploaderToken", token);
      formData.append("file", file);

      const result = await uploadDocument(formData);

      if (result.success) {
        if (result.uploaderToken) {
          try {
            localStorage.setItem("apodocs_token", result.uploaderToken);
          } catch {
            // Ignore storage errors
          }
        }
        setFeedback({
          type: "success",
          message: result.message || "Document enregistré avec succès (en attente de validation) !",
          document: result.document,
        });

        // Persist upload ID to localStorage for uploader's "My Uploads" view
        if (result.document?.id) {
          try {
            const stored = localStorage.getItem("apodocs_my_uploads");
            const ids: string[] = stored ? JSON.parse(stored) : [];
            if (!ids.includes(result.document.id)) {
              ids.push(result.document.id);
              localStorage.setItem("apodocs_my_uploads", JSON.stringify(ids));
            }
          } catch {
            // Ignore storage errors
          }
        }

        // Clear form fields upon successful submission
        setTitle("");
        setRealName("");
        setAuthorName("");
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setFeedback({
          type: "error",
          message: result.error || "Une erreur est survenue lors de l'enregistrement.",
        });
      }
    } catch (error) {
      console.error("Erreur soumission:", error);
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Erreur inattendue de connexion au serveur.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-3">
              <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
              <span>{t("hero.pill", "Nador University Academic Repository")}</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
              {t("upload.page_title", "Upload Academic Document")}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {t("upload.page_subtitle", "Share lecture notes, exams, or summaries across higher education institutions in Nador.")}
            </p>
          </div>

          {/* Submission Feedback Alert */}
          {feedback && (
            <div
              className={`mb-6 p-4 rounded-xl border flex items-start gap-3 shadow-xs transition-all ${
                feedback.type === "success"
                  ? "bg-green-50 border-green-200 text-green-900"
                  : "bg-red-50 border-red-200 text-red-900"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
              )}
              <div className="flex-1 text-sm">
                <p className="font-semibold">{feedback.message}</p>
                {feedback.document && (
                  <div className="mt-2 text-xs text-green-800 space-y-1">
                    <p>
                      <span className="font-medium text-green-950">ID Base de données:</span>{" "}
                      <span className="font-mono bg-white/70 px-1.5 py-0.5 rounded border border-green-300">
                        {feedback.document.id}
                      </span>
                    </p>
                    <p className="flex items-center gap-1.5 pt-0.5">
                      <span className="font-medium text-green-950">Lien Cloudinary:</span>
                      <a
                        href={feedback.document.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-green-950 inline-flex items-center gap-1 truncate max-w-xs"
                      >
                        <span className="truncate">{feedback.document.fileUrl}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </p>
                    <div className="pt-2">
                      <Link
                        href="/my-uploads"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{isRTL ? "متابعة وثائقي في صفحة مرفوعاتي" : "Suivre mes dépôts"}</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setFeedback(null)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-0.5 rounded-md"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Upload Form Card */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6"
          >
            {/* Document Title */}
            <div>
              <label
                htmlFor="doc-title"
                className="block text-sm font-semibold text-gray-900 mb-1.5"
              >
                {t("upload.title_label", "Document Title")} <span className="text-blue-600">*</span>
              </label>
              <div className="relative">
                <input
                  id="doc-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("upload.title_placeholder", "e.g., Chapitre 1 - Introduction et Définitions Clés")}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                />
              </div>
            </div>

            {/* Academic Classification: Cascading Dropdowns */}
            <div className="border border-gray-100 rounded-xl bg-gray-50/50 p-4 sm:p-5 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>{t("upload.step1", "Academic Hierarchy")}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Faculty Dropdown */}
                <div>
                  <label
                    htmlFor="faculty-select"
                    className="block text-xs font-semibold text-gray-700 mb-1"
                  >
                    {t("upload.faculty_label", "Faculty")} <span className="text-blue-600">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="faculty-select"
                      value={facultyId}
                      onChange={(e) => handleFacultyChange(e.target.value)}
                      className="w-full appearance-none px-3.5 py-2.5 pr-10 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 font-medium cursor-pointer"
                    >
                      {NADOR_FACULTIES.map((fac) => (
                        <option key={fac.id} value={fac.id}>
                          {fac.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-500 pointer-events-none absolute inset-y-0 right-3 my-auto" />
                  </div>
                </div>

                {/* 2. Filière Dropdown */}
                <div>
                  <label
                    htmlFor="filiere-select"
                    className="block text-xs font-semibold text-gray-700 mb-1"
                  >
                    {t("upload.filiere_label", "Filière")} <span className="text-blue-600">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="filiere-select"
                      value={filiereId}
                      onChange={(e) => handleFiliereChange(e.target.value)}
                      className="w-full appearance-none px-3.5 py-2.5 pr-10 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 cursor-pointer"
                    >
                      {availableFilieres.map((fil) => (
                        <option key={fil.id} value={fil.id}>
                          {fil.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-500 pointer-events-none absolute inset-y-0 right-3 my-auto" />
                  </div>
                </div>

                {/* 3. Semester Dropdown */}
                <div>
                  <label
                    htmlFor="semester-select"
                    className="block text-xs font-semibold text-gray-700 mb-1"
                  >
                    {t("upload.semester_label", "Semester")} <span className="text-blue-600">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="semester-select"
                      value={semesterId}
                      onChange={(e) => handleSemesterChange(e.target.value)}
                      className="w-full appearance-none px-3.5 py-2.5 pr-10 rounded-lg border border-gray-300 bg-white text-sm text-blue-600 font-semibold outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 cursor-pointer"
                    >
                      {availableSemesters.map((sem) => (
                        <option key={sem.id} value={sem.id}>
                          {sem.id} (Semestre {sem.id.replace("S", "")})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-500 pointer-events-none absolute inset-y-0 right-3 my-auto" />
                  </div>
                </div>

                {/* 4. Module Dropdown */}
                <div>
                  <label
                    htmlFor="module-select"
                    className="block text-xs font-semibold text-gray-700 mb-1"
                  >
                    {t("upload.module_label", "Module")} <span className="text-blue-600">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="module-select"
                      value={selectedModule}
                      onChange={(e) => setSelectedModule(e.target.value)}
                      className="w-full appearance-none px-3.5 py-2.5 pr-10 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 cursor-pointer"
                    >
                      {availableModules.map((mod) => (
                        <option key={mod} value={mod}>
                          {mod}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-gray-500 pointer-events-none absolute inset-y-0 right-3 my-auto" />
                  </div>
                </div>
              </div>

              {/* Dynamic Path Breadcrumb Indicator */}
              <div className="pt-2 text-xs text-gray-500 flex items-center flex-wrap gap-1.5 font-medium">
                <span className="text-gray-400">Target:</span>
                <span className="px-2 py-0.5 rounded bg-white border border-gray-200 text-gray-700 font-semibold">
                  {facultyId}
                </span>
                <span>/</span>
                <span className="px-2 py-0.5 rounded bg-white border border-gray-200 text-gray-700 font-semibold">
                  {currentFiliere?.id}
                </span>
                <span>/</span>
                <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-700 font-semibold">
                  {semesterId}
                </span>
                <span>/</span>
                <span className="text-gray-900 font-semibold">
                  {selectedModule}
                </span>
              </div>
            </div>

            {/* Document Type Dropdown */}
            <div>
              <label
                htmlFor="doctype-select"
                className="block text-sm font-semibold text-gray-900 mb-1.5"
              >
                {t("upload.type_label", "Document Type")} <span className="text-blue-600">*</span>
              </label>
              <div className="relative">
                <select
                  id="doctype-select"
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 pr-10 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 cursor-pointer"
                >
                  {documentTypes.map((dt) => (
                    <option key={dt.value} value={dt.value}>
                      {dt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-500 pointer-events-none absolute inset-y-0 right-3 my-auto" />
              </div>
            </div>

            {/* Author Attribution Fields */}
            <div className="border border-gray-100 rounded-xl bg-gray-50/50 p-4 sm:p-5 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span>{t("upload.step3", "بيانات الناشر والملكية (Author Attribution)")}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Real Name (Required, Admin-only confidential) */}
                <div>
                  <label
                    htmlFor="real-name"
                    className="block text-xs font-semibold text-gray-800 mb-1 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-amber-600" />
                      <span>{t("upload.realname_label", "الاسم الحقيقي (سري - للإدارة فقط)")}</span>
                    </span>
                    <span className="text-red-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="real-name"
                      type="text"
                      required
                      value={realName}
                      onChange={(e) => setRealName(e.target.value)}
                      placeholder="مثال: يوسف الإدريسي"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-gray-500">
                    {t("upload.realname_help", "لحماية جودة المحتوى والمسؤولية القانونية. لن يظهر هذا الاسم مطلقاً للعامة.")}
                  </p>
                </div>

                {/* 2. Public Author Pseudonym (Optional) */}
                <div>
                  <label
                    htmlFor="author-name"
                    className="block text-xs font-semibold text-gray-800 mb-1 flex items-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>{t("upload.pseudonym_label", "الاسم المستعار (اختياري - سيظهر للعامة)")}</span>
                  </label>
                  <div className="relative">
                    <input
                      id="author-name"
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder={t("upload.pseudonym_placeholder", "اتركه فارغاً ليظهر كـ: طالب")}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-gray-500">
                    {t("upload.pseudonym_help", "الاسم الذي يظهر للزملاء على بطاقة المستند (الافتراضي: طالب).")}
                  </p>
                </div>
              </div>
            </div>

            {/* Drag & Drop File Upload Zone */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1.5">
                {t("upload.step4", "Fichier")} <span className="text-blue-600">*</span>
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
              />

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`group relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition text-center ${
                  isDragging
                    ? "border-blue-600 bg-blue-50/70 scale-[1.01]"
                    : file
                    ? "border-blue-400 bg-blue-50/30"
                    : "border-gray-300 hover:border-blue-500 hover:bg-gray-50"
                }`}
              >
                {file ? (
                  <div className="flex flex-col items-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 break-all">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatFileSize(file.size)} • Click or drag to replace
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium pt-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove file</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      <span className="text-blue-600 font-semibold hover:underline">
                        {t("upload.drop_title", "Click to upload")}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {t("upload.drop_formats", "PDF, PNG, JPG, or WEBP (Max 25MB)")}
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isUploading}
                className={`w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 transition-all duration-200 flex items-center justify-center gap-2 ${
                  isUploading
                    ? "opacity-75 cursor-not-allowed"
                    : "active:scale-[0.99] cursor-pointer"
                }`}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t("upload.submitting", "Uploading...")}</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    <span>{t("upload.submit_btn", "Upload Document")}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Uploader's Pending and Approved Uploads */}
          <div className="mt-10">
            <MyUploadsSection />
          </div>
        </div>
      </main>
    </div>
  );
}
