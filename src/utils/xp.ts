import { STREAK_MULTIPLIERS, TITLES, STREAK_MESSAGES, HABIT_CELEBRATION_LINES } from '../data/xp';

export const getStreakMultiplier = (streak: number): number => {
  for (const { days, multiplier } of STREAK_MULTIPLIERS) {
    if (streak >= days) return multiplier;
  }
  return 1.0;
};

export const calculateXPWithMultiplier = (baseXP: number, streak: number): number => {
  return Math.floor(baseXP * getStreakMultiplier(streak));
};

export const getCurrentTitle = (xp: number) => {
  let currentTitle = TITLES[0];
  for (const title of TITLES) {
    if (xp >= title.xpRequired) currentTitle = title;
    else break;
  }
  return currentTitle;
};

export const getNextTitle = (xp: number) => {
  for (const title of TITLES) {
    if (xp < title.xpRequired) return title;
  }
  return null;
};

export const getXPToNextTitle = (xp: number): number => {
  const next = getNextTitle(xp);
  return next ? next.xpRequired - xp : 0;
};

export const getStreakMessage = (streak: number): string | null => {
  const match = STREAK_MESSAGES.find(s => s.days === streak);
  return match?.message || null;
};

export const getRandomCelebration = (): string => {
  return HABIT_CELEBRATION_LINES[Math.floor(Math.random() * HABIT_CELEBRATION_LINES.length)];
};
