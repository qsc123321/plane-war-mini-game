import { getStageRecord } from '../campaign';
import { CAMPAIGN_STAGES, GAME_HEIGHT, GAME_WIDTH, STAGE_COUNT } from '../config';
import type { CampaignProgress, GamePhase, GameState } from '../types';

const HEADER_Y = 44;
const CARD_WIDTH = 196;
const CARD_HEIGHT = 92;
const CARD_GAP_X = 16;
const CARD_GAP_Y = 14;
const CARD_START_X = 36;
const CARD_START_Y = 146;
const PANEL_WIDTH = 392;
const PANEL_HEIGHT = 348;
const BUTTON_WIDTH = 184;
const BUTTON_HEIGHT = 48;

type Bounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type MenuTarget = Bounds & {
  id: string;
  action: 'stage' | 'retry' | 'back-select';
  stageId?: number;
};

function getPanelBounds(): Bounds {
  return {
    x: (GAME_WIDTH - PANEL_WIDTH) / 2,
    y: (GAME_HEIGHT - PANEL_HEIGHT) / 2,
    width: PANEL_WIDTH,
    height: PANEL_HEIGHT,
  };
}

function getStageCardBounds(stageId: number): Bounds {
  const zeroBasedIndex = stageId - 1;
  const column = zeroBasedIndex % 2;
  const row = Math.floor(zeroBasedIndex / 2);
  return {
    x: CARD_START_X + column * (CARD_WIDTH + CARD_GAP_X),
    y: CARD_START_Y + row * (CARD_HEIGHT + CARD_GAP_Y),
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  };
}

function getPrimaryResultButtonBounds(): Bounds {
  const panel = getPanelBounds();
  return {
    x: GAME_WIDTH / 2 - BUTTON_WIDTH / 2,
    y: panel.y + 244,
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
  };
}

function getSecondaryResultButtonBounds(): Bounds {
  const primary = getPrimaryResultButtonBounds();
  return {
    x: primary.x,
    y: primary.y + 60,
    width: primary.width,
    height: primary.height,
  };
}

function drawButton(ctx: CanvasRenderingContext2D, bounds: Bounds, label: string, accent: string, hovered: boolean): void {
  ctx.save();
  ctx.fillStyle = hovered ? accent : 'rgba(15, 23, 42, 0.92)';
  ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
  ctx.fillStyle = hovered ? '#020617' : '#f8fafc';
  ctx.textAlign = 'center';
  ctx.font = 'bold 18px "Microsoft YaHei", "Segoe UI", sans-serif';
  ctx.fillText(label, bounds.x + bounds.width / 2, bounds.y + 31);
  ctx.restore();
}

function drawTextLines(ctx: CanvasRenderingContext2D, centerX: number, startY: number, lines: string[]): void {
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = '16px "Microsoft YaHei", "Segoe UI", sans-serif';
  lines.forEach((line, index) => {
    ctx.fillStyle = index === 0 ? '#e2e8f0' : '#cbd5e1';
    ctx.fillText(line, centerX, startY + index * 28);
  });
  ctx.restore();
}

export function getMenuTargets(phase: GamePhase, progress: CampaignProgress): MenuTarget[] {
  if (phase === 'stageSelect') {
    return CAMPAIGN_STAGES.filter((stage) => stage.id <= progress.unlockedStageId).map((stage) => ({
      id: `stage-${stage.id}`,
      action: 'stage',
      stageId: stage.id,
      ...getStageCardBounds(stage.id),
    }));
  }

  if (phase === 'gameOver') {
    return [
      {
        id: 'retry',
        action: 'retry',
        ...getPrimaryResultButtonBounds(),
      },
      {
        id: 'back-select',
        action: 'back-select',
        ...getSecondaryResultButtonBounds(),
      },
    ];
  }

  if (phase === 'stageClear') {
    return [
      {
        id: 'back-select',
        action: 'back-select',
        ...getPrimaryResultButtonBounds(),
      },
    ];
  }

  return [];
}

