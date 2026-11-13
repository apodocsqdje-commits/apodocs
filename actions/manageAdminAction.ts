"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type ManageAdminResult = {
  success: boolean;
  message?: string;
  error?: string;
};

/**
 * Server Action: Creates a new MODERATOR account.
 * Strictly protected for SUPER_ADMIN role only.
 */
export async function createModeratorAccount(
  prevState: ManageAdminResult | null,
  formData: FormData
): Promise<ManageAdminResult> {
  try {
    // Step 6: Security Verification - Read session cookie first
    const session = await getSession();

    if (!session) {
      return {
        success: false,
        error: "Unauthorized: Vous devez être connecté en tant que SUPER_ADMIN.",
      };
    }

    if (session.role !== "SUPER_ADMIN") {
      return {
        success: false,
        error: "Unauthorized: Seul un SUPER_ADMIN a l'autorisation de créer des comptes modérateurs.",
      };
    }

    const username = (formData.get("username") as string)?.trim();
    const password = (formData.get("password") as string)?.trim();

    if (!username || username.length < 3) {
      return {
        success: false,
        error: "Le nom d'utilisateur doit comporter au moins 3 caractères.",
      };
    }

    if (!password || password.length < 6) {
      return {
        success: false,
        error: "Le mot de passe doit comporter au moins 6 caractères.",
      };
    }

    // Check if username is already taken
    const existing = await prisma.admin.findUnique({
      where: { username },
    });

    if (existing) {
      return {
        success: false,
        error: `Le nom d'utilisateur "${username}" est déjà utilisé.`,
      };
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save as MODERATOR
    await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
        role: "MODERATOR",
      },
    });

    revalidatePath("/admin/manage-admins");

    return {
      success: true,
      message: `Le compte modérateur "${username}" a été créé avec succès.`,
    };
  } catch (error) {
    console.error("Erreur createModeratorAccount:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erreur lors de la création du compte modérateur.",
    };
  }
}

/**
 * Server Action: Revokes access (deletes) a moderator account.
 * Strictly protected for SUPER_ADMIN role only.
 */
export async function revokeAdminAccess(
  adminId: string
): Promise<ManageAdminResult> {
  try {
    // Step 6: Security Verification - Read session cookie first
    const session = await getSession();

    if (!session) {
      return {
        success: false,
        error: "Unauthorized: Vous devez être connecté en tant que SUPER_ADMIN.",
      };
    }

    if (session.role !== "SUPER_ADMIN") {
      return {
        success: false,
        error: "Unauthorized: Seul un SUPER_ADMIN a l'autorisation de révoquer un accès.",
      };
    }

    if (!adminId) {
      return {
        success: false,
        error: "Identifiant du compte requis.",
      };
    }

    // Prevent Super Admin from deleting their own current account
    if (session.id === adminId) {
      return {
        success: false,
        error: "Action impossible: Vous ne pouvez pas révoquer votre propre compte administrateur.",
      };
    }

    const targetAdmin = await prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!targetAdmin) {
      return {
        success: false,
        error: "Le compte administrateur spécifié n'existe pas.",
      };
    }

    // Perform deletion
    await prisma.admin.delete({
      where: { id: adminId },
    });

    revalidatePath("/admin/manage-admins");

    return {
      success: true,
      message: `L'accès pour "${targetAdmin.username}" a été révoqué avec succès.`,
    };
  } catch (error) {
    console.error("Erreur revokeAdminAccess:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Erreur lors de la révocation de l'accès.",
    };
  }
}
