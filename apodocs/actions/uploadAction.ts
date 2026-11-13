"use server";

import crypto from "crypto";
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from "cloudinary";
import { prisma } from "@/lib/prisma";
import { NADOR_FACULTIES } from "@/lib/nadorData";
import { DocType } from "@prisma/client";

// Step 2: Configure Cloudinary using global environment variable
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL,
    secure: true,
  });
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export type UploadActionResult = {
  success: boolean;
  message?: string;
  error?: string;
  uploaderToken?: string;
  document?: {
    id: string;
    title: string;
    fileUrl: string;
    type: string;
    status: string;
    fileHash?: string | null;
    realName?: string;
    authorName?: string | null;
    uploaderToken?: string | null;
  };
};

export async function uploadDocument(formData: FormData): Promise<UploadActionResult> {
  try {
    const facultyId = formData.get("facultyId") as string;
    const filiereId = formData.get("filiereId") as string;
    const semesterId = formData.get("semesterId") as string;
    const moduleName = formData.get("moduleName") as string;
    const documentTitle = formData.get("documentTitle") as string;
    const documentType = formData.get("documentType") as string;
    const realName = (formData.get("realName") as string)?.trim();
    const authorNameRaw = (formData.get("authorName") as string)?.trim();
    const authorName = authorNameRaw || "طالب";
    const uploaderTokenRaw = (formData.get("uploaderToken") as string)?.trim();
    const uploaderToken = uploaderTokenRaw || crypto.randomUUID();
    const file = formData.get("file") as File | null;

    // Validate required fields
    if (!documentTitle || !documentTitle.trim()) {
      return { success: false, error: "Le titre du document est obligatoire." };
    }
    if (!realName) {
      return { success: false, error: "الاسم الحقيقي إلزامي لأسباب أمنية وتوثيقية (سري للإدارة فقط)." };
    }
    if (!facultyId || !filiereId || !semesterId || !moduleName) {
      return { success: false, error: "Veuillez sélectionner l'arborescence académique complète." };
    }
    if (!file || !(file instanceof File) || file.size === 0) {
      return { success: false, error: "Veuillez joindre un fichier valide." };
    }

    // Step 1: Check the file's MIME type / extension before uploading
    const isPDF =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    // 1. Convert file to Node.js Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Compute cryptographic SHA-256 hash of the incoming file buffer
    const fileHash = crypto.createHash("sha256").update(buffer).digest("hex");

    // Check if an identical file hash already exists in the database
    const existingDoc = await prisma.document.findFirst({
      where: { fileHash },
      select: {
        id: true,
        title: true,
        status: true,
      },
    });

    if (existingDoc) {
      return {
        success: false,
        error: "هذا الملف مرفوع مسبقاً في المنصة.",
        message: "هذا الملف مرفوع مسبقاً في المنصة.",
      };
    }

    // 2. Upload to Cloudinary using upload_stream (forcing public access)
    const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "apodocs",
          resource_type: isPDF ? "raw" : "auto",
          type: "upload",
          access_mode: "public",
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            reject(error || new Error("Échec de téléversement Cloudinary."));
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.end(buffer);
    });

    const fileUrl = uploadResult.secure_url;

    // Lookup metadata from NADOR_FACULTIES
    const facultyData = NADOR_FACULTIES.find((f) => f.id === facultyId);
    const facultyName = facultyData?.name || facultyId;
    const filiereData = facultyData?.filieres.find((fil) => fil.id === filiereId);
    const filiereName = filiereData?.name || filiereId;
    const semesterNumber = parseInt(semesterId.replace(/\D/g, ""), 10) || 1;

    // Ensure Faculty exists in Database
    let faculty = await prisma.faculty.findFirst({
      where: { acronym: facultyId },
    });
    if (!faculty) {
      faculty = await prisma.faculty.create({
        data: {
          name: facultyName,
          acronym: facultyId,
        },
      });
    }

    // Ensure Department (Filière) exists in Database
    let department = await prisma.department.findFirst({
      where: {
        facultyId: faculty.id,
        name: filiereName,
      },
    });
    if (!department) {
      department = await prisma.department.create({
        data: {
          name: filiereName,
          facultyId: faculty.id,
        },
      });
    }

    // Ensure Subject (Module) exists in Database
    let subject = await prisma.subject.findFirst({
      where: {
        departmentId: department.id,
        name: moduleName,
        semester: semesterNumber,
      },
    });
    if (!subject) {
      subject = await prisma.subject.create({
        data: {
          name: moduleName,
          semester: semesterNumber,
          departmentId: department.id,
        },
      });
    }

    // Step 4: Create Document record in Database with Cloudinary secure_url & fileHash
    const docTypeEnum = (
      ["COURSE", "EXAM", "TD_TP", "SUMMARY"].includes(documentType)
        ? documentType
        : "COURSE"
    ) as DocType;

    const newDocument = await prisma.document.create({
      data: {
        title: documentTitle.trim(),
        type: docTypeEnum,
        fileUrl: fileUrl,
        fileHash: fileHash,
        likes: 0,
        status: "PENDING",
        realName: realName,
        authorName: authorName,
        uploaderToken: uploaderToken,
        subjectId: subject.id,
        createdAt: new Date(),
      },
    });

    return {
      success: true,
      message: "Document téléversé et enregistré avec succès (en attente de validation) !",
      uploaderToken: uploaderToken,
      document: {
        id: newDocument.id,
        title: newDocument.title,
        fileUrl: newDocument.fileUrl,
        type: newDocument.type,
        status: newDocument.status,
        fileHash: newDocument.fileHash,
        realName: newDocument.realName,
        authorName: newDocument.authorName,
        uploaderToken: newDocument.uploaderToken,
      },
    };
  } catch (error) {
    console.error("Erreur uploadDocument Cloudinary Server Action:", error);
    const errorMessage =
      error && typeof error === "object" && "message" in error
        ? String((error as { message: unknown }).message)
        : error instanceof Error
        ? error.message
        : "Une erreur inattendue est survenue lors de l'envoi vers Cloudinary.";
    return {
      success: false,
      error: errorMessage,
    };
  }
}
