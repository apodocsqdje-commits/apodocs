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

/**
 * Extracts the Cloudinary public_id from a Cloudinary URL.
 * Handles both raw assets (e.g. PDFs preserving extension in public_id)
 * and image/auto assets (with or without version and extension).
 */
function extractCloudinaryPublicId(url: string): string | null {
  if (!url || typeof url !== "string" || !url.includes("res.cloudinary.com")) {
    return null;
  }

  try {
    // Cloudinary URL format:
    // https://res.cloudinary.com/<cloud>/<resource_type>/upload/(v<version>/)?<public_id>
    const uploadParts = url.split(/\/upload\//);
    if (uploadParts.length < 2) {
      return null;
    }

    // Isolate path following /upload/
    let pathAfterUpload = uploadParts[1];

    // Strip URL query parameters or anchor tags
    pathAfterUpload = pathAfterUpload.split("?")[0].split("#")[0];

    // Split path into segments
    const segments = pathAfterUpload.split("/");

    // If first segment is a version string (e.g. v1793056220), remove it
    if (segments.length > 0 && /^v\d+$/.test(segments[0])) {
      segments.shift();
    }

    const publicId = segments.join("/");
    return publicId ? decodeURIComponent(publicId) : null;
  } catch (error) {
    console.error("Erreur lors de l'extraction du public_id Cloudinary:", error);
    return null;
  }
}

export type DeleteActionResult = {
  success: boolean;
  message?: string;
  error?: string;
};

/**
 * Server Action: Deletes a document from Cloudinary and the database.
 * @param id The database document UUID
 * @param cloudinaryUrl The fileUrl stored in the database
 */
export async function deleteDocument(
  id: string,
  cloudinaryUrl: string
): Promise<DeleteActionResult> {
  try {
    // Step 6: Security Verification - Read session cookie first
    const session = await getSession();

    if (!session) {
      return {
        success: false,
        error: "Unauthorized: Vous devez être connecté pour supprimer un document.",
      };
    }

    if (session.role !== "SUPER_ADMIN") {
      return {
        success: false,
        error: "Unauthorized: Seul un SUPER_ADMIN peut supprimer des documents.",
      };
    }

    if (!id) {
      return { success: false, error: "L'identifiant du document est requis." };
    }

    // Step 5: Extract public_id from Cloudinary URL
    const publicId = extractCloudinaryPublicId(cloudinaryUrl);

    if (publicId) {
      try {
        console.log(`[Cloudinary Destroy] Attempting deletion with resource_type: "raw" for: ${publicId}`);
        // First try destroying as 'raw' (used for PDFs and documents)
        let destroyResult = await cloudinary.uploader.destroy(publicId, {
          resource_type: "raw",
        });

        // If not found or failed, try image resource_type (with & without extension)
        if (destroyResult.result !== "ok") {
          console.log(`[Cloudinary Destroy] Raw returned '${destroyResult.result}'. Retrying with resource_type: "image"...`);
          
          const publicIdWithoutExt = publicId.replace(/\.[^/.]+$/, "");
          destroyResult = await cloudinary.uploader.destroy(publicIdWithoutExt, {
            resource_type: "image",
          });

          if (destroyResult.result !== "ok") {
            destroyResult = await cloudinary.uploader.destroy(publicId, {
              resource_type: "image",
            });
          }
        }

        console.log("[Cloudinary Destroy] Final result:", destroyResult);
      } catch (cloudError) {
        // Log warning but proceed with DB deletion so records don't stay orphaned
        console.warn("[Cloudinary Destroy] Warning during cloud deletion:", cloudError);
      }
    } else {
      console.log(`[Cloudinary Destroy] URL is not a Cloudinary resource or public_id could not be extracted: ${cloudinaryUrl}`);
    }

    // Remove the record from the Prisma database
    await prisma.document.delete({
      where: { id },
    });

    // Revalidate paths to refresh cached pages
    revalidatePath("/admin");
    revalidatePath("/documents");

    return {
      success: true,
      message: "Document supprimé avec succès.",
    };
  } catch (error) {
    console.error("Erreur deleteDocument Server Action:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de la suppression du document.",
    };
  }
}
