"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath, revalidateTag } from "next/cache";

export type ApproveActionResult = {
  success: boolean;
  message?: string;
  error?: string;
};

/**
 * Server Action: Approves a pending document.
 * Authorized for both SUPER_ADMIN and MODERATOR roles.
 * Optimized with narrow field selection and cache revalidation.
 */
export async function approveDocument(
  documentId: string
): Promise<ApproveActionResult> {
  try {
    const session = await getSession();

    if (!session) {
      return {
        success: false,
        error: "Unauthorized: Vous devez être connecté pour approuver un document.",
      };
    }

    if (session.role !== "SUPER_ADMIN" && session.role !== "MODERATOR") {
      return {
        success: false,
        error: "Unauthorized: Vos permissions actuelles ne vous permettent pas d'approuver ce document.",
      };
    }

    if (!documentId) {
      return {
        success: false,
        error: "L'identifiant du document est requis.",
      };
    }

    // Update document status with minimal payload selection
    const updatedDoc = await prisma.document.update({
      where: { id: documentId },
      data: { status: "APPROVED" },
      select: { id: true, title: true },
    });

    // Revalidate paths and cache tags
    try {
      revalidatePath("/");
      revalidatePath("/admin");
      revalidatePath("/documents");
      revalidatePath("/faculties");
      revalidateTag("documents", "default");
    } catch {
      // Ignore cache context warning
    }

    return {
      success: true,
      message: `Le document "${updatedDoc.title}" a été approuvé avec succès.`,
    };
  } catch (error) {
    console.error("Erreur approveDocument Server Action:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur est survenue lors de l'approbation du document.",
    };
  }
}
