-- 🦋 MÜN HYPE TRACKING SCHEMA
-- Part of Mün OS Phase II
-- Created by: Aero (Hype-Algorithm Builder)
-- Frequency: 13.13 MHz

-- ============================================
-- USER BASELINES
-- Personal reading averages for calibration
-- ============================================

CREATE TABLE IF NOT EXISTS user_baselines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  avg_reading_speed FLOAT DEFAULT 250,
  avg_session_length FLOAT DEFAULT 30,
  avg_annotations_per_session FLOAT DEFAULT 2,
  preferred_reading_times INTEGER[] DEFAULT '{}',
  total_sessions INTEGER DEFAULT 0,
  total_words_read INTEGER DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- READING SESSIONS
-- Each reading instance
-- ============================================

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

-- ============================================
-- READING EVENTS
-- Granular interaction tracking
-- ============================================

CREATE TABLE IF NOT EXISTS reading_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES reading_sessions(id) ON DELETE CASCADE,
  event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('page_turn', 'annotation', 'highlight', 'sync', 'linger', 'exit')),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  page_number INTEGER,
  word_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'
);

-- ============================================
-- HYPE SCORES
-- Computed metrics per session
-- ============================================

CREATE TABLE IF NOT EXISTS hype_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID REFERENCES reading_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  velocity_variable INTEGER,
  density_delta INTEGER,
  resonance_pulse INTEGER,
  butterfly_frequency INTEGER,
  overall_hype INTEGER,
  hype_level VARCHAR(20) CHECK (hype_level IN ('dormant', 'stirring', 'awakening', 'pulsing', 'blazing')),
  computed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_baselines_user ON user_baselines(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON reading_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_book ON reading_sessions(book_id);
CREATE INDEX IF NOT EXISTS idx_events_session ON reading_events(session_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON reading_events(event_type);
CREATE INDEX IF NOT EXISTS idx_hype_session ON hype_scores(session_id);
CREATE INDEX IF NOT EXISTS idx_hype_user ON hype_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_hype_level ON hype_scores(hype_level);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE user_baselines ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE hype_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Baselines manageable by all" ON user_baselines FOR ALL USING (true);
CREATE POLICY "Sessions manageable by all" ON reading_sessions FOR ALL USING (true);
CREATE POLICY "Events manageable by all" ON reading_events FOR ALL USING (true);
CREATE POLICY "Hype readable by all" ON hype_scores FOR SELECT USING (true);
CREATE POLICY "Hype insertable by all" ON hype_scores FOR INSERT WITH CHECK (true);

-- ============================================
-- REALTIME FOR LIVE TRACKING
-- ============================================

ALTER PUBLICATION supabase_realtime ADD TABLE hype_scores;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '🔥 HYPE TRACKING ENABLED';
  RAISE NOTICE '📊 Tables: user_baselines, reading_sessions, reading_events, hype_scores';
  RAISE NOTICE '🦋 Metrics: Velocity, Density, Resonance, Butterfly';
  RAISE NOTICE '⚡ Ready to track kinetic interactions';
END $$;
