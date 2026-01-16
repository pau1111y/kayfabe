export const XP_VALUES = {
  quickTag: 5,
  promoPrompted: 15,
  promoFreestyle: 20,
  faceFollowUp: 10,
  storylineTag: 5,
  habitComplete: 5,
  cleanSweep: 15,
  runIn: 10,
  bigOnePercentage: 25,
  goalComplete: 50,
};

export const STREAK_MULTIPLIERS: { days: number; multiplier: number }[] = [
  { days: 100, multiplier: 3.0 },
  { days: 60, multiplier: 2.5 },
  { days: 30, multiplier: 2.0 },
  { days: 14, multiplier: 1.75 },
  { days: 7, multiplier: 1.5 },
  { days: 3, multiplier: 1.25 },
];

export const TITLES: { name: string; xpRequired: number; unlock: string }[] = [
  { name: 'Rookie', xpRequired: 0, unlock: 'Starting point' },
  { name: 'Jobber', xpRequired: 250, unlock: 'Everyone starts somewhere' },
  { name: 'Enhancement Talent', xpRequired: 750, unlock: 'New prompt pack' },
  { name: 'Midcarder', xpRequired: 2000, unlock: 'Custom card background' },
  { name: 'Upper Midcard', xpRequired: 5000, unlock: 'New prompt pack' },
  { name: 'Main Eventer', xpRequired: 10000, unlock: 'Profile badge' },
  { name: 'World Champion', xpRequired: 25000, unlock: 'Full visual upgrade' },
  { name: 'Hall of Famer', xpRequired: 50000, unlock: 'Legacy status' },
];

export const STREAK_MESSAGES: { days: number; message: string }[] = [
  { days: 365, message: "One year. You stayed in kayfabe for an entire year. Unbreakable." },
  { days: 100, message: "One hundred days. The Ironman Championship is yours." },
  { days: 90, message: "Ninety days. Legends are built on runs like this." },
  { days: 60, message: "Sixty days. You're not just doing this. You're living it." },
  { days: 30, message: "Thirty days. You've got a reign going." },
  { days: 21, message: "Twenty-one days. They say that's when habits stick." },
  { days: 14, message: "Two weeks strong. This is becoming who you are." },
  { days: 7, message: "One week. The crowd's starting to notice." },
  { days: 3, message: "Three days in. You're building something." },
];

export const HABIT_CELEBRATION_LINES = [
  "Clean pin.",
  "That's a win.",
  "One more for the good guys.",
  "The crowd sees you.",
  "Momentum building.",
  "Stay on your game.",
  "Champions do the work.",
  "Another one in the books.",
  "The streak continues.",
  "You showed up. That counts.",
];
