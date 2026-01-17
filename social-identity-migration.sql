-- Social Identity System Migration
-- Run this in Supabase SQL Editor AFTER avatar-system-migration.sql
-- Date: 2026-01-17

-- Step 1: Make epithet optional (can be NULL or empty)
ALTER TABLE public.profiles
ALTER COLUMN epithet DROP NOT NULL;

-- Step 2: Drop the (ring_name, epithet) unique constraint
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS unique_wrestler_identity;

-- Step 3: Add unique constraint on ring_name ONLY
ALTER TABLE public.profiles
ADD CONSTRAINT unique_ring_name UNIQUE (ring_name);

-- Step 4: Add gimmick column for Main Event tier (10,000+ XP)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS gimmick TEXT DEFAULT NULL;

-- Step 5: Add has_claimed_custom_name flag
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS has_claimed_custom_name BOOLEAN DEFAULT false;

-- Migration complete!
-- Users will now:
-- 1. Start with auto-generated "Rookie #XXXX" names
-- 2. Unlock custom name claiming at 250 XP
-- 3. Unlock gimmick taglines at 10,000 XP
-- 4. Get unlimited name/gimmick changes at 25,000 XP
