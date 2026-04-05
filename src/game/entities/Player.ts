import {
  GAME_HEIGHT,
  GAME_WIDTH,
  PLAYER_FIRE_INTERVAL,
  PLAYER_HEIGHT,
  PLAYER_MAX_HP,
  PLAYER_SPEED,
  PLAYER_WIDTH,
} from '../config';
import type { Player } from '../types';

export function createPlayer(): Player {
  return {
    x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2,
    y: GAME_HEIGHT - PLAYER_HEIGHT - 36,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    speed: PLAYER_SPEED,
    hp: PLAYER_MAX_HP,
    maxHp: PLAYER_MAX_HP,
    fireTimer: 0,
    baseFireInterval: PLAYER_FIRE_INTERVAL,
    rapidFireTimer: 0,
    spreadTimer: 0,
    shieldTimer: 0,
    invulnerableTimer: 0,
    overdriveCharge: 0,
    overdriveTimer: 0,
  };
}
