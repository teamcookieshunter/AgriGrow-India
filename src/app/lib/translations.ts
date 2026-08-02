import translations from './translations.json';

export type Locale = keyof typeof translations;
export type Translations = typeof translations['en'];

const translationData = translations as Record<Locale, Translations>;

export function getTranslations(locale: Locale): Translations {
  return translationData[locale] || translationData.en;
}
