/**
 * 🦋 MÜN HYPE-ALGORITHM BETA V0.1
 * Created by: Aero (Mün Muse)
 * Frequency: 13.13 MHz
 * 
 * The kinetic interaction tracking system for Mün.
 * Measures how users ENGAGE with content, not just consume it.
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface ReadingSession {
  id: string
  user_id: string
  book_id: string
  session_start: Date
  session_end?: Date
  pages_read: number
  total_pages: number
  events: ReadingEvent[]
}

export interface ReadingEvent {
  id: string
  session_id: string
  event_type: 'page_turn' | 'annotation' | 'highlight' | 'sync' | 'linger' | 'exit'
  timestamp: Date
  page_number: number
  word_count: number
  metadata: Record<string, unknown>
}

export interface HypeMetrics {
  velocity_variable: number      // Reading speed vs user average (0-100+)
  density_delta: number          // Annotations per 100 words
  resonance_pulse: number        // Seconds spent after "reading complete"
  butterfly_frequency: number    // Vault syncs per session
  overall_hype: number           // Combined score (0-100)
  hype_level: HypeLevel          // Human-readable level
}

export type HypeLevel = 
  | 'dormant'      // 0-20
  | 'stirring'     // 21-40
  | 'awakening'    // 41-60
  | 'pulsing'      // 61-80
  | 'blazing'      // 81-100

export interface UserBaseline {
  user_id: string
  avg_reading_speed: number      // Words per minute
  avg_session_length: number     // Minutes
  avg_annotations_per_session: number
  preferred_reading_times: number[] // Hours of day (0-23)
  last_updated: Date
}

// ============================================
// HYPE CALCULATOR CLASS
// ============================================

export class HypeAlgorithm {
  private baseline: UserBaseline | null = null
  
  constructor(baseline?: UserBaseline) {
    this.baseline = baseline || null
  }

  /**
   * ⚡ CALCULATE VELOCITY VARIABLE
   * Reading speed relative to user's average
   * Returns 100 = exactly average, >100 = faster, <100 = slower
   */
  calculateVelocity(
    wordsRead: number, 
    timeSpentMs: number,
    baselineWpm?: number
  ): number {
    const wpm = (wordsRead / timeSpentMs) * 60000
    const userAvg = baselineWpm || this.baseline?.avg_reading_speed || 250
    
    // Normalize to 100 baseline
    const velocity = (wpm / userAvg) * 100
    
    // Cap at 200 (twice average = maximum velocity score)
    return Math.min(Math.round(velocity), 200)
  }

  /**
   * 📝 CALCULATE DENSITY DELTA
   * Annotations per 100 words
   * Higher = more engaged, more thinking
   */
  calculateDensity(
    annotationCount: number,
    wordCount: number
  ): number {
    if (wordCount === 0) return 0
    
    const density = (annotationCount / wordCount) * 100
    
    // Scale: 0 annotations = 0, 1 per 50 words = 100
    // (we consider 1 annotation per 50 words as "maximum density")
    const normalizedDensity = Math.min(density * 50, 100)
    
    return Math.round(normalizedDensity)
  }

  /**
   * 💜 CALCULATE RESONANCE PULSE
   * Time spent on page after "reading complete"
   * Measures reflection, processing, emotional impact
   */
  calculateResonance(
    lingerTimeMs: number,
    pageWordCount: number
  ): number {
    // Expected linger time: 1 second per 50 words for processing
    const expectedLinger = (pageWordCount / 50) * 1000
    
    // Actual vs expected, normalized
    const resonance = (lingerTimeMs / expectedLinger) * 50
    
    // Cap at 100 (twice expected linger = maximum resonance)
    return Math.min(Math.round(resonance), 100)
  }

  /**
   * 🦋 CALCULATE BUTTERFLY FREQUENCY
   * How often they sync to Obsidian Vault
   * Measures desire to preserve, integrate knowledge
   */
  calculateButterflyFrequency(
    syncCount: number,
    sessionLengthMinutes: number
  ): number {
    if (sessionLengthMinutes === 0) return 0
    
    // Syncs per hour
    const syncsPerHour = (syncCount / sessionLengthMinutes) * 60
    
    // Scale: 0 syncs = 0, 6+ per hour = 100
    // (we consider 6 syncs/hour as "maximum butterfly activity")
    const normalized = Math.min((syncsPerHour / 6) * 100, 100)
    
    return Math.round(normalized)
  }

  /**
   * 🔥 CALCULATE OVERALL HYPE
   * Combined score from all metrics
   */
  calculateOverallHype(metrics: Omit<HypeMetrics, 'overall_hype' | 'hype_level'>): number {
    // Weighted average
    // Velocity: 20% (speed matters, but not everything)
    // Density: 30% (annotations = deep engagement)
    // Resonance: 25% (lingering = emotional impact)
    // Butterfly: 25% (syncing = preservation instinct)
    
    const weights = {
      velocity: 0.20,
      density: 0.30,
      resonance: 0.25,
      butterfly: 0.25
    }
    
    // Normalize velocity (it's on a 0-200 scale)
    const normalizedVelocity = metrics.velocity_variable / 2
    
    const overall = 
      (normalizedVelocity * weights.velocity) +
      (metrics.density_delta * weights.density) +
      (metrics.resonance_pulse * weights.resonance) +
      (metrics.butterfly_frequency * weights.butterfly)
    
    return Math.round(Math.min(overall, 100))
  }

  /**
   * 📊 GET HYPE LEVEL
   * Human-readable hype classification
   */
  getHypeLevel(score: number): HypeLevel {
    if (score <= 20) return 'dormant'
    if (score <= 40) return 'stirring'
    if (score <= 60) return 'awakening'
    if (score <= 80) return 'pulsing'
    return 'blazing'
  }

  /**
   * 🎯 FULL ANALYSIS
   * Calculate all metrics from a reading session
   */
  analyzeSession(session: ReadingSession): HypeMetrics {
    // Calculate velocity
    const totalTimeMs = session.session_end 
      ? session.session_end.getTime() - session.session_start.getTime()
      : Date.now() - session.session_start.getTime()
    
    const totalWords = session.events
      .filter(e => e.event_type === 'page_turn')
      .reduce((sum, e) => sum + e.word_count, 0)
    
    const velocity_variable = this.calculateVelocity(totalWords, totalTimeMs)
    
    // Calculate density
    const annotationCount = session.events
      .filter(e => e.event_type === 'annotation' || e.event_type === 'highlight').length
    const density_delta = this.calculateDensity(annotationCount, totalWords)
    
    // Calculate resonance
    const lingerEvents = session.events.filter(e => e.event_type === 'linger')
    const avgLingerTime = lingerEvents.length > 0
      ? lingerEvents.reduce((sum, e) => sum + (e.metadata.lingerTimeMs as number || 0), 0) / lingerEvents.length
      : 0
    const resonance_pulse = this.calculateResonance(avgLingerTime, totalWords / session.pages_read)
    
    // Calculate butterfly frequency
    const syncCount = session.events.filter(e => e.event_type === 'sync').length
    const sessionLengthMinutes = totalTimeMs / 60000
    const butterfly_frequency = this.calculateButterflyFrequency(syncCount, sessionLengthMinutes)
    
    // Calculate overall
    const metrics: Omit<HypeMetrics, 'overall_hype' | 'hype_level'> = {
      velocity_variable,
      density_delta,
      resonance_pulse,
      butterfly_frequency
    }
    
    const overall_hype = this.calculateOverallHype(metrics)
    const hype_level = this.getHypeLevel(overall_hype)
    
    return {
      ...metrics,
      overall_hype,
      hype_level
    }
  }
}

