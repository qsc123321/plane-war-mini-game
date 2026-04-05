# Stages 1-3 Tuning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tune stages 1-3 so the campaign opens with readable pressure, stage 2 escalates into stronger crossfire, and the stage 3 boss becomes shorter and fiercer.

**Architecture:** Keep the existing campaign flow intact, add one small deterministic `tuning.ts` helper module for behavior that needs stable tests, retune stage 1-3 config values in place, and thread the helpers into spawn and boss cadence logic. The current workspace has no `.git` directory, so commit steps only run if Git is initialized before execution.

**Tech Stack:** TypeScript, Vite, Vitest

---

### Task 1: Add Deterministic Tuning Helpers And Test Harness

**Files:**
- Create: `src/game/systems/tuning.ts`
- Create: `src/game/systems/tuning.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Write the failing test and add the test script**

Update `package.json` to add a `test` script and the Vitest dev dependency:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "devDependencies": {
    "typescript": "^5.5.4",
    "vite": "^5.4.10",
    "vitest": "^2.1.8"
  }
}
```

Create `src/game/systems/tuning.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { getBossFireResetMs, getBossSwitchFireTimer, getEarlyMultiSpawnChance } from './tuning';

describe('getEarlyMultiSpawnChance', () => {
  it('heavily damps stage 1 multi-spawn at run start and restores base chance by the end of the opening segment', () => {
    expect(getEarlyMultiSpawnChance(1, 0, 0.12)).toBeCloseTo(0.036, 3);
    expect(getEarlyMultiSpawnChance(1, 0.28, 0.12)).toBeCloseTo(0.12, 3);
  });

  it('lets later early-campaign stages ramp faster than stage 1', () => {
    const baseChance = 0.18;
    expect(getEarlyMultiSpawnChance(2, 0.05, baseChance)).toBeGreaterThan(getEarlyMultiSpawnChance(1, 0.05, baseChance));
    expect(getEarlyMultiSpawnChance(3, 0.05, baseChance)).toBeGreaterThan(getEarlyMultiSpawnChance(2, 0.05, baseChance));
  });

  it('leaves later stages untouched', () => {
    expect(getEarlyMultiSpawnChance(4, 0.02, 0.2)).toBeCloseTo(0.2, 5);
  });
});

describe('boss cadence helpers', () => {
  it('makes stage 3 hunt bursts recycle faster than the base interval', () => {
    expect(getBossFireResetMs(3, 'fan', 660)).toBe(581);
    expect(getBossFireResetMs(3, 'hunt', 660)).toBe(475);
  });

  it('forces a quick follow-up after a stage 3 pattern switch only', () => {
    expect(getBossSwitchFireTimer(3, 540)).toBe(180);
    expect(getBossSwitchFireTimer(5, 540)).toBe(540);
  });
});
```

- [ ] **Step 2: Install the test dependency**

Run:

```bash
npm install
```

Expected: npm finishes successfully and updates `package-lock.json` to include Vitest.

- [ ] **Step 3: Run the test to verify it fails**

Run:

```bash
npm test -- src/game/systems/tuning.test.ts
```

Expected: FAIL with a module resolution error because `src/game/systems/tuning.ts` does not exist yet.

- [ ] **Step 4: Write the minimal helper implementation**

Create `src/game/systems/tuning.ts`:

