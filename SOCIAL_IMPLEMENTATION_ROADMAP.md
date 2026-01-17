# Social & Multiplayer Implementation Roadmap

**Branch:** `feature/social-multiplayer`
**Date:** 2026-01-17
**Status:** Planning Complete - Ready for Implementation

---

## Implementation Phases

### ✅ Phase 0: Foundation (COMPLETED)
- [x] Avatar system with XP-based unlocking
- [x] Unique ring_name constraint in database
- [x] Optional epithet field
- [x] Auto-generated "Rookie #XXXX" names
- [x] Profile trigger for new user signups
- [x] Onboarding flow with avatar selection

### 🚧 Phase 1: Progressive Identity System (NEXT)
**Goal:** Enable users to claim custom names and set gimmicks as they progress

**Tasks:**
1. Add `has_claimed_custom_name` column to profiles (already in migration)
2. Add `gimmick` column to profiles (already in migration)
3. Create helper functions in `src/utils/identity.ts`
4. Update ProfileEditor to show:
   - "Claim Your Name" button at 250+ XP (if not claimed)
   - "Set Your Gimmick" field at 10,000+ XP
   - Full edit access at 25,000+ XP
5. Add notification system for unlock achievements
6. Update TradingCard to display gimmick (speech bubble style)

**Database Changes:**
- Already applied in `social-identity-migration.sql`
- No additional migrations needed

**Files to Create:**
- `src/utils/identity.ts` - Helper functions for name/gimmick permissions
- `src/components/Profile/ClaimNameModal.tsx` - Name claiming UI
- `src/components/Profile/GimmickDisplay.tsx` - Comic book speech bubble

**Files to Modify:**
- `src/components/Profile/ProfileEditor.tsx` - Add conditional fields
- `src/components/Profile/TradingCard.tsx` - Display gimmick
- `src/services/supabaseService.ts` - Add claimCustomName(), setGimmick()
- `src/types/index.ts` - Update UserProfile interface

---

### Phase 2: Leaderboards
**Goal:** Display rankings for XP, weekly promos, and streaks

**Tasks:**
1. Create materialized views in Supabase
2. Build Leaderboards tab component
3. Implement real-time rank fetching
4. Add "Your Rank" display for user
5. Create leaderboard entry cards

**Database Changes:**
```sql
-- Create materialized view for global XP leaderboard
CREATE MATERIALIZED VIEW public.leaderboard_xp AS ...

-- Create view for weekly promos leaderboard
CREATE VIEW public.leaderboard_weekly_promos AS ...

-- Create view for streak leaderboard
CREATE VIEW public.leaderboard_streaks AS ...
```

**Files to Create:**
- `src/components/Leaderboards/LeaderboardsTab.tsx`
- `src/components/Leaderboards/GlobalXPLeaderboard.tsx`
- `src/components/Leaderboards/WeeklyPromosLeaderboard.tsx`
- `src/components/Leaderboards/StreaksLeaderboard.tsx`
- `src/components/Leaderboards/LeaderboardEntry.tsx`
- `src/services/leaderboardService.ts`

**Files to Modify:**
- `src/App.tsx` - Add Leaderboards tab
- `src/types/index.ts` - Add LeaderboardEntry, LeaderboardData types

---

### Phase 3: Challenges (1v1 Competitive Goals)
**Goal:** Allow users to challenge each other to complete goals

**Tasks:**
1. Create challenges table in Supabase
2. Build challenge creation UI
3. Implement challenge acceptance/rejection
4. Add challenge notifications
5. Display active challenges in UI
6. Track challenge completion and declare winners

**Database Changes:**
```sql
CREATE TABLE public.challenges (
  id UUID PRIMARY KEY,
  challenger_id UUID REFERENCES auth.users(id),
  challenged_id UUID REFERENCES auth.users(id),
  goal_type TEXT NOT NULL,
  target_count INTEGER NOT NULL,
  wager_xp INTEGER DEFAULT 0,
  status TEXT NOT NULL, -- 'pending', 'active', 'completed', 'declined'
  winner_id UUID,
  created_at TIMESTAMP,
  expires_at TIMESTAMP,
  completed_at TIMESTAMP
);
```

