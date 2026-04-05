var x = Object.defineProperty;
var ee = (e, i, n) => i in e ? x(e, i, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[i] = n;
var c = (e, i, n) => ee(e, typeof i != "symbol" ? i + "" : i, n);
const H = ["rapid", "spread", "shield"], ie = {
  rapid: "疾射",
  spread: "扩散",
  shield: "护盾"
}, ne = {
  rapid: "#38bdf8",
  spread: "#f59e0b",
  shield: "#a855f7"
}, C = 144, G = 100;
function l(e, i, n, r, t, o, a) {
  return { untilRatio: e, label: i, spawnBaseMs: n, spawnMinMs: r, difficulty: t, multiSpawnChance: o, weights: a };
}
const re = {
  normal: {
    width: 32,
    height: 32,
    speed: 165,
    hp: 2,
    score: 105,
    color: "#fb7185",
    vx: 56,
    fireInterval: 1380,
    bulletSpeed: 265,
    pattern: "aimed",
    chargeValue: 7
  },
  fast: {
    width: 28,
    height: 28,
    speed: 255,
    hp: 1,
    score: 138,
    color: "#fbbf24",
    vx: 118,
    fireInterval: 1220,
    bulletSpeed: 320,
    pattern: "spray",
    chargeValue: 6
  },
  tank: {
    width: 46,
    height: 42,
    speed: 125,
    hp: 5,
    score: 225,
    color: "#34d399",
    vx: 36,
    fireInterval: 1680,
    bulletSpeed: 240,
    pattern: "spread",
    chargeValue: 10
  },
  ace: {
    width: 40,
    height: 38,
    speed: 195,
    hp: 4,
    score: 280,
    color: "#a78bfa",
    vx: 140,
    fireInterval: 930,
    bulletSpeed: 335,
    pattern: "burst",
    chargeValue: 15,
    elite: !0
  }
}, E = [
  {
    id: 1,
    name: "前沿试探",
    subtitle: "第一波侦察机进入低空通道。",
    durationMs: 95e3,
    isBossStage: !1,
    accent: "#38bdf8",
    highlight: "#7dd3fc",
    skyTop: "#031728",
    skyMid: "#071a31",
    skyBottom: "#020617",
    clearAnnouncement: "第一关突破",
    rankThresholds: { S: 14e3, A: 10800, B: 7800, C: 5e3 },
    waves: [
      l(0.28, "侦察压进", 820, 500, 1, 0.08, { normal: 0.72, fast: 0.24, tank: 0.04, ace: 0 }),
      l(0.55, "低空夹击", 740, 430, 1.1, 0.12, { normal: 0.56, fast: 0.3, tank: 0.1, ace: 0.04 }),
      l(0.82, "火线升温", 660, 380, 1.2, 0.18, { normal: 0.44, fast: 0.34, tank: 0.14, ace: 0.08 }),
      l(1, "收束冲刺", 600, 330, 1.28, 0.22, { normal: 0.38, fast: 0.34, tank: 0.16, ace: 0.12 })
    ]
  },
  {
    id: 2,
    name: "交叉火网",
    subtitle: "侧翼机群开始封锁横向走位。",
    durationMs: 98e3,
    isBossStage: !1,
    accent: "#22d3ee",
    highlight: "#67e8f9",
    skyTop: "#042033",
    skyMid: "#08233a",
    skyBottom: "#020617",
    clearAnnouncement: "第二关突破",
    rankThresholds: { S: 17500, A: 13600, B: 9800, C: 6200 },
    waves: [
      l(0.24, "横向试压", 780, 470, 1.08, 0.1, { normal: 0.5, fast: 0.4, tank: 0.07, ace: 0.03 }),
      l(0.52, "斜线锁头", 690, 390, 1.18, 0.18, { normal: 0.38, fast: 0.4, tank: 0.14, ace: 0.08 }),
      l(0.8, "双翼挤压", 610, 320, 1.3, 0.24, { normal: 0.32, fast: 0.38, tank: 0.16, ace: 0.14 }),
      l(1, "火网闭合", 560, 280, 1.36, 0.28, { normal: 0.28, fast: 0.36, tank: 0.18, ace: 0.18 })
    ]
  },
  {
    id: 3,
    name: "头目拦截",
    subtitle: "第一台拦截舰会在中段后强行切入。",
    durationMs: 1e5,
    isBossStage: !0,
    bossSpawnMs: 58e3,
    accent: "#fb7185",
    highlight: "#fda4af",
    skyTop: "#220814",
    skyMid: "#2b0b19",
    skyBottom: "#09040b",
    clearAnnouncement: "第三关突破",
    rankThresholds: { S: 23e3, A: 18500, B: 13800, C: 9e3 },
    waves: [
      l(0.24, "诱导机群", 730, 430, 1.2, 0.14, { normal: 0.46, fast: 0.36, tank: 0.1, ace: 0.08 }),
      l(0.5, "护航压迫", 640, 340, 1.34, 0.22, { normal: 0.34, fast: 0.36, tank: 0.16, ace: 0.14 }),
      l(1, "头目警报", 580, 300, 1.42, 0.28, { normal: 0.28, fast: 0.34, tank: 0.18, ace: 0.2 })
    ],
    boss: {
      label: "拦截舰·赤锋",
      hp: 185,
      fireIntervalMs: 760,
      bulletSpeed: 300,
      score: 3600,
      speed: 118,
      patternSwitchMs: 2100,
      accent: "#fb7185",
      warningColor: "#fecdd3"
    }
  },
  {
    id: 4,
    name: "灼热突防",
    subtitle: "精英敌机开始加入火线。",
    durationMs: 102e3,
    isBossStage: !1,
    accent: "#f97316",
    highlight: "#fdba74",
    skyTop: "#271006",
    skyMid: "#2f1407",
    skyBottom: "#080403",
    clearAnnouncement: "第四关突破",
    rankThresholds: { S: 25500, A: 20500, B: 15600, C: 10200 },
    waves: [
      l(0.22, "热浪推进", 700, 400, 1.28, 0.16, { normal: 0.36, fast: 0.38, tank: 0.14, ace: 0.12 }),
      l(0.48, "精英切入", 620, 330, 1.42, 0.24, { normal: 0.28, fast: 0.34, tank: 0.18, ace: 0.2 }),
      l(0.78, "重甲压线", 560, 280, 1.52, 0.3, { normal: 0.24, fast: 0.32, tank: 0.22, ace: 0.22 }),
      l(1, "尾段反扑", 510, 250, 1.58, 0.34, { normal: 0.22, fast: 0.3, tank: 0.22, ace: 0.26 })
    ]
  },
  {
    id: 5,
    name: "双相压制",
    subtitle: "第二台头目会更快切换火力模式。",
    durationMs: 105e3,
    isBossStage: !0,
    bossSpawnMs: 6e4,
    accent: "#a78bfa",
    highlight: "#c4b5fd",
    skyTop: "#170d2f",
    skyMid: "#201240",
    skyBottom: "#08050f",
    clearAnnouncement: "第五关突破",
    rankThresholds: { S: 3e4, A: 24200, B: 18200, C: 11800 },
    waves: [
      l(0.24, "诱饵编队", 670, 370, 1.38, 0.2, { normal: 0.28, fast: 0.34, tank: 0.18, ace: 0.2 }),
      l(0.5, "护航拧压", 580, 300, 1.5, 0.28, { normal: 0.22, fast: 0.32, tank: 0.2, ace: 0.26 }),
      l(1, "双相警戒", 520, 260, 1.58, 0.34, { normal: 0.2, fast: 0.3, tank: 0.22, ace: 0.28 })
    ],
    boss: {
      label: "压制舰·紫曜",
      hp: 245,
      fireIntervalMs: 690,
      bulletSpeed: 330,
      score: 4300,
      speed: 126,
      patternSwitchMs: 1800,
      accent: "#a78bfa",
      warningColor: "#e9d5ff"
    }
  },
  {
    id: 6,
    name: "擦弹之谷",
    subtitle: "弹幕密度陡增，必须主动找擦弹线。",
    durationMs: 108e3,
    isBossStage: !1,
    accent: "#14b8a6",
    highlight: "#5eead4",
    skyTop: "#062322",
    skyMid: "#082c2c",
    skyBottom: "#03100f",
    clearAnnouncement: "第六关突破",
    rankThresholds: { S: 33e3, A: 26600, B: 20200, C: 13e3 },
    waves: [
      l(0.22, "织线压迫", 620, 330, 1.46, 0.24, { normal: 0.24, fast: 0.32, tank: 0.2, ace: 0.24 }),
      l(0.5, "贴边穿梭", 560, 280, 1.58, 0.32, { normal: 0.2, fast: 0.32, tank: 0.22, ace: 0.26 }),
      l(0.78, "交叠弹路", 510, 250, 1.68, 0.36, { normal: 0.18, fast: 0.3, tank: 0.24, ace: 0.28 }),
      l(1, "残压追咬", 470, 230, 1.74, 0.42, { normal: 0.16, fast: 0.28, tank: 0.24, ace: 0.32 })
    ]
  },
  {
    id: 7,
    name: "重装封锁",
    subtitle: "厚甲敌机会强行压缩你的走位空间。",
    durationMs: 11e4,
    isBossStage: !1,
    accent: "#34d399",
    highlight: "#86efac",
    skyTop: "#072116",
    skyMid: "#0a2a1d",
    skyBottom: "#030d08",
    clearAnnouncement: "第七关突破",
    rankThresholds: { S: 36e3, A: 29e3, B: 22e3, C: 14200 },
    waves: [
      l(0.2, "重装前压", 610, 340, 1.52, 0.22, { normal: 0.18, fast: 0.26, tank: 0.32, ace: 0.24 }),
      l(0.48, "厚甲并行", 540, 280, 1.64, 0.3, { normal: 0.16, fast: 0.24, tank: 0.34, ace: 0.26 }),
      l(0.78, "封锁走廊", 490, 240, 1.74, 0.38, { normal: 0.14, fast: 0.24, tank: 0.34, ace: 0.28 }),
      l(1, "残酷碾压", 450, 220, 1.8, 0.44, { normal: 0.12, fast: 0.22, tank: 0.34, ace: 0.32 })
    ]
  },
  {
    id: 8,
    name: "混编风暴",
    subtitle: "快机、精英与重装会连续混编登场。",
    durationMs: 112e3,
    isBossStage: !1,
    accent: "#f59e0b",
    highlight: "#fcd34d",
    skyTop: "#251605",
    skyMid: "#301b06",
    skyBottom: "#0a0602",
    clearAnnouncement: "第八关突破",
    rankThresholds: { S: 39500, A: 31800, B: 24e3, C: 15500 },
    waves: [
      l(0.2, "混编试锋", 580, 310, 1.6, 0.26, { normal: 0.16, fast: 0.3, tank: 0.22, ace: 0.32 }),
      l(0.46, "快机穿刺", 520, 270, 1.72, 0.34, { normal: 0.12, fast: 0.32, tank: 0.22, ace: 0.34 }),
      l(0.76, "精英叠火", 470, 230, 1.82, 0.42, { normal: 0.1, fast: 0.28, tank: 0.24, ace: 0.38 }),
      l(1, "暴雨清场", 430, 210, 1.9, 0.48, { normal: 0.08, fast: 0.26, tank: 0.24, ace: 0.42 })
    ]
  },
  {
    id: 9,
    name: "终幕前夜",
    subtitle: "最后的清场关，强度接近最终战。",
    durationMs: 115e3,
    isBossStage: !1,
    accent: "#ef4444",
    highlight: "#fca5a5",
    skyTop: "#2a080b",
    skyMid: "#340b10",
    skyBottom: "#090204",
    clearAnnouncement: "第九关突破",
    rankThresholds: { S: 44e3, A: 35e3, B: 26500, C: 17e3 },
    waves: [
      l(0.18, "战前试压", 560, 290, 1.66, 0.3, { normal: 0.14, fast: 0.26, tank: 0.24, ace: 0.36 }),
      l(0.44, "火力拉满", 500, 250, 1.78, 0.38, { normal: 0.1, fast: 0.26, tank: 0.24, ace: 0.4 }),
      l(0.74, "压轴封锁", 450, 220, 1.9, 0.46, { normal: 0.08, fast: 0.24, tank: 0.26, ace: 0.42 }),
      l(1, "最终预热", 420, 200, 1.98, 0.52, { normal: 0.06, fast: 0.24, tank: 0.26, ace: 0.44 })
    ]
  },
  {
    id: 10,
    name: "终焉母舰",
    subtitle: "最终头目拥有更长血条和更密的压迫节奏。",
    durationMs: 118e3,
    isBossStage: !0,
    bossSpawnMs: 62e3,
    accent: "#f43f5e",
    highlight: "#fda4af",
    skyTop: "#250511",
    skyMid: "#300818",
    skyBottom: "#090108",
    clearAnnouncement: "战役通关",
    rankThresholds: { S: 52e3, A: 41e3, B: 30500, C: 19500 },
    waves: [
      l(0.22, "母舰护航", 540, 280, 1.78, 0.34, { normal: 0.1, fast: 0.24, tank: 0.24, ace: 0.42 }),
      l(0.5, "终幕撕咬", 470, 230, 1.92, 0.44, { normal: 0.08, fast: 0.22, tank: 0.24, ace: 0.46 }),
      l(1, "终焉警报", 420, 200, 2.02, 0.52, { normal: 0.06, fast: 0.2, tank: 0.24, ace: 0.5 })
    ],
    boss: {
      label: "终焉母舰·黑潮",
      hp: 340,
      fireIntervalMs: 620,
      bulletSpeed: 352,
      score: 6200,
      speed: 132,
      patternSwitchMs: 1600,
      accent: "#f43f5e",
      warningColor: "#ffe4e6"
    }
  }
], F = "plane-war-campaign-progress", $ = ["D", "C", "B", "A", "S"];
function K() {
  return {
    bestScore: 0,
    cleared: !1,
    bestRank: null
  };
}
function te(e) {
  if (!e || typeof e != "object")
    return K();
  const i = e;
  return {
    bestScore: Number.isFinite(i.bestScore) ? Math.max(0, Number(i.bestScore)) : 0,
    cleared: !!i.cleared,
    bestRank: i.bestRank && $.includes(i.bestRank) ? i.bestRank : null
  };
}
function D(e) {
  return e ? $.indexOf(e) : -1;
}
function X(e) {
  return E[Math.max(1, Math.min(10, e)) - 1];
}
function oe() {
  var n;
  const e = { unlockedStageId: 1, stages: {} }, i = window.localStorage.getItem(F);
  if (!i)
    return e;
  try {
    const r = JSON.parse(i), t = Number.isFinite(r.unlockedStageId) ? Math.max(1, Math.min(10, Number(r.unlockedStageId))) : 1, o = {};
    for (const a of E)
      o[a.id] = te((n = r.stages) == null ? void 0 : n[a.id]);
    return {
      unlockedStageId: t,
      stages: o
    };
  } catch {
    return e;
  }
}
function ae(e) {
  window.localStorage.setItem(F, JSON.stringify(e));
}
function R(e, i) {
  return e.stages[i] ?? K();
}
function se(e, i) {
  return i >= e.rankThresholds.S ? "S" : i >= e.rankThresholds.A ? "A" : i >= e.rankThresholds.B ? "B" : i >= e.rankThresholds.C ? "C" : "D";
}
function le(e, i, n, r) {
  const t = {
    unlockedStageId: e.unlockedStageId,
    stages: { ...e.stages }
  }, o = R(t, i.id), a = se(i, n), s = n > o.bestScore;
  t.stages[i.id] = {
    bestScore: Math.max(o.bestScore, n),
    cleared: o.cleared || r,
    bestRank: D(a) > D(o.bestRank) || o.bestRank === null && r ? a : o.bestRank
  };
  let h = null;
  return r && i.id < 10 && t.unlockedStageId < i.id + 1 && (t.unlockedStageId = i.id + 1, h = i.id + 1), {
    progress: t,
    rank: a,
    unlockedStageId: h,
    isNewRecord: s
  };
}
function he() {
  return {
    x: 480 / 2 - 36 / 2,
    y: 716,
    width: 36,
    height: 48,
    speed: 372,
    hp: 4,
    maxHp: 4,
    fireTimer: 0,
    baseFireInterval: 150,
    rapidFireTimer: 0,
    spreadTimer: 0,
    shieldTimer: 0,
    invulnerableTimer: 0,
    overdriveCharge: 0,
    overdriveTimer: 0
  };
}
class fe {
  constructor() {
    c(this, "context", null);
    c(this, "masterGain", null);
    c(this, "cooldowns", /* @__PURE__ */ new Map());
  }
  unlock() {
    if (!(typeof window > "u")) {
      if (!this.context) {
        const i = window.AudioContext ?? window.webkitAudioContext;
        if (!i)
          return;
        this.context = new i(), this.masterGain = this.context.createGain(), this.masterGain.gain.value = 0.14, this.masterGain.connect(this.context.destination);
      }
      this.context.state === "suspended" && this.context.resume();
    }
  }
  play(i) {
    if (!(!this.context || !this.masterGain))
      switch (i) {
        case "ui-confirm":
          if (this.onCooldown(i, 0.08)) return;
          this.tone("triangle", 760, 440, 0.09, 0.12), this.tone("sine", 960, 880, 0.05, 0.07, 0.02);
          break;
        case "player-shot":
          if (this.onCooldown(i, 0.065)) return;
          this.tone("square", 540, 240, 0.045, 0.028);
          break;
        case "graze":
          if (this.onCooldown(i, 0.05)) return;
          this.tone("sine", 900, 1320, 0.06, 0.035);
          break;
        case "enemy-down":
          if (this.onCooldown(i, 0.045)) return;
          this.tone("triangle", 240, 118, 0.1, 0.05);
          break;
        case "close-kill":
          if (this.onCooldown(i, 0.08)) return;
          this.tone("sawtooth", 420, 160, 0.12, 0.08), this.tone("triangle", 880, 520, 0.08, 0.045, 0.01);
          break;
        case "pickup":
          if (this.onCooldown(i, 0.08)) return;
          this.tone("sine", 520, 920, 0.12, 0.055), this.tone("triangle", 820, 1120, 0.08, 0.04, 0.03);
          break;
        case "shield-hit":
          if (this.onCooldown(i, 0.1)) return;
          this.tone("triangle", 320, 220, 0.09, 0.05), this.tone("sine", 1120, 760, 0.08, 0.035);
          break;
        case "player-hit":
          if (this.onCooldown(i, 0.12)) return;
          this.tone("sawtooth", 260, 70, 0.18, 0.1);
          break;
        case "overdrive":
          if (this.onCooldown(i, 0.2)) return;
          this.tone("sawtooth", 180, 620, 0.18, 0.08), this.tone("square", 620, 980, 0.14, 0.04, 0.04);
          break;
        case "boss-alert":
          if (this.onCooldown(i, 0.3)) return;
          this.tone("square", 230, 180, 0.16, 0.08), this.tone("square", 230, 180, 0.16, 0.08, 0.2);
          break;
        case "boss-defeated":
          if (this.onCooldown(i, 0.5)) return;
          this.tone("triangle", 280, 120, 0.2, 0.1), this.tone("sine", 720, 1080, 0.24, 0.08, 0.04), this.tone("triangle", 540, 1380, 0.28, 0.06, 0.1);
          break;
        case "stage-clear":
          if (this.onCooldown(i, 0.4)) return;
          this.tone("sine", 520, 660, 0.1, 0.06), this.tone("sine", 780, 920, 0.12, 0.05, 0.08), this.tone("triangle", 980, 1180, 0.16, 0.04, 0.16);
          break;
        case "game-over":
          if (this.onCooldown(i, 0.5)) return;
          this.tone("sawtooth", 340, 110, 0.28, 0.1);
          break;
      }
  }
  onCooldown(i, n) {
    var o;
    const r = ((o = this.context) == null ? void 0 : o.currentTime) ?? 0, t = this.cooldowns.get(i) ?? -1 / 0;
    return r - t < n ? !0 : (this.cooldowns.set(i, r), !1);
  }
  tone(i, n, r, t, o, a = 0) {
    if (!this.context || !this.masterGain)
      return;
    const s = this.context.currentTime + a, h = this.context.createOscillator(), f = this.context.createGain();
    h.type = i, h.frequency.setValueAtTime(Math.max(1e-3, n), s), h.frequency.exponentialRampToValueAtTime(Math.max(1e-3, r), s + t), f.gain.setValueAtTime(1e-4, s), f.gain.exponentialRampToValueAtTime(o, s + 0.01), f.gain.exponentialRampToValueAtTime(1e-4, s + t), h.connect(f), f.connect(this.masterGain), h.start(s), h.stop(s + t + 0.02);
  }
}
function A(e, i, n, r, t, o, a) {
  e.fillStyle = "rgba(148, 163, 184, 0.18)", e.fillRect(i, n, r, 12), e.fillStyle = a, e.fillRect(i, n, r * Math.max(0, Math.min(1, t / o)), 12), e.strokeStyle = "rgba(226, 232, 240, 0.25)", e.strokeRect(i, n, r, 12);
}
function de(e, i, n, r, t) {
  e.font = 'bold 12px "Microsoft YaHei", "Segoe UI", sans-serif';
  const o = Math.ceil(e.measureText(r).width) + 18;
  return e.fillStyle = t, e.fillRect(i, n, o, 20), e.fillStyle = "#020617", e.fillText(r, i + 9, n + 14), o;
}
function ce(e, i, n) {
  const { player: r, stage: t } = i, o = Math.max(0, Math.min(1, i.timeMs / t.durationMs)), a = Math.max(0, Math.ceil((t.durationMs - i.timeMs) / 1e3)), s = t.isBossStage ? Math.max(0, Math.ceil(((t.bossSpawnMs ?? t.durationMs * 0.58) - i.timeMs) / 1e3)) : 0;
  e.save(), e.fillStyle = "rgba(2, 6, 23, 0.78)", e.fillRect(12, 12, 456, 132), e.fillStyle = "#f8fafc", e.textAlign = "left", e.font = 'bold 18px "Microsoft YaHei", "Segoe UI", sans-serif', e.fillText(`第${t.id}关 ${t.name}`, 24, 36), e.font = '12px "Microsoft YaHei", "Segoe UI", sans-serif', e.fillStyle = "#94a3b8", e.fillText(`本关最高 ${n}`, 24, 54), e.fillText(`分数 ${i.score}`, 24, 72), e.textAlign = "center", e.fillStyle = "#e2e8f0", e.font = 'bold 12px "Microsoft YaHei", "Segoe UI", sans-serif', e.fillText(i.waveLabel, 480 / 2, 30), e.fillStyle = i.boss ? t.highlight : t.isBossStage ? s > 0 ? "#fca5a5" : "#fcd34d" : "#67e8f9", e.fillText(
    i.boss ? i.boss.label : t.isBossStage ? s > 0 ? `${s}秒后头目` : "头目逼近" : `剩余 ${a} 秒`,
    480 / 2,
    48
  ), e.textAlign = "right", e.fillStyle = "#cbd5e1", e.fillText(`击落 ${i.stats.kills}`, 456, 30), e.fillText(`擦弹 ${i.stats.grazes}`, 456, 48), e.fillText(`近身 ${i.stats.closeKills}`, 456, 66), e.textAlign = "left", e.fillStyle = "#e2e8f0", e.font = 'bold 12px "Microsoft YaHei", "Segoe UI", sans-serif', e.fillText("生命", 24, 98), A(e, 60, 88, 122, r.hp, r.maxHp, "#22c55e"), e.fillText("爆发", 198, 98), A(
    e,
    238,
    88,
    178,
    r.overdriveTimer > 0 ? 100 : r.overdriveCharge,
    100,
    r.overdriveTimer > 0 ? "#facc15" : r.overdriveCharge >= 100 ? "#f59e0b" : "#38bdf8"
  ), e.fillStyle = "#cbd5e1", e.font = '12px "Microsoft YaHei", "Segoe UI", sans-serif';
  const h = r.overdriveTimer > 0 ? "爆发中" : r.overdriveCharge >= 100 ? "已就绪" : `${Math.round(r.overdriveCharge)}%`;
  e.fillText(h, 420, 98), i.combo > 1 ? (e.fillStyle = i.combo >= 10 ? "#facc15" : "#f8fafc", e.font = 'bold 20px "Microsoft YaHei", "Segoe UI", sans-serif', e.fillText(`连杀 x${i.combo}`, 24, 124)) : (e.fillStyle = "#94a3b8", e.font = '12px "Microsoft YaHei", "Segoe UI", sans-serif', e.fillText(t.subtitle, 24, 124));
  let f = 456;
  const d = [];
  r.rapidFireTimer > 0 && d.push({ label: "疾射", color: "#38bdf8" }), r.spreadTimer > 0 && d.push({ label: "扩散", color: "#f59e0b" }), r.shieldTimer > 0 && d.push({ label: "护盾", color: "#c084fc" }), d.reverse().forEach((y) => {
    const Q = Math.ceil(e.measureText(y.label).width) + 18;
    f -= Q, de(e, f, 112, y.label, y.color), f -= 8;
  }), A(e, 24, 136, 432, o, 1, t.highlight), e.restore();
}
const w = 44, P = 196, B = 92, ue = 16, ge = 14, me = 36, pe = 146, L = 392, O = 348, W = 184, Te = 48;
function z() {
  return {
    x: (480 - L) / 2,
    y: (800 - O) / 2,
    width: L,
    height: O
  };
}
function q(e) {
  const i = e - 1, n = i % 2, r = Math.floor(i / 2);
  return {
    x: me + n * (P + ue),
    y: pe + r * (B + ge),
    width: P,
    height: B
  };
}
function _() {
  const e = z();
  return {
    x: 480 / 2 - W / 2,
    y: e.y + 244,
    width: W,
    height: Te
  };
}
function Se() {
  const e = _();
  return {
    x: e.x,
    y: e.y + 60,
    width: e.width,
    height: e.height
  };
}
function U(e, i, n, r, t) {
  e.save(), e.fillStyle = t ? r : "rgba(15, 23, 42, 0.92)", e.fillRect(i.x, i.y, i.width, i.height), e.strokeStyle = r, e.lineWidth = 2, e.strokeRect(i.x, i.y, i.width, i.height), e.fillStyle = t ? "#020617" : "#f8fafc", e.textAlign = "center", e.font = 'bold 18px "Microsoft YaHei", "Segoe UI", sans-serif', e.fillText(n, i.x + i.width / 2, i.y + 31), e.restore();
}
function Me(e, i, n, r) {
  e.save(), e.textAlign = "center", e.font = '16px "Microsoft YaHei", "Segoe UI", sans-serif', r.forEach((t, o) => {
    e.fillStyle = o === 0 ? "#e2e8f0" : "#cbd5e1", e.fillText(t, i, n + o * 28);
  }), e.restore();
}
function Z(e, i) {
  return e === "stageSelect" ? E.filter((n) => n.id <= i.unlockedStageId).map((n) => ({
    id: `stage-${n.id}`,
    action: "stage",
    stageId: n.id,
    ...q(n.id)
  })) : e === "gameOver" ? [
    {
      id: "retry",
      action: "retry",
      ..._()
    },
    {
      id: "back-select",
      action: "back-select",
      ...Se()
    }
  ] : e === "stageClear" ? [
    {
      id: "back-select",
      action: "back-select",
      ..._()
    }
  ] : [];
}
function Ee(e, i, n, r, t) {
  const o = E[i - 1], a = q(i), s = i <= n.unlockedStageId, h = t === `stage-${i}`, f = r === i, d = R(n, i);
  e.save(), e.fillStyle = s ? h || f ? "rgba(15, 23, 42, 0.95)" : "rgba(2, 6, 23, 0.82)" : "rgba(2, 6, 23, 0.56)", e.fillRect(a.x, a.y, a.width, a.height), e.strokeStyle = s ? h || f ? o.highlight : o.accent : "rgba(71, 85, 105, 0.55)", e.lineWidth = h || f ? 2.5 : 1.5, e.strokeRect(a.x, a.y, a.width, a.height), e.fillStyle = s ? "#f8fafc" : "#64748b", e.textAlign = "left", e.font = 'bold 18px "Microsoft YaHei", "Segoe UI", sans-serif', e.fillText(`第${o.id}关`, a.x + 14, a.y + 26), e.font = 'bold 16px "Microsoft YaHei", "Segoe UI", sans-serif', e.fillStyle = s ? o.isBossStage ? o.highlight : "#e2e8f0" : "#64748b", e.fillText(o.name, a.x + 14, a.y + 50), e.font = '12px "Microsoft YaHei", "Segoe UI", sans-serif', e.fillStyle = s ? "#94a3b8" : "#475569", e.fillText(o.isBossStage ? "头目关" : `${Math.round(o.durationMs / 1e3)}秒关卡`, a.x + 14, a.y + 71), e.textAlign = "right", s ? d.cleared ? (e.fillStyle = o.highlight, e.font = 'bold 22px "Microsoft YaHei", "Segoe UI", sans-serif', e.fillText(d.bestRank ?? "D", a.x + a.width - 14, a.y + 30), e.font = '12px "Microsoft YaHei", "Segoe UI", sans-serif', e.fillStyle = "#cbd5e1", e.fillText(`最高 ${d.bestScore}`, a.x + a.width - 14, a.y + 70)) : (e.fillStyle = "#fbbf24", e.font = 'bold 12px "Microsoft YaHei", "Segoe UI", sans-serif', e.fillText("待突破", a.x + a.width - 14, a.y + 28), e.fillStyle = "#94a3b8", e.fillText(`最高 ${d.bestScore}`, a.x + a.width - 14, a.y + 70)) : (e.fillStyle = "#64748b", e.fillText("未解锁", a.x + a.width - 14, a.y + 28)), e.restore();
}
function Ie(e, i, n, r) {
  e.save(), e.fillStyle = "rgba(2, 6, 23, 0.66)", e.fillRect(22, 20, 436, 760), e.strokeStyle = "rgba(148, 163, 184, 0.22)", e.strokeRect(22, 20, 436, 760), e.fillStyle = "#f8fafc", e.textAlign = "center", e.font = 'bold 34px "Microsoft YaHei", "Segoe UI", sans-serif', e.fillText("天际突围 战役", 480 / 2, w + 6), e.fillStyle = "#cbd5e1", e.font = '16px "Microsoft YaHei", "Segoe UI", sans-serif', e.fillText("选择已解锁关卡。第 3 / 5 / 10 关为头目战。", 480 / 2, w + 34), e.fillStyle = "#94a3b8", e.fillText(`当前解锁 ${i.unlockedStageId} / 10`, 480 / 2, w + 58), E.forEach((t) => Ee(e, t.id, i, n, r)), e.fillStyle = "#94a3b8", e.font = '14px "Microsoft YaHei", "Segoe UI", sans-serif', e.fillText("点击关卡开始挑战。失败后可重试，也可返回选关。", 480 / 2, 764), e.restore();
}
function ye(e, i) {
  const n = Math.min(0.88, i.stageIntroTimerMs / 900);
  e.save(), e.fillStyle = `rgba(2, 6, 23, ${0.28 + n * 0.3})`, e.fillRect(0, 0, 480, 800), e.fillStyle = i.stage.highlight, e.fillRect(88, 280, 304, 4), e.fillRect(88, 522, 304, 4), e.textAlign = "center", e.fillStyle = "#e2e8f0", e.font = 'bold 18px "Microsoft YaHei", "Segoe UI", sans-serif', e.fillText(`第 ${i.stage.id} 关`, 480 / 2, 346), e.fillStyle = "#f8fafc", e.font = 'bold 42px "Microsoft YaHei", "Segoe UI", sans-serif', e.fillText(i.stage.name, 480 / 2, 404), e.fillStyle = "#cbd5e1", e.font = '16px "Microsoft YaHei", "Segoe UI", sans-serif', e.fillText(i.stage.subtitle, 480 / 2, 446), e.fillStyle = "#94a3b8", e.fillText(i.stage.isBossStage ? "中段后会触发头目战" : "撑过整段空域压制即可过关", 480 / 2, 480), e.restore();
}
function Y(e, i, n, r, t) {
  const o = z(), a = t ? i.stage.highlight : "#fb7185", s = t ? i.stage.id === 10 ? "战役通关" : `第${i.stage.id}关突破` : "挑战失败";
  e.save(), e.fillStyle = "rgba(2, 6, 23, 0.9)", e.fillRect(o.x, o.y, o.width, o.height), e.strokeStyle = a, e.lineWidth = 2, e.strokeRect(o.x, o.y, o.width, o.height), e.textAlign = "center", e.fillStyle = "#f8fafc", e.font = 'bold 32px "Microsoft YaHei", "Segoe UI", sans-serif', e.fillText(s, 480 / 2, o.y + 50), e.fillStyle = a, e.font = 'bold 42px "Microsoft YaHei", "Segoe UI", sans-serif', e.fillText(i.resultRank, 480 / 2, o.y + 108), e.fillStyle = "#cbd5e1", e.font = '14px "Microsoft YaHei", "Segoe UI", sans-serif', e.fillText(`第${i.stage.id}关 · ${i.stage.name}`, 480 / 2, o.y + 132);
  const h = t ? [
    i.resultUnlockedStageId ? `已解锁第 ${i.resultUnlockedStageId} 关` : i.stage.id === 10 ? "10 关全部完成" : "关卡已全部解锁",
    `分数 ${i.score}   本关最高 ${n}`,
    `击落 ${i.stats.kills}   擦弹 ${i.stats.grazes}`,
    i.resultIsNewRecord ? "刷新了本关最佳成绩" : "返回选关后手动进入下一关"
  ] : [
    "本次未能突破这段火力区。",
    `分数 ${i.score}   本关最高 ${n}`,
    `击落 ${i.stats.kills}   擦弹 ${i.stats.grazes}`,
    `近身击落 ${i.stats.closeKills}   最长连杀 ${i.stats.longestCombo}`
  ];
  Me(e, 480 / 2, o.y + 164, h), e.restore();
  const f = Z(t ? "stageClear" : "gameOver", { unlockedStageId: 1 }), d = f[0];
  U(e, d, t ? "返回选关" : "重新挑战", a, r === d.id), !t && f[1] && U(e, f[1], "返回选关", "#94a3b8", r === f[1].id);
}
function Ae(e, i) {
  const n = e.createLinearGradient(0, 0, 0, 800);
  n.addColorStop(0, i.player.overdriveTimer > 0 ? "#04141f" : i.stage.skyTop), n.addColorStop(0.55, (i.boss, i.stage.skyMid)), n.addColorStop(1, i.stage.skyBottom), e.fillStyle = n, e.fillRect(0, 0, 480, 800);
  const r = i.player.overdriveTimer > 0 ? 0.18 + Math.sin(i.timeMs / 80) * 0.04 : 0.08;
  e.fillStyle = `rgba(34, 211, 238, ${r})`, e.fillRect(0, 0, 480, 84);
  for (const t of i.stars)
    e.fillStyle = `rgba(191, 219, 254, ${t.alpha})`, e.fillRect(t.x, t.y, t.size, t.size * (i.player.overdriveTimer > 0 ? 3.4 : 2.2));
  e.strokeStyle = i.player.overdriveTimer > 0 ? "rgba(34, 211, 238, 0.14)" : "rgba(148, 163, 184, 0.08)", e.lineWidth = 1;
  for (let t = 0; t < 800; t += 44)
    e.beginPath(), e.moveTo(0, t), e.lineTo(480, t), e.stroke();
}
function we(e, i) {
  for (const n of i) {
    const r = Math.max(0, n.life / n.maxLife);
    if (e.save(), e.globalAlpha = r, n.shape === "ring") {
      const t = 1 - r;
      e.strokeStyle = n.color, e.lineWidth = 2, e.beginPath(), e.arc(n.x, n.y, n.size * (0.55 + t), 0, Math.PI * 2), e.stroke();
    } else
      e.fillStyle = n.color, e.fillRect(n.x, n.y, n.size, n.size);
    e.restore();
  }
}
function ke(e, i) {
  e.save(), i.invulnerableTimer > 0 && Math.floor(i.invulnerableTimer / 80) % 2 === 0 && (e.globalAlpha = 0.45), i.overdriveTimer > 0 && (e.fillStyle = "rgba(250, 204, 21, 0.15)", e.beginPath(), e.arc(i.x + i.width / 2, i.y + i.height / 2, i.width * 1.2, 0, Math.PI * 2), e.fill()), e.fillStyle = i.overdriveTimer > 0 ? "#facc15" : "#38bdf8", e.beginPath(), e.moveTo(i.x + i.width / 2, i.y - 6), e.lineTo(i.x + i.width, i.y + i.height - 2), e.lineTo(i.x + i.width / 2, i.y + i.height - 12), e.lineTo(i.x, i.y + i.height - 2), e.closePath(), e.fill(), e.fillStyle = i.overdriveTimer > 0 ? "#fef3c7" : "#e0f2fe", e.fillRect(i.x + i.width / 2 - 4, i.y + 10, 8, 14), e.fillRect(i.x + 6, i.y + 24, 4, 12), e.fillRect(i.x + i.width - 10, i.y + 24, 4, 12), e.fillStyle = i.overdriveTimer > 0 ? "#f97316" : "#67e8f9", e.beginPath(), e.moveTo(i.x + 10, i.y + i.height - 2), e.lineTo(i.x + 15, i.y + i.height + 10), e.lineTo(i.x + 20, i.y + i.height - 2), e.closePath(), e.fill(), e.beginPath(), e.moveTo(i.x + i.width - 20, i.y + i.height - 2), e.lineTo(i.x + i.width - 15, i.y + i.height + 10), e.lineTo(i.x + i.width - 10, i.y + i.height - 2), e.closePath(), e.fill(), i.shieldTimer > 0 && (e.strokeStyle = "rgba(192, 132, 252, 0.95)", e.lineWidth = 3, e.beginPath(), e.arc(i.x + i.width / 2, i.y + i.height / 2, i.width * 0.95, 0, Math.PI * 2), e.stroke()), e.restore();
}
function ve(e, i) {
  const n = i.hitTimer > 0 ? "#f8fafc" : i.color;
  switch (e.save(), e.fillStyle = n, i.kind) {
    case "normal":
      e.beginPath(), e.moveTo(i.x + i.width / 2, i.y + i.height), e.lineTo(i.x + i.width, i.y + 10), e.lineTo(i.x + i.width / 2, i.y), e.lineTo(i.x, i.y + 10), e.closePath(), e.fill();
      break;
    case "fast":
      e.beginPath(), e.moveTo(i.x + i.width / 2, i.y + i.height), e.lineTo(i.x + i.width, i.y + i.height / 2), e.lineTo(i.x + i.width / 2, i.y), e.lineTo(i.x, i.y + i.height / 2), e.closePath(), e.fill();
      break;
    case "tank":
      e.fillRect(i.x, i.y + 8, i.width, i.height - 8), e.fillRect(i.x + 8, i.y, i.width - 16, 16);
      break;
    case "ace":
      e.beginPath(), e.moveTo(i.x + i.width / 2, i.y), e.lineTo(i.x + i.width, i.y + i.height / 2), e.lineTo(i.x + i.width / 2, i.y + i.height), e.lineTo(i.x, i.y + i.height / 2), e.closePath(), e.fill(), e.strokeStyle = "rgba(248, 250, 252, 0.9)", e.lineWidth = 2, e.stroke();
      break;
  }
  e.fillStyle = "rgba(2, 6, 23, 0.7)", e.fillRect(i.x + 7, i.y + 8, Math.max(10, i.width - 14), Math.max(8, i.height - 16)), e.restore();
}
function be(e, i) {
  e.save(), e.fillStyle = i.hitTimer > 0 ? "#fef2f2" : i.accent, e.fillRect(i.x, i.y, i.width, i.height), e.fillStyle = "#111827", e.fillRect(i.x + 18, i.y + 18, i.width - 36, i.height - 28), e.fillStyle = i.warningColor, e.fillRect(i.x + 26, i.y + 26, i.width - 52, 18), e.fillStyle = "#fca5a5", e.fillRect(i.x + i.width / 2 - 20, i.y + 54, 40, 18), e.fillStyle = "rgba(2, 6, 23, 0.72)", e.fillRect(54, 154, 372, 18), e.fillStyle = i.accent, e.fillRect(54, 154, 372 * Math.max(0, i.hp) / i.maxHp, 18), e.strokeStyle = "rgba(248, 250, 252, 0.6)", e.strokeRect(54, 154, 372, 18), e.fillStyle = "#fee2e2", e.font = 'bold 12px "Microsoft YaHei", "Segoe UI", sans-serif', e.textAlign = "center", e.fillText(i.label, 480 / 2, 148), e.restore();
}
function V(e, i) {
  e.save(), e.fillStyle = i.color, i.from === "player" ? (e.fillRect(i.x, i.y, i.width, i.height), e.globalAlpha = 0.45, e.fillRect(i.x - 2, i.y, i.width + 4, i.height)) : (e.beginPath(), e.roundRect(i.x, i.y, i.width, i.height, 4), e.fill()), e.restore();
}
function _e(e, i) {
  e.save(), e.fillStyle = i.color, e.beginPath(), e.arc(i.x + i.width / 2, i.y + i.height / 2, i.width / 2, 0, Math.PI * 2), e.fill(), e.fillStyle = "#020617", e.font = 'bold 11px "Microsoft YaHei", "Segoe UI", sans-serif', e.textAlign = "center", e.fillText(i.label, i.x + i.width / 2, i.y + i.height / 2 + 4), e.restore();
}
function Re(e, i) {
  i.announcement && (e.save(), e.fillStyle = "rgba(15, 23, 42, 0.82)", e.fillRect(88, 182, 304, 40), e.strokeStyle = i.stage.highlight, e.strokeRect(88, 182, 304, 40), e.fillStyle = "#f8fafc", e.font = 'bold 18px "Microsoft YaHei", "Segoe UI", sans-serif', e.textAlign = "center", e.fillText(i.announcement, 480 / 2, 208), e.restore());
}
function He(e, i, n) {
  i <= 0 || (e.save(), e.globalAlpha = Math.min(0.32, i / 540), e.fillStyle = n, e.fillRect(0, 0, 480, 800), e.restore());
}
function Ce(e, i, n, r, t) {
  e.clearRect(0, 0, 480, 800);
  const o = i.phase === "playing" ? (Math.random() - 0.5) * i.cameraShakeStrength : 0, a = i.phase === "playing" ? (Math.random() - 0.5) * i.cameraShakeStrength : 0;
  e.save(), e.translate(o, a), Ae(e, i);
  for (const s of i.pickups) _e(e, s);
  for (const s of i.enemyBullets) V(e, s);
  for (const s of i.enemies) ve(e, s);
  for (const s of i.playerBullets) V(e, s);
  i.boss && be(e, i.boss), we(e, i.particles), ke(e, i.player), e.restore(), i.phase === "playing" && (ce(e, i, r), Re(e, i)), i.phase === "stageSelect" && Ie(e, n, i.stage.id, t), i.phase === "stageIntro" && ye(e, i), i.phase === "gameOver" && Y(e, i, r, t, !1), i.phase === "stageClear" && Y(e, i, r, t, !0), He(e, i.screenFlashTimer, i.screenFlashColor);
}
function M(e, i, n = 0, r = 1, t = !1) {
  return {
    from: "player",
    x: e,
    y: i,
    width: t ? 10 : 6,
    height: t ? 24 : 16,
    vx: n,
    vy: t ? -620 : -540,
    damage: r,
    color: t ? "#facc15" : "#f8fafc",
    grazed: !1
  };
}
function Ge(e, i, n, r, t = "#fb7185", o = 1) {
  return {
    from: "enemy",
    x: e,
    y: i,
    width: 8,
    height: 18,
    vx: n,
    vy: r,
    damage: o,
    color: t,
    grazed: !1
  };
}
function J(e, i) {
  const n = e.player.overdriveCharge;
  e.player.overdriveCharge = Math.min(100, e.player.overdriveCharge + i), n < 100 && e.player.overdriveCharge >= 100 && (e.announcement = "爆发已就绪", e.announcementTimer = Math.max(e.announcementTimer, 900));
}
function De(e, i = 1, n = 0) {
  e.combo += i, e.comboTimer = 1800 + n + Math.min(900, e.combo * 55), e.stats.longestCombo = Math.max(e.stats.longestCombo, e.combo);
}
function N(e) {
  e.combo = 0, e.comboTimer = 0;
}
function k(e, i) {
  return e + Math.random() * (i - e);
}
function g(e, i, n) {
  e.cameraShakeTimer = Math.max(e.cameraShakeTimer, i), e.cameraShakeStrength = Math.max(e.cameraShakeStrength, n);
}
function m(e, i, n) {
  e.screenFlashColor = i, e.screenFlashTimer = Math.max(e.screenFlashTimer, n);
}
function S(e, i, n, r, t, o = 260, a = 3) {
  for (let s = 0; s < t; s += 1) {
    const h = Math.random() * Math.PI * 2, f = k(o * 0.35, o);
    e.particles.push({
      x: i,
      y: n,
      vx: Math.cos(h) * f,
      vy: Math.sin(h) * f,
      size: k(a * 0.65, a * 1.4),
      life: k(180, 380),
      maxLife: 380,
      color: r,
      shape: "spark"
    });
  }
}
function p(e, i, n, r, t = 26, o = 240) {
  e.particles.push({
    x: i,
    y: n,
    vx: 0,
    vy: 0,
    size: t,
    life: o,
    maxLife: o,
    color: r,
    shape: "ring"
  });
}
function Pe(e, i, n) {
  return {
    type: e,
    x: i,
    y: n,
    width: 22,
    height: 22,
    speed: 135,
    color: ne[e],
    label: ie[e]
  };
}
function T(e, i) {
  return e.x < i.x + i.width && e.x + e.width > i.x && e.y < i.y + i.height && e.y + e.height > i.y;
}
function Be(e, i) {
  const n = e.x + e.width / 2, r = e.y + e.height / 2, t = i.x + i.width / 2, o = i.y + i.height / 2;
  return Math.hypot(n - t, r - o);
}
function Le(e, i, n) {
  return Math.hypot(e.x + e.width / 2 - i, e.y + e.height / 2 - n);
}
function Oe(e) {
  const i = e.kind === "ace" ? 0.55 : e.kind === "tank" ? 0.28 : 0.12;
  if (Math.random() > i)
    return null;
  const n = H[Math.floor(Math.random() * H.length)];
  return Pe(n, e.x + e.width / 2 - 11, e.y + e.height / 2 - 11);
}
function We(e, i) {
  const n = Be(i, e.player) <= 116, r = 1 + Math.min(e.combo, 24) * 0.08, t = e.player.overdriveTimer > 0 ? 1.35 : 1, o = Math.round(i.score * r * t) + (n ? 70 : 0), a = i.x + i.width / 2, s = i.y + i.height / 2;
  if (e.score += o, J(e, i.chargeValue + (n ? 14 : 0)), De(e, 1, n ? 260 : 120), e.stats.kills += 1, n && (e.stats.closeKills += 1), e.events.push({ type: "enemy-down", closeKill: n, elite: i.elite }), S(e, a, s, i.color, i.elite || n ? 18 : 12, i.elite ? 340 : 260, n ? 4 : 3), p(e, a, s, n ? "#facc15" : i.color, n ? 34 : 24, 240), g(e, n ? 180 : 130, n ? 7 : i.elite ? 6 : 4), n && m(e, "#facc15", 120), e.player.overdriveTimer > 0) {
    const f = e.enemyBullets.length;
    e.enemyBullets = e.enemyBullets.filter((d) => Le(d, a, s) > 108), e.score += (f - e.enemyBullets.length) * 5, p(e, a, s, "#fde68a", 42, 280);
  }
  n ? (e.announcement = "近身击落", e.announcementTimer = 700) : e.combo > 0 && e.combo % 5 === 0 && (e.announcement = `连杀 x${e.combo}`, e.announcementTimer = 650);
  const h = Oe(i);
  h && e.pickups.push(h);
}
function v(e, i) {
  const n = e.player;
  if (!(n.invulnerableTimer > 0)) {
    if (n.shieldTimer > 0) {
      n.shieldTimer = Math.max(0, n.shieldTimer - 1400), n.invulnerableTimer = 260, N(e), e.events.push({ type: "shield-hit" }), m(e, "#c084fc", 80), g(e, 120, 4), p(e, n.x + n.width / 2, n.y + n.height / 2, "#c084fc", 24, 180);
      return;
    }
    n.hp -= i, n.invulnerableTimer = 860, n.overdriveCharge = Math.max(0, n.overdriveCharge - 18), N(e), e.events.push({ type: "player-hit" }), m(e, "#fb7185", 140), g(e, 220, 8), S(e, n.x + n.width / 2, n.y + n.height / 2, "#fda4af", 14, 220, 3);
  }
}
function Ue(e, i) {
  const n = [];
  for (const r of e.playerBullets) {
    if (!T(r, i)) {
      n.push(r);
      continue;
    }
    i.hp -= r.damage, i.hitTimer = 100;
  }
  if (e.playerBullets = n, i.hp <= 0) {
    const r = 1 + Math.min(e.combo, 24) * 0.08, t = e.player.overdriveTimer > 0 ? 1.35 : 1, o = Math.round(i.score * r * t), a = i.x + i.width / 2, s = i.y + i.height / 2;
    e.score += o, e.boss = null, e.enemies = [], e.enemyBullets = [], e.pickups = [], e.phase = "stageClear", e.announcement = e.stage.id === 10 ? "战役通关" : "头目击破", e.announcementTimer = 1600, e.events.push({ type: "boss-defeated", finalStage: e.stage.id === 10 }), m(e, "#fde68a", 260), g(e, 420, 11), S(e, a, s, i.accent, 34, 380, 4.6), p(e, a, s, "#fde68a", 72, 420);
  }
}
function Ye(e) {
  const i = e.player, n = [], r = [];
  for (const s of e.playerBullets) {
    let h = !1;
    for (const f of e.enemies)
      if (!(f.hp <= 0 || !T(s, f))) {
        f.hp -= s.damage, f.hitTimer = 90, h = !0, f.hp <= 0 && We(e, f);
        break;
      }
    h || r.push(s);
  }
  e.playerBullets = r;
  for (const s of e.enemies)
    s.hp > 0 && n.push(s);
  e.enemies = n, e.boss && Ue(e, e.boss);
  const t = [];
  for (const s of e.enemyBullets) {
    if (!T(s, i)) {
      t.push(s);
      continue;
    }
    v(e, s.damage);
  }
  e.enemyBullets = t;
  const o = [];
  for (const s of e.enemies) {
    if (!T(s, i)) {
      o.push(s);
      continue;
    }
    v(e, 1);
  }
  e.enemies = o, e.boss && T(e.boss, i) && v(e, 1);
  const a = [];
  for (const s of e.pickups) {
    if (!T(s, i)) {
      a.push(s);
      continue;
    }
    switch (s.type) {
      case "rapid":
        i.rapidFireTimer = 6800;
        break;
      case "spread":
        i.spreadTimer = 6800;
        break;
      case "shield":
        i.shieldTimer = 5600, i.hp = Math.min(i.maxHp, i.hp + 1);
        break;
    }
    e.score += 45, e.announcement = s.label, e.announcementTimer = 650, e.events.push({ type: "pickup", pickupType: s.type }), p(e, s.x + s.width / 2, s.y + s.height / 2, s.color, 18, 180);
  }
  e.pickups = a, i.hp <= 0 && e.phase === "playing" && (e.phase = "gameOver", e.announcement = "战机坠毁", e.announcementTimer = 900, e.events.push({ type: "game-over" }));
}
function Ve(e) {
  return {
    x: 480 / 2 - C / 2,
    y: -G - 24,
    width: C,
    height: G,
    speed: e.speed,
    direction: 1,
    hp: e.hp,
    maxHp: e.hp,
    fireTimer: 0,
    fireIntervalMs: e.fireIntervalMs,
    bulletSpeed: e.bulletSpeed,
    entering: !0,
    hitTimer: 0,
    score: e.score,
    label: e.label,
    pattern: "fan",
    patternTimer: e.patternSwitchMs,
    patternSwitchMs: e.patternSwitchMs,
    accent: e.accent,
    warningColor: e.warningColor
  };
}
function Ne(e, i) {
  const n = re[e], r = Math.random() * (480 - n.width), t = Math.max(0, Math.floor((i - 1) * (e === "tank" || e === "ace" ? 2 : 1.2)));
  return {
    kind: e,
    x: r,
    y: -n.height - 8,
    width: n.width,
    height: n.height,
    speed: n.speed * (0.96 + Math.random() * 0.14) * i,
    hp: n.hp + t,
    maxHp: n.hp + t,
    score: Math.round(n.score * (1 + (i - 1) * 0.35)),
    color: n.color,
    vx: (Math.random() > 0.5 ? 1 : -1) * n.vx,
    fireTimer: n.fireInterval * (0.5 + Math.random() * 0.55),
    fireInterval: n.fireInterval / (1 + (i - 1) * 0.2),
    bulletSpeed: n.bulletSpeed * (1 + (i - 1) * 0.12),
    firePattern: n.pattern,
    elite: !!n.elite,
    chargeValue: n.chargeValue + Math.max(0, Math.round((i - 1) * 2)),
    hitTimer: 0
  };
}
function Fe(e) {
  const i = Math.max(0, Math.min(1, e.timeMs / e.stage.durationMs)), n = e.stage.waves;
  for (let r = 0; r < n.length; r += 1)
    if (i <= n[r].untilRatio)
      return { index: r, profile: n[r] };
  return { index: n.length - 1, profile: n[n.length - 1] };
}
function $e(e) {
  let i = Math.random();
  const n = ["normal", "fast", "tank", "ace"];
  for (const r of n)
    if (i -= e[r], i <= 0)
      return r;
  return "ace";
}
function Ke(e, i) {
  const { index: n, profile: r } = Fe(e);
  if (e.waveIndex !== n && (e.waveIndex = n, e.waveLabel = r.label, e.announcement = r.label, e.announcementTimer = 800), e.stage.isBossStage && e.stage.boss && !e.bossAppeared && e.timeMs >= (e.stage.bossSpawnMs ?? e.stage.durationMs * 0.58)) {
    e.bossAppeared = !0, e.boss = Ve(e.stage.boss), e.enemies = [], e.enemyBullets = [], e.pickups = [], e.announcement = e.stage.boss.label, e.announcementTimer = 1600, e.events.push({ type: "boss-alert" }), m(e, e.stage.boss.accent, 180), g(e, 240, 8);
    return;
  }
  if (e.boss || !e.stage.isBossStage && e.timeMs >= e.stage.durationMs || (e.spawnTimer -= i, e.spawnTimer > 0))
    return;
  const t = r.difficulty + Math.min(e.timeMs / e.stage.durationMs, 0.32), o = 1 + (Math.random() < r.multiSpawnChance ? 1 : 0);
  for (let s = 0; s < o; s += 1)
    e.enemies.push(Ne($e(r.weights), t));
  const a = 0.82 + Math.random() * 0.28;
  e.spawnTimer = Math.max(r.spawnMinMs, r.spawnBaseMs * a);
}
function I(e, i, n) {
  return Math.max(i, Math.min(n, e));
}
function Xe(e, i, n, r, t, o) {
  const a = Math.max(n - e, 0, e - (n + t)), s = Math.max(r - i, 0, i - (r + o));
  return a * a + s * s;
}
function u(e, i, n, r, t, o) {
  e.enemyBullets.push(Ge(i, n, Math.cos(r) * t, Math.sin(r) * t, o));
}
function ze(e, i, n, r, t) {
  const o = e.player.x + e.player.width / 2, a = e.player.y + e.player.height / 2, s = Math.atan2(a - n, o - i);
  u(e, i, n, s, r, t);
}
function qe(e, i) {
  const n = i.x + i.width / 2, r = i.y + i.height - 4, t = Math.PI / 2;
  switch (i.firePattern) {
    case "aimed":
      ze(e, n, r, i.bulletSpeed, i.color);
      break;
    case "spread":
      [-0.42, 0, 0.42].forEach((o) => {
        u(e, n, r, t + o, i.bulletSpeed, i.color);
      });
      break;
    case "spray":
      [-0.72, -0.28, 0.28, 0.72].forEach((o) => {
        u(e, n, r, t + o, i.bulletSpeed * 0.92, i.color);
      });
      break;
    case "burst": {
      const o = e.player.x + e.player.width / 2, a = e.player.y + e.player.height / 2, s = Math.atan2(a - r, o - n);
      [-0.22, 0, 0.22].forEach((h) => {
        u(e, n, r, s + h, i.bulletSpeed, i.color);
      });
      break;
    }
  }
}
function Ze(e, i) {
  const n = i.x + i.width / 2, r = i.y + i.height - 10, t = Math.PI / 2;
  if (i.pattern === "fan") {
    [-0.88, -0.44, 0, 0.44, 0.88].forEach((a) => {
      u(e, n, r, t + a, i.bulletSpeed, i.accent);
    }), i.fireTimer = i.fireIntervalMs;
    return;
  }
  const o = Math.atan2(
    e.player.y + e.player.height / 2 - r,
    e.player.x + e.player.width / 2 - n
  );
  [-0.28, 0, 0.28].forEach((a) => {
    u(e, n, r, o + a, i.bulletSpeed * 1.05, i.warningColor);
  }), [-0.64, 0.64].forEach((a) => {
    u(e, n, r, t + a, i.bulletSpeed * 0.84, "#f97316");
  }), i.fireTimer = Math.max(500, i.fireIntervalMs - 110);
}
function Je(e, i) {
  for (const n of e.stars)
    n.y += n.speed * i / 1e3, n.y > 800 && (n.y = -n.size, n.x = Math.random() * 480);
}
function je(e) {
  const i = e.player;
  i.overdriveCharge = 0, i.overdriveTimer = 3800;
  const n = i.x + i.width / 2, r = i.y + i.height / 2, t = e.enemyBullets.length;
  e.enemyBullets = e.enemyBullets.filter((o) => {
    const a = o.x + o.width / 2 - n, s = o.y + o.height / 2 - r;
    return a * a + s * s > 144 * 144;
  }), e.score += (t - e.enemyBullets.length) * 6, e.announcement = "爆发启动", e.announcementTimer = 950, e.events.push({ type: "overdrive" }), m(e, "#22d3ee", 210), g(e, 200, 6), S(e, n, r, "#67e8f9", 18, 320, 3.5), p(e, n, r, "#22d3ee", 34, 320);
}
function Qe(e, i, n) {
  const r = e.player, t = r.speed * n / 1e3, o = r.overdriveTimer > 0;
  i.left && (r.x -= t), i.right && (r.x += t), i.up && (r.y -= t), i.down && (r.y += t), r.x = I(r.x, 0, 480 - r.width), r.y = I(r.y, 96, 800 - r.height - 20), r.fireTimer -= n;
  let a = r.baseFireInterval;
  if (r.rapidFireTimer > 0 && (a = 108), o && (a = 72), r.fireTimer <= 0) {
    const s = r.x + r.width / 2 - 3, h = o ? 2 : 1;
    e.playerBullets.push(M(s, r.y - 14, 0, h, o)), o && (e.playerBullets.push(M(s - 10, r.y - 6, -120, 1, !0)), e.playerBullets.push(M(s + 10, r.y - 6, 120, 1, !0))), r.spreadTimer > 0 && (e.playerBullets.push(M(s - 16, r.y - 4, -175, o ? 2 : 1, o)), e.playerBullets.push(M(s + 16, r.y - 4, 175, o ? 2 : 1, o))), e.events.push({ type: "player-shot" }), r.fireTimer = a;
  }
  r.rapidFireTimer = Math.max(0, r.rapidFireTimer - n), r.spreadTimer = Math.max(0, r.spreadTimer - n), r.shieldTimer = Math.max(0, r.shieldTimer - n), r.invulnerableTimer = Math.max(0, r.invulnerableTimer - n), r.overdriveTimer = Math.max(0, r.overdriveTimer - n), i.skillPressed && r.overdriveCharge >= 100 && r.overdriveTimer <= 0 && je(e);
}
function xe(e, i) {
  const n = i / 1e3;
  e.playerBullets = e.playerBullets.filter((r) => (r.x += r.vx * n, r.y += r.vy * n, r.y + r.height > -30 && r.y < 830)), e.enemyBullets = e.enemyBullets.filter((r) => (r.x += r.vx * n, r.y += r.vy * n, r.y + r.height > -40 && r.y < 840 && r.x > -40 && r.x < 520));
}
function ei(e) {
  const i = e.player, n = 54 * 54;
  for (const r of e.enemyBullets) {
    if (r.grazed)
      continue;
    const t = r.x + r.width / 2, o = r.y + r.height / 2, a = Xe(t, o, i.x, i.y, i.width, i.height);
    a <= n && a > 9 && (r.grazed = !0, J(e, 6), e.score += 12 + Math.min(60, e.combo * 2), e.stats.grazes += 1, e.events.push({ type: "graze" }), S(e, t, o, "#67e8f9", 5, 95, 2));
  }
}
function ii(e, i) {
  const n = i / 1e3;
  e.enemies = e.enemies.filter((r) => (r.hitTimer = Math.max(0, r.hitTimer - i), r.y += r.speed * n, r.x += r.vx * n, (r.x <= 0 || r.x + r.width >= 480) && (r.vx *= -1, r.x = I(r.x, 0, 480 - r.width)), r.fireTimer -= i, r.y > 54 && r.fireTimer <= 0 && (qe(e, r), r.fireTimer = r.fireInterval * (0.88 + Math.random() * 0.22)), r.y < 800 + r.height));
}
function ni(e, i) {
  if (!e.boss)
    return;
  const n = i / 1e3, r = e.boss;
  if (r.hitTimer = Math.max(0, r.hitTimer - i), r.patternTimer -= i, r.patternTimer <= 0 && (r.pattern = r.pattern === "fan" ? "hunt" : "fan", r.patternTimer = r.patternSwitchMs), r.entering) {
    r.y += r.speed * n, r.y >= 72 && (r.y = 72, r.entering = !1, e.announcement = "顶住头目火力", e.announcementTimer = 900);
    return;
  }
  r.x += r.direction * r.speed * n, (r.x <= 20 || r.x + r.width >= 460) && (r.direction *= -1, r.x = I(r.x, 20, 480 - r.width - 20)), r.fireTimer -= i, r.fireTimer <= 0 && Ze(e, r);
}
function ri(e, i) {
  const n = i / 1e3;
  e.pickups = e.pickups.filter((r) => (r.y += r.speed * n, r.y < 800 + r.height));
}
function ti(e, i) {
  const n = i / 1e3;
  e.particles = e.particles.filter((r) => (r.life = Math.max(0, r.life - i), r.x += r.vx * n, r.y += r.vy * n, r.vx *= 0.99, r.vy *= 0.99, r.life > 0));
}
function oi(e) {
  e.phase === "playing" && (e.phase = "stageClear", e.enemies = [], e.enemyBullets = [], e.pickups = [], e.announcement = e.stage.clearAnnouncement, e.announcementTimer = 1200, e.events.push({ type: "stage-clear", finalStage: e.stage.id === 10 }), m(e, e.stage.highlight, 180), g(e, 200, 6), S(e, 480 / 2, 800 / 2, e.stage.highlight, 16, 260, 3.4), p(e, 480 / 2, 800 / 2, e.stage.highlight, 58, 320));
}
function ai(e, i, n) {
  e.timeMs += n, e.announcementTimer = Math.max(0, e.announcementTimer - n), e.screenFlashTimer = Math.max(0, e.screenFlashTimer - n), e.cameraShakeTimer = Math.max(0, e.cameraShakeTimer - n), e.cameraShakeStrength = e.cameraShakeTimer > 0 ? Math.max(0, e.cameraShakeStrength - n * 0.03) : 0, e.comboTimer = Math.max(0, e.comboTimer - n), e.announcementTimer === 0 && (e.announcement = ""), e.comboTimer === 0 && (e.combo = 0), Je(e, n), Qe(e, i, n), xe(e, n), ei(e), ii(e, n), ni(e, n), ri(e, n), ti(e, n), Ke(e, n), Ye(e), !e.stage.isBossStage && e.phase === "playing" && e.timeMs >= e.stage.durationMs && oi(e);
}
function si() {
  return Array.from({ length: 90 }, () => ({
    x: Math.random() * 480,
    y: Math.random() * 800,
    size: 1 + Math.random() * 2.4,
    speed: 40 + Math.random() * 150,
    alpha: 0.18 + Math.random() * 0.7
  }));
}
function b(e, i) {
  const n = X(i);
  return {
    phase: e,
    stage: n,
    stageIntroTimerMs: e === "stageIntro" ? 1150 : 0,
    timeMs: 0,
    score: 0,
    player: he(),
    enemies: [],
    playerBullets: [],
    enemyBullets: [],
    pickups: [],
    boss: null,
    bossAppeared: !1,
    spawnTimer: n.waves[0].spawnBaseMs,
    stars: si(),
    particles: [],
    announcement: e === "stageSelect" ? "" : n.waves[0].label,
    announcementTimer: e === "playing" ? 850 : 0,
    screenFlashTimer: 0,
    screenFlashColor: "#f8fafc",
    cameraShakeTimer: 0,
    cameraShakeStrength: 0,
    waveLabel: n.waves[0].label,
    waveIndex: 0,
    combo: 0,
    comboTimer: 0,
    stats: {
      kills: 0,
      closeKills: 0,
      grazes: 0,
      longestCombo: 0
    },
    resultRank: "D",
    resultUnlockedStageId: null,
    resultIsNewRecord: !1,
    events: []
  };
}
class li {
  constructor(i) {
    c(this, "canvas");
    c(this, "ctx");
    c(this, "input", {
      up: !1,
      down: !1,
      left: !1,
      right: !1,
      skillPressed: !1
    });
    c(this, "campaignProgress", oe());
    c(this, "state", b("stageSelect", this.campaignProgress.unlockedStageId));
    c(this, "sound", new fe());
    c(this, "animationFrameId", 0);
    c(this, "lastFrameTime", 0);
    c(this, "hoveredTargetId", null);
    c(this, "loop", (i) => {
      this.lastFrameTime === 0 && (this.lastFrameTime = i);
      const n = Math.min(34, i - this.lastFrameTime);
      this.lastFrameTime = i;
      const r = this.state.phase;
      this.state.phase === "playing" ? ai(this.state, this.input, n) : this.state.phase === "stageIntro" ? (this.updateMenuBackground(n), this.state.stageIntroTimerMs = Math.max(0, this.state.stageIntroTimerMs - n), this.state.stageIntroTimerMs === 0 && (this.state.phase = "playing", this.state.announcement = this.state.stage.waves[0].label, this.state.announcementTimer = 850)) : this.updateMenuBackground(n), this.flushAudioEvents(), r === "playing" && this.state.phase !== "playing" && this.finishStageAttempt(), this.render(), this.animationFrameId = window.requestAnimationFrame(this.loop);
    });
    this.canvas = i;
    const n = i.getContext("2d");
    if (!n)
      throw new Error("Unable to create 2D context.");
    this.ctx = n, this.canvas.width = 480, this.canvas.height = 800, this.canvas.style.cursor = "default", this.bindEvents();
  }
  start() {
    this.render(), this.animationFrameId = window.requestAnimationFrame(this.loop);
  }
  updateMenuBackground(i) {
    for (const n of this.state.stars)
      n.y += n.speed * 0.32 * i / 1e3, n.y > 800 && (n.y = -n.size, n.x = Math.random() * 480);
  }
  render() {
    Ce(this.ctx, this.state, this.campaignProgress, this.getCurrentStageBestScore(), this.hoveredTargetId);
  }
  getCurrentStageBestScore() {
    return R(this.campaignProgress, this.state.stage.id).bestScore;
  }
  beginStage(i) {
    i > this.campaignProgress.unlockedStageId || (this.sound.unlock(), this.sound.play("ui-confirm"), this.state = b("stageIntro", i), this.input.skillPressed = !1, this.lastFrameTime = 0, this.hoveredTargetId = null, this.canvas.style.cursor = "default");
  }
  openStageSelect(i = this.campaignProgress.unlockedStageId) {
    this.state = b("stageSelect", Math.min(i, this.campaignProgress.unlockedStageId)), this.input.skillPressed = !1, this.lastFrameTime = 0, this.hoveredTargetId = null, this.canvas.style.cursor = "default";
  }
  retryCurrentStage() {
    this.beginStage(this.state.stage.id);
  }
  finishStageAttempt() {
    const i = le(
      this.campaignProgress,
      this.state.stage,
      this.state.score,
      this.state.phase === "stageClear"
    );
    this.campaignProgress = i.progress, ae(this.campaignProgress), this.state.resultRank = i.rank, this.state.resultUnlockedStageId = i.unlockedStageId, this.state.resultIsNewRecord = i.isNewRecord;
  }
  flushAudioEvents() {
    for (; this.state.events.length > 0; ) {
      const i = this.state.events.shift();
      if (i)
        switch (i.type) {
          case "player-shot":
            this.sound.play("player-shot");
            break;
          case "graze":
            this.sound.play("graze");
            break;
          case "enemy-down":
            this.sound.play(i.closeKill ? "close-kill" : "enemy-down");
            break;
          case "pickup":
            this.sound.play("pickup");
            break;
          case "shield-hit":
            this.sound.play("shield-hit");
            break;
          case "player-hit":
            this.sound.play("player-hit");
            break;
          case "overdrive":
            this.sound.play("overdrive");
            break;
          case "boss-alert":
            this.sound.play("boss-alert");
            break;
          case "stage-clear":
            this.sound.play("stage-clear");
            break;
          case "boss-defeated":
            this.sound.play("boss-defeated");
            break;
          case "game-over":
            this.sound.play("game-over");
            break;
        }
    }
  }
  getCanvasPoint(i, n) {
    const r = this.canvas.getBoundingClientRect();
    return {
      x: (i - r.left) * (this.canvas.width / r.width),
      y: (n - r.top) * (this.canvas.height / r.height)
    };
  }
  getMenuTargetAt(i, n) {
    const r = this.getCanvasPoint(i, n);
    return Z(this.state.phase, this.campaignProgress).find(
      (t) => r.x >= t.x && r.x <= t.x + t.width && r.y >= t.y && r.y <= t.y + t.height
    ) ?? null;
  }
  updateMenuHover(i, n) {
    const r = this.getMenuTargetAt(i, n);
    this.hoveredTargetId = (r == null ? void 0 : r.id) ?? null, this.state.phase === "stageSelect" && (r == null ? void 0 : r.action) === "stage" && r.stageId && this.state.stage.id !== r.stageId && (this.state.stage = X(r.stageId)), this.canvas.style.cursor = r ? "pointer" : "default";
  }
  handleMenuTarget(i) {
    switch (i.action) {
      case "stage":
        i.stageId && this.beginStage(i.stageId);
        break;
      case "retry":
        this.retryCurrentStage();
        break;
      case "back-select":
        this.sound.unlock(), this.sound.play("ui-confirm"), this.openStageSelect(this.state.resultUnlockedStageId ?? Math.min(this.campaignProgress.unlockedStageId, this.state.stage.id + 1));
        break;
    }
  }
  handleEnterAction() {
    if (this.state.phase === "stageSelect") {
      this.beginStage(this.state.stage.id);
      return;
    }
    if (this.state.phase === "gameOver") {
      this.retryCurrentStage();
      return;
    }
    this.state.phase === "stageClear" && (this.sound.unlock(), this.sound.play("ui-confirm"), this.openStageSelect(this.state.resultUnlockedStageId ?? Math.min(this.campaignProgress.unlockedStageId, this.state.stage.id + 1)));
  }
  bindEvents() {
    window.addEventListener("keydown", (i) => {
      const n = i.key.toLowerCase();
      if (this.sound.unlock(), n === "enter") {
        i.preventDefault(), this.handleEnterAction();
        return;
      }
      if (n === " " || n === "spacebar") {
        i.preventDefault(), this.input.skillPressed = !0;
        return;
      }
      n === "arrowup" || n === "w" ? (i.preventDefault(), this.input.up = !0) : n === "arrowdown" || n === "s" ? (i.preventDefault(), this.input.down = !0) : n === "arrowleft" || n === "a" ? (i.preventDefault(), this.input.left = !0) : (n === "arrowright" || n === "d") && (i.preventDefault(), this.input.right = !0);
    }), window.addEventListener("keyup", (i) => {
      const n = i.key.toLowerCase();
      if (n === " " || n === "spacebar") {
        this.input.skillPressed = !1;
        return;
      }
      n === "arrowup" || n === "w" ? this.input.up = !1 : n === "arrowdown" || n === "s" ? this.input.down = !1 : n === "arrowleft" || n === "a" ? this.input.left = !1 : (n === "arrowright" || n === "d") && (this.input.right = !1);
    }), this.canvas.addEventListener("pointermove", (i) => {
      if (this.state.phase === "playing" || this.state.phase === "stageIntro") {
        this.hoveredTargetId && (this.hoveredTargetId = null), this.canvas.style.cursor = "default";
        return;
      }
      this.updateMenuHover(i.clientX, i.clientY);
    }), this.canvas.addEventListener("pointerdown", (i) => {
      if (this.sound.unlock(), this.state.phase === "playing" || this.state.phase === "stageIntro")
        return;
      const n = this.getMenuTargetAt(i.clientX, i.clientY);
      n && (i.preventDefault(), this.handleMenuTarget(n));
    }), this.canvas.addEventListener("pointerleave", () => {
      this.hoveredTargetId = null, this.canvas.style.cursor = "default";
    }), window.addEventListener("blur", () => {
      this.input.up = !1, this.input.down = !1, this.input.left = !1, this.input.right = !1, this.input.skillPressed = !1, this.hoveredTargetId = null, this.canvas.style.cursor = "default";
    });
  }
  destroy() {
    window.cancelAnimationFrame(this.animationFrameId);
  }
}
const j = document.querySelector("#game-canvas");
if (!j)
  throw new Error("未找到游戏画布。");
const hi = new li(j);
hi.start();
