# nier-portfolio

Portfolio de Louis Leymonie (EPITA, promo 2030). L'interface s'inspire du menu système de *NieR: Automata*.

## Lancer en local

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # génère dist/
```

## Modifier le contenu

Tout le texte du site se trouve dans **`src/data/profile.ts`**.
Toute valeur qui commence par `TODO:` s'affiche sur le site sous la forme d'un encadré rouge « DONNÉE MANQUANTE ». Il suffit de la remplacer par la vraie information.

Les captures d'écran servant de preuves vont dans `public/evidence/`.

## Navigation

| Touche | Action |
|---|---|
| `1`–`4` | Aller à SYSTEM / INTEL / LOGS / COMMS |
| `↑` `↓` | Déplacer la sélection |
| `Entrée` | Ouvrir (menu principal) |
| `Échap` | Retour au menu principal |

Les scanlines et le son peuvent être activés ou coupés dans la barre du bas.

## Structure

```
src/
├── data/profile.ts        contenu (seul fichier à modifier)
├── index.css              palette, cadres, effet de sélection, scanlines
├── App.tsx                navigation (hash #section) et raccourcis clavier
├── hooks/useSettings.ts   préférences persistées et son synthétisé
├── components/            Header/StatusBar, MenuDetail, éléments UI
└── sections/              Dashboard, System, Intel, Logs, Comms
```

## Déploiement

Chaque push sur `main` déclenche `.github/workflows/deploy.yml`, qui publie le site sur GitHub Pages.
