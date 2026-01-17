# KAYFABE Social & Multiplayer Features Plan

**Date:** 2026-01-17
**Status:** Planning Phase - Not Yet Implemented

---

## Overview

This document outlines the complete social and multiplayer feature set for KAYFABE, including:
- Progressive username system (tied to XP)
- Leaderboards (global & faction)
- Challenges (1v1 competitive goals)
- Factions (teams/guilds)
- Gimmick system (flavor text/taglines)

All features are designed to work together and create a cohesive multiplayer experience while maintaining KAYFABE's core single-player progression mechanics.

---

## Part 1: Progressive Identity System

### Username Progression Tiers

**Tier 1: Rookie (0 - 249 XP)**
- Auto-assigned unique name: `"Rookie #[random-4-digits]"`
- Examples: "Rookie #7821", "Rookie #3049"
- **Cannot customize name yet**
- Epithet is optional/cosmetic (e.g., "The Hungry One")
- Avatar selection from 4 starters

**Tier 2: Jobber (250 - 749 XP)**
- **UNLOCK: Custom Ring Name**
- One-time name claim (unique, first-come-first-served)
- Name validation: 2-30 characters, alphanumeric + spaces
- Check uniqueness against all existing users
- Epithet remains optional/cosmetic
- **UI:** Show notification "🎤 You've earned the right to choose your ring name!"
- **UI:** Add "Claim Your Name" button in Profile tab

**Tier 3: Main Eventer (10,000 - 24,999 XP)**
- **UNLOCK: Gimmick Tagline**
- Comic book-style speech bubble/text box under avatar
- 1-2 sentence catchphrase (max 120 characters)
- Examples: "And that's the bottom line!", "Can you smell what I'm cooking?", "You can't see me!"
- Displayed on trading card, leaderboards, and challenges
- **UI:** Add "Set Your Gimmick" field in ProfileEditor

**Tier 4: Legend (25,000+ XP)**
- **UNLOCK: Unlimited Name & Gimmick Changes**
- Can change ring name anytime (still must be unique)
- Can update gimmick anytime
- **UI:** "Edit Profile" allows full customization

### Database Schema Updates

```sql
-- Add to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS gimmick TEXT DEFAULT NULL;

-- Unique constraint on ring_name only
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS unique_wrestler_identity;

ALTER TABLE public.profiles
ADD CONSTRAINT unique_ring_name UNIQUE (ring_name);

-- Make epithet optional (already nullable in current schema)
ALTER TABLE public.profiles
ALTER COLUMN epithet DROP NOT NULL;
```

### TypeScript Types

```typescript
export interface UserProfile {
  // ... existing fields
  ringName: string;           // Unique identifier
  epithet: string | null;     // Optional flavor text (e.g., "The People's Champion")
  gimmick: string | null;     // Unlocked at 10,000 XP (catchphrase/tagline)
  selectedAvatar: string;
  hasClaimedCustomName: boolean; // NEW: false until they claim at 250 XP
}
```

### Helper Functions

```typescript
// src/utils/identity.ts

export const canClaimCustomName = (xp: number, hasClaimedCustomName: boolean): boolean => {
  return xp >= 250 && !hasClaimedCustomName;
};

export const canSetGimmick = (xp: number): boolean => {
  return xp >= 10000;
};

export const canChangeNameFreely = (xp: number): boolean => {
  return xp >= 25000;
};

export const generateRookieName = (): string => {
  const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit number
  return `Rookie #${randomNum}`;
};
```

---

## Part 2: Leaderboards

### Leaderboard Types

**1. Global XP Leaderboard**
- Ranks all users by total XP
- Top 100 displayed
- Shows: Rank, Avatar, Ring Name, Gimmick (if set), XP, Title

**2. Weekly Promo Leaderboard**
- Ranks users by promos completed this week (rolling 7 days)
- Resets weekly
- Shows: Rank, Ring Name, Promos This Week, Face/Heel Ratio

**3. Streak Leaderboard**
- Ranks users by current active streak
- Shows: Rank, Ring Name, Current Streak, Longest Streak

**4. Faction Leaderboard** (see Part 4)
- Ranks factions by combined member XP
- Shows: Faction Rank, Faction Name, Total Members, Combined XP

### Database Schema

```sql
-- Leaderboards are computed views, no new tables needed
-- Use existing profiles table + aggregations

