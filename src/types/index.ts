export type PromoType = 'face' | 'heel';
export type Impact = 'pop' | 'heat';
export type GoalTier = 'midcard' | 'runin' | 'main';
export type GoalStatus = 'active' | 'completed' | 'archived';
export type RunInType = 'person' | 'moment';

export interface BigOneUpdate {
  id: string;
  previousPercentage: number;
  newPercentage: number;
  promoId: string;
  timestamp: number;
}

export interface Avatar {
  id: string;
  name: string;
  svgPath: string;
  unlockedAtXP: number;
  unlockedAtTitle?: string;
  description: string;
}

export interface UserProfile {
  id: string;
  ringName: string;
  epithet: string | null;
  createdAt: number;
  xp: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  soundEnabled: boolean;
  selectedAvatar: string;
  theBigOne: {
    description: string;
    percentage: number;
    createdAt: number;
    updates: BigOneUpdate[];
  } | null;
  completedBigOnes: CompletedBigOne[];
  hasCompletedOnboarding: boolean;
}

export interface CompletedBigOne {
  description: string;
  percentage: number;
  createdAt: number;
  completedAt: number;
  victoryPromo: string;
}

export interface Promo {
  id: string;
  type: PromoType;
  content: string;
  promptUsed: string | null;
  isFreestyle: boolean;
  storylineId: string | null;
  impact: Impact | null;
  faceFollowUp: string | null;
  createdAt: number;
  xpEarned: number;
}

export interface Goal {
  id: string;
  title: string;
  tier: GoalTier;
  status: GoalStatus;
  createdAt: number;
  completedAt: number | null;
  victoryPromo: string | null;
}

export interface HotTag {
  id: string;
  note: string;
  characterType: 'face' | 'heel';
  createdAt: number;
  dismissed: boolean;
}

export interface RunIn {
  id: string;
  type: RunInType;
  // For 'person' type
  name: string;
  role: string;
  // For 'moment' type
  momentTitle: string | null;
  // Shared fields
  notes: string;
  linkedGoalId: string | null;
  hoursContributed: number;
  firstEncounter: number;
  lastUpdate: number;
  // Entry promo when logging
  entryPromo: string | null;
  impact: Impact | null;
}

export interface Habit {
  id: string;
  name: string;
  isHardcoded: boolean;
  enabled: boolean;
}

export interface OpeningContest {
  habits: Habit[];
  completedToday: string[];
  lastResetDate: string;
}

export interface Belt {
  id: string;
  name: string;
  requirement: string;
  earnedAt: number | null;
}

export interface TimeBlock {
  id: string;
  name: string;
  allocatedHours: number;
  loggedHours: number;
  isDaily: boolean;
  isCompleted: boolean;
  linkedGoalId: string | null;
  timerStartedAt: number | null;
  createdAt: number;
  // Daily booking system
  bookedForDate: string | null;    // YYYY-MM-DD if booked for a specific day
  bookedHours: number;             // Hours allocated for today's booking
  promoCompleted: boolean;         // Has a promo been cut for today's work?
}

// A promo cut about a specific time block session
export interface TimeBlockPromo {
  id: string;
  timeBlockId: string;
  timeBlockName: string;           // Snapshot of block name at time of promo
  linkedGoalId: string | null;     // Inherited from time block
  type: PromoType;
  content: string;
  faceFollowUp: string | null;
  impact: Impact;
  bookedHours: number;             // What was planned
  actualHours: number;             // What was worked
  date: string;                    // YYYY-MM-DD
  createdAt: number;
  xpEarned: number;
}

export interface MidcardConfig {
  timeBlocks: TimeBlock[];
  dailyBudget: number;
  lastResetDate: string;
  // Daily booking state
  cardBookedForDate: string | null;  // When the current card was booked
  showStarted: boolean;               // Has the user started today's show?
}

// Tracks pending promos from yesterday that need completion
export interface PendingPromoBlock {
  timeBlockId: string;
  timeBlockName: string;
  linkedGoalId: string | null;
  bookedHours: number;
  actualHours: number;
  date: string;
}

export interface AppData {
  user: UserProfile | null;
  promos: Promo[];
  goals: Goal[];
  hotTags: HotTag[];
  runIns: RunIn[];
  openingContest: OpeningContest;
  belts: Belt[];
  midcardConfig: MidcardConfig;
  timeBlockPromos: TimeBlockPromo[];
  pendingPromoBlocks: PendingPromoBlock[];
  availableAvatars: Avatar[];
}
