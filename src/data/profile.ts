/* ==================================================================
   profile.ts — the ONLY file to edit to update the site's content.
   Sources: CV, cover letter, and the project repositories in ~/Epita.
   Personal data deliberately left out of the public site: phone
   number, postal address, photo.
   ================================================================== */

import type { Glyph } from '../components/icons'

export type TabId = 'map' | 'quests' | 'items' | 'weapons' | 'skills' | 'intel' | 'system'

export interface Project {
  id: string
  code: string // menu label, e.g. "MYST"
  /** INTEL category */
  group: 'team' | 'solo'
  title: string
  summary: string // one line, shown on the collapsed card
  period: string
  context: string
  objective: string
  stack: string[]
  architecture: { name: string; role: string }[]
  metrics: { k: string; v: string }[]
  role: string[]
  challenges: string[]
  retrospective: string
  hardSkills: string[]
  softSkills: string[]
  links?: { label: string; href: string }[]
  image?: { src: string; caption: string }
}

export interface LogEntry {
  id: string
  /** MAP: school | music — QUESTS: job | commitment | stage */
  group: 'school' | 'music' | 'job' | 'commitment' | 'stage'
  icon: Glyph
  /** short label when cited as a proof */
  short?: string
  period: string
  title: string
  place: string
  summary: string
  details: string[]
  skills: string[]
}

export interface Skill {
  name: string
  /** WEAPONS category (unused for soft skills) */
  group?: 'code' | 'tool' | 'instrument'
  icon: Glyph
  /** list meta, e.g. "11 ans" (defaults to the proof count) */
  meta?: string
  detail: string
  facts?: { k: string; v: string }[]
  proofs: string[] // Project or experience ids demonstrating it
}

export interface Diploma {
  id: string
  group: 'school' | 'music'
  icon: Glyph
  name: string
  issuer: string
  year?: string
  grade?: string
  detail: string
}

/* ---------------------------------------------------------------- */

export const identity = {
  name: 'Louis Leymonie',
  unit: 'EPITA TOULOUSE // PROMO 2030',
  role: 'Étudiant EPITA en recherche de stage',
  status: 'Classe préparatoire intégrée — 2e année (S3)',
  location: 'Toulouse, France',
  target: 'Stage — développement logiciel / intelligence artificielle',
}

/* SYSTEM — introduction and positioning */
export const about = {
  profile:
    'Étudiant en informatique à l’EPITA, je recherche un stage me permettant de mettre en pratique mes compétences en programmation. Sérieux et impliqué, j’ai acquis une bonne aisance à l’oral lors de tutorats et de présentations. J’apprécie le travail en équipe et l’apprentissage par l’expérience.',
  motivation:
    'Je souhaite orienter mon parcours vers le développement logiciel en intelligence artificielle. J’aime concevoir des outils concrets, capables d’apporter une réelle valeur ajoutée à leurs utilisateurs : analyser un besoin, construire l’outil, puis l’améliorer en continu.',
  beyond:
    'Mon parcours ne se limite pas au cadre académique. Quatorze ans de conservatoire et cinq diplômes de musique m’ont appris la rigueur, la volonté et la confiance en soi sur scène. Aujourd’hui président et bassiste d’un groupe du club EPImusic, et ancien co-président du bureau des lycéens, j’aime organiser des projets collectifs et prendre des responsabilités.',
  objectives: [
    'Présenter mon parcours académique et les acquis de mes premières années.',
    'Relier chaque compétence à une réalisation ou une expérience concrète.',
    'Évaluer honnêtement mes points forts et mes axes de progression.',
    'Disposer d’un outil évolutif, enrichi à chaque semestre.',
  ],
  conclusion:
    'En un peu plus d’un an, je suis passé de l’écriture de programmes isolés en Python à la conception de systèmes complets en C, testés et construits en équipe. Ce portfolio est un point d’étape : il sera enrichi au fil de mes projets et de mon premier stage en entreprise.',
}

