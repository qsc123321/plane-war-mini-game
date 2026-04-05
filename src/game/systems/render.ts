import { GAME_HEIGHT, GAME_WIDTH } from '../config';
import type { Boss, Bullet, CampaignProgress, Enemy, GameState, Particle, Pickup, Player, Star } from '../types';
import { renderHud } from '../ui/Hud';
import { renderResultScreen, renderStageIntroScreen, renderStageSelectScreen } from '../ui/Screens';

function drawBackground(ctx: CanvasRenderingContext2D, state: GameState): void {
  const gradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
  gradient.addColorStop(0, state.player.overdriveTimer > 0 ? '#04141f' : state.stage.skyTop);
  gradient.addColorStop(0.55, state.boss ? state.stage.skyMid : state.stage.skyMid);
  gradient.addColorStop(1, state.stage.skyBottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  const pulse = state.player.overdriveTimer > 0 ? 0.18 + Math.sin(state.timeMs / 80) * 0.04 : 0.08;
  ctx.fillStyle = `rgba(34, 211, 238, ${pulse})`;
  ctx.fillRect(0, 0, GAME_WIDTH, 84);

  for (const star of state.stars) {
    ctx.fillStyle = `rgba(191, 219, 254, ${star.alpha})`;
    ctx.fillRect(star.x, star.y, star.size, star.size * (state.player.overdriveTimer > 0 ? 3.4 : 2.2));
  }

  ctx.strokeStyle = state.player.overdriveTimer > 0 ? 'rgba(34, 211, 238, 0.14)' : 'rgba(148, 163, 184, 0.08)';
  ctx.lineWidth = 1;
  for (let y = 0; y < GAME_HEIGHT; y += 44) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(GAME_WIDTH, y);
    ctx.stroke();
  }
}

function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]): void {
  for (const particle of particles) {
    const alpha = Math.max(0, particle.life / particle.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    if (particle.shape === 'ring') {
      const progress = 1 - alpha;
      ctx.strokeStyle = particle.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * (0.55 + progress), 0, Math.PI * 2);
      ctx.stroke();
    } else {
      ctx.fillStyle = particle.color;
      ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
    }
    ctx.restore();
  }
}

