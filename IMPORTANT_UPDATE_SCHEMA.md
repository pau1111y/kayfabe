# ⚠️ IMPORTANT: Database Schema Update Required

## The app shows a black screen because new database tables are missing!

You need to run the updated SQL schema in Supabase to add the new `quick_tags` and `run_ins` tables.

### Steps to Fix:

1. **Go to your Supabase Dashboard**
   - Navigate to https://supabase.com/dashboard
   - Select your Kayfabe project

2. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "+ New query"

3. **Run the New Table Creation SQL**
   Copy and paste this SQL:

```sql
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

-- Enable Row Level Security
ALTER TABLE public.quick_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.run_ins ENABLE ROW LEVEL SECURITY;

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
```

4. **Click "Run"** to execute the SQL

5. **Refresh your Vercel app** - It should now work!

## Alternative: Run Full Schema

If you want to be sure everything is up to date, you can also run the complete schema from `supabase-schema.sql`. This is safe because all tables use `CREATE TABLE IF NOT EXISTS`.

## Why This Happened

The new features (Quick Tags, Run-Ins, habit persistence, and streak automation) require these new database tables. The app tried to load data from tables that don't exist yet, which caused an error that made the screen stay black.

Once you add these tables, all the new features will work:
- ✅ Habits persist across sessions
- ✅ Quick tags save to database
- ✅ Run-ins save to database
- ✅ Streak automatically updates daily
- ✅ XP multiplier applies to all gains