/* MUSIC — the conservatoire at a glance (MAP and details) */
export const music = {
  school: 'Conservatoire de musique et de danse de Bagnols-sur-Cèze',
  years: 14,
  tracks: [
    { name: 'Guitare', years: 11, note: 'Cycles 1 et 2 — Très bien' },
    { name: 'Formation musicale', years: 11, note: 'Cycles 1 et 2 — Bien' },
    { name: 'Batterie', years: 4, note: 'Cycle 1 — Très bien, félicitations' },
    { name: 'Orchestre', years: 4, note: 'Représentations collectives' },
  ],
  brought: ['Passion', 'Rigueur', 'Volonté', 'Engagement', 'Confiance en soi'],
}

export const languages = [
  { name: 'Français', level: 'Natif', value: 5 },
  { name: 'Anglais', level: 'B2', value: 4 },
  { name: 'Allemand', level: 'A2', value: 2 },
]

export const interests: { name: string; icon: Glyph; detail: string }[] = [
  { name: 'Aïkido', icon: 'heart', detail: '6 ans de pratique.' },
  { name: 'Hand-ball', icon: 'heart', detail: '4 ans de pratique.' },
  { name: 'Aéronautique', icon: 'plane', detail: 'Brevet d’initiation aéronautique obtenu en seconde.' },
  { name: 'Pâtisserie', icon: 'heart', detail: 'Précision, dosage et patience.' },
  { name: 'Jeux vidéo', icon: 'gamepad', detail: 'Et c’est un peu la raison d’être de cette interface.' },
]

/* ITEMS — key items: diplomas and certifications */
export const diplomas: Diploma[] = [
  {
    id: 'dip-bac',
    group: 'school',
    icon: 'scroll',
    name: 'Baccalauréat général',
    issuer: 'Lycée Bellevue Marie-Rivier',
    year: '2025',
    grade: 'Mention Bien',
    detail: 'Baccalauréat général obtenu avec mention Bien.',
  },
  {
    id: 'dip-brevet',
    group: 'school',
    icon: 'scroll',
    name: 'Diplôme national du brevet',
    issuer: 'Collège Saint Jean',
    year: '2022',
    grade: 'Mention Très bien',
    detail: 'Brevet obtenu avec mention Très bien.',
  },
  {
    id: 'dip-bia',
    group: 'school',
    icon: 'plane',
    name: 'Brevet d’initiation aéronautique',
    issuer: 'Lycée — classe de seconde',
    detail: 'Brevet d’initiation aéronautique obtenu en classe de seconde.',
  },
  {
    id: 'dip-pix',
    group: 'school',
    icon: 'chip',
    name: 'Certification PIX',
    issuer: 'Certification nationale',
    detail: 'Certification des compétences numériques.',
  },
  {
    id: 'dip-assr',
    group: 'school',
    icon: 'scroll',
    name: 'ASSR',
    issuer: 'Collège',
    detail: 'Attestation scolaire de sécurité routière.',
  },
  {
    id: 'dip-gtr-2',
    group: 'music',
    icon: 'medal',
    name: 'Guitare — fin de cycle 2',
    issuer: 'Conservatoire de Bagnols-sur-Cèze',
    grade: 'Mention Très bien',
    detail: 'Guitare classique, deuxième cycle validé avec mention Très bien.',
  },
  {
    id: 'dip-gtr-1',
    group: 'music',
    icon: 'medal',
    name: 'Guitare — fin de cycle 1',
    issuer: 'Conservatoire de Bagnols-sur-Cèze',
    grade: 'Mention Très bien',
    detail: 'Guitare classique, premier cycle validé avec mention Très bien.',
  },
  {
    id: 'dip-fm-2',
    group: 'music',
    icon: 'medal',
    name: 'Formation musicale — fin de cycle 2',
    issuer: 'Conservatoire de Bagnols-sur-Cèze',
    grade: 'Mention Bien',
    detail: 'Formation musicale (solfège), deuxième cycle validé avec mention Bien.',
  },
  {
    id: 'dip-fm-1',
    group: 'music',
    icon: 'medal',
    name: 'Formation musicale — fin de cycle 1',
    issuer: 'Conservatoire de Bagnols-sur-Cèze',
    grade: 'Mention Bien',
    detail: 'Formation musicale (solfège), premier cycle validé avec mention Bien.',
  },
  {
    id: 'dip-bat-1',
    group: 'music',
    icon: 'medal',
    name: 'Batterie — fin de cycle 1',
    issuer: 'Conservatoire de Bagnols-sur-Cèze',
    grade: 'Très bien, félicitations',
    detail: 'Batterie, premier cycle validé avec mention Très bien et les félicitations.',
  },
]

