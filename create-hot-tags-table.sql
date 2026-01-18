-- Create hot_tags table for capturing pivotal character moments
-- When your face or heel saves the day - building your origin story

CREATE TABLE IF NOT EXISTS public.hot_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  character_type TEXT CHECK (character_type IN ('face', 'heel')) NOT NULL,
  dismissed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT hot_tags_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_hot_tags_user_id ON public.hot_tags(user_id);
CREATE INDEX IF NOT EXISTS idx_hot_tags_created_at ON public.hot_tags(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_hot_tags_dismissed ON public.hot_tags(dismissed);

-- Enable Row Level Security
ALTER TABLE public.hot_tags ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own hot tags
CREATE POLICY "Users can view their own hot tags"
  ON public.hot_tags
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own hot tags
CREATE POLICY "Users can create their own hot tags"
  ON public.hot_tags
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own hot tags
CREATE POLICY "Users can update their own hot tags"
  ON public.hot_tags
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own hot tags
CREATE POLICY "Users can delete their own hot tags"
  ON public.hot_tags
  FOR DELETE
  USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT ALL ON public.hot_tags TO authenticated;
GRANT ALL ON public.hot_tags TO service_role;
