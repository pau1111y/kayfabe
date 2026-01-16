import type { AppData, Belt } from '../types';

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

  // Intercontinental - Complete goals in all tiers
  const completedTiers = new Set(data.goals.filter(g => g.status === 'completed').map(g => g.tier));
  if (completedTiers.has('opening') && completedTiers.has('midcard') && completedTiers.has('main')) {
    const belt = belts.find(b => b.id === 'intercontinental');
    if (belt && !belt.earnedAt) belt.earnedAt = now;
  }

  // Money in the Bank - Big One past 50%
  if (data.user?.theBigOne && data.user.theBigOne.percentage >= 50) {
    const belt = belts.find(b => b.id === 'mitb');
    if (belt && !belt.earnedAt) belt.earnedAt = now;
  }

  // Grand Slam - Hold 4+ belts
  if (belts.filter(b => b.earnedAt !== null).length >= 4) {
    const belt = belts.find(b => b.id === 'grandslam');
    if (belt && !belt.earnedAt) belt.earnedAt = now;
  }

  return belts;
};
