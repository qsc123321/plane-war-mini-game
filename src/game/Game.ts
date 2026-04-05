import { CAMPAIGN_STAGES, GAME_HEIGHT, GAME_WIDTH, STAR_COUNT } from './config';
import { applyStageResult, getStageById, getStageRecord, loadCampaignProgress, saveCampaignProgress } from './campaign';
import { createPlayer } from './entities/Player';
import { SoundManager } from './systems/audio';
import { renderGame } from './systems/render';
import { updateGame } from './systems/update';
import type { CampaignProgress, GamePhase, GameState, InputState, Star } from './types';
import { getMenuTargets, type MenuTarget } from './ui/Screens';

function createStars(): Star[] {
  return Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * GAME_WIDTH,
    y: Math.random() * GAME_HEIGHT,
    size: 1 + Math.random() * 2.4,
    speed: 40 + Math.random() * 150,
    alpha: 0.18 + Math.random() * 0.7,
  }));
}

function createState(phase: GamePhase, stageId: number): GameState {
  const stage = getStageById(stageId);
  return {
    phase,
    stage,
    stageIntroTimerMs: phase === 'stageIntro' ? 1150 : 0,
    timeMs: 0,
    score: 0,
    player: createPlayer(),
    enemies: [],
    playerBullets: [],
    enemyBullets: [],
    pickups: [],
    boss: null,
    bossAppeared: false,
    spawnTimer: stage.waves[0].spawnBaseMs,
    stars: createStars(),
    particles: [],
    announcement: phase === 'stageSelect' ? '' : stage.waves[0].label,
    announcementTimer: phase === 'playing' ? 850 : 0,
    screenFlashTimer: 0,
    screenFlashColor: '#f8fafc',
    cameraShakeTimer: 0,
    cameraShakeStrength: 0,
    waveLabel: stage.waves[0].label,
    waveIndex: 0,
    combo: 0,
    comboTimer: 0,
    stats: {
      kills: 0,
      closeKills: 0,
      grazes: 0,
      longestCombo: 0,
    },
    resultRank: 'D',
    resultUnlockedStageId: null,
    resultIsNewRecord: false,
    events: [],
  };
}

export class Game {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly input: InputState = {
    up: false,
    down: false,
    left: false,
    right: false,
    skillPressed: false,
  };

