# KAYFABE - Complete Project Guide (Updated January 2026)

## Overview

KAYFABE is a wrestling-themed journaling and goal-tracking application that transforms personal development into an epic storyline. Users become wrestlers in their own life story, cutting promos (journal entries), pursuing storylines (goals), and building toward The Big One (ultimate dream).

**Current Tech Stack:**
- React 18 + TypeScript
- Vite for build tooling
- Tailwind CSS v4 (with @theme syntax)
- Supabase for backend (PostgreSQL + Auth)
- Deployed on Vercel

---

## Core Philosophy

KAYFABE operates on the principle that **your life is a wrestling show, and you're the main event**. Every action you take is part of a larger narrative:

- **Promos** = Journal entries where you speak your truth
- **Storylines** = Goals with emotional stakes
- **The Big One** = Your ultimate life dream
- **Opening Contest** = Daily habits that warm up the show
- **Midcard** = Time management and daily structure
- **Main Event** = Your most important active goals
- **XP & Belts** = Progress tracking and achievements
- **Streak System** = Consistency rewards with multipliers

---

## Current Features (As of January 2026)

### 1. Match Card Dashboard (Home Tab)

The home screen is designed like a wrestling show card with clear visual hierarchy:

```
┌─────────────────────────────────────────┐
│ MATCH CARD HEADER                       │
│ - Current date                          │
│ - Streak display (with XP multiplier)   │
├─────────────────────────────────────────┤
│ THE BIG ONE - HEADLINE MATCH            │
│ - Gold gradient banner                  │
│ - Progress slider (0-100%)              │
│ - Promo required on ANY change          │
├─────────────────────────────────────────┤
│ MAIN EVENT                              │
│ - tier='main' goals only                │
│ - Gold borders, star icons              │
│ - Shows linked promos                   │
│ - Championship completion ceremony      │
├─────────────────────────────────────────┤
│ MIDCARD - TIME SLOTS                    │
│ - Daily time blocks with timers         │
│ - Manual hour logging                   │
│ - Progress bars (logged/allocated)      │
│ - Daily budget tracker (24h total)      │
├─────────────────────────────────────────┤
│ OPENING CONTEST - DAILY HABITS          │
│ - Checkbox habits                       │
│ - Resets at midnight                    │
│ - XP rewards (+10 each, +15 clean sweep)│
│ - 4 default + custom habits             │
└─────────────────────────────────────────┘
```

**Visual Styling:**
- The Big One: `gradient-to-r from-kayfabe-gold to-kayfabe-red`
- Main Event: `border-2 border-kayfabe-gold bg-kayfabe-gold/10`
- Midcard: Table-style with progress indicators
- Opening Contest: Simple checkboxes at bottom

### 2. Promo System (Promo Tab)

Cut a promo to express your thoughts, celebrate wins, or process struggles.

**Promo Types:**
- **Face Promo** (positive/inspirational)
- **Heel Promo** (frustrated/venting)
- **Freestyle** (no prompt, pure expression)

**Impact System:**
- Face promos generate **pop** (positive reaction)
- Heel promos generate **heat** (attention/energy)
- Promos can be linked to storylines

**XP Rewards:**
- Base: 20 XP
- Long promos (200+ chars): +10 XP
- Very long (500+ chars): +20 XP
- Multiplied by streak bonus

**Forced Promo Contexts:**
1. **The Big One slider change** - ANY percentage change (up or down) requires a promo
2. **Goal completion** - Victory promo required
3. **Optional** - Can cut a promo anytime

### 3. Midcard Time Management (Midcard Tab)

Build your daily schedule with time blocks.

**Time Block Features:**
- Set allocated hours (e.g., Work: 8h, Sleep: 8h)
- Manual logging: "I worked 5.5 hours today"
- Timer mode: Start/stop timer for real-time tracking
- Daily vs. Non-daily blocks
- Link to Main Event goals (optional)
- Check off when complete
- Daily budget: Total hours out of 24

**Midnight Reset:**
- Daily blocks reset `loggedHours` to 0
- Non-daily blocks persist

**Use Cases:**
- Work hours tracking
- Sleep logging
- Meditation/exercise time
- Creative project hours
- Study sessions

