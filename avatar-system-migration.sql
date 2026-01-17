-- Avatar System Migration
-- Run this in Supabase SQL Editor to add avatar system to existing database
-- Date: 2026-01-17

-- Step 1: Add selected_avatar column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS selected_avatar TEXT DEFAULT 'avatar-rookie-default';

-- Step 2: Make epithet required and add uniqueness constraint
-- First, set a unique epithet for existing users who don't have one
-- Use a numbered suffix to ensure uniqueness
DO $$
DECLARE
  profile_record RECORD;
  counter INT;
  new_epithet TEXT;
  epithet_exists BOOLEAN;
BEGIN
  FOR profile_record IN
    SELECT id, ring_name, epithet
    FROM public.profiles
    WHERE epithet IS NULL OR epithet = ''
  LOOP
    counter := 1;
    new_epithet := 'The Newcomer';

    -- Check if this combination already exists
    SELECT EXISTS(
      SELECT 1 FROM public.profiles
      WHERE ring_name = profile_record.ring_name
      AND epithet = new_epithet
    ) INTO epithet_exists;

    -- If it exists, add a number suffix until we find a unique one
    WHILE epithet_exists LOOP
      counter := counter + 1;
      new_epithet := 'The Newcomer #' || counter;

      SELECT EXISTS(
        SELECT 1 FROM public.profiles
        WHERE ring_name = profile_record.ring_name
        AND epithet = new_epithet
      ) INTO epithet_exists;
    END LOOP;

    -- Update the profile with the unique epithet
    UPDATE public.profiles
    SET epithet = new_epithet
    WHERE id = profile_record.id;
  END LOOP;
END $$;

-- Now make epithet NOT NULL
ALTER TABLE public.profiles
ALTER COLUMN epithet SET NOT NULL;

-- Add unique constraint on (ring_name, epithet) combination
-- Drop first in case it already exists, then create
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'unique_wrestler_identity'
  ) THEN
    ALTER TABLE public.profiles
    ADD CONSTRAINT unique_wrestler_identity UNIQUE (ring_name, epithet);
  END IF;
END $$;

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
