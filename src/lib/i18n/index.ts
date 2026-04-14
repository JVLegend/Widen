import { en } from "./en";
import { br } from "./br";

export const locales = ["en", "br"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const dictionaries: Record<Locale, any> = { en, br };

export function getDictionary(locale: Locale) {
  return (dictionaries[locale] ?? dictionaries.en) as typeof en;
}

export type Dictionary = typeof en;