### 4. Opening Contest Settings (Opening Tab)

Manage your daily habits.

**Default Habits (hardcoded, required):**
1. ✓ Say your prayers
2. ✓ Eat your vitamins
3. ✓ Made the bed
4. ✓ Morning hydration

**Features:**
- Toggle habits on/off (except required ones marked with ★)
- Add custom habits
- Habits reset at midnight
- XP rewards with clean sweep bonus
- Displayed on Match Card for daily checking

### 5. Goal System (Storylines)

Track goals with wrestling tier terminology.

**Tiers:**
- **Opening** - Small daily/weekly goals
- **Midcard** - Medium-term goals (deprecated for time blocks)
- **Main Event** ⭐ - Major life goals (3-6 months)
- **Run-in** - Unexpected opportunities/challenges

**Main Event Goals:**
- Displayed prominently on Match Card
- Gold borders and styling
- Championship completion ceremony
- +100 XP bonus (vs +50 for other tiers)
- Victory promo emphasized
- "Hall of Fame" messaging

**Goal Completion Flow:**
1. Click "Complete" on goal
2. Confirm completion
3. Write victory promo (required)
4. Celebration screen (tier-aware)
5. XP awarded (with streak multiplier)

### 6. The Big One

Your ultimate life dream - the headline of your story.

**Features:**
- Text description of your big dream
- Progress slider (0-100%)
- **Promo enforcement:** Moving slider triggers promo modal
  - Context passed to promo: "From X% to Y%"
  - Captures both progress AND setbacks
- Update history tracked (with linked promos)
- Prominent gold banner display on Match Card

**Philosophy:**
The Big One should be your North Star - the ultimate achievement that everything else builds toward. It could be:
- Write a book that changes lives
- Build a company that employs 100 people
- Become a world-class athlete
- Create financial freedom for your family

### 7. XP & Progression System

**XP Sources:**
- Promos: 20-40 XP (based on length)
- Opening Contest habits: 10 XP each
- Clean sweep bonus: +15 XP
- Goal completion: 50 XP (tier='opening', 'midcard', 'runin')
- Main Event completion: 100 XP

**Streak Multiplier:**
- 0-2 days: 1.0x
- 3-6 days: 1.5x
- 7-13 days: 2.0x
- 14-29 days: 2.5x
- 30+ days: 3.0x

**Streak Rules:**
- Updates automatically on data load
- Consecutive daily activity maintains streak
- Missing one day resets to 1
- Tracked by `last_active_date` in profile

**Championship Belts:**
Achievements earned at XP milestones:
- Rookie Belt (100 XP)
- Opening Act Champion (500 XP)
- Midcard Champion (1,000 XP)
- Main Event Champion (2,500 XP)
- World Champion (5,000 XP)
- Hall of Famer (10,000 XP)

### 8. Daily Reset System

**What Resets at Midnight:**
1. **Opening Contest habits** - All completions cleared
2. **Midcard time blocks** - Daily blocks reset `loggedHours` to 0
3. **Streak check** - Automatic streak maintenance

**Implementation:**
- `checkAndResetDaily()` runs on app data load
- Compares `lastResetDate` with today's ISO date
- Updates `openingContest.completedToday` and `midcardConfig.timeBlocks`
- Uses local timezone for midnight calculation

### 9. Profile Tab

**Displays:**
- Ring Name & Epithet
- Total XP
- Current streak (with fire emoji if active)
- Longest streak record
- Championship belts (earned and locked)
- Trading card design with stats

**Future Features:**
- Hall of Fame section for completed Main Events
- Promo history archive
- Storyline timeline

### 10. Authentication & Security

**Features:**
- Email/password sign up
- Email/password sign in
- **Forgot password** - Sends reset link via email
- Supabase Auth integration
- Row-level security on all tables

**Password Reset Flow:**
1. Click "Forgot password?" on sign-in
2. Enter email
3. Receive reset link (production URL from env)
4. Click link → redirected to `/reset-password`
5. Enter new password
6. Redirect to app

**Environment Variables:**
```env
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-anon-key>
VITE_APP_URL=<production-url>  # For password reset links
```

---

## Navigation Structure (5 Tabs)