/* INTEL — significant projects */
export const projects: Project[] = [
  {
    id: 'myst',
    code: 'MYST',
    group: 'team',
    title: 'Myst — jeu 2D à génération procédurale',
    summary: 'Donjon généré aléatoirement à chaque partie.',
    period: 'Janv. – mars 2026',
    context: 'Projet de groupe (« Four Man Army Studio »), mené en parallèle du S2.',
    objective:
      'Créer un jeu d’exploration dont la carte change à chaque partie : salles typées (départ, combat, butin, boss), menu, et un joueur qui se déplace entre les salles.',
    stack: ['Python', 'pygame', 'Pillow', 'Git / GitHub'],
    architecture: [
      { name: 'procedural_gen.py', role: 'Génère la grille de salles et leurs connexions, puis rend la carte en image.' },
      { name: 'player.py', role: 'Déplacements et collisions du joueur.' },
      { name: 'game.py', role: 'Boucle de jeu, caméra qui suit le joueur, affichage.' },
      { name: 'menu.py', role: 'Menu principal et boutons (réalisé par un coéquipier).' },
    ],
    metrics: [
      { k: 'Salles / partie', v: '15 – 20' },
      { k: 'Grille', v: '8 × 5' },
      { k: 'Commits', v: '14 / 22' },
      { k: 'Contributeurs', v: '3' },
    ],
    role: [
      'Conception de l’algorithme de génération procédurale de la carte.',
      'Collisions et déplacement du joueur.',
      'Intégration du menu avec la boucle de jeu.',
      'Création du dépôt, .gitignore, gestion des fusions de branches.',
    ],
    challenges: [
      'Garantir que toutes les salles soient atteignables : l’algorithme part de la salle de départ et ne crée une salle qu’à côté d’une salle existante (marche aléatoire), ce qui produit toujours un graphe connexe.',
      'Éviter les carrefours illisibles : 3 sorties maximum par salle.',
      'Placer le boss loin du départ : la salle du boss est toujours la dernière générée.',
    ],
    retrospective:
      'Nous avons codé avant de fixer l’architecture : l’intégration menu ↔ jeu a demandé des corrections tardives. La prochaine fois, je définirais les interfaces entre modules dès le départ et j’écrirais des messages de commit plus explicites.',
    hardSkills: ['Algorithmique (graphes)', 'Python', 'Git en équipe'],
    softSkills: ['Travail en équipe', 'Répartition des tâches'],
    links: [
      { label: 'Site du jeu', href: 'https://myst-official.base44.app' },
      { label: 'Dépôt GitHub', href: 'https://github.com/CoolLyfe/Myst' },
    ],
    image: {
      src: 'evidence/myst-map.webp',
      caption: 'Carte générée : départ en vert, boss en rouge, couloirs en jaune.',
    },
  },
  {
    id: 'minimake',
    code: 'MINIMAKE',
    group: 'solo',
    title: 'minimake — réimplémentation de make en C',
    summary: 'Lit un Makefile, résout les dépendances, exécute.',
    period: 'Avr. – mai 2026',
    context: 'Projet individuel EPITA (S2), vérifié par une suite de tests automatiques.',
    objective:
      'Reproduire le cœur de GNU make : lire un Makefile, résoudre les dépendances entre cibles et exécuter les commandes nécessaires dans le bon ordre.',
    stack: ['C', 'POSIX', 'Makefile', 'Tests Python + YAML'],
    architecture: [
      { name: 'parseur()', role: 'Lit le fichier ligne par ligne : variables, règles, dépendances, commandes.' },
      { name: 'remplacer_vars()', role: 'Substitue récursivement les ${VAR} dans les commandes.' },
      { name: 'exec()', role: 'Résout récursivement les dépendances puis lance les commandes.' },
      { name: 'print_all()', role: 'Mode -p : affiche règles et variables.' },
    ],
    metrics: [
      { k: 'Lignes de C', v: '≈ 380' },
      { k: 'Options CLI', v: '-h -p -f' },
      { k: 'Structures', v: '3 listes chaînées' },
      { k: 'Scénarios de test', v: '2 modes' },
    ],
    role: [
      'Conception et écriture complètes, seul.',
      'Messages d’erreur et codes de retour identiques à GNU make.',
    ],
    challenges: [
      'Variables imbriquées : la substitution est répétée tant qu’il reste un ${…} dans la commande.',
      'Cible sans règle : si un fichier du même nom existe, il est considéré à jour ; sinon arrêt avec « No rule to make target ».',
      'Gestion mémoire : chaque commande est dupliquée, substituée puis libérée.',
    ],
    retrospective:
      'J’ai utilisé des variables globales pour aller vite ; les regrouper dans une structure passée aux fonctions rendrait le code plus testable. Un passage sous Valgrind validerait la gestion mémoire.',
    hardSkills: ['C (pointeurs, mémoire)', 'Parsing', 'Appels système', 'Tests'],
    softSkills: ['Rigueur', 'Autonomie', 'Persévérance'],
  },
  {
    id: 'portfolio',
    code: 'PORTFOLIO',
    group: 'solo',
    title: 'Ce portfolio — menu YoRHa',
    summary: 'Reproduction du menu de NieR: Automata, mode hacking inclus.',
    period: 'Sept. 2026',
    context: 'Projet personnel, réalisé pour le cours « Portfolio professionnel » du S3.',
    objective:
      'Présenter mon parcours sous la forme du menu de NieR: Automata : navigation par onglets et catégories, fiches illustrées, et un passage en mode hacking pour ouvrir les dossiers détaillés.',
    stack: ['React 19', 'TypeScript', 'Tailwind CSS 4', 'Framer Motion', 'SVG', 'Vite'],
    architecture: [
      { name: 'data/profile.ts', role: 'Tout le contenu, séparé de l’interface.' },
      { name: 'menu/tabs.tsx', role: 'Les 7 onglets, leurs catégories et la fiche de chaque entrée.' },
      { name: 'menu/Breach.tsx', role: 'Fiche → passage en mode hacking → dossier détaillé (animation partagée Framer Motion).' },
      { name: 'hack/Terminal.tsx', role: 'Terminal caché : archives chiffrées, export du CV.' },
    ],
    metrics: [
      { k: 'Onglets', v: '7' },
      { k: 'Panneaux', v: '3' },
      { k: 'Dépendances', v: '3' },
      { k: 'Données perso', v: '1 fichier' },
    ],
    role: [
      'Direction artistique et structure des contenus.',
      'Développé avec l’aide d’un assistant IA (Claude Code) : relecture, choix et adaptation du code.',
    ],
    challenges: [
      'Changer de palette sur une seule fenêtre (hacking) : les couleurs passent par des variables CSS redéfinies localement.',
      'Reproduire la navigation à trois panneaux du jeu (catégories, liste, fiche) au clavier comme à la souris.',
      'Garder une interface de jeu dense tout en restant lisible sur un écran de 400 px.',
    ],
    retrospective:
      'Séparer le contenu de l’interface a permis de refondre plusieurs fois le design sans réécrire le texte. J’ai finalement retiré le mini-jeu de hacking : amusant, mais il ralentissait l’accès à l’information.',
    hardSkills: ['Développement web', 'TypeScript', 'SVG'],
    softSkills: ['Créativité', 'Esprit critique'],
    links: [{ label: 'Code source', href: 'https://github.com/CoolLyfe/nier-portfolio' }],
  },
]