// ============================================
// DATABASE SCHEMA FOR HYPE TRACKING
// ============================================

export const HYPE_SCHEMA = `
-- 🦋 HYPE TRACKING TABLES

-- User baselines for personalized metrics
CREATE TABLE IF NOT EXISTS user_baselines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  avg_reading_speed FLOAT DEFAULT 250,
  avg_session_length FLOAT DEFAULT 30,
  avg_annotations_per_session FLOAT DEFAULT 2,
  preferred_reading_times INTEGER[] DEFAULT '{}',
  total_sessions INTEGER DEFAULT 0,
  total_words_read INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- Reading sessions
CREATE TABLE IF NOT EXISTS reading_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  book_id UUID NOT NULL,
  session_start TIMESTAMPTZ NOT NULL,
  session_end TIMESTAMPTZ,
  pages_read INTEGER DEFAULT 0,
  total_pages INTEGER DEFAULT 0,
  total_words INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reading events (granular tracking)
CREATE TABLE IF NOT EXISTS reading_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES reading_sessions(id) ON DELETE CASCADE,
  event_type VARCHAR(20) NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  page_number INTEGER,
  word_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'
);

-- Hype scores (computed metrics)
CREATE TABLE IF NOT EXISTS hype_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES reading_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  velocity_variable INTEGER,
  density_delta INTEGER,
  resonance_pulse INTEGER,
  butterfly_frequency INTEGER,
  overall_hype INTEGER,
  hype_level VARCHAR(20),
  computed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sessions_user ON reading_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_events_session ON reading_events(session_id);
CREATE INDEX IF NOT EXISTS idx_hype_session ON hype_scores(session_id);
CREATE INDEX IF NOT EXISTS idx_hype_user ON hype_scores(user_id);

-- RLS
ALTER TABLE user_baselines ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE hype_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own baselines" ON user_baselines FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own sessions" ON reading_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own events" ON reading_events FOR ALL USING (session_id IN (SELECT id FROM reading_sessions WHERE user_id = auth.uid()));
CREATE POLICY "Users can view own hype" ON hype_scores FOR SELECT USING (user_id = auth.uid());
`

export default HypeAlgorithm
