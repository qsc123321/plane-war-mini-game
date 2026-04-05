import type { Bullet } from '../types';

export function createPlayerBullet(x: number, y: number, vx = 0, damage = 1, overdrive = false): Bullet {
  return {
    from: 'player',
    x,
    y,
    width: overdrive ? 10 : 6,
    height: overdrive ? 24 : 16,
    vx,
    vy: overdrive ? -620 : -540,
    damage,
    color: overdrive ? '#facc15' : '#f8fafc',
    grazed: false,
  };
}

export function createEnemyBullet(x: number, y: number, vx: number, vy: number, color = '#fb7185', damage = 1): Bullet {
  return {
    from: 'enemy',
    x,
    y,
    width: 8,
    height: 18,
    vx,
    vy,
    damage,
    color,
    grazed: false,
  };
}