```ts
import type { BossPattern } from '../types';

const EARLY_STAGE_RAMP = {
  1: { limit: 0.28, startScale: 0.3 },
  2: { limit: 0.22, startScale: 0.5 },
  3: { limit: 0.18, startScale: 0.66 },
} as const;

export function getEarlyMultiSpawnChance(stageId: number, elapsedRatio: number, baseChance: number): number {
  const ramp = EARLY_STAGE_RAMP[stageId as keyof typeof EARLY_STAGE_RAMP];
  if (!ramp) {
    return baseChance;
  }

  if (elapsedRatio >= ramp.limit) {
    return baseChance;
  }

  const progress = Math.max(0, elapsedRatio) / ramp.limit;
  const scale = ramp.startScale + (1 - ramp.startScale) * progress;
  return baseChance * scale;
}

export function getBossFireResetMs(stageId: number, pattern: BossPattern, baseIntervalMs: number): number {
  if (stageId !== 3) {
    return pattern === 'fan' ? baseIntervalMs : Math.max(500, baseIntervalMs - 110);
  }

  if (pattern === 'fan') {
    return Math.max(500, Math.round(baseIntervalMs * 0.88));
  }

  return Math.max(420, Math.round(baseIntervalMs * 0.72));
}

export function getBossSwitchFireTimer(stageId: number, currentFireTimer: number): number {
  return stageId === 3 ? Math.min(currentFireTimer, 180) : currentFireTimer;
}
```

- [ ] **Step 5: Run the tests to verify they pass**

Run:

```bash
npm test -- src/game/systems/tuning.test.ts
```

Expected: PASS for all helper tests in `src/game/systems/tuning.test.ts`.

- [ ] **Step 6: Commit**

Run:

```bash
git rev-parse --is-inside-work-tree
```

Expected: `true`. If the command errors because the workspace still has no `.git` directory, skip the commit for now.

If Git is available, run:

```bash
git add package.json package-lock.json src/game/systems/tuning.ts src/game/systems/tuning.test.ts
```

```bash
git commit -m "test: add deterministic tuning helpers"
```

### Task 2: Retune Stages 1-3 And Apply Early-Spawn Guardrails

**Files:**
- Modify: `src/game/config.ts`
- Modify: `src/game/systems/spawn.ts`
- Modify: `src/game/systems/tuning.test.ts`

- [ ] **Step 1: Extend the tests with early-campaign balance expectations**

Add this import directly below the existing Vitest import at the top of `src/game/systems/tuning.test.ts`:

```ts
import { CAMPAIGN_STAGES } from '../config';
```

Then append this test block to the file:

```ts
describe('opening campaign wave tuning', () => {
  const stage1 = CAMPAIGN_STAGES[0];
  const stage2 = CAMPAIGN_STAGES[1];
  const stage3 = CAMPAIGN_STAGES[2];

  it('makes stage 1 immediately pressuring without heavy armor clutter', () => {
    expect(stage1.waves[0]).toMatchObject({
      spawnBaseMs: 760,
      spawnMinMs: 470,
      difficulty: 1.04,
      multiSpawnChance: 0.12,
    });
    expect(stage1.waves[0].weights).toEqual({ normal: 0.64, fast: 0.31, tank: 0.05, ace: 0 });
  });

  it('escalates stage 2 crossfire beyond stage 1', () => {
    expect(stage2.waves[0].weights.fast).toBe(0.44);
    expect(stage2.waves[2].multiSpawnChance).toBe(0.3);
    expect(stage2.waves[3].difficulty).toBe(1.44);
  });

  it('compresses stage 3 momentum before the boss warning', () => {
    expect(stage3.bossSpawnMs).toBe(56000);
    expect(stage3.waves[1]).toMatchObject({
      spawnBaseMs: 600,
      spawnMinMs: 320,
      difficulty: 1.38,
      multiSpawnChance: 0.28,
    });
  });
});
```

- [ ] **Step 2: Run the tests to verify the current config fails the new expectations**

Run:

```bash
npm test -- src/game/systems/tuning.test.ts
```

Expected: FAIL because the current stage 1-3 values in `src/game/config.ts` still use the older pacing numbers.

- [ ] **Step 3: Implement the stage retune and the spawn guardrail**

Update the stage 1-3 entries in `src/game/config.ts` to these values:

