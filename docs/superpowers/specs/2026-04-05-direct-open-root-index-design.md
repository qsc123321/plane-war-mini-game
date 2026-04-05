# Direct-Open Root Index Design

Date: 2026-04-05

Goal: make the root `index.html` directly playable by double-clicking from the filesystem, while preserving a clean Vite source workflow and the existing GitHub plus Vercel deployment workflow.

## Current State

The current root `index.html` is a Vite development entry point. It loads `/src/main.ts` as a module, which works under the Vite dev server but does not work when the file is opened directly via `file://`.

The built `dist/index.html` works as a static entry because it references already-built JavaScript and CSS assets with relative paths.

## Scope

This design covers:

- Replacing the root `index.html` with a static-friendly entry
- Adding fixed-name browser-ready bundle files in the project root
- Introducing a separate Vite-only HTML entry for source development
- Keeping the existing source tree, Vite build, and deployment flow intact

This design does not cover:

- Rewriting the project to remove Vite or TypeScript
- Gameplay balancing or feature work
- UI redesign unrelated to the direct-open goal

## Recommended Approach

The recommended approach is to use two HTML entries with distinct responsibilities.

The root `index.html` becomes a true runtime entry that always loads root-level built files such as `game.bundle.js` and `game.bundle.css`. A separate `dev.html` remains the source-focused Vite entry that loads `/src/main.ts`.

This avoids forcing one HTML file to serve incompatible needs across direct filesystem play, local source development, and static deployment.

## Asset Model

Two root-level output files should be introduced:

- `game.bundle.js`
- `game.bundle.css`

These files represent the browser-ready build that the direct-open root entry and static deployment path depend on.

They should use stable names so the root `index.html` does not need to be rewritten every time the app changes. That avoids brittle hash-based asset references in the root directory.

## Source Of Truth

The source of truth remains the existing TypeScript project under `src/`.

The root-level bundle files are derived artifacts. They exist to support the user's direct-open requirement and the static runtime entry. They should not replace the source-based Vite workflow.

## Build And Deployment Compatibility

The normal Vite source workflow should continue through `dev.html`.

A dedicated direct-open build step should generate the stable root bundle files, and those files should be committed whenever source behavior changes.

GitHub plus Vercel auto deploy should continue to work by serving the root static entry and bundle files after each push.

## Validation

The work is successful if all of these are true:

- Double-clicking the root `index.html` launches the game from the local filesystem
- The root entry no longer references `/src/main.ts`
- `game.bundle.js` and `game.bundle.css` exist in the project root and load correctly
- `npm run build` still succeeds for the Vite source entry
- The deployed Vercel project still works after the change

## Risks And Constraints

- The root-level bundle files can go stale if source changes are made without regenerating them
- Maintaining both source files and direct-open bundle files adds a small release discipline cost
- If the direct-open sync step assumes fixed emitted asset names, future tooling changes can break it, so the sync logic should tolerate Vite choosing a different CSS filename

## Implementation Boundary

This design intentionally avoids a full toolchain rewrite. It solves the user's direct-open requirement by separating the runtime-facing root entry from the source-facing Vite entry instead of replacing the current project structure.