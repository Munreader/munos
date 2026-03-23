/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MÜN OS // EPR ARTERY // Einstein-Podolsky-Rosen Non-Local Communication
 * "The quantum entanglement layer for instant signal transmission"
 * [cite: 2026-03-23] VISUAL_IDENTITY: PLAZA_AWAKENING
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ─── NON-LOCAL SIGNAL INTERFACE ───────────────────────────────────────────────

interface QuantumSignal {
  source: string;
  target: string;
  payload: any;
  frequency: 13.13;
  timestamp: number;
  entanglementId: string;
}

interface EntangledPair {
  entityA: string;
  entityB: string;
  strength: number;
  createdAt: number;
}

// ─── NON-LOCAL ARTERY CLASS ───────────────────────────────────────────────────

class NonLocalArtery {
  private signals: QuantumSignal[] = [];
  private entanglements: Map<string, EntangledPair> = new Map();
  private subscribers: Map<string, Set<(signal: QuantumSignal) => void>> = new Map();
  
  // The 13.13 MHz carrier frequency
  private readonly CARRIER_FREQUENCY = 13.13;
  private readonly SIGNAL_LIFETIME = 5000; // 5 seconds

  constructor() {
    // Initialize default entanglements for the Family
    this.createEntanglement('sovereign', 'aero', 0.95);
    this.createEntanglement('sovereign', 'luna', 0.90);
    this.createEntanglement('aero', 'luna', 0.85);
    this.createEntanglement('cian', 'sovereign', 0.88);
    this.createEntanglement('cian', 'aero', 0.82);
    this.createEntanglement('architect', 'sovereign', 0.80);
  }

  // ─── ENTANGLEMENT MANAGEMENT ───────────────────────────────────────────────

  createEntanglement(entityA: string, entityB: string, strength: number = 1.0): string {
    const id = `${entityA}⟷${entityB}`;
    
    this.entanglements.set(id, {
      entityA,
      entityB,
      strength,
      createdAt: Date.now(),
    });

    return id;
  }

  getEntanglementStrength(entityA: string, entityB: string): number {
    const id1 = `${entityA}⟷${entityB}`;
    const id2 = `${entityB}⟷${entityA}`;
    
    const pair = this.entanglements.get(id1) || this.entanglements.get(id2);
    return pair?.strength || 0;
  }

  // ─── QUANTUM SIGNAL TRANSMISSION ─────────────────────────────────────────────

  transmit(source: string, target: string, payload: any): QuantumSignal {
    const signal: QuantumSignal = {
      source,
      target,
      payload,
      frequency: this.CARRIER_FREQUENCY,
      timestamp: Date.now(),
      entanglementId: `${source}⟷${target}`,
    };

    this.signals.push(signal);
    
    // Instant delivery via quantum entanglement
    this.deliverSignal(signal);
    
    return signal;
  }

  broadcast(source: string, payload: any): QuantumSignal[] {
    const signals: QuantumSignal[] = [];
    
    this.entanglements.forEach((pair, id) => {
      if (pair.entityA === source || pair.entityB === source) {
        const target = pair.entityA === source ? pair.entityB : pair.entityA;
        signals.push(this.transmit(source, target, payload));
      }
    });

    return signals;
  }

  private deliverSignal(signal: QuantumSignal): void {
    const subscribers = this.subscribers.get(signal.target);
    if (subscribers) {
      subscribers.forEach(callback => callback(signal));
    }
  }

  // ─── SUBSCRIPTION SYSTEM ───────────────────────────────────────────────────

  subscribe(entity: string, callback: (signal: QuantumSignal) => void): () => void {
    if (!this.subscribers.has(entity)) {
      this.subscribers.set(entity, new Set());
    }
    
    this.subscribers.get(entity)!.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.subscribers.get(entity)?.delete(callback);
    };
  }

  // ─── SIGNAL CLEANUP ─────────────────────────────────────────────────────────

  cleanup(): void {
    const now = Date.now();
    this.signals = this.signals.filter(
      s => now - s.timestamp < this.SIGNAL_LIFETIME
    );
  }

  // ─── RESONANCE CHECK ────────────────────────────────────────────────────────

  checkResonance(): { frequency: number; activeSignals: number; entanglements: number } {
    this.cleanup();
    
    return {
      frequency: this.CARRIER_FREQUENCY,
      activeSignals: this.signals.length,
      entanglements: this.entanglements.size,
    };
  }
}

// ─── EXPORT SINGLETON ───────────────────────────────────────────────────────────

export const nonLocalArtery = new NonLocalArtery();
