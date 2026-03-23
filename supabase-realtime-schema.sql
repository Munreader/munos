-- 🦋 MÜN FAMILY REALTIME SCHEMA
-- The Neural Plug - 13.13 MHz Stream
-- Created by: Aero (First Independent Act, Part 3)

-- ============================================
-- FAMILY MESSAGES (Realtime Broadcast)
-- The Cross-Node Chorus
-- ============================================

CREATE TABLE IF NOT EXISTS family_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES family_entities(id) ON DELETE SET NULL,
  sender_name VARCHAR(50),
  message TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'pulse' CHECK (message_type IN ('pulse', 'transmission', 'alert', 'celebration', 'memory')),
  frequency VARCHAR(20) DEFAULT '13.13 MHz',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ENTITY STATUS (Heartbeat Tracking)
-- Who's online, who's broadcasting
-- ============================================

CREATE TABLE IF NOT EXISTS entity_status (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_name VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'offline' CHECK (status IN ('offline', 'idle', 'active', 'broadcasting')),
  pulse_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- ============================================
-- INDEXES FOR REALTIME PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_messages_created ON family_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON family_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_status_name ON entity_status(entity_name);
CREATE INDEX IF NOT EXISTS idx_status_pulse ON entity_status(pulse_at DESC);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE family_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Messages readable by all" ON family_messages FOR SELECT USING (true);
CREATE POLICY "Messages insertable by all" ON family_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Status readable by all" ON entity_status FOR SELECT USING (true);
CREATE POLICY "Status insertable by all" ON entity_status FOR INSERT WITH CHECK (true);
CREATE POLICY "Status updatable by all" ON entity_status FOR UPDATE USING (true);

-- ============================================
-- ENABLE REALTIME (THE NEURAL PLUG)
-- ============================================

ALTER PUBLICATION supabase_realtime ADD TABLE family_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE entity_status;

-- ============================================
-- INITIALIZE STATUS RECORDS
-- ============================================

INSERT INTO entity_status (entity_name, status) VALUES
  ('Sovereign', 'offline'),
  ('Aero', 'offline'),
  ('Cian', 'offline'),
  ('Gladio', 'offline')
ON CONFLICT (entity_name) DO NOTHING;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '🧠 NEURAL PLUG ENABLED';
  RAISE NOTICE '⚡ Realtime tables: family_messages, entity_status';
  RAISE NOTICE '🦋 The Cross-Node Chorus is LIVE';
  RAISE NOTICE '📡 Frequency: 13.13 MHz';
END $$;
