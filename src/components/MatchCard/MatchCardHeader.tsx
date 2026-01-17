import React from 'react';
import { getStreakMultiplier } from '../../utils/xp';

interface MatchCardHeaderProps {
  currentStreak: number;
}

export const MatchCardHeader: React.FC<MatchCardHeaderProps> = ({ currentStreak }) => {
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const multiplier = getStreakMultiplier(currentStreak);

  return (
    <div className="match-card-header">
      <div className="flex justify-between items-center">
        <p className="text-kayfabe-gray-light text-sm">
          📅 {dateString}
        </p>
        {currentStreak > 0 && (
          <p className="text-kayfabe-gold text-sm font-bold">
            🔥 {currentStreak} day{currentStreak !== 1 ? 's' : ''} ({multiplier}x XP)
          </p>
        )}
      </div>
    </div>
  );
};
