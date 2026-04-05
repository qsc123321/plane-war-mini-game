import { COMBO_WINDOW_MS, OVERDRIVE_MAX_CHARGE } from '../config';
import type { GameState } from '../types';

export function addOverdriveCharge(state: GameState, amount: number): void {
  const before = state.player.overdriveCharge;
  state.player.overdriveCharge = Math.min(OVERDRIVE_MAX_CHARGE, state.player.overdriveCharge + amount);

  if (before < OVERDRIVE_MAX_CHARGE && state.player.overdriveCharge >= OVERDRIVE_MAX_CHARGE) {
    state.announcement = '爆发已就绪';
    state.announcementTimer = Math.max(state.announcementTimer, 900);
  }
}

export function addCombo(state: GameState, amount = 1, bonusWindowMs = 0): void {
  state.combo += amount;
  state.comboTimer = COMBO_WINDOW_MS + bonusWindowMs + Math.min(900, state.combo * 55);
  state.stats.longestCombo = Math.max(state.stats.longestCombo, state.combo);
}

export function breakCombo(state: GameState): void {
  state.combo = 0;
  state.comboTimer = 0;
}

