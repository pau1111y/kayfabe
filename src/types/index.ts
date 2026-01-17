export type PromoType = 'face' | 'heel';
export type Impact = 'pop' | 'heat';
export type GoalTier = 'opening' | 'midcard' | 'runin' | 'main';
export type GoalStatus = 'active' | 'completed' | 'archived';

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
  theBigOne: {
    description: string;
    percentage: number;
    createdAt: number;
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

export interface QuickTag {
  id: string;
  note: string;
  createdAt: number;
  dismissed: boolean;
}

export interface RunIn {
  id: string;
  name: string;
  role: string;
  notes: string;
  firstEncounter: number;
  lastUpdate: number;
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

export interface AppData {
  user: UserProfile | null;
  promos: Promo[];
  goals: Goal[];
  quickTags: QuickTag[];
  runIns: RunIn[];
  openingContest: OpeningContest;
  belts: Belt[];
}