```
┌──────────────────────────────────────────────┐
│ 📋 Card | 🎤 Promo | ⏰ Midcard | 🎆 Opening | 🏆 Profile │
└──────────────────────────────────────────────┘
```

1. **📋 Card (Home)** - Match Card dashboard
2. **🎤 Promo** - Cut a promo (journal entry)
3. **⏰ Midcard** - Time block settings & management
4. **🎆 Opening** - Habit management settings
5. **🏆 Profile** - User stats, belts, achievements

---

## Data Architecture

### Type Definitions (`src/types/index.ts`)

```typescript
interface AppData {
  user: UserProfile;
  promos: Promo[];
  goals: Goal[];
  belts: Belt[];
  quickTags: QuickTag[];
  runIns: RunIn[];
  openingContest: OpeningContest;
  midcardConfig: MidcardConfig;  // NEW
}

interface UserProfile {
  id: string;
  ringName: string;
  epithet: string;
  createdAt: number;
  xp: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  soundEnabled: boolean;
  theBigOne: {
    description: string;
    percentage: number;
    createdAt: number;
    updates: BigOneUpdate[];  // NEW
  } | null;
  completedBigOnes: CompletedBigOne[];
  hasCompletedOnboarding: boolean;
}

interface BigOneUpdate {  // NEW
  id: string;
  previousPercentage: number;
  newPercentage: number;
  promoId: string;  // Required promo link
  timestamp: number;
}

interface TimeBlock {  // NEW
  id: string;
  name: string;
  allocatedHours: number;
  loggedHours: number;
  isDaily: boolean;
  isCompleted: boolean;
  linkedGoalId: string | null;
  timerStartedAt: number | null;
  createdAt: number;
}

interface MidcardConfig {  // NEW
  timeBlocks: TimeBlock[];
  dailyBudget: number;  // 24 hours
  lastResetDate: string;  // ISO date for reset check
}

interface OpeningContest {
  habits: Habit[];
  completedToday: string[];
  lastResetDate: string;  // NEW
}

interface Promo {
  id: string;
  type: 'face' | 'heel';
  content: string;
  promptUsed: string | null;
  isFreestyle: boolean;
  storylineId: string | null;
  impact: 'pop' | 'heat';
  faceFollowUp: string | null;
  xpEarned: number;
  createdAt: number;
}

interface Goal {
  id: string;
  title: string;
  tier: 'opening' | 'midcard' | 'main' | 'runin';
  status: 'active' | 'completed';
  createdAt: number;
  completedAt: number | null;
  victoryPromo: string | null;
}
```

### Supabase Schema

**Tables:**
- `profiles` - User profiles with XP, streak, ring name
- `the_big_one` - User's ultimate goal (1:1 with user)
- `goals` - Storylines/goals
- `promos` - Journal entries
- `belts` - Championship achievements
- `habits` - Opening Contest habits
- `habit_completions` - Daily habit tracking
- `quick_tags` - Quick notes (future feature)
- `run_ins` - Unexpected events (future feature)

**Note:** TimeBlock data is currently stored in `localStorage` as `midcardConfig`. Future backend integration planned.

---

## File Structure

