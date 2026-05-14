import en from './en.json';
import fr from './fr.json';

const translations: Record<string, typeof en> = { en, fr };

export function t(lang: string, key: string): string {
  const keys = key.split('.');
  let value: unknown = translations[lang] ?? translations.en;
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }
  return typeof value === 'string' ? value : key;
}

export function getLang(url: URL): string {
  const [, lang] = url.pathname.split('/');
  return lang === 'fr' ? 'fr' : 'en';
}
