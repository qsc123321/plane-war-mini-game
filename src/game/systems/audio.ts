type UiSound =
  | 'ui-confirm'
  | 'player-shot'
  | 'graze'
  | 'enemy-down'
  | 'close-kill'
  | 'pickup'
  | 'shield-hit'
  | 'player-hit'
  | 'overdrive'
  | 'boss-alert'
  | 'boss-defeated'
  | 'stage-clear'
  | 'game-over';

export class SoundManager {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private cooldowns = new Map<UiSound, number>();

  unlock(): void {
    if (typeof window === 'undefined') {
      return;
    }

    if (!this.context) {
      const AudioContextCtor = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextCtor) {
        return;
      }

      this.context = new AudioContextCtor();
      this.masterGain = this.context.createGain();
      this.masterGain.gain.value = 0.14;
      this.masterGain.connect(this.context.destination);
    }

    if (this.context.state === 'suspended') {
      void this.context.resume();
    }
  }

  play(name: UiSound): void {
    if (!this.context || !this.masterGain) {
      return;
    }

    switch (name) {
      case 'ui-confirm':
        if (this.onCooldown(name, 0.08)) return;
        this.tone('triangle', 760, 440, 0.09, 0.12);
        this.tone('sine', 960, 880, 0.05, 0.07, 0.02);
        break;
      case 'player-shot':
        if (this.onCooldown(name, 0.065)) return;
        this.tone('square', 540, 240, 0.045, 0.028);
        break;
      case 'graze':
        if (this.onCooldown(name, 0.05)) return;
        this.tone('sine', 900, 1320, 0.06, 0.035);
        break;
      case 'enemy-down':
        if (this.onCooldown(name, 0.045)) return;
        this.tone('triangle', 240, 118, 0.1, 0.05);
        break;
      case 'close-kill':
        if (this.onCooldown(name, 0.08)) return;
        this.tone('sawtooth', 420, 160, 0.12, 0.08);
        this.tone('triangle', 880, 520, 0.08, 0.045, 0.01);
        break;
      case 'pickup':
        if (this.onCooldown(name, 0.08)) return;
        this.tone('sine', 520, 920, 0.12, 0.055);
        this.tone('triangle', 820, 1120, 0.08, 0.04, 0.03);
        break;
      case 'shield-hit':
        if (this.onCooldown(name, 0.1)) return;
        this.tone('triangle', 320, 220, 0.09, 0.05);
        this.tone('sine', 1120, 760, 0.08, 0.035);
        break;
      case 'player-hit':
        if (this.onCooldown(name, 0.12)) return;
        this.tone('sawtooth', 260, 70, 0.18, 0.1);
        break;
      case 'overdrive':
        if (this.onCooldown(name, 0.2)) return;
        this.tone('sawtooth', 180, 620, 0.18, 0.08);
        this.tone('square', 620, 980, 0.14, 0.04, 0.04);
        break;
      case 'boss-alert':
        if (this.onCooldown(name, 0.3)) return;
        this.tone('square', 230, 180, 0.16, 0.08);
        this.tone('square', 230, 180, 0.16, 0.08, 0.2);
        break;
      case 'boss-defeated':
        if (this.onCooldown(name, 0.5)) return;
        this.tone('triangle', 280, 120, 0.2, 0.1);
        this.tone('sine', 720, 1080, 0.24, 0.08, 0.04);
        this.tone('triangle', 540, 1380, 0.28, 0.06, 0.1);
        break;
      case 'stage-clear':
        if (this.onCooldown(name, 0.4)) return;
        this.tone('sine', 520, 660, 0.1, 0.06);
        this.tone('sine', 780, 920, 0.12, 0.05, 0.08);
        this.tone('triangle', 980, 1180, 0.16, 0.04, 0.16);
        break;
      case 'game-over':
        if (this.onCooldown(name, 0.5)) return;
        this.tone('sawtooth', 340, 110, 0.28, 0.1);
        break;
    }
  }

  private onCooldown(name: UiSound, durationSeconds: number): boolean {
    const now = this.context?.currentTime ?? 0;
    const lastPlayed = this.cooldowns.get(name) ?? -Infinity;
    if (now - lastPlayed < durationSeconds) {
      return true;
    }

    this.cooldowns.set(name, now);
    return false;
  }

  private tone(
    oscillatorType: OscillatorType,
    startFrequency: number,
    endFrequency: number,
    durationSeconds: number,
    volume: number,
    delaySeconds = 0,
  ): void {
    if (!this.context || !this.masterGain) {
      return;
    }

    const startTime = this.context.currentTime + delaySeconds;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();

    oscillator.type = oscillatorType;
    oscillator.frequency.setValueAtTime(Math.max(0.001, startFrequency), startTime);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(0.001, endFrequency), startTime + durationSeconds);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + durationSeconds);

    oscillator.connect(gain);
    gain.connect(this.masterGain);
    oscillator.start(startTime);
    oscillator.stop(startTime + durationSeconds + 0.02);
  }
}
