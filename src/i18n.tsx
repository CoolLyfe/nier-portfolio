import { createContext, useContext } from 'react'
import { PROFILES, type Profile } from './data/profile'
import { STRINGS, type Strings } from './data/strings'
import { translator, type Lang, type T } from './data/lang'

/* ------------------------------------------------------------------
   FR / EN. Content is written once with t('français', 'english') and
   built for both languages up front; components read the active one.
   ------------------------------------------------------------------ */

export type { Lang, T } from './data/lang'

export interface LangValue {
  lang: Lang
  setLang: (l: Lang) => void
  /** profile content in the active language */
  P: Profile
  /** interface strings in the active language */
  S: Strings
  t: T
}

export const LangContext = createContext<LangValue>({
  lang: 'fr',
  setLang: () => {},
  P: PROFILES.fr,
  S: STRINGS.fr,
  t: translator('fr'),
})
export const useLang = () => useContext(LangContext)

export function initialLang(): Lang {
  try {
    const stored = localStorage.getItem('nier.lang')
    if (stored === 'fr' || stored === 'en') return stored
  } catch {
    /* storage unavailable */
  }
  return navigator.language?.toLowerCase().startsWith('fr') ? 'fr' : 'en'
}