**Files to Create:**
- `src/components/Challenges/ChallengesTab.tsx`
- `src/components/Challenges/CreateChallengeModal.tsx`
- `src/components/Challenges/ChallengeCard.tsx`
- `src/components/Challenges/ActiveChallenges.tsx`
- `src/services/challengeService.ts`

---

### Phase 4: Factions (Teams/Guilds)
**Goal:** Allow users to form teams and compete as groups

**Tasks:**
1. Create factions and faction_members tables
2. Build faction creation UI
3. Implement invite/join system
4. Add faction chat (optional future enhancement)
5. Display faction leaderboard
6. Show faction stats on profile

**Database Changes:**
```sql
CREATE TABLE public.factions (
  id UUID PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  motto TEXT,
  color TEXT,
  emblem TEXT,
  leader_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP
);

CREATE TABLE public.faction_members (
  faction_id UUID REFERENCES public.factions(id),
  user_id UUID REFERENCES auth.users(id),
  joined_at TIMESTAMP,
  role TEXT, -- 'leader', 'member'
  PRIMARY KEY (faction_id, user_id)
);
```

**Files to Create:**
- `src/components/Factions/FactionsTab.tsx`
- `src/components/Factions/CreateFactionModal.tsx`
- `src/components/Factions/FactionCard.tsx`
- `src/components/Factions/FactionLeaderboard.tsx`
- `src/services/factionService.ts`

---

## Implementation Priority

**Sprint 1 (Week 1):** Phase 1 - Progressive Identity
- Most impactful for existing users
- Builds on completed avatar system
- Low complexity, high value

**Sprint 2 (Week 2):** Phase 2 - Leaderboards
- Leverages existing profile data
- Adds competitive element
- Encourages user engagement

**Sprint 3 (Week 3):** Phase 3 - Challenges
- Adds direct player interaction
- Medium complexity
- Requires challenge tracking system

**Sprint 4 (Week 4):** Phase 4 - Factions
- Most complex feature
- Requires team management
- Builds on leaderboards and challenges

---

## Testing Strategy

### Phase 1 Testing
- [ ] New user gets "Rookie #XXXX" name
- [ ] At 250 XP, "Claim Your Name" appears
- [ ] Name uniqueness validation works
- [ ] At 10,000 XP, gimmick field unlocks
- [ ] At 25,000 XP, full edit access granted
- [ ] Gimmick displays on trading card

### Phase 2 Testing
- [ ] Leaderboards load and display correctly
- [ ] User's rank is accurate
- [ ] Weekly leaderboard resets properly
- [ ] Materialized view refreshes on schedule

### Phase 3 Testing
- [ ] Challenge creation works
- [ ] Challenge acceptance/rejection flow
- [ ] Challenge completion detection
- [ ] Winner declaration and XP transfer

### Phase 4 Testing
- [ ] Faction creation and name uniqueness
- [ ] Invite and join flow
- [ ] Faction leaderboard calculation
- [ ] Leaving/joining different factions

---

## Database Migration Order

1. ✅ `complete-profile-fix.sql` - Already run (foundation)
2. ⏳ `leaderboards-migration.sql` - Create views for Phase 2
3. ⏳ `challenges-migration.sql` - Create tables for Phase 3
4. ⏳ `factions-migration.sql` - Create tables for Phase 4

---

## Next Steps

1. **Review this roadmap** with stakeholders
2. **Begin Phase 1 implementation** - Progressive Identity System
3. **Set up testing environment** for multiplayer features
4. **Create UI mockups** for leaderboards and challenges (optional)
5. **Plan notification system** for achievements and challenges

---

## Notes

- All features maintain backward compatibility with existing single-player experience
- Multiplayer features are opt-in (users can ignore leaderboards/challenges)
- RLS policies needed for all new tables to ensure data security
- Consider rate limiting for challenge creation to prevent spam
- Faction size limits (e.g., max 50 members) should be configurable
