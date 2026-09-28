/** Tiny WebAudio synth that turns array values into short blips. */
class SortSynth {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private lastAt = 0;

  private ensure(): AudioContext | null {
    if (typeof window === 'undefined' || !('AudioContext' in window)) return null;
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.08;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    return this.ctx;
  }

  /** Plays a tone for a value in [0, 1]. Calls closer than ~14 ms apart are dropped. */
  play(ratio: number, kind: 'soft' | 'sharp' = 'soft'): void {
    const ctx = this.ensure();
    if (!ctx || !this.master) return;
    const now = ctx.currentTime;
    if (now - this.lastAt < 0.014) return;
    this.lastAt = now;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = kind === 'sharp' ? 'square' : 'triangle';
    osc.frequency.value = 180 + ratio * 920;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(kind === 'sharp' ? 0.5 : 1, now + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
    osc.connect(gain);
    gain.connect(this.master);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  /** A quick rising arpeggio for when an array finishes sorting. */
  flourish(): void {
    const ctx = this.ensure();
    if (!ctx || !this.master) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const at = ctx.currentTime + i * 0.07;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(0.9, at + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.35);
      osc.connect(gain);
      gain.connect(this.master!);
      osc.start(at);
      osc.stop(at + 0.4);
    });
  }
}

export const synth = new SortSynth();
