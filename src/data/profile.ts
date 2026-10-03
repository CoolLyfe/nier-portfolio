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
  architecture: { name: string; role: string }[]
  metrics: { k: string; v: string }[]
  role: string[]
  challenges: string[]
  retrospective: string
  hardSkills: string[]
  softSkills: string[]
  links?: { label: string; href: string }[]
  image?: { src: string; caption: string }
  pod?: string
}

export interface LogEntry {
  id: string
  /** PATH: school — MUSIC: music | stage — COMMITMENTS: lead | job | speech */
  group: 'school' | 'music' | 'stage' | 'lead' | 'job' | 'speech'
  icon: Glyph
  /** short label when cited as a proof */
  short?: string
  period: string
  title: string
  place: string
  summary: string
  details: string[]
  skills: string[]
  pod?: string
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
    role: t('Étudiant à l’EPITA, en recherche de stage', 'EPITA student, looking for an internship'),
    status: t('Classe préparatoire intégrée — 2e année (S3)', 'Integrated preparatory class — 2nd year (S3)'),
    location: 'Toulouse, France',
    target: t('Stage — développement logiciel / intelligence artificielle', 'Internship — software development / artificial intelligence'),
    tagline: t(
      'Je code, je joue de la musique depuis quatorze ans, je fais de l’aïkido et de la pâtisserie. Ce menu rassemble tout ça.',
      'I write code, I have been playing music for fourteen years, I practise aikido and I bake. This menu gathers all of it.',
    ),
    facets: [t('Code', 'Code'), t('Musique', 'Music'), t('Scène', 'Stage'), t('Sport', 'Sport'), t('Engagement', 'Commitment')],
  }

  const about = {
    profile: t(
      'Étudiant en informatique à l’EPITA, je recherche un stage me permettant de mettre en pratique mes compétences en programmation. Sérieux et impliqué, j’ai acquis une bonne aisance à l’oral lors de tutorats et de présentations. J’apprécie le travail en équipe et l’apprentissage par l’expérience.',
      'A computer science student at EPITA, I am looking for an internship where I can put my programming skills into practice. Serious and committed, I became comfortable speaking in public through tutoring and presentations. I enjoy teamwork and learning by doing.',
    ),
    motivation: t(
      'Je souhaite orienter mon parcours vers le développement logiciel en intelligence artificielle. J’aime concevoir des outils concrets, capables d’apporter une réelle valeur ajoutée à leurs utilisateurs : analyser un besoin, construire l’outil, puis l’améliorer en continu.',
      'I want to steer my path towards software development in artificial intelligence. I like building concrete tools that bring real value to their users: understanding a need, building the tool, then improving it continuously.',
    ),
    beyond: t(
      'Mon parcours ne se limite pas au cadre académique. Quatorze ans de conservatoire et cinq diplômes de musique m’ont appris la rigueur, la volonté et la confiance en soi sur scène. Aujourd’hui président et bassiste d’un groupe du club EPImusic, et ancien co-président du bureau des lycéens, j’aime organiser des projets collectifs et prendre des responsabilités.',
      'My path goes beyond school. Fourteen years at the conservatoire and five music diplomas taught me rigour, determination and confidence on stage. Now president and bassist of a band in the EPImusic club, and former co-president of my high school’s student council, I enjoy organising group projects and taking on responsibilities.',
    ),
    objectives: [
      t('Présenter mon parcours, à l’école comme en dehors.', 'Present my path, at school and beyond.'),
      t('Relier chaque compétence à une réalisation ou une expérience concrète.', 'Link each skill to a concrete achievement or experience.'),
      t('Évaluer honnêtement mes points forts et mes axes de progression.', 'Honestly assess my strengths and the areas I need to improve.'),
      t('Disposer d’un outil évolutif, enrichi à chaque semestre.', 'Keep an evolving tool, updated every semester.'),
    ],
    conclusion: t(
      'En un peu plus d’un an, je suis passé de l’écriture de programmes isolés en Python à la conception de systèmes complets en C, testés et construits en équipe. Ce portfolio est un point d’étape : il sera enrichi au fil de mes projets et de mon premier stage en entreprise.',
      'In a little over a year, I went from writing standalone Python programs to designing complete C systems, tested and built as a team. This portfolio is a checkpoint: it will grow with my projects and my first internship.',
    ),
  }

  /* HOME — the "right now" box */
  const now: { k: string; v: string; icon: Glyph; to: TabId }[] = [
    { k: t('Études', 'Studies'), v: t('EPITA, 2e année — semestre 3', 'EPITA, 2nd year — semester 3'), icon: 'school', to: 'path' },
    { k: t('Projet', 'Project'), v: t('Ce portfolio, menu YoRHa', 'This portfolio, a YoRHa menu'), icon: 'folder', to: 'projects' },
    { k: t('Musique', 'Music'), v: t('Bassiste et président d’un groupe EPImusic', 'Bassist and president of an EPImusic band'), icon: 'bass', to: 'music' },
    { k: t('Recherche', 'Seeking'), v: t('Stage en développement logiciel / IA', 'Software / AI development internship'), icon: 'target', to: 'profile' },
  ]

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
      detail: t('Quatre ans de hand-ball en club : un sport d’équipe, rapide, où chacun a son poste.', 'Four years of club handball: a fast team sport where everyone has a position.'),
      facts: [
        { k: t('Pratique', 'Practice'), v: t('4 ans', '4 years') },
        { k: t('Retenu', 'Takeaway'), v: t('Esprit d’équipe', 'Team spirit') },
      ],
    },
    {
      id: 'aero',
      group: 'passion',
      icon: 'plane',
      name: t('Aéronautique', 'Aviation'),
      meta: 'BIA',
      detail: t('Passionné d’aviation, j’ai passé le brevet d’initiation aéronautique en classe de seconde.', 'An aviation enthusiast, I earned the French aeronautics initiation certificate (BIA) in 10th grade.'),
      facts: [{ k: t('Brevet', 'Certificate'), v: t('BIA, en seconde', 'BIA, in 10th grade') }],
      pod: t('Observation : l’unité regarde souvent le ciel.', 'Observation: this unit often looks at the sky.'),
    },
    {
      id: 'patisserie',
      group: 'passion',
      icon: 'cake',
      name: t('Pâtisserie', 'Baking'),
      meta: '×∞',
      detail: t(
        'Une recette, c’est un algorithme : des étapes précises, des quantités exactes, et on goûte avant de servir.',
        'A recipe is an algorithm: precise steps, exact quantities, and you taste before serving.',
      ),
      facts: [{ k: t('Qualités', 'Skills'), v: t('Précision, dosage, patience', 'Precision, measuring, patience') }],
      pod: t('Proposition : demander une démonstration. Dégustation recommandée.', 'Proposal: request a demonstration. Tasting recommended.'),
    },
    {
      id: 'jeux',
      group: 'passion',
      icon: 'gamepad',
      name: t('Jeux vidéo', 'Video games'),
      meta: '2B',
      detail: t('Les jeux vidéo, et NieR: Automata en particulier : c’est un peu la raison d’être de cette interface.', 'Video games, and NieR: Automata in particular: that’s more or less why this interface exists.'),
      pod: t('Requête : ne pas révéler la fin E.', 'Request: do not spoil ending E.'),
    },
  ]

  /* LIFE + HOME — photo frames (pictures to come, see README) */
  const gallery: Photo[] = [
    { id: 'portrait', icon: 'user', caption: t('Portrait', 'Portrait') },
    { id: 'stage', icon: 'guitar', caption: t('Sur scène', 'On stage'), pod: t('Archive visuelle : concert. Volume recommandé : élevé.', 'Visual archive: concert. Recommended volume: high.') },
    { id: 'dojo', icon: 'aikido', caption: t('Au dojo', 'At the dojo') },
    { id: 'kitchen', icon: 'cake', caption: t('En cuisine', 'In the kitchen') },
    { id: 'games', icon: 'gamepad', caption: t('Manette en main', 'Controller in hand') },
    { id: 'band', icon: 'bass', caption: t('Le groupe EPImusic', 'The EPImusic band') },
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
      id: 'dip-assr',
      group: 'school',
      icon: 'scroll',
      name: 'ASSR',
      issuer: t('Collège', 'Middle school'),
      detail: t('Attestation scolaire de sécurité routière.', 'School road-safety certificate.'),
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
      context: t('Projet de groupe (« Four Man Army Studio »), mené en parallèle du S2.', 'Group project (“Four Man Army Studio”), alongside semester 2.'),
      objective: t(
        'Créer un jeu d’exploration dont la carte change à chaque partie : salles typées (départ, combat, butin, boss), menu, et un joueur qui se déplace entre les salles.',
        'Build an exploration game whose map changes every run: typed rooms (start, combat, loot, boss), a menu, and a player moving between rooms.',
      ),
      stack: ['Python', 'pygame', 'Pillow', 'Git / GitHub'],
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
      ],
      challenges: [
        t('Changer de palette sur une seule fenêtre (hacking) : les couleurs passent par des variables CSS redéfinies localement.', 'Switching palette on a single window (hacking): colours go through CSS variables redefined locally.'),
        t('Traduire tout le site sans dupliquer la structure : chaque texte est écrit une fois, en deux langues côte à côte.', 'Translating the whole site without duplicating its structure: each text is written once, in two languages side by side.'),
        t('Garder une interface de jeu dense tout en restant lisible sur un écran de 400 px.', 'Keeping a dense game interface readable on a 400 px screen.'),
      ],
      retrospective: t(
        'Séparer le contenu de l’interface a permis de refondre plusieurs fois le design sans réécrire le texte. La première version ne parlait presque que d’informatique ; la page d’accueil montre maintenant tous les domaines dès l’arrivée.',
        'Keeping content apart from the interface let me redesign several times without rewriting the text. The first version was almost only about computing; the home page now shows every area from the start.',
      ),
      hardSkills: [t('Développement web', 'Web development'), 'TypeScript', 'SVG', 'Web Audio'],
      softSkills: [t('Créativité', 'Creativity'), t('Esprit critique', 'Critical thinking')],
      links: [{ label: t('Code source', 'Source code'), href: 'https://github.com/CoolLyfe/nier-portfolio' }],
      pod: t('Constat : vous êtes actuellement à l’intérieur de ce projet.', 'Note: you are currently inside this project.'),
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
        t('Cours « Portfolio professionnel » et recherche documentaire.', '“Professional portfolio” course and information research.'),
      ],
      skills: ['C', t('Théorie des langages', 'Language theory')],
    },
    {
      id: 'epita-1',
      short: 'EPITA S1–S2',
      group: 'school',
      icon: 'school',
      period: '2025 – 2026',
      title: t('Classe préparatoire intégrée — 1re année', 'Integrated preparatory class — 1st year'),
      place: 'EPITA Toulouse',
      summary: t('Programmation, algorithmique, mathématiques, architecture.', 'Programming, algorithms, mathematics, computer architecture.'),
      details: [
        t('Programmation en Python, C et OCaml ; algorithmique et structures de données.', 'Programming in Python, C and OCaml; algorithms and data structures.'),
        t('Architecture des ordinateurs, algèbre linéaire, électromagnétisme.', 'Computer architecture, linear algebra, electromagnetism.'),
        t('Initiation à l’intelligence artificielle (TP).', 'Introduction to artificial intelligence (lab work).'),
      ],
      skills: ['Python', 'C', 'OCaml', t('Algorithmique', 'Algorithms')],
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

  /* MUSIC (stage) and COMMITMENTS (lead, job, speech) */
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
    },
    {
      id: 'bdl',
      short: t('BDL', 'STUDENT COUNCIL'),
      group: 'lead',
      icon: 'flag',
      period: '2024 – 2025',
      title: t('Co-président du bureau des lycéens', 'Student council co-president'),
      place: t('Lycée', 'High school'),
      summary: t('Organisation de projets et management d’équipe.', 'Organising projects and managing a team.'),
      details: [t('Organisation de projets collectifs.', 'Organising group projects.'), t('Coordination et management d’une équipe d’élèves.', 'Coordinating and managing a team of students.')],
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
      summary: t('Animation de séances de tutorat en Python.', 'Running Python tutoring sessions.'),
      details: [
        t('Animation de séances de tutorat en informatique et en Python.', 'Running tutoring sessions in computer science and Python.'),
        t('Préparation et présentation de cours à d’autres élèves.', 'Preparing and presenting lessons to other students.'),
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
      period: '2023 – 2024',
      title: t('Concours d’éloquence', 'Public speaking contests'),
      place: t('Dont Lions Club', 'Including the Lions Club'),
      summary: t('5e sur 18 participants au concours du Lions Club.', '5th out of 18 at the Lions Club contest.'),
      details: [t('Participation à plusieurs concours d’éloquence.', 'Took part in several public speaking contests.'), t('Lions Club : 5e sur 18 participants.', 'Lions Club: 5th out of 18.')],
      skills: [t('Prise de parole', 'Public speaking'), t('Argumentation', 'Argumentation')],
      pod: t('Analyse : l’unité défend ses idées à voix haute. Volume vocal : adéquat.', 'Analysis: this unit defends its ideas out loud. Voice volume: adequate.'),
    },
  ]

  /* PROJECTS (code, tools) and MUSIC (instruments), linked to their proofs */
  const hardSkills: Skill[] = [
    { id: 'skill-python', name: 'Python', group: 'code', icon: 'code', detail: t('Jeu (pygame), traitement d’image, enseignement en tutorat.', 'A game (pygame), image processing, teaching it as a tutor.'), proofs: ['myst', 'tutorat'] },
    { id: 'skill-c', name: 'C', group: 'code', icon: 'code', detail: t('Pointeurs, mémoire, listes chaînées, processus et pipes.', 'Pointers, memory, linked lists, processes and pipes.'), proofs: ['minimake'] },
    { id: 'skill-ocaml', name: 'OCaml', group: 'code', icon: 'lambda', detail: t('Programmation fonctionnelle (cursus EPITA).', 'Functional programming (EPITA curriculum).'), proofs: ['epita-1'] },
    { id: 'skill-algo', name: t('Algorithmique', 'Algorithms'), group: 'code', icon: 'graph', detail: t('Génération procédurale, arbres, piles/files, parsing.', 'Procedural generation, trees, stacks/queues, parsing.'), proofs: ['myst', 'minimake'] },
    { id: 'skill-git', name: 'Git', group: 'tool', icon: 'branch', detail: t('Branches, fusions, forge EPITA et GitHub.', 'Branches, merges, EPITA forge and GitHub.'), proofs: ['myst', 'minimake'] },
    { id: 'skill-linux', name: 'Linux', group: 'tool', icon: 'terminal', detail: t('Poste quotidien sous Arch Linux, shell, compilation.', 'Daily driver on Arch Linux, shell, compiling.'), proofs: ['minimake', 'portfolio'] },
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
        { k: t('Styles', 'Styles'), v: t('Classique, électrique', 'Classical, electric') },
        { k: t('Statut', 'Status'), v: t('En activité', 'Active') },
      ],
      proofs: ['conservatoire', 'concerts', 'epimusic'],
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
      detail: t('Quatre ans de batterie au conservatoire, premier cycle validé avec les félicitations.', 'Four years of drums at the conservatoire, first cycle passed with the jury’s congratulations.'),
      facts: [
        { k: t('Pratique', 'Practice'), v: t('4 ans de conservatoire', '4 years at the conservatoire') },
        { k: t('Diplôme', 'Diploma'), v: t('Cycle 1 — Très bien, félicitations', 'Cycle 1 — Very good, with honours') },
        { k: t('Statut', 'Status'), v: t('Arrêtée', 'Stopped') },
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
      detail: t('Composition sur FL Studio : la pratique s’acquiert, sur une base théorique solide héritée du conservatoire.', 'Composing in FL Studio: still learning the craft, on a solid theory base from the conservatoire.'),
      facts: [
        { k: t('Outil', 'Tool'), v: 'FL Studio' },
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
    { id: 'soft-confidence', name: t('Confiance en soi', 'Self-confidence'), icon: 'chip', detail: t('Jouer seul devant un public, défendre une idée en concours.', 'Playing solo in front of an audience, defending an idea in a contest.'), proofs: ['concerts', 'eloquence'] },
    { id: 'soft-speaking', name: t('Prise de parole', 'Public speaking'), icon: 'chip', detail: t('Concours d’éloquence, présentation de cours.', 'Public speaking contests, giving lessons.'), proofs: ['eloquence', 'tutorat'] },
    { id: 'soft-lead', name: t('Leadership', 'Leadership'), icon: 'chip', detail: t('Co-présidence du BDL, présidence d’un groupe EPImusic.', 'Student council co-president, EPImusic band president.'), proofs: ['bdl', 'epimusic'] },
    { id: 'soft-adapt', name: t('Adaptabilité', 'Adaptability'), icon: 'chip', detail: t('Passer de la guitare à la basse pour les besoins du groupe.', 'Switching from guitar to bass for the band’s needs.'), proofs: ['epimusic'] },
    { id: 'soft-teach', name: t('Pédagogie', 'Teaching'), icon: 'chip', detail: t('Transmettre la programmation à des débutants.', 'Teaching programming to beginners.'), proofs: ['tutorat'] },
  ]

  const selfAssessment = {
    strengths: [
      t('Aisance à l’oral et goût de la transmission (tutorat, éloquence, scène).', 'At ease speaking and enjoy passing knowledge on (tutoring, eloquence, stage).'),
      t('Rigueur et constance acquises en 14 ans de conservatoire.', 'Rigour and consistency built over 14 years of conservatoire.'),
      t('Autonomie sur des projets techniques de bout en bout.', 'Autonomous on technical projects from start to finish.'),
      t('Habitude du travail collectif et des responsabilités (BDL, orchestre, EPImusic).', 'Used to teamwork and responsibility (student council, orchestra, EPImusic).'),
    ],
    improvements: [
      t('Documenter davantage mon code et écrire des messages de commit explicites.', 'Document my code more and write clearer commit messages.'),
      t('Planifier l’architecture avant de coder, surtout en équipe.', 'Plan the architecture before coding, especially in a team.'),
      t('Écrire mes propres tests plutôt que de dépendre de ceux fournis.', 'Write my own tests instead of relying on the provided ones.'),
      t('Acquérir une première expérience en entreprise dans le développement.', 'Gain a first professional experience in software development.'),
    ],
  }

  const outlook = {
    interests: [
      t('Intelligence artificielle', 'Artificial intelligence'),
      t('Développement logiciel', 'Software development'),
      t('Systèmes et bas niveau', 'Systems and low level'),
      t('Développement de jeux', 'Game development'),
    ],
    next: t(
      'Trouver un stage de développement logiciel orienté intelligence artificielle, puis poursuivre en cycle ingénieur à l’EPITA.',
      'Find a software development internship focused on artificial intelligence, then continue into EPITA’s engineering cycle.',
    ),
  }

  const contact = {
    email: 'louis.leymonie@outlook.fr',
    github: 'https://github.com/CoolLyfe',
    location: 'Toulouse, France',
  }

  return {
    identity,
    about,
    now,
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