function drawPlayer(ctx: CanvasRenderingContext2D, player: Player): void {
  ctx.save();
  if (player.invulnerableTimer > 0 && Math.floor(player.invulnerableTimer / 80) % 2 === 0) {
    ctx.globalAlpha = 0.45;
  }

  if (player.overdriveTimer > 0) {
    ctx.fillStyle = 'rgba(250, 204, 21, 0.15)';
    ctx.beginPath();
    ctx.arc(player.x + player.width / 2, player.y + player.height / 2, player.width * 1.2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = player.overdriveTimer > 0 ? '#facc15' : '#38bdf8';
  ctx.beginPath();
  ctx.moveTo(player.x + player.width / 2, player.y - 6);
  ctx.lineTo(player.x + player.width, player.y + player.height - 2);
  ctx.lineTo(player.x + player.width / 2, player.y + player.height - 12);
  ctx.lineTo(player.x, player.y + player.height - 2);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = player.overdriveTimer > 0 ? '#fef3c7' : '#e0f2fe';
  ctx.fillRect(player.x + player.width / 2 - 4, player.y + 10, 8, 14);
  ctx.fillRect(player.x + 6, player.y + 24, 4, 12);
  ctx.fillRect(player.x + player.width - 10, player.y + 24, 4, 12);

  ctx.fillStyle = player.overdriveTimer > 0 ? '#f97316' : '#67e8f9';
  ctx.beginPath();
  ctx.moveTo(player.x + 10, player.y + player.height - 2);
  ctx.lineTo(player.x + 15, player.y + player.height + 10);
  ctx.lineTo(player.x + 20, player.y + player.height - 2);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(player.x + player.width - 20, player.y + player.height - 2);
  ctx.lineTo(player.x + player.width - 15, player.y + player.height + 10);
  ctx.lineTo(player.x + player.width - 10, player.y + player.height - 2);
  ctx.closePath();
  ctx.fill();

  if (player.shieldTimer > 0) {
    ctx.strokeStyle = 'rgba(192, 132, 252, 0.95)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(player.x + player.width / 2, player.y + player.height / 2, player.width * 0.95, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawEnemy(ctx: CanvasRenderingContext2D, enemy: Enemy): void {
  const body = enemy.hitTimer > 0 ? '#f8fafc' : enemy.color;
  ctx.save();
  ctx.fillStyle = body;

  switch (enemy.kind) {
    case 'normal':
      ctx.beginPath();
      ctx.moveTo(enemy.x + enemy.width / 2, enemy.y + enemy.height);
      ctx.lineTo(enemy.x + enemy.width, enemy.y + 10);
      ctx.lineTo(enemy.x + enemy.width / 2, enemy.y);
      ctx.lineTo(enemy.x, enemy.y + 10);
      ctx.closePath();
      ctx.fill();
      break;
    case 'fast':
      ctx.beginPath();
      ctx.moveTo(enemy.x + enemy.width / 2, enemy.y + enemy.height);
      ctx.lineTo(enemy.x + enemy.width, enemy.y + enemy.height / 2);
      ctx.lineTo(enemy.x + enemy.width / 2, enemy.y);
      ctx.lineTo(enemy.x, enemy.y + enemy.height / 2);
      ctx.closePath();
      ctx.fill();
      break;
    case 'tank':
      ctx.fillRect(enemy.x, enemy.y + 8, enemy.width, enemy.height - 8);
      ctx.fillRect(enemy.x + 8, enemy.y, enemy.width - 16, 16);
      break;
    case 'ace':
      ctx.beginPath();
      ctx.moveTo(enemy.x + enemy.width / 2, enemy.y);
      ctx.lineTo(enemy.x + enemy.width, enemy.y + enemy.height / 2);
      ctx.lineTo(enemy.x + enemy.width / 2, enemy.y + enemy.height);
      ctx.lineTo(enemy.x, enemy.y + enemy.height / 2);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = 'rgba(248, 250, 252, 0.9)';
      ctx.lineWidth = 2;
      ctx.stroke();
      break;
  }

  ctx.fillStyle = 'rgba(2, 6, 23, 0.7)';
  ctx.fillRect(enemy.x + 7, enemy.y + 8, Math.max(10, enemy.width - 14), Math.max(8, enemy.height - 16));
  ctx.restore();
}

function drawBoss(ctx: CanvasRenderingContext2D, boss: Boss): void {
  ctx.save();
  ctx.fillStyle = boss.hitTimer > 0 ? '#fef2f2' : boss.accent;
  ctx.fillRect(boss.x, boss.y, boss.width, boss.height);
  ctx.fillStyle = '#111827';
  ctx.fillRect(boss.x + 18, boss.y + 18, boss.width - 36, boss.height - 28);
  ctx.fillStyle = boss.warningColor;
  ctx.fillRect(boss.x + 26, boss.y + 26, boss.width - 52, 18);
  ctx.fillStyle = '#fca5a5';
  ctx.fillRect(boss.x + boss.width / 2 - 20, boss.y + 54, 40, 18);

  ctx.fillStyle = 'rgba(2, 6, 23, 0.72)';
  ctx.fillRect(54, 154, GAME_WIDTH - 108, 18);
  ctx.fillStyle = boss.accent;
  ctx.fillRect(54, 154, (GAME_WIDTH - 108) * Math.max(0, boss.hp) / boss.maxHp, 18);
  ctx.strokeStyle = 'rgba(248, 250, 252, 0.6)';
  ctx.strokeRect(54, 154, GAME_WIDTH - 108, 18);
  ctx.fillStyle = '#fee2e2';
  ctx.font = 'bold 12px "Microsoft YaHei", "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(boss.label, GAME_WIDTH / 2, 148);
  ctx.restore();
}

function drawBullet(ctx: CanvasRenderingContext2D, bullet: Bullet): void {
  ctx.save();
  ctx.fillStyle = bullet.color;
  if (bullet.from === 'player') {
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    ctx.globalAlpha = 0.45;
    ctx.fillRect(bullet.x - 2, bullet.y, bullet.width + 4, bullet.height);
  } else {
    ctx.beginPath();
    ctx.roundRect(bullet.x, bullet.y, bullet.width, bullet.height, 4);
    ctx.fill();
  }
  ctx.restore();
}

function drawPickup(ctx: CanvasRenderingContext2D, pickup: Pickup): void {
  ctx.save();
  ctx.fillStyle = pickup.color;
  ctx.beginPath();
  ctx.arc(pickup.x + pickup.width / 2, pickup.y + pickup.height / 2, pickup.width / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#020617';
  ctx.font = 'bold 11px "Microsoft YaHei", "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(pickup.label, pickup.x + pickup.width / 2, pickup.y + pickup.height / 2 + 4);
  ctx.restore();
}

function drawAnnouncement(ctx: CanvasRenderingContext2D, state: GameState): void {
  if (!state.announcement) {
    return;
  }

  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
  ctx.fillRect(88, 182, GAME_WIDTH - 176, 40);
  ctx.strokeStyle = state.stage.highlight;
  ctx.strokeRect(88, 182, GAME_WIDTH - 176, 40);
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 18px "Microsoft YaHei", "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(state.announcement, GAME_WIDTH / 2, 208);
  ctx.restore();
}

function drawFlash(ctx: CanvasRenderingContext2D, timer: number, color: string): void {
  if (timer <= 0) {
    return;
  }

  ctx.save();
  ctx.globalAlpha = Math.min(0.32, timer / 540);
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  ctx.restore();
}

export function renderGame(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  progress: CampaignProgress,
  stageBestScore: number,
  hoveredTargetId: string | null,
): void {
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  const shakeX = state.phase === 'playing' ? (Math.random() - 0.5) * state.cameraShakeStrength : 0;
  const shakeY = state.phase === 'playing' ? (Math.random() - 0.5) * state.cameraShakeStrength : 0;

  ctx.save();
  ctx.translate(shakeX, shakeY);
  drawBackground(ctx, state);
  for (const pickup of state.pickups) drawPickup(ctx, pickup);
  for (const bullet of state.enemyBullets) drawBullet(ctx, bullet);
  for (const enemy of state.enemies) drawEnemy(ctx, enemy);
  for (const bullet of state.playerBullets) drawBullet(ctx, bullet);
  if (state.boss) drawBoss(ctx, state.boss);
  drawParticles(ctx, state.particles);
  drawPlayer(ctx, state.player);
  ctx.restore();

  if (state.phase === 'playing') {
    renderHud(ctx, state, stageBestScore);
    drawAnnouncement(ctx, state);
  }

  if (state.phase === 'stageSelect') {
    renderStageSelectScreen(ctx, progress, state.stage.id, hoveredTargetId);
  }

  if (state.phase === 'stageIntro') {
    renderStageIntroScreen(ctx, state);
  }

  if (state.phase === 'gameOver') {
    renderResultScreen(ctx, state, stageBestScore, hoveredTargetId, false);
  }

  if (state.phase === 'stageClear') {
    renderResultScreen(ctx, state, stageBestScore, hoveredTargetId, true);
  }

  drawFlash(ctx, state.screenFlashTimer, state.screenFlashColor);
}