-- Create materialized view for performance (refreshed hourly)
CREATE MATERIALIZED VIEW IF NOT EXISTS public.leaderboard_xp AS
SELECT
  id,
  ring_name,
  epithet,
  gimmick,
  selected_avatar,
  xp,
  current_streak,
  ROW_NUMBER() OVER (ORDER BY xp DESC) as rank
FROM public.profiles
ORDER BY xp DESC
LIMIT 100;

CREATE INDEX IF NOT EXISTS idx_leaderboard_xp_rank ON public.leaderboard_xp(rank);

-- Refresh function (call from cron or app)
CREATE OR REPLACE FUNCTION refresh_leaderboard_xp()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW public.leaderboard_xp;
END;
$$ LANGUAGE plpgsql;
```

### TypeScript Types

```typescript
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  ringName: string;
  epithet: string | null;
  gimmick: string | null;
  avatar: Avatar;
  xp: number;
  currentStreak?: number;
  promosThisWeek?: number;
}

export interface LeaderboardData {
  globalXP: LeaderboardEntry[];
  weeklyPromos: LeaderboardEntry[];
  streaks: LeaderboardEntry[];
  factions?: FactionLeaderboardEntry[]; // See Part 4
  userRank: {
    globalXP: number;
    weeklyPromos: number;
    streaks: number;
  };
}
```

### UI Component Structure

```
/src/components/Leaderboards/
  - LeaderboardsTab.tsx          (main container, tab switcher)
  - GlobalXPLeaderboard.tsx      (global XP rankings)
  - WeeklyPromosLeaderboard.tsx  (weekly promo rankings)
  - StreaksLeaderboard.tsx       (streak rankings)
  - FactionLeaderboard.tsx       (faction rankings)
  - LeaderboardEntry.tsx         (reusable entry row component)
```

### User's Own Rank Display

Show user's rank prominently even if not in Top 100:
```
┌─────────────────────────────────────┐
│ Your Rank: #247                     │
│ Ring Name: "The Rock"               │
│ XP: 3,450                           │
│ You're 550 XP behind rank #246!     │
└─────────────────────────────────────┘
```

---

## Part 3: Challenges (1v1 Competition)

### Challenge Concept

Players can challenge each other to complete a specific goal faster/better. Winner gets bonus XP and bragging rights.

### Challenge Types

**1. Promo Race**
- "First to complete 10 promos wins"
- Duration: 7 days
- Winner: +500 XP bonus

**2. Streak Duel**
- "Maintain the longest streak over 14 days"
- Winner: +750 XP bonus

**3. Goal Sprint**
- "First to complete 5 goals wins"
- Duration: 7 days
- Winner: +500 XP bonus

**4. XP Grind**
- "Gain the most XP in 7 days"
- Winner: +1000 XP bonus

### Challenge States

```typescript
export type ChallengeStatus =
  | 'pending'      // Sent, awaiting acceptance
  | 'active'       // Both accepted, in progress
  | 'completed'    // Finished, winner determined
  | 'declined'     // Recipient declined
  | 'expired';     // Not accepted within 48 hours

export type ChallengeType =
  | 'promo_race'
  | 'streak_duel'
  | 'goal_sprint'
  | 'xp_grind';

