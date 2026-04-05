import { GAME_WIDTH, OVERDRIVE_MAX_CHARGE } from '../config';
import type { GameState } from '../types';

function drawBar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  value: number,
  maxValue: number,
  fill: string,
): void {
  ctx.fillStyle = 'rgba(148, 163, 184, 0.18)';
  ctx.fillRect(x, y, width, 12);
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, width * Math.max(0, Math.min(1, value / maxValue)), 12);
  ctx.strokeStyle = 'rgba(226, 232, 240, 0.25)';
  ctx.strokeRect(x, y, width, 12);
}

function drawTag(ctx: CanvasRenderingContext2D, x: number, y: number, label: string, color: string): number {
  ctx.font = 'bold 12px "Microsoft YaHei", "Segoe UI", sans-serif';
  const width = Math.ceil(ctx.measureText(label).width) + 18;
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, 20);
  ctx.fillStyle = '#020617';
  ctx.fillText(label, x + 9, y + 14);
  return width;
}

export function renderHud(ctx: CanvasRenderingContext2D, state: GameState, stageBestScore: number): void {
  const { player, stage } = state;
  const stageProgress = Math.max(0, Math.min(1, state.timeMs / stage.durationMs));
  const secondsRemaining = Math.max(0, Math.ceil((stage.durationMs - state.timeMs) / 1000));
  const bossCountdown = stage.isBossStage ? Math.max(0, Math.ceil(((stage.bossSpawnMs ?? stage.durationMs * 0.58) - state.timeMs) / 1000)) : 0;

  ctx.save();
  ctx.fillStyle = 'rgba(2, 6, 23, 0.78)';
  ctx.fillRect(12, 12, GAME_WIDTH - 24, 132);

  ctx.fillStyle = '#f8fafc';
  ctx.textAlign = 'left';
  ctx.font = 'bold 18px "Microsoft YaHei", "Segoe UI", sans-serif';
  ctx.fillText(`第${stage.id}关 ${stage.name}`, 24, 36);

  ctx.font = '12px "Microsoft YaHei", "Segoe UI", sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(`本关最高 ${stageBestScore}`, 24, 54);
  ctx.fillText(`分数 ${state.score}`, 24, 72);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 12px "Microsoft YaHei", "Segoe UI", sans-serif';
  ctx.fillText(state.waveLabel, GAME_WIDTH / 2, 30);
  ctx.fillStyle = state.boss
    ? stage.highlight
    : stage.isBossStage
      ? bossCountdown > 0
        ? '#fca5a5'
        : '#fcd34d'
      : '#67e8f9';
  ctx.fillText(
    state.boss
      ? state.boss.label
      : stage.isBossStage
        ? bossCountdown > 0
          ? `${bossCountdown}秒后头目`
          : '头目逼近'
        : `剩余 ${secondsRemaining} 秒`,
    GAME_WIDTH / 2,
    48,
  );

  ctx.textAlign = 'right';
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText(`击落 ${state.stats.kills}`, GAME_WIDTH - 24, 30);
  ctx.fillText(`擦弹 ${state.stats.grazes}`, GAME_WIDTH - 24, 48);
  ctx.fillText(`近身 ${state.stats.closeKills}`, GAME_WIDTH - 24, 66);

  ctx.textAlign = 'left';
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 12px "Microsoft YaHei", "Segoe UI", sans-serif';
  ctx.fillText('生命', 24, 98);
  drawBar(ctx, 60, 88, 122, player.hp, player.maxHp, '#22c55e');

  ctx.fillText('爆发', 198, 98);
  drawBar(
    ctx,
    238,
    88,
    178,
    player.overdriveTimer > 0 ? OVERDRIVE_MAX_CHARGE : player.overdriveCharge,
    OVERDRIVE_MAX_CHARGE,
    player.overdriveTimer > 0 ? '#facc15' : player.overdriveCharge >= OVERDRIVE_MAX_CHARGE ? '#f59e0b' : '#38bdf8',
  );

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '12px "Microsoft YaHei", "Segoe UI", sans-serif';
  const overdriveLabel = player.overdriveTimer > 0 ? '爆发中' : player.overdriveCharge >= OVERDRIVE_MAX_CHARGE ? '已就绪' : `${Math.round(player.overdriveCharge)}%`;
  ctx.fillText(overdriveLabel, 420, 98);

  if (state.combo > 1) {
    ctx.fillStyle = state.combo >= 10 ? '#facc15' : '#f8fafc';
    ctx.font = 'bold 20px "Microsoft YaHei", "Segoe UI", sans-serif';
    ctx.fillText(`连杀 x${state.combo}`, 24, 124);
  } else {
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px "Microsoft YaHei", "Segoe UI", sans-serif';
    ctx.fillText(stage.subtitle, 24, 124);
  }

  let tagX = GAME_WIDTH - 24;
  const tags: Array<{ label: string; color: string }> = [];
  if (player.rapidFireTimer > 0) tags.push({ label: '疾射', color: '#38bdf8' });
  if (player.spreadTimer > 0) tags.push({ label: '扩散', color: '#f59e0b' });
  if (player.shieldTimer > 0) tags.push({ label: '护盾', color: '#c084fc' });

  tags.reverse().forEach((tag) => {
    const width = Math.ceil(ctx.measureText(tag.label).width) + 18;
    tagX -= width;
    drawTag(ctx, tagX, 112, tag.label, tag.color);
    tagX -= 8;
  });

  drawBar(ctx, 24, 136, GAME_WIDTH - 48, stageProgress, 1, stage.highlight);
  ctx.restore();
}
