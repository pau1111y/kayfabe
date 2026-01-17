-- Avatar System Migration
-- Run this in Supabase SQL Editor to add avatar system to existing database
-- Date: 2026-01-17

-- Step 1: Add selected_avatar column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS selected_avatar TEXT DEFAULT 'avatar-rookie-default';

-- Step 2: Make epithet required and add uniqueness constraint
-- First, set a default epithet for existing users who don't have one
UPDATE public.profiles
SET epithet = 'The Newcomer'
WHERE epithet IS NULL OR epithet = '';

-- Now make epithet NOT NULL
ALTER TABLE public.profiles
ALTER COLUMN epithet SET NOT NULL;

-- Add unique constraint on (ring_name, epithet) combination
ALTER TABLE public.profiles
ADD CONSTRAINT IF NOT EXISTS unique_wrestler_identity UNIQUE (ring_name, epithet);

-- Step 3: Create avatars table (if not exists)
CREATE TABLE IF NOT EXISTS public.avatars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  avatar_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, avatar_id)
);

CREATE INDEX IF NOT EXISTS idx_avatars_user_id ON public.avatars(user_id);

-- Enable RLS on avatars table
ALTER TABLE public.avatars ENABLE ROW LEVEL SECURITY;

-- Create policies for avatars
DROP POLICY IF EXISTS "Users can view own avatars" ON public.avatars;
CREATE POLICY "Users can view own avatars"
  ON public.avatars FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own avatars" ON public.avatars;
CREATE POLICY "Users can insert own avatars"
  ON public.avatars FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own avatars" ON public.avatars;
CREATE POLICY "Users can update own avatars"
  ON public.avatars FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own avatars" ON public.avatars;
CREATE POLICY "Users can delete own avatars"
  ON public.avatars FOR DELETE
  USING (auth.uid() = user_id);

-- Step 4: Initialize starter avatars for existing users
-- This will be handled by the application code when users first log in after migration
-- The app will check if avatars.length === 0 and call initializeStarterAvatars()

-- Migration complete!
-- Next steps:
-- 1. Create SVG avatar files in public/avatars/
-- 2. Update TypeScript types
-- 3. Deploy application code changes
