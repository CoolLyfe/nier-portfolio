/* ==================================================================
   profile.ts — the ONLY file to edit to update the site's content.
   Sources: CV, cover letter, and the project repositories in ~/Epita.
   Personal data deliberately left out of the public site: phone
   number, postal address, photo.
   ================================================================== */

export type SectionId = 'system' | 'intel' | 'logs' | 'comms'

export interface Project {
  id: string
  code: string // menu label, e.g. "MYST"
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
  period: string
  title: string
  place: string
  summary: string
  details: string[]
  skills: string[]
}

export interface Skill {
  name: string
  detail: string
  proofs: string[] // Project or experience ids demonstrating it
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
    'Mon parcours ne se limite pas au cadre académique : la co-présidence du bureau des lycéens et mon expérience dans un groupe musical m’ont appris à collaborer avec des profils variés, à organiser des projets collectifs et à prendre des responsabilités.',
  objectives: [
    'Présenter mon parcours académique et les acquis de mes premières années.',
    'Relier chaque compétence à une réalisation ou une expérience concrète.',
    'Évaluer honnêtement mes points forts et mes axes de progression.',
    'Disposer d’un outil évolutif, enrichi à chaque semestre.',
  ],
  conclusion:
    'En un peu plus d’un an, je suis passé de l’écriture de programmes isolés en Python à la conception de systèmes complets en C, testés et construits en équipe. Ce portfolio est un point d’étape : il sera enrichi au fil de mes projets et de mon premier stage en entreprise.',
}

export const languages = [
  { name: 'Français', level: 'Natif', value: 5 },
  { name: 'Anglais', level: 'B2', value: 4 },
  { name: 'Allemand', level: 'A2', value: 2 },
]

export const interests = [
  { name: 'Guitare', detail: 'Conservatoire : concerts, auditions et concours.' },
  { name: 'Composition musicale', detail: 'Écriture de morceaux, expérience en groupe.' },
  { name: 'Aïkido', detail: '6 ans de pratique.' },
  { name: 'Hand-ball', detail: '4 ans de pratique.' },
  { name: 'Pâtisserie', detail: 'Précision, dosage et patience.' },
  { name: 'Jeux vidéo', detail: 'Et c’est un peu la raison d’être de cette interface.' },
]

