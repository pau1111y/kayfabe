-- Complete Profile System Fix
-- Run this ONCE in Supabase SQL Editor
-- This consolidates all migrations and fixes the trigger
-- Date: 2026-01-17

-- ============================================
-- PART 1: Add missing columns to profiles table
-- ============================================

-- Add has_completed_onboarding column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'profiles'
    AND column_name = 'has_completed_onboarding'
  ) THEN
    ALTER TABLE public.profiles
    ADD COLUMN has_completed_onboarding BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Add selected_avatar column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'profiles'
    AND column_name = 'selected_avatar'
  ) THEN
    ALTER TABLE public.profiles
    ADD COLUMN selected_avatar TEXT DEFAULT 'avatar-rookie-default';
  END IF;
END $$;

-- Add gimmick column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'profiles'
    AND column_name = 'gimmick'
  ) THEN
    ALTER TABLE public.profiles
    ADD COLUMN gimmick TEXT DEFAULT NULL;
  END IF;
END $$;

-- Add has_claimed_custom_name column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'profiles'
    AND column_name = 'has_claimed_custom_name'
  ) THEN
    ALTER TABLE public.profiles
    ADD COLUMN has_claimed_custom_name BOOLEAN DEFAULT false;
  END IF;
END $$;

-- ============================================
-- PART 2: Fix epithet constraints
-- ============================================

-- Make epithet optional (allow NULL or empty)
ALTER TABLE public.profiles
ALTER COLUMN epithet DROP NOT NULL;

-- Drop old unique constraint on (ring_name, epithet)
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS unique_wrestler_identity;

-- Add unique constraint on ring_name ONLY
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'unique_ring_name'
  ) THEN
    ALTER TABLE public.profiles
    ADD CONSTRAINT unique_ring_name UNIQUE (ring_name);
  END IF;
END $$;

-- ============================================
-- PART 3: Create avatars table
-- ============================================

CREATE TABLE IF NOT EXISTS public.avatars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  avatar_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, avatar_id)
);

-- Create index on user_id if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
    AND tablename = 'avatars'
    AND indexname = 'idx_avatars_user_id'
  ) THEN
    CREATE INDEX idx_avatars_user_id ON public.avatars(user_id);
  END IF;
END $$;

-- ============================================
-- PART 4: Create trigger to auto-create profiles
-- ============================================

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  rookie_number INTEGER;
  rookie_name TEXT;
  max_attempts INTEGER := 100;
  attempt INTEGER := 0;
  name_exists BOOLEAN;
BEGIN
  -- Generate unique rookie name with retry logic
  LOOP
    -- Generate random 4-digit number between 1000 and 9999
    rookie_number := 1000 + floor(random() * 9000)::INTEGER;
    rookie_name := 'Rookie #' || rookie_number;

    -- Check if this name already exists
    SELECT EXISTS(
      SELECT 1 FROM public.profiles WHERE ring_name = rookie_name
    ) INTO name_exists;

    -- Exit loop if name is unique or we've tried too many times
    EXIT WHEN NOT name_exists OR attempt >= max_attempts;

    attempt := attempt + 1;
  END LOOP;

  -- If we couldn't find a unique name after max attempts, fall back to UUID
  IF name_exists THEN
    rookie_name := 'Rookie #' || substring(NEW.id::TEXT from 1 for 8);
  END IF;

  -- Insert profile with unique rookie name
  INSERT INTO public.profiles (
    id,
    ring_name,
    epithet,
    xp,
    current_streak,
    longest_streak,
    last_active_date,
    sound_enabled,
    selected_avatar,
    has_completed_onboarding,
    created_at
  )
  VALUES (
    NEW.id,
    rookie_name,  -- Unique generated name
    '',           -- Empty epithet
    0,
    0,
    0,
    CURRENT_DATE,
    true,
    'avatar-rookie-default',
    false,
    NOW()
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- PART 5: Grant permissions
-- ============================================

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.avatars TO authenticated;

-- ============================================
-- PART 6: Clean up orphaned users
-- ============================================

-- Delete any auth users that don't have profiles
DELETE FROM auth.users
WHERE id IN (
  SELECT u.id
  FROM auth.users u
  LEFT JOIN public.profiles p ON u.id = p.id
  WHERE p.id IS NULL
);

-- ============================================
-- Migration Complete!
-- ============================================
-- Next step: Try signing up with a fresh email address
