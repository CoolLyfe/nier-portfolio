/* FR / EN primitives, kept free of imports so content files can use them. */

export type Lang = 'fr' | 'en'
export type T = (fr: string, en: string) => string

export const translator =
  (lang: Lang): T =>
  (fr, en) =>
    lang === 'fr' ? fr : en
