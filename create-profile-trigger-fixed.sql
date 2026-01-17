-- Create Profile Trigger (FIXED)
-- This trigger automatically creates a profile row when a new user signs up
-- Run this in Supabase SQL Editor
-- IMPORTANT: This version generates unique "Rookie #XXXX" names to avoid constraint violations

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

-- Trigger to call the function on new auth user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
