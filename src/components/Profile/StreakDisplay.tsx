import React from 'react';
import { getStreakMultiplier, getStreakMessage } from '../../utils/xp';

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({ currentStreak, longestStreak }) => {
  const multiplier = getStreakMultiplier(currentStreak);
  const message = getStreakMessage(currentStreak);

  return (
    <div className="card">
      <div className="text-center mb-4">
        <p className="text-5xl mb-2">🔥</p>
        <p className="text-4xl font-bold text-kayfabe-cream">{currentStreak}</p>
        <p className="text-kayfabe-gray-medium uppercase text-sm">Day Streak</p>
      </div>

      {message && (
        <p className="text-kayfabe-gold text-center italic mb-4">"{message}"</p>
      )}

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-kayfabe-gray-dark text-center">
        <div>
          <p className="text-kayfabe-gold text-xl font-bold">{multiplier}x</p>
          <p className="text-kayfabe-gray-medium text-xs uppercase">Multiplier</p>
        </div>
        <div>
          <p className="text-kayfabe-cream text-xl font-bold">{longestStreak}</p>
          <p className="text-kayfabe-gray-medium text-xs uppercase">Best Streak</p>
        </div>
      </div>
    </div>
  );
};
