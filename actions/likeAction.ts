"use server";

import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";

export type LikeActionResult = {
  success: boolean;
  likes: number;
  error?: string;
};

/**
 * Server Action: Optimized atomic increment/decrement of document likes.
 */
export async function toggleLikeDocument(
  documentId: string,
  decrement: boolean = false
): Promise<LikeActionResult> {
  try {
    if (!documentId) {
      return { success: false, likes: 0, error: "Identifiant de document manquant." };
    }

    // If decrementing, guard against negative counts
    if (decrement) {
      const doc = await prisma.document.findUnique({
        where: { id: documentId },
        select: { likes: true },
      });
      if (!doc || doc.likes <= 0) {
        return { success: true, likes: 0 };
      }
    }

    // Atomic increment/decrement in a single database roundtrip
    const updated = await prisma.document.update({
      where: { id: documentId },
      data: {
        likes: decrement ? { decrement: 1 } : { increment: 1 },
      },
      select: { likes: true },
    });

    try {
      revalidateTag("documents", "default");
    } catch {
      // Ignore cache tag error if outside request context
    }

    return {
      success: true,
      likes: Math.max(0, updated.likes),
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
