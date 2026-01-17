# KAYFABE Heat Reaction System Design

**Date:** 2026-01-17
**Purpose:** Integrate Heat reactions into community feed to validate heel promos
**Core Insight:** In wrestling, getting booed (heat) is as valuable as getting cheered (pops)

---

## Part 1: The Psychology of Heat

### 1.1 Why Heat Matters

**In Wrestling:**
- Heels WANT heat - it means they're effective
- "Go away heat" = bad (boring villain)
- "Nuclear heat" = good (compelling villain everyone loves to hate)
- Heat = engagement, just like pops

**In Cognitive Reframing:**
- Heel promos embrace hard truths
- "I'm not good enough yet" (realistic self-assessment)
- "I'm angry and that's FUEL" (emotional awareness)
- "No excuses, just results" (tough love)
- Heat validates the rawness and authenticity

**The Problem Without Heat:**
- Only Face promos get rewarded (pops)
- Heel users feel less validated
- Community becomes one-note (toxic positivity)
- Misses the power of negative emotions as fuel

**The Solution:**
- Heat reactions reward compelling heel energy
- Both pops and heat count as "engagement"
- Users learn: ALL authentic narratives are valuable
- Creates balance in community

---

## Part 2: Heat vs Pops - The Dual Reaction System

### 2.1 How It Works

**Two Distinct Reactions:**

**👏 Pop (Applause)**
- For Face promos that inspire, empower, uplift
- "This motivated me!"
- "I needed to hear this today"
- Light, positive energy

**🔥 Heat (Fire)**
- For Heel promos that challenge, provoke, energize
- "This hit HARD"
- "Raw and real"
- Intense, powerful energy

**Key Principle:**
```
Pops ≠ Better Than Heat
Heat ≠ Better Than Pops

Both = Engagement
Both = Value
Both = Community Currency
```

---

### 2.2 Visual Design

**Post Display with Dual Reactions:**

```
┌─────────────────────────────────────┐
│ THE ROCK • 2h ago                   │
│ @therock • Main Eventer             │
├─────────────────────────────────────┤
│                                     │
│ 🎭 FACE PROMO                       │
│                                     │
│ "Woke up anxious. Then remembered: │
│ The Rock doesn't do anxiety.        │
│ The Rock electrifies.               │
│                                     │
│ Walked in and CRUSHED it. 💪"       │
│                                     │
├─────────────────────────────────────┤
│ 👏 2,847 Pops • 🔥 47 Heat          │
│ 💬 124 Comments • 🔖 89 Saves       │
│                                     │
│ [👏 Pop] [🔥 Heat] [💬] [🔖] [Share]│
└─────────────────────────────────────┘
```

**Note:** Face promo can still get Heat reactions!
- Some users might find it too aggressive
- Others might love the intensity
- Both reactions are valid feedback

---

**Heel Promo with High Heat:**

```
┌─────────────────────────────────────┐
│ STONE COLD • 4h ago                 │
│ @stonecold • Legend                 │
├─────────────────────────────────────┤
│                                     │
│ 😈 HEEL PROMO                       │
│                                     │
│ "Y'all talking about self-care?     │
│ Stone Cold don't need a bubble bath.│
│                                     │
│ I got ONE speed: ATTACK.            │
│ Every. Single. Day.                 │
│                                     │
│ While you're 'being gentle with    │
│ yourself,' I'm TAKING what's mine." │
│                                     │
├─────────────────────────────────────┤
│ 👏 412 Pops • 🔥 4,821 Heat         │
│ 💬 342 Comments • 🔖 891 Saves      │
│                                     │
│ [👏 Pop] [🔥 Heat] [💬] [🔖] [Share]│
└─────────────────────────────────────┘
```

**Analysis:**
- High Heat = Heel promo resonating
- Some Pops too = Cross-appeal (Face users relate to intensity)
- Heat >> Pops = Clear heel energy
- This is SUCCESS for a heel promo