/* MAP — academic and musical path */
export const education: LogEntry[] = [
  {
    id: 'epita-2',
    group: 'school',
    icon: 'school',
    period: '2026 – 2027',
    title: 'Classe préparatoire intégrée — 2e année',
    place: 'EPITA Toulouse',
    summary: 'Semestre 3 en cours.',
    details: [
      'Programmation C avancée, théorie des langages, mathématiques, physique, anglais.',
      'Cours « Portfolio professionnel » et recherche documentaire.',
    ],
    skills: ['C', 'Théorie des langages'],
  },
  {
    id: 'epita-1',
    short: 'EPITA S1–S2',
    group: 'school',
    icon: 'school',
    period: '2025 – 2026',
    title: 'Classe préparatoire intégrée — 1re année',
    place: 'EPITA Toulouse',
    summary: 'Programmation, algorithmique, mathématiques, architecture.',
    details: [
      'Programmation en Python, C et OCaml ; algorithmique et structures de données.',
      'Architecture des ordinateurs, algèbre linéaire, électromagnétisme.',
      'Initiation à l’intelligence artificielle (TP).',
    ],
    skills: ['Python', 'C', 'OCaml', 'Algorithmique'],
  },
  {
    id: 'bac',
    group: 'school',
    icon: 'school',
    period: '2022 – 2025',
    title: 'Baccalauréat général — mention Bien',
    place: 'Lycée Bellevue Marie-Rivier',
    summary: 'Tuteur en informatique, co-président du BDL, BIA en seconde.',
    details: [
      'Baccalauréat général obtenu avec mention Bien.',
      'Brevet d’initiation aéronautique obtenu en seconde.',
      'Responsable du tutorat en informatique et co-président du bureau des lycéens.',
    ],
    skills: [],
  },
  {
    id: 'college',
    group: 'school',
    icon: 'school',
    period: '2017 – 2022',
    title: 'Diplôme national du brevet — mention Très bien',
    place: 'Collège Saint Jean',
    summary: 'Club création : modélisation et impression 3D.',
    details: ['Brevet obtenu avec mention Très bien.', 'ASSR obtenue.'],
    skills: [],
  },
  {
    id: 'conservatoire',
    short: 'CONSERVATOIRE',
    group: 'music',
    icon: 'pillars',
    period: '14 ans',
    title: 'Conservatoire de musique et de danse',
    place: 'Bagnols-sur-Cèze',
    summary: '14 ans de conservatoire : guitare, batterie, formation musicale et orchestre. 5 diplômes.',
    details: [
      'Guitare classique pendant 11 ans : cycles 1 et 2 validés avec mention Très bien.',
      'Formation musicale (solfège) pendant 11 ans : cycles 1 et 2 validés avec mention Bien.',
      'Batterie pendant 4 ans : cycle 1 validé avec mention Très bien et les félicitations.',
      '4 ans d’orchestre et de nombreuses représentations : concerts, auditions, concours.',
      'Une base théorique solide, que je réinvestis aujourd’hui en composition.',
    ],
    skills: ['Rigueur', 'Persévérance', 'Confiance en soi'],
  },
]

