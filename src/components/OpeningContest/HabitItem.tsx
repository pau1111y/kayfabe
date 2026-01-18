import React, { useState } from 'react';
import type { Habit } from '../../types';
import { getRandomCelebration } from '../../utils/xp';

interface HabitItemProps {
  habit: Habit;
  isCompleted: boolean;
  onToggle: () => void;
}

export const HabitItem: React.FC<HabitItemProps> = ({
  habit,
  isCompleted,
  onToggle,
}) => {
  const [celebration, setCelebration] = useState<string | null>(null);

  const handleToggle = () => {
    if (!isCompleted) {
      setCelebration(getRandomCelebration());
      setTimeout(() => setCelebration(null), 2000);
    }
    onToggle();
  };

  if (!habit.enabled) return null;

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className={`w-full p-4 border text-left transition-all flex items-center space-x-3 ${
          isCompleted
            ? 'border-kayfabe-gold bg-kayfabe-gold/10'
            : 'border-kayfabe-gray-dark hover:border-kayfabe-gray-medium'
        }`}
      >
        <span className={`text-xl ${isCompleted ? 'opacity-100' : 'opacity-30'}`}>
          {isCompleted ? '✓' : '○'}
        </span>
        <span className={isCompleted ? 'text-kayfabe-gold line-through' : 'text-kayfabe-cream'}>
          {habit.name}
        </span>
        {habit.isHardcoded && (
          <span className="text-xs text-kayfabe-gray-medium ml-auto">★</span>
        )}
      </button>

      {celebration && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
          <div className="text-kayfabe-gold text-sm font-bold animate-bounce bg-kayfabe-black/80 px-2 py-1 rounded whitespace-nowrap">
            {celebration}
          </div>
        </div>
      )}
    </div>
  );
};
