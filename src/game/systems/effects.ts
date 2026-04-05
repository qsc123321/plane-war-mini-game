import type { GameState } from '../types';

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function addShake(state: GameState, durationMs: number, strength: number): void {
  state.cameraShakeTimer = Math.max(state.cameraShakeTimer, durationMs);
  state.cameraShakeStrength = Math.max(state.cameraShakeStrength, strength);
}

export function addFlash(state: GameState, color: string, durationMs: number): void {
  state.screenFlashColor = color;
  state.screenFlashTimer = Math.max(state.screenFlashTimer, durationMs);
}

export function pushSparkBurst(
  state: GameState,
  x: number,
  y: number,
  color: string,
  count: number,
  speed = 260,
  size = 3,
): void {
  for (let index = 0; index < count; index += 1) {
    const angle = Math.random() * Math.PI * 2;
    const velocity = randomBetween(speed * 0.35, speed);
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * velocity,
      vy: Math.sin(angle) * velocity,
      size: randomBetween(size * 0.65, size * 1.4),
      life: randomBetween(180, 380),
      maxLife: 380,
      color,
      shape: 'spark',
    });
  }
}

export function pushRing(state: GameState, x: number, y: number, color: string, size = 26, life = 240): void {
  state.particles.push({
    x,
    y,
    vx: 0,
    vy: 0,
    size,
    life,
    maxLife: life,
    color,
    shape: 'ring',
  });
}