---

### 2.3 User Can Give BOTH Reactions

**Important Design Decision:**

**Option A: One Reaction Per User (Either/Or)**
```
User can give 👏 OR 🔥, not both
Forces them to choose: "Was this inspiring OR intense?"

Pros:
- Clear signal
- Prevents spam
- Makes reactions more meaningful

Cons:
- Some promos deserve both
- Limits expression
```

**Option B: Can Give Both (Recommended)**
```
User can give 👏 AND/OR 🔥 (independently)

Example:
"This promo was inspiring (Pop) AND hit hard (Heat)!"

Pros:
- More expressive
- Captures nuance
- Better engagement data
- Users can react authentically

Cons:
- Slightly more complex
- Could inflate numbers

RECOMMENDED: Option B
```

**UI for Option B:**

```
[👏 Pop]  [🔥 Heat]  [💬]  [🔖]  [Share]
  ↑          ↑
  Both can be highlighted if user gave both
```

---

## Part 3: Heat Metrics & Gamification

### 3.1 Engagement Score (Combined)

**Total Engagement = Pops + Heat + Comments + Bookmarks**

```typescript
interface PostMetrics {
  pops: number;
  heat: number;
  comments: number;
  bookmarks: number;
  shares: number;

  // Computed
  totalEngagement: number; // pops + heat + comments + bookmarks
  popHeatRatio: number;    // pops / (pops + heat)
}
```

**Why Combine Them:**
- Both reactions = value
- Prevents Face bias in algorithm
- Heel promos can trend too
- Encourages diverse content

---

### 3.2 New Leaderboards with Heat

**1. Most Heat This Week**
```
┌─────────────────────────────────────┐
│ 🔥 MOST HEAT THIS WEEK              │
├─────────────────────────────────────┤
│                                     │
│ 🥇 #1 Stone Cold                    │
│    8,247 Heat • "No Excuses Week"   │
│    😈 Heel Promo                    │
│                                     │
│ 🥈 #2 The Undertaker                │
│    6,891 Heat • "Embrace the Dark"  │
│    😈 Heel Promo                    │
│                                     │
│ 🥉 #3 CM Punk                       │
│    5,432 Heat • "Reality Check"     │
│    😈 Heel Promo                    │
│                                     │
│ ... your rank: #47 (847 Heat)       │
└─────────────────────────────────────┘
```

**Why This Matters:**
- Validates heel content creators
- Shows heel promos are valued
- Creates aspirational goal for heel users
- Prevents Face-only culture

---

**2. Purest Face (Most Pops, Low Heat)**
```
Ranks users by Pop-to-Heat ratio (≥ 80% pops)
Shows: "This user is PURE Face energy"

Example:
🥇 #1 John Cena - 98% Pops (12,847 total)
     "The positivity machine"
```

---

**3. Nuclear Heel (Most Heat, Low Pops)**
```
Ranks users by Heat-to-Pop ratio (≥ 80% heat)
Shows: "This user brings the HEAT"

Example:
🥇 #1 Stone Cold - 94% Heat (9,281 total)
     "The ruthless one"
```

---

**4. The Tweener (Balanced Heat + Pops)**
```
Ranks users closest to 50/50 split
Shows: "This user plays both sides"

Example:
🥇 #1 The Rock - 52% Pops, 48% Heat (18,492 total)
     "Can work both Face and Heel"
```

**Why These Work:**
- Rewards different styles
- Everyone can find their leaderboard
- No single "best" way to engage
- Encourages authenticity

---

### 3.3 Profile Stats

**User Profile Shows:**

```
┌─────────────────────────────────────┐
│  [Avatar] THE ROCK                  │
│  "Can you smell what I'm cooking?"  │
│  ⭐ Main Eventer                    │
├─────────────────────────────────────┤
│                                     │
│  Engagement Stats                   │
│  👏 47,821 Total Pops               │
│  🔥 42,109 Total Heat               │
│  📊 53% Face / 47% Heel             │
│                                     │
│  Most Successful Post               │
│  "The Comeback Story"               │
│  👏 4,821 Pops • 🔥 3,291 Heat      │
│                                     │
│  Alignment: 🎭 Tweener              │
│  (Can work both Face and Heel)      │
└─────────────────────────────────────┘
```

