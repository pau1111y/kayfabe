import React from 'react';
import type { Goal } from '../../types';

interface StorylineSelectorProps {
  goals: Goal[];
  selectedId: string | null;
  onSelect: (goalId: string | null) => void;
}

export const StorylineSelector: React.FC<StorylineSelectorProps> = ({
  goals,
  selectedId,
  onSelect,
}) => {
  const activeGoals = goals.filter(g => g.status === 'active');

  return (
    <div className="space-y-3">
      <p className="text-kayfabe-gray-light text-sm">
        Which storyline did this touch?
      </p>

      <div className="space-y-2">
        {activeGoals.map(goal => (
          <button
            key={goal.id}
            onClick={() => onSelect(goal.id)}
            className={`w-full p-3 border text-left transition-colors ${
              selectedId === goal.id
                ? 'border-kayfabe-gold text-kayfabe-cream'
                : 'border-kayfabe-gray-dark text-kayfabe-gray-light hover:border-kayfabe-gray-medium'
            }`}
          >
            <p className="text-sm">{goal.title}</p>
            <p className="text-xs text-kayfabe-gray-medium capitalize">{goal.tier}</p>
          </button>
        ))}

        <button
          onClick={() => onSelect(null)}
          className={`w-full p-3 border text-left transition-colors ${
            selectedId === null
              ? 'border-kayfabe-gold text-kayfabe-cream'
              : 'border-kayfabe-gray-dark text-kayfabe-gray-light hover:border-kayfabe-gray-medium'
          }`}
        >
          <p className="text-sm">None / Just venting</p>
        </button>
      </div>
    </div>
  );
};
