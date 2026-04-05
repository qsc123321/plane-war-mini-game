import { ENEMY_TEMPLATES, GAME_WIDTH } from '../config';
import type { Enemy, EnemyKind } from '../types';

export function createEnemy(kind: EnemyKind, difficultyFactor: number): Enemy {
  const template = ENEMY_TEMPLATES[kind];
  const x = Math.random() * (GAME_WIDTH - template.width);
  const extraHp = Math.max(0, Math.floor((difficultyFactor - 1) * (kind === 'tank' || kind === 'ace' ? 2 : 1.2)));

  return {
    kind,
    x,
    y: -template.height - 8,
    width: template.width,
    height: template.height,
    speed: template.speed * (0.96 + Math.random() * 0.14) * difficultyFactor,
    hp: template.hp + extraHp,
    maxHp: template.hp + extraHp,
    score: Math.round(template.score * (1 + (difficultyFactor - 1) * 0.35)),
    color: template.color,
    vx: (Math.random() > 0.5 ? 1 : -1) * template.vx,
    fireTimer: template.fireInterval * (0.5 + Math.random() * 0.55),
    fireInterval: template.fireInterval / (1 + (difficultyFactor - 1) * 0.2),
    bulletSpeed: template.bulletSpeed * (1 + (difficultyFactor - 1) * 0.12),
    firePattern: template.pattern,
    elite: Boolean(template.elite),
    chargeValue: template.chargeValue + Math.max(0, Math.round((difficultyFactor - 1) * 2)),
    hitTimer: 0,
  };
}
