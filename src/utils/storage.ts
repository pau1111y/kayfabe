import { AppData, UserProfile, Promo, Goal, Belt } from '../types';

const STORAGE_KEY = 'kayfabe_data';

const DEFAULT_BELTS: Belt[] = [
  { id: 'ironman', name: 'Ironman Championship', requirement: '30-day streak', earnedAt: null },
  { id: 'hardcore', name: 'Hardcore Championship', requirement: '10 heel promos with face follow-ups', earnedAt: null },
  { id: 'tagteam', name: 'Tag Team Championship', requirement: 'Invite a friend who logs 7 days', earnedAt: null },
  { id: '247', name: '24/7 Championship', requirement: 'Log at 5+ different hours in one day', earnedAt: null },
  { id: 'intercontinental', name: 'Intercontinental Championship', requirement: 'Complete goals in all tiers', earnedAt: null },
  { id: 'royalrumble', name: 'Royal Rumble Winner', requirement: '30 Opening Contest habits in 30 days', earnedAt: null },
  { id: 'mitb', name: 'Money in the Bank', requirement: 'Move The Big One past 50%', earnedAt: null },
  { id: 'grandslam', name: 'Grand Slam Champion', requirement: 'Hold 4+ belts simultaneously', earnedAt: null },
];

const DEFAULT_HABITS = [
  { id: 'prayers', name: 'Say your prayers', isHardcoded: true, enabled: true },
  { id: 'vitamins', name: 'Eat your vitamins', isHardcoded: true, enabled: true },
  { id: 'bed', name: 'Made the bed', isHardcoded: false, enabled: true },
  { id: 'hydration', name: 'Morning hydration', isHardcoded: false, enabled: true },
  { id: 'movement', name: 'Moved your body', isHardcoded: false, enabled: true },
  { id: 'card', name: 'Reviewed the card', isHardcoded: false, enabled: true },
  { id: 'journal', name: 'Morning pages', isHardcoded: false, enabled: true },
  { id: 'coldshower', name: 'Cold shower', isHardcoded: false, enabled: false },
  { id: 'nophone', name: 'No phone first hour', isHardcoded: false, enabled: false },
  { id: 'read', name: 'Read for 15 minutes', isHardcoded: false, enabled: false },
  { id: 'breakfast', name: 'Breakfast before screen', isHardcoded: false, enabled: false },
  { id: 'sunlight', name: 'Morning sunlight', isHardcoded: false, enabled: false },
  { id: 'meds', name: 'Medication taken', isHardcoded: false, enabled: false },
  { id: 'walk', name: 'Walk outside', isHardcoded: false, enabled: false },
];

export const getDefaultAppData = (): AppData => ({
  user: null,
  promos: [],
  goals: [],
  quickTags: [],
  runIns: [],
  openingContest: {
    habits: DEFAULT_HABITS,
    completedToday: [],
    lastResetDate: new Date().toISOString().split('T')[0],
  },
  belts: DEFAULT_BELTS,
});

export const loadAppData = (): AppData => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading app data:', error);
  }
  return getDefaultAppData();
};

export const saveAppData = (data: AppData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving app data:', error);
  }
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};