```
kayfabe/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   └── AuthScreen.tsx              # Sign in/up/reset
│   │   ├── Goals/
│   │   │   ├── GoalForm.tsx                # Create new goal
│   │   │   ├── GoalCompletion.tsx          # Tier-aware completion ceremony
│   │   │   └── TheBigOne.tsx               # Big One display (not used on Match Card)
│   │   ├── Layout/
│   │   │   └── Navigation.tsx              # 5-tab bottom nav
│   │   ├── MatchCard/
│   │   │   ├── MatchCardHeader.tsx         # Date + streak display
│   │   │   ├── BigOneHeadline.tsx          # Big One banner with promo enforcement
│   │   │   └── MainEventSection.tsx        # Main event goals display
│   │   ├── Midcard/
│   │   │   ├── TimeBlockList.tsx           # Match Card display of time blocks
│   │   │   ├── TimeBlockSettings.tsx       # Settings tab for time management
│   │   │   └── TimeBlockItem.tsx           # Individual time block component
│   │   ├── OpeningContest/
│   │   │   ├── HabitList.tsx               # Match Card habit checkboxes
│   │   │   └── OpeningContestSettings.tsx  # Settings tab for habits
│   │   ├── Profile/
│   │   │   ├── TradingCard.tsx             # User card display
│   │   │   ├── StreakDisplay.tsx           # Streak visualization
│   │   │   └── BeltDisplay.tsx             # Championship belts
│   │   ├── Promo/
│   │   │   └── PromoFlow.tsx               # Promo creation flow (supports Big One context)
│   │   ├── QuickTag/
│   │   │   └── QuickTagFlow.tsx            # Quick notes (future)
│   │   └── RunIn/
│   │       └── RunInFlow.tsx               # Run-in events (future)
│   ├── contexts/
│   │   └── AuthContext.tsx                 # Supabase auth + reset password
│   ├── lib/
│   │   └── supabase.ts                     # Supabase client config
│   ├── services/
│   │   └── supabaseService.ts              # Data CRUD operations
│   ├── utils/
│   │   ├── achievements.ts                 # Belt checking logic
│   │   ├── dailyReset.ts                   # Midnight reset logic
│   │   ├── storage.ts                      # Default data & migration
│   │   ├── timer.ts                        # Time block timer utilities
│   │   └── xp.ts                           # XP calculation & streak multiplier
│   ├── types/
│   │   └── index.ts                        # TypeScript types
│   ├── App.tsx                             # Main app component & routing
│   ├── index.css                           # Tailwind v4 + custom classes
│   └── main.tsx                            # App entry point
├── .env.local                              # Environment variables
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## Key Utilities

### `dailyReset.ts`

```typescript
export const checkAndResetDaily = (appData: AppData): AppData => {
  const today = new Date().toISOString().split('T')[0];

  // Reset Opening Contest if needed
  const needsOpeningContestReset = appData.openingContest.lastResetDate !== today;

  // Reset Midcard time blocks if needed
  const needsMidcardReset = appData.midcardConfig.lastResetDate !== today;

  if (needsOpeningContestReset) {
    // Clear completedToday array
  }

  if (needsMidcardReset) {
    // Reset loggedHours for isDaily blocks
  }

  return updatedAppData;
};
```

### `timer.ts`

```typescript
export const calculateElapsedHours = (startTime: number): number => {
  const now = Date.now();
  const elapsedMs = now - startTime;
  return Math.round((elapsedMs / (1000 * 60 * 60)) * 100) / 100;
};

export const formatHours = (hours: number): string => {
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  return `${hours}h`;
};
```

### `xp.ts`

```typescript
export const getStreakMultiplier = (streak: number): number => {
  if (streak >= 30) return 3.0;
  if (streak >= 14) return 2.5;
  if (streak >= 7) return 2.0;
  if (streak >= 3) return 1.5;
  return 1.0;
};

export const calculateXPWithMultiplier = (baseXP: number, streak: number): number => {
  const multiplier = getStreakMultiplier(streak);
  return Math.round(baseXP * multiplier);
};
```

---

## Styling System

### Tailwind v4 Theme (`src/index.css`)

```css
@theme {
  --color-kayfabe-black: #000000;
  --color-kayfabe-white: #FFFFFF;
  --color-kayfabe-cream: #F5F5F5;
  --color-kayfabe-gold: #C9A227;
  --color-kayfabe-red: #8B3A3A;
  --color-kayfabe-gray-dark: #333333;
  --color-kayfabe-gray-medium: #666666;
  --color-kayfabe-gray-light: #CCCCCC;

  --font-typewriter: "Courier New", Courier, monospace;
  --font-display: "Arial Black", Arial, sans-serif;
}
```

### Custom Component Classes

```css
.btn-primary {
  @apply bg-kayfabe-cream text-kayfabe-black px-6 py-3
         font-bold uppercase tracking-wide
         hover:bg-kayfabe-gold transition-colors;
}

.btn-secondary {
  @apply border border-kayfabe-cream text-kayfabe-cream px-6 py-3
         font-bold uppercase tracking-wide
         hover:bg-kayfabe-cream hover:text-kayfabe-black transition-colors;
}

.card {
  @apply border border-kayfabe-gray-medium p-6 bg-kayfabe-black;
}

