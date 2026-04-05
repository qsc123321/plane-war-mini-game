import { BOSS_HEIGHT, BOSS_WIDTH, GAME_WIDTH } from '../config';
import type { Boss, BossStageConfig } from '../types';

export function createBoss(config: BossStageConfig): Boss {
  return {
    x: GAME_WIDTH / 2 - BOSS_WIDTH / 2,
    y: -BOSS_HEIGHT - 24,
    width: BOSS_WIDTH,
    height: BOSS_HEIGHT,
    speed: config.speed,
    direction: 1,
    hp: config.hp,
    maxHp: config.hp,
    fireTimer: 0,
    fireIntervalMs: config.fireIntervalMs,
    bulletSpeed: config.bulletSpeed,
    entering: true,
    hitTimer: 0,
    score: config.score,
    label: config.label,
    pattern: 'fan',
    patternTimer: config.patternSwitchMs,
    patternSwitchMs: config.patternSwitchMs,
    accent: config.accent,
    warningColor: config.warningColor,
  };
}
