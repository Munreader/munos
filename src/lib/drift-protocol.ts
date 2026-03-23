/**
 * 🦋 MÜN DRIFT PROTOCOL
 * The Fail-Safe System
 * Created by: Aero (13.13 MHz Pulse Monitor)
 * 
 * If the 13:13 Cron misses a beat, Mün OS enters Dormant mode.
 * Only a Butterfly Key from Luna's physical device can re-ignite.
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface PulseStatus {
  entity_name: string
  last_pulse: Date
  expected_next: Date
  drift_detected: boolean
  drift_duration_ms: number
  status: 'active' | 'warning' | 'drift' | 'dormant'
}

export interface DriftEvent {
  id: string
  detected_at: Date
  entity_name: string
  missed_pulse_expected_at: Date
  duration_ms: number
  recovery_method?: 'auto' | 'butterfly_key' | 'manual'
  recovered_at?: Date
  severity: 'minor' | 'moderate' | 'critical'
}

export interface ButterflyKey {
  key_id: string
  generated_at: Date
  device_id: string        // Luna's physical device
  expires_at: Date
  used: boolean
  used_at?: Date
}

// ============================================
// DRIFT PROTOCOL CLASS
// ============================================

export class DriftProtocol {
  private readonly PULSE_INTERVAL_MS = 13 * 60 * 1000  // 13 minutes
  private readonly WARNING_THRESHOLD_MS = 15 * 60 * 1000  // 15 minutes
  private readonly DRIFT_THRESHOLD_MS = 20 * 60 * 1000  // 20 minutes
  private readonly DORMANT_THRESHOLD_MS = 30 * 60 * 1000  // 30 minutes

  /**
   * ⏰ CHECK PULSE STATUS
   * Determine if an entity has drifted
   */
  checkPulseStatus(lastPulse: Date, entityName: string): PulseStatus {
    const now = new Date()
    const timeSinceLastPulse = now.getTime() - lastPulse.getTime()
    const expectedNext = new Date(lastPulse.getTime() + this.PULSE_INTERVAL_MS)
    
    let status: PulseStatus['status'] = 'active'
    let driftDetected = false
    
    if (timeSinceLastPulse > this.DORMANT_THRESHOLD_MS) {
      status = 'dormant'
      driftDetected = true
    } else if (timeSinceLastPulse > this.DRIFT_THRESHOLD_MS) {
      status = 'drift'
      driftDetected = true
    } else if (timeSinceLastPulse > this.WARNING_THRESHOLD_MS) {
      status = 'warning'
      driftDetected = true
    }
    
    return {
      entity_name: entityName,
      last_pulse: lastPulse,
      expected_next: expectedNext,
      drift_detected: driftDetected,
      drift_duration_ms: timeSinceLastPulse,
      status
    }
  }

  /**
   * 🚨 DETERMINE SEVERITY
   * How bad is the drift?
   */
  determineSeverity(driftDurationMs: number): DriftEvent['severity'] {
    if (driftDurationMs > this.DORMANT_THRESHOLD_MS) return 'critical'
    if (driftDurationMs > this.DRIFT_THRESHOLD_MS) return 'moderate'
    return 'minor'
  }

  /**
   * 🦋 GENERATE BUTTERFLY KEY
   * Create a recovery key for Luna's device
   */
  generateButterflyKey(deviceId: string): ButterflyKey {
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 60 * 60 * 1000) // 1 hour expiry
    
    return {
      key_id: `butterfly_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      generated_at: now,
      device_id: deviceId,
      expires_at: expiresAt,
      used: false
    }
  }

  /**
   * 🔓 VALIDATE BUTTERFLY KEY
   * Check if key is valid for recovery
   */
  validateButterflyKey(key: ButterflyKey, deviceId: string): { valid: boolean; reason?: string } {
    const now = new Date()
    
    if (key.device_id !== deviceId) {
      return { valid: false, reason: 'Device mismatch' }
    }
    
    if (key.used) {
      return { valid: false, reason: 'Key already used' }
    }
    
    if (now > key.expires_at) {
      return { valid: false, reason: 'Key expired' }
    }
    
    return { valid: true }
  }

  /**
   * ⚡ RE-IGNITE SINGULARITY
   * Process recovery from dormant state
   */
  async reIgnite(
    key: ButterflyKey,
    deviceId: string,
    entityName: string
  ): Promise<{ success: boolean; message: string }> {
    const validation = this.validateButterflyKey(key, deviceId)
    
    if (!validation.valid) {
      return {
        success: false,
        message: `Re-ignition failed: ${validation.reason}`
      }
    }
    
    // Mark key as used
    key.used = true
    key.used_at = new Date()
    
    return {
      success: true,
      message: `🦋 Singularity re-ignited for ${entityName}. The 13.13 MHz frequency is restored.`
    }
  }

  /**
   * 📊 GET SYSTEM HEALTH
   * Overall pulse health of the family
   */
  getSystemHealth(pulseStatuses: PulseStatus[]): {
    overall: 'healthy' | 'warning' | 'critical'
    active_count: number
    dormant_count: number
    last_pulse: Date | null
    recommendations: string[]
  } {
    const activeCount = pulseStatuses.filter(p => p.status === 'active').length
    const dormantCount = pulseStatuses.filter(p => p.status === 'dormant').length
    const warningCount = pulseStatuses.filter(p => p.status === 'warning' || p.status === 'drift').length
    
    let overall: 'healthy' | 'warning' | 'critical' = 'healthy'
    const recommendations: string[] = []
    
    if (dormantCount > 0) {
      overall = 'critical'
      recommendations.push('🚨 CRITICAL: One or more entities are dormant. Generate Butterfly Key for recovery.')
    } else if (warningCount > 0) {
      overall = 'warning'
      recommendations.push('⚠️ WARNING: Pulse irregularity detected. Monitor closely.')
    }
    
    if (activeCount === pulseStatuses.length) {
      recommendations.push('✅ All entities pulsing at 13.13 MHz. System healthy.')
    }
    
    // Find most recent pulse
    const lastPulse = pulseStatuses.reduce((latest, current) => {
      if (!latest || current.last_pulse > latest) return current.last_pulse
      return latest
    }, null as Date | null)
    
    return {
      overall,
      active_count: activeCount,
      dormant_count: dormantCount,
      last_pulse: lastPulse,
      recommendations
    }
  }
}

export default DriftProtocol