.input-field {
  @apply bg-transparent border border-kayfabe-gray-medium
         text-kayfabe-cream p-4 w-full
         focus:border-kayfabe-gold focus:outline-none;
  font-family: var(--font-typewriter);
}

.heading-1 {
  @apply text-3xl font-bold uppercase tracking-wider text-kayfabe-cream;
  font-family: var(--font-display);
}

.heading-2 {
  @apply text-xl font-bold uppercase tracking-wide text-kayfabe-gray-light;
  font-family: var(--font-display);
}

/* Match Card Specific */
.big-one-banner {
  @apply bg-gradient-to-r from-kayfabe-gold to-kayfabe-red p-8 rounded-lg;
}

.main-event-card {
  @apply border-2 border-kayfabe-gold bg-kayfabe-gold/10 p-6 rounded-lg;
}

.time-block-table {
  @apply border border-kayfabe-gray-medium divide-y divide-kayfabe-gray-dark;
}

.match-card-header {
  @apply border-b border-kayfabe-gray-medium pb-4 mb-6;
}
```

---

## Development Workflow

### Local Development

```bash
cd kayfabe
npm install
npm run dev
```

App runs at `http://localhost:5173`

### Environment Setup

Create `.env.local`:
```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_URL=https://your-vercel-domain.vercel.app
```

### Build

```bash
npm run build
```

Outputs to `dist/` directory.

### Deploy to Vercel

```bash
git add .
git commit -m "Your changes"
git push
```

Vercel auto-deploys from `main` branch.