**Alignment Badge (Auto-Assigned):**
- 🌟 Pure Face: ≥ 80% pops
- 🔥 Pure Heel: ≥ 80% heat
- 🎭 Tweener: 40-60% either way

**Why Show This:**
- Users see their style
- Can adjust if they want balance
- Community knows what to expect
- Creates identity

---

## Part 4: Heat Reactions in Challenges

### 4.1 Heat-Specific Challenges

**Challenge: "The 7-Day Heel Turn"**

```
Goal: Post 7 Heel promos, earn 500+ Heat

Rules:
- All posts must be tagged Heel
- Must get avg 70+ Heat per post
- No gaming (buying reactions, spam)

Daily Prompt:
Day 1: "What makes you ANGRY? Channel it."
Day 2: "What 'soft' narrative are you DONE with?"
Day 3: "Cut a promo on your past self (no mercy)"
Day 4: "What would your heel character say about excuses?"
Day 5: "Raw truth time: What are you NOT good at yet?"
Day 6: "Channel your inner villain: What do you want to TAKE?"
Day 7: "Bring the heat: Your most intense reframe yet"

Rewards:
- "Brought The Heat" badge
- 🔥 Flame avatar effect
- +750 XP
- Featured on "Nuclear Heels" leaderboard

Leaderboard (During Challenge):
Ranked by TOTAL HEAT earned (not avg)
Shows: Name, Heat This Week, Spiciest Post
```

**Why This Works:**
- Validates heel content
- Encourages emotional honesty
- Practice channeling negative emotions productively
- Community sees value in "dark" narratives

---

**Challenge: "The Balanced Storyteller" (14 days)**

```
Goal: Post 7 Face + 7 Heel promos with balanced engagement

Rules:
- Exactly 7 Face, 7 Heel (alternate daily)
- Each must get ≥50 engagement (pops OR heat)
- Must show range

Daily Structure:
Day 1: Face promo (earn pops)
Day 2: Heel promo (earn heat)
...alternate...

Rewards:
- "Master of Both Styles" badge
- 🎭 Tweener alignment (can post without declaring)
- +1,000 XP
- Can change Face/Heel tag after posting

Why:
- Teaches narrative flexibility
- Users practice both reframing styles
- Shows that both are valid
- Builds psychological range
```

---

### 4.2 Heat in Community Challenges

**Premium Creator Challenge: "Stone Cold's Reality Check"**

```
Created by: Stone Cold Steve Austin ✓

Description:
"For 7 days, cut the BS. Post HEEL promos about
where you're ACTUALLY at. No sugar-coating.
Raw. Real. Ruthless.

Your heel character tells the truth your face
character won't admit."

Submission Requirements:
- 7 Heel promos
- Must earn ≥100 Heat each (community validates rawness)
- Tag #RealityCheck

Judging Criteria:
1. Honesty (40%) - How raw is it?
2. Heat Generated (30%) - Did community respond?
3. Reframe Quality (30%) - Did you turn truth into fuel?

Top 10 Prizes:
- Custom "Certified Badass" badge (designed by Stone Cold)
- 1-on-1 video call with Stone Cold
- Featured in Stone Cold's highlight reel
- +2,000 XP

Leaderboard:
Ranked by HEAT per post (avg)
Shows: Name, Avg Heat, Total Heat, Best Post
```

**Why This Works:**
- Creator validates heel content
- High Heat = meeting challenge goals
- Community engagement IS the metric
- Teaches that rawness = valuable

---

## Part 5: Heat Reaction Guidelines

### 5.1 When to Give Heat

