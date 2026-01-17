import type { AppData } from '../types';

export const checkAndResetDaily = (appData: AppData): AppData => {
  const today = new Date().toISOString().split('T')[0];
  const needsOpeningContestReset = appData.openingContest.lastResetDate !== today;
  const needsMidcardReset = appData.midcardConfig.lastResetDate !== today;

  if (!needsOpeningContestReset && !needsMidcardReset) {
    return appData;
  }

  return {
    ...appData,
    openingContest: needsOpeningContestReset ? {
      ...appData.openingContest,
      completedToday: [],
      lastResetDate: today,
    } : appData.openingContest,
    midcardConfig: needsMidcardReset ? {
      ...appData.midcardConfig,
      timeBlocks: appData.midcardConfig.timeBlocks.map(block =>
        block.isDaily ? { ...block, loggedHours: 0, isCompleted: false } : block
      ),
      lastResetDate: today,
    } : appData.midcardConfig,
  };
};
