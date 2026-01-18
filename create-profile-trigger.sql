-- Create Profile Trigger
-- This trigger automatically creates a profile row when a new user signs up
-- Run this in Supabase SQL Editor

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
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
    'New Talent',  -- Temporary, will be updated during onboarding
    '',
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
