import ar from "./ar.json";
import fr from "./fr.json";
import en from "./en.json";

export type Language = "ar" | "fr" | "en";

export const dictionaries = {
  ar,
  fr,
  en,
} as const;

export type Dictionary = typeof fr;

/**
 * Resolves a dot-notated key (e.g. "nav.home") or flat key from the dictionary.
 */
export function getNestedTranslation(
  dict: any,
  key: string,
  fallback?: string
): string {
  if (!dict) return fallback || key;

  // 1. Direct key lookup (for backward compatibility)
  if (typeof dict[key] === "string") {
    return dict[key];
  }

  // 2. Dot-separated path lookup (e.g. "nav.home")
  const parts = key.split(".");
  let current: any = dict;
  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = current[part];
    } else {
      return fallback || key;
    }
  }

  if (typeof current === "string") {
    return current;
  }

  return fallback || key;
}

export { ar, fr, en };
