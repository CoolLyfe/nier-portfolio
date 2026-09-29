/* ==================================================================
   profile.ts — the ONLY file you need to edit to update the site.

   Convention: any string starting with "TODO:" is rendered on the
   site as a red "[ DONNÉE MANQUANTE ]" flag, so nothing unverified
   slips through silently. Replace them with your real info.
   ================================================================== */

export type SectionId = 'system' | 'intel' | 'logs' | 'comms'

export interface Project {
  id: string
  code: string // short menu label, e.g. "MYST"
  title: string
  period: string
  context: string
  objective: string
  stack: string[]
  role: string[]
  results: string[]
  hardSkills: string[]
  softSkills: string[]
  retrospective: string // what went wrong / what I'd do differently
  links?: { label: string; href: string }[]
  image?: { src: string; caption: string }
}

export interface TimelineEntry {
  period: string
  title: string
  place: string
  details: string[]
}

export interface Skill {
  name: string
  detail: string
  proofs: string[] // Project ids that demonstrate this skill
}

/* ---------------------------------------------------------------- */

export const identity = {
  name: 'Louis Leymonie',
  handle: 'CoolLyfe',
  unit: 'EPITA // PROMO 2030',
  role: 'Étudiant en cycle préparatoire informatique',
  status: '2e année — semestre 3 (2026–2027)',
  location: 'TODO: ville / campus',
}

/* SYSTEM — introduction, goals of the portfolio, motivations */
export const about = {
  intro: [
    "Je m'appelle Louis Leymonie, étudiant en deuxième année du cycle préparatoire informatique de l'EPITA (promotion 2030).",
    "J'aime comprendre comment les choses fonctionnent « sous le capot » : de la gestion de la mémoire en C jusqu'à la configuration complète de mon propre poste sous Arch Linux.",
  ],
  motivations: 'TODO: pourquoi l’informatique ? pourquoi l’EPITA ? (2–3 phrases personnelles)',
  objectives: [
    'Présenter mon parcours académique et les acquis de mes deux premières années.',
    'Relier chaque compétence à une réalisation concrète, preuves à l’appui.',
    'Évaluer honnêtement mes points forts et mes axes de progression.',
    'Disposer d’un outil évolutif, mis à jour au fil de mon parcours.',
  ],
  readingGuide:
    'INTEL présente mes projets, LOGS mon parcours et mes compétences, COMMS les moyens de me contacter. Chaque compétence renvoie au projet qui la démontre.',
  conclusion:
    'Ces deux années m’ont fait passer de l’écriture de programmes isolés à la conception de systèmes complets, testés et construits en équipe. Ce portfolio est un point d’étape : il sera enrichi à chaque semestre, notamment avec mon premier stage.',
}

