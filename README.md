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

Chaque onglet est découpé en catégories, comme les menus WEAPONS et ITEMS du jeu : colonne des catégories, liste, puis fiche illustrée.

| Onglet | Catégories |
|---|---|
| MAP | Position · Scolarité (EPITA, lycée, collège) · Conservatoire |
| QUESTS | Emplois · Engagements (BDL, tutorat, EPImusic, club 3D) · Scène (concerts, orchestre, éloquence) |
| ITEMS | Objets clés (bac, brevet, BIA, PIX, ASSR) · Diplômes musicaux · Langues · Loisirs |
| WEAPONS | Programmation · Outils · Instruments (guitare, basse, batterie, FM, composition) |
| SKILLS | Soft skills · Bilan · Perspectives |
| INTEL | Projets de groupe · Projets individuels |
| SYSTEM | Unité (sommaire, profil, motivation, objectifs, conclusion) · Transmission · Système |

Le site s'ouvre sur SYSTEM › Sommaire : résumé, chiffres clés et accès rapide à chaque onglet.

## Navigation

| Touche | Action |
|---|---|
| `Q` / `E`, `1`–`7` | Changer d'onglet |
| `←` `→` | Passer de la colonne des catégories à la liste |
| `↑` `↓` | Déplacer la sélection dans la colonne active |
| `A` / `Entrée` | Entrer dans la catégorie, ouvrir le dossier complet |
| `B` / `Échap` | Revenir aux catégories, fermer un dossier |
| `²` ou `` ` `` | Terminal |

Sur mobile, les catégories deviennent une rangée d'onglets ; un premier tap sélectionne une ligne et un second la confirme.

## Dossiers

Les fiches marquées « Ouvrir le dossier complet » (projets, parcours, quêtes, compétences) s'ouvrent avec `A`.
La fiche passe brièvement en mode hacking (noir et orange, déchiffrement), puis s'agrandit en dossier détaillé, qui reste dans la palette du hacking.

## Terminal

Accessible depuis SYSTEM › Terminal, ou avec la touche `²`.
Commandes : `help`, `ls -a`, `cat`, `crack` (il faut recopier une clé d'accès), `download cv [--json]`, `open <onglet|projet>`.
Cinq archives chiffrées sont cachées dans `.blackbox/`.

## Liens directs

- `#intel`, `#quests`… ouvrent un onglet.
- `?open=myst` ouvre directement le dossier d'une entrée, quel que soit son onglet (`?hack=` reste accepté).
- `?skipboot` saute la séquence de démarrage.

## Structure

```
src/
├── data/profile.ts        contenu (seul fichier à modifier)
├── index.css              palettes (menu / hacking), onglets, panneaux, lignes, CRT
├── App.tsx                onglets, deux colonnes, barre d'état, démarrage
├── hooks/useSettings.ts   préférences persistées et son synthétisé
├── components/ui.tsx      Row (■ + curseur pod), Window, Meter
├── components/icons.tsx   icônes des onglets, pictogrammes des fiches, décor de fond
├── menu/
│   ├── tabs.tsx           les 7 onglets, leurs catégories et la fiche de chaque entrée
│   ├── Breach.tsx         fiche → mode hacking → dossier détaillé
│   └── details.tsx        vues détaillées (projet, quête, compétence)
└── hack/                  terminal, système de fichiers virtuel, export du CV
```

## À venir

Contenus à ajouter quand les fichiers seront disponibles :

- Lecteur audio (jukebox) façon NieR pour écouter des enregistrements : guitare, groupe EPImusic, compositions FL Studio.
- Photos et vidéos de concerts (trio au musée de Bagnols-sur-Cèze, concerts de Noël, fête de la musique, orchestre).
- Autres preuves « proof of concept » : captures, diplômes scannés, liens.

## Déploiement

Chaque push sur `main` déclenche `.github/workflows/deploy.yml`, qui publie le site sur GitHub Pages.