function drawStageCard(
  ctx: CanvasRenderingContext2D,
  stageId: number,
  progress: CampaignProgress,
  selectedStageId: number,
  hoveredTargetId: string | null,
): void {
  const stage = CAMPAIGN_STAGES[stageId - 1];
  const bounds = getStageCardBounds(stageId);
  const unlocked = stageId <= progress.unlockedStageId;
  const hovered = hoveredTargetId === `stage-${stageId}`;
  const selected = selectedStageId === stageId;
  const record = getStageRecord(progress, stageId);

  ctx.save();
  ctx.fillStyle = unlocked ? (hovered || selected ? 'rgba(15, 23, 42, 0.95)' : 'rgba(2, 6, 23, 0.82)') : 'rgba(2, 6, 23, 0.56)';
  ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
  ctx.strokeStyle = unlocked ? (hovered || selected ? stage.highlight : stage.accent) : 'rgba(71, 85, 105, 0.55)';
  ctx.lineWidth = hovered || selected ? 2.5 : 1.5;
  ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);

  ctx.fillStyle = unlocked ? '#f8fafc' : '#64748b';
  ctx.textAlign = 'left';
  ctx.font = 'bold 18px "Microsoft YaHei", "Segoe UI", sans-serif';
  ctx.fillText(`第${stage.id}关`, bounds.x + 14, bounds.y + 26);

  ctx.font = 'bold 16px "Microsoft YaHei", "Segoe UI", sans-serif';
  ctx.fillStyle = unlocked ? (stage.isBossStage ? stage.highlight : '#e2e8f0') : '#64748b';
  ctx.fillText(stage.name, bounds.x + 14, bounds.y + 50);

  ctx.font = '12px "Microsoft YaHei", "Segoe UI", sans-serif';
  ctx.fillStyle = unlocked ? '#94a3b8' : '#475569';
  ctx.fillText(stage.isBossStage ? '头目关' : `${Math.round(stage.durationMs / 1000)}秒关卡`, bounds.x + 14, bounds.y + 71);

  ctx.textAlign = 'right';
  if (!unlocked) {
    ctx.fillStyle = '#64748b';
    ctx.fillText('未解锁', bounds.x + bounds.width - 14, bounds.y + 28);
  } else if (record.cleared) {
    ctx.fillStyle = stage.highlight;
    ctx.font = 'bold 22px "Microsoft YaHei", "Segoe UI", sans-serif';
    ctx.fillText(record.bestRank ?? 'D', bounds.x + bounds.width - 14, bounds.y + 30);
    ctx.font = '12px "Microsoft YaHei", "Segoe UI", sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(`最高 ${record.bestScore}`, bounds.x + bounds.width - 14, bounds.y + 70);
  } else {
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 12px "Microsoft YaHei", "Segoe UI", sans-serif';
    ctx.fillText('待突破', bounds.x + bounds.width - 14, bounds.y + 28);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`最高 ${record.bestScore}`, bounds.x + bounds.width - 14, bounds.y + 70);
  }

  ctx.restore();
}

export function renderStageSelectScreen(
  ctx: CanvasRenderingContext2D,
  progress: CampaignProgress,
  selectedStageId: number,
  hoveredTargetId: string | null,
): void {
  ctx.save();
  ctx.fillStyle = 'rgba(2, 6, 23, 0.66)';
  ctx.fillRect(22, 20, GAME_WIDTH - 44, GAME_HEIGHT - 40);
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
  ctx.strokeRect(22, 20, GAME_WIDTH - 44, GAME_HEIGHT - 40);

  ctx.fillStyle = '#f8fafc';
  ctx.textAlign = 'center';
  ctx.font = 'bold 34px "Microsoft YaHei", "Segoe UI", sans-serif';
  ctx.fillText('天际突围 战役', GAME_WIDTH / 2, HEADER_Y + 6);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '16px "Microsoft YaHei", "Segoe UI", sans-serif';
  ctx.fillText('选择已解锁关卡。第 3 / 5 / 10 关为头目战。', GAME_WIDTH / 2, HEADER_Y + 34);
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(`当前解锁 ${progress.unlockedStageId} / ${STAGE_COUNT}`, GAME_WIDTH / 2, HEADER_Y + 58);

  CAMPAIGN_STAGES.forEach((stage) => drawStageCard(ctx, stage.id, progress, selectedStageId, hoveredTargetId));

  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px "Microsoft YaHei", "Segoe UI", sans-serif';
  ctx.fillText('点击关卡开始挑战。失败后可重试，也可返回选关。', GAME_WIDTH / 2, GAME_HEIGHT - 36);
  ctx.restore();
}

