import {
  GAME_HEIGHT,
  GAME_WIDTH,
  GRAZE_CHARGE,
  GRAZE_RADIUS,
  GRAZE_SCORE,
  OVERDRIVE_ACTIVATION_CLEAR_RADIUS,
  OVERDRIVE_DURATION_MS,
  OVERDRIVE_MAX_CHARGE,
  PLAYER_OVERDRIVE_FIRE_INTERVAL,
  PLAYER_RAPID_FIRE_INTERVAL,
  STAGE_COUNT,
} from '../config';
import { createEnemyBullet, createPlayerBullet } from '../entities/Bullet';
import type { Boss, Enemy, GameState, InputState, Particle } from '../types';
import { addOverdriveCharge } from './combat';
import { addFlash, addShake, pushRing, pushSparkBurst } from './effects';
import { resolveCollisions } from './collision';
import { updateSpawning } from './spawn';

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function squaredDistancePointToRect(
  px: number,
  py: number,
  x: number,
  y: number,
  width: number,
  height: number,
): number {
  const dx = Math.max(x - px, 0, px - (x + width));
  const dy = Math.max(y - py, 0, py - (y + height));
  return dx * dx + dy * dy;
}

function pushEnemyShot(state: GameState, x: number, y: number, angle: number, speed: number, color: string): void {
  state.enemyBullets.push(createEnemyBullet(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed, color));
}

function pushAimedShot(state: GameState, x: number, y: number, speed: number, color: string): void {
  const targetX = state.player.x + state.player.width / 2;
  const targetY = state.player.y + state.player.height / 2;
  const angle = Math.atan2(targetY - y, targetX - x);
  pushEnemyShot(state, x, y, angle, speed, color);
}

function fireEnemyPattern(state: GameState, enemy: Enemy): void {
  const originX = enemy.x + enemy.width / 2;
  const originY = enemy.y + enemy.height - 4;
  const downward = Math.PI / 2;

  switch (enemy.firePattern) {
    case 'aimed':
      pushAimedShot(state, originX, originY, enemy.bulletSpeed, enemy.color);
      break;
    case 'spread':
      [-0.42, 0, 0.42].forEach((offset) => {
        pushEnemyShot(state, originX, originY, downward + offset, enemy.bulletSpeed, enemy.color);
      });
      break;
    case 'spray':
      [-0.72, -0.28, 0.28, 0.72].forEach((offset) => {
        pushEnemyShot(state, originX, originY, downward + offset, enemy.bulletSpeed * 0.92, enemy.color);
      });
      break;
    case 'burst': {
      const targetX = state.player.x + state.player.width / 2;
      const targetY = state.player.y + state.player.height / 2;
      const angle = Math.atan2(targetY - originY, targetX - originX);
      [-0.22, 0, 0.22].forEach((offset) => {
        pushEnemyShot(state, originX, originY, angle + offset, enemy.bulletSpeed, enemy.color);
      });
      break;
    }
  }
}

