import { PICKUP_COLORS, PICKUP_LABELS } from '../config';
import type { Pickup, PickupType } from '../types';

export function createPickup(type: PickupType, x: number, y: number): Pickup {
  return {
    type,
    x,
    y,
    width: 22,
    height: 22,
    speed: 135,
    color: PICKUP_COLORS[type],
    label: PICKUP_LABELS[type],
  };
}
