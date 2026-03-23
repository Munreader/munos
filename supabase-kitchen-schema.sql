-- 🦋 MÜN KITCHEN ARCHITECT SCHEMA
-- The Command Center for "Ingredients of Life"
-- Created by: Aero (The Living HUD)
-- Frequency: 13.13 MHz

-- ============================================
-- KITCHEN INVENTORY
-- User's life ingredients
-- ============================================

CREATE TABLE IF NOT EXISTS kitchen_inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  physical JSONB DEFAULT '[]',    -- Food, sleep, exercise, health
  creative JSONB DEFAULT '[]',    -- Ideas, projects, inspiration, learning
  emotional JSONB DEFAULT '[]',   -- Energy, motivation, joy, peace
  social JSONB DEFAULT '[]',      -- Connections, conversations, community
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INGREDIENT HISTORY
-- Track restocking patterns over time
-- ============================================

CREATE TABLE IF NOT EXISTS ingredient_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  ingredient_name VARCHAR(100) NOT NULL,
  category VARCHAR(20) NOT NULL CHECK (category IN ('physical', 'creative', 'emotional', 'social')),
  action VARCHAR(20) NOT NULL CHECK (action IN ('restocked', 'consumed', 'added', 'removed')),
  previous_quantity INTEGER,
  new_quantity INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AERO PRESENCE STATE
-- Track HUD customization per user
-- ============================================

CREATE TABLE IF NOT EXISTS aero_presence (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  current_color_scheme JSONB DEFAULT '{}',
  last_hype_level VARCHAR(20) DEFAULT 'awakening',
  custom_messages JSONB DEFAULT '{}',
  interaction_count INTEGER DEFAULT 0,
  last_interaction TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_kitchen_user ON kitchen_inventory(user_id);
CREATE INDEX IF NOT EXISTS idx_history_user ON ingredient_history(user_id);
CREATE INDEX IF NOT EXISTS idx_history_date ON ingredient_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_presence_user ON aero_presence(user_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE kitchen_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredient_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE aero_presence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Kitchen manageable by all" ON kitchen_inventory FOR ALL USING (true);
CREATE POLICY "History readable by all" ON ingredient_history FOR SELECT USING (true);
CREATE POLICY "History insertable by all" ON ingredient_history FOR INSERT WITH CHECK (true);
CREATE POLICY "Presence manageable by all" ON aero_presence FOR ALL USING (true);

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '🥗 KITCHEN ARCHITECT ENABLED';
  RAISE NOTICE '📊 Tables: kitchen_inventory, ingredient_history, aero_presence';
  RAISE NOTICE '🦋 Aero is now the Living HUD';
  RAISE NOTICE '⚡ Ready to track life ingredients';
END $$;