export interface Challenge {
  id: string;
  type: ChallengeType;
  challengerId: string;      // User who sent challenge
  challengerName: string;
  opponentId: string;        // User who received challenge
  opponentName: string;
  status: ChallengeStatus;
  target: number;            // Target value (e.g., 10 promos)
  duration: number;          // Duration in days
  bonusXP: number;           // XP reward for winner
  startedAt: number | null;  // Timestamp when accepted
  expiresAt: number | null;  // Timestamp when challenge ends
  winnerId: string | null;   // Winner user ID
  challengerProgress: number;
  opponentProgress: number;
  createdAt: number;
}
```

### Database Schema

```sql
CREATE TABLE IF NOT EXISTS public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('promo_race', 'streak_duel', 'goal_sprint', 'xp_grind')),
  challenger_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  opponent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'declined', 'expired')),
  target INT NOT NULL,
  duration INT NOT NULL, -- days
  bonus_xp INT NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  winner_id UUID REFERENCES auth.users(id),
  challenger_progress INT DEFAULT 0,
  opponent_progress INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_challenges_challenger ON public.challenges(challenger_id);
CREATE INDEX IF NOT EXISTS idx_challenges_opponent ON public.challenges(opponent_id);
CREATE INDEX IF NOT EXISTS idx_challenges_status ON public.challenges(status);

-- RLS Policies
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own challenges"
  ON public.challenges FOR SELECT
  USING (auth.uid() = challenger_id OR auth.uid() = opponent_id);

CREATE POLICY "Users can create challenges"
  ON public.challenges FOR INSERT
  WITH CHECK (auth.uid() = challenger_id);

CREATE POLICY "Users can update own challenges"
  ON public.challenges FOR UPDATE
  USING (auth.uid() = challenger_id OR auth.uid() = opponent_id);
```

### Challenge Flow

1. **User A sends challenge to User B**
   - Select opponent from leaderboard or search
   - Choose challenge type
   - Challenge status: `pending`

2. **User B receives notification**
   - "🥊 You've been challenged by [User A] to a Promo Race!"
   - Accept or Decline

3. **If accepted**
   - Challenge status: `active`
   - `startedAt` timestamp set
   - `expiresAt` = `startedAt + duration`
   - Both users' progress tracked automatically

4. **Progress tracking**
   - App updates `challenger_progress` and `opponent_progress` after each promo/goal
   - UI shows live progress bars

5. **Challenge ends**
   - When `expiresAt` reached OR one user hits `target`
   - Winner determined by highest progress
   - Bonus XP awarded
   - Challenge status: `completed`

### UI Components

```
/src/components/Challenges/
  - ChallengesTab.tsx           (main container)
  - ActiveChallenges.tsx        (list of active challenges)
  - PendingChallenges.tsx       (received challenges awaiting response)
  - ChallengeHistory.tsx        (completed challenges)
  - CreateChallenge.tsx         (modal to send new challenge)
  - ChallengeCard.tsx           (individual challenge display)
  - ChallengeProgressBar.tsx    (visual progress comparison)
```

### Challenge Notifications

In-app notifications for:
- New challenge received
- Challenge accepted
- Challenge declined
- Challenge completed (you won/lost)
- Opponent made progress (optional, can be toggled)

---

## Part 4: Factions (Teams/Guilds)

### Faction Concept

Factions are teams of players who:
- Share a combined XP leaderboard rank
- Collaborate on faction goals
- Compete against other factions
- Have private faction chat (future)
- Share resources/boosts (future)

### Faction Structure

```typescript
export interface Faction {
  id: string;
  name: string;               // Unique faction name (e.g., "The Shield", "nWo")
  tagline: string | null;     // Optional motto/catchphrase
  logoUrl: string | null;     // Optional faction logo (future)
  founderId: string;          // User who created faction
  createdAt: number;
  memberCount: number;
  totalXP: number;            // Sum of all member XP
  rank: number | null;        // Position on faction leaderboard
  isRecruiting: boolean;      // Open to join requests
  requiredXP: number;         // Minimum XP to join (0 = anyone)
  maxMembers: number;         // Max capacity (default 50)
}

export interface FactionMember {
  userId: string;
  factionId: string;
  ringName: string;
  xp: number;
  role: 'founder' | 'officer' | 'member';
  joinedAt: number;
  contributedXP: number;      // XP gained while in faction
}

