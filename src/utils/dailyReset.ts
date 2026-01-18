import type { AppData, PendingPromoBlock } from '../types';

export const checkAndResetDaily = (appData: AppData): AppData => {
  const today = new Date().toISOString().split('T')[0];
  const needsOpeningContestReset = appData.openingContest.lastResetDate !== today;
  const needsMidcardReset = appData.midcardConfig.lastResetDate !== today;

  if (!needsOpeningContestReset && !needsMidcardReset) {
    return appData;
  }

  // Before resetting midcard, collect pending promos from completed blocks without promos
  let pendingPromoBlocks: PendingPromoBlock[] = [...appData.pendingPromoBlocks];

  if (needsMidcardReset) {
    // Find blocks that were completed but don't have promos yet
    const completedWithoutPromo = appData.midcardConfig.timeBlocks.filter(
      block => block.isCompleted && !block.promoCompleted && block.loggedHours > 0
    );

    // Add them to pending promos (if not already there)
    const existingPendingIds = new Set(pendingPromoBlocks.map(p => p.timeBlockId));

    const newPending: PendingPromoBlock[] = completedWithoutPromo
      .filter(block => !existingPendingIds.has(block.id))
      .map(block => ({
        timeBlockId: block.id,
        timeBlockName: block.name,
        linkedGoalId: block.linkedGoalId,
        bookedHours: block.bookedHours || block.allocatedHours,
        actualHours: block.loggedHours,
        date: appData.midcardConfig.lastResetDate, // Yesterday's date
      }));

    pendingPromoBlocks = [...pendingPromoBlocks, ...newPending];
  }

  return {
    ...appData,
    pendingPromoBlocks,
    openingContest: needsOpeningContestReset ? {
      ...appData.openingContest,
      completedToday: [],
      lastResetDate: today,
    } : appData.openingContest,
    midcardConfig: needsMidcardReset ? {
      ...appData.midcardConfig,
      timeBlocks: appData.midcardConfig.timeBlocks.map(block =>
        block.isDaily ? {
          ...block,
          loggedHours: 0,
          isCompleted: false,
          bookedForDate: null,
          bookedHours: 0,
          promoCompleted: false,
        } : block
      ),
      lastResetDate: today,
      cardBookedForDate: null,
      showStarted: false,
    } : appData.midcardConfig,
  };
};