  private campaignProgress: CampaignProgress = loadCampaignProgress();
  private state: GameState = createState('stageSelect', this.campaignProgress.unlockedStageId);
  private readonly sound = new SoundManager();
  private animationFrameId = 0;
  private lastFrameTime = 0;
  private hoveredTargetId: string | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Unable to create 2D context.');
    }

    this.ctx = ctx;
    this.canvas.width = GAME_WIDTH;
    this.canvas.height = GAME_HEIGHT;
    this.canvas.style.cursor = 'default';
    this.bindEvents();
  }

  start(): void {
    this.render();
    this.animationFrameId = window.requestAnimationFrame(this.loop);
  }

  private readonly loop = (timestamp: number): void => {
    if (this.lastFrameTime === 0) {
      this.lastFrameTime = timestamp;
    }

    const deltaMs = Math.min(34, timestamp - this.lastFrameTime);
    this.lastFrameTime = timestamp;
    const previousPhase = this.state.phase;

    if (this.state.phase === 'playing') {
      updateGame(this.state, this.input, deltaMs);
    } else if (this.state.phase === 'stageIntro') {
      this.updateMenuBackground(deltaMs);
      this.state.stageIntroTimerMs = Math.max(0, this.state.stageIntroTimerMs - deltaMs);
      if (this.state.stageIntroTimerMs === 0) {
        this.state.phase = 'playing';
        this.state.announcement = this.state.stage.waves[0].label;
        this.state.announcementTimer = 850;
      }
    } else {
      this.updateMenuBackground(deltaMs);
    }

    this.flushAudioEvents();

    if (previousPhase === 'playing' && this.state.phase !== 'playing') {
      this.finishStageAttempt();
    }

    this.render();
    this.animationFrameId = window.requestAnimationFrame(this.loop);
  };

  private updateMenuBackground(deltaMs: number): void {
    for (const star of this.state.stars) {
      star.y += (star.speed * 0.32 * deltaMs) / 1000;
      if (star.y > GAME_HEIGHT) {
        star.y = -star.size;
        star.x = Math.random() * GAME_WIDTH;
      }
    }
  }

  private render(): void {
    renderGame(this.ctx, this.state, this.campaignProgress, this.getCurrentStageBestScore(), this.hoveredTargetId);
  }

  private getCurrentStageBestScore(): number {
    return getStageRecord(this.campaignProgress, this.state.stage.id).bestScore;
  }

  private beginStage(stageId: number): void {
    if (stageId > this.campaignProgress.unlockedStageId) {
      return;
    }

    this.sound.unlock();
    this.sound.play('ui-confirm');
    this.state = createState('stageIntro', stageId);
    this.input.skillPressed = false;
    this.lastFrameTime = 0;
    this.hoveredTargetId = null;
    this.canvas.style.cursor = 'default';
  }

  private openStageSelect(focusStageId = this.campaignProgress.unlockedStageId): void {
    this.state = createState('stageSelect', Math.min(focusStageId, this.campaignProgress.unlockedStageId));
    this.input.skillPressed = false;
    this.lastFrameTime = 0;
    this.hoveredTargetId = null;
    this.canvas.style.cursor = 'default';
  }

  private retryCurrentStage(): void {
    this.beginStage(this.state.stage.id);
  }

  private finishStageAttempt(): void {
    const result = applyStageResult(
      this.campaignProgress,
      this.state.stage,
      this.state.score,
      this.state.phase === 'stageClear',
    );

    this.campaignProgress = result.progress;
    saveCampaignProgress(this.campaignProgress);
    this.state.resultRank = result.rank;
    this.state.resultUnlockedStageId = result.unlockedStageId;
    this.state.resultIsNewRecord = result.isNewRecord;
  }

  private flushAudioEvents(): void {
    while (this.state.events.length > 0) {
      const event = this.state.events.shift();
      if (!event) {
        continue;
      }

      switch (event.type) {
        case 'player-shot':
          this.sound.play('player-shot');
          break;
        case 'graze':
          this.sound.play('graze');
          break;
        case 'enemy-down':
          this.sound.play(event.closeKill ? 'close-kill' : 'enemy-down');
          break;
        case 'pickup':
          this.sound.play('pickup');
          break;
        case 'shield-hit':
          this.sound.play('shield-hit');
          break;
        case 'player-hit':
          this.sound.play('player-hit');
          break;
        case 'overdrive':
          this.sound.play('overdrive');
          break;
        case 'boss-alert':
          this.sound.play('boss-alert');
          break;
        case 'stage-clear':
          this.sound.play('stage-clear');
          break;
        case 'boss-defeated':
          this.sound.play('boss-defeated');
          break;
        case 'game-over':
          this.sound.play('game-over');
          break;
      }
    }
  }

  private getCanvasPoint(clientX: number, clientY: number): { x: number; y: number } {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left) * (this.canvas.width / rect.width),
      y: (clientY - rect.top) * (this.canvas.height / rect.height),
    };
  }

  private getMenuTargetAt(clientX: number, clientY: number): MenuTarget | null {
    const point = this.getCanvasPoint(clientX, clientY);
    return (
      getMenuTargets(this.state.phase, this.campaignProgress).find(
        (target) =>
          point.x >= target.x &&
          point.x <= target.x + target.width &&
          point.y >= target.y &&
          point.y <= target.y + target.height,
      ) ?? null
    );
  }

  private updateMenuHover(clientX: number, clientY: number): void {
    const target = this.getMenuTargetAt(clientX, clientY);
    this.hoveredTargetId = target?.id ?? null;

    if (this.state.phase === 'stageSelect' && target?.action === 'stage' && target.stageId && this.state.stage.id !== target.stageId) {
      this.state.stage = getStageById(target.stageId);
    }

    this.canvas.style.cursor = target ? 'pointer' : 'default';
  }

  private handleMenuTarget(target: MenuTarget): void {
    switch (target.action) {
      case 'stage':
        if (target.stageId) {
          this.beginStage(target.stageId);
        }
        break;
      case 'retry':
        this.retryCurrentStage();
        break;
      case 'back-select':
        this.sound.unlock();
        this.sound.play('ui-confirm');
        this.openStageSelect(this.state.resultUnlockedStageId ?? Math.min(this.campaignProgress.unlockedStageId, this.state.stage.id + 1));
        break;
    }
  }

  private handleEnterAction(): void {
    if (this.state.phase === 'stageSelect') {
      this.beginStage(this.state.stage.id);
      return;
    }

    if (this.state.phase === 'gameOver') {
      this.retryCurrentStage();
      return;
    }

    if (this.state.phase === 'stageClear') {
      this.sound.unlock();
      this.sound.play('ui-confirm');
      this.openStageSelect(this.state.resultUnlockedStageId ?? Math.min(this.campaignProgress.unlockedStageId, this.state.stage.id + 1));
    }
  }

  private bindEvents(): void {
    window.addEventListener('keydown', (event) => {
      const key = event.key.toLowerCase();
      this.sound.unlock();

      if (key === 'enter') {
        event.preventDefault();
        this.handleEnterAction();
        return;
      }

      if (key === ' ' || key === 'spacebar') {
        event.preventDefault();
        this.input.skillPressed = true;
        return;
      }

      if (key === 'arrowup' || key === 'w') {
        event.preventDefault();
        this.input.up = true;
      } else if (key === 'arrowdown' || key === 's') {
        event.preventDefault();
        this.input.down = true;
      } else if (key === 'arrowleft' || key === 'a') {
        event.preventDefault();
        this.input.left = true;
      } else if (key === 'arrowright' || key === 'd') {
        event.preventDefault();
        this.input.right = true;
      }
    });

    window.addEventListener('keyup', (event) => {
      const key = event.key.toLowerCase();

      if (key === ' ' || key === 'spacebar') {
        this.input.skillPressed = false;
        return;
      }

      if (key === 'arrowup' || key === 'w') {
        this.input.up = false;
      } else if (key === 'arrowdown' || key === 's') {
        this.input.down = false;
      } else if (key === 'arrowleft' || key === 'a') {
        this.input.left = false;
      } else if (key === 'arrowright' || key === 'd') {
        this.input.right = false;
      }
    });

    this.canvas.addEventListener('pointermove', (event) => {
      if (this.state.phase === 'playing' || this.state.phase === 'stageIntro') {
        if (this.hoveredTargetId) {
          this.hoveredTargetId = null;
        }
        this.canvas.style.cursor = 'default';
        return;
      }

      this.updateMenuHover(event.clientX, event.clientY);
    });

    this.canvas.addEventListener('pointerdown', (event) => {
      this.sound.unlock();
      if (this.state.phase === 'playing' || this.state.phase === 'stageIntro') {
        return;
      }

      const target = this.getMenuTargetAt(event.clientX, event.clientY);
      if (!target) {
        return;
      }

      event.preventDefault();
      this.handleMenuTarget(target);
    });

    this.canvas.addEventListener('pointerleave', () => {
      this.hoveredTargetId = null;
      this.canvas.style.cursor = 'default';
    });

    window.addEventListener('blur', () => {
      this.input.up = false;
      this.input.down = false;
      this.input.left = false;
      this.input.right = false;
      this.input.skillPressed = false;
      this.hoveredTargetId = null;
      this.canvas.style.cursor = 'default';
    });
  }

  destroy(): void {
    window.cancelAnimationFrame(this.animationFrameId);
  }
}
