import React from 'react';
import type { Goal, Promo } from '../../types';

interface MainEventSectionProps {
  goals: Goal[];
  promos: Promo[];
  onViewGoal: (goalId: string) => void;
}

export const MainEventSection: React.FC<MainEventSectionProps> = ({
  goals,
  promos,
  onViewGoal,
}) => {
  const mainEventGoals = goals.filter(g => g.tier === 'main' && g.status === 'active');

  if (mainEventGoals.length === 0) {
    return (
      <div className="space-y-2">
        <h3 className="text-kayfabe-cream uppercase tracking-wider text-sm font-bold">
          ⭐ Main Event
        </h3>
        <div className="card text-center py-6">
          <p className="text-kayfabe-gray-medium text-sm">No Main Event goals yet.</p>
          <p className="text-kayfabe-gray-medium text-xs mt-2">
            Add a main event goal to build your legacy.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-kayfabe-cream uppercase tracking-wider text-sm font-bold">
        ⭐ Main Event
      </h3>

      {mainEventGoals.map(goal => {
        const linkedPromos = promos.filter(p => p.storylineId === goal.id);
        const popCount = linkedPromos.filter(p => p.impact === 'pop').length;
        const heatCount = linkedPromos.filter(p => p.impact === 'heat').length;

        return (
          <div
            key={goal.id}
            onClick={() => onViewGoal(goal.id)}
            className="main-event-card cursor-pointer hover:border-kayfabe-gold transition-all"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-kayfabe-cream text-lg font-bold flex items-center">
                <span className="text-kayfabe-gold mr-2">⭐</span>
                {goal.title}
              </h4>
              <span className="text-kayfabe-gray-light text-xs">
                Click to view →
              </span>
            </div>

            {linkedPromos.length > 0 && (
              <div className="flex space-x-4 text-sm">
                <span className="text-kayfabe-gray-light">
                  {linkedPromos.length} promo{linkedPromos.length !== 1 ? 's' : ''}
                </span>
                <span className="text-kayfabe-gold">
                  ↑{popCount} pop
                </span>
                <span className="text-kayfabe-red">
                  ↓{heatCount} heat
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
