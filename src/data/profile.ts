/* ==================================================================
   profile.ts — the ONLY file to edit to update the site's content.
   Every text is written once as t('français', 'english').
   Sources: CV, cover letter, and the project repositories in ~/Epita.
   Personal data deliberately left out of the public site: phone
   number, postal address.
   ================================================================== */

import type { Glyph } from '../components/icons'
import { translator, type T } from './lang'

export type TabId = 'home' | 'path' | 'projects' | 'music' | 'commitments' | 'life' | 'profile'

export interface Project {
  id: string
  code: string // menu label, e.g. "MYST"
  group: 'team' | 'solo'
  title: string
  summary: string // one line, shown on the fiche
  period: string
  context: string
  objective: string
  stack: string[]
  /** why these technologies, not others */
  choices?: string
  /* empty lists / missing retrospective are simply not shown (project in progress) */
  architecture: { name: string; role: string }[]
  metrics: { k: string; v: string }[]
  role: string[]
  challenges: string[]
  retrospective?: string
  hardSkills: string[]
  softSkills: string[]
  links?: { label: string; href: string }[]
  image?: { src: string; caption: string }
  pod?: string
}

export interface LogEntry {
  id: string
  /** PATH: school — MUSIC: music | stage — COMMITMENTS: lead | job | speech | contest */
  group: 'school' | 'music' | 'stage' | 'lead' | 'job' | 'speech' | 'contest'
  icon: Glyph
  /** short label when cited as a proof */
  short?: string
  period: string
  title: string
  place: string
  summary: string
  details: string[]
  skills: string[]
  /** what the experience taught me, looking back */
  reflection?: string
  /** gallery id whose picture illustrates the card, once it has a src */
  photo?: string
  /** speeches written for this entry (eloquence) */
  speeches?: Speech[]
  pod?: string
}

export interface Speech {
  id: string
  title: string
  /** where, when, under which constraint */
  context: string
  /** how I tackled the subject */
  angle: string
  /** a line from the text */
  quote: string
  /** e.g. "5e / 18" */
  result?: string
}

/**
 * The three key competences the portfolio is built around: why they
 * matter, the proofs, and an honest look at what is mastered, what is
 * missing and what comes next.
 */
export interface KeySkill {
  id: string
  icon: Glyph
  name: string
  /** one line, shown in lists */
  summary: string
  /** why it matters in the job I'm heading for */
  why: string
  /** self-assessed mastery, 1 to 5 */
  level: number
  proofs: string[]
  mastered: string[]
  gaps: string[]
  next: string[]
}

export interface Skill {
  id: string
  name: string
  /** PROJECTS / MUSIC category (unused for soft skills) */
  group?: 'code' | 'tool' | 'instrument'
  icon: Glyph
  /** list meta, e.g. "11 ans" (defaults to the proof count) */
  meta?: string
  detail: string
  facts?: { k: string; v: string }[]
  proofs: string[] // Project or log entry ids demonstrating it
  /** gallery id whose picture illustrates the card, once it has a src */
  photo?: string
  pod?: string
}

export interface Diploma {
  id: string
  group: 'school' | 'music'
  icon: Glyph
  name: string
  issuer: string
  year?: string
  grade?: string
  /** 3 = Très bien + félicitations, 2 = Très bien, 1 = Bien */
  rank?: number
  detail: string
  /** gallery id whose picture illustrates the card */
  photo?: string
}

export interface Interest {
  id: string
  group: 'sport' | 'passion'
  icon: Glyph
  name: string
  meta: string
  detail: string
  facts?: { k: string; v: string }[]
  pod?: string
}

/**
 * Photo frames. Drop a file in public/gallery/ and set `src`
 * (e.g. 'gallery/guitar.webp'); empty frames show a "pending" viewfinder.
 */
export interface Photo {
  id: string
  icon: Glyph
  caption: string
  src?: string
  pod?: string
}

/* ---------------------------------------------------------------- */

