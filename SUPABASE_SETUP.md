# Supabase Setup Instructions

Follow these steps to set up authentication for Kayfabe:

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project (or create a new one)
3. Go to **Settings** > **API**
4. Copy the following:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Step 2: Configure Environment Variables

1. Open the file `.env.local` in the `kayfabe` directory
2. Replace the placeholder values with your actual Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 3: Run the Database Schema

1. Go to your Supabase dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New query**
4. Open the file `supabase-schema.sql` and copy all its contents
5. Paste the SQL into the Supabase SQL Editor
6. Click **Run** to execute the schema

This will create all the necessary tables, policies, and triggers.

## Step 4: Configure Email Settings (Optional but Recommended)

By default, Supabase uses their email service which has limitations. For production:

1. Go to **Authentication** > **Email Templates**
2. Customize the confirmation email template if desired
3. (Optional) Configure a custom SMTP server in **Settings** > **Auth**

For testing, the default email service works fine.

## Step 5: Test the App

1. Start your dev server: `npm run dev`
2. The app should now show the login/signup screen
3. Create a test account with your email
4. Check your email for the confirmation link
5. After confirming, you can sign in!

## What's Next?

After authentication is working, we still need to:

1. Update `App.tsx` to integrate with Supabase (replace localStorage)
2. Auto-sync data when users make changes
3. Handle offline mode gracefully
4. Migrate existing localStorage data to Supabase (if needed)

The database is ready, but the app is still using localStorage. Would you like me to:
- **Option A**: Complete the integration now (wire up App.tsx to use Supabase)
- **Option B**: Test authentication first, then integrate later
