"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  signSessionToken,
  setSessionCookie,
  clearSessionCookie,
  getSession,
  SessionUser,
  SessionRole,
} from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type AuthActionResult = {
  success: boolean;
  message?: string;
  error?: string;
  role?: SessionRole;
};

/**
 * Server Action: Authenticates an Admin (SUPER_ADMIN or MODERATOR)
 * and sets an HTTP-only JWT session cookie.
 */
export async function loginAdmin(
  prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  try {
    const username = (formData.get("username") as string)?.trim();
    const password = (formData.get("password") as string)?.trim();

    if (!username || !password) {
      return {
        success: false,
        error: "Veuillez saisir votre nom d'utilisateur et mot de passe.",
      };
    }

    // Find the Admin in the database with strict field selection
    let admin = await prisma.admin.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        password: true,
        role: true,
      },
    });

    // Auto-seed fallback: Only run count check if default admin is attempted and not found
    if (!admin && username === "admin") {
      const adminCount = await prisma.admin.count();
      if (adminCount === 0) {
        const defaultHashedPassword = await bcrypt.hash("admin123", 10);
        admin = await prisma.admin.create({
          data: {
            username: "admin",
            password: defaultHashedPassword,
            role: "SUPER_ADMIN",
          },
          select: {
            id: true,
            username: true,
            password: true,
            role: true,
          },
        });
      }
    }

    if (!admin) {
      return {
        success: false,
        error: "Identifiants invalides. Vérifiez votre nom d'utilisateur.",
      };
    }

    // Verify hashed password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return {
        success: false,
        error: "Mot de passe incorrect.",
      };
    }

    // Ensure role is valid
    const role = (admin.role === "SUPER_ADMIN" ? "SUPER_ADMIN" : "MODERATOR") as SessionRole;

    // Sign JWT token
    const token = await signSessionToken({
      id: admin.id,
      username: admin.username,
      role,
    });

    // Store in secure HTTP-only cookie
    await setSessionCookie(token);

    revalidatePath("/admin");

    return {
      success: true,
      role,
      message: "Connexion réussie.",
    };
  } catch (error) {
    console.error("Erreur loginAdmin:", error);
    return {
      success: false,
      error: "Une erreur inattendue est survenue lors de la connexion.",
    };
  }
}

/**
 * Server Action: Clears the session cookie and logs out the admin.
 */
export async function logoutAdmin(): Promise<{ success: boolean }> {
  try {
    await clearSessionCookie();
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Erreur logoutAdmin:", error);
    return { success: false };
  }
}

/**
 * Server Action: Retrieves the current active admin session.
 */
export async function getCurrentAdmin(): Promise<SessionUser | null> {
  return await getSession();
}

/**
 * Temporary Server Action: Allows creation of initial SUPER_ADMIN if none exists.
 */
export async function setupInitialSuperAdmin(
  formData: FormData
): Promise<AuthActionResult> {
  try {
    const existingSuperAdmin = await prisma.admin.findFirst({
      where: { role: "SUPER_ADMIN" },
    });

    if (existingSuperAdmin) {
      return {
        success: false,
        error: "Un compte SUPER_ADMIN existe déjà dans le système.",
      };
    }

    const username = (formData.get("username") as string)?.trim();
    const password = (formData.get("password") as string)?.trim();

    if (!username || !password || password.length < 8) {
      return {
        success: false,
        error: "Le mot de passe doit contenir au moins 8 caractères.",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.admin.create({
      data: {
        username,
        password: hashedPassword,
        role: "SUPER_ADMIN",
      },
    });

    return {
      success: true,
      message: `Compte SUPER_ADMIN "${newAdmin.username}" créé avec succès !`,
    };
  } catch (error) {
    console.error("Erreur setupInitialSuperAdmin:", error);
    return {
      success: false,
      error: "Impossible d'initialiser le compte SUPER_ADMIN.",
    };
  }
}
