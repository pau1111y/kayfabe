import React from 'react';
import type { Goal, Promo } from '../../types';

interface GoalCardProps {
  goal: Goal;
  promos: Promo[];
  onComplete: () => void;
}

const tierLabels: Record<string, string> = {
  opening: 'Opening Contest',
  midcard: 'Midcard',
  main: 'Main Event',
  runin: 'Run-In',
};

export const GoalCard: React.FC<GoalCardProps> = ({ goal, promos, onComplete }) => {
  const linkedPromos = promos.filter(p => p.storylineId === goal.id);
  const popCount = linkedPromos.filter(p => p.impact === 'pop').length;
  const heatCount = linkedPromos.filter(p => p.impact === 'heat').length;

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs uppercase tracking-wider text-kayfabe-gray-medium">
          {tierLabels[goal.tier]}
        </span>
        <button
          onClick={onComplete}
          className="text-xs text-kayfabe-gold hover:text-kayfabe-cream transition-colors"
        >
          Complete
        </button>
      </div>

      <h4 className="text-kayfabe-cream text-lg mb-3">{goal.title}</h4>

      <div className="flex space-x-4 text-sm">
        <span className="text-kayfabe-gray-light">
          {linkedPromos.length} promo{linkedPromos.length !== 1 ? 's' : ''}
        </span>
        {linkedPromos.length > 0 && (
          <>
            <span className="text-kayfabe-gold">↑{popCount} pop</span>
            <span className="text-kayfabe-red">↓{heatCount} heat</span>
          </>
        )}
      </div>
    </div>
  );
};
