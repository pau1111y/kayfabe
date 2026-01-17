-- Check Users and Profiles
-- Run this in Supabase SQL Editor to see what's in your database

-- Check all auth users
SELECT
  id,
  email,
  created_at,
  confirmed_at
FROM auth.users
ORDER BY created_at DESC;

-- Check all profiles
SELECT
  id,
  ring_name,
  epithet,
  xp,
  selected_avatar,
  has_completed_onboarding,
  created_at
FROM public.profiles
ORDER BY created_at DESC;

-- Find auth users WITHOUT profiles (orphaned users)
SELECT
  u.id,
  u.email,
  u.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL
ORDER BY u.created_at DESC;
