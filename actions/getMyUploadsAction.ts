"use server";

import { prisma } from "@/lib/prisma";
import { documentCardSelect } from "@/lib/cachedData";

export async function getMyUploadsByToken(token: string) {
  try {
    if (!token || !token.trim()) {
      return [];
    }

    const docs = await prisma.document.findMany({
      where: {
        uploaderToken: token.trim(),
      },
      orderBy: {
        createdAt: "desc",
      },
      select: documentCardSelect,
    });

    return docs;
  } catch (error) {
    console.error("Erreur getMyUploadsByToken:", error);
    return [];
  }
}

export async function getMyUploads(ids?: string[], token?: string) {
  try {
    const conditions: Array<Record<string, unknown>> = [];

    if (token && token.trim()) {
      conditions.push({ uploaderToken: token.trim() });
    }

    if (ids && Array.isArray(ids) && ids.length > 0) {
      const targetIds = ids.slice(-50);
      conditions.push({ id: { in: targetIds } });
    }

    if (conditions.length === 0) {
      return [];
    }

    const docs = await prisma.document.findMany({
      where: conditions.length === 1 ? conditions[0] : { OR: conditions },
      orderBy: {
        createdAt: "desc",
      },
      select: documentCardSelect,
    });

    return docs;
  } catch (error) {
    console.error("Erreur getMyUploads:", error);
    return [];
  }
}