**User Education (Tooltip on Heat Button):**

```
┌─────────────────────────────────────┐
│ 🔥 GIVE HEAT                        │
├─────────────────────────────────────┤
│                                     │
│ Give Heat when this promo:          │
│                                     │
│ ✓ Hit you hard                      │
│ ✓ Challenged you                    │
│ ✓ Felt raw and real                 │
│ ✓ Brought intense energy            │
│ ✓ Made you feel SOMETHING strong    │
│ ✓ Spoke a hard truth                │
│                                     │
│ Heat is NOT negative!               │
│ It means "This has POWER."          │
│                                     │
│ [Give 🔥 Heat]                      │
└─────────────────────────────────────┘
```

---

### 5.2 Heat vs Pops Decision Guide

**For Users Wondering Which to Give:**

```
If this promo made me feel...

😊 Inspired, motivated, uplifted
   → 👏 Pop

😤 Challenged, fired up, provoked
   → 🔥 Heat

🤔 Both inspired AND challenged
   → 👏 Pop + 🔥 Heat (give both!)

😐 Neutral, no strong reaction
   → Just bookmark or skip

😠 Angry at the user (not the message)
   → Report, don't react
```

---

### 5.3 Preventing Misuse

**Heat Should NOT Be Used For:**
- Hate speech
- Personal attacks
- Toxic behavior
- Harassment

**Moderation Rule:**
```
If a post gets:
- High Heat (500+) BUT
- High report count (20+)

→ Auto-review by moderators

Possible outcomes:
- Post is fine (intense but appropriate)
- Post crosses line → removed
- User warned/banned
```

**Example of GOOD Heat:**
```
"I'm SICK of making excuses.
Today I dragged my lazy ass to the gym
at 5am even though I didn't want to.
No one's coming to save you.
Save yourself."

→ Gets 1,200 Heat
→ 0 reports
→ Intense but empowering
```

**Example of BAD Heat (Would Get Reported):**
```
"You're all weak. You'll never amount
to anything. Just give up already."

→ Might get Heat from trolls
→ BUT also 50+ reports
→ Auto-flagged and removed
→ Not a reframe, just toxic
```

**The Difference:**
- Good Heat = Challenging self or ideas
- Bad Heat = Attacking others
- Good Heat = "I'm tough on MYSELF"
- Bad Heat = "I'm tough on YOU"

---

## Part 6: Heat in the Algorithm

### 6.1 Feed Ranking with Heat

**"For You" Algorithm (Personalized Feed):**

```typescript
interface AlgorithmWeights {
  // Engagement signals
  pops: 1.0,
  heat: 1.0,        // Equal weight to pops!
  comments: 2.0,    // Higher (sparks discussion)
  bookmarks: 1.5,
  shares: 3.0,      // Highest (external validation)

  // Personalization
  userFaceHeelRatio: number,  // Match user's style
  followsAuthor: boolean,     // People you follow
  similarTopics: number,      // Tags you engage with
  recency: number,            // Newer = higher
}

function calculateFeedScore(post: Post, user: User): number {
  let score = 0;

  // Base engagement
  score += post.pops * 1.0;
  score += post.heat * 1.0;  // HEAT COUNTS!
  score += post.comments * 2.0;
  score += post.bookmarks * 1.5;
  score += post.shares * 3.0;

  // Personalization
  if (user.followsAuthor(post.authorId)) {
    score *= 2.0;  // Boost followed users
  }

  // Match user's Face/Heel preference
  const userRatio = user.faceHeelRatio; // 0 = pure heel, 1 = pure face
  const postRatio = post.pops / (post.pops + post.heat);

  if (Math.abs(userRatio - postRatio) < 0.2) {
    score *= 1.5;  // Boost similar style
  }

  // Recency decay
  const hoursSincePost = (Date.now() - post.createdAt) / (1000 * 60 * 60);
  score *= Math.exp(-0.05 * hoursSincePost);  // Decay over time

  return score;
}
```