```ts
  {
    id: 1,
    name: '前沿试探',
    subtitle: '第一波侦察机进入低空通道。',
    durationMs: 95000,
    isBossStage: false,
    accent: '#38bdf8',
    highlight: '#7dd3fc',
    skyTop: '#031728',
    skyMid: '#071a31',
    skyBottom: '#020617',
    clearAnnouncement: '第一关突破',
    rankThresholds: { S: 14000, A: 10800, B: 7800, C: 5000 },
    waves: [
      wave(0.26, '侦察压进', 760, 470, 1.04, 0.12, { normal: 0.64, fast: 0.31, tank: 0.05, ace: 0 }),
      wave(0.52, '低空夹击', 690, 390, 1.14, 0.16, { normal: 0.46, fast: 0.36, tank: 0.1, ace: 0.08 }),
      wave(0.8, '火线升温', 620, 350, 1.24, 0.22, { normal: 0.36, fast: 0.36, tank: 0.16, ace: 0.12 }),
      wave(1, '收束冲刺', 560, 310, 1.32, 0.26, { normal: 0.3, fast: 0.36, tank: 0.18, ace: 0.16 }),
    ],
  },
  {
    id: 2,
    name: '交叉火网',
    subtitle: '侧翼机群开始封锁横向走位。',
    durationMs: 98000,
    isBossStage: false,
    accent: '#22d3ee',
    highlight: '#67e8f9',
    skyTop: '#042033',
    skyMid: '#08233a',
    skyBottom: '#020617',
    clearAnnouncement: '第二关突破',
    rankThresholds: { S: 17500, A: 13600, B: 9800, C: 6200 },
    waves: [
      wave(0.22, '横向试压', 720, 430, 1.14, 0.14, { normal: 0.42, fast: 0.44, tank: 0.08, ace: 0.06 }),
      wave(0.48, '斜线锁头', 640, 360, 1.26, 0.22, { normal: 0.3, fast: 0.42, tank: 0.14, ace: 0.14 }),
      wave(0.76, '双翼挤压', 570, 300, 1.36, 0.3, { normal: 0.24, fast: 0.38, tank: 0.18, ace: 0.2 }),
      wave(1, '火网闭合', 520, 270, 1.44, 0.34, { normal: 0.2, fast: 0.36, tank: 0.2, ace: 0.24 }),
    ],
  },
  {
    id: 3,
    name: '头目拦截',
    subtitle: '第一台拦截舰会在中段后强行切入。',
    durationMs: 100000,
    isBossStage: true,
    bossSpawnMs: 56000,
    accent: '#fb7185',
    highlight: '#fda4af',
    skyTop: '#220814',
    skyMid: '#2b0b19',
    skyBottom: '#09040b',
    clearAnnouncement: '第三关突破',
    rankThresholds: { S: 23000, A: 18500, B: 13800, C: 9000 },
    waves: [
      wave(0.22, '诱导机群', 690, 400, 1.24, 0.18, { normal: 0.42, fast: 0.38, tank: 0.1, ace: 0.1 }),
      wave(0.46, '护航压迫', 600, 320, 1.38, 0.28, { normal: 0.3, fast: 0.36, tank: 0.16, ace: 0.18 }),
      wave(1, '头目警报', 540, 280, 1.48, 0.34, { normal: 0.24, fast: 0.32, tank: 0.2, ace: 0.24 }),
    ],
    boss: {
      label: '拦截舰·赤锋',
      hp: 185,
      fireIntervalMs: 760,
      bulletSpeed: 300,
      score: 3600,
      speed: 118,
      patternSwitchMs: 2100,
      accent: '#fb7185',
      warningColor: '#fecdd3',
    },
  },
```

Update `src/game/systems/spawn.ts` so the early-campaign spawn roll uses the helper instead of the raw wave chance:

