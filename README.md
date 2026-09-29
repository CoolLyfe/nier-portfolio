# nier-portfolio

Portfolio de Louis Leymonie (EPITA, promo 2030). L'interface reproduit le menu système de *NieR: Automata*. C'est un projet de fan, sans lien avec Square Enix ni PlatinumGames, et qui n'utilise aucun élément du jeu.

## Lancer en local

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # génère dist/
```

## Modifier le contenu

Tout le texte du site se trouve dans **`src/data/profile.ts`**.
Le téléphone, l'adresse postale et la photo du CV ne sont volontairement pas publiés.

Les captures d'écran servant de preuves vont dans `public/evidence/`.

## Onglets

| Onglet | Contenu |
|---|---|
| MAP | Parcours : EPITA, lycée, collège, position actuelle |
| QUESTS | Quêtes principales (expériences) et secondaires (activités) |
| ITEMS | Langues et centres d'intérêt |
| WEAPONS | Hard skills, reliés à leurs preuves |
| SKILLS | Soft skills, bilan, perspectives |
| INTEL | Projets |
| SYSTEM | Profil, motivation, contact, export du CV, terminal, réglages |

## Navigation

| Touche | Action |
|---|---|
| `←` `→` (ou `Q` / `E`, `1`–`7`) | Changer d'onglet |
| `↑` `↓` | Déplacer la sélection |
| `A` / `Entrée` | Confirmer : lance le hacking sur les fenêtres chiffrées |
| `B` / `Échap` | Abandonner le hacking, fermer une fenêtre |
| `²` ou `` ` `` | Terminal |

Sur mobile, un premier tap sélectionne une ligne et un second la confirme.

## Hacking

Pour ouvrir le détail d'une fenêtre (projet, étape du parcours, quête, compétence), il faut la « hacker ».
La fenêtre passe en noir et orange et affiche un mini-jeu : le vaisseau, piloté à la souris, au doigt ou aux flèches, tire automatiquement sur le noyau.
Chaque projectile orange qui touche le vaisseau fait régénérer le noyau. Une fois le noyau détruit, la fenêtre s'agrandit et affiche le détail.
Le bouton « Passer » permet de sauter le jeu. Si le système demande de réduire les animations, le jeu est remplacé par un court déchiffrement.

## Terminal

Accessible depuis SYSTEM › Terminal, ou avec la touche `²`.
Commandes : `help`, `ls -a`, `cat`, `crack` (il faut recopier une clé d'accès), `download cv [--json]`, `open <onglet|projet>`.
Cinq archives chiffrées sont cachées dans `.blackbox/`.

## Liens directs

- `#intel`, `#quests`… ouvrent un onglet.
- `?open=myst` ouvre directement le détail d'une fenêtre, `?hack=myst` lance son hacking.
- `?skipboot` saute la séquence de démarrage.

## Structure

```
src/
├── data/profile.ts        contenu (seul fichier à modifier)
├── index.css              palettes (menu / hacking), onglets, lignes, CRT
├── App.tsx                onglets, deux colonnes, barre d'état, démarrage
├── hooks/useSettings.ts   préférences persistées et son synthétisé
├── components/ui.tsx      Row (■ / ►), Window, Meter, raccourcis clavier
├── menu/
│   ├── tabs.tsx           les 7 onglets et l'aperçu de chaque entrée
│   ├── Breach.tsx         fenêtre → hacking → vue détaillée
│   ├── HackGame.tsx       mini-jeu de hacking (Canvas 2D)
│   └── details.tsx        vues détaillées (projet, quête, compétence)
└── hack/                  terminal, système de fichiers virtuel, export du CV
```

## Déploiement

Chaque push sur `main` déclenche `.github/workflows/deploy.yml`, qui publie le site sur GitHub Pages.
