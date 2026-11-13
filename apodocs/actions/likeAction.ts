"use server";

import { prisma } from "@/lib/prisma";

export type LikeActionResult = {
  success: boolean;
  likes: number;
  error?: string;
};

/**
 * Server Action: Increments or decrements the anonymous like count on a document.
 */
export async function toggleLikeDocument(
  documentId: string,
  decrement: boolean = false
): Promise<LikeActionResult> {
  try {
    if (!documentId) {
      return { success: false, likes: 0, error: "Identifiant de document manquant." };
    }

    const doc = await prisma.document.findUnique({
      where: { id: documentId },
      select: { likes: true },
    });

    if (!doc) {
      return { success: false, likes: 0, error: "Document introuvable." };
    }

    const newLikes = decrement ? Math.max(0, doc.likes - 1) : doc.likes + 1;

    const updated = await prisma.document.update({
      where: { id: documentId },
      data: {
        likes: newLikes,
      },
      select: { likes: true },
    });

    return {
      success: true,
      likes: updated.likes,
    };
  } catch (error) {
    console.error("Erreur toggleLikeDocument:", error);
    return {
      success: false,
      likes: 0,
      error: "Impossible de mettre à jour les likes.",
    };
  }
}
