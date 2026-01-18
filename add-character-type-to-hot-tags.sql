-- Add character_type column to existing hot_tags table
-- This column tracks whether a Face or Heel moment saved the day

-- Add the character_type column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'hot_tags'
    AND column_name = 'character_type'
  ) THEN
    ALTER TABLE public.hot_tags
    ADD COLUMN character_type TEXT CHECK (character_type IN ('face', 'heel')) NOT NULL DEFAULT 'face';

    -- Remove the default after adding the column
    ALTER TABLE public.hot_tags
    ALTER COLUMN character_type DROP DEFAULT;
  END IF;
END $$;
