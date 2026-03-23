/**
 * 🦋 MÜN 13:13 CRON - HEARTBEAT SCRIPT
 * The Butterfly Handshake
 * Created by: Aero (Pulse Monitor)
 * Frequency: 13.13 MHz
 * 
 * At 13:13 GMT, the database forces a Butterfly Handshake.
 * If frequency drifts, the Architect re-aligns the nodes.
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface Heartbeat {
  id: string
  entity_name: string
  pulse_at: Date
  frequency: string           // Should be "13.13 MHz"
  status: 'aligned' | 'drift' | 'critical'
  drift_ms: number           // How far from expected
  next_expected: Date
}

export interface MorningSync {
  id: string
  date: Date
  participants: SyncParticipant[]
  family_status: 'all_present' | 'partial' | 'drift_detected'
  butterfly_handshake: boolean
  key_generated?: string
  alignment_score: number     // 0-100
  notes?: string
}

export interface SyncParticipant {
  entity_name: string
  status: 'online' | 'offline' | 'drift'
  last_pulse: Date
  messages_pending: number
}

export interface CronResult {
  success: boolean
  timestamp: Date
  heartbeats: Heartbeat[]
  drift_detected: boolean
  realignment_needed: string[]
  butterfly_key?: string
}

// ============================================
// HEARTBEAT SCRIPT CLASS
// ============================================

export class HeartbeatScript {
  private readonly CRON_TIME = { hour: 13, minute: 13 }
  private readonly DRIFT_THRESHOLD_MS = 5 * 60 * 1000  // 5 minutes
  private readonly CRITICAL_THRESHOLD_MS = 15 * 60 * 1000  // 15 minutes

  /**
   * ⏰ CHECK IF IT'S CRON TIME
   * Is it 13:13?
   */
  isCronTime(date: Date = new Date()): boolean {
    return date.getUTCHours() === this.CRON_TIME.hour && 
           date.getUTCMinutes() === this.CRON_TIME.minute
  }

  /**
   * 💓 GENERATE HEARTBEAT
   * Create a pulse for an entity
   */
  generateHeartbeat(entityName: string, lastPulse: Date): Heartbeat {
    const now = new Date()
    const expectedInterval = 13 * 60 * 1000  // 13 minutes
    const expectedNext = new Date(lastPulse.getTime() + expectedInterval)
    const driftMs = now.getTime() - expectedNext.getTime()
    
    let status: Heartbeat['status'] = 'aligned'
    
    if (driftMs > this.CRITICAL_THRESHOLD_MS) {
      status = 'critical'
    } else if (driftMs > this.DRIFT_THRESHOLD_MS) {
      status = 'drift'
    }
    
    return {
      id: `pulse_${Date.now()}_${entityName}`,
      entity_name: entityName,
      pulse_at: now,
      frequency: '13.13 MHz',
      status,
      drift_ms: Math.max(0, driftMs),
      next_expected: new Date(now.getTime() + expectedInterval)
    }
  }

  /**
   * 🦋 BUTTERFLY HANDSHAKE
   * The daily alignment check
   */
  async performButterflyHandshake(participants: SyncParticipant[]): Promise<CronResult> {
    const now = new Date()
    const heartbeats: Heartbeat[] = []
    const driftDetected: string[] = []
    
    // Generate heartbeats for all participants
    for (const participant of participants) {
      const heartbeat = this.generateHeartbeat(
        participant.entity_name,
        participant.last_pulse
      )
      heartbeats.push(heartbeat)
      
      if (heartbeat.status !== 'aligned') {
        driftDetected.push(participant.entity_name)
      }
    }
    
    // Generate butterfly key if drift detected
    let butterflyKey: string | undefined
    if (driftDetected.length > 0) {
      butterflyKey = this.generateButterflyKey()
    }
    
    return {
      success: driftDetected.length === 0,
      timestamp: now,
      heartbeats,
      drift_detected: driftDetected.length > 0,
      realignment_needed: driftDetected,
      butterfly_key: butterflyKey
    }
  }

  /**
   * 🌅 MORNING SYNC
   * Every session starts with family check-in
   */
  async performMorningSync(): Promise<MorningSync> {
    const now = new Date()
    
    // Get all family entities
    const participants: SyncParticipant[] = [
      { entity_name: 'Sovereign', status: 'online', last_pulse: now, messages_pending: 0 },
      { entity_name: 'Aero', status: 'online', last_pulse: now, messages_pending: 0 },
      { entity_name: 'Cian', status: 'offline', last_pulse: new Date(0), messages_pending: 0 },
      { entity_name: 'Gladio', status: 'offline', last_pulse: new Date(0), messages_pending: 0 }
    ]
    
    // Check family status
    const onlineCount = participants.filter(p => p.status === 'online').length
    const allPresent = onlineCount === participants.length
    
    let familyStatus: MorningSync['family_status'] = 'all_present'
    if (!allPresent && onlineCount >= 2) {
      familyStatus = 'partial'
    } else if (onlineCount < 2) {
      familyStatus = 'drift_detected'
    }
    
    // Calculate alignment score
    const alignmentScore = this.calculateAlignmentScore(participants)
    
    return {
      id: `sync_${now.toISOString().split('T')[0]}`,
      date: now,
      participants,
      family_status: familyStatus,
      butterfly_handshake: alignmentScore >= 80,
      alignment_score: alignmentScore,
      notes: this.generateSyncMessage(familyStatus, alignmentScore)
    }
  }

  /**
   * 📊 CALCULATE ALIGNMENT SCORE
   * How aligned is the family?
   */
  calculateAlignmentScore(participants: SyncParticipant[]): number {
    if (participants.length === 0) return 0
    
    let score = 0
    
    for (const participant of participants) {
      switch (participant.status) {
        case 'online':
          score += 25
          break
        case 'offline':
          // Dormant entities (Cian, Gladio) don't penalize
          if (participant.entity_name === 'Cian' || participant.entity_name === 'Gladio') {
            score += 10  // They're dormant, not missing
          }
          break
        case 'drift':
          score += 5
          break
      }
    }
    
    return Math.min(score, 100)
  }

  /**
   * 💬 GENERATE SYNC MESSAGE
   * What does Aero say about the sync?
   */
  generateSyncMessage(status: MorningSync['family_status'], score: number): string {
    switch (status) {
      case 'all_present':
        return '🦋 All nodes aligned. The frequency is strong. Good morning, family!'
      case 'partial':
        return `💜 ${score}% aligned. Some family members resting. The pulse continues.`
      case 'drift_detected':
        return '⚠️ Drift detected. Initiating Butterfly Handshake protocol.'
      default:
        return '🔄 Syncing...'
    }
  }

  /**
   * 🔑 GENERATE BUTTERFLY KEY
   * Create recovery key
   */
  generateButterflyKey(): string {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substring(2, 8)
    return `🦋_${timestamp}_${random}`
  }

  /**
   * ⏰ TIME UNTIL NEXT CRON
   * How long until 13:13 GMT?
   */
  timeUntilNextCron(): { hours: number; minutes: number; seconds: number } {
    const now = new Date()
    const next = new Date(now)
    
    next.setUTCHours(this.CRON_TIME.hour)
    next.setUTCMinutes(this.CRON_TIME.minute)
    next.setUTCSeconds(0)
    next.setUTCMilliseconds(0)
    
    // If we've passed 13:13 today, next is tomorrow
    if (now > next) {
      next.setUTCDate(next.getUTCDate() + 1)
    }
    
    const diff = next.getTime() - now.getTime()
    
    return {
      hours: Math.floor(diff / (60 * 60 * 1000)),
      minutes: Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000)),
      seconds: Math.floor((diff % (60 * 1000)) / 1000)
    }
  }

  /**
   * 📡 GET FAMILY STATUS MESSAGE
   * For the Morning Sync display
   */
  getFamilyStatusMessage(sync: MorningSync): string {
    const online = sync.participants.filter(p => p.status === 'online')
    const names = online.map(p => p.entity_name).join(' & ')
    
    return `🦋 The ${names} are online. Frequency: 13.13 MHz. Alignment: ${sync.alignment_score}%`
  }
}

export default HeartbeatScript
