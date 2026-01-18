-- Midcard Booking System Migration
-- Run this in your Supabase SQL editor

-- ============================================
-- 1. Update run_ins table with new columns
-- ============================================
ALTER TABLE public.run_ins
  ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'person' CHECK (type IN ('person', 'moment')),
  ADD COLUMN IF NOT EXISTS moment_title TEXT,
  ADD COLUMN IF NOT EXISTS linked_goal_id UUID REFERENCES public.goals(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS hours_contributed DECIMAL(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS entry_promo TEXT,
  ADD COLUMN IF NOT EXISTS impact TEXT CHECK (impact IN ('pop', 'heat'));

-- ============================================
-- 2. Create time_block_promos table
-- ============================================
CREATE TABLE IF NOT EXISTS public.time_block_promos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  time_block_id TEXT NOT NULL,
  time_block_name TEXT NOT NULL,
  linked_goal_id UUID REFERENCES public.goals(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('face', 'heel')),
  content TEXT NOT NULL,
  face_follow_up TEXT,
  impact TEXT NOT NULL CHECK (impact IN ('pop', 'heat')),
  booked_hours DECIMAL(10,2) NOT NULL DEFAULT 0,
  actual_hours DECIMAL(10,2) NOT NULL DEFAULT 0,
  date DATE NOT NULL,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_time_block_promos_user_id ON public.time_block_promos(user_id);
CREATE INDEX IF NOT EXISTS idx_time_block_promos_linked_goal ON public.time_block_promos(linked_goal_id);
CREATE INDEX IF NOT EXISTS idx_time_block_promos_date ON public.time_block_promos(date);

-- ============================================
-- 3. Create pending_promo_blocks table
-- ============================================
CREATE TABLE IF NOT EXISTS public.pending_promo_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  time_block_id TEXT NOT NULL,
  time_block_name TEXT NOT NULL,
  linked_goal_id UUID REFERENCES public.goals(id) ON DELETE SET NULL,
  booked_hours DECIMAL(10,2) NOT NULL DEFAULT 0,
  actual_hours DECIMAL(10,2) NOT NULL DEFAULT 0,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_pending_promo_blocks_user_id ON public.pending_promo_blocks(user_id);

-- ============================================
-- 4. Enable Row Level Security
-- ============================================
ALTER TABLE public.time_block_promos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pending_promo_blocks ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 5. Create policies for time_block_promos
-- ============================================
CREATE POLICY "Users can view own time block promos"
  ON public.time_block_promos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own time block promos"
  ON public.time_block_promos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own time block promos"
  ON public.time_block_promos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own time block promos"
  ON public.time_block_promos FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 6. Create policies for pending_promo_blocks
-- ============================================
CREATE POLICY "Users can view own pending promo blocks"
  ON public.pending_promo_blocks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pending promo blocks"
  ON public.pending_promo_blocks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending promo blocks"
  ON public.pending_promo_blocks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own pending promo blocks"
  ON public.pending_promo_blocks FOR DELETE
  USING (auth.uid() = user_id);
