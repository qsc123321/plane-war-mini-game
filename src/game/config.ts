import type { EnemyAttackPattern, EnemyKind, PickupType, StageConfig, StageWaveProfile } from './types';

export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 800;
export const STAR_COUNT = 90;
export const STAGE_COUNT = 10;

export const PLAYER_WIDTH = 36;
export const PLAYER_HEIGHT = 48;
export const PLAYER_SPEED = 372;
export const PLAYER_MAX_HP = 4;
export const PLAYER_FIRE_INTERVAL = 150;
export const PLAYER_RAPID_FIRE_INTERVAL = 108;
export const PLAYER_OVERDRIVE_FIRE_INTERVAL = 72;
export const PLAYER_INVULNERABLE_MS = 860;

export const PICKUP_EFFECT_MS = 6800;
export const SHIELD_EFFECT_MS = 5600;
export const PICKUP_DROP_CHANCE = 0.12;

export const OVERDRIVE_MAX_CHARGE = 100;
export const OVERDRIVE_DURATION_MS = 3800;
export const OVERDRIVE_ACTIVATION_CLEAR_RADIUS = 144;
export const OVERDRIVE_KILL_CLEAR_RADIUS = 108;

export const COMBO_WINDOW_MS = 1800;
export const GRAZE_RADIUS = 54;
export const GRAZE_CHARGE = 6;
export const GRAZE_SCORE = 12;
export const KILL_CHARGE = 8;
export const CLOSE_KILL_CHARGE = 14;
export const CLOSE_KILL_DISTANCE = 116;
export const CLOSE_KILL_SCORE_BONUS = 70;

export const PICKUP_POOL: PickupType[] = ['rapid', 'spread', 'shield'];

export const PICKUP_LABELS: Record<PickupType, string> = {
  rapid: '疾射',
  spread: '扩散',
  shield: '护盾',
};

export const PICKUP_COLORS: Record<PickupType, string> = {
  rapid: '#38bdf8',
  spread: '#f59e0b',
  shield: '#a855f7',
};

export const BOSS_WIDTH = 144;
export const BOSS_HEIGHT = 100;

function wave(
  untilRatio: number,
  label: string,
  spawnBaseMs: number,
  spawnMinMs: number,
  difficulty: number,
  multiSpawnChance: number,
  weights: Record<EnemyKind, number>,
): StageWaveProfile {
  return { untilRatio, label, spawnBaseMs, spawnMinMs, difficulty, multiSpawnChance, weights };
}

type EnemyTemplate = {
  width: number;
  height: number;
  speed: number;
  hp: number;
  score: number;
  color: string;
  vx: number;
  fireInterval: number;
  bulletSpeed: number;
  pattern: EnemyAttackPattern;
  chargeValue: number;
  elite?: boolean;
};

export const ENEMY_TEMPLATES: Record<EnemyKind, EnemyTemplate> = {
  normal: {
    width: 32,
    height: 32,
    speed: 165,
    hp: 2,
    score: 105,
    color: '#fb7185',
    vx: 56,
    fireInterval: 1380,
    bulletSpeed: 265,
    pattern: 'aimed',
    chargeValue: 7,
  },
  fast: {
    width: 28,
    height: 28,
    speed: 255,
    hp: 1,
    score: 138,
    color: '#fbbf24',
    vx: 118,
    fireInterval: 1220,
    bulletSpeed: 320,
    pattern: 'spray',
    chargeValue: 6,
  },
  tank: {
    width: 46,
    height: 42,
    speed: 125,
    hp: 5,
    score: 225,
    color: '#34d399',
    vx: 36,
    fireInterval: 1680,
    bulletSpeed: 240,
    pattern: 'spread',
    chargeValue: 10,
  },
  ace: {
    width: 40,
    height: 38,
    speed: 195,
    hp: 4,
    score: 280,
    color: '#a78bfa',
    vx: 140,
    fireInterval: 930,
    bulletSpeed: 335,
    pattern: 'burst',
    chargeValue: 15,
    elite: true,
  },
};