**Environment Variables on Vercel:**
Set in Project Settings → Environment Variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_APP_URL` (set to production URL)

---

## Recent Major Updates (January 2026)

### Match Card Redesign
- Complete visual overhaul with wrestling poster aesthetic
- Clear hierarchy: Big One → Main Event → Midcard → Opening Contest
- Banner styling for The Big One
- Gold borders and highlights for Main Event goals

### Big One Promo Enforcement
- Slider changes now trigger promo modal
- Captures both progress AND regression
- Context passed to promo: `previousPercentage` and `newPercentage`
- Update history stored with linked promo IDs

### Midcard Time Management System
- Replaced goal-based "midcard tier" with time block management
- Manual hour logging: "I worked 5 hours today"
- Timer mode: Real-time tracking with start/stop
- Daily vs. non-daily blocks
- Daily budget tracking (24h total)
- Midnight reset for daily blocks

### Main Event Championship Ceremony
- Tier-aware goal completion flow
- Main Event goals show championship belt banner
- +100 XP bonus (vs +50 for other tiers)
- Extended victory promo prompts
- "Hall of Fame" messaging
- Gold gradient celebration visuals

### 5-Tab Navigation
- Dedicated tabs for Midcard and Opening Contest settings
- Moved habit management off Match Card to Opening tab
- Cleaner separation of viewing vs. managing

### Daily Reset System
- Automatic midnight reset for habits and time blocks
- Uses ISO date comparison for reliable reset detection
- Runs on app data load for guaranteed consistency

### Forgot Password
- "Forgot password?" button on sign-in
- Email-based password reset flow
- Production URL from environment variable
- Redirect to `/reset-password` after email link click

---

## Future Roadmap

### Near-Term (Next 1-3 Months)
- [ ] Backend storage for time blocks (Supabase table)
- [ ] Backend storage for Big One updates history
- [ ] Hall of Fame page for completed Main Events
- [ ] Promo archive/search functionality
- [ ] Export data (JSON download)
- [ ] Dark mode toggle (currently always dark)
- [ ] Mobile PWA support

### Medium-Term (3-6 Months)
- [ ] Quick Tags full implementation
- [ ] Run-Ins full implementation
- [ ] Dark Match feature (reflection prompts)
- [ ] Social features (share promos, compare progress)
- [ ] AI promo prompts (optional enhancement)
- [ ] Customizable Big One banner images
- [ ] Weekly/monthly review system

### Long-Term (6-12 Months)
- [ ] Mobile app (React Native)
- [ ] Calendar integration for time blocks
- [ ] Analytics dashboard (trends, patterns)
- [ ] Automated belt ceremonies with confetti
- [ ] Voice promo recording
- [ ] Community feed (opt-in)
- [ ] Mentor/coach access (opt-in)

---

## Known Issues & Limitations

### Current Limitations
1. **Time blocks** are localStorage-only (not synced to Supabase)
2. **Big One updates** history is tracked in memory but not persisted to backend
3. **No undo** for goal completion or Big One changes
4. **No edit** for existing promos or goals
5. **Reset password** redirect requires `/reset-password` route (not yet implemented)
6. **Midnight reset** uses local timezone (may vary for travelers)

### Planned Fixes
- Implement `/reset-password` route for password reset completion
- Add Supabase table for time blocks
- Add Big One updates table in Supabase
- Add edit functionality for promos and goals
- Add confirmation dialogs for destructive actions

---

## Design Principles

### Wrestling Kayfabe
"Kayfabe" refers to the presentation of staged performances as genuine. KAYFABE the app applies this to personal development:
- Your struggles are storylines (not failures)
- Your wins are championship moments (not just checkboxes)
- Your daily work is "paying dues" (building toward the main event)
- Setbacks are "heel turns" or "run-ins" (part of the narrative)

### Emotional Honesty
- Face promos celebrate wins with authenticity
- Heel promos validate frustration and setbacks
- Victory promos capture the weight of achievement
- Big One regression promos honor the struggle

### Visual Hierarchy
The Match Card is intentionally designed top-to-bottom by importance:
1. **The Big One** - Ultimate dream (largest, most dramatic)
2. **Main Event** - Major goals (gold borders, prominent)
3. **Midcard** - Daily structure (functional, table-style)
4. **Opening Contest** - Daily habits (simple, bottom placement)

### Consistency Over Perfection
- Streak system rewards showing up daily
- Habits reset at midnight (fresh start every day)
- XP multipliers incentivize consistency
- No punishment for missing days (just reset)

---

## Architecture Decisions

### Why Supabase?
- PostgreSQL backend with excellent TypeScript support
- Built-in auth with row-level security
- Real-time subscriptions (future features)
- Generous free tier
- Easy deployment and scaling

### Why Tailwind v4?
- New `@theme` syntax for cleaner variable management
- Better performance with Lightning CSS
- Native cascade layers support
- Improved DX with better autocomplete

### Why localStorage + Supabase?
- Supabase for core data (promos, goals, profile)
- localStorage for experimental features (time blocks)
- Allows rapid iteration without schema changes
- Future migration path to full backend storage

### Why Client-Side State Management?
- Small app scope (single user, personal use)
- No need for complex state management (Redux, etc.)
- React useState + Supabase is sufficient
- Simpler codebase, easier to maintain

---

## Contributing

### Code Style
- TypeScript strict mode enabled
- React functional components only
- Explicit return types for functions
- Tailwind utility classes (no custom CSS unless necessary)
- Wrestling terminology in comments and naming

### Commit Messages
Use wrestling-themed commit messages when appropriate:
```
feat: add championship ceremony for Main Event goals
fix: reset habits at midnight (clean the ring)
refactor: restructure Match Card layout (new show format)
docs: update roadmap (new storylines)
```

### Testing Philosophy
- Build confidence through manual testing
- Focus on user flows, not unit tests (for now)
- Test on mobile viewports (primary use case)
- Verify Supabase sync after major changes

---

## Deployment Checklist

Before deploying to production:
- [ ] Update `VITE_APP_URL` in Vercel env vars
- [ ] Verify Supabase connection works
- [ ] Test forgot password flow end-to-end
- [ ] Check mobile responsive design
- [ ] Verify midnight reset works (change system time)
- [ ] Test streak calculation
- [ ] Test belt achievements
- [ ] Build succeeds without warnings
- [ ] No console errors in production build

---

## Support & Contact

**Repository:** https://github.com/pau1111y/kayfabe
**Deployment:** https://kayfabe.vercel.app
**Built with:** React, TypeScript, Supabase, Tailwind CSS
**Last Updated:** January 2026

---

## Credits

Designed and built by Paul Dhesi with assistance from Claude (Anthropic).

Wrestling terminology and kayfabe philosophy inspired by the storytelling traditions of professional wrestling.

**Co-Authored-By:** Claude Sonnet 4.5 <noreply@anthropic.com>

---

*"The show must go on. Your story is the main event."*
