import type { AppData, Belt, Avatar } from '../types';
import { AVATAR_CATALOG } from '../data/avatars';

export const checkAvatarUnlocks = (xp: number, currentAvatars: Avatar[]): Avatar[] => {
  const newUnlocks: Avatar[] = [];

  AVATAR_CATALOG.forEach(avatar => {
    const alreadyUnlocked = currentAvatars.some(a => a.id === avatar.id);
    const meetsXPRequirement = xp >= avatar.unlockedAtXP;

    if (!alreadyUnlocked && meetsXPRequirement) {
      newUnlocks.push(avatar);
    }
  });

  return newUnlocks;
};

export const checkAchievements = (data: AppData): Belt[] => {
  const belts = [...data.belts];
  const now = Date.now();

  // Ironman - 30 day streak
  if (data.user && data.user.currentStreak >= 30) {
    const belt = belts.find(b => b.id === 'ironman');
    if (belt && !belt.earnedAt) belt.earnedAt = now;
  }

  // Hardcore - 10 heel promos with face follow-ups
  const heelFollowUps = data.promos.filter(p => p.type === 'heel' && p.faceFollowUp).length;
  if (heelFollowUps >= 10) {
    const belt = belts.find(b => b.id === 'hardcore');
    if (belt && !belt.earnedAt) belt.earnedAt = now;
  }

  // 24/7 - Log at 5+ different hours in one day
  const promosByDate: Record<string, Set<number>> = {};
  data.promos.forEach(p => {
    const date = new Date(p.createdAt).toISOString().split('T')[0];
    const hour = new Date(p.createdAt).getHours();
    if (!promosByDate[date]) promosByDate[date] = new Set();
    promosByDate[date].add(hour);
  });
  if (Object.values(promosByDate).some(hours => hours.size >= 5)) {
    const belt = belts.find(b => b.id === '247');
    if (belt && !belt.earnedAt) belt.earnedAt = now;
  }

  // Intercontinental - Complete 3 Main Events
  const completedMainEventCount = data.goals.filter(g => g.tier === 'main' && g.status === 'completed').length;
  if (completedMainEventCount >= 3) {
    const belt = belts.find(b => b.id === 'intercontinental');
    if (belt && !belt.earnedAt) belt.earnedAt = now;
  }

  // Money in the Bank - Big One past 50%
  if (data.user?.theBigOne && data.user.theBigOne.percentage >= 50) {
    const belt = belts.find(b => b.id === 'mitb');
    if (belt && !belt.earnedAt) belt.earnedAt = now;
  }

  // World Heavyweight - Complete a main event with 50+ midcard hours
  const completedMainEvents = data.goals.filter(g => g.tier === 'main' && g.status === 'completed');
  for (const goal of completedMainEvents) {
    const linkedBlocks = data.midcardConfig.timeBlocks.filter(b => b.linkedGoalId === goal.id);
    const totalHours = linkedBlocks.reduce((sum, b) => sum + b.loggedHours, 0);
    if (totalHours >= 50) {
      const belt = belts.find(b => b.id === 'whc');
      if (belt && !belt.earnedAt) {
        belt.earnedAt = now;
        break; // Only award once
      }
    }
  }

  // Grand Slam - Hold 4+ belts
  if (belts.filter(b => b.earnedAt !== null).length >= 4) {
    const belt = belts.find(b => b.id === 'grandslam');
    if (belt && !belt.earnedAt) belt.earnedAt = now;
  }

  return belts;
};
