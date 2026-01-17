import React, { useState } from 'react';
import type { Habit } from '../../types';

interface HabitSettingsProps {
  habits: Habit[];
  onToggleEnabled: (habitId: string) => void;
  onAddCustom: (name: string) => void;
  onClose: () => void;
}

export const HabitSettings: React.FC<HabitSettingsProps> = ({
  habits,
  onToggleEnabled,
  onAddCustom,
  onClose,
}) => {
  const [newHabit, setNewHabit] = useState('');

  const handleAdd = () => {
    if (newHabit.trim()) {
      onAddCustom(newHabit.trim());
      setNewHabit('');
    }
  };

  return (
    <div className="card space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="heading-2">Manage Habits</h3>
        <button onClick={onClose} className="text-kayfabe-gray-light hover:text-kayfabe-cream">
          ✕
        </button>
      </div>

      <div className="space-y-2">
        {habits.map(habit => (
          <button
            key={habit.id}
            onClick={() => !habit.isHardcoded && onToggleEnabled(habit.id)}
            disabled={habit.isHardcoded}
            className={`w-full p-3 border text-left flex items-center justify-between ${
              habit.enabled
                ? 'border-kayfabe-gold text-kayfabe-cream'
                : 'border-kayfabe-gray-dark text-kayfabe-gray-medium'
            } ${habit.isHardcoded ? 'cursor-not-allowed' : ''}`}
          >
            <span>{habit.name}</span>
            <span className="text-xs">
              {habit.isHardcoded ? '★ Required' : habit.enabled ? 'On' : 'Off'}
            </span>
          </button>
        ))}
      </div>

      <div className="pt-4 border-t border-kayfabe-gray-dark">
        <p className="text-kayfabe-gray-light text-sm mb-2">Add custom habit:</p>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="New habit..."
            className="input-field flex-1"
          />
          <button onClick={handleAdd} className="btn-primary">Add</button>
        </div>
      </div>
    </div>
  );
};
