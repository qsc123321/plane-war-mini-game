import {
  CLOSE_KILL_CHARGE,
  CLOSE_KILL_DISTANCE,
  CLOSE_KILL_SCORE_BONUS,
  OVERDRIVE_KILL_CLEAR_RADIUS,
  PICKUP_DROP_CHANCE,
  PICKUP_EFFECT_MS,
  PICKUP_POOL,
  PLAYER_INVULNERABLE_MS,
  SHIELD_EFFECT_MS,
  STAGE_COUNT,
} from '../config';
import { createPickup } from '../entities/Pickup';
import type { Boss, Bullet, Enemy, GameState, Pickup } from '../types';
import { addCombo, addOverdriveCharge, breakCombo } from './combat';
import { addFlash, addShake, pushRing, pushSparkBurst } from './effects';

function overlaps(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number },
): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function centerDistance(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number },
): number {
  const ax = a.x + a.width / 2;
  const ay = a.y + a.height / 2;
  const bx = b.x + b.width / 2;
  const by = b.y + b.height / 2;
  return Math.hypot(ax - bx, ay - by);
}

function distanceToPoint(entity: { x: number; y: number; width: number; height: number }, x: number, y: number): number {
  return Math.hypot(entity.x + entity.width / 2 - x, entity.y + entity.height / 2 - y);
}

function spawnPickupFromEnemy(enemy: Enemy): Pickup | null {
  const chance = enemy.kind === 'ace' ? 0.55 : enemy.kind === 'tank' ? 0.28 : PICKUP_DROP_CHANCE;
  if (Math.random() > chance) {
    return null;
  }

  const type = PICKUP_POOL[Math.floor(Math.random() * PICKUP_POOL.length)];
  return createPickup(type, enemy.x + enemy.width / 2 - 11, enemy.y + enemy.height / 2 - 11);
}

function rewardKill(state: GameState, enemy: Enemy): void {
  const closeKill = centerDistance(enemy, state.player) <= CLOSE_KILL_DISTANCE;
  const comboFactor = 1 + Math.min(state.combo, 24) * 0.08;
  const overdriveFactor = state.player.overdriveTimer > 0 ? 1.35 : 1;
  const score = Math.round(enemy.score * comboFactor * overdriveFactor) + (closeKill ? CLOSE_KILL_SCORE_BONUS : 0);
  const centerX = enemy.x + enemy.width / 2;
  const centerY = enemy.y + enemy.height / 2;

  state.score += score;
  addOverdriveCharge(state, enemy.chargeValue + (closeKill ? CLOSE_KILL_CHARGE : 0));
  addCombo(state, 1, closeKill ? 260 : 120);
  state.stats.kills += 1;
  if (closeKill) {
    state.stats.closeKills += 1;
  }

  state.events.push({ type: 'enemy-down', closeKill, elite: enemy.elite });
  pushSparkBurst(state, centerX, centerY, enemy.color, enemy.elite || closeKill ? 18 : 12, enemy.elite ? 340 : 260, closeKill ? 4 : 3);
  pushRing(state, centerX, centerY, closeKill ? '#facc15' : enemy.color, closeKill ? 34 : 24, 240);
  addShake(state, closeKill ? 180 : 130, closeKill ? 7 : enemy.elite ? 6 : 4);
  if (closeKill) {
    addFlash(state, '#facc15', 120);
  }

  if (state.player.overdriveTimer > 0) {
    const before = state.enemyBullets.length;
    state.enemyBullets = state.enemyBullets.filter((bullet) => distanceToPoint(bullet, centerX, centerY) > OVERDRIVE_KILL_CLEAR_RADIUS);
    state.score += (before - state.enemyBullets.length) * 5;
    pushRing(state, centerX, centerY, '#fde68a', 42, 280);
  }

  if (closeKill) {
    state.announcement = '近身击落';
    state.announcementTimer = 700;
  } else if (state.combo > 0 && state.combo % 5 === 0) {
    state.announcement = `连杀 x${state.combo}`;
    state.announcementTimer = 650;
  }

  const pickup = spawnPickupFromEnemy(enemy);
  if (pickup) {
    state.pickups.push(pickup);
  }
}

function hurtPlayer(state: GameState, amount: number): void {
  const player = state.player;
  if (player.invulnerableTimer > 0) {
    return;
  }

  if (player.shieldTimer > 0) {
    player.shieldTimer = Math.max(0, player.shieldTimer - 1400);
    player.invulnerableTimer = 260;
    breakCombo(state);
    state.events.push({ type: 'shield-hit' });
    addFlash(state, '#c084fc', 80);
    addShake(state, 120, 4);
    pushRing(state, player.x + player.width / 2, player.y + player.height / 2, '#c084fc', 24, 180);
    return;
  }

  player.hp -= amount;
  player.invulnerableTimer = PLAYER_INVULNERABLE_MS;
  player.overdriveCharge = Math.max(0, player.overdriveCharge - 18);
  breakCombo(state);
  state.events.push({ type: 'player-hit' });
  addFlash(state, '#fb7185', 140);
  addShake(state, 220, 8);
  pushSparkBurst(state, player.x + player.width / 2, player.y + player.height / 2, '#fda4af', 14, 220, 3);
}