/* INTEL — significant projects */
export const projects: Project[] = [
  {
    id: 'myst',
    code: 'MYST',
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
    id: 'prog-c',
    code: 'PROG_C',
    title: 'Programmation C — séries de TP',
    summary: 'Processus, structures de données, parsing.',
    period: 'S2 – S3 (2026)',
    context: 'Séries de TP EPITA, rendues sur la forge Git de l’école.',
    objective: 'Maîtriser la programmation système et les structures de données fondamentales en C.',
    stack: ['C', 'POSIX', 'Makefile', 'Git'],
    architecture: [
      { name: 'Animal Processing (S2)', role: 'Processus : fork, exec, wait, pipes, redirections (dup).' },
      { name: 'The Nook Games (S2)', role: 'Arbres, parsing d’expressions, évaluation en notation polonaise inverse (piles, files).' },
      { name: 'Porco’s New Mission (S3)', role: 'Structures et fichiers : carnet d’adresses, registre, planification de vols, tournoi.' },
    ],
    metrics: [
      { k: 'Séries', v: '3' },
      { k: 'Fichiers C', v: '37' },
      { k: 'En-têtes', v: '22' },
    ],
    role: ['Implémentation individuelle de chaque exercice.'],
    challenges: [
      'Pipes doubles : fermer les bons descripteurs dans chaque processus pour éviter les blocages.',
      'Évaluation d’expressions : conversion vers la notation polonaise inverse avant le calcul.',
    ],
    retrospective:
      'Ces TP m’ont montré l’intérêt de découper un problème en petites fonctions testables avant d’écrire le programme principal.',
    hardSkills: ['Programmation système', 'Structures de données', 'C'],
    softSkills: ['Gestion du temps', 'Rigueur'],
  },
  {
    id: 'portfolio',
    code: 'PORTFOLIO',
    title: 'Ce portfolio — système YoRHa',
    summary: 'Reproduction du menu système de NieR: Automata.',
    period: 'Sept. 2026',
    context: 'Projet personnel, réalisé pour le cours « Portfolio professionnel » du S3.',
    objective:
      'Présenter mon parcours sous la forme d’un menu de jeu navigable au clavier, tout en restant lisible sur mobile.',
    stack: ['React 19', 'TypeScript', 'Tailwind CSS 4', 'Framer Motion', 'Vite'],
    architecture: [
      { name: 'data/profile.ts', role: 'Tout le contenu, séparé de l’interface.' },
      { name: 'Window', role: 'Fenêtres à coins biseautés (clip-path).' },
      { name: 'Expanded', role: 'Zoom d’une carte vers sa vue détaillée (Framer Motion).' },
      { name: 'HackingMode', role: 'Terminal caché : fichiers chiffrés, export du CV.' },
    ],
    metrics: [
      { k: 'Sections', v: '4' },
      { k: 'Dépendances', v: '3' },
    ],
    role: [
      'Direction artistique et structure des contenus.',
      'Développé avec l’aide d’un assistant IA (Claude Code) : relecture, choix et adaptation du code.',
    ],
    challenges: [
      'Bordures d’1 px qui suivent les coins biseautés : une bordure CSS classique est coupée par clip-path, d’où un double calque.',
      'Garder une interface de jeu dense tout en restant lisible sur un écran de 400 px.',
    ],
    retrospective:
      'Séparer le contenu de l’interface a permis de refondre entièrement le design sans réécrire une ligne de texte.',
    hardSkills: ['Développement web', 'TypeScript'],
    softSkills: ['Créativité', 'Esprit critique'],
    links: [{ label: 'Code source', href: 'https://github.com/CoolLyfe/nier-portfolio' }],
  },
]

/* LOGS — academic path */
export const education: LogEntry[] = [
  {
    id: 'epita-2',
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
    period: '2022 – 2025',
    title: 'Baccalauréat général — mention Bien',
    place: 'Lycée Bellevue Marie-Rivier',
    summary: 'Tuteur en informatique et co-président du BDL.',
    details: ['Baccalauréat général obtenu avec mention Bien.'],
    skills: [],
  },
  {
    id: 'college',
    period: '2017 – 2022',
    title: 'Diplôme national du brevet — mention Très bien',
    place: 'Collège Saint Jean',
    summary: 'Club création : modélisation et impression 3D.',
    details: ['Brevet obtenu avec mention Très bien.'],
    skills: [],
  },
]

/* LOGS — experience, responsibilities, activities */
export const experience: LogEntry[] = [
  {
    id: 'lavage',
    period: 'Été 2025',
    title: 'Employé polyvalent',
    place: 'Station de lavage automobile',
    summary: 'Travail saisonnier : accueil client et entretien de véhicules.',
    details: ['Travail saisonnier sur plusieurs périodes.', 'Accueil et conseil des clients, entretien des véhicules.'],
    skills: ['Relation client', 'Fiabilité'],
  },
  {
    id: 'tutorat',
    period: '2024 – 2025',
    title: 'Responsable du tutorat en informatique',
    place: 'Lycée',
    summary: 'Animation de séances de tutorat en Python.',
    details: ['Animation de séances de tutorat en informatique et en Python.', 'Préparation et présentation de cours à d’autres élèves.'],
    skills: ['Pédagogie', 'Prise de parole', 'Python'],
  },
  {
    id: 'bdl',
    period: '2024 – 2025',
    title: 'Co-président du bureau des lycéens',
    place: 'Lycée',
    summary: 'Travail et management d’équipe.',
    details: ['Organisation de projets collectifs.', 'Coordination et management d’une équipe d’élèves.'],
    skills: ['Leadership', 'Organisation', 'Travail en équipe'],
  },
  {
    id: 'cabinet',
    period: 'Nov. 2024',
    title: 'Assistant administratif',
    place: 'Cabinet d’expertise comptable',
    summary: 'Numérisation et classement de documents.',
    details: ['Numérisation et classement de documents.', 'Respect strict de la confidentialité des données clients.'],
    skills: ['Rigueur', 'Confidentialité'],
  },
  {
    id: 'eloquence',
    period: '2023 – 2024',
    title: 'Concours d’éloquence',
    place: 'Dont Lions Club',
    summary: '5e sur 18 participants au concours du Lions Club.',
    details: ['Participation à plusieurs concours d’éloquence.', 'Lions Club : 5e sur 18 participants.'],
    skills: ['Prise de parole', 'Argumentation'],
  },
  {
    id: 'musique',
    period: 'Depuis l’enfance',
    title: 'Pratique musicale — guitare',
    place: 'Conservatoire',
    summary: 'Concerts, auditions et concours ; groupe musical.',
    details: ['Formation de guitare au conservatoire.', 'Concerts, auditions et concours.', 'Expérience au sein d’un groupe musical.'],
    skills: ['Persévérance', 'Travail en équipe'],
  },
  {
    id: 'club3d',
    period: 'Collège (4e – 3e)',
    title: 'Club création',
    place: 'Collège Saint Jean',
    summary: 'Modélisation et impression 3D en équipe.',
    details: ['Modélisation et impression 3D.', 'Projets réalisés en équipe.'],
    skills: ['Créativité', 'Travail en équipe'],
  },
]