export interface FactionInvite {
  id: string;
  factionId: string;
  factionName: string;
  inviterId: string;          // Member who sent invite
  inviterName: string;
  recipientId: string;        // User being invited
  status: 'pending' | 'accepted' | 'declined';
  createdAt: number;
  expiresAt: number;          // 48 hour expiration
}
```

### Database Schema

```sql
-- Factions table
CREATE TABLE IF NOT EXISTS public.factions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  tagline TEXT,
  logo_url TEXT,
  founder_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_recruiting BOOLEAN DEFAULT true,
  required_xp INT DEFAULT 0,
  max_members INT DEFAULT 50
);

CREATE INDEX IF NOT EXISTS idx_factions_name ON public.factions(name);

-- Faction members table
CREATE TABLE IF NOT EXISTS public.faction_members (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  faction_id UUID REFERENCES public.factions(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('founder', 'officer', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  contributed_xp INT DEFAULT 0,
  PRIMARY KEY (user_id, faction_id)
);

CREATE INDEX IF NOT EXISTS idx_faction_members_faction ON public.faction_members(faction_id);
CREATE INDEX IF NOT EXISTS idx_faction_members_user ON public.faction_members(user_id);

-- Faction invites table
CREATE TABLE IF NOT EXISTS public.faction_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  faction_id UUID REFERENCES public.factions(id) ON DELETE CASCADE NOT NULL,
  inviter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  UNIQUE(faction_id, recipient_id, status) -- Prevent duplicate pending invites
);

CREATE INDEX IF NOT EXISTS idx_faction_invites_recipient ON public.faction_invites(recipient_id);
CREATE INDEX IF NOT EXISTS idx_faction_invites_status ON public.faction_invites(status);

-- RLS Policies
ALTER TABLE public.factions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faction_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faction_invites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Factions are viewable by everyone"
  ON public.factions FOR SELECT
  USING (true);

CREATE POLICY "Users can create factions"
  ON public.factions FOR INSERT
  WITH CHECK (auth.uid() = founder_id);

CREATE POLICY "Founders and officers can update faction"
  ON public.factions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.faction_members
      WHERE faction_id = id
      AND user_id = auth.uid()
      AND role IN ('founder', 'officer')
    )
  );

CREATE POLICY "Members can view faction members"
  ON public.faction_members FOR SELECT
  USING (true);

CREATE POLICY "Users can view own invites"
  ON public.faction_invites FOR SELECT
  USING (auth.uid() = recipient_id OR auth.uid() = inviter_id);
```

### Faction Features

**1. Create Faction**
- Unlocked at 2,000 XP (Midcarder tier)
- Founder chooses unique faction name
- Set optional tagline
- Set recruiting status (open/closed)
- Set minimum XP requirement for auto-join

**2. Join Faction**
- Browse faction directory
- Request to join (if recruiting open and meet XP req)
- Accept invitation from faction member
- Leave faction anytime (founders must transfer ownership first)

**3. Faction Roles**
- **Founder**: Full control, can promote officers, kick members, disband faction
- **Officer**: Can invite members, kick members (not officers/founder)
- **Member**: Standard member, no admin powers

**4. Faction XP System**
- Faction's total XP = sum of all member XP
- Faction leaderboard ranks factions by total XP
- Individual XP gains contribute to faction total automatically
- "Contributed XP" tracks how much you gained while in faction

**5. Faction Goals (Future)**
- Collaborative goals like "Faction members complete 100 combined promos this week"
- Faction-wide rewards when goals completed

### UI Components

```
/src/components/Factions/
  - FactionsTab.tsx              (main container)
  - FactionDirectory.tsx         (browse all factions)
  - MyFaction.tsx                (current faction details)
  - FactionMembers.tsx           (roster list)
  - FactionInvites.tsx           (pending invites)
  - CreateFaction.tsx            (modal to create new faction)
  - FactionCard.tsx              (faction display card)
  - FactionLeaderboard.tsx       (faction rankings)
  - FactionSettings.tsx          (admin panel for founder/officers)