**Result:**
- Heel promos with high Heat rank just as high as Face promos with high Pops
- Users who engage with Heel content see more Heel content
- No algorithmic bias toward positivity
- Creates balanced feed

---

### 6.2 Trending Algorithm

**"Trending" Tab:**

```typescript
// Show posts gaining Heat OR Pops rapidly

function isTrending(post: Post): boolean {
  const engagementRate =
    (post.pops + post.heat + post.comments * 2) /
    getHoursSincePosted(post);

  const threshold = 50; // 50 eng/hour = trending

  return engagementRate >= threshold;
}

// Trending displays as:
"🔥 Trending Now - 1.2K Heat in 2 hours"
"👏 Trending Now - 3.4K Pops in 1 hour"
```

**Why This Works:**
- Momentum matters, not just total
- Both Heat and Pops can trend
- Shows diversity of community
- Heel promos can go viral too

---

## Part 7: UI/UX Refinements

### 7.1 Reaction Button Design

**Desktop:**
```
┌────────────────────────────────────┐
│ Engagement:                        │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐       │
│ │👏  │ │🔥  │ │💬  │ │🔖  │       │
│ │Pop │ │Heat│ │Talk│ │Save│       │
│ │2.8K│ │1.2K│ │124 │ │89  │       │
│ └────┘ └────┘ └────┘ └────┘       │
└────────────────────────────────────┘
```

**Mobile (Compact):**
```
👏 2.8K  🔥 1.2K  💬 124  🔖 89

[👏] [🔥] [💬] [🔖] [Share ↗]
```

**Active State:**
```
User has given Pop:
👏 2.8K (icon highlighted gold)

User has given Heat:
🔥 1.2K (icon highlighted orange/red)

User has given both:
👏 2.8K (gold) 🔥 1.2K (orange)
```

---

### 7.2 Reaction Animation

**When User Clicks "Give Heat":**

```
1. Button animates (pulse + glow)
2. Number increments (+1)
3. Small flame particle effect 🔥
4. Haptic feedback (mobile)
5. Optional: Sound effect ("whoosh" flame sound)
```

**When User Clicks "Give Pop":**

```
1. Button animates (bounce)
2. Number increments (+1)
3. Small confetti/applause particles 👏
4. Haptic feedback (mobile)
5. Optional: Sound effect (applause)
```

**Why Animations Matter:**
- Makes reactions feel rewarding
- Immediate feedback
- Encourages engagement
- Differentiates the two reactions

---

### 7.3 Post Composer with Heat/Pop Prediction

**Smart Composer Feature:**

```
┌─────────────────────────────────────┐
│ 📝 NEW POST                         │
├─────────────────────────────────────┤
│                                     │
│ ┌─────────────────────────────┐   │
│ │ Woke up at 5am. Didn't want │   │
│ │ to. Did it anyway. No       │   │
│ │ excuses. Just action.       │   │
│ └─────────────────────────────┘   │
│                                     │
│ This is a:                          │
│ ○ 🌟 Face Promo                    │
│ ● 😈 Heel Promo                    │
│                                     │
│ 💡 Predicted Reaction:              │
│ 🔥 High Heat potential              │
│ (Short, intense, action-focused)    │
│                                     │
│ Tips to increase Heat:              │
│ • Add more raw emotion              │
│ • Make it more challenging          │
│ • Cut deeper with truth             │
│                                     │
│ [Cancel] [Post]                     │
└─────────────────────────────────────┘
```

**How It Works:**
- AI analyzes draft
- Predicts likely reaction type
- Gives tips to optimize (if user wants)
- Educates users on what gets Heat vs Pops

**Training Data:**
- Historical posts
- What got high Heat vs high Pops
- Sentiment analysis
- Intensity markers

---

## Part 8: Heat Economy

### 8.1 XP from Reactions

**Current System:**
```
1 Pop = 0.1 XP
```