/* LOGS — skills linked to their proofs */
export const hardSkills: Skill[] = [
  { name: 'Python', detail: 'Jeu (pygame), traitement d’image, enseignement en tutorat.', proofs: ['myst', 'tutorat'] },
  { name: 'C', detail: 'Pointeurs, mémoire, listes chaînées, processus et pipes.', proofs: ['minimake', 'prog-c'] },
  { name: 'OCaml', detail: 'Programmation fonctionnelle (cursus EPITA).', proofs: ['epita-1'] },
  { name: 'Algorithmique', detail: 'Génération procédurale, arbres, piles/files, parsing.', proofs: ['myst', 'prog-c', 'minimake'] },
  { name: 'Git', detail: 'Branches, fusions, forge EPITA et GitHub.', proofs: ['myst', 'minimake'] },
  { name: 'Linux', detail: 'Poste quotidien sous Arch Linux, shell, compilation.', proofs: ['prog-c'] },
  { name: 'Web', detail: 'React, TypeScript, Tailwind CSS.', proofs: ['portfolio'] },
]

export const softSkills: Skill[] = [
  { name: 'Travail en équipe', detail: 'Projets de groupe, BDL, groupe musical.', proofs: ['myst', 'bdl', 'musique'] },
  { name: 'Prise de parole', detail: 'Concours d’éloquence, présentation de cours.', proofs: ['eloquence', 'tutorat'] },
  { name: 'Pédagogie', detail: 'Transmettre la programmation à des débutants.', proofs: ['tutorat'] },
  { name: 'Leadership', detail: 'Co-présidence et coordination d’une équipe.', proofs: ['bdl'] },
  { name: 'Rigueur', detail: 'Tests automatiques, confidentialité des documents.', proofs: ['minimake', 'cabinet'] },
  { name: 'Persévérance', detail: 'Années de conservatoire, débogage jusqu’au bout.', proofs: ['musique', 'minimake'] },
]

/* LOGS — self-assessment */
export const selfAssessment = {
  strengths: [
    'Aisance à l’oral et goût de la transmission (tutorat, éloquence).',
    'Autonomie sur des projets techniques de bout en bout.',
    'Habitude du travail collectif et des responsabilités (BDL, groupe musical).',
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

/** Look up any proof id (project or log entry) for cross-links. */
export function findProof(id: string): { kind: 'project' | 'log'; label: string } | null {
  const p = projects.find((x) => x.id === id)
  if (p) return { kind: 'project', label: p.code }
  const l = [...education, ...experience].find((x) => x.id === id)
  if (l) return { kind: 'log', label: l.title.split(' — ')[0].toUpperCase() }
  return null
}
