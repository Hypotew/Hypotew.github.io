# Portfolio Thomas

Portfolio personnel avec une interface de bureau macOS simulée, rendu 3D et animations fluides.

## Aperçu

Interface inspirée de macOS avec un Dock en bas permettant d'ouvrir les projets dans des fenêtres draggables. Chaque fenêtre est maximizable, fermable, et s'anime à l'ouverture/fermeture.

## Stack technique

- **React 18** + **Vite 5**
- **Three.js** + **@react-three/fiber** + **@react-three/drei** — rendu 3D
- **@react-spring/three** — animations 3D
- **framer-motion** — animations UI
- Inline styles, thème sombre, glassmorphisme

## Projets présentés

| Projet | Catégorie | Stack |
|--------|-----------|-------|
| RadioVision 3D | Web App | React, Three.js, Vite |
| Flashpoint | Jeu | Unreal Engine 5, C++, Blueprint |
| Minishell | Système | C, POSIX |
| Secured | Lib | C, DJB2 |
| 106bombyx | Simulation | Lua |
| Popeye | DevOps | Docker, docker-compose |

## Installation

```bash
npm install
npm run dev      # localhost:5173
```

## Build & déploiement

```bash
npm run build    # génère dist/
npm run preview  # prévisualise le build sur localhost:4173
```

Le déploiement sur GitHub Pages est automatisé via GitHub Actions à chaque push sur `main`.

## Structure

```
src/
├── main.jsx
├── App.jsx
├── components/
│   ├── MenuBar.jsx
│   ├── Dock.jsx
│   └── AppWindow.jsx
└── data/
    └── projects.js   ← ajouter un projet ici
```

## Ajouter un projet

Éditer `src/data/projects.js` :

```js
{
  id: "unique-id",
  name: "Nom affiché",
  icon: "emoji",
  color: "#hex",
  colorSecondary: "#hex",
  category: "Type — Tech",
  description: "...",
  tech: ["Tech1", "Tech2"],
  features: ["Feature 1", "Feature 2"],
  github: "https://github.com/...",
}
```
