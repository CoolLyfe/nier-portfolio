# nier-portfolio

Portfolio de Louis Leymonie (EPITA, promo 2030). L'interface reproduit le menu système de *NieR: Automata* et présente tout le parcours : études, projets, musique, engagements et vie perso, en français et en anglais. C'est un projet de fan, sans lien avec Square Enix ni PlatinumGames, et qui n'utilise aucun élément du jeu.

## Lancer en local

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # génère dist/
```

## Modifier le contenu

Tout le texte du site se trouve dans **`src/data/profile.ts`**, écrit une seule fois en deux langues : `t('français', 'english')`.
Les libellés des onglets et les répliques du Pod sont dans `src/data/strings.ts`.
Le téléphone et l'adresse postale ne sont volontairement pas publiés.

Les captures d'écran servant de preuves vont dans `public/evidence/`.

### Ajouter des photos

Les cadres photo de l'accueil et de VIE PERSO › Galerie affichent « Donnée visuelle en attente » tant qu'ils sont vides.
Pour en remplir un : déposer l'image dans `public/gallery/` (de préférence en `.webp`, environ 1200 px de large), puis renseigner `src` dans `gallery` (`profile.ts`) :

```ts
{ id: 'stage', icon: 'guitar', caption: t('Sur scène', 'On stage'), src: 'gallery/stage.webp' },
```

| Cadre | Où il apparaît |
|---|---|
| `portrait` | Cercle de la carte d'identité (accueil), fiche PROFIL › Profil |
| `stage` | Grande case verticale de l'accueil |
| `dojo`, `kitchen`, `games` | Cases de l'accueil, fiches Aïkido / Pâtisserie / Jeux vidéo |
| `band` | Galerie |

Les photos sont teintées dans la palette du menu et retrouvent leurs couleurs au survol.

## Accueil

Le site s'ouvre sur ACCUEIL, une mosaïque de cases de tailles différentes, pensée pour qu'un recruteur trouve l'essentiel en 30 secondes :
carte d'identité (accroche, disponibilité, boutons CV / GitHub / contact), **Atouts** (ce qui me distingue, chaque atout renvoie à ses preuves),
**Projets phares**, « En ce moment », photos, accès à chaque domaine et contact.

Les atouts (`strengths`), les projets mis en avant (`featured`) et la ligne de disponibilité (`identity.seeking`) se modifient dans `profile.ts`.

## CV en PDF

Le bouton « CV (PDF) » de l'accueil (ou PROFIL › Contact › Exporter le CV) ouvre `public/Louis_Leymonie_CV.pdf`,
mon CV fait sur Canva. Le numéro de téléphone et l'adresse postale en sont retirés avant publication :
pour le mettre à jour, exporter le nouveau PDF depuis Canva, retirer ces deux infos, puis remplacer le fichier.
Les versions Markdown et JSON restent générées à partir de `profile.ts`.

## Onglets

Un onglet par domaine de vie. Chaque onglet est découpé en catégories, comme les menus WEAPONS et ITEMS du jeu : colonne des catégories, liste, puis fiche illustrée.

| Onglet | Catégories |
|---|---|
| ACCUEIL | Mosaïque |
| PARCOURS | Position · Scolarité · Diplômes · Langues |
| PROJETS | Projets de groupe · Projets individuels · Langages · Outils |
| MUSIQUE | Conservatoire (et ses 5 diplômes) · Instruments · Scène & groupe · Jukebox |
| ENGAGEMENTS | Responsabilités · Emplois · Prise de parole |
| VIE PERSO | Sport · Passions · Galerie |
| PROFIL | Qui je suis · Soft skills · Bilan · Contact · Système (réglages, terminal) |

## Ambiance

- **FR / EN** : bouton en haut à droite (aussi `?lang=en`). Le choix est mémorisé.
- **Ambiance sonore** : bourdon et notes de cloche synthétisés en direct (Web Audio, aucun fichier audio). Coupée par défaut.
- **Pod 042** : flotte en bas à droite et commente ce que l'on survole. Un clic le met en veille.
- Poussière carrée qui dérive, anneaux qui tournent lentement, entrées en fondu. Tout s'arrête si le système demande de réduire les animations.

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

Accessible depuis PROFIL › Système, ou avec la touche `²`.
Commandes : `help`, `ls -a`, `cat`, `crack` (il faut recopier une clé d'accès), `download cv [--json]`, `open <onglet|projet>`.
Cinq archives chiffrées sont cachées dans `.blackbox/`.

## Liens directs

- `#music`, `#life`… ouvrent un onglet.
- `?open=myst` ouvre directement le dossier d'une entrée, quel que soit son onglet (`?hack=` reste accepté).
- `?skipboot` saute la séquence de démarrage, `?lang=fr|en` force la langue.

## Structure

```
src/
├── data/profile.ts        contenu FR/EN (seul fichier à modifier)
├── data/strings.ts        onglets et répliques du Pod
├── i18n.tsx               langue active
├── index.css              palettes (menu / hacking), mosaïque, Pod, panneaux, CRT
├── App.tsx                onglets, colonnes, barre d'état, démarrage
├── home/Home.tsx          page d'accueil en mosaïque
├── hooks/useAmbient.ts    ambiance sonore synthétisée
├── hooks/useSettings.ts   préférences persistées et bruitages
├── components/            Pod, cadres photo, décor de fond, icônes, lignes de menu
├── menu/
│   ├── tabs.tsx           les onglets, leurs catégories et la fiche de chaque entrée
│   ├── Breach.tsx         fiche → mode hacking → dossier détaillé
│   └── details.tsx        vues détaillées (projet, quête, compétence)
└── hack/                  terminal, système de fichiers virtuel, export du CV
```

## À venir

- **Photos** : portrait, scène, dojo, cuisine, jeux, groupe (voir « Ajouter des photos »).
- Enregistrements pour le Jukebox (MUSIQUE) : guitare, groupe EPImusic, compositions FL Studio.
- Photos et vidéos de concerts (trio au musée de Bagnols-sur-Cèze, concerts de Noël, fête de la musique, orchestre).

## Déploiement

Chaque push sur `main` déclenche `.github/workflows/deploy.yml`, qui publie le site sur GitHub Pages.
