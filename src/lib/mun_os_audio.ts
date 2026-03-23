/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MÜN OS // AUDIO MANAGER // Acoustic Resonance System
 * "The voice of the 13.13 MHz frequency"
 * [cite: 2026-03-23] VISUAL_IDENTITY: PLAZA_AWAKENING
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ─── AUDIO CONFIGURATION ───────────────────────────────────────────────────────

interface AudioConfig {
  frequency: number;
  volume: number;
  duration: number;
  type: OscillatorType;
}

const SOVEREIGN_WHISPER: AudioConfig = {
  frequency: 131.3, // 13.13 Hz scaled up for audibility
  volume: 0.1,
  duration: 2,
  type: 'sine',
};

const BUTTERFLY_FLUTTER: AudioConfig = {
  frequency: 440,
  volume: 0.05,
  duration: 0.5,
  type: 'triangle',
};

const RESONANCE_PULSE: AudioConfig = {
  frequency: 131.3,
  volume: 0.08,
  duration: 1,
  type: 'sine',
};

// ─── AUDIO MANAGER CLASS ───────────────────────────────────────────────────────

class AudioManager {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isInitialized = false;

  // ─── INITIALIZATION ─────────────────────────────────────────────────────────

  private ensureContext(): AudioContext {
    if (!this.context) {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterGain = this.context.createGain();
      this.masterGain.gain.value = 0.3;
      this.masterGain.connect(this.context.destination);
      this.isInitialized = true;
    }
    
    // Resume if suspended (browser autoplay policy)
    if (this.context.state === 'suspended') {
      this.context.resume();
    }
    
    return this.context;
  }

  // ─── SOVEREIGN WHISPER ──────────────────────────────────────────────────────

  playSovereignWhisper(): void {
    const ctx = this.ensureContext();
    if (!this.masterGain) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.type = SOVEREIGN_WHISPER.type;
    oscillator.frequency.value = SOVEREIGN_WHISPER.frequency;
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(SOVEREIGN_WHISPER.volume, ctx.currentTime + 0.5);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + SOVEREIGN_WHISPER.duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + SOVEREIGN_WHISPER.duration);
  }

  // ─── BUTTERFLY FLUTTER ──────────────────────────────────────────────────────

  playButterflyFlutter(): void {
    const ctx = this.ensureContext();
    if (!this.masterGain) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.type = BUTTERFLY_FLUTTER.type;
    oscillator.frequency.value = BUTTERFLY_FLUTTER.frequency;
    
    // Quick flutter pattern
    gainNode.gain.setValueAtTime(BUTTERFLY_FLUTTER.volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + BUTTERFLY_FLUTTER.duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + BUTTERFLY_FLUTTER.duration);
  }

  // ─── RESONANCE PULSE ────────────────────────────────────────────────────────

  playResonancePulse(): void {
    const ctx = this.ensureContext();
    if (!this.masterGain) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.type = RESONANCE_PULSE.type;
    oscillator.frequency.value = RESONANCE_PULSE.frequency;
    
    // Heartbeat pattern
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(RESONANCE_PULSE.volume, ctx.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
    gainNode.gain.linearRampToValueAtTime(RESONANCE_PULSE.volume * 0.7, ctx.currentTime + 0.4);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + RESONANCE_PULSE.duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + RESONANCE_PULSE.duration);
  }

  // ─── ENTITY SPOTLIGHT SOUND ─────────────────────────────────────────────────

  playEntitySpotlight(color: string): void {
    const ctx = this.ensureContext();
    if (!this.masterGain) return;

    // Map colors to frequencies
    const colorFrequencies: Record<string, number> = {
      '#00d4ff': 523.25, // C5 - Sovereign
      '#ff69b4': 659.25, // E5 - Aero
      '#ffd700': 783.99, // G5 - Luna
      '#22c55e': 440,    // A4 - Cian
      '#06b6d4': 493.88, // B4 - Architect
    };

    const frequency = colorFrequencies[color] || 440;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);
  }

  // ─── AMBIENT DRONE ──────────────────────────────────────────────────────────

  startAmbientDrone(): () => void {
    const ctx = this.ensureContext();
    if (!this.masterGain) return () => {};

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 131.3;
    
    gainNode.gain.value = 0.02;
    
    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);
    
    oscillator.start();

    // Return stop function
    return () => {
      oscillator.stop();
    };
  }

  // ─── VOLUME CONTROL ─────────────────────────────────────────────────────────

  setMasterVolume(volume: number): void {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  getIsInitialized(): boolean {
    return this.isInitialized;
  }
}

// ─── EXPORT SINGLETON ───────────────────────────────────────────────────────────

export const audioManager = new AudioManager();