export const CAMPAIGN_STAGES: StageConfig[] = [
  {
    id: 1,
    name: '前沿试探',
    subtitle: '第一波侦察机进入低空通道。',
    durationMs: 95000,
    isBossStage: false,
    accent: '#38bdf8',
    highlight: '#7dd3fc',
    skyTop: '#031728',
    skyMid: '#071a31',
    skyBottom: '#020617',
    clearAnnouncement: '第一关突破',
    rankThresholds: { S: 14000, A: 10800, B: 7800, C: 5000 },
    waves: [
      wave(0.28, '侦察压进', 820, 500, 1.0, 0.08, { normal: 0.72, fast: 0.24, tank: 0.04, ace: 0 }),
      wave(0.55, '低空夹击', 740, 430, 1.1, 0.12, { normal: 0.56, fast: 0.3, tank: 0.1, ace: 0.04 }),
      wave(0.82, '火线升温', 660, 380, 1.2, 0.18, { normal: 0.44, fast: 0.34, tank: 0.14, ace: 0.08 }),
      wave(1, '收束冲刺', 600, 330, 1.28, 0.22, { normal: 0.38, fast: 0.34, tank: 0.16, ace: 0.12 }),
    ],
  },
  {
    id: 2,
    name: '交叉火网',
    subtitle: '侧翼机群开始封锁横向走位。',
    durationMs: 98000,
    isBossStage: false,
    accent: '#22d3ee',
    highlight: '#67e8f9',
    skyTop: '#042033',
    skyMid: '#08233a',
    skyBottom: '#020617',
    clearAnnouncement: '第二关突破',
    rankThresholds: { S: 17500, A: 13600, B: 9800, C: 6200 },
    waves: [
      wave(0.24, '横向试压', 780, 470, 1.08, 0.1, { normal: 0.5, fast: 0.4, tank: 0.07, ace: 0.03 }),
      wave(0.52, '斜线锁头', 690, 390, 1.18, 0.18, { normal: 0.38, fast: 0.4, tank: 0.14, ace: 0.08 }),
      wave(0.8, '双翼挤压', 610, 320, 1.3, 0.24, { normal: 0.32, fast: 0.38, tank: 0.16, ace: 0.14 }),
      wave(1, '火网闭合', 560, 280, 1.36, 0.28, { normal: 0.28, fast: 0.36, tank: 0.18, ace: 0.18 }),
    ],
  },
  {
    id: 3,
    name: '头目拦截',
    subtitle: '第一台拦截舰会在中段后强行切入。',
    durationMs: 100000,
    isBossStage: true,
    bossSpawnMs: 58000,
    accent: '#fb7185',
    highlight: '#fda4af',
    skyTop: '#220814',
    skyMid: '#2b0b19',
    skyBottom: '#09040b',
    clearAnnouncement: '第三关突破',
    rankThresholds: { S: 23000, A: 18500, B: 13800, C: 9000 },
    waves: [
      wave(0.24, '诱导机群', 730, 430, 1.2, 0.14, { normal: 0.46, fast: 0.36, tank: 0.1, ace: 0.08 }),
      wave(0.5, '护航压迫', 640, 340, 1.34, 0.22, { normal: 0.34, fast: 0.36, tank: 0.16, ace: 0.14 }),
      wave(1, '头目警报', 580, 300, 1.42, 0.28, { normal: 0.28, fast: 0.34, tank: 0.18, ace: 0.2 }),
    ],
    boss: {
      label: '拦截舰·赤锋',
      hp: 185,
      fireIntervalMs: 760,
      bulletSpeed: 300,
      score: 3600,
      speed: 118,
      patternSwitchMs: 2100,
      accent: '#fb7185',
      warningColor: '#fecdd3',
    },
  },
  {
    id: 4,
    name: '灼热突防',
    subtitle: '精英敌机开始加入火线。',
    durationMs: 102000,
    isBossStage: false,
    accent: '#f97316',
    highlight: '#fdba74',
    skyTop: '#271006',
    skyMid: '#2f1407',
    skyBottom: '#080403',
    clearAnnouncement: '第四关突破',
    rankThresholds: { S: 25500, A: 20500, B: 15600, C: 10200 },
    waves: [
      wave(0.22, '热浪推进', 700, 400, 1.28, 0.16, { normal: 0.36, fast: 0.38, tank: 0.14, ace: 0.12 }),
      wave(0.48, '精英切入', 620, 330, 1.42, 0.24, { normal: 0.28, fast: 0.34, tank: 0.18, ace: 0.2 }),
      wave(0.78, '重甲压线', 560, 280, 1.52, 0.3, { normal: 0.24, fast: 0.32, tank: 0.22, ace: 0.22 }),
      wave(1, '尾段反扑', 510, 250, 1.58, 0.34, { normal: 0.22, fast: 0.3, tank: 0.22, ace: 0.26 }),
    ],
  },
  {
    id: 5,
    name: '双相压制',
    subtitle: '第二台头目会更快切换火力模式。',
    durationMs: 105000,
    isBossStage: true,
    bossSpawnMs: 60000,
    accent: '#a78bfa',
    highlight: '#c4b5fd',
    skyTop: '#170d2f',
    skyMid: '#201240',
    skyBottom: '#08050f',
    clearAnnouncement: '第五关突破',
    rankThresholds: { S: 30000, A: 24200, B: 18200, C: 11800 },
    waves: [
      wave(0.24, '诱饵编队', 670, 370, 1.38, 0.2, { normal: 0.28, fast: 0.34, tank: 0.18, ace: 0.2 }),
      wave(0.5, '护航拧压', 580, 300, 1.5, 0.28, { normal: 0.22, fast: 0.32, tank: 0.2, ace: 0.26 }),
      wave(1, '双相警戒', 520, 260, 1.58, 0.34, { normal: 0.2, fast: 0.3, tank: 0.22, ace: 0.28 }),
    ],
    boss: {
      label: '压制舰·紫曜',
      hp: 245,
      fireIntervalMs: 690,
      bulletSpeed: 330,
      score: 4300,
      speed: 126,
      patternSwitchMs: 1800,
      accent: '#a78bfa',
      warningColor: '#e9d5ff',
    },
  },
  {
    id: 6,
    name: '擦弹之谷',
    subtitle: '弹幕密度陡增，必须主动找擦弹线。',
    durationMs: 108000,
    isBossStage: false,
    accent: '#14b8a6',
    highlight: '#5eead4',
    skyTop: '#062322',
    skyMid: '#082c2c',
    skyBottom: '#03100f',
    clearAnnouncement: '第六关突破',
    rankThresholds: { S: 33000, A: 26600, B: 20200, C: 13000 },
    waves: [
      wave(0.22, '织线压迫', 620, 330, 1.46, 0.24, { normal: 0.24, fast: 0.32, tank: 0.2, ace: 0.24 }),
      wave(0.5, '贴边穿梭', 560, 280, 1.58, 0.32, { normal: 0.2, fast: 0.32, tank: 0.22, ace: 0.26 }),
      wave(0.78, '交叠弹路', 510, 250, 1.68, 0.36, { normal: 0.18, fast: 0.3, tank: 0.24, ace: 0.28 }),
      wave(1, '残压追咬', 470, 230, 1.74, 0.42, { normal: 0.16, fast: 0.28, tank: 0.24, ace: 0.32 }),
    ],
  },
  {
    id: 7,
    name: '重装封锁',
    subtitle: '厚甲敌机会强行压缩你的走位空间。',
    durationMs: 110000,
    isBossStage: false,
    accent: '#34d399',
    highlight: '#86efac',
    skyTop: '#072116',
    skyMid: '#0a2a1d',
    skyBottom: '#030d08',
    clearAnnouncement: '第七关突破',
    rankThresholds: { S: 36000, A: 29000, B: 22000, C: 14200 },
    waves: [
      wave(0.2, '重装前压', 610, 340, 1.52, 0.22, { normal: 0.18, fast: 0.26, tank: 0.32, ace: 0.24 }),
      wave(0.48, '厚甲并行', 540, 280, 1.64, 0.3, { normal: 0.16, fast: 0.24, tank: 0.34, ace: 0.26 }),
      wave(0.78, '封锁走廊', 490, 240, 1.74, 0.38, { normal: 0.14, fast: 0.24, tank: 0.34, ace: 0.28 }),
      wave(1, '残酷碾压', 450, 220, 1.8, 0.44, { normal: 0.12, fast: 0.22, tank: 0.34, ace: 0.32 }),
    ],
  },
  {
    id: 8,
    name: '混编风暴',
    subtitle: '快机、精英与重装会连续混编登场。',
    durationMs: 112000,
    isBossStage: false,
    accent: '#f59e0b',
    highlight: '#fcd34d',
    skyTop: '#251605',
    skyMid: '#301b06',
    skyBottom: '#0a0602',
    clearAnnouncement: '第八关突破',
    rankThresholds: { S: 39500, A: 31800, B: 24000, C: 15500 },
    waves: [
      wave(0.2, '混编试锋', 580, 310, 1.6, 0.26, { normal: 0.16, fast: 0.3, tank: 0.22, ace: 0.32 }),
      wave(0.46, '快机穿刺', 520, 270, 1.72, 0.34, { normal: 0.12, fast: 0.32, tank: 0.22, ace: 0.34 }),
      wave(0.76, '精英叠火', 470, 230, 1.82, 0.42, { normal: 0.1, fast: 0.28, tank: 0.24, ace: 0.38 }),
      wave(1, '暴雨清场', 430, 210, 1.9, 0.48, { normal: 0.08, fast: 0.26, tank: 0.24, ace: 0.42 }),
    ],
  },
  {
    id: 9,
    name: '终幕前夜',
    subtitle: '最后的清场关，强度接近最终战。',
    durationMs: 115000,
    isBossStage: false,
    accent: '#ef4444',
    highlight: '#fca5a5',
    skyTop: '#2a080b',
    skyMid: '#340b10',
    skyBottom: '#090204',
    clearAnnouncement: '第九关突破',
    rankThresholds: { S: 44000, A: 35000, B: 26500, C: 17000 },
    waves: [
      wave(0.18, '战前试压', 560, 290, 1.66, 0.3, { normal: 0.14, fast: 0.26, tank: 0.24, ace: 0.36 }),
      wave(0.44, '火力拉满', 500, 250, 1.78, 0.38, { normal: 0.1, fast: 0.26, tank: 0.24, ace: 0.4 }),
      wave(0.74, '压轴封锁', 450, 220, 1.9, 0.46, { normal: 0.08, fast: 0.24, tank: 0.26, ace: 0.42 }),
      wave(1, '最终预热', 420, 200, 1.98, 0.52, { normal: 0.06, fast: 0.24, tank: 0.26, ace: 0.44 }),
    ],
  },
  {
    id: 10,
    name: '终焉母舰',
    subtitle: '最终头目拥有更长血条和更密的压迫节奏。',
    durationMs: 118000,
    isBossStage: true,
    bossSpawnMs: 62000,
    accent: '#f43f5e',
    highlight: '#fda4af',
    skyTop: '#250511',
    skyMid: '#300818',
    skyBottom: '#090108',
    clearAnnouncement: '战役通关',
    rankThresholds: { S: 52000, A: 41000, B: 30500, C: 19500 },
    waves: [
      wave(0.22, '母舰护航', 540, 280, 1.78, 0.34, { normal: 0.1, fast: 0.24, tank: 0.24, ace: 0.42 }),
      wave(0.5, '终幕撕咬', 470, 230, 1.92, 0.44, { normal: 0.08, fast: 0.22, tank: 0.24, ace: 0.46 }),
      wave(1, '终焉警报', 420, 200, 2.02, 0.52, { normal: 0.06, fast: 0.2, tank: 0.24, ace: 0.5 }),
    ],
    boss: {
      label: '终焉母舰·黑潮',
      hp: 340,
      fireIntervalMs: 620,
      bulletSpeed: 352,
      score: 6200,
      speed: 132,
      patternSwitchMs: 1600,
      accent: '#f43f5e',
      warningColor: '#ffe4e6',
    },
  },
];