export function buildProfile(t: T) {
  const identity = {
    name: 'Louis Leymonie',
    unit: 'EPITA TOULOUSE // PROMO 2030',
    role: t('Étudiant ingénieur en informatique — EPITA', 'Computer engineering student — EPITA'),
    headline: t('Développement logiciel & systèmes : C, Python, Linux, web', 'Software & systems development: C, Python, Linux, web'),
    status: t('Classe préparatoire intégrée — 2e année (S3)', 'Integrated preparatory class — 2nd year (S3)'),
    location: 'Toulouse, France',
    target: t('Devenir ingénieur — spécialité encore ouverte', 'Becoming an engineer — field still open'),
    tagline: t(
      'J’aime construire des outils de bout en bout et comprendre ce qui se passe sous le capot. À côté du code : 14 ans de conservatoire, la présidence d’un groupe étudiant et des années à enseigner et à prendre la parole en public.',
      'I like building tools end to end and understanding what happens under the hood. Beyond code: 14 years at the conservatoire, running a student band, and years of teaching and public speaking.',
    ),
    /** what I'm looking for — shown on the home page */
    seeking: t('Ouvert aux stages, projets et jobs étudiants en développement', 'Open to internships, projects and student jobs in software'),
    facets: ['C', 'Python', 'Linux', 'React / TS', 'Git', t('Leadership', 'Leadership'), t('Pédagogie', 'Teaching')],
  }

  const about = {
    profile: t(
      'Étudiant en informatique à l’EPITA, sérieux et impliqué. J’ai acquis une bonne aisance à l’oral en donnant des cours, en concours d’éloquence et sur scène. J’apprécie le travail en équipe, l’apprentissage par l’expérience, et par-dessus tout : créer des choses.',
      'A computer science student at EPITA, serious and committed. I became comfortable speaking in public by teaching, in public speaking contests and on stage. I enjoy teamwork, learning by doing, and above all: making things.',
    ),
    motivation: t(
      'Je ne me suis pas encore fixé de spécialité, et je préfère explorer avant de choisir. Ce que je sais déjà : j’aime créer des choses concrètes de bout en bout (un jeu, un outil en C, ce menu) et comprendre comment fonctionne ma machine, jusqu’à ma configuration Arch Linux. Mon objectif : devenir ingénieur, et exercer un métier où l’on construit des choses utiles, en équipe.',
      'I haven’t settled on a speciality yet, and I’d rather explore before choosing. What I already know: I like making concrete things from start to finish (a game, a C tool, this menu) and understanding how my machine works, down to my Arch Linux setup. My goal: become an engineer, and work where people build useful things together.',
    ),
    beyond: t(
      'Mon parcours ne se limite pas au cadre académique. Quatorze ans de conservatoire et cinq diplômes de musique m’ont appris la rigueur, la volonté et la confiance en soi sur scène. Aujourd’hui président et bassiste d’un groupe du club EPImusic, et ancien co-président du bureau des lycéens, j’aime organiser des projets collectifs et prendre des responsabilités.',
      'My path goes beyond school. Fourteen years at the conservatoire and five music diplomas taught me rigour, determination and confidence on stage. Now president and bassist of a band in the EPImusic club, and former co-president of my high school’s student council, I enjoy organising group projects and taking on responsibilities.',
    ),
    objectives: [
      t('Présenter mon parcours, à l’école comme en dehors.', 'Present my path, at school and beyond.'),
      t('Mettre en avant trois compétences clés, chacune justifiée par des preuves concrètes.', 'Highlight three key competences, each backed by concrete proofs.'),
      t('Relier chaque compétence à une réalisation ou une expérience concrète.', 'Link each skill to a concrete achievement or experience.'),
      t('Évaluer honnêtement mes points forts et mes axes de progression.', 'Honestly assess my strengths and the areas I need to improve.'),
      t('Disposer d’un outil évolutif, enrichi à chaque semestre.', 'Keep an evolving tool, updated every semester.'),
    ],
    /** how the site is organised, for a first-time visitor */
    guide: [
      t('Parcours : formation, matières, diplômes et langues.', 'Path: studies, subjects, diplomas and languages.'),
      t('Projets : chaque projet a un dossier complet (contexte, choix techniques, rôle, difficultés, bilan).', 'Projects: each one has a full file (context, technical choices, role, challenges, review).'),
      t('Musique et Engagements : scène, responsabilités, stage et emplois.', 'Music and Commitments: stage, responsibilities, internship and jobs.'),
      t('Profil : mes trois compétences clés, mes soft skills et mon bilan.', 'Profile: my three key competences, my soft skills and my self-assessment.'),
    ],
    conclusion: t(
      'En un peu plus d’un an, je suis passé de l’écriture de programmes isolés en Python à la conception de systèmes complets en C, testés et construits en équipe. Mon stage m’a montré l’autre côté : la réalité d’un commerce, le contact client et la fiabilité au quotidien. Ce portfolio est un point d’étape : il m’a obligé à relier ce que je fais à ce que je sais faire, et il sera enrichi à chaque semestre, jusqu’au choix de ma spécialité.',
      'In a little over a year, I went from writing standalone Python programs to designing complete C systems, tested and built as a team. My internship showed me the other side: how a shop really runs, dealing with customers and being reliable every day. This portfolio is a checkpoint: it made me link what I do to what I can do, and it will grow every semester, until I choose my speciality.',
    ),
  }

  /* HOME — the "right now" box */
  const now: { k: string; v: string; icon: Glyph; to: TabId }[] = [
    { k: t('Études', 'Studies'), v: t('EPITA, 2e année — semestre 3', 'EPITA, 2nd year — semester 3'), icon: 'school', to: 'path' },
    { k: t('Projet', 'Project'), v: t('OCR en groupe : un réseau de neurones', 'Group OCR project: a neural network'), icon: 'folder', to: 'projects' },
    { k: t('Musique', 'Music'), v: t('Bassiste et président d’un groupe EPImusic', 'Bassist and president of an EPImusic band'), icon: 'bass', to: 'music' },
    { k: t('À côté', 'On the side'), v: t('Arch Linux au quotidien : shell, scripts, configuration', 'Arch Linux daily: shell, scripts, configuration'), icon: 'terminal', to: 'projects' },
  ]

  /* HOME — what sets me apart, each backed by proofs (entry ids) */
  const strengths: { id: string; icon: Glyph; title: string; text: string; proofs: string[] }[] = [
    {
      id: 'systems',
      icon: 'terminal',
      title: t('Bas niveau et systèmes', 'Low level and systems'),
      text: t('Un clone de make en C, seul : parsing, mémoire, processus. Linux au quotidien.', 'A make clone in C, solo: parsing, memory, processes. Linux every day.'),
      proofs: ['minimake', 'portfolio'],
    },
    {
      id: 'lead',
      icon: 'flag',
      title: t('Leadership', 'Leadership'),
      text: t('Président d’un groupe EPImusic, ex-co-président du bureau des lycéens.', 'President of an EPImusic band, former student council co-president.'),
      proofs: ['epimusic', 'bdl'],
    },
    {
      id: 'speak',
      icon: 'mic',
      title: t('Pédagogie et oral', 'Teaching and speaking'),
      text: t('Un an de tutorat Python pour des collégiens. Trois ans de concours d’éloquence, quatre ans de théâtre.', 'A year teaching Python to middle schoolers. Three years of public speaking contests, four years of theatre.'),
      proofs: ['tutorat', 'eloquence', 'theatre'],
    },
    {
      id: 'grit',
      icon: 'medal',
      title: t('Rigueur sur la durée', 'Long-term rigour'),
      text: t('14 ans de conservatoire, 5 diplômes dont des félicitations du jury.', '14 years at the conservatoire, 5 diplomas, one with the jury’s congratulations.'),
      proofs: ['conservatoire', 'concerts'],
    },
  ]

  /* HOME + CV — projects shown first to a visitor */
  const featured = ['minimake', 'myst', 'portfolio']

  /* MUSIC — the conservatoire at a glance */
  const music = {
    school: t('Conservatoire de musique et de danse de Bagnols-sur-Cèze', 'Bagnols-sur-Cèze music and dance conservatoire'),
    years: 14,
    tracks: [
      { name: t('Guitare', 'Guitar'), years: 11, note: t('Cycles 1 et 2 — Très bien', 'Cycles 1 & 2 — Very good') },
      { name: t('Formation musicale', 'Music theory'), years: 11, note: t('Cycles 1 et 2 — Bien', 'Cycles 1 & 2 — Good') },
      { name: t('Batterie', 'Drums'), years: 4, note: t('Cycle 1 — Très bien, félicitations', 'Cycle 1 — Very good, with honours') },
      { name: t('Orchestre', 'Orchestra'), years: 4, note: t('Représentations collectives', 'Ensemble performances') },
    ],
    brought: [t('Passion', 'Passion'), t('Rigueur', 'Rigour'), t('Volonté', 'Determination'), t('Engagement', 'Commitment'), t('Confiance en soi', 'Self-confidence')],
  }

  const languages = [
    { name: t('Français', 'French'), level: t('Natif', 'Native'), value: 5 },
    { name: t('Anglais', 'English'), level: 'B2', value: 4 },
    { name: t('Allemand', 'German'), level: 'A2', value: 2 },
  ]

  /* LIFE — sport and passions */
  const interests: Interest[] = [
    {
      id: 'aikido',
      group: 'sport',
      icon: 'aikido',
      name: t('Aïkido', 'Aikido'),
      meta: t('6 ANS', '6 YRS'),
      detail: t(
        'Six ans d’aïkido : un art martial sans compétition, où l’on apprend à accompagner la force de l’autre plutôt qu’à s’y opposer.',
        'Six years of aikido: a martial art without competition, where you learn to go with your partner’s force rather than against it.',
      ),
      facts: [
        { k: t('Pratique', 'Practice'), v: t('6 ans', '6 years') },
        { k: t('Statut', 'Status'), v: t('Arrêté', 'Stopped') },
        { k: t('Retenu', 'Takeaway'), v: t('Calme, respect, maîtrise', 'Calm, respect, control') },
      ],
      pod: t('Analyse : l’unité sait tomber et se relever. Compétence utile en débogage.', 'Analysis: this unit knows how to fall and get back up. Useful when debugging.'),
    },
    {
      id: 'handball',
      group: 'sport',
      icon: 'ball',
      name: t('Hand-ball', 'Handball'),
      meta: t('4 ANS', '4 YRS'),
      detail: t(
        'Quatre ans de hand-ball : un sport d’équipe rapide, où chacun a son poste. Gaucher, je jouais ailier droit.',
        'Four years of handball: a fast team sport where everyone has a position. Being left-handed, I played right wing.',
      ),
      facts: [
        { k: t('Pratique', 'Practice'), v: t('4 ans', '4 years') },
        { k: t('Poste', 'Position'), v: t('Ailier droit (gaucher)', 'Right wing (left-handed)') },
        { k: t('Retenu', 'Takeaway'), v: t('Esprit d’équipe', 'Team spirit') },
      ],
      pod: t('Gaucher à l’aile droite : angle de tir optimal. Choix tactique validé.', 'Left-hander on the right wing: optimal shooting angle. Tactical choice approved.'),
    },
    {
      id: 'aero',
      group: 'passion',
      icon: 'plane',
      name: t('Aéronautique', 'Aviation'),
      meta: 'BIA',
      detail: t(
        'Passionné d’aviation, j’ai passé le brevet d’initiation aéronautique en classe de seconde, puis fait une séance de pilotage accompagné.',
        'An aviation enthusiast, I earned the French aeronautics initiation certificate (BIA) in 10th grade, then flew a plane with an instructor.',
      ),
      facts: [
        { k: t('Brevet', 'Certificate'), v: t('BIA, en seconde', 'BIA, in 10th grade') },
        { k: t('En vol', 'In the air'), v: t('Séance de pilotage accompagné', 'A flight at the controls, with an instructor') },
      ],
      pod: t('Observation : l’unité regarde souvent le ciel.', 'Observation: this unit often looks at the sky.'),
    },
    {
      id: 'patisserie',
      group: 'passion',
      icon: 'cake',
      name: t('Pâtisserie', 'Baking'),
      meta: '×∞',
      detail: t(
        'En amateur, je teste un peu de tout. Une recette, c’est un algorithme : des étapes précises, des quantités exactes, et on goûte avant de servir.',
        'As an amateur, I try a bit of everything. A recipe is an algorithm: precise steps, exact quantities, and you taste before serving.',
      ),
      facts: [
        { k: t('Niveau', 'Level'), v: t('Amateur, curieux de tout', 'Amateur, curious about everything') },
        { k: t('Qualités', 'Skills'), v: t('Précision, dosage, patience', 'Precision, measuring, patience') },
      ],
      pod: t('Proposition : demander une démonstration. Dégustation recommandée.', 'Proposal: request a demonstration. Tasting recommended.'),
    },
    {
      id: 'jeux',
      group: 'passion',
      icon: 'gamepad',
      name: t('Jeux vidéo', 'Video games'),
      meta: '2B',
      detail: t(
        'Des jeux prenants, qui chacun à leur manière nous font réfléchir à ce qu’est l’humanité et à qui nous sommes. NieR: Automata le fait mieux que tous, et c’est pour ça que ce portfolio en reprend le menu.',
        'Gripping games that each, in their own way, make us think about what humanity is and who we are. NieR: Automata does it best of all, which is why this portfolio borrows its menu.',
      ),
      facts: [{ k: t('Favoris', 'Favourites'), v: 'NieR: Automata, League of Legends, Minecraft, Five Nights at Freddy’s' }],
      pod: t('Requête : ne pas révéler la fin E.', 'Request: do not spoil ending E.'),
    },
  ]

  /* LIFE + HOME — photo frames (pictures to come, see README) */
  const gallery: Photo[] = [
    { id: 'portrait', icon: 'user', caption: t('Portrait', 'Portrait'), src: 'gallery/portrait.webp' },
    {
      id: 'stage',
      icon: 'guitar',
      caption: t('Ensemble de guitares, sur scène', 'Guitar ensemble, on stage'),
      src: 'gallery/stage.webp',
      pod: t('Archive visuelle : concert. Volume recommandé : élevé.', 'Visual archive: concert. Recommended volume: high.'),
    },
    {
      id: 'museum',
      icon: 'guitar',
      caption: t('Concert au musée de Bagnols-sur-Cèze', 'Concert at the Bagnols-sur-Cèze museum'),
      src: 'gallery/museum.webp',
      pod: t('Lieu : un musée. Public : debout. Unité : concentrée.', 'Venue: a museum. Audience: standing. Unit: focused.'),
    },
    { id: 'museum-stairs', icon: 'guitar', caption: t('Au pied de l’escalier du musée', 'At the foot of the museum staircase'), src: 'gallery/museum-stairs.webp' },
    { id: 'electric', icon: 'guitar', caption: t('À l’électrique', 'On electric'), src: 'gallery/electric.webp' },
    {
      id: 'plane',
      icon: 'plane',
      caption: t('Aux commandes', 'At the controls'),
      src: 'gallery/plane.webp',
      pod: t('Altitude de l’unité : en hausse.', 'Unit altitude: rising.'),
    },
    { id: 'plane-wide', icon: 'plane', caption: t('Avant le décollage', 'Before take-off'), src: 'gallery/plane-wide.webp' },
    { id: 'bia', icon: 'scroll', caption: t('Remise des brevets d’initiation aéronautique', 'Aeronautics certificate ceremony'), src: 'gallery/bia.webp' },
    { id: 'speech', icon: 'mic', caption: t('Concours d’éloquence', 'Public speaking contest'), src: 'gallery/speech.webp' },
    { id: 'golf', icon: 'ball', caption: t('Au golf', 'On the golf course'), src: 'gallery/golf.webp' },
    {
      id: 'tiny',
      icon: 'chip',
      caption: t('Déjà en train de bricoler', 'Already tinkering'),
      src: 'gallery/tiny.webp',
      pod: t('Archive ancienne. Prototype d’unité, version 0.7.', 'Old archive. Unit prototype, version 0.7.'),
    },
    { id: 'band', icon: 'bass', caption: t('Le groupe EPImusic', 'The EPImusic band') },
    { id: 'theatre', icon: 'mask', caption: t('Sur les planches', 'On the boards'), pod: t('Archive visuelle : représentation théâtrale. Rideau.', 'Visual archive: a stage play. Curtain.') },
    { id: 'dojo', icon: 'aikido', caption: t('Au dojo', 'At the dojo') },
    { id: 'kitchen', icon: 'cake', caption: t('En cuisine', 'In the kitchen') },
    { id: 'games', icon: 'gamepad', caption: t('Manette en main', 'Controller in hand') },
  ]

  /* PATH + MUSIC — diplomas and certifications */
  const diplomas: Diploma[] = [
    {
      id: 'dip-bac',
      group: 'school',
      icon: 'scroll',
      name: t('Baccalauréat général', 'French baccalauréat'),
      issuer: 'Lycée Bellevue Marie-Rivier',
      year: '2025',
      grade: t('Mention Bien', 'With honours (Bien)'),
      detail: t('Baccalauréat général obtenu avec mention Bien.', 'General baccalauréat passed with honours (“Bien”).'),
    },
    {
      id: 'dip-brevet',
      group: 'school',
      icon: 'scroll',
      name: t('Diplôme national du brevet', 'Brevet (middle school diploma)'),
      issuer: 'Collège Saint Jean',
      year: '2022',
      grade: t('Mention Très bien', 'With high honours (Très bien)'),
      detail: t('Brevet obtenu avec mention Très bien.', 'Brevet passed with high honours (“Très bien”).'),
    },
    {
      id: 'dip-bia',
      group: 'school',
      icon: 'plane',
      name: t('Brevet d’initiation aéronautique', 'Aeronautics initiation certificate (BIA)'),
      issuer: t('Lycée — classe de seconde', 'High school — 10th grade'),
      detail: t('Brevet d’initiation aéronautique obtenu en classe de seconde.', 'Aeronautics initiation certificate earned in 10th grade.'),
      photo: 'bia',
    },
    {
      id: 'dip-pix',
      group: 'school',
      icon: 'chip',
      name: t('Certification PIX', 'PIX certification'),
      issuer: t('Certification nationale', 'French national certification'),
      detail: t('Certification des compétences numériques.', 'Certification of digital skills.'),
    },
    {
      id: 'dip-gtr-2',
      group: 'music',
      icon: 'medal',
      name: t('Guitare — fin de cycle 2', 'Guitar — end of cycle 2'),
      issuer: t('Conservatoire de Bagnols-sur-Cèze', 'Bagnols-sur-Cèze conservatoire'),
      grade: t('Mention Très bien', 'Very good'),
      rank: 2,
      detail: t('Guitare classique, deuxième cycle validé avec mention Très bien.', 'Classical guitar, second cycle passed with “Very good”.'),
    },
    {
      id: 'dip-gtr-1',
      group: 'music',
      icon: 'medal',
      name: t('Guitare — fin de cycle 1', 'Guitar — end of cycle 1'),
      issuer: t('Conservatoire de Bagnols-sur-Cèze', 'Bagnols-sur-Cèze conservatoire'),
      grade: t('Mention Très bien', 'Very good'),
      rank: 2,
      detail: t('Guitare classique, premier cycle validé avec mention Très bien.', 'Classical guitar, first cycle passed with “Very good”.'),
    },
    {
      id: 'dip-fm-2',
      group: 'music',
      icon: 'medal',
      name: t('Formation musicale — fin de cycle 2', 'Music theory — end of cycle 2'),
      issuer: t('Conservatoire de Bagnols-sur-Cèze', 'Bagnols-sur-Cèze conservatoire'),
      grade: t('Mention Bien', 'Good'),
      rank: 1,
      detail: t('Formation musicale (solfège), deuxième cycle validé avec mention Bien.', 'Music theory, second cycle passed with “Good”.'),
    },
    {
      id: 'dip-fm-1',
      group: 'music',
      icon: 'medal',
      name: t('Formation musicale — fin de cycle 1', 'Music theory — end of cycle 1'),
      issuer: t('Conservatoire de Bagnols-sur-Cèze', 'Bagnols-sur-Cèze conservatoire'),
      grade: t('Mention Bien', 'Good'),
      rank: 1,
      detail: t('Formation musicale (solfège), premier cycle validé avec mention Bien.', 'Music theory, first cycle passed with “Good”.'),
    },
    {
      id: 'dip-bat-1',
      group: 'music',
      icon: 'medal',
      name: t('Batterie — fin de cycle 1', 'Drums — end of cycle 1'),
      issuer: t('Conservatoire de Bagnols-sur-Cèze', 'Bagnols-sur-Cèze conservatoire'),
      grade: t('Très bien, félicitations', 'Very good, with honours'),
      rank: 3,
      detail: t('Batterie, premier cycle validé avec mention Très bien et les félicitations.', 'Drums, first cycle passed with “Very good” and the jury’s congratulations.'),
    },
  ]

  /* PROJECTS */
  const projects: Project[] = [
    {
      id: 'myst',
      code: 'MYST',
      group: 'team',
      title: t('Myst — jeu 2D à génération procédurale', 'Myst — procedurally generated 2D game'),
      summary: t('Donjon généré aléatoirement à chaque partie.', 'A dungeon randomly generated for every run.'),
      period: t('Janv. – mars 2026', 'Jan. – Mar. 2026'),
      context: t('SAE « Jeu » du S2 : projet de groupe (« Four Man Army Studio »), mené en parallèle des cours.', 'Semester 2 game project (SAE): a group project (“Four Man Army Studio”), alongside classes.'),
      objective: t(
        'Créer un jeu d’exploration dont la carte change à chaque partie : salles typées (départ, combat, butin, boss), menu, et un joueur qui se déplace entre les salles.',
        'Build an exploration game whose map changes every run: typed rooms (start, combat, loot, boss), a menu, and a player moving between rooms.',
      ),
      stack: ['Python', 'pygame', 'Pillow', 'Git / GitHub'],
      choices: t(
        'Python et pygame parce que toute l’équipe connaissait déjà Python : nous voulions passer notre temps sur le jeu, pas sur le langage. Pillow sert à rendre la carte générée en image, ce qui nous a permis de vérifier l’algorithme d’un coup d’œil avant de l’intégrer au jeu.',
        'Python and pygame because the whole team already knew Python: we wanted to spend our time on the game, not on the language. Pillow renders the generated map as an image, so we could check the algorithm at a glance before plugging it into the game.',
      ),
      architecture: [
        { name: 'procedural_gen.py', role: t('Génère la grille de salles et leurs connexions, puis rend la carte en image.', 'Generates the room grid and its connections, then renders the map as an image.') },
        { name: 'player.py', role: t('Déplacements et collisions du joueur.', 'Player movement and collisions.') },
        { name: 'game.py', role: t('Boucle de jeu, caméra qui suit le joueur, affichage.', 'Game loop, camera following the player, rendering.') },
        { name: 'menu.py', role: t('Menu principal et boutons (réalisé par un coéquipier).', 'Main menu and buttons (written by a teammate).') },
      ],
      metrics: [
        { k: t('Salles / partie', 'Rooms / run'), v: '15 – 20' },
        { k: t('Grille', 'Grid'), v: '8 × 5' },
        { k: 'Commits', v: '14 / 22' },
        { k: t('Contributeurs', 'Contributors'), v: '3' },
      ],
      role: [
        t('Conception de l’algorithme de génération procédurale de la carte.', 'Designed the procedural map generation algorithm.'),
        t('Collisions et déplacement du joueur.', 'Player collisions and movement.'),
        t('Intégration du menu avec la boucle de jeu.', 'Integrated the menu with the game loop.'),
        t('Création du dépôt, .gitignore, gestion des fusions de branches.', 'Set up the repository and .gitignore, handled branch merges.'),
      ],
      challenges: [
        t(
          'Garantir que toutes les salles soient atteignables : l’algorithme part de la salle de départ et ne crée une salle qu’à côté d’une salle existante (marche aléatoire), ce qui produit toujours un graphe connexe.',
          'Making every room reachable: the algorithm starts from the first room and only creates a room next to an existing one (random walk), which always yields a connected graph.',
        ),
        t('Éviter les carrefours illisibles : 3 sorties maximum par salle.', 'Avoiding confusing crossroads: at most 3 exits per room.'),
        t('Placer le boss loin du départ : la salle du boss est toujours la dernière générée.', 'Keeping the boss far from the start: the boss room is always the last one generated.'),
      ],
      retrospective: t(
        'Nous avons codé avant de fixer l’architecture : l’intégration menu ↔ jeu a demandé des corrections tardives. La prochaine fois, je définirais les interfaces entre modules dès le départ et j’écrirais des messages de commit plus explicites.',
        'We started coding before settling the architecture, so integrating the menu with the game needed late fixes. Next time I would define the interfaces between modules first and write clearer commit messages.',
      ),
      hardSkills: [t('Algorithmique (graphes)', 'Algorithms (graphs)'), 'Python', t('Git en équipe', 'Git in a team')],
      softSkills: [t('Travail en équipe', 'Teamwork'), t('Répartition des tâches', 'Task sharing')],
      links: [
        { label: t('Site du jeu', 'Game website'), href: 'https://myst-official.base44.app' },
        { label: t('Dépôt GitHub', 'GitHub repository'), href: 'https://github.com/CoolLyfe/Myst' },
      ],
      image: {
        src: 'evidence/myst-map.webp',
        caption: t('Carte générée : départ en vert, boss en rouge, couloirs en jaune.', 'Generated map: start in green, boss in red, corridors in yellow.'),
      },
      pod: t('Analyse : chaque partie génère une carte différente. Aucune salle n’est inaccessible.', 'Analysis: every run generates a new map. No room is unreachable.'),
    },
    {
      id: 'minimake',
      code: 'MINIMAKE',
      group: 'solo',
      title: t('minimake — réimplémentation de make en C', 'minimake — a make clone in C'),
      summary: t('Lit un Makefile, résout les dépendances, exécute.', 'Reads a Makefile, resolves dependencies, runs commands.'),
      period: t('Avr. – mai 2026', 'Apr. – May 2026'),
      context: t('Projet individuel EPITA (S2), vérifié par une suite de tests automatiques.', 'Individual EPITA project (semester 2), checked by an automated test suite.'),
      objective: t(
        'Reproduire le cœur de GNU make : lire un Makefile, résoudre les dépendances entre cibles et exécuter les commandes nécessaires dans le bon ordre.',
        'Reproduce the core of GNU make: read a Makefile, resolve dependencies between targets and run the required commands in the right order.',
      ),
      stack: ['C', 'POSIX', 'Makefile', t('Tests Python + YAML', 'Python + YAML tests')],
      choices: t(
        'Le C était imposé, et c’est tout l’intérêt : gérer soi-même la mémoire et les processus. J’ai choisi des listes chaînées pour les règles, les variables et les dépendances, car leur nombre n’est pas connu avant d’avoir lu le Makefile. Les commandes passent par system() : c’est simple et suffisant pour les tests, mais fork et exec m’auraient donné un contrôle plus fin sur chaque processus.',
        'C was required, and that is the point: managing memory and processes yourself. I chose linked lists for rules, variables and dependencies because their number is unknown until the Makefile has been read. Commands go through system(): simple and enough for the tests, but fork and exec would have given me finer control over each process.',
      ),
      architecture: [
        { name: 'parseur()', role: t('Lit le fichier ligne par ligne : variables, règles, dépendances, commandes.', 'Reads the file line by line: variables, rules, dependencies, commands.') },
        { name: 'remplacer_vars()', role: t('Substitue récursivement les ${VAR} dans les commandes.', 'Recursively substitutes ${VAR} in commands.') },
        { name: 'exec()', role: t('Résout récursivement les dépendances puis lance les commandes.', 'Recursively resolves dependencies, then runs the commands.') },
        { name: 'print_all()', role: t('Mode -p : affiche règles et variables.', '-p mode: prints rules and variables.') },
      ],
      metrics: [
        { k: t('Lignes de C', 'Lines of C'), v: '≈ 380' },
        { k: t('Options CLI', 'CLI options'), v: '-h -p -f' },
        { k: 'Structures', v: t('3 listes chaînées', '3 linked lists') },
        { k: t('Scénarios de test', 'Test scenarios'), v: t('2 modes', '2 modes') },
      ],
      role: [
        t('Conception et écriture complètes, seul.', 'Designed and written entirely on my own.'),
        t('Messages d’erreur et codes de retour identiques à GNU make.', 'Error messages and exit codes identical to GNU make.'),
      ],
      challenges: [
        t('Variables imbriquées : la substitution est répétée tant qu’il reste un ${…} dans la commande.', 'Nested variables: substitution repeats as long as a ${…} remains in the command.'),
        t(
          'Cible sans règle : si un fichier du même nom existe, il est considéré à jour ; sinon arrêt avec « No rule to make target ».',
          'Target without a rule: if a file with that name exists it is up to date; otherwise stop with “No rule to make target”.',
        ),
        t('Gestion mémoire : chaque commande est dupliquée, substituée puis libérée.', 'Memory management: each command is duplicated, substituted, then freed.'),
      ],
      retrospective: t(
        'J’ai utilisé des variables globales pour aller vite ; les regrouper dans une structure passée aux fonctions rendrait le code plus testable. Un passage sous Valgrind validerait la gestion mémoire.',
        'I used global variables to move fast; grouping them in a struct passed to functions would make the code more testable. A Valgrind run would confirm the memory handling.',
      ),
      hardSkills: [t('C (pointeurs, mémoire)', 'C (pointers, memory)'), 'Parsing', t('Appels système', 'System calls'), 'Tests'],
      softSkills: [t('Rigueur', 'Rigour'), t('Autonomie', 'Autonomy'), t('Persévérance', 'Perseverance')],
      pod: t('Rappel : make ne reconstruit que ce qui a changé. L’unité aussi.', 'Reminder: make only rebuilds what changed. So does this unit.'),
    },
    {
      id: 'portfolio',
      code: 'PORTFOLIO',
      group: 'solo',
      title: t('Ce portfolio — menu YoRHa', 'This portfolio — a YoRHa menu'),
      summary: t('Le menu de NieR: Automata, pour raconter tout un parcours.', 'The NieR: Automata menu, telling a whole story.'),
      period: t('Sept. – oct. 2026', 'Sept. – Oct. 2026'),
      context: t('Projet personnel, réalisé pour le cours « Portfolio professionnel » du S3.', 'Personal project, made for the semester 3 “Professional portfolio” course.'),
      objective: t(
        'Présenter tout mon parcours (études, projets, musique, engagements, vie perso) sous la forme du menu de NieR: Automata : page d’accueil en mosaïque, onglets par domaine, fiches illustrées, mode hacking pour les dossiers, en français et en anglais.',
        'Present my whole path (studies, projects, music, commitments, personal life) as the NieR: Automata menu: a mosaic home page, one tab per area, illustrated cards, hacking mode for full files, in French and English.',
      ),
      stack: ['React 19', 'TypeScript', 'Tailwind CSS 4', 'Framer Motion', 'Web Audio', 'SVG', 'Vite'],
      choices: t(
        'Un site plutôt qu’un document : on peut le parcourir dans l’ordre qu’on veut, le mettre à jour en quelques minutes, et il montre en lui-même des compétences en développement. React pour découper l’interface en composants réutilisables, TypeScript pour que chaque texte existe forcément dans les deux langues, et du SVG plutôt que des images pour que les illustrations restent nettes et légères.',
        'A website rather than a document: visitors can browse it in any order, I can update it in minutes, and it shows development skills by itself. React to split the interface into reusable components, TypeScript so that every text is guaranteed to exist in both languages, and SVG instead of images so illustrations stay sharp and light.',
      ),
      architecture: [
        { name: 'data/profile.ts', role: t('Tout le contenu, en français et en anglais, séparé de l’interface.', 'All content, in French and English, kept apart from the interface.') },
        { name: 'home/Home.tsx', role: t('Page d’accueil : mosaïque de cases de tailles variées.', 'Home page: a mosaic of boxes of varied sizes.') },
        { name: 'components/Pod.tsx', role: t('Le Pod qui commente la navigation.', 'The Pod commenting on navigation.') },
        { name: 'hooks/useAmbient.ts', role: t('Ambiance sonore synthétisée en direct (Web Audio).', 'Ambient sound synthesised live (Web Audio).') },
      ],
      metrics: [
        { k: t('Onglets', 'Tabs'), v: '7' },
        { k: t('Langues', 'Languages'), v: 'FR / EN' },
        { k: t('Fichiers audio', 'Audio files'), v: '0' },
        { k: t('Données perso', 'Personal data'), v: t('1 fichier', '1 file') },
      ],
      role: [
        t('Direction artistique et structure des contenus.', 'Art direction and content structure.'),
        t('Développé avec l’aide d’un assistant IA (Claude Code) : relecture, choix et adaptation du code.', 'Built with the help of an AI assistant (Claude Code): reviewing, choosing and adapting the code.'),
        t('Rédaction de tout le contenu, à partir des consignes du cours « Portfolio professionnel ».', 'Wrote all the content, based on the “Professional portfolio” course guidelines.'),
      ],
      challenges: [
        t('Changer de palette sur une seule fenêtre (hacking) : les couleurs passent par des variables CSS redéfinies localement.', 'Switching palette on a single window (hacking): colours go through CSS variables redefined locally.'),
        t('Traduire tout le site sans dupliquer la structure : chaque texte est écrit une fois, en deux langues côte à côte.', 'Translating the whole site without duplicating its structure: each text is written once, in two languages side by side.'),
        t('Garder une interface de jeu dense tout en restant lisible sur un écran de 400 px.', 'Keeping a dense game interface readable on a 400 px screen.'),
      ],
      retrospective: t(
        'Séparer le contenu de l’interface a permis de refondre plusieurs fois le design sans réécrire le texte. La première version ne parlait presque que d’informatique ; la page d’accueil montre maintenant tous les domaines dès l’arrivée. Travailler avec une IA m’a appris à relire et à questionner le code proposé plutôt qu’à l’accepter tel quel, ce que j’avais déjà étudié en cours d’IA générative (hallucinations, biais).',
        'Keeping content apart from the interface let me redesign several times without rewriting the text. The first version was almost only about computing; the home page now shows every area from the start. Working with an AI taught me to review and question the code it suggests rather than accept it as is, which I had already studied in my generative AI course (hallucinations, bias).',
      ),
      hardSkills: [t('Développement web', 'Web development'), 'TypeScript', 'SVG', 'Web Audio'],
      softSkills: [t('Créativité', 'Creativity'), t('Esprit critique', 'Critical thinking'), t('Communication écrite', 'Written communication')],
      links: [{ label: t('Code source', 'Source code'), href: 'https://github.com/CoolLyfe/nier-portfolio' }],
      pod: t('Constat : vous êtes actuellement à l’intérieur de ce projet.', 'Note: you are currently inside this project.'),
    },
    {
      id: 'ocr',
      code: 'OCR',
      group: 'team',
      title: t('OCR — reconnaissance de caractères', 'OCR — character recognition'),
      summary: t('Lire le texte d’une image grâce à un réseau de neurones. En cours.', 'Reading text from an image with a neural network. In progress.'),
      period: t('S3 — en cours', 'S3 — in progress'),
      context: t('Projet de groupe EPITA du semestre 3, en cours de réalisation.', 'EPITA group project for semester 3, currently in progress.'),
      objective: t('Reconnaître les caractères présents dans une image à l’aide d’un réseau de neurones.', 'Recognise the characters in an image using a neural network.'),
      stack: [t('Réseau de neurones', 'Neural network'), t('Traitement d’image', 'Image processing'), 'Git'],
      architecture: [],
      metrics: [
        { k: t('Statut', 'Status'), v: t('En cours', 'In progress') },
        { k: t('Format', 'Format'), v: t('Groupe', 'Team') },
      ],
      role: [],
      challenges: [],
      hardSkills: [t('Réseaux de neurones', 'Neural networks'), t('Traitement d’image', 'Image processing')],
      softSkills: [t('Travail en équipe', 'Teamwork')],
      pod: t('Projet en cours. Le réseau de neurones apprend encore. L’unité aussi.', 'Project in progress. The neural network is still learning. So is this unit.'),
    },
  ]

  /* PATH (school) and MUSIC (conservatoire) */
  const education: LogEntry[] = [
    {
      id: 'epita-2',
      group: 'school',
      icon: 'school',
      period: '2026 – 2027',
      title: t('Classe préparatoire intégrée — 2e année', 'Integrated preparatory class — 2nd year'),
      place: 'EPITA Toulouse',
      summary: t('Semestre 3 en cours.', 'Semester 3 in progress.'),
      details: [
        t('Programmation C avancée, théorie des langages, mathématiques, physique, anglais.', 'Advanced C programming, formal language theory, mathematics, physics, English.'),
        t('Projet de groupe : OCR, reconnaissance de caractères par réseau de neurones.', 'Group project: OCR, character recognition with a neural network.'),
        t('Communication professionnelle : ce portfolio, puis un projet de recherche en groupe sur la communication interculturelle (recherche documentaire, poster, oral de 20 minutes).', 'Professional communication: this portfolio, then a group research project on intercultural communication (literature search, poster, 20-minute talk).'),
      ],
      skills: ['C', t('Théorie des langages', 'Language theory'), t('Recherche documentaire', 'Literature search')],
    },
    {
      id: 'epita-1',
      short: 'EPITA S1–S2',
      group: 'school',
      icon: 'school',
      period: '2025 – 2026',
      title: t('Classe préparatoire intégrée — 1re année', 'Integrated preparatory class — 1st year'),
      place: 'EPITA Toulouse',
      summary: t('Programmation, algorithmique, mathématiques, électronique, communication. Les deux semestres validés.', 'Programming, algorithms, mathematics, electronics, communication. Both semesters passed.'),
      details: [
        t('Programmation : C (bases puis traitement de données), Python, OCaml ; listes, matrices, types algébriques, arbres binaires et arbres de recherche.', 'Programming: C (basics, then data processing), Python, OCaml; lists, matrices, algebraic types, binary trees and search trees.'),
        t('Architecture : numération, algèbre de Boole, logique séquentielle, systèmes à microprocesseurs.', 'Architecture: number systems, Boolean algebra, sequential logic, microprocessor systems.'),
        t('Mathématiques et physique : probabilités, suites, algèbre linéaire, espaces vectoriels ; mécanique, électronique, électromagnétisme.', 'Maths and physics: probability, sequences, linear algebra, vector spaces; mechanics, electronics, electromagnetism.'),
        t('IA générative : tokenisation, prompt engineering (chain-of-thought, few-shot), RAG, puis analyse critique des hallucinations et des biais.', 'Generative AI: tokenisation, prompt engineering (chain-of-thought, few-shot), RAG, then a critical look at hallucinations and bias.'),
        t('Cybersécurité, communication professionnelle et atelier de création d’entreprise à mission.', 'Cybersecurity, professional communication and a workshop on creating a purpose-driven company.'),
        t('Projets : Myst (SAE jeu, en groupe), minimake (individuel), puis un stage ouvrier de six semaines.', 'Projects: Myst (game project, team), minimake (solo), then a six-week work placement.'),
        t('Résultats : 60 crédits ECTS sur 60, moyenne au-dessus de celle de la promotion aux deux semestres. Mes meilleurs résultats : IA générative, méthodologie de travail, cybersécurité et communication.', 'Results: 60 ECTS credits out of 60, above the class average in both semesters. My best results: generative AI, study methods, cybersecurity and communication.'),
      ],
      skills: ['Python', 'C', 'OCaml', t('Algorithmique', 'Algorithms'), t('IA générative', 'Generative AI')],
      reflection: t(
        'La première année m’a surtout appris à travailler : suivre un rythme soutenu, rendre des projets à l’heure et apprendre seul ce qui n’est pas vu en cours. Je suis à l’aise en programmation et en communication ; les sciences de l’ingénieur (électronique, physique) et l’analyse en mathématiques me demandent plus d’efforts, et ce sont mes priorités pour cette année.',
        'First year mostly taught me how to work: keeping up a fast pace, delivering projects on time and learning on my own what isn’t covered in class. I’m comfortable with programming and communication; engineering sciences (electronics, physics) and calculus take me more effort, and they are my priorities this year.',
      ),
    },
    {
      id: 'bac',
      group: 'school',
      icon: 'school',
      period: '2022 – 2025',
      title: t('Baccalauréat général — mention Bien', 'Baccalauréat — with honours'),
      place: 'Lycée Bellevue Marie-Rivier',
      summary: t('Tuteur en informatique, co-président du BDL, BIA en seconde.', 'Computer science tutor, student council co-president, BIA in 10th grade.'),
      details: [
        t('Baccalauréat général obtenu avec mention Bien.', 'General baccalauréat passed with honours.'),
        t('Brevet d’initiation aéronautique obtenu en seconde.', 'Aeronautics initiation certificate earned in 10th grade.'),
        t('Responsable du tutorat en informatique et co-président du bureau des lycéens.', 'In charge of computer science tutoring and co-president of the student council.'),
      ],
      skills: [],
    },
    {
      id: 'college',
      group: 'school',
      icon: 'school',
      period: '2017 – 2022',
      title: t('Diplôme national du brevet — mention Très bien', 'Brevet — with high honours'),
      place: 'Collège Saint Jean',
      summary: t('Club création : modélisation et impression 3D.', 'Maker club: 3D modelling and printing.'),
      details: [t('Brevet obtenu avec mention Très bien.', 'Brevet passed with high honours.'), t('ASSR obtenue.', 'ASSR road-safety certificate obtained.')],
      skills: [],
    },
    {
      id: 'conservatoire',
      short: t('CONSERVATOIRE', 'CONSERVATOIRE'),
      group: 'music',
      icon: 'pillars',
      period: t('14 ans', '14 years'),
      title: t('Conservatoire de musique et de danse', 'Music and dance conservatoire'),
      place: 'Bagnols-sur-Cèze',
      summary: t('14 ans de conservatoire : guitare, batterie, formation musicale et orchestre. 5 diplômes.', '14 years at the conservatoire: guitar, drums, music theory and orchestra. 5 diplomas.'),
      details: [
        t('Guitare classique pendant 11 ans : cycles 1 et 2 validés avec mention Très bien.', 'Classical guitar for 11 years: cycles 1 and 2 passed with “Very good”.'),
        t('Formation musicale (solfège) pendant 11 ans : cycles 1 et 2 validés avec mention Bien.', 'Music theory for 11 years: cycles 1 and 2 passed with “Good”.'),
        t('Batterie pendant 4 ans : cycle 1 validé avec mention Très bien et les félicitations.', 'Drums for 4 years: cycle 1 passed with “Very good” and the jury’s congratulations.'),
        t('4 ans d’orchestre et de nombreuses représentations : concerts, auditions, concours.', '4 years of orchestra and many performances: concerts, recitals, competitions.'),
        t('Une base théorique solide, que je réinvestis aujourd’hui en composition.', 'A solid theory background that I now put into composing.'),
      ],
      skills: [t('Rigueur', 'Rigour'), t('Persévérance', 'Perseverance'), t('Confiance en soi', 'Self-confidence')],
      pod: t('Donnée : 14 ans. Soit plus longtemps que la plupart des unités YoRHa.', 'Data: 14 years. Longer than most YoRHa units have existed.'),
    },
  ]

  /* MUSIC (stage) and COMMITMENTS (lead, job, contest) */
  const experience: LogEntry[] = [
    {
      id: 'epimusic',
      short: 'EPIMUSIC',
      group: 'stage',
      icon: 'bass',
      period: t('2025 – aujourd’hui', '2025 – present'),
      title: t('Président de groupe — EPImusic', 'Band president — EPImusic'),
      place: t('Club musical de l’EPITA (BDE)', 'EPITA music club (student union)'),
      summary: t('Président et bassiste d’un groupe du club musical de l’école.', 'President and bassist of a band in the school’s music club.'),
      details: [
        t('Président d’un groupe étudiant du club EPImusic, rattaché au BDE de l’EPITA.', 'President of a student band in the EPImusic club, part of EPITA’s student union.'),
        t('Une dizaine de membres, dont 5 à 6 musiciens actifs. Répertoire : un peu de tout.', 'About ten members, 5 to 6 of them active musicians. Repertoire: a bit of everything.'),
        t('Bassiste : le groupe manquait de bassiste, et mon niveau de guitariste m’a permis de m’adapter à ses besoins.', 'Bassist: the band needed one, and my guitar level let me adapt to what it needed.'),
        t('Pratique toujours très régulière de la guitare, classique et électrique.', 'Still playing guitar very regularly, classical and electric.'),
      ],
      skills: [t('Leadership', 'Leadership'), t('Adaptabilité', 'Adaptability'), t('Travail en équipe', 'Teamwork')],
      pod: t('Observation : guitariste reconverti en bassiste pour les besoins de l’équipe. Adaptation confirmée.', 'Observation: guitarist turned bassist for the team’s sake. Adaptation confirmed.'),
    },
    {
      id: 'concerts',
      short: t('CONCERTS', 'CONCERTS'),
      group: 'stage',
      icon: 'guitar',
      period: t('Années de conservatoire', 'Conservatoire years'),
      title: t('Concerts et représentations', 'Concerts and performances'),
      place: 'Bagnols-sur-Cèze',
      summary: t('Trio au musée de Bagnols-sur-Cèze, solos aux concerts de Noël et à la fête de la musique.', 'A trio inside the Bagnols-sur-Cèze museum, solos at Christmas concerts and the Fête de la musique.'),
      details: [
        t('Concert exclusif en trio à l’intérieur du musée de Bagnols-sur-Cèze, lors de la journée nationale des musées.', 'An exclusive trio concert inside the Bagnols-sur-Cèze museum during the national museum day.'),
        t('Nombreux passages en solo : concerts de Noël, fête de la musique.', 'Many solo performances: Christmas concerts, Fête de la musique.'),
        t('Auditions et concours au conservatoire.', 'Recitals and competitions at the conservatoire.'),
      ],
      skills: [t('Confiance en soi', 'Self-confidence'), t('Engagement', 'Commitment')],
      photo: 'museum',
    },
    {
      id: 'orchestre',
      short: t('ORCHESTRE', 'ORCHESTRA'),
      group: 'stage',
      icon: 'note',
      period: t('4 ans', '4 years'),
      title: t('Orchestre du conservatoire', 'Conservatoire orchestra'),
      place: t('Conservatoire de Bagnols-sur-Cèze', 'Bagnols-sur-Cèze conservatoire'),
      summary: t('Quatre ans de jeu en orchestre et plusieurs représentations collectives.', 'Four years of orchestra playing and several ensemble performances.'),
      details: [
        t('Quatre années au sein de l’orchestre du conservatoire.', 'Four years in the conservatoire orchestra.'),
        t('Plusieurs représentations en formation collective.', 'Several ensemble performances.'),
        t('Apprendre à jouer ensemble : écouter les autres pupitres et suivre le chef.', 'Learning to play together: listening to the other sections and following the conductor.'),
      ],
      skills: [t('Travail en équipe', 'Teamwork'), t('Écoute', 'Listening')],
      photo: 'stage',
    },
    {
      id: 'bdl',
      short: t('BDL', 'STUDENT COUNCIL'),
      group: 'lead',
      icon: 'flag',
      period: '2024 – 2025',
      title: t('Co-président du bureau des lycéens', 'Student council co-president'),
      place: t('Lycée', 'High school'),
      summary: t('Organisation des fêtes du lycée et management d’équipe.', 'Organising school parties and managing a team.'),
      details: [
        t('Organisation des fêtes de Noël et de fin d’année du lycée.', 'Organised the school’s Christmas and end-of-year parties.'),
        t('Coordination et management d’une équipe d’élèves.', 'Coordinating and managing a team of students.'),
      ],
      skills: [t('Leadership', 'Leadership'), t('Organisation', 'Organisation'), t('Travail en équipe', 'Teamwork')],
    },
    {
      id: 'tutorat',
      short: t('TUTORAT', 'TUTORING'),
      group: 'lead',
      icon: 'code',
      period: '2024 – 2025',
      title: t('Responsable du tutorat en informatique', 'Head of computer science tutoring'),
      place: t('Lycée', 'High school'),
      summary: t('Chaque semaine, initier des collégiens à Python.', 'Every week, teaching Python to middle schoolers.'),
      details: [
        t('Une séance par semaine pendant mon année de terminale, pour des collégiens.', 'One session a week during my final year of high school, for middle schoolers.'),
        t('Au programme : Python, petites interfaces graphiques avec Tkinter et projets simples.', 'On the menu: Python, small graphical interfaces with Tkinter and simple projects.'),
        t('Préparer chaque séance et l’adapter à des débutants.', 'Preparing each session and adapting it to beginners.'),
      ],
      skills: [t('Pédagogie', 'Teaching'), t('Prise de parole', 'Public speaking'), 'Python'],
    },
    {
      id: 'club3d',
      group: 'lead',
      icon: 'chip',
      period: t('Collège (4e – 3e)', 'Middle school (8th – 9th grade)'),
      title: t('Club création', 'Maker club'),
      place: 'Collège Saint Jean',
      summary: t('Modélisation et impression 3D en équipe.', '3D modelling and printing as a team.'),
      details: [t('Modélisation et impression 3D.', '3D modelling and printing.'), t('Projets réalisés en équipe.', 'Projects made as a team.')],
      skills: [t('Créativité', 'Creativity'), t('Travail en équipe', 'Teamwork')],
    },
    {
      id: 'palace',
      short: t('STAGE — LE PALACE', 'INTERNSHIP — LE PALACE'),
      group: 'job',
      icon: 'case',
      period: t('Été 2026 — 6 semaines', 'Summer 2026 — 6 weeks'),
      title: t('Stage ouvrier — bar-tabac', 'Work placement — bar and tobacconist'),
      place: t('Le Palace, Bagnols-sur-Cèze', 'Le Palace, Bagnols-sur-Cèze'),
      summary: t('Six semaines de stage ouvrier (EPITA, 1re année) : tabac, bar, service, PMU, presse.', 'A six-week work placement (EPITA, 1st year): tobacco counter, bar, table service, betting, newspapers.'),
      details: [
        t('Stage ouvrier de première année à l’EPITA, réalisé dans un bar-tabac de Bagnols-sur-Cèze.', 'EPITA first-year work placement, in a bar and tobacconist in Bagnols-sur-Cèze.'),
        t('Poste principal : le comptoir tabac. J’ai appris plusieurs centaines de références pour servir vite et sans erreur.', 'Main post: the tobacco counter. I learned several hundred product references to serve quickly and without mistakes.'),
        t('Polyvalence : bar, service en salle, PMU, presse. Passer d’un poste à l’autre selon l’affluence.', 'Versatility: bar, table service, betting counter, newspapers. Moving between posts depending on the rush.'),
        t('Contact permanent avec une clientèle d’habitués comme de passage.', 'Constant contact with customers, regulars and passers-by alike.'),
      ],
      skills: [t('Relation client', 'Customer relations'), t('Polyvalence', 'Versatility'), t('Mémorisation', 'Memorisation'), t('Rigueur', 'Rigour'), t('Fiabilité', 'Reliability')],
      reflection: t(
        'Ce stage n’avait rien d’informatique, et c’est ce qui le rend utile : j’ai vu un commerce de l’intérieur, avec ses contraintes de rythme, de stock et de clientèle. Mémoriser des centaines de références, c’est organiser l’information pour la retrouver vite, un réflexe que je retrouve en programmation. J’en retiens surtout qu’un client ne voit pas le travail en coulisses, seulement le résultat : un futur logiciel aura des utilisateurs qui jugeront de la même façon.',
        'This placement had nothing to do with computing, and that is what makes it useful: I saw a business from the inside, with its constraints of pace, stock and customers. Memorising hundreds of references means organising information to find it fast, a reflex I use in programming too. Above all, I learned that customers never see the work behind the counter, only the result: the users of my future software will judge it the same way.',
      ),
      pod: t('Base de données interne : plusieurs centaines de références tabac. Indexation : manuelle.', 'Internal database: several hundred tobacco references. Indexing: manual.'),
    },
    {
      id: 'lavage',
      group: 'job',
      icon: 'case',
      period: t('Été 2025', 'Summer 2025'),
      title: t('Employé polyvalent', 'General employee'),
      place: t('Station de lavage automobile', 'Car wash'),
      summary: t('Travail saisonnier : accueil client et entretien de véhicules.', 'Seasonal job: welcoming customers and cleaning vehicles.'),
      details: [t('Travail saisonnier sur plusieurs périodes.', 'Seasonal work over several periods.'), t('Accueil et conseil des clients, entretien des véhicules.', 'Welcoming and advising customers, cleaning vehicles.')],
      skills: [t('Relation client', 'Customer relations'), t('Fiabilité', 'Reliability')],
    },
    {
      id: 'cabinet',
      short: t('CABINET COMPTABLE', 'ACCOUNTING FIRM'),
      group: 'job',
      icon: 'case',
      period: t('Nov. 2024', 'Nov. 2024'),
      title: t('Assistant administratif', 'Administrative assistant'),
      place: t('Cabinet d’expertise comptable', 'Accounting firm'),
      summary: t('Numérisation et classement de documents.', 'Scanning and filing documents.'),
      details: [t('Numérisation et classement de documents.', 'Scanning and filing documents.'), t('Respect strict de la confidentialité des données clients.', 'Strict confidentiality of client data.')],
      skills: [t('Rigueur', 'Rigour'), t('Confidentialité', 'Confidentiality')],
    },
    {
      id: 'eloquence',
      short: t('ÉLOQUENCE', 'ELOQUENCE'),
      group: 'speech',
      icon: 'mic',
      period: t('2022 – 2025 (seconde à terminale)', '2022 – 2025 (10th to 12th grade)'),
      title: t('Concours d’éloquence', 'Public speaking contests'),
      place: t('Lycée, dont le Lions Club', 'High school, including the Lions Club'),
      summary: t('Trois ans de concours d’éloquence, de la seconde à la terminale. 5e sur 18 au Lions Club.', 'Three years of public speaking contests, from 10th to 12th grade. 5th of 18 at the Lions Club.'),
      details: [
        t('Des concours d’éloquence chaque année, de la seconde à la terminale, sur des sujets variés.', 'Public speaking contests every year, from 10th to 12th grade, on a range of topics.'),
        t('Lions Club : 5e sur 18 participants, sur une citation de Bernard Clavel.', 'Lions Club: 5th out of 18, on a quote by Bernard Clavel.'),
        t('Des formats variés : sujet libre, thèse imposée face à un adversaire, mots imposés à placer dans le discours.', 'Varied formats: open topic, a thesis imposed against an opponent, set words to fit into the speech.'),
        t('Chaque texte écrit pour l’oral : pauses, gestes et accessoires notés dans la marge.', 'Every text written for the stage: pauses, gestures and props noted in the margin.'),
      ],
      skills: [t('Prise de parole', 'Public speaking'), t('Argumentation', 'Argumentation'), t('Écriture', 'Writing'), t('Confiance en soi', 'Self-confidence')],
      reflection: t(
        'L’éloquence m’a appris à construire un propos : partir d’une définition, dérouler un plan, puis surprendre avec un exemple inattendu. Défendre une thèse qu’on ne m’avait pas laissé choisir m’a aussi appris à argumenter au-delà de mon avis. C’est ce que j’attends d’un ingénieur : expliquer un choix technique et convaincre ceux qui ne le partagent pas encore.',
        'Public speaking taught me to build an argument: start from a definition, follow a plan, then surprise with an unexpected example. Defending a thesis I hadn’t been allowed to choose also taught me to argue beyond my own opinion. That is what I expect from an engineer: explaining a technical choice and convincing those who don’t share it yet.',
      ),
      speeches: [
        {
          id: 'pain',
          title: t('« Qui n’a jamais pétri et enfourné ne connaît point ce que coûte le pain »', '“Whoever has never kneaded and baked does not know what bread costs”'),
          context: t('Concours du Lions Club, citation de Bernard Clavel. Écrit à 16 ans.', 'Lions Club contest, a quote by Bernard Clavel. Written at 16.'),
          angle: t(
            'Le pain n’est pas cher, il est précieux. Je file la métaphore du pétrissage et de la cuisson jusqu’à l’alphabet (26 lettres, de Zola à Victor Hugo), puis jusqu’à mon propre texte : l’écrire, c’est pétrir ; vous le présenter, c’est l’enfourner. Avec un vieux morceau de pain sorti de ma poche en guise d’accessoire.',
            'Bread isn’t expensive, it is precious. I carry the metaphor of kneading and baking over to the alphabet (26 letters, from Zola to Victor Hugo), then to my own speech: writing it is kneading, presenting it is baking. With an old piece of bread pulled from my pocket as a prop.',
          ),
          quote: t('Écrire et lire, c’est pétrir et enfourner l’alphabet.', 'Writing and reading is kneading and baking the alphabet.'),
          result: t('5e / 18', '5th / 18'),
        },
        {
          id: 'pourquoi',
          title: t('« Pourquoi ? »', '“Why?”'),
          context: t('Concours d’éloquence, sujet libre en un mot.', 'Public speaking contest, an open one-word topic.'),
          angle: t(
            'Le « pourquoi » comme moteur de l’humanité : les premiers poissons sortis de l’eau, la question qui a mené Volta à la pile électrique, puis Ève devant l’arbre de la connaissance. Une ouverture en silence, comme si je me demandais moi-même pourquoi j’étais là.',
            '“Why” as the engine of humanity: the first fish to leave the water, the question that led Volta to the battery, then Eve before the tree of knowledge. It opens in silence, as if I were asking myself why I was there.',
          ),
          quote: t('Souvent, nous n’avons pas de réponse à ce « pourquoi », mais c’est justement ça qui nous fait avancer.', 'Often we have no answer to that “why”, and that is exactly what keeps us moving.'),
        },
        {
          id: 'jeunesse',
          title: t('« La jeunesse est épouvantable »', '“Youth is dreadful”'),
          context: t('Joute en duo, mai 2024 : l’un défend la thèse, l’autre l’antithèse. La thèse m’a été imposée.', 'A duo debate, May 2024: one argues the thesis, the other the antithesis. I was given the thesis.'),
          angle: t(
            'Défendre avec conviction, et un peu d’ironie, une position qui n’est pas la mienne : la jeunesse vue comme l’âge où l’on subit, puis comme la génération que les adultes accusent de tous les maux.',
            'Defending with conviction, and some irony, a position that isn’t mine: youth as the age when you just endure, then as the generation adults blame for everything.',
          ),
          quote: t('Elle est le long et interminable commencement de notre existence.', 'It is the long, endless beginning of our existence.'),
        },
        {
          id: 'courbe',
          title: t('« La courbe est la ligne géométrique de la beauté et du bonheur »', '“The curve is the geometric line of beauty and happiness”'),
          context: t(
            'Sujet imposé, avec sept mots à placer : chien de chasse, sucre d’orge, matériellement, ineptie, morphologie, outrecuidance, reliefs.',
            'Set topic, with seven words to fit in: hunting dog, barley sugar, materially, nonsense, morphology, arrogance, reliefs.',
          ),
          angle: t(
            'Commencer par réduire la courbe à un simple trait sans âme, puis tout renverser d’un « Quelle ineptie ! » : une amitié sans conflits, un monde sans reliefs seraient sans saveur.',
            'Start by reducing the curve to a soulless line, then turn it all around with a “What nonsense!”: a friendship without conflicts, a world without reliefs would have no flavour.',
          ),
          quote: t('Le bonheur, la beauté se trouvent dans les moindres reliefs du trait que nous traçons, et qu’on appelle la vie.', 'Happiness and beauty lie in the smallest reliefs of the line we draw, and call life.'),
        },
        {
          id: 'chocolat',
          title: t('« La vie est une boîte de chocolats »', '“Life is a box of chocolates”'),
          context: t('Pour le plaisir : un défi lancé en réunion de famille, thèse imposée.', 'Just for fun: a challenge at a family gathering, thesis imposed.'),
          angle: t(
            'Partir de Forrest Gump, décrire la boîte comme un objet d’artisan où chaque chocolat est unique, puis retourner l’image vers le public : nous aussi sommes faits de quelques ingrédients et d’une histoire propre.',
            'Start from Forrest Gump, describe the box as a crafted object where every chocolate is unique, then turn the image to the audience: we too are made of a few ingredients and a story of our own.',
          ),
          quote: t('Nous aussi avons eu notre propre histoire, spécifique à où nous sommes nés, et où nous avons vécu.', 'We too have had our own story, specific to where we were born and where we have lived.'),
        },
      ],
      photo: 'speech',
      pod: t('Corrélation détectée : un discours sur le pain, une passion pour la pâtisserie.', 'Correlation detected: a speech about bread, a passion for baking.'),
    },
    {
      id: 'theatre',
      short: t('THÉÂTRE', 'THEATRE'),
      group: 'speech',
      icon: 'mask',
      period: t('Collège — 4 ans', 'Middle school — 4 years'),
      title: t('Théâtre', 'Theatre'),
      place: 'Collège Saint Jean',
      summary: t('Quatre ans de théâtre au collège et trois pièces jouées en public.', 'Four years of theatre in middle school and three plays performed in public.'),
      details: [
        t('Quatre années de théâtre au collège.', 'Four years of theatre in middle school.'),
        t('« La Comedia del Paris », pièce écrite par ma professeure.', '“La Comedia del Paris”, a play written by my teacher.'),
        t('« La Gloire de mon père », d’après Marcel Pagnol, adaptée par ma professeure.', '“La Gloire de mon père”, after Marcel Pagnol, adapted by my teacher.'),
        t('« Le Médecin », pièce écrite par ma professeure.', '“Le Médecin”, a play written by my teacher.'),
      ],
      skills: [t('Prise de parole', 'Public speaking'), t('Mémorisation', 'Memorisation'), t('Travail en équipe', 'Teamwork'), t('Confiance en soi', 'Self-confidence')],
      reflection: t(
        'Le théâtre a été ma première scène : apprendre un texte, le jouer devant une salle et compter sur les autres comédiens. C’est là que j’ai pris l’habitude de parler en public, une aisance que j’ai retrouvée ensuite en concours d’éloquence.',
        'Theatre was my first stage: learning lines, performing them in front of an audience and relying on the other actors. That is where I got used to speaking in public, an ease I found again in public speaking contests.',
      ),
      photo: 'theatre',
      pod: t('Trois pièces, aucun trou de mémoire signalé dans les archives.', 'Three plays, no memory lapse recorded in the archives.'),
    },
    {
      id: 'hackathon',
      short: 'HACKATHON',
      group: 'contest',
      icon: 'code',
      period: t('Participation', 'Participation'),
      title: 'Hackathon',
      place: t('En équipe', 'As a team'),
      summary: t('Concevoir et livrer un projet en équipe, en temps limité.', 'Designing and shipping a project as a team, against the clock.'),
      details: [
        t('Participation à un hackathon en équipe.', 'Took part in a hackathon as a team.'),
        t('Travailler vite, à plusieurs, avec une échéance fixe.', 'Working fast, together, with a fixed deadline.'),
      ],
      skills: [t('Travail en équipe', 'Teamwork'), t('Gestion du temps', 'Time management')],
    },
  ]

  /* PROJECTS (code, tools) and MUSIC (instruments), linked to their proofs */
  const hardSkills: Skill[] = [
    { id: 'skill-python', name: 'Python', group: 'code', icon: 'code', detail: t('Jeu (pygame), traitement d’image, enseignement en tutorat.', 'A game (pygame), image processing, teaching it as a tutor.'), proofs: ['myst', 'tutorat'] },
    { id: 'skill-c', name: 'C', group: 'code', icon: 'code', detail: t('Pointeurs, mémoire, listes chaînées, processus et pipes.', 'Pointers, memory, linked lists, processes and pipes.'), proofs: ['minimake'] },
    { id: 'skill-ocaml', name: 'OCaml', group: 'code', icon: 'lambda', meta: t('BASES', 'BASICS'), detail: t('Bases de programmation fonctionnelle (cursus EPITA).', 'Functional programming basics (EPITA curriculum).'), proofs: ['epita-1'] },
    { id: 'skill-algo', name: t('Algorithmique', 'Algorithms'), group: 'code', icon: 'graph', detail: t('Génération procédurale, arbres, piles/files, parsing.', 'Procedural generation, trees, stacks/queues, parsing.'), proofs: ['myst', 'minimake'] },
    { id: 'skill-git', name: 'Git', group: 'tool', icon: 'branch', detail: t('Branches, fusions, forge EPITA et GitHub.', 'Branches, merges, EPITA forge and GitHub.'), proofs: ['myst', 'minimake'] },
    { id: 'skill-linux', name: 'Linux', group: 'tool', icon: 'terminal', detail: t(
        'Arch Linux au quotidien, que je personnalise sans cesse. Shell, compilation, et des scripts d’automatisation expérimentaux.',
        'Arch Linux as my daily driver, which I keep customising. Shell, compiling, and experimental automation scripts.',
      ),
      proofs: ['minimake', 'portfolio'],
    },
    { id: 'skill-web', name: 'Web', group: 'tool', icon: 'web', detail: t('React, TypeScript, Tailwind CSS.', 'React, TypeScript, Tailwind CSS.'), proofs: ['portfolio'] },
    {
      id: 'skill-guitar',
      name: t('Guitare', 'Guitar'),
      group: 'instrument',
      icon: 'guitar',
      meta: t('11 ANS', '11 YRS'),
      detail: t('Guitare classique au conservatoire pendant 11 ans, électrique depuis peu. Pratique toujours très régulière.', 'Classical guitar at the conservatoire for 11 years, electric more recently. Still playing very regularly.'),
      facts: [
        { k: t('Pratique', 'Practice'), v: t('11 ans de conservatoire', '11 years at the conservatoire') },
        { k: t('Diplômes', 'Diplomas'), v: t('Cycles 1 et 2 — mention Très bien', 'Cycles 1 & 2 — Very good') },
        { k: t('Styles', 'Styles'), v: t('Classique, électrique : un peu de tout', 'Classical, electric: a bit of everything') },
        { k: t('Statut', 'Status'), v: t('En activité', 'Active') },
      ],
      proofs: ['conservatoire', 'concerts', 'epimusic'],
      photo: 'electric',
      pod: t('Arme principale de l’unité. Niveau de maîtrise : élevé.', 'This unit’s main weapon. Mastery level: high.'),
    },
    {
      id: 'skill-bass',
      name: t('Basse', 'Bass'),
      group: 'instrument',
      icon: 'bass',
      meta: t('GROUPE', 'BAND'),
      detail: t('Bassiste de mon groupe EPImusic : j’ai pris le poste qui manquait, en m’appuyant sur mon niveau de guitariste.', 'Bassist of my EPImusic band: I took the missing spot, building on my guitar level.'),
      facts: [
        { k: t('Contexte', 'Context'), v: t('Groupe du club EPImusic', 'EPImusic club band') },
        { k: t('Statut', 'Status'), v: t('En activité', 'Active') },
      ],
      proofs: ['epimusic'],
    },
    {
      id: 'skill-drums',
      name: t('Batterie', 'Drums'),
      group: 'instrument',
      icon: 'drums',
      meta: t('4 ANS', '4 YRS'),
      detail: t(
        'Quatre ans de batterie au conservatoire, premier cycle validé avec les félicitations. Arrêtée au lycée : en internat, je ne pouvais plus jouer en semaine.',
        'Four years of drums at the conservatoire, first cycle passed with the jury’s congratulations. Stopped in high school: as a boarder, I couldn’t play during the week.',
      ),
      facts: [
        { k: t('Pratique', 'Practice'), v: t('4 ans de conservatoire', '4 years at the conservatoire') },
        { k: t('Diplôme', 'Diploma'), v: t('Cycle 1 — Très bien, félicitations', 'Cycle 1 — Very good, with honours') },
        { k: t('Statut', 'Status'), v: t('Arrêtée (internat au lycée)', 'Stopped (boarding school)') },
      ],
      proofs: ['conservatoire'],
    },
    {
      id: 'skill-fm',
      name: t('Formation musicale', 'Music theory'),
      group: 'instrument',
      icon: 'note',
      meta: t('11 ANS', '11 YRS'),
      detail: t(
        'Onze ans de formation musicale (solfège) au conservatoire : une théorie solide, utile pour jouer, déchiffrer et composer.',
        'Eleven years of music theory at the conservatoire: a solid foundation for playing, sight-reading and composing.',
      ),
      facts: [
        { k: t('Pratique', 'Practice'), v: t('11 ans de conservatoire', '11 years at the conservatoire') },
        { k: t('Diplômes', 'Diplomas'), v: t('Cycles 1 et 2 — mention Bien', 'Cycles 1 & 2 — Good') },
      ],
      proofs: ['conservatoire', 'orchestre'],
    },
    {
      id: 'skill-compo',
      name: t('Composition', 'Composing'),
      group: 'instrument',
      icon: 'wave',
      meta: t('MAO', 'DAW'),
      detail: t(
        'Composition sur FL Studio, en autodidacte : la technique du logiciel s’apprend, la théorie vient du conservatoire. Première composition complète : un morceau de kawaii future bass. J’ai aussi tenté d’écrire dans un style opéra.',
        'Composing in FL Studio, self-taught: I’m learning the software, the theory comes from the conservatoire. First complete piece: a kawaii future bass track. I’ve also tried writing in an operatic style.',
      ),
      facts: [
        { k: t('Outil', 'Tool'), v: 'FL Studio' },
        { k: t('Styles', 'Styles'), v: t('Kawaii future bass, essais d’opéra', 'Kawaii future bass, opera attempts') },
        { k: t('Statut', 'Status'), v: t('En apprentissage', 'Learning') },
      ],
      proofs: ['conservatoire'],
    },
  ]

  /* PROFILE — soft skills linked to their proofs */
  const softSkills: Skill[] = [
    { id: 'soft-team', name: t('Travail en équipe', 'Teamwork'), icon: 'chip', detail: t('Projets de groupe, BDL, orchestre, groupe EPImusic.', 'Group projects, student council, orchestra, EPImusic band.'), proofs: ['myst', 'bdl', 'orchestre', 'epimusic'] },
    { id: 'soft-rigour', name: t('Rigueur', 'Rigour'), icon: 'chip', detail: t('14 ans de conservatoire, tests automatiques, confidentialité des documents.', '14 years of conservatoire, automated tests, document confidentiality.'), proofs: ['conservatoire', 'minimake', 'cabinet'] },
    { id: 'soft-grit', name: t('Persévérance', 'Perseverance'), icon: 'chip', detail: t('Volonté et engagement : années de conservatoire, débogage jusqu’au bout.', 'Determination: years of conservatoire, debugging to the end.'), proofs: ['conservatoire', 'minimake'] },
    { id: 'soft-confidence', name: t('Confiance en soi', 'Self-confidence'), icon: 'chip', detail: t('Jouer seul devant un public, monter sur scène, défendre une idée en concours.', 'Playing solo in front of an audience, acting on stage, defending an idea in a contest.'), proofs: ['concerts', 'theatre', 'eloquence'] },
    { id: 'soft-speaking', name: t('Prise de parole', 'Public speaking'), icon: 'chip', detail: t('Quatre ans de théâtre, trois ans de concours d’éloquence, des cours donnés.', 'Four years of theatre, three years of public speaking contests, lessons given.'), proofs: ['theatre', 'eloquence', 'tutorat'] },
    { id: 'soft-lead', name: t('Leadership', 'Leadership'), icon: 'chip', detail: t('Co-présidence du BDL, présidence d’un groupe EPImusic.', 'Student council co-president, EPImusic band president.'), proofs: ['bdl', 'epimusic'] },
    { id: 'soft-adapt', name: t('Adaptabilité', 'Adaptability'), icon: 'chip', detail: t('Passer de la guitare à la basse pour les besoins du groupe.', 'Switching from guitar to bass for the band’s needs.'), proofs: ['epimusic'] },
    { id: 'soft-teach', name: t('Pédagogie', 'Teaching'), icon: 'chip', detail: t('Transmettre la programmation à des débutants.', 'Teaching programming to beginners.'), proofs: ['tutorat'] },
    { id: 'soft-client', name: t('Relation client', 'Customer relations'), icon: 'chip', detail: t('Accueillir, conseiller et servir, y compris dans le rush.', 'Welcoming, advising and serving, rush hour included.'), proofs: ['palace', 'lavage'] },
    { id: 'soft-versatile', name: t('Polyvalence', 'Versatility'), icon: 'chip', detail: t('Passer d’un poste à l’autre selon les besoins : tabac, bar, service ; guitare puis basse.', 'Switching posts as needed: tobacco counter, bar, service; guitar, then bass.'), proofs: ['palace', 'epimusic'] },
  ]

  /* PROFILE — the three key competences, with proofs and an honest review */
  const keySkills: KeySkill[] = [
    {
      id: 'key-code',
      icon: 'code',
      name: t('Concevoir et programmer un logiciel', 'Designing and programming software'),
      summary: t('Du besoin au programme qui fonctionne, testé, en C comme en Python.', 'From the need to a working, tested program, in C as in Python.'),
      why: t(
        'C’est le cœur du métier d’ingénieur en informatique : comprendre un besoin, choisir une structure de données, écrire un code juste et le faire évoluer. Savoir le faire en C, au plus près de la machine, aide à comprendre tout le reste.',
        'It is the core of a software engineer’s job: understanding a need, choosing a data structure, writing correct code and making it evolve. Doing it in C, close to the machine, helps understand everything else.',
      ),
      level: 3,
      proofs: ['minimake', 'myst', 'portfolio', 'epita-1'],
      mastered: [
        t('Mener seul un projet en C de bout en bout : parsing, structures chaînées, gestion de la mémoire (minimake).', 'Carrying a C project alone from start to finish: parsing, linked structures, memory management (minimake).'),
        t('Concevoir un algorithme sur un graphe et prouver qu’il marche : toutes les salles de Myst sont atteignables.', 'Designing a graph algorithm and showing it works: every room in Myst is reachable.'),
        t('Utiliser Git en équipe : branches, fusions, résolution de conflits.', 'Using Git as a team: branches, merges, resolving conflicts.'),
      ],
      gaps: [
        t('Je dépends encore des tests fournis au lieu d’écrire les miens.', 'I still rely on the provided tests instead of writing my own.'),
        t('Je code parfois avant d’avoir fixé l’architecture, ce qui coûte des corrections tardives.', 'I sometimes code before settling the architecture, which costs late fixes.'),
        t('Mon code est peu documenté, et je n’utilise pas encore systématiquement Valgrind ou gdb.', 'My code is lightly documented, and I don’t yet use Valgrind or gdb systematically.'),
      ],
      next: [
        t('Sur l’OCR : écrire les interfaces entre modules avant de coder, et des tests pour chacun.', 'On the OCR project: write the interfaces between modules before coding, and tests for each one.'),
        t('Passer chaque projet C sous Valgrind avant de le rendre.', 'Run every C project through Valgrind before handing it in.'),
        t('Un README clair pour chaque dépôt.', 'A clear README for every repository.'),
      ],
    },
    {
      id: 'key-team',
      icon: 'flag',
      name: t('Travailler en équipe et prendre des responsabilités', 'Working as a team and taking responsibility'),
      summary: t('Organiser, répartir, s’adapter à ce dont le groupe a besoin.', 'Organising, sharing the work, adapting to what the group needs.'),
      why: t(
        'Un logiciel se construit à plusieurs : il faut se répartir le travail, faire tenir les morceaux ensemble et parfois prendre le rôle que personne ne prend. C’est aussi ce qui permettra, plus tard, d’encadrer une équipe.',
        'Software is built together: work must be shared out, the pieces must fit, and sometimes you take the role nobody else takes. It is also what will later make it possible to lead a team.',
      ),
      level: 4,
      proofs: ['myst', 'epimusic', 'bdl', 'orchestre'],
      mastered: [
        t('Prendre des responsabilités : co-président du bureau des lycéens, président d’un groupe EPImusic.', 'Taking responsibility: student council co-president, president of an EPImusic band.'),
        t('Organiser un événement avec une équipe : fêtes de Noël et de fin d’année du lycée.', 'Organising an event with a team: the school’s Christmas and end-of-year parties.'),
        t('M’adapter aux besoins du groupe : passer de la guitare à la basse ; gérer le dépôt et les fusions de Myst.', 'Adapting to what the group needs: switching from guitar to bass; handling Myst’s repository and merges.'),
        t('Jouer ensemble : quatre ans d’orchestre, à écouter les autres pupitres.', 'Playing together: four years of orchestra, listening to the other sections.'),
      ],
      gaps: [
        t('Fixer une organisation claire dès le départ : sur Myst, l’architecture est venue trop tard.', 'Setting a clear organisation from the start: on Myst, the architecture came too late.'),
        t('Mieux tracer les échanges : messages de commit explicites, décisions écrites.', 'Keeping a better record: explicit commit messages, written decisions.'),
      ],
      next: [
        t('Sur l’OCR : une répartition des tâches et des interfaces écrites dès la première semaine.', 'On the OCR project: task sharing and written interfaces from the first week.'),
        t('Suivre le travail du groupe avec des tickets (issues) plutôt qu’à l’oral.', 'Track the group’s work with issues rather than by word of mouth.'),
      ],
    },
    {
      id: 'key-comm',
      icon: 'mic',
      name: t('Communiquer et transmettre', 'Communicating and passing knowledge on'),
      summary: t('Parler en public, expliquer à des débutants, échanger avec des clients.', 'Speaking in public, explaining to beginners, dealing with customers.'),
      why: t(
        'Un ingénieur doit défendre ses choix, présenter un projet, former des collègues et comprendre ce que veut un utilisateur. Une bonne idée mal expliquée n’est pas retenue.',
        'An engineer has to defend choices, present a project, train colleagues and understand what a user wants. A good idea badly explained is not kept.',
      ),
      level: 4,
      proofs: ['tutorat', 'eloquence', 'theatre', 'palace'],
      mastered: [
        t('Prendre la parole devant un public : quatre ans de théâtre, trois ans de concours d’éloquence (5e sur 18 au Lions Club), concerts en solo.', 'Speaking in front of an audience: four years of theatre, three years of public speaking contests (5th of 18 at the Lions Club), solo concerts.'),
        t('Adapter une explication à des débutants : un an de tutorat Python pour des collégiens.', 'Adapting an explanation to beginners: a year teaching Python to middle schoolers.'),
        t('Échanger avec des clients, vite et clairement : stage au Palace.', 'Dealing with customers, quickly and clearly: internship at Le Palace.'),
        t('Les cours de communication font partie de mes meilleurs résultats à l’EPITA.', 'Communication courses are among my best results at EPITA.'),
      ],
      gaps: [
        t('L’écrit technique : documentation, rapports, README.', 'Technical writing: documentation, reports, READMEs.'),
        t('L’anglais professionnel, aujourd’hui au niveau B2.', 'Professional English, currently at B2 level.'),
      ],
      next: [
        t('L’oral de 20 minutes du projet de recherche du S3.', 'The 20-minute talk of the semester 3 research project.'),
        t('Documenter chaque projet comme si quelqu’un d’autre devait le reprendre.', 'Document every project as if someone else had to take it over.'),
        t('Lire et écrire davantage en anglais technique.', 'Read and write more technical English.'),
      ],
    },
  ]

  const selfAssessment = {
    strengths: [
      t('Aisance à l’oral et goût de la transmission (tutorat, éloquence, théâtre, scène).', 'At ease speaking and enjoy passing knowledge on (tutoring, eloquence, theatre, stage).'),
      t('Rigueur et constance acquises en 14 ans de conservatoire.', 'Rigour and consistency built over 14 years of conservatoire.'),
      t('Autonomie sur des projets techniques de bout en bout.', 'Autonomous on technical projects from start to finish.'),
      t('Habitude du travail collectif et des responsabilités (BDL, orchestre, EPImusic).', 'Used to teamwork and responsibility (student council, orchestra, EPImusic).'),
      t('Polyvalence et sens du service, confirmés en stage.', 'Versatility and customer care, confirmed during my internship.'),
    ],
    improvements: [
      t('Documenter davantage mon code et écrire des messages de commit explicites.', 'Document my code more and write clearer commit messages.'),
      t('Planifier l’architecture avant de coder, surtout en équipe.', 'Plan the architecture before coding, especially in a team.'),
      t('Écrire mes propres tests plutôt que de dépendre de ceux fournis.', 'Write my own tests instead of relying on the provided ones.'),
      t('Choisir une spécialité : explorer plusieurs domaines pour trouver celui qui me correspond.', 'Choose a speciality: explore several fields to find the one that suits me.'),
      t('Renforcer les sciences de l’ingénieur (électronique, physique) et l’analyse, mes matières les plus difficiles.', 'Strengthen engineering sciences (electronics, physics) and calculus, my hardest subjects.'),
    ],
  }

  const outlook = {
    interests: [
      t('Développement logiciel', 'Software development'),
      t('Systèmes, Linux et bas niveau', 'Systems, Linux and low level'),
      t('Développement de jeux', 'Game development'),
      t('Outils et automatisation', 'Tools and automation'),
      t('Intelligence artificielle, avec un regard critique sur ses limites', 'Artificial intelligence, with a critical eye on its limits'),
      t('Cybersécurité, découverte en première année', 'Cybersecurity, discovered in first year'),
    ],
    next: t(
      'Poursuivre en cycle ingénieur à l’EPITA, explorer plusieurs domaines avant de choisir ma spécialité, et devenir ingénieur.',
      'Continue into EPITA’s engineering cycle, explore several fields before choosing my speciality, and become an engineer.',
    ),
  }

  const contact = {
    email: 'louis.leymonie@outlook.fr',
    github: 'https://github.com/CoolLyfe',
    /** my own CV layout (public/), phone and postal address removed */
    cv: 'Louis_Leymonie_CV.pdf',
    location: 'Toulouse, France',
  }

  return {
    identity,
    about,
    now,
    strengths,
    featured,
    music,
    languages,
    interests,
    gallery,
    diplomas,
    projects,
    education,
    experience,
    hardSkills,
    softSkills,
    keySkills,
    selfAssessment,
    outlook,
    contact,
  }
}

export type Profile = ReturnType<typeof buildProfile>

export const PROFILES: Record<'fr' | 'en', Profile> = {
  fr: buildProfile(translator('fr')),
  en: buildProfile(translator('en')),
}
