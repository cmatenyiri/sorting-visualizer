# Sortscape — sorting algorithms, visualized

An interactive sorting-algorithm visualizer built with **React 19, Vite and TypeScript**, styled
with a fully custom **MUI** theme (dark and light).

## Features

- **Seven algorithms**: Bubble, Insertion, Merge, Quick (median-of-three), Heap, Radix (LSD) and
  **Tidal Sort**, an original hybrid of Comb Sort's shrinking gap and Cocktail Shaker's two-way
  sweeps.
- **Guided tutorial** shown on startup (skippable, with a "don't show on startup" option). It
  explains what sorting algorithms are, how work is measured (Big-O, stability, in-place), how to
  read the visualizer, and then walks through every algorithm with a live, narrated
  illustration.
- **Step-accurate playback**: play/pause, step forwards _and backwards_, and scrub a timeline
  through every recorded operation.
- **Live pseudocode trace**: the line that produced the current step is highlighted.
- **Narration and counters**: every step is described in plain language, and comparisons, swaps
  and array writes are counted as the run progresses.
- **Algorithm-specific visuals**: pivot threshold line (Quick), key line (Insertion), gap arcs
  (Tidal, Heap), a binary-tree view of the heap and the ten digit buckets of Radix Sort.
- **Controls**: array size (5–200), speed (1–2,400 ops/s), starting order (random, nearly sorted,
  reversed, few unique) or your own numbers.
- **Race mode**: run any combination of algorithms on the same array, one operation per tick,
  with a live leaderboard.
- **Cheat sheet**: complexity table plus operation counts measured in your browser.
- Optional sound, keyboard shortcuts (press <kbd>?</kbd>), and a responsive layout.

## Getting started

Requires Node.js 20.19+ (see `.nvmrc`).

```bash
npm install
npm run dev       # start the dev server at http://localhost:5173
```

| Script                 | What it does                                    |
| ---------------------- | ----------------------------------------------- |
| `npm run dev`          | Vite dev server with hot reload                 |
| `npm run build`        | Type-check and build for production (`dist/`)   |
| `npm run preview`      | Serve the production build locally              |
| `npm run lint`         | ESLint (type-aware, React Hooks, React Refresh) |
| `npm run lint:fix`     | ESLint with auto-fix                            |
| `npm run format`       | Format everything with Prettier                 |
| `npm run format:check` | Verify formatting without writing               |
| `npm run typecheck`    | TypeScript project build without emitting       |

## Editor setup

The repo ships `.vscode/settings.json` and extension recommendations. Install the **Prettier**
and **ESLint** extensions when VS Code suggests them and files are formatted on save, with
ESLint fixes applied on save as well. Other editors can use `.prettierrc.json` and
`.editorconfig`.

## Continuous integration

`.github/workflows/ci.yml` runs on every push to any branch and on pull requests:

- **Lint & format**: `npm run lint -- --max-warnings=0` and `npm run format:check`
- **Typecheck & build**: `npm run build`
- **Deploy to GitHub Pages**: on pushes to `main` only, after both jobs above pass

## Deployment

The site is published to GitHub Pages at <https://cmatenyiri.github.io/sorting-visualizer/>.

One-time setup: in the repository go to **Settings → Pages → Build and deployment** and set
**Source** to **GitHub Actions**. After that, every push to `main` that passes CI is deployed
automatically.

The deploy job builds with `BASE_PATH` set to the Pages path (`/sorting-visualizer/`), which
Vite uses as its `base`. To try that build locally:

```bash
BASE_PATH=/sorting-visualizer/ npm run build
BASE_PATH=/sorting-visualizer/ npm run preview   # http://localhost:4173/sorting-visualizer/
```

## How it works

Each algorithm is plain imperative code that runs against a `Tracer`
(`src/algorithms/tracer.ts`). The tracer records every comparison, swap, write and
bookkeeping event as a `Step`, with a narration message and the pseudocode line it maps to.
`src/engine/timeline.ts` stores checkpoints every 256 steps, so the player can jump to any point,
backwards or forwards, without re-running the algorithm.

```
src/
  algorithms/   one file per algorithm (metadata, pseudocode, implementation) + tracer
  engine/       timeline/cursor, array generators, speed mapping, sound synth
  hooks/        playback, hotkeys, persisted state
  components/   UI: stage, controls, panels, race, cheat sheet, tutorial, visuals
  theme/        the custom MUI theme (palette, typography, component overrides)
```