**Proposed with Heat:**
```
1 Pop = 0.1 XP
1 Heat = 0.1 XP  (equal value!)

Why Equal:
- No algorithmic bias
- Both are engagement
- Both take effort to earn
- Validates heel content creators
```

---

### 8.2 Achievement Badges

**Heat-Based Badges:**

```
🔥 "First Heat" - Get your first Heat reaction
🔥🔥 "Heating Up" - Earn 100 total Heat
🔥🔥🔥 "Nuclear Heat" - Earn 1,000 total Heat
💥 "Controversial" - Post gets 500+ Heat AND 500+ Pops (both!)
😈 "Certified Heel" - 80%+ of your reactions are Heat
🎭 "The Tweener" - Maintain 45-55% Heat/Pop ratio for 30 days
👹 "Villain of the Week" - Most Heat this week
```

**Display on Profile:**
```
┌─────────────────────────────────────┐
│ Badges Earned:                      │
│ 🔥🔥🔥 Nuclear Heat                  │
│ 😈 Certified Heel                   │
│ 💥 Controversial                    │
│ 👹 Villain of the Week (3x)         │
└─────────────────────────────────────┘
```

---

### 8.3 Heat Milestones

**Celebration Screens:**

**When User Hits 1,000 Total Heat:**
```
┌─────────────────────────────────────┐
│  🔥🔥🔥 NUCLEAR HEAT! 🔥🔥🔥          │
├─────────────────────────────────────┤
│                                     │
│  You've earned 1,000 Heat!          │
│                                     │
│  Your heel promos are RESONATING.   │
│  You bring the intensity.           │
│  You tell hard truths.              │
│  You channel your inner villain.    │
│                                     │
│  The community feels your FIRE.     │
│                                     │
│  Rewards:                           │
│  + "Nuclear Heat" badge             │
│  + 🔥 Flame avatar effect unlocked  │
│  + 500 XP bonus                     │
│                                     │
│  [Share Achievement] [Continue]     │
└─────────────────────────────────────┘
```

---

## Part 9: Implementation Plan

### 9.1 Database Changes

**Update `posts` table:**
```sql
ALTER TABLE public.posts
ADD COLUMN heat_count INTEGER DEFAULT 0;

-- Update engagement score calculation
CREATE OR REPLACE FUNCTION calculate_engagement_score(post_id UUID)
RETURNS INTEGER AS $$
  SELECT (pops_count + heat_count + comments_count * 2 + bookmarks_count)
  FROM posts WHERE id = post_id;
$$ LANGUAGE SQL;
```

**Update `post_engagements` table:**
```sql
-- engagement_type now includes 'heat'
-- Can have multiple rows per user per post:
-- - (user_1, post_1, 'pop')
-- - (user_1, post_1, 'heat')
-- Both allowed!

-- Remove UNIQUE constraint if it exists
ALTER TABLE public.post_engagements
DROP CONSTRAINT IF EXISTS post_engagements_post_id_user_id_engagement_type_key;

-- Add constraint: max one of each type per user
CREATE UNIQUE INDEX unique_user_post_engagement
ON public.post_engagements(post_id, user_id, engagement_type);
```

---

### 9.2 API Changes

**New endpoint: Give Heat**
```typescript
POST /api/posts/:postId/heat

Response:
{
  success: true,
  post: {
    id: "...",
    heat_count: 1201,
    pops_count: 2847,
    total_engagement: 4172
  }
}
```

**Update existing endpoint:**
```typescript
GET /api/posts/:postId

Response:
{
  id: "...",
  content: "...",
  face_heel: "heel",
  pops_count: 2847,
  heat_count: 1201,  // NEW
  comments_count: 124,
  bookmarks_count: 89,
  total_engagement: 4261,
  user_gave_pop: true,
  user_gave_heat: false  // NEW
}
```

---

### 9.3 Frontend Changes

