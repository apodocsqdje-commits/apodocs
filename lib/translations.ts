import { ar, fr, en, Language, dictionaries, getNestedTranslation } from "@/locales";

export type { Language };
export { dictionaries, getNestedTranslation };

export interface Translations {
  [key: string]: {
    ar: string;
    fr: string;
    en: string;
  };
}

/**
 * Proxy-based backward compatible translations object
 * Allows legacy syntax `translations["nav.home"].ar` while pulling
 * directly from the clean dictionary files in `locales/`.
 */
export const translations: Translations = new Proxy(
  {},
  {
    get: (_target, prop: string) => {
      return {
        ar: getNestedTranslation(ar, prop),
        fr: getNestedTranslation(fr, prop),
        en: getNestedTranslation(en, prop),
      };
    },
  }
);
