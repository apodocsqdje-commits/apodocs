"use server";

import { getMyUploadsByTokenRaw, getMyUploadsRaw } from "@/lib/documentQueries";

export async function getMyUploadsByToken(token: string) {
  try {
    return await getMyUploadsByTokenRaw(token);
  } catch (error) {
    console.error("Erreur getMyUploadsByToken:", error);
    return [];
  }
}

export async function getMyUploads(ids?: string[], token?: string) {
  try {
    return await getMyUploadsRaw(ids, token);
  } catch (error) {
    console.error("Erreur getMyUploads:", error);
    return [];
  }
}