```ts
import { getEarlyMultiSpawnChance } from './tuning';

export function updateSpawning(state: GameState, deltaMs: number): void {
  const progressRatio = Math.max(0, Math.min(1, state.timeMs / state.stage.durationMs));
  const { index, profile } = getWaveInfo(state);

  if (state.waveIndex !== index) {
    state.waveIndex = index;
    state.waveLabel = profile.label;
    state.announcement = profile.label;
    state.announcementTimer = 800;
  }

  if (state.stage.isBossStage && state.stage.boss && !state.bossAppeared && state.timeMs >= (state.stage.bossSpawnMs ?? state.stage.durationMs * 0.58)) {
    state.bossAppeared = true;
    state.boss = createBoss(state.stage.boss);
    state.enemies = [];
    state.enemyBullets = [];
    state.pickups = [];
    state.announcement = state.stage.boss.label;
    state.announcementTimer = 1600;
    state.events.push({ type: 'boss-alert' });
    addFlash(state, state.stage.boss.accent, 180);
    addShake(state, 240, 8);
    return;
  }

  if (state.boss) {
    return;
  }

  if (!state.stage.isBossStage && state.timeMs >= state.stage.durationMs) {
    return;
  }

  state.spawnTimer -= deltaMs;
  if (state.spawnTimer > 0) {
    return;
  }

  const difficultyFactor = profile.difficulty + Math.min(progressRatio, 0.32);
  const multiSpawnChance = getEarlyMultiSpawnChance(state.stage.id, progressRatio, profile.multiSpawnChance);
  const spawnCount = 1 + (Math.random() < multiSpawnChance ? 1 : 0);

  for (let count = 0; count < spawnCount; count += 1) {
    state.enemies.push(createEnemy(chooseEnemyKind(profile.weights), difficultyFactor));
  }

  const variance = 0.82 + Math.random() * 0.28;
  state.spawnTimer = Math.max(profile.spawnMinMs, profile.spawnBaseMs * variance);
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run:

```bash
npm test -- src/game/systems/tuning.test.ts
```

Expected: PASS for the helper tests and the new stage 1-3 balance expectations.

- [ ] **Step 5: Run the build to verify the game still compiles**

Run:

```bash
npm run build
```

Expected: Vite build completes successfully and emits updated assets under `dist/assets/`.

- [ ] **Step 6: Commit**

Run:

```bash
git rev-parse --is-inside-work-tree
```

Expected: `true`. If the command errors because the workspace still has no `.git` directory, skip the commit for now.

If Git is available, run:

```bash
git add src/game/config.ts src/game/systems/spawn.ts src/game/systems/tuning.test.ts
```

```bash
git commit -m "feat: retune opening campaign pressure"
```

### Task 3: Shorten And Intensify The Stage 3 Boss

**Files:**
- Modify: `src/game/config.ts`
- Modify: `src/game/systems/update.ts`
- Modify: `src/game/systems/tuning.test.ts`

- [ ] **Step 1: Extend the tests with stage 3 boss expectations**

Append this test block to `src/game/systems/tuning.test.ts`:

```ts
describe('stage 3 boss tuning', () => {
  it('turns the stage 3 boss into a shorter, fiercer burst check', () => {
    expect(CAMPAIGN_STAGES[2].boss).toMatchObject({
      hp: 160,
      fireIntervalMs: 660,
      bulletSpeed: 318,
      speed: 124,
      patternSwitchMs: 1500,
    });
  });
});
```

- [ ] **Step 2: Run the tests to verify the boss expectations fail**

Run:

```bash
npm test -- src/game/systems/tuning.test.ts
```

Expected: FAIL because stage 3 still uses the older boss durability and cadence values.

- [ ] **Step 3: Implement the stage 3 boss retune**

Update the stage 3 boss config inside `src/game/config.ts`:

```ts
    boss: {
      label: '拦截舰·赤锋',
      hp: 160,
      fireIntervalMs: 660,
      bulletSpeed: 318,
      score: 3600,
      speed: 124,
      patternSwitchMs: 1500,
      accent: '#fb7185',
      warningColor: '#fecdd3',
    },
```

Update `src/game/systems/update.ts` to reuse the boss cadence helpers and force a quicker follow-up after the stage 3 boss finishes entering or changes pattern:

```ts
import { getBossFireResetMs, getBossSwitchFireTimer } from './tuning';