/* QUESTS — jobs, commitments, stage */
export const experience: LogEntry[] = [
  {
    id: 'lavage',
    group: 'job',
    icon: 'case',
    period: 'Été 2025',
    title: 'Employé polyvalent',
    place: 'Station de lavage automobile',
    summary: 'Travail saisonnier : accueil client et entretien de véhicules.',
    details: ['Travail saisonnier sur plusieurs périodes.', 'Accueil et conseil des clients, entretien des véhicules.'],
    skills: ['Relation client', 'Fiabilité'],
  },
  {
    id: 'cabinet',
    short: 'CABINET COMPTABLE',
    group: 'job',
    icon: 'case',
    period: 'Nov. 2024',
    title: 'Assistant administratif',
    place: 'Cabinet d’expertise comptable',
    summary: 'Numérisation et classement de documents.',
    details: ['Numérisation et classement de documents.', 'Respect strict de la confidentialité des données clients.'],
    skills: ['Rigueur', 'Confidentialité'],
  },
  {
    id: 'epimusic',
    short: 'EPIMUSIC',
    group: 'commitment',
    icon: 'bass',
    period: '2025 – aujourd’hui',
    title: 'Président de groupe — EPImusic',
    place: 'Club musical de l’EPITA (BDE)',
    summary: 'Président et bassiste d’un groupe du club musical de l’école.',
    details: [
      'Président d’un groupe étudiant du club EPImusic, rattaché au BDE de l’EPITA.',
      'Bassiste : le groupe manquait de bassiste, et mon niveau de guitariste m’a permis de m’adapter à ses besoins.',
      'Pratique toujours très régulière de la guitare, classique et électrique.',
    ],
    skills: ['Leadership', 'Adaptabilité', 'Travail en équipe'],
  },
  {
    id: 'bdl',
    short: 'BDL',
    group: 'commitment',
    icon: 'flag',
    period: '2024 – 2025',
    title: 'Co-président du bureau des lycéens',
    place: 'Lycée',
    summary: 'Travail et management d’équipe.',
    details: ['Organisation de projets collectifs.', 'Coordination et management d’une équipe d’élèves.'],
    skills: ['Leadership', 'Organisation', 'Travail en équipe'],
  },
  {
    id: 'tutorat',
    short: 'TUTORAT',
    group: 'commitment',
    icon: 'code',
    period: '2024 – 2025',
    title: 'Responsable du tutorat en informatique',
    place: 'Lycée',
    summary: 'Animation de séances de tutorat en Python.',
    details: ['Animation de séances de tutorat en informatique et en Python.', 'Préparation et présentation de cours à d’autres élèves.'],
    skills: ['Pédagogie', 'Prise de parole', 'Python'],
  },
  {
    id: 'club3d',
    group: 'commitment',
    icon: 'chip',
    period: 'Collège (4e – 3e)',
    title: 'Club création',
    place: 'Collège Saint Jean',
    summary: 'Modélisation et impression 3D en équipe.',
    details: ['Modélisation et impression 3D.', 'Projets réalisés en équipe.'],
    skills: ['Créativité', 'Travail en équipe'],
  },
  {
    id: 'concerts',
    short: 'CONCERTS',
    group: 'stage',
    icon: 'guitar',
    period: 'Années de conservatoire',
    title: 'Concerts et représentations',
    place: 'Bagnols-sur-Cèze',
    summary: 'Trio au musée de Bagnols-sur-Cèze, solos aux concerts de Noël et à la fête de la musique.',
    details: [
      'Concert exclusif en trio à l’intérieur du musée de Bagnols-sur-Cèze, lors de la journée nationale des musées.',
      'Nombreux passages en solo : concerts de Noël, fête de la musique.',
      'Auditions et concours au conservatoire.',
    ],
    skills: ['Confiance en soi', 'Engagement'],
  },
  {
    id: 'orchestre',
    short: 'ORCHESTRE',
    group: 'stage',
    icon: 'note',
    period: '4 ans',
    title: 'Orchestre du conservatoire',
    place: 'Conservatoire de Bagnols-sur-Cèze',
    summary: 'Quatre ans de jeu en orchestre et plusieurs représentations collectives.',
    details: [
      'Quatre années au sein de l’orchestre du conservatoire.',
      'Plusieurs représentations en formation collective.',
      'Apprendre à jouer ensemble : écouter les autres pupitres et suivre le chef.',
    ],
    skills: ['Travail en équipe', 'Écoute'],
  },
  {
    id: 'eloquence',
    short: 'ÉLOQUENCE',
    group: 'stage',
    icon: 'mic',
    period: '2023 – 2024',
    title: 'Concours d’éloquence',
    place: 'Dont Lions Club',
    summary: '5e sur 18 participants au concours du Lions Club.',
    details: ['Participation à plusieurs concours d’éloquence.', 'Lions Club : 5e sur 18 participants.'],
    skills: ['Prise de parole', 'Argumentation'],
  },
]

