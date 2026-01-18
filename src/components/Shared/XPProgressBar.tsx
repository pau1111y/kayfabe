import React, { useEffect, useState } from 'react';
import { getCurrentTitle, getNextTitle, getXPToNextTitle, getStreakMultiplier } from '../../utils/xp';

interface XPProgressBarProps {
  xp: number;
  currentStreak: number;
  animate?: boolean;
}

export const XPProgressBar: React.FC<XPProgressBarProps> = ({ xp, currentStreak, animate = false }) => {
  const [displayXP, setDisplayXP] = useState(xp);
  const currentTitle = getCurrentTitle(displayXP);
  const nextTitle = getNextTitle(displayXP);
  const xpToNext = getXPToNextTitle(displayXP);
  const multiplier = getStreakMultiplier(currentStreak);

  // Animate XP changes
  useEffect(() => {
    if (animate && xp !== displayXP) {
      const diff = xp - displayXP;
      const steps = 20;
      const increment = diff / steps;
      let current = displayXP;

      const interval = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= xp) || (increment < 0 && current <= xp)) {
          setDisplayXP(xp);
          clearInterval(interval);
        } else {
          setDisplayXP(Math.floor(current));
        }
      }, 50);

      return () => clearInterval(interval);
    } else {
      setDisplayXP(xp);
    }
  }, [xp, animate, displayXP]);

  const progressPercentage = nextTitle
    ? Math.min(100, ((displayXP - currentTitle.xpRequired) / (nextTitle.xpRequired - currentTitle.xpRequired)) * 100)
    : 100;

  return (
    <div className="bg-kayfabe-gray-dark/50 backdrop-blur-sm border-b border-kayfabe-gray-dark px-4 py-3">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-3">
            <span className="text-kayfabe-gold text-sm font-bold uppercase tracking-wide">
              {currentTitle.name}
            </span>
            {currentStreak > 0 && (
              <span className="text-kayfabe-gold text-xs">
                🔥 {currentStreak} ({multiplier}x)
              </span>
            )}
          </div>
          <div className="text-right">
            <span className="text-kayfabe-cream text-sm font-bold">
              {displayXP.toLocaleString()} XP
            </span>
            {nextTitle && (
              <p className="text-kayfabe-gray-light text-xs">
                {xpToNext.toLocaleString()} to {nextTitle.name}
              </p>
            )}
          </div>
        </div>

        {nextTitle && (
          <div className="h-2 bg-kayfabe-black rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-kayfabe-gold to-kayfabe-cream transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