function handleBossBulletHits(state: GameState, boss: Boss): void {
  const survivors: Bullet[] = [];

  for (const bullet of state.playerBullets) {
    if (!overlaps(bullet, boss)) {
      survivors.push(bullet);
      continue;
    }

    boss.hp -= bullet.damage;
    boss.hitTimer = 100;
  }

  state.playerBullets = survivors;

  if (boss.hp <= 0) {
    const comboFactor = 1 + Math.min(state.combo, 24) * 0.08;
    const overdriveFactor = state.player.overdriveTimer > 0 ? 1.35 : 1;
    const bossScore = Math.round(boss.score * comboFactor * overdriveFactor);
    const centerX = boss.x + boss.width / 2;
    const centerY = boss.y + boss.height / 2;

    state.score += bossScore;
    state.boss = null;
    state.enemies = [];
    state.enemyBullets = [];
    state.pickups = [];
    state.phase = 'stageClear';
    state.announcement = state.stage.id === STAGE_COUNT ? '战役通关' : '头目击破';
    state.announcementTimer = 1600;
    state.events.push({ type: 'boss-defeated', finalStage: state.stage.id === STAGE_COUNT });
    addFlash(state, '#fde68a', 260);
    addShake(state, 420, 11);
    pushSparkBurst(state, centerX, centerY, boss.accent, 34, 380, 4.6);
    pushRing(state, centerX, centerY, '#fde68a', 72, 420);
  }
}

export function resolveCollisions(state: GameState): void {
  const player = state.player;
  const enemySurvivors: Enemy[] = [];
  const bulletSurvivors: Bullet[] = [];

  for (const bullet of state.playerBullets) {
    let hit = false;
    for (const enemy of state.enemies) {
      if (enemy.hp <= 0 || !overlaps(bullet, enemy)) {
        continue;
      }

      enemy.hp -= bullet.damage;
      enemy.hitTimer = 90;
      hit = true;
      if (enemy.hp <= 0) {
        rewardKill(state, enemy);
      }
      break;
    }

    if (!hit) {
      bulletSurvivors.push(bullet);
    }
  }

  state.playerBullets = bulletSurvivors;

  for (const enemy of state.enemies) {
    if (enemy.hp > 0) {
      enemySurvivors.push(enemy);
    }
  }
  state.enemies = enemySurvivors;

  if (state.boss) {
    handleBossBulletHits(state, state.boss);
  }

  const playerHitBullets: Bullet[] = [];
  for (const bullet of state.enemyBullets) {
    if (!overlaps(bullet, player)) {
      playerHitBullets.push(bullet);
      continue;
    }

    hurtPlayer(state, bullet.damage);
  }
  state.enemyBullets = playerHitBullets;

  const enemyBodyHits: Enemy[] = [];
  for (const enemy of state.enemies) {
    if (!overlaps(enemy, player)) {
      enemyBodyHits.push(enemy);
      continue;
    }

    hurtPlayer(state, 1);
  }
  state.enemies = enemyBodyHits;

  if (state.boss && overlaps(state.boss, player)) {
    hurtPlayer(state, 1);
  }

  const pickupSurvivors: Pickup[] = [];
  for (const pickup of state.pickups) {
    if (!overlaps(pickup, player)) {
      pickupSurvivors.push(pickup);
      continue;
    }

    switch (pickup.type) {
      case 'rapid':
        player.rapidFireTimer = PICKUP_EFFECT_MS;
        break;
      case 'spread':
        player.spreadTimer = PICKUP_EFFECT_MS;
        break;
      case 'shield':
        player.shieldTimer = SHIELD_EFFECT_MS;
        player.hp = Math.min(player.maxHp, player.hp + 1);
        break;
    }

    state.score += 45;
    state.announcement = pickup.label;
    state.announcementTimer = 650;
    state.events.push({ type: 'pickup', pickupType: pickup.type });
    pushRing(state, pickup.x + pickup.width / 2, pickup.y + pickup.height / 2, pickup.color, 18, 180);
  }
  state.pickups = pickupSurvivors;

  if (player.hp <= 0 && state.phase === 'playing') {
    state.phase = 'gameOver';
    state.announcement = '战机坠毁';
    state.announcementTimer = 900;
    state.events.push({ type: 'game-over' });
  }
}