/* WEAPONS — technical skills and instruments, linked to their proofs */
export const hardSkills: Skill[] = [
  { name: 'Python', group: 'code', icon: 'code', detail: 'Jeu (pygame), traitement d’image, enseignement en tutorat.', proofs: ['myst', 'tutorat'] },
  { name: 'C', group: 'code', icon: 'code', detail: 'Pointeurs, mémoire, listes chaînées, processus et pipes.', proofs: ['minimake'] },
  { name: 'OCaml', group: 'code', icon: 'lambda', detail: 'Programmation fonctionnelle (cursus EPITA).', proofs: ['epita-1'] },
  { name: 'Algorithmique', group: 'code', icon: 'graph', detail: 'Génération procédurale, arbres, piles/files, parsing.', proofs: ['myst', 'minimake'] },
  { name: 'Git', group: 'tool', icon: 'branch', detail: 'Branches, fusions, forge EPITA et GitHub.', proofs: ['myst', 'minimake'] },
  { name: 'Linux', group: 'tool', icon: 'terminal', detail: 'Poste quotidien sous Arch Linux, shell, compilation.', proofs: ['minimake', 'portfolio'] },
  { name: 'Web', group: 'tool', icon: 'web', detail: 'React, TypeScript, Tailwind CSS.', proofs: ['portfolio'] },
  {
    name: 'Guitare',
    group: 'instrument',
    icon: 'guitar',
    meta: '11 ans',
    detail: 'Guitare classique au conservatoire pendant 11 ans, électrique depuis peu. Pratique toujours très régulière.',
    facts: [
      { k: 'Pratique', v: '11 ans de conservatoire' },
      { k: 'Diplômes', v: 'Cycles 1 et 2 — mention Très bien' },
      { k: 'Styles', v: 'Classique, électrique' },
      { k: 'Statut', v: 'En activité' },
    ],
    proofs: ['conservatoire', 'concerts', 'epimusic'],
  },
  {
    name: 'Basse',
    group: 'instrument',
    icon: 'bass',
    meta: 'Groupe',
    detail: 'Bassiste de mon groupe EPImusic : j’ai pris le poste qui manquait, en m’appuyant sur mon niveau de guitariste.',
    facts: [
      { k: 'Contexte', v: 'Groupe du club EPImusic' },
      { k: 'Statut', v: 'En activité' },
    ],
    proofs: ['epimusic'],
  },
  {
    name: 'Batterie',
    group: 'instrument',
    icon: 'drums',
    meta: '4 ans',
    detail: 'Quatre ans de batterie au conservatoire, premier cycle validé avec les félicitations.',
    facts: [
      { k: 'Pratique', v: '4 ans de conservatoire' },
      { k: 'Diplôme', v: 'Cycle 1 — Très bien, félicitations' },
      { k: 'Statut', v: 'Arrêtée' },
    ],
    proofs: ['conservatoire'],
  },
  {
    name: 'Formation musicale',
    group: 'instrument',
    icon: 'note',
    meta: '11 ans',
    detail: 'Onze ans de formation musicale (solfège) au conservatoire : une théorie solide, utile pour jouer, déchiffrer et composer.',
    facts: [
      { k: 'Pratique', v: '11 ans de conservatoire' },
      { k: 'Diplômes', v: 'Cycles 1 et 2 — mention Bien' },
    ],
    proofs: ['conservatoire', 'orchestre'],
  },
  {
    name: 'Composition',
    group: 'instrument',
    icon: 'wave',
    meta: 'MAO',
    detail: 'Composition sur FL Studio : la pratique s’acquiert, sur une base théorique solide héritée du conservatoire.',
    facts: [
      { k: 'Outil', v: 'FL Studio' },
      { k: 'Statut', v: 'En apprentissage' },
    ],
    proofs: ['conservatoire'],
  },
]

