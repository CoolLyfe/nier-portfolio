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

## Navigation

| Touche | Action |
|---|---|
| `1`–`4`, `Q` / `E` | Changer de catégorie (SYSTEM / INTEL / LOGS / COMMS) |
| `↑` `↓` | Déplacer la sélection |
| `Entrée` | Ouvrir la fenêtre sélectionnée |
| `Échap` | Fermer la fenêtre |
| `` ` `` ou `²` | Mode Hacking |

L'effet CRT et le son se règlent dans la barre du bas.

## Mode Hacking

Le bouton `> sudo hack --override` fait basculer toute l'interface en noir, rouge et vert, et ouvre un terminal.
Commandes disponibles : `help`, `ls -a`, `cat`, `crack` (il faut recopier une clé d'accès), `download cv [--json]`, `open <section|projet>`.
Cinq archives chiffrées sont cachées dans `.blackbox/`.

## Liens directs

- `#intel`, `#logs`… ouvrent une catégorie.
- `?open=myst` ouvre directement une fenêtre (projet ou entrée de LOGS).
- `?hack` démarre en mode Hacking, `?skipboot` saute la séquence de démarrage.

## Structure

```
src/
├── data/profile.ts        contenu (seul fichier à modifier)
├── index.css              palette, cadres, effet de sélection, scanlines
├── App.tsx                navigation, démarrage, bascule du mode Hacking
├── hooks/useSettings.ts   préférences persistées et son synthétisé
├── components/
│   ├── ui.tsx             Window (coins biseautés), Item [>], Meter…
│   ├── Shell.tsx          onglets, barre de description, watermarks
│   └── Expanded.tsx       Card (vue résumée) → Expanded (zoom détaillé)
├── sections/              System, Intel, Logs, Comms
└── hack/                  Terminal, système de fichiers virtuel, export du CV
```

## Déploiement

Chaque push sur `main` déclenche `.github/workflows/deploy.yml`, qui publie le site sur GitHub Pages.