export function renderStageIntroScreen(ctx: CanvasRenderingContext2D, state: GameState): void {
  const alpha = Math.min(0.88, state.stageIntroTimerMs / 900);

  ctx.save();
  ctx.fillStyle = `rgba(2, 6, 23, ${0.28 + alpha * 0.3})`;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  ctx.fillStyle = state.stage.highlight;
  ctx.fillRect(88, 280, GAME_WIDTH - 176, 4);
  ctx.fillRect(88, 522, GAME_WIDTH - 176, 4);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 18px "Microsoft YaHei", "Segoe UI", sans-serif';
  ctx.fillText(`第 ${state.stage.id} 关`, GAME_WIDTH / 2, 346);
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 42px "Microsoft YaHei", "Segoe UI", sans-serif';
  ctx.fillText(state.stage.name, GAME_WIDTH / 2, 404);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '16px "Microsoft YaHei", "Segoe UI", sans-serif';
  ctx.fillText(state.stage.subtitle, GAME_WIDTH / 2, 446);
  ctx.fillStyle = '#94a3b8';
  ctx.fillText(state.stage.isBossStage ? '中段后会触发头目战' : '撑过整段空域压制即可过关', GAME_WIDTH / 2, 480);
  ctx.restore();
}

export function renderResultScreen(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  stageBestScore: number,
  hoveredTargetId: string | null,
  cleared: boolean,
): void {
  const panel = getPanelBounds();
  const accent = cleared ? state.stage.highlight : '#fb7185';
  const title = cleared ? (state.stage.id === STAGE_COUNT ? '战役通关' : `第${state.stage.id}关突破`) : '挑战失败';

  ctx.save();
  ctx.fillStyle = 'rgba(2, 6, 23, 0.9)';
  ctx.fillRect(panel.x, panel.y, panel.width, panel.height);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.strokeRect(panel.x, panel.y, panel.width, panel.height);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 32px "Microsoft YaHei", "Segoe UI", sans-serif';
  ctx.fillText(title, GAME_WIDTH / 2, panel.y + 50);

  ctx.fillStyle = accent;
  ctx.font = 'bold 42px "Microsoft YaHei", "Segoe UI", sans-serif';
  ctx.fillText(state.resultRank, GAME_WIDTH / 2, panel.y + 108);
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '14px "Microsoft YaHei", "Segoe UI", sans-serif';
  ctx.fillText(`第${state.stage.id}关 · ${state.stage.name}`, GAME_WIDTH / 2, panel.y + 132);

  const lines = cleared
    ? [
        state.resultUnlockedStageId ? `已解锁第 ${state.resultUnlockedStageId} 关` : state.stage.id === STAGE_COUNT ? '10 关全部完成' : '关卡已全部解锁',
        `分数 ${state.score}   本关最高 ${stageBestScore}`,
        `击落 ${state.stats.kills}   擦弹 ${state.stats.grazes}`,
        state.resultIsNewRecord ? '刷新了本关最佳成绩' : '返回选关后手动进入下一关',
      ]
    : [
        '本次未能突破这段火力区。',
        `分数 ${state.score}   本关最高 ${stageBestScore}`,
        `击落 ${state.stats.kills}   擦弹 ${state.stats.grazes}`,
        `近身击落 ${state.stats.closeKills}   最长连杀 ${state.stats.longestCombo}`,
      ];

  drawTextLines(ctx, GAME_WIDTH / 2, panel.y + 164, lines);
  ctx.restore();

  const targets = getMenuTargets(cleared ? 'stageClear' : 'gameOver', { unlockedStageId: 1, stages: {} });
  const primary = targets[0];
  drawButton(ctx, primary, cleared ? '返回选关' : '重新挑战', accent, hoveredTargetId === primary.id);
  if (!cleared && targets[1]) {
    drawButton(ctx, targets[1], '返回选关', '#94a3b8', hoveredTargetId === targets[1].id);
  }
}
