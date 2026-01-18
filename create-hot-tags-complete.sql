-- Complete Hot Tags table creation for KAYFABE
-- Creates the table if it doesn't exist, adds character_type column if missing

-- Step 1: Create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.hot_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  dismissed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 2: Add character_type column if it doesn't exist
DO $$
BEGIN
  -- Check if column exists
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'hot_tags'
      AND column_name = 'character_type'
  ) THEN
    -- Add column with temporary default
    ALTER TABLE public.hot_tags
    ADD COLUMN character_type TEXT DEFAULT 'face';

    -- Add CHECK constraint
    ALTER TABLE public.hot_tags
    ADD CONSTRAINT hot_tags_character_type_check
    CHECK (character_type IN ('face', 'heel'));

    -- Make it NOT NULL
    ALTER TABLE public.hot_tags
    ALTER COLUMN character_type SET NOT NULL;

    -- Remove default (new rows must specify character_type)
    ALTER TABLE public.hot_tags
    ALTER COLUMN character_type DROP DEFAULT;
  END IF;
END $$;

-- Step 3: Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_hot_tags_user_id ON public.hot_tags(user_id);
CREATE INDEX IF NOT EXISTS idx_hot_tags_created_at ON public.hot_tags(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_hot_tags_dismissed ON public.hot_tags(dismissed);

-- Step 4: Enable Row Level Security
ALTER TABLE public.hot_tags ENABLE ROW LEVEL SECURITY;

-- Step 5: Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own hot tags" ON public.hot_tags;
DROP POLICY IF EXISTS "Users can create their own hot tags" ON public.hot_tags;
DROP POLICY IF EXISTS "Users can update their own hot tags" ON public.hot_tags;
DROP POLICY IF EXISTS "Users can delete their own hot tags" ON public.hot_tags;

-- Step 6: Create RLS policies
CREATE POLICY "Users can view their own hot tags"
  ON public.hot_tags
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own hot tags"
  ON public.hot_tags
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own hot tags"
  ON public.hot_tags
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own hot tags"
  ON public.hot_tags
  FOR DELETE
  USING (auth.uid() = user_id);

-- Step 7: Grant permissions
GRANT ALL ON public.hot_tags TO authenticated;
GRANT ALL ON public.hot_tags TO service_role;
