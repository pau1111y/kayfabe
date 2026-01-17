import type { Avatar } from '../types';

export const AVATAR_CATALOG: Avatar[] = [
  // Starter tier (XP 0 - everyone gets these 4)
  {
    id: 'avatar-rookie-mask',
    name: 'Masked Rookie',
    svgPath: '/avatars/rookie-mask.svg',
    unlockedAtXP: 0,
    description: 'Classic wrestling mask',
  },
  {
    id: 'avatar-rookie-glove',
    name: 'Boxing Glove',
    svgPath: '/avatars/rookie-glove.svg',
    unlockedAtXP: 0,
    description: 'Ready to fight',
  },
  {
    id: 'avatar-rookie-belt',
    name: 'Championship Hopeful',
    svgPath: '/avatars/rookie-belt.svg',
    unlockedAtXP: 0,
    description: 'Eyes on the prize',
  },
  {
    id: 'avatar-rookie-default',
    name: 'Classic Wrestler',
    svgPath: '/avatars/rookie-default.svg',
    unlockedAtXP: 0,
    description: 'Traditional grappler',
  },

  // Jobber tier (250 XP)
  {
    id: 'avatar-jobber-star',
    name: 'Rising Star',
    svgPath: '/avatars/jobber-star.svg',
    unlockedAtXP: 250,
    unlockedAtTitle: 'Jobber',
    description: 'Your star is rising',
  },
  {
    id: 'avatar-jobber-fire',
    name: 'On Fire',
    svgPath: '/avatars/jobber-fire.svg',
    unlockedAtXP: 250,
    unlockedAtTitle: 'Jobber',
    description: 'Heating up',
  },

  // Enhancement Talent (750 XP)
  {
    id: 'avatar-enhancement-muscle',
    name: 'Muscle Up',
    svgPath: '/avatars/enhancement-muscle.svg',
    unlockedAtXP: 750,
    unlockedAtTitle: 'Enhancement Talent',
    description: 'Getting stronger',
  },
  {
    id: 'avatar-enhancement-lightning',
    name: 'Lightning Strike',
    svgPath: '/avatars/enhancement-lightning.svg',
    unlockedAtXP: 750,
    unlockedAtTitle: 'Enhancement Talent',
    description: 'Electric presence',
  },

  // Midcarder (2000 XP)
  {
    id: 'avatar-midcard-crown',
    name: 'Crowned',
    svgPath: '/avatars/midcard-crown.svg',
    unlockedAtXP: 2000,
    unlockedAtTitle: 'Midcarder',
    description: 'Royalty in the ring',
  },
  {
    id: 'avatar-midcard-rocket',
    name: 'Rocket Ship',
    svgPath: '/avatars/midcard-rocket.svg',
    unlockedAtXP: 2000,
    unlockedAtTitle: 'Midcarder',
    description: 'Rapid ascent',
  },

  // Upper Midcard (5000 XP)
  {
    id: 'avatar-upper-gem',
    name: 'Diamond',
    svgPath: '/avatars/upper-gem.svg',
    unlockedAtXP: 5000,
    unlockedAtTitle: 'Upper Midcard',
    description: 'Rare and valuable',
  },
  {
    id: 'avatar-upper-skull',
    name: 'Skull Crusher',
    svgPath: '/avatars/upper-skull.svg',
    unlockedAtXP: 5000,
    unlockedAtTitle: 'Upper Midcard',
    description: 'Intimidating presence',
  },

  // Main Eventer (10,000 XP)
  {
    id: 'avatar-main-champion',
    name: 'Championship Material',
    svgPath: '/avatars/main-champion.svg',
    unlockedAtXP: 10000,
    unlockedAtTitle: 'Main Eventer',
    description: 'Ready for the belt',
  },
  {
    id: 'avatar-main-explosion',
    name: 'Explosive',
    svgPath: '/avatars/main-explosion.svg',
    unlockedAtXP: 10000,
    unlockedAtTitle: 'Main Eventer',
    description: 'Main event energy',
  },

  // World Champion (25,000 XP)
  {
    id: 'avatar-world-champion',
    name: 'World Champion',
    svgPath: '/avatars/world-champion.svg',
    unlockedAtXP: 25000,
    unlockedAtTitle: 'World Champion',
    description: 'The pinnacle',
  },
  {
    id: 'avatar-world-legend',
    name: 'Legend Status',
    svgPath: '/avatars/world-legend.svg',
    unlockedAtXP: 25000,
    unlockedAtTitle: 'World Champion',
    description: 'Living legend',
  },

  // Hall of Famer (50,000 XP)
  {
    id: 'avatar-hof-legend',
    name: 'Hall of Fame',
    svgPath: '/avatars/hof-legend.svg',
    unlockedAtXP: 50000,
    unlockedAtTitle: 'Hall of Famer',
    description: 'Immortal status',
  },
  {
    id: 'avatar-hof-goat',
    name: 'The GOAT',
    svgPath: '/avatars/hof-goat.svg',
    unlockedAtXP: 50000,
    unlockedAtTitle: 'Hall of Famer',
    description: 'Greatest of all time',
  },
];
