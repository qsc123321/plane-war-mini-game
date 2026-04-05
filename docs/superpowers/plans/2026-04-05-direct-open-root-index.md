# Direct-Open Root Index Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the root `index.html` directly playable from the filesystem while keeping a clean Vite source workflow and the existing GitHub plus Vercel deployment path.

**Architecture:** Use a two-entry model. The root `index.html` is the browser-ready runtime entry that loads stable root assets `game.bundle.js` and `game.bundle.css`. A separate `dev.html` continues to load `/src/main.ts` for Vite development and source verification. A dedicated `build:direct-open` pipeline emits a temporary library bundle and a sync script copies the generated JS plus CSS into the project root with stable names.

**Tech Stack:** TypeScript, Vite, Node.js, PowerShell, GitHub, Vercel

---

### Task 1: Add A Dedicated Direct-Open Bundle Pipeline

**Files:**
- Modify: `package.json`
- Modify: `vite.config.ts`
- Create: `scripts/sync-direct-open-bundle.mjs`

- [x] Add `build:direct-open` to `package.json`
- [x] Add a `direct-open` branch in `vite.config.ts` that builds to `.direct-open-dist`
- [x] Add a sync script that copies the generated JS and discovered CSS file to root `game.bundle.js` and `game.bundle.css`
- [x] Run `npm run build:direct-open`
- [x] Verify root bundle files exist and `.direct-open-dist` is removed

### Task 2: Split Runtime Entry From Source Entry

**Files:**
- Modify: `index.html`
- Create: `dev.html`

- [x] Replace the root `index.html` with a static entry that loads `./game.bundle.css` and `./game.bundle.js`
- [x] Create `dev.html` with the original Vite source entry `/src/main.ts`
- [x] Update `npm run dev` and `npm run preview` to open `/dev.html`
- [x] Verify the root HTML no longer references `/src/main.ts`

### Task 3: Verify The Ongoing Workflow

**Files:**
- No additional files required unless verification reveals a fix is needed

- [x] Run `npm run build:direct-open`
- [x] Run `npm run build`
- [x] Confirm the source build still passes and emits `dist/dev.html`
- [ ] Inspect final git diff and working tree
- [ ] Commit the direct-open changes
- [ ] Push to `origin/main` for Vercel auto deployment
- [ ] Re-check `git status --short` after push

### Operational Rule

After future source changes, regenerate the direct-open assets before pushing:

1. `npm run build:direct-open`
2. `git add .`
3. `git commit -m "describe your change"`
4. `git push`