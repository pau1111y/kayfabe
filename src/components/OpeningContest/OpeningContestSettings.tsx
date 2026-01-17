import React, { useState } from 'react';
import type { Habit } from '../../types';

interface OpeningContestSettingsProps {
  habits: Habit[];
  onToggleEnabled: (habitId: string) => void;
  onAddCustom: (name: string) => void;
}

export const OpeningContestSettings: React.FC<OpeningContestSettingsProps> = ({
  habits,
  onToggleEnabled,
  onAddCustom,
}) => {
  const [newHabit, setNewHabit] = useState('');

  const handleAdd = () => {
    if (newHabit.trim()) {
      onAddCustom(newHabit.trim());
      setNewHabit('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="heading-1 mb-2">🎆 Opening Contest Settings</h2>
        <p className="text-kayfabe-gray-light text-sm">Manage your daily habits</p>
      </div>

      <div className="card space-y-3">
        <p className="text-kayfabe-gray-light text-sm mb-3">
          Enable or disable habits for your daily Opening Contest
        </p>

        <div className="space-y-2">
          {habits.map(habit => (
            <button
              key={habit.id}
              onClick={() => !habit.isHardcoded && onToggleEnabled(habit.id)}
              disabled={habit.isHardcoded}
              className={`w-full p-4 border text-left flex items-center justify-between transition-colors ${
                habit.enabled
                  ? 'border-kayfabe-gold text-kayfabe-cream bg-kayfabe-gold/5'
                  : 'border-kayfabe-gray-dark text-kayfabe-gray-medium'
              } ${habit.isHardcoded ? 'cursor-not-allowed opacity-75' : 'hover:border-kayfabe-gray-medium'}`}
            >
              <div className="flex items-center space-x-3">
                <span className={`text-xl ${habit.enabled ? 'text-kayfabe-gold' : 'text-kayfabe-gray-medium'}`}>
                  {habit.enabled ? '✓' : '○'}
                </span>
                <span className="font-medium">{habit.name}</span>
              </div>
              <span className="text-xs text-kayfabe-gray-medium">
                {habit.isHardcoded ? '★ Required' : habit.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="heading-2">Add Custom Habit</h3>
        <p className="text-kayfabe-gray-light text-sm">
          Create your own daily habit to track
        </p>

        <div className="flex space-x-2">
          <input
            type="text"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="New habit name..."
            className="input-field flex-1"
          />
          <button
            onClick={handleAdd}
            disabled={!newHabit.trim()}
            className={`btn-primary ${!newHabit.trim() ? 'opacity-50' : ''}`}
          >
            Add
          </button>
        </div>
      </div>

      <div className="card">
        <p className="text-kayfabe-gray-medium text-sm">
          <span className="text-kayfabe-gold">★</span> Required habits cannot be disabled. They're the foundation of the Opening Contest.
        </p>
      </div>
    </div>
  );
};