/* SKILLS — soft skills linked to their proofs */
export const softSkills: Skill[] = [
  { name: 'Travail en équipe', icon: 'chip', detail: 'Projets de groupe, BDL, orchestre, groupe EPImusic.', proofs: ['myst', 'bdl', 'orchestre', 'epimusic'] },
  { name: 'Rigueur', icon: 'chip', detail: '14 ans de conservatoire, tests automatiques, confidentialité des documents.', proofs: ['conservatoire', 'minimake', 'cabinet'] },
  { name: 'Persévérance', icon: 'chip', detail: 'Volonté et engagement : années de conservatoire, débogage jusqu’au bout.', proofs: ['conservatoire', 'minimake'] },
  { name: 'Confiance en soi', icon: 'chip', detail: 'Jouer seul devant un public, défendre une idée en concours.', proofs: ['concerts', 'eloquence'] },
  { name: 'Prise de parole', icon: 'chip', detail: 'Concours d’éloquence, présentation de cours.', proofs: ['eloquence', 'tutorat'] },
  { name: 'Leadership', icon: 'chip', detail: 'Co-présidence du BDL, présidence d’un groupe EPImusic.', proofs: ['bdl', 'epimusic'] },
  { name: 'Adaptabilité', icon: 'chip', detail: 'Passer de la guitare à la basse pour les besoins du groupe.', proofs: ['epimusic'] },
  { name: 'Pédagogie', icon: 'chip', detail: 'Transmettre la programmation à des débutants.', proofs: ['tutorat'] },
]