**Component: `ReactionButtons.tsx`**
```typescript
interface ReactionButtonsProps {
  postId: string;
  popsCount: number;
  heatCount: number;
  commentsCount: number;
  bookmarksCount: number;
  userGavePop: boolean;
  userGaveHeat: boolean;
  onPop: () => void;
  onHeat: () => void;  // NEW
  onComment: () => void;
  onBookmark: () => void;
}

export const ReactionButtons: React.FC<ReactionButtonsProps> = ({
  popsCount,
  heatCount,
  userGavePop,
  userGaveHeat,
  onPop,
  onHeat,
  ...
}) => {
  return (
    <div className="flex gap-4">
      <button
        onClick={onPop}
        className={userGavePop ? 'active-pop' : ''}
      >
        👏 {popsCount.toLocaleString()}
      </button>

      <button
        onClick={onHeat}
        className={userGaveHeat ? 'active-heat' : ''}
      >
        🔥 {heatCount.toLocaleString()}
      </button>

      {/* ... other buttons */}
    </div>
  );
};
```

---

### 9.4 Testing Plan

**Test Cases:**

1. **User gives Pop only**
   - Pops count increments
   - Heat count unchanged
   - user_gave_pop = true
   - user_gave_heat = false

2. **User gives Heat only**
   - Heat count increments
   - Pops count unchanged
   - user_gave_heat = true
   - user_gave_pop = false

3. **User gives both Pop AND Heat**
   - Both counts increment
   - user_gave_pop = true
   - user_gave_heat = true

4. **User removes Pop**
   - Pops count decrements
   - Heat unchanged if they gave it
   - user_gave_pop = false

5. **User removes Heat**
   - Heat count decrements
   - Pops unchanged if they gave it
   - user_gave_heat = false

6. **Face promo gets more Pops than Heat**
   - Expected behavior
   - Shows on Face leaderboards

7. **Heel promo gets more Heat than Pops**
   - Expected behavior
   - Shows on Heel leaderboards

8. **Controversial post gets high both**
   - Shows on Tweener boards
   - Gets "Controversial" badge potential

---

## Part 10: Success Metrics

### 10.1 What We're Measuring

**Adoption:**
- % of users who give Heat reactions
- Avg Heat per Heel promo
- Heat vs Pop ratio (should be ~50/50 ideally)

**Engagement:**
- Total reactions (Pops + Heat) increase?
- Heel promos getting more engagement?
- Face-only users starting to post Heel content?

**Community Health:**
- Are Heat reactions being misused? (report rate)
- Are users educating each other on when to use Heat?
- Is toxic content getting Heat? (need to monitor)

**Creator Economy:**
- Do heel creators earn as much as face creators?
- Are challenges with Heat metrics successful?
- Do users want more Heat-focused challenges?

---

### 10.2 Success Looks Like

**6 Months After Launch:**
```
✅ 60%+ of active users have given Heat
✅ Heel promos get 70%+ as much Heat as Face promos get Pops
✅ Heat reaction misuse <2% (low report rate)
✅ "Most Heat" leaderboard has 100+ competitors
✅ 5+ premium creators running Heat-focused challenges
✅ Users self-report: "Heat validation helped me embrace my inner heel"
```

---

## Next Steps

1. **Review & Approve** - Does Heat system align with vision?
2. **Finalize Details:**
   - Can users give both reactions? (Recommend: YES)
   - Equal XP for Heat and Pops? (Recommend: YES)
   - Show Heat on all leaderboards or separate? (Recommend: BOTH)
3. **Update Database Schema** - Add heat_count column
4. **Build Heat Leaderboards** - At least 1 in MVP
5. **Design Reaction Animations** - Make Heat feel different from Pops
6. **User Education** - Tooltips, onboarding, examples
7. **Launch Beta Test** - Small group tries Heat reactions
8. **Monitor Usage** - Watch for misuse, iterate

---

**Heat makes KAYFABE complete. Both light and dark. Both Face and Heel. Both validated.** 🔥👏
