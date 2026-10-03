import type { T } from '../data/lang'
import type { Profile } from '../data/profile'

/* Virtual filesystem exposed by the hacking terminal. */

export interface VFile {
  path: string
  hidden?: boolean
  encrypted?: boolean
  /** requires every other encrypted file to be cracked first */
  master?: boolean
  content: () => string[]
}

export function buildFiles(P: Profile, t: T): VFile[] {
  return [
    {
      path: 'profile.dat',
      content: () => [
        `NAME ........ ${P.identity.name.toUpperCase()}`,
        `STATUS ...... ${P.identity.role}`,
        `TRAINING .... ${P.identity.status}`,
        `NODE ........ ${P.identity.location}`,
        `TARGET ...... ${P.identity.target}`,
        '',
        P.about.profile,
      ],
    },
    ...P.projects.map<VFile>((p) => ({
      path: `projects/${p.id}.log`,
      content: () => [
        `[${p.code}] ${p.title}`,
        `PERIOD: ${p.period}`,
        `STACK: ${p.stack.join(' / ')}`,
        '',
        p.objective,
        '',
        ...p.metrics.map((m) => `  ${m.k.padEnd(18, '.')} ${m.v}`),
      ],
    })),
    {
      path: 'logs/timeline.log',
      content: () => [...P.education, ...P.experience].map((e) => `${e.period.padEnd(24)} ${e.title} — ${e.place}`),
    },
    {
      path: '.blackbox/music.enc',
      hidden: true,
      encrypted: true,
      content: () => [
        'ARCHIVE: MUSIC',
        t('14 ans de conservatoire à Bagnols-sur-Cèze. 5 diplômes.', '14 years at the Bagnols-sur-Cèze conservatoire. 5 diplomas.'),
        t(
          'Concert en trio à l’intérieur du musée de Bagnols-sur-Cèze, lors de la journée nationale des musées.',
          'A trio concert inside the Bagnols-sur-Cèze museum, on the national museum day.',
        ),
        t('Aujourd’hui : la basse, parce que le groupe en avait besoin. On s’adapte.', 'Today: bass, because the band needed one. You adapt.'),
        t('Et des morceaux qui attendent dans FL Studio.', 'And some tracks waiting in FL Studio.'),
      ],
    },
    {
      path: '.blackbox/dojo.enc',
      hidden: true,
      encrypted: true,
      content: () => [
        'ARCHIVE: DOJO',
        t('Aïkido : 6 ans de pratique.', 'Aikido: 6 years of practice.'),
        t('Hand-ball : 4 ans de pratique.', 'Handball: 4 years of practice.'),
        t('On apprend surtout à tomber. Et à se relever.', 'Mostly you learn how to fall. And how to get back up.'),
      ],
    },
    {
      path: '.blackbox/kitchen.enc',
      hidden: true,
      encrypted: true,
      content: () => [
        'ARCHIVE: KITCHEN',
        t('Passion secondaire : la pâtisserie.', 'Side passion: baking.'),
        t(
          'Une recette, c’est un algorithme : des étapes précises, des quantités exactes, et on teste avant de livrer.',
          'A recipe is an algorithm: precise steps, exact quantities, and you test before shipping.',
        ),
      ],
    },
    {
      path: '.blackbox/orator.enc',
      hidden: true,
      encrypted: true,
      content: () => [
        'ARCHIVE: ORATOR',
        t('Concours d’éloquence 2023–2024.', 'Public speaking contests 2023–2024.'),
        t('Lions Club : 5e sur 18 participants.', 'Lions Club: 5th out of 18.'),
      ],
    },
    {
      path: '.blackbox/operator.enc',
      hidden: true,
      encrypted: true,
      master: true,
      content: () => [
        t('ARCHIVE: OPERATOR — TOUTES LES DONNÉES RÉCUPÉRÉES', 'ARCHIVE: OPERATOR — ALL DATA RECOVERED'),
        '',
        t('Vous avez tout déchiffré. Vous cherchez peut-être un stagiaire curieux et persévérant ?', 'You decrypted everything. Maybe you are looking for a curious, persistent intern?'),
        t('Tapez `download cv` puis `exit`, et rendez-vous dans PROFIL › Contact.', 'Type `download cv`, then `exit`, and head to PROFILE › Contact.'),
        '',
        'Glory to mankind.',
      ],
    },
  ]
}

export const findFile = (files: VFile[], name: string) =>
  files.find((f) => f.path === name || f.path.endsWith(`/${name}`) || f.path === name.replace(/^\.?\//, ''))