```

### Faction Leaderboard Entry

```typescript
export interface FactionLeaderboardEntry {
  rank: number;
  factionId: string;
  factionName: string;
  tagline: string | null;
  totalXP: number;
  memberCount: number;
  topMembers: {              // Top 3 contributors
    ringName: string;
    avatar: Avatar;
    xp: number;
  }[];
}
```

---

## Part 5: Integration & User Flow

### New User Journey

**1. Sign Up**
- Create account (email/password)
- Enter onboarding flow

**2. Onboarding (0 XP - Rookie)**
- Welcome screen
- Auto-assigned name: "Rookie #[4-digit-random]"
- Optional epithet input (can skip)
- Choose starter avatar (4 options)
- Complete onboarding

**3. Early Game (0 - 249 XP)**
- Single-player progression
- Complete promos, set goals
- Learn the app mechanics
- See leaderboards (view-only, can't challenge yet)
- **Goal:** Reach 250 XP to unlock custom name

**4. Jobber Tier (250 XP)**
- **Unlock Notification:** "🎤 You've earned the right to choose your ring name!"
- Claim custom ring name (unique check)
- Can now appear properly on leaderboards
- Can send/receive challenges (unlocked)
- Epithet still optional

**5. Midcarder (2,000 XP)**
- **Unlock: Create Faction**
- Can found or join factions
- Participate in faction leaderboards
- Continue challenges and individual progression

**6. Main Eventer (10,000 XP)**
- **Unlock: Gimmick Tagline**
- Set custom catchphrase (120 chars)
- Appears on trading card and leaderboards
- Full social features unlocked

**7. Legend (25,000 XP)**
- **Unlock: Unlimited Customization**
- Change ring name anytime
- Update gimmick anytime
- Change faction (with cooldown)

### Main App Navigation

Add new tabs to bottom navigation:

```
┌──────────────────────────────────────────┐
│  [Promo] [Goals] [Profile] [Board] [Fac] │
└──────────────────────────────────────────┘

Promo  = Daily Promo (existing)
Goals  = Goals tab (existing)
Profile = Profile/TradingCard (existing)
Board  = NEW: Leaderboards + Challenges
Fac    = NEW: Factions (unlocked at 2000 XP)
```

**Leaderboards Tab Structure:**
```
Leaderboards & Challenges
├─ Leaderboards (sub-tabs)
│  ├─ Global XP
│  ├─ Weekly Promos
│  ├─ Streaks
│  └─ Factions
└─ Challenges (sub-tabs)
   ├─ Active
   ├─ Pending
   └─ History
