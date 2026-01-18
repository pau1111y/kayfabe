import React from 'react';
import type { Habit } from '../../types';
import { HabitItem } from './HabitItem';

interface HabitListProps {
  habits: Habit[];
  completedToday: string[];
  onToggleHabit: (habitId: string) => void;
}

export const HabitList: React.FC<HabitListProps> = ({
  habits,
  completedToday,
  onToggleHabit,
}) => {
  const enabledHabits = habits.filter(h => h.enabled);
  const completedCount = completedToday.length;
  const totalEnabled = enabledHabits.length;
  const isCleanSweep = completedCount === totalEnabled && totalEnabled > 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="heading-2">Opening Contest</h3>
        <span className={`text-sm ${isCleanSweep ? 'text-kayfabe-gold' : 'text-kayfabe-gray-light'}`}>
          {completedCount}/{totalEnabled}
          {isCleanSweep && ' 🎉'}
        </span>
      </div>

      {isCleanSweep && (
        <div className="card border-kayfabe-gold bg-kayfabe-gold/10 text-center animate-pulse">
          <p className="text-kayfabe-gold font-bold text-lg">🧹 THE CLEANER BONUS! 🧹</p>
          <p className="text-kayfabe-cream text-sm mt-1">+15 XP Bonus</p>
          <p className="text-kayfabe-gray-light text-xs italic mt-2">
            You swept all the habits. Champions do the work.
          </p>
        </div>
      )}

      <div className="space-y-2">
        {enabledHabits.map(habit => (
          <HabitItem
            key={habit.id}
            habit={habit}
            isCompleted={completedToday.includes(habit.id)}
            onToggle={() => onToggleHabit(habit.id)}
          />
        ))}
      </div>
    </div>
  );
};
