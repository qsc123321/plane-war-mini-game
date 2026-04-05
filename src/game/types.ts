export type GamePhase = 'stageSelect' | 'stageIntro' | 'playing' | 'gameOver' | 'stageClear';
export type EnemyKind = 'normal' | 'fast' | 'tank' | 'ace';
export type EnemyAttackPattern = 'aimed' | 'spread' | 'burst' | 'spray';
export type BossPattern = 'fan' | 'hunt';
export type PickupType = 'rapid' | 'spread' | 'shield';
export type ParticleShape = 'spark' | 'ring';
export type Rank = 'S' | 'A' | 'B' | 'C' | 'D';

export interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  skillPressed: boolean;
}

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  hp: number;
  maxHp: number;
  fireTimer: number;
  baseFireInterval: number;
  rapidFireTimer: number;
  spreadTimer: number;
  shieldTimer: number;
  invulnerableTimer: number;
  overdriveCharge: number;
  overdriveTimer: number;
}

export interface Enemy {
  kind: EnemyKind;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  hp: number;
  maxHp: number;
  score: number;
  color: string;
  vx: number;
  fireTimer: number;
  fireInterval: number;
  bulletSpeed: number;
  firePattern: EnemyAttackPattern;
  elite: boolean;
  chargeValue: number;
  hitTimer: number;
}

export interface Boss {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  direction: number;
  hp: number;
  maxHp: number;
  fireTimer: number;
  fireIntervalMs: number;
  bulletSpeed: number;
  entering: boolean;
  hitTimer: number;
  score: number;
  label: string;
  pattern: BossPattern;
  patternTimer: number;
  patternSwitchMs: number;
  accent: string;
  warningColor: string;
}

export interface Bullet {
  from: 'player' | 'enemy';
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  damage: number;
  color: string;
  grazed: boolean;
}

export interface Pickup {
  type: PickupType;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  color: string;
  label: string;
}

export interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  alpha: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  color: string;
  shape: ParticleShape;
}

export interface RunStats {
  kills: number;
  closeKills: number;
  grazes: number;
  longestCombo: number;
}

export interface StageWaveProfile {
  untilRatio: number;
  label: string;
  spawnBaseMs: number;
  spawnMinMs: number;
  difficulty: number;
  multiSpawnChance: number;
  weights: Record<EnemyKind, number>;
}

export interface BossStageConfig {
  label: string;
  hp: number;
  fireIntervalMs: number;
  bulletSpeed: number;
  score: number;
  speed: number;
  patternSwitchMs: number;
  accent: string;
  warningColor: string;
}

export interface StageConfig {
  id: number;
  name: string;
  subtitle: string;
  durationMs: number;
  isBossStage: boolean;
  bossSpawnMs?: number;
  accent: string;
  highlight: string;
  skyTop: string;
  skyMid: string;
  skyBottom: string;
  clearAnnouncement: string;
  rankThresholds: {
    S: number;
    A: number;
    B: number;
    C: number;
  };
  waves: StageWaveProfile[];
  boss?: BossStageConfig;
}

export interface StageRecord {
  bestScore: number;
  cleared: boolean;
  bestRank: Rank | null;
}

export interface CampaignProgress {
  unlockedStageId: number;
  stages: Record<number, StageRecord>;
}

export type GameEvent =
  | { type: 'player-shot' }
  | { type: 'graze' }
  | { type: 'enemy-down'; closeKill: boolean; elite: boolean }
  | { type: 'pickup'; pickupType: PickupType }
  | { type: 'shield-hit' }
  | { type: 'player-hit' }
  | { type: 'overdrive' }
  | { type: 'boss-alert' }
  | { type: 'stage-clear'; finalStage: boolean }
  | { type: 'boss-defeated'; finalStage: boolean }
  | { type: 'game-over' };

export interface GameState {
  phase: GamePhase;
  stage: StageConfig;
  stageIntroTimerMs: number;
  timeMs: number;
  score: number;
  player: Player;
  enemies: Enemy[];
  playerBullets: Bullet[];
  enemyBullets: Bullet[];
  pickups: Pickup[];
  boss: Boss | null;
  bossAppeared: boolean;
  spawnTimer: number;
  stars: Star[];
  particles: Particle[];
  announcement: string;
  announcementTimer: number;
  screenFlashTimer: number;
  screenFlashColor: string;
  cameraShakeTimer: number;
  cameraShakeStrength: number;
  waveLabel: string;
  waveIndex: number;
  combo: number;
  comboTimer: number;
  stats: RunStats;
  resultRank: Rank;
  resultUnlockedStageId: number | null;
  resultIsNewRecord: boolean;
  events: GameEvent[];
}
