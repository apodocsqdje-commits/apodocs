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
} from "lucide-react";
import MyUploadsSection from "@/components/MyUploadsSection";
import { useI18n } from "@/lib/i18nContext";

export default function UploadPage() {
  const { t, isRTL } = useI18n();

  const documentTypes = [
    { value: "COURSE", label: `${t("type.course", "Cours / Notes")} (Course / Lecture Notes)` },
    { value: "EXAM", label: `${t("type.exam", "Examen / Past Paper")} (Exam)` },
    { value: "TD_TP", label: `${t("type.td_tp", "TD / TP / Travaux")} (Lab Exercises)` },
    { value: "SUMMARY", label: `${t("type.summary", "Résumé / Fiche")} (Summary)` },
  ] as const;

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

  const handleDragOver = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLElement>) => {
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
        message: t("upload.error_realname", "يرجى إدخال الاسم الحقيقي (مطلوب لأغراض التحقق والمصداقية)."),
      });
      return;
    }

    if (!file) {
      setFeedback({
        type: "error",
        message: t("upload.error_file", "يرجى اختيار ملف الوثيقة (PDF أو صورة)."),
      });
      return;
    }

    if (!title.trim()) {
      setFeedback({
        type: "error",
        message: t("upload.error_title", "يرجى إدخال عنوان الوثيقة."),
      });
      return;
    }

    setIsUploading(true);
    setFeedback(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title.trim());
      formData.append("type", docType);
      formData.append("realName", realName.trim());
      formData.append("authorName", authorName.trim());
      formData.append("facultyId", facultyId);
      formData.append("filiereId", filiereId);
      formData.append("semesterId", semesterId);
      formData.append("module", selectedModule);

      // Client session token tracking for anonymous uploads
      let clientToken = "";
      if (typeof window !== "undefined") {
        clientToken = localStorage.getItem("apodocs_token") || "";
        if (!clientToken) {
          clientToken = crypto.randomUUID();
          localStorage.setItem("apodocs_token", clientToken);
        }
      }
      formData.append("uploaderToken", clientToken);

      const result = await uploadDocument(formData);

      if (result.success && result.document) {
        setFeedback({
          type: "success",
          message: t("upload.success_message", "تم إرسال المستند بنجاح إلى فريق التدقيق. سيصبح متاحاً للعموم فور اعتماده."),
          document: result.document,
        });

        // Store document id in localStorage for uploader's live tracking
        if (typeof window !== "undefined") {
          try {
            const stored = localStorage.getItem("apodocs_my_uploads");
            const ids: string[] = stored ? JSON.parse(stored) : [];
            if (!ids.includes(result.document.id)) {
              ids.unshift(result.document.id);
              localStorage.setItem("apodocs_my_uploads", JSON.stringify(ids));
            }
          } catch {
            // Ignore localStorage errors
          }
        }

        // Reset inputs
        setTitle("");
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setFeedback({
          type: "error",
          message: result.error || "Une erreur est survenue lors du téléversement.",
        });
      }
    } catch (err) {
      console.error("Upload submission error:", err);
      setFeedback({
        type: "error",
        message: "Une erreur réseau ou serveur inattendue est survenue. Veuillez réessayer.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* User's Uploads Live Tracker Section */}
        <MyUploadsSection />

        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3 shadow-2xs">
            <UploadCloud className="w-4 h-4 text-blue-600" />
            <span>{t("hero.pill", "Université Mohammed Premier • Nador")}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            {t("upload.page_title", "Téléverser un Document Académique")}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-gray-600 max-w-xl mx-auto">
            {t(
              "upload.page_subtitle",
              "Partagez cours, examens ou résumés pour aider vos collègues des facultés de Nador."
            )}
          </p>
        </div>

        {/* Feedback Alert Banners */}
        {feedback && (
          <div
            className={`mb-6 p-4 rounded-xl border flex items-start justify-between gap-3 animate-in fade-in duration-200 ${
              feedback.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            <div className="flex items-start gap-3">
              {feedback.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="text-sm font-bold">
                  {feedback.type === "success"
                    ? t("upload.success_title", "Document reçu avec succès !")
                    : "Attention"}
                </h4>
                <p className="text-xs mt-0.5 leading-relaxed">{feedback.message}</p>
                {feedback.document && (
                  <div className="mt-2 flex items-center gap-3">
                    <Link
                      href="/my-uploads"
                      className="text-xs font-semibold text-emerald-700 underline hover:text-emerald-900 inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>{t("upload.view_my_uploads", "Voir mes dépôts")}</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-lg cursor-pointer transition"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Upload Form Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Academic Classification: Cascading Dropdowns */}
            <div className="border border-gray-100 rounded-xl bg-gray-50/50 p-4 sm:p-5 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>{t("upload.step1", "1. Arborescence Académique")}</span>
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
                      className={`w-full appearance-none py-2.5 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 font-medium cursor-pointer ${
                        isRTL ? "pl-10 pr-3.5" : "pr-10 pl-3.5"
                      }`}
                    >
                      {NADOR_FACULTIES.map((fac) => (
                        <option key={fac.id} value={fac.id}>
                          {fac.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 pointer-events-none absolute inset-y-0 ${
                        isRTL ? "left-3" : "right-3"
                      } my-auto`}
                    />
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
                      className={`w-full appearance-none py-2.5 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 cursor-pointer ${
                        isRTL ? "pl-10 pr-3.5" : "pr-10 pl-3.5"
                      }`}
                    >
                      {availableFilieres.map((fil) => (
                        <option key={fil.id} value={fil.id}>
                          {fil.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 pointer-events-none absolute inset-y-0 ${
                        isRTL ? "left-3" : "right-3"
                      } my-auto`}
                    />
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
                      className={`w-full appearance-none py-2.5 rounded-lg border border-gray-300 bg-white text-sm text-blue-600 font-semibold outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 cursor-pointer ${
                        isRTL ? "pl-10 pr-3.5" : "pr-10 pl-3.5"
                      }`}
                    >
                      {availableSemesters.map((sem) => (
                        <option key={sem.id} value={sem.id}>
                          {sem.id} (Semestre {sem.id.replace("S", "")})
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 pointer-events-none absolute inset-y-0 ${
                        isRTL ? "left-3" : "right-3"
                      } my-auto`}
                    />
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
                      className={`w-full appearance-none py-2.5 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 cursor-pointer ${
                        isRTL ? "pl-10 pr-3.5" : "pr-10 pl-3.5"
                      }`}
                    >
                      {availableModules.map((mod) => (
                        <option key={mod} value={mod}>
                          {mod}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 pointer-events-none absolute inset-y-0 ${
                        isRTL ? "left-3" : "right-3"
                      } my-auto`}
                    />
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

            {/* Document Details Section */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>{t("upload.step2", "2. Informations du Document")}</span>
              </h2>

              {/* Document Title */}
              <div>
                <label
                  htmlFor="doc-title"
                  className="block text-sm font-semibold text-gray-900 mb-1.5"
                >
                  {t("upload.title_label", "Document Title")}{" "}
                  <span className="text-blue-600">*</span>
                </label>
                <input
                  id="doc-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t(
                    "upload.title_placeholder",
                    "Ex: Examen Microéconomie Session Normale 2024"
                  )}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              {/* Document Type Dropdown */}
              <div>
                <label
                  htmlFor="doctype-select"
                  className="block text-sm font-semibold text-gray-900 mb-1.5"
                >
                  {t("upload.type_label", "Document Type")}{" "}
                  <span className="text-blue-600">*</span>
                </label>
                <div className="relative">
                  <select
                    id="doctype-select"
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className={`w-full appearance-none py-2.5 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 cursor-pointer ${
                      isRTL ? "pl-10 pr-4" : "pr-10 pl-4"
                    }`}
                  >
                    {documentTypes.map((dt) => (
                      <option key={dt.value} value={dt.value}>
                        {dt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-500 pointer-events-none absolute inset-y-0 ${
                      isRTL ? "left-3" : "right-3"
                    } my-auto`}
                  />
                </div>
              </div>
            </div>

            {/* Author Attribution Fields */}
            <div className="border border-gray-100 rounded-xl bg-gray-50/50 p-4 sm:p-5 space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span>{t("upload.step3", "Attribution & Confidentialité")}</span>
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
                      <span>{t("upload.realname_label", "Nom complet réel (Confidentiel - Administration)")}</span>
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
                      placeholder={t("upload.realname_placeholder", "Ex: Youssef El Idrissi")}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-gray-500 leading-tight">
                    {t(
                      "upload.realname_help",
                      "Requis pour garantir l'authenticité. Ce nom ne sera jamais affiché publiquement."
                    )}
                  </p>
                </div>

                {/* 2. Public Author Pseudonym (Optional) */}
                <div>
                  <label
                    htmlFor="author-name"
                    className="block text-xs font-semibold text-gray-800 mb-1 flex items-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    <span>{t("upload.pseudonym_label", "Pseudonyme public (Optionnel)")}</span>
                  </label>
                  <div className="relative">
                    <input
                      id="author-name"
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder={t("upload.pseudonym_placeholder", "Ex: Étudiant S3, Anonyme")}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-gray-500 leading-tight">
                    {t(
                      "upload.pseudonym_help",
                      "Si laissé vide, le document sera signé comme 'Étudiant'."
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Drag & Drop File Upload Zone */}
            <div>
              <label htmlFor="file-upload-input" className="block text-sm font-semibold text-gray-900 mb-1.5 cursor-pointer">
                {t("upload.step4", "Fichier")} <span className="text-blue-600">*</span>
              </label>

              <input
                id="file-upload-input"
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

              <label
                htmlFor="file-upload-input"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`group relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl cursor-pointer transition text-center select-none ${
                  isDragging
                    ? "border-blue-600 bg-blue-50/70 scale-[1.01]"
                    : file
                    ? "border-blue-400 bg-blue-50/30"
                    : "border-gray-300 hover:border-blue-500 hover:bg-gray-50 active:bg-gray-100"
                }`}
              >
                {file ? (
                  <div className="flex flex-col items-center space-y-2 pointer-events-auto">
                    <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 break-all">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatFileSize(file.size)} • {t("upload.replace_hint", "Cliquer ou glisser pour remplacer")}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium pt-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{t("upload.remove_file", "Supprimer le fichier")}</span>
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2 pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {t("upload.drop_title", "Cliquez pour choisir un fichier ou glissez-le ici")}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {t("upload.drop_formats", "PDF, PNG, JPG ou WEBP (Max 25 Mo)")}
                      </p>
                    </div>
                  </div>
                )}
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isUploading}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-md shadow-blue-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t("upload.submitting", "Téléversement et vérification...")}</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    <span>{t("upload.submit_btn", "Téléverser le document")}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