/* INTEL — 2 to 4 significant projects (grading grid) */
export const projects: Project[] = [
  {
    id: 'myst',
    code: 'MYST',
    title: 'Myst — jeu 2D à génération procédurale',
    period: 'Janv. – mars 2026',
    context: 'Projet de groupe à trois (« Four Man Army Studio »), mené en parallèle du S2.',
    objective:
      'Créer un jeu d’exploration de donjon dont la carte change à chaque partie, avec un menu, des salles typées (départ, combat, butin, boss) et un joueur qui se déplace entre elles.',
    stack: ['Python', 'pygame', 'Pillow', 'Git / GitHub'],
    role: [
      'Conception et écriture de l’algorithme de génération procédurale de la carte.',
      'Gestion des collisions et du déplacement du joueur.',
      'Intégration du menu (réalisé par un coéquipier) avec la boucle de jeu.',
      'Mise en place du dépôt, du .gitignore et gestion des fusions de branches — 14 des 22 commits du projet.',
    ],
    results: [
      'Prototype jouable : une carte différente est générée à chaque lancement.',
      'Algorithme de « marche aléatoire » sur une grille 8×5 : 15 à 20 salles reliées, 3 sorties maximum par salle, salle du boss toujours placée en dernier pour garantir un chemin depuis le départ.',
      'La carte est rendue en une seule image (Pillow) puis affichée avec une caméra qui suit le joueur.',
    ],
    hardSkills: ['Algorithmique (graphes, aléatoire contrôlé)', 'Python', 'Git en équipe'],
    softSkills: ['Travail en équipe', 'Répartition des tâches', 'Autonomie'],
    retrospective:
      'Nous avons commencé à coder avant de fixer l’architecture : l’intégration menu ↔ jeu a demandé des corrections tardives. La prochaine fois je définirais les interfaces entre modules dès le départ, et j’écrirais des messages de commit plus explicites.',
    links: [{ label: 'Site du jeu', href: 'https://myst-official.base44.app' }],
    image: {
      src: 'evidence/myst-map.webp',
      caption:
        'Carte générée par l’algorithme : salle de départ en vert, salle du boss en rouge, couloirs en jaune.',
    },
  },
  {
    id: 'minimake',
    code: 'MINIMAKE',
    title: 'minimake — réimplémentation de make en C',
    period: 'Avr. – mai 2026',
    context: 'Projet individuel EPITA (S2), évalué par une moulinette de tests automatiques.',
    objective:
      'Reproduire le cœur de l’outil GNU make : lire un Makefile, résoudre les dépendances entre cibles et exécuter les commandes nécessaires, dans le bon ordre.',
    stack: ['C', 'libc / POSIX', 'Makefile', 'Suite de tests Python + YAML'],
    role: [
      'Parseur de Makefile : variables, règles, dépendances et commandes.',
      'Substitution récursive des variables ${VAR} dans les commandes.',
      'Résolution récursive des dépendances et exécution des commandes, avec arrêt et code d’erreur identique à make en cas d’échec.',
      'Options en ligne de commande : -h (aide), -p (affichage des règles et variables), -f (fichier alternatif).',
    ],
    results: [
      '≈ 380 lignes de C, structures en listes chaînées (variables, règles, mots).',
      'Messages d’erreur fidèles à GNU make (« No rule to make target… », « Error N »).',
      'Testé avec une suite de tests Python / YAML couvrant les modes exécution et affichage (-p).',
    ],
    hardSkills: ['C (pointeurs, allocation, listes chaînées)', 'Parsing', 'Processus / appels système', 'Tests'],
    softSkills: ['Rigueur', 'Autonomie', 'Persévérance'],
    retrospective:
      'J’ai utilisé des variables globales pour aller vite ; le code serait plus facile à tester en les regroupant dans une structure passée aux fonctions. La gestion mémoire mériterait aussi un passage sous Valgrind.',
  },
  {
    id: 'prog-c',
    code: 'PROG C',
    title: 'Travaux pratiques de programmation C',
    period: 'S2 – S3 (2026)',
    context: 'Séries de TP EPITA : « The Nook Games » (S2), « Animal Processing », « Porco’s New Mission » (S3).',
    objective: 'Maîtriser les structures de données fondamentales et la programmation système en C.',
    stack: ['C', 'Makefile', 'Git (forge EPITA)'],
    role: [
      'Arbres binaires et arbres « vecteur », parcours et expansion.',
      'Analyse d’expressions arithmétiques et évaluation en notation polonaise inverse (piles et files).',
      'Manipulation de structures et de fichiers : carnet d’adresses, registre, planification de vols, tournoi.',
    ],
    results: [
      'Implémentation « from scratch » de pile, file, arbres et parseurs.',
      'Rendus versionnés sur la forge Git de l’école.',
    ],
    hardSkills: ['Structures de données', 'C', 'Algorithmique'],
    softSkills: ['Gestion du temps', 'Rigueur'],
    retrospective:
      'Ces TP m’ont montré l’importance de découper un problème en petites fonctions testables avant d’écrire le programme principal.',
  },
  {
    id: 'portfolio',
    code: 'PORTFOLIO',
    title: 'Ce portfolio — interface inspirée de NieR: Automata',
    period: 'Sept. 2026',
    context: 'Projet personnel, réalisé pour le cours « Portfolio professionnel » du S3.',
    objective:
      'Présenter mon parcours sous forme d’une interface de terminal navigable au clavier, tout en restant lisible et accessible sur mobile.',
    stack: ['React 19', 'TypeScript', 'Tailwind CSS 4', 'Vite', 'GitHub Pages'],
    role: [
      'Direction artistique et structure des contenus.',
      'Développé avec l’aide d’un assistant IA (Claude Code) : relecture, choix et adaptation du code.',
    ],
    results: [
      'Navigation clavier complète (1–4, flèches, Échap), effets CRT désactivables.',
      'Tout le contenu est centralisé dans un seul fichier de données, facile à faire évoluer.',
    ],
    hardSkills: ['Développement web', 'TypeScript', 'Accessibilité'],
    softSkills: ['Créativité', 'Esprit critique'],
    retrospective: 'TODO: ton recul personnel sur ce projet une fois terminé.',
    links: [{ label: 'Code source', href: 'https://github.com/CoolLyfe/nier-portfolio' }],
  },
]

