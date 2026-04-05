import { createBoss } from '../entities/Boss';
import { createEnemy } from '../entities/Enemy';
import type { EnemyKind, GameState, StageWaveProfile } from '../types';
import { addFlash, addShake } from './effects';

function getWaveInfo(state: GameState): { index: number; profile: StageWaveProfile } {
  const ratio = Math.max(0, Math.min(1, state.timeMs / state.stage.durationMs));
  const waves = state.stage.waves;

  for (let index = 0; index < waves.length; index += 1) {
    if (ratio <= waves[index].untilRatio) {
      return { index, profile: waves[index] };
    }
  }

  return { index: waves.length - 1, profile: waves[waves.length - 1] };
}

function chooseEnemyKind(weights: Record<EnemyKind, number>): EnemyKind {
  let roll = Math.random();
  const orderedKinds: EnemyKind[] = ['normal', 'fast', 'tank', 'ace'];

  for (const kind of orderedKinds) {
    roll -= weights[kind];
    if (roll <= 0) {
      return kind;
    }
  }

  return 'ace';
}

export function updateSpawning(state: GameState, deltaMs: number): void {
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

  const difficultyFactor = profile.difficulty + Math.min(state.timeMs / state.stage.durationMs, 0.32);
  const spawnCount = 1 + (Math.random() < profile.multiSpawnChance ? 1 : 0);

  for (let count = 0; count < spawnCount; count += 1) {
    state.enemies.push(createEnemy(chooseEnemyKind(profile.weights), difficultyFactor));
  }

  const variance = 0.82 + Math.random() * 0.28;
  state.spawnTimer = Math.max(profile.spawnMinMs, profile.spawnBaseMs * variance);
}
