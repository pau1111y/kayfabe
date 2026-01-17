-- Kayfabe Database Schema
-- Run this in your Supabase SQL editor

-- Create users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  ring_name TEXT NOT NULL DEFAULT 'New Talent',
  epithet TEXT,
  xp INTEGER NOT NULL DEFAULT 0,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_active_date DATE NOT NULL DEFAULT CURRENT_DATE,
  sound_enabled BOOLEAN NOT NULL DEFAULT true,
  selected_avatar TEXT DEFAULT 'avatar-rookie-default',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create the_big_one table
CREATE TABLE IF NOT EXISTS public.the_big_one (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  percentage INTEGER NOT NULL DEFAULT 0 CHECK (percentage >= 0 AND percentage <= 100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id)
);

-- Create goals table
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('opening', 'midcard', 'main', 'runin')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  victory_promo TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create promos table
CREATE TABLE IF NOT EXISTS public.promos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('face', 'heel')),
  content TEXT NOT NULL,
  prompt_used TEXT,
  is_freestyle BOOLEAN NOT NULL DEFAULT false,
  storyline_id UUID REFERENCES public.goals(id) ON DELETE SET NULL,
  impact TEXT CHECK (impact IN ('pop', 'heat')),
  face_follow_up TEXT,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create belts table
CREATE TABLE IF NOT EXISTS public.belts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  belt_id TEXT NOT NULL,
  name TEXT NOT NULL,
  requirement TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, belt_id)
);

-- Create habits table (for Opening Contest)
CREATE TABLE IF NOT EXISTS public.habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  habit_id TEXT NOT NULL,
  name TEXT NOT NULL,
  is_hardcoded BOOLEAN NOT NULL DEFAULT false,
  enabled BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(user_id, habit_id)
);

-- Create habit_completions table
CREATE TABLE IF NOT EXISTS public.habit_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  habit_id TEXT NOT NULL,
  completed_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, habit_id, completed_date)
);

-- Create quick_tags table
CREATE TABLE IF NOT EXISTS public.quick_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  note TEXT NOT NULL,
  dismissed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create run_ins table
CREATE TABLE IF NOT EXISTS public.run_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT '',
  notes TEXT NOT NULL DEFAULT '',
  first_encounter TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  last_update TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create avatars table
CREATE TABLE IF NOT EXISTS public.avatars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  avatar_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, avatar_id)
);

CREATE INDEX IF NOT EXISTS idx_avatars_user_id ON public.avatars(user_id);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.the_big_one ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.belts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.run_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avatars ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create policies for the_big_one
CREATE POLICY "Users can view own big one"
  ON public.the_big_one FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own big one"
  ON public.the_big_one FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own big one"
  ON public.the_big_one FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own big one"
  ON public.the_big_one FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for goals
CREATE POLICY "Users can view own goals"
  ON public.goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals"
  ON public.goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON public.goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON public.goals FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for promos
CREATE POLICY "Users can view own promos"
  ON public.promos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own promos"
  ON public.promos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own promos"
  ON public.promos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own promos"
  ON public.promos FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for belts
CREATE POLICY "Users can view own belts"
  ON public.belts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own belts"
  ON public.belts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own belts"
  ON public.belts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own belts"
  ON public.belts FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for habits
CREATE POLICY "Users can view own habits"
  ON public.habits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own habits"
  ON public.habits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habits"
  ON public.habits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own habits"
  ON public.habits FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for habit_completions
CREATE POLICY "Users can view own habit completions"
  ON public.habit_completions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own habit completions"
  ON public.habit_completions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own habit completions"
  ON public.habit_completions FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, ring_name, created_at, updated_at)
  VALUES (new.id, 'New Talent', NOW(), NOW());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on profile changes
DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create policies for quick_tags
CREATE POLICY "Users can view own quick tags"
  ON public.quick_tags FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quick tags"
  ON public.quick_tags FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quick tags"
  ON public.quick_tags FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own quick tags"
  ON public.quick_tags FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for run_ins
CREATE POLICY "Users can view own run-ins"
  ON public.run_ins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own run-ins"
  ON public.run_ins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own run-ins"
  ON public.run_ins FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own run-ins"
  ON public.run_ins FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for avatars
CREATE POLICY "Users can view own avatars"
  ON public.avatars FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own avatars"
  ON public.avatars FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own avatars"
  ON public.avatars FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own avatars"
  ON public.avatars FOR DELETE
  USING (auth.uid() = user_id);