/* LOGS — academic path */
export const education: TimelineEntry[] = [
  {
    period: '2026 – 2027',
    title: 'Cycle préparatoire informatique — 2e année (S3)',
    place: 'EPITA',
    details: [
      'Programmation C avancée, théorie des langages, mathématiques, anglais.',
      'Cours « Portfolio professionnel » et recherche documentaire.',
    ],
  },
  {
    period: '2025 – 2026',
    title: 'Cycle préparatoire informatique — 1re année (S1–S2)',
    place: 'EPITA',
    details: [
      'Programmation (C, Python), algorithmique et structures de données.',
      'Architecture des ordinateurs, algèbre linéaire (espaces vectoriels, applications linéaires, matrices), électromagnétisme.',
      'Initiation à l’intelligence artificielle (TP NTS).',
    ],
  },
  {
    period: 'TODO: année',
    title: 'TODO: baccalauréat (spécialités, mention)',
    place: 'TODO: lycée',
    details: [],
  },
]

/* LOGS — professional experience / internships / associations */
export const experience: TimelineEntry[] = [
  {
    period: 'TODO: dates',
    title: 'TODO: stage de 1re année (entreprise, poste)',
    place: 'TODO: lieu',
    details: ['TODO: missions, responsabilités et ce que tu as appris'],
  },
]

/* LOGS — skills, each linked to its proof */
export const hardSkills: Skill[] = [
  { name: 'C', detail: 'Pointeurs, mémoire, listes chaînées, appels système.', proofs: ['minimake', 'prog-c'] },
  { name: 'Python', detail: 'Programmation de jeu (pygame), traitement d’image (Pillow).', proofs: ['myst'] },
  { name: 'Algorithmique', detail: 'Génération procédurale, arbres, piles/files, parsing.', proofs: ['myst', 'prog-c', 'minimake'] },
  { name: 'Git', detail: 'Branches, fusions, forge EPITA et GitHub.', proofs: ['myst', 'minimake'] },
  { name: 'Linux', detail: 'Poste quotidien sous Arch Linux + Hyprland, shell, compilation.', proofs: ['minimake'] },
  { name: 'Web', detail: 'React, TypeScript, Tailwind CSS.', proofs: ['portfolio'] },
  { name: 'Mathématiques', detail: 'Algèbre linéaire, logique, théorie des langages.', proofs: [] },
]

export const methodSkills: string[] = [
  'Gestion de version et travail sur branches',
  'Tests automatisés (moulinettes, suites de tests)',
  'Découpage d’un problème en modules',
]

export const softSkills: Skill[] = [
  { name: 'Travail en équipe', detail: 'Répartition des tâches et intégration du travail de chacun sur Myst.', proofs: ['myst'] },
  { name: 'Autonomie', detail: 'Projets menés seul de la spécification aux tests.', proofs: ['minimake', 'portfolio'] },
  { name: 'Persévérance', detail: 'Débogage jusqu’à la validation complète des tests.', proofs: ['minimake'] },
  { name: 'Curiosité', detail: 'Configuration poussée de mon environnement Linux, veille technique.', proofs: [] },
]

/* LOGS — self-assessment (grading grid: 3 pts) */
export const selfAssessment = {
  strengths: [
    'Capacité à comprendre un système en profondeur avant de le modifier.',
    'Autonomie sur des projets techniques de bout en bout.',
    'Aisance avec les outils de développeur (terminal, Git, Linux).',
  ],
  improvements: [
    'Documenter davantage mon code et écrire des messages de commit explicites.',
    'Planifier l’architecture avant de coder, surtout en équipe.',
    'Écrire mes propres tests plutôt que de dépendre de ceux fournis.',
  ],
}

/* LOGS — outlook */
export const outlook = {
  interests: ['Systèmes et bas niveau', 'Linux', 'Développement de jeux', 'TODO: domaine visé (cybersécurité, IA, web… ?)'],
  next: 'TODO: majeure / cycle ingénieur visé, type de stage recherché.',
}

/* COMMS */
export const contact = {
  email: 'louis.leymonie@epita.fr',
  github: 'https://github.com/CoolLyfe',
  linkedin: 'TODO: URL LinkedIn',
}
