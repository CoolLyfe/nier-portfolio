import { about, education, experience, identity, projects } from '../data/profile'

/* Virtual filesystem exposed by the hacking terminal. */

export interface VFile {
  path: string
  hidden?: boolean
  encrypted?: boolean
  /** requires every other encrypted file to be cracked first */
  master?: boolean
  content: () => string[]
}

export const FILES: VFile[] = [
  {
    path: 'profile.dat',
    content: () => [
      `NAME ........ ${identity.name.toUpperCase()}`,
      `STATUS ...... ${identity.role}`,
      `TRAINING .... ${identity.status}`,
      `NODE ........ ${identity.location}`,
      `TARGET ...... ${identity.target}`,
      '',
      about.profile,
    ],
  },
  ...projects.map<VFile>((p) => ({
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
    content: () =>
      [...education, ...experience].map((e) => `${e.period.padEnd(20)} ${e.title} — ${e.place}`),
  },
  {
    path: '.blackbox/music.enc',
    hidden: true,
    encrypted: true,
    content: () => [
      'ARCHIVE: MUSIC',
      'Guitare au conservatoire : concerts, auditions et concours.',
      'Composition musicale, et un groupe où j’ai appris à jouer — et à travailler — avec les autres.',
    ],
  },
  {
    path: '.blackbox/dojo.enc',
    hidden: true,
    encrypted: true,
    content: () => ['ARCHIVE: DOJO', 'Aïkido : 6 ans de pratique.', 'Hand-ball : 4 ans de pratique.'],
  },
  {
    path: '.blackbox/kitchen.enc',
    hidden: true,
    encrypted: true,
    content: () => [
      'ARCHIVE: KITCHEN',
      'Passion secondaire : la pâtisserie.',
      'Une recette, c’est un algorithme : des étapes précises, des quantités exactes, et on teste avant de livrer.',
    ],
  },
  {
    path: '.blackbox/orator.enc',
    hidden: true,
    encrypted: true,
    content: () => [
      'ARCHIVE: ORATOR',
      'Concours d’éloquence 2023–2024.',
      'Lions Club : 5e sur 18 participants.',
    ],
  },
  {
    path: '.blackbox/operator.enc',
    hidden: true,
    encrypted: true,
    master: true,
    content: () => [
      'ARCHIVE: OPERATOR — ALL DATA RECOVERED',
      '',
      'Vous avez tout déchiffré. Vous cherchez peut-être un stagiaire curieux et persévérant ?',
      'Tapez `download cv` puis `exit`, et rendez-vous dans COMMS.',
      '',
      'Glory to mankind.',
    ],
  },
]

export const findFile = (name: string) =>
  FILES.find((f) => f.path === name || f.path.endsWith(`/${name}`) || f.path === name.replace(/^\.?\//, ''))