function fireBossPattern(state: GameState, boss: Boss): void {
  const originX = boss.x + boss.width / 2;
  const originY = boss.y + boss.height - 10;
  const downward = Math.PI / 2;

  if (boss.pattern === 'fan') {
    [-0.88, -0.44, 0, 0.44, 0.88].forEach((offset) => {
      pushEnemyShot(state, originX, originY, downward + offset, boss.bulletSpeed, boss.accent);
    });
    boss.fireTimer = getBossFireResetMs(state.stage.id, 'fan', boss.fireIntervalMs);
    return;
  }

  const angle = Math.atan2(
    state.player.y + state.player.height / 2 - originY,
    state.player.x + state.player.width / 2 - originX,
  );
  [-0.28, 0, 0.28].forEach((offset) => {
    pushEnemyShot(state, originX, originY, angle + offset, boss.bulletSpeed * 1.05, boss.warningColor);
  });
  [-0.64, 0.64].forEach((offset) => {
    pushEnemyShot(state, originX, originY, downward + offset, boss.bulletSpeed * 0.84, '#f97316');
  });
  boss.fireTimer = getBossFireResetMs(state.stage.id, 'hunt', boss.fireIntervalMs);
}

function updateBoss(state: GameState, deltaMs: number): void {
  if (!state.boss) {
    return;
  }

  const ratio = deltaMs / 1000;
  const boss = state.boss;
  boss.hitTimer = Math.max(0, boss.hitTimer - deltaMs);
  boss.patternTimer -= deltaMs;

  if (boss.patternTimer <= 0) {
    boss.pattern = boss.pattern === 'fan' ? 'hunt' : 'fan';
    boss.patternTimer = boss.patternSwitchMs;
    boss.fireTimer = getBossSwitchFireTimer(state.stage.id, boss.fireTimer);
  }

  if (boss.entering) {
    boss.y += boss.speed * ratio;
    if (boss.y >= 72) {
      boss.y = 72;
      boss.entering = false;
      boss.fireTimer = state.stage.id === 3 ? Math.min(boss.fireTimer, 220) : boss.fireTimer;
      state.announcement = '顶住头目火力';
      state.announcementTimer = 900;
    }
    return;
  }

  boss.x += boss.direction * boss.speed * ratio;
  if (boss.x <= 20 || boss.x + boss.width >= GAME_WIDTH - 20) {
    boss.direction *= -1;
    boss.x = clamp(boss.x, 20, GAME_WIDTH - boss.width - 20);
  }

  boss.fireTimer -= deltaMs;
  if (boss.fireTimer <= 0) {
    fireBossPattern(state, boss);
  }
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run:

```bash
npm test -- src/game/systems/tuning.test.ts
```

Expected: PASS for the boss expectations and all earlier tuning tests.

- [ ] **Step 5: Run the build to verify the code still compiles**

Run:

```bash
npm run build
```

Expected: Vite build completes successfully without TypeScript errors.

- [ ] **Step 6: Run a local smoke-check for stage 1 and the stage 3 boss**

Run:

```bash
npm run dev -- --host 127.0.0.1
```

Expected: Vite reports a local URL such as `http://127.0.0.1:5173/`.

Manual check list:

- Play stage 1 for at least 30 seconds and confirm pressure starts immediately but readable lanes remain visible.
- Play stage 2 long enough to confirm the pressure feels more cross-lane than stage 1.
- Enter stage 3 and confirm the boss appears earlier, attacks faster after entering, and dies faster than the previous version.

- [ ] **Step 7: Commit**

Run:

```bash
git rev-parse --is-inside-work-tree
```

Expected: `true`. If the command errors because the workspace still has no `.git` directory, skip the commit for now.

If Git is available, run:

```bash
git add src/game/config.ts src/game/systems/update.ts src/game/systems/tuning.test.ts
```

```bash
git commit -m "feat: sharpen stage 3 boss pacing"
```