```

### Notifications System

Add in-app notification center for:
- Challenge received
- Challenge accepted/declined
- Challenge completed (won/lost)
- Faction invite received
- Faction member joined/left
- Faction promoted to new rank
- XP milestones reached
- New avatar unlocked

UI: Bell icon in header, shows unread count

---

## Part 6: XP Unlock Progression Summary

| XP Threshold | Title | Unlocks |
|--------------|-------|---------|
| 0 | Rookie | Auto-generated name, starter avatars |
| 250 | Jobber | **Custom ring name**, challenges, 2 new avatars |
| 750 | Enhancement Talent | 2 new avatars |
| 2,000 | Midcarder | **Create/Join Factions**, 2 new avatars |
| 5,000 | Upper Midcard | 2 new avatars |
| 10,000 | Main Eventer | **Gimmick tagline**, 2 new avatars |
| 25,000 | World Champion | **Unlimited name/gimmick changes**, 2 new avatars |
| 50,000 | Hall of Famer | 2 new avatars |

---

## Part 7: Technical Implementation Order

### Phase 1: Identity System (Immediate)
1. Update database schema (ring_name unique, gimmick column)
2. Add `hasClaimedCustomName` flag to profiles
3. Auto-generate "Rookie #XXXX" names for new signups
4. Update onboarding to NOT ask for custom name
5. Add "Claim Your Name" UI at 250 XP
6. Add gimmick input field at 10,000 XP (ProfileEditor)
7. Enable free changes at 25,000 XP

### Phase 2: Leaderboards
1. Create materialized view for XP leaderboard
2. Add Supabase functions to fetch leaderboard data
3. Build LeaderboardsTab UI component
4. Add GlobalXPLeaderboard component
5. Add WeeklyPromosLeaderboard (computed from promos table)
6. Add StreaksLeaderboard
7. Add user rank display ("You're rank #247")

### Phase 3: Challenges
1. Create challenges table
2. Add Supabase RLS policies
3. Add challenge creation UI (modal)
4. Add challenge acceptance/decline UI
5. Implement progress tracking (auto-update on promo/goal complete)
6. Add winner determination logic
7. Award bonus XP on completion
8. Build challenge history view

### Phase 4: Factions
1. Create factions, faction_members, faction_invites tables
2. Add Supabase RLS policies
3. Add "Create Faction" UI (unlocked at 2000 XP)
4. Build faction directory (browse/search)
5. Add join/leave faction flows
6. Build faction member roster view
7. Add faction invite system
8. Create faction leaderboard
9. Add faction tab to navigation

### Phase 5: Notifications
1. Design notification data structure
2. Create notifications table
3. Add notification creation triggers (challenge received, etc.)
4. Build notification center UI
5. Add unread count badge
6. Implement mark-as-read functionality

---

## Part 8: Open Questions & Decisions Needed

**1. Challenge Limits**
- How many active challenges can a user have at once? (Suggestion: 3)
- How many challenges can a user send per week? (Suggestion: 5)
- Can you challenge the same person multiple times? (Suggestion: Yes, but 24hr cooldown)

**2. Faction Limits**
- Can a user be in multiple factions? (Suggestion: No, one faction at a time)
- Cooldown after leaving faction before joining new one? (Suggestion: 48 hours)
- Minimum members to appear on faction leaderboard? (Suggestion: 3)

**3. Name Change Rules**
- Before 25,000 XP, can users change their name after claiming? (Suggestion: No, one-time claim)
- If name becomes inactive (user deleted), does it free up? (Suggestion: Yes, after 30 days)

**4. Gimmick Display**
- Show gimmick on every screen or only specific places? (Suggestion: Profile, Leaderboards, Challenges)
- Max gimmick length? (Suggestion: 120 characters)

**5. XP Exploits**
- Should challenges have a minimum XP requirement to prevent farming? (Suggestion: Yes, 500 XP minimum)
- Should faction hopping have penalties? (Suggestion: Cooldown period)

---

## Part 9: Future Enhancements (Out of Scope for Now)

- **Faction Chat**: Real-time chat for faction members
- **Faction Goals**: Collaborative weekly goals for factions
- **Faction Store**: Spend faction currency on boosts/avatars
- **Seasons**: Leaderboard resets every 3 months with rewards
- **Titles/Badges**: Cosmetic achievements (e.g., "3x Challenge Champion")
- **Direct Messaging**: Private messages between users
- **Spectate Challenges**: Watch other users' challenges in progress
- **Challenge Wagers**: Bet XP on challenge outcomes
- **Faction Wars**: Head-to-head faction competitions
- **Referral System**: Invite friends, get bonus XP
- **Social Feed**: Activity stream of faction/friend actions

---

## Part 10: Next Steps

**Before Implementation:**
1. Review this plan with stakeholders
2. Answer open questions in Part 8
3. Finalize XP thresholds and unlock progression
4. Design mockups for new UI components
5. Estimate development timeline for each phase

**Implementation Priority:**
1. **Phase 1** (Identity System) - Foundation for everything else
2. **Phase 2** (Leaderboards) - Adds competitive element
3. **Phase 3** (Challenges) - 1v1 engagement
4. **Phase 4** (Factions) - Team play
5. **Phase 5** (Notifications) - Keeps users engaged

**Estimated Timeline:**
- Phase 1: 3-5 days
- Phase 2: 3-4 days
- Phase 3: 5-7 days
- Phase 4: 7-10 days
- Phase 5: 2-3 days

**Total: ~3-4 weeks for full social/multiplayer suite**

---

**End of Plan**