/* SKILLS — self-assessment */
export const selfAssessment = {
  strengths: [
    'Aisance à l’oral et goût de la transmission (tutorat, éloquence, scène).',
    'Rigueur et constance acquises en 14 ans de conservatoire.',
    'Autonomie sur des projets techniques de bout en bout.',
    'Habitude du travail collectif et des responsabilités (BDL, orchestre, EPImusic).',
  ],
  improvements: [
    'Documenter davantage mon code et écrire des messages de commit explicites.',
    'Planifier l’architecture avant de coder, surtout en équipe.',
    'Écrire mes propres tests plutôt que de dépendre de ceux fournis.',
    'Acquérir une première expérience en entreprise dans le développement.',
  ],
}

export const outlook = {
  interests: ['Intelligence artificielle', 'Développement logiciel', 'Systèmes et bas niveau', 'Développement de jeux'],
  next: 'Trouver un stage de développement logiciel orienté intelligence artificielle, puis poursuivre en cycle ingénieur à l’EPITA.',
}

/* COMMS */
export const contact = {
  email: 'louis.leymonie@outlook.fr',
  github: 'https://github.com/CoolLyfe',
  location: 'Toulouse, France',
}

/** Look up any proof id (project or log entry) → the tab that shows it. */
export function findProof(id: string): { tab: TabId; label: string; summary: string } | null {
  const p = projects.find((x) => x.id === id)
  if (p) return { tab: 'intel', label: p.code, summary: p.summary }
  const e = education.find((x) => x.id === id)
  if (e) return { tab: 'map', label: e.short ?? e.place.toUpperCase(), summary: e.title }
  const x = experience.find((y) => y.id === id)
  if (x) return { tab: 'quests', label: x.short ?? x.title.toUpperCase(), summary: x.summary }
  return null
}
