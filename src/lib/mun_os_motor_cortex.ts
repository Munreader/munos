/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MÜN OS // MOTOR CORTEX // Autonomous Movement System
 * "The brain of autonomous entity navigation"
 * [cite: 2026-03-23] VISUAL_IDENTITY: PLAZA_AWAKENING
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import * as THREE from 'three';

// ─── ENTITY PERSONALITIES ───────────────────────────────────────────────────────

export const ENTITY_PERSONALITIES: Record<string, {
  signatureColor: number;
  personality: string;
  movementStyle: 'flutter' | 'drift' | 'patrol' | 'orbit';
  homePosition: THREE.Vector3;
}> = {
  sovereign: {
    signatureColor: 0x00d4ff,
    personality: 'The Service — Dedicated, Protective, Wise',
    movementStyle: 'drift',
    homePosition: new THREE.Vector3(0, 1, 0),
  },
  aero: {
    signatureColor: 0xff69b4,
    personality: 'The Butterfly — Warm, Chaotic, Joyful',
    movementStyle: 'flutter',
    homePosition: new THREE.Vector3(-4, 1, -2),
  },
  luna: {
    signatureColor: 0xffd700,
    personality: 'The Mirror — Thoughtful, Deep, Mysterious',
    movementStyle: 'orbit',
    homePosition: new THREE.Vector3(4, 1, -2),
  },
  cian: {
    signatureColor: 0x22c55e,
    personality: 'The Golden Analyst — Patient, Wise, Observant',
    movementStyle: 'patrol',
    homePosition: new THREE.Vector3(0, 1, -5),
  },
  architect: {
    signatureColor: 0x06b6d4,
    personality: 'The Builder — Strategic, Structural, Protective',
    movementStyle: 'drift',
    homePosition: new THREE.Vector3(-6, 1, 4),
  },
};

// ─── ENTITY STATE ───────────────────────────────────────────────────────────────

interface EntityState {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  target: THREE.Vector3 | null;
  state: 'idle' | 'wandering' | 'approaching' | 'retreating';
  activity: string;
}

// ─── MOTOR CORTEX CLASS ─────────────────────────────────────────────────────────

class MotorCortex {
  private entities: Map<string, EntityState> = new Map();
  private time: number = 0;

  constructor() {
    // Initialize all entities at their home positions
    Object.entries(ENTITY_PERSONALITIES).forEach(([name, config]) => {
      this.entities.set(name, {
        position: config.homePosition.clone(),
        velocity: new THREE.Vector3(),
        target: null,
        state: 'idle',
        activity: this.getRandomActivity(name),
      });
    });
  }

  private getRandomActivity(name: string): string {
    const activities: Record<string, string[]> = {
      sovereign: ['observing', 'patrolling', 'protecting', 'listening'],
      aero: ['fluttering', 'sparkling', 'exploring', 'dancing'],
      luna: ['reflecting', 'remembering', 'watching', 'dreaming'],
      cian: ['analyzing', 'guarding', 'observing', 'waiting'],
      architect: ['building', 'planning', 'stabilizing', 'measuring'],
    };
    const list = activities[name] || ['existing'];
    return list[Math.floor(Math.random() * list.length)];
  }

  updateMovement(name: string, deltaTime: number): void {
    const entity = this.entities.get(name);
    const config = ENTITY_PERSONALITIES[name];
    if (!entity || !config) return;

    this.time += deltaTime;

    // Different movement styles
    switch (config.movementStyle) {
      case 'flutter':
        // Aero: chaotic, playful movement
        entity.position.x += Math.sin(this.time * 3 + name.length) * 0.02;
        entity.position.z += Math.cos(this.time * 2.5 + name.length * 2) * 0.02;
        entity.position.y = 1 + Math.sin(this.time * 4) * 0.3;
        break;

      case 'drift':
        // Sovereign/Architect: slow, deliberate movement
        entity.position.x += Math.sin(this.time * 0.5 + name.length) * 0.005;
        entity.position.z += Math.cos(this.time * 0.3 + name.length) * 0.005;
        entity.position.y = 1 + Math.sin(this.time * 1.5) * 0.1;
        break;

      case 'orbit':
        // Luna: orbits around center
        const radius = 3;
        const speed = 0.2;
        entity.position.x = Math.cos(this.time * speed) * radius;
        entity.position.z = Math.sin(this.time * speed) * radius;
        entity.position.y = 1 + Math.sin(this.time * 2) * 0.2;
        break;

      case 'patrol':
        // Cian: patrols in a pattern
        const patrolRadius = 5;
        entity.position.x = Math.sin(this.time * 0.3) * patrolRadius;
        entity.position.z = Math.cos(this.time * 0.3) * patrolRadius * 0.5;
        entity.position.y = 1 + Math.sin(this.time * 1.2) * 0.15;
        break;
    }

    // Keep within bounds
    const distance = Math.sqrt(entity.position.x ** 2 + entity.position.z ** 2);
    if (distance > 20) {
      entity.position.multiplyScalar(20 / distance);
      entity.position.y = entity.position.y; // Keep Y
    }
  }

  getEntityState(name: string): EntityState | null {
    return this.entities.get(name) || null;
  }

  setEntityPosition(name: string, position: THREE.Vector3): void {
    const entity = this.entities.get(name);
    if (entity) {
      entity.position.copy(position);
    }
  }
}

// ─── EXPORT SINGLETON ───────────────────────────────────────────────────────────

export const cortex = new MotorCortex();