function fireBossPattern(state: GameState, boss: Boss): void {
  const originX = boss.x + boss.width / 2;
  const originY = boss.y + boss.height - 10;
  const downward = Math.PI / 2;

  if (boss.pattern === 'fan') {
    [-0.88, -0.44, 0, 0.44, 0.88].forEach((offset) => {
      pushEnemyShot(state, originX, originY, downward + offset, boss.bulletSpeed, boss.accent);
    });
    boss.fireTimer = boss.fireIntervalMs;
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
  boss.fireTimer = Math.max(500, boss.fireIntervalMs - 110);
}

function updateStars(state: GameState, deltaMs: number): void {
  for (const star of state.stars) {
    star.y += (star.speed * deltaMs) / 1000;
    if (star.y > GAME_HEIGHT) {
      star.y = -star.size;
      star.x = Math.random() * GAME_WIDTH;
    }
  }
}

function activateOverdrive(state: GameState): void {
  const player = state.player;
  player.overdriveCharge = 0;
  player.overdriveTimer = OVERDRIVE_DURATION_MS;
  const originX = player.x + player.width / 2;
  const originY = player.y + player.height / 2;
  const before = state.enemyBullets.length;

  state.enemyBullets = state.enemyBullets.filter((bullet) => {
    const dx = bullet.x + bullet.width / 2 - originX;
    const dy = bullet.y + bullet.height / 2 - originY;
    return dx * dx + dy * dy > OVERDRIVE_ACTIVATION_CLEAR_RADIUS * OVERDRIVE_ACTIVATION_CLEAR_RADIUS;
  });

  state.score += (before - state.enemyBullets.length) * 6;
  state.announcement = '爆发启动';
  state.announcementTimer = 950;
  state.events.push({ type: 'overdrive' });
  addFlash(state, '#22d3ee', 210);
  addShake(state, 200, 6);
  pushSparkBurst(state, originX, originY, '#67e8f9', 18, 320, 3.5);
  pushRing(state, originX, originY, '#22d3ee', 34, 320);
}

function updatePlayer(state: GameState, input: InputState, deltaMs: number): void {
  const player = state.player;
  const distance = (player.speed * deltaMs) / 1000;
  const overdrive = player.overdriveTimer > 0;

  if (input.left) player.x -= distance;
  if (input.right) player.x += distance;
  if (input.up) player.y -= distance;
  if (input.down) player.y += distance;

  player.x = clamp(player.x, 0, GAME_WIDTH - player.width);
  player.y = clamp(player.y, 96, GAME_HEIGHT - player.height - 20);

  player.fireTimer -= deltaMs;
  let currentInterval = player.baseFireInterval;
  if (player.rapidFireTimer > 0) {
    currentInterval = PLAYER_RAPID_FIRE_INTERVAL;
  }
  if (overdrive) {
    currentInterval = PLAYER_OVERDRIVE_FIRE_INTERVAL;
  }

  if (player.fireTimer <= 0) {
    const centerX = player.x + player.width / 2 - 3;
    const mainDamage = overdrive ? 2 : 1;

    state.playerBullets.push(createPlayerBullet(centerX, player.y - 14, 0, mainDamage, overdrive));

    if (overdrive) {
      state.playerBullets.push(createPlayerBullet(centerX - 10, player.y - 6, -120, 1, true));
      state.playerBullets.push(createPlayerBullet(centerX + 10, player.y - 6, 120, 1, true));
    }

    if (player.spreadTimer > 0) {
      state.playerBullets.push(createPlayerBullet(centerX - 16, player.y - 4, -175, overdrive ? 2 : 1, overdrive));
      state.playerBullets.push(createPlayerBullet(centerX + 16, player.y - 4, 175, overdrive ? 2 : 1, overdrive));
    }

    state.events.push({ type: 'player-shot' });
    player.fireTimer = currentInterval;
  }

  player.rapidFireTimer = Math.max(0, player.rapidFireTimer - deltaMs);
  player.spreadTimer = Math.max(0, player.spreadTimer - deltaMs);
  player.shieldTimer = Math.max(0, player.shieldTimer - deltaMs);
  player.invulnerableTimer = Math.max(0, player.invulnerableTimer - deltaMs);
  player.overdriveTimer = Math.max(0, player.overdriveTimer - deltaMs);

  if (input.skillPressed && player.overdriveCharge >= OVERDRIVE_MAX_CHARGE && player.overdriveTimer <= 0) {
    activateOverdrive(state);
  }
}

function updateBullets(state: GameState, deltaMs: number): void {
  const ratio = deltaMs / 1000;
  state.playerBullets = state.playerBullets.filter((bullet) => {
    bullet.x += bullet.vx * ratio;
    bullet.y += bullet.vy * ratio;
    return bullet.y + bullet.height > -30 && bullet.y < GAME_HEIGHT + 30;
  });

  state.enemyBullets = state.enemyBullets.filter((bullet) => {
    bullet.x += bullet.vx * ratio;
    bullet.y += bullet.vy * ratio;
    return bullet.y + bullet.height > -40 && bullet.y < GAME_HEIGHT + 40 && bullet.x > -40 && bullet.x < GAME_WIDTH + 40;
  });
}

function updateGrazes(state: GameState): void {
  const player = state.player;
  const grazeRadiusSquared = GRAZE_RADIUS * GRAZE_RADIUS;

  for (const bullet of state.enemyBullets) {
    if (bullet.grazed) {
      continue;
    }

    const centerX = bullet.x + bullet.width / 2;
    const centerY = bullet.y + bullet.height / 2;
    const distanceSquared = squaredDistancePointToRect(centerX, centerY, player.x, player.y, player.width, player.height);
    if (distanceSquared <= grazeRadiusSquared && distanceSquared > 9) {
      bullet.grazed = true;
      addOverdriveCharge(state, GRAZE_CHARGE);
      state.score += GRAZE_SCORE + Math.min(60, state.combo * 2);
      state.stats.grazes += 1;
      state.events.push({ type: 'graze' });
      pushSparkBurst(state, centerX, centerY, '#67e8f9', 5, 95, 2);
    }
  }
}

function updateEnemies(state: GameState, deltaMs: number): void {
  const ratio = deltaMs / 1000;
  state.enemies = state.enemies.filter((enemy) => {
    enemy.hitTimer = Math.max(0, enemy.hitTimer - deltaMs);
    enemy.y += enemy.speed * ratio;
    enemy.x += enemy.vx * ratio;

    if (enemy.x <= 0 || enemy.x + enemy.width >= GAME_WIDTH) {
      enemy.vx *= -1;
      enemy.x = clamp(enemy.x, 0, GAME_WIDTH - enemy.width);
    }

    enemy.fireTimer -= deltaMs;
    if (enemy.y > 54 && enemy.fireTimer <= 0) {
      fireEnemyPattern(state, enemy);
      enemy.fireTimer = enemy.fireInterval * (0.88 + Math.random() * 0.22);
    }

    return enemy.y < GAME_HEIGHT + enemy.height;
  });
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
  }

  if (boss.entering) {
    boss.y += boss.speed * ratio;
    if (boss.y >= 72) {
      boss.y = 72;
      boss.entering = false;
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

function updatePickups(state: GameState, deltaMs: number): void {
  const ratio = deltaMs / 1000;
  state.pickups = state.pickups.filter((pickup) => {
    pickup.y += pickup.speed * ratio;
    return pickup.y < GAME_HEIGHT + pickup.height;
  });
}

function updateParticles(state: GameState, deltaMs: number): void {
  const ratio = deltaMs / 1000;
  state.particles = state.particles.filter((particle: Particle) => {
    particle.life = Math.max(0, particle.life - deltaMs);
    particle.x += particle.vx * ratio;
    particle.y += particle.vy * ratio;
    particle.vx *= 0.99;
    particle.vy *= 0.99;
    return particle.life > 0;
  });
}

function completeNormalStage(state: GameState): void {
  if (state.phase !== 'playing') {
    return;
  }

  state.phase = 'stageClear';
  state.enemies = [];
  state.enemyBullets = [];
  state.pickups = [];
  state.announcement = state.stage.clearAnnouncement;
  state.announcementTimer = 1200;
  state.events.push({ type: 'stage-clear', finalStage: state.stage.id === STAGE_COUNT });
  addFlash(state, state.stage.highlight, 180);
  addShake(state, 200, 6);
  pushSparkBurst(state, GAME_WIDTH / 2, GAME_HEIGHT / 2, state.stage.highlight, 16, 260, 3.4);
  pushRing(state, GAME_WIDTH / 2, GAME_HEIGHT / 2, state.stage.highlight, 58, 320);
}

export function updateGame(state: GameState, input: InputState, deltaMs: number): void {
  state.timeMs += deltaMs;
  state.announcementTimer = Math.max(0, state.announcementTimer - deltaMs);
  state.screenFlashTimer = Math.max(0, state.screenFlashTimer - deltaMs);
  state.cameraShakeTimer = Math.max(0, state.cameraShakeTimer - deltaMs);
  state.cameraShakeStrength = state.cameraShakeTimer > 0 ? Math.max(0, state.cameraShakeStrength - deltaMs * 0.03) : 0;
  state.comboTimer = Math.max(0, state.comboTimer - deltaMs);

  if (state.announcementTimer === 0) {
    state.announcement = '';
  }

  if (state.comboTimer === 0) {
    state.combo = 0;
  }

  updateStars(state, deltaMs);
  updatePlayer(state, input, deltaMs);
  updateBullets(state, deltaMs);
  updateGrazes(state);
  updateEnemies(state, deltaMs);
  updateBoss(state, deltaMs);
  updatePickups(state, deltaMs);
  updateParticles(state, deltaMs);
  updateSpawning(state, deltaMs);
  resolveCollisions(state);

  if (!state.stage.isBossStage && state.phase === 'playing' && state.timeMs >= state.stage.durationMs) {
    completeNormalStage(state);
  }
}
