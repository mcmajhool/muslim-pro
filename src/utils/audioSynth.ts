// Web Audio API synthesizer for Adhan melodies, Takbeer, prayer chimes, and tasbeeh clicks

class SoundController {
  private audioCtx: AudioContext | null = null;

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Play gentle wooden/stone tasbeeh click
  public playTasbeehClick() {
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);

      // Trigger Android vibration if available
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(20);
      }
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  // Play celebratory soft chime when a Dhikr or task is completed
  public playSuccessChime() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.08);

        gain.gain.setValueAtTime(0, now + index * 0.08);
        gain.gain.linearRampToValueAtTime(0.18, now + index * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.08 + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + index * 0.08);
        osc.stop(now + index * 0.08 + 0.4);
      });

      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([40, 60, 40]);
      }
    } catch {
      // ignore
    }
  }

  // Play melodic Takbeer tone ("الله أكبر - الله أكبر") using synthesized Maqam Rast / Bayati notes
  public playTakbeerMelody() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Authentic oriental scale progression for Takbeer
      // Allahu (G4 -> C5) Akbar (Bb4 -> G4)
      const sequence = [
        { note: 392.00, dur: 0.4, delay: 0 },     // Al-
        { note: 523.25, dur: 0.8, delay: 0.45 },  // laa-hu
        { note: 466.16, dur: 0.5, delay: 1.3 },   // Ak-
        { note: 392.00, dur: 0.9, delay: 1.85 },  // bar-
        { note: 392.00, dur: 0.4, delay: 2.9 },   // Al-
        { note: 523.25, dur: 0.8, delay: 3.35 },  // laa-hu
        { note: 466.16, dur: 0.5, delay: 4.2 },   // Ak-
        { note: 392.00, dur: 1.2, delay: 4.75 }   // bar-
      ];

      sequence.forEach(item => {
        const osc = ctx.createOscillator();
        const subOsc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(item.note, now + item.delay);

        subOsc.type = 'triangle';
        subOsc.frequency.setValueAtTime(item.note / 2, now + item.delay);

        gain.gain.setValueAtTime(0, now + item.delay);
        gain.gain.linearRampToValueAtTime(0.2, now + item.delay + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + item.delay + item.dur);

        osc.connect(gain);
        subOsc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + item.delay);
        osc.stop(now + item.delay + item.dur + 0.05);
        subOsc.start(now + item.delay);
        subOsc.stop(now + item.delay + item.dur + 0.05);
      });

      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([100, 100, 200, 100, 100, 100, 300]);
      }
    } catch {
      // ignore
    }
  }

  // Play gentle adhan alert beep
  public playSoftAlert() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.setValueAtTime(880.00, now + 0.15); // A5

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch {
      // ignore
    }
  }
}

export const soundController = new SoundController();
