"use server";

import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Configure Cloudinary using global environment variables
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

function extractCloudinaryPublicId(url: string): string | null {
  if (!url || typeof url !== "string" || !url.includes("res.cloudinary.com")) {
    return null;
  }

  try {
    const uploadParts = url.split(/\/upload\//);
    if (uploadParts.length < 2) return null;

    let pathAfterUpload = uploadParts[1].split("?")[0].split("#")[0];
    const segments = pathAfterUpload.split("/");

    if (segments.length > 0 && /^v\d+$/.test(segments[0])) {
      segments.shift();
    }

    const publicId = segments.join("/");
    return publicId ? decodeURIComponent(publicId) : null;
  } catch (error) {
    console.error("Erreur extraction publicId:", error);
    return null;
  }
}

export type BulkActionResult = {
  success: boolean;
  count?: number;
  message?: string;
  error?: string;
};

/**
 * Bulk approve multiple documents.
 * Available to SUPER_ADMIN and MODERATOR.
 */
export async function bulkApproveDocuments(
  documentIds: string[]
): Promise<BulkActionResult> {
  try {
    const session = await getSession();

    if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "MODERATOR")) {
      return {
        success: false,
        error: "Unauthorized: Accès refusé pour cette opération groupée.",
      };
    }

    if (!Array.isArray(documentIds) || documentIds.length === 0) {
      return {
        success: false,
        error: "Aucun document sélectionné.",
      };
    }

    const result = await prisma.document.updateMany({
      where: {
        id: { in: documentIds },
      },
      data: {
        status: "APPROVED",
      },
    });

    revalidatePath("/admin");
    revalidatePath("/documents");

    return {
      success: true,
      count: result.count,
      message: `${result.count} document(s) approuvé(s) avec succès.`,
    };
  } catch (error) {
    console.error("Erreur bulkApproveDocuments:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de l'approbation groupée.",
    };
  }
}

/**
 * Bulk reject multiple documents.
 * Available to SUPER_ADMIN and MODERATOR.
 */
export async function bulkRejectDocuments(
  documentIds: string[]
): Promise<BulkActionResult> {
  try {
    const session = await getSession();

    if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "MODERATOR")) {
      return {
        success: false,
        error: "Unauthorized: Accès refusé pour cette opération groupée.",
      };
    }

    if (!Array.isArray(documentIds) || documentIds.length === 0) {
      return {
        success: false,
        error: "Aucun document sélectionné.",
      };
    }

    const result = await prisma.document.updateMany({
      where: {
        id: { in: documentIds },
      },
      data: {
        status: "REJECTED",
      },
    });

    revalidatePath("/admin");
    revalidatePath("/documents");

    return {
      success: true,
      count: result.count,
      message: `${result.count} document(s) rejeté(s).`,
    };
  } catch (error) {
    console.error("Erreur bulkRejectDocuments:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors du rejet groupé.",
    };
  }
}

/**
 * Bulk delete multiple documents from Cloudinary and DB.
 * Strictly SUPER_ADMIN only.
 */
export async function bulkDeleteDocuments(
  items: { id: string; fileUrl: string }[]
): Promise<BulkActionResult> {
  try {
    const session = await getSession();

    if (!session || session.role !== "SUPER_ADMIN") {
      return {
        success: false,
        error: "Unauthorized: Seul un SUPER_ADMIN peut supprimer des documents.",
      };
    }

    if (!Array.isArray(items) || items.length === 0) {
      return {
        success: false,
        error: "Aucun document sélectionné pour la suppression.",
      };
    }

    // Try deleting assets from Cloudinary in parallel
    await Promise.allSettled(
      items.map(async (item) => {
        const publicId = extractCloudinaryPublicId(item.fileUrl);
        if (publicId) {
          const isPdf = /\.pdf($|\?)/i.test(item.fileUrl);
          const resourceType = isPdf ? "raw" : "image";
          try {
            await cloudinary.uploader.destroy(publicId, {
              resource_type: resourceType,
              invalidate: true,
            });
          } catch (cloudErr) {
            console.warn(`Cloudinary destroy fallback for ${publicId}:`, cloudErr);
            // Fallback retry with different resource_type
            try {
              await cloudinary.uploader.destroy(publicId, {
                resource_type: resourceType === "raw" ? "image" : "raw",
                invalidate: true,
              });
            } catch {
              // ignore
            }
          }
        }
      })
    );

    const ids = items.map((i) => i.id);
    const dbResult = await prisma.document.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    revalidatePath("/admin");
    revalidatePath("/documents");

    return {
      success: true,
      count: dbResult.count,
      message: `${dbResult.count} document(s) supprimé(s) définitivement.`,
    };
  } catch (error) {
    console.error("Erreur bulkDeleteDocuments:", error);
    return {
      success: false,
      error: "Une erreur est survenue lors de la suppression groupée.",
    };
  }
}
