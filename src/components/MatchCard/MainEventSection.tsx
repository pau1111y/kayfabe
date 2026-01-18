import React from 'react';
import type { Goal, Promo, TimeBlock } from '../../types';

interface MainEventSectionProps {
  goals: Goal[];
  promos: Promo[];
  timeBlocks?: TimeBlock[];
  onViewGoal: (goalId: string) => void;
}

export const MainEventSection: React.FC<MainEventSectionProps> = ({
  goals,
  promos,
  timeBlocks = [],
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
          <p className="text-kayfabe-gray-medium text-sm">No main events yet.</p>
          <p className="text-kayfabe-gray-medium text-xs mt-2">
            When you're ready to prove yourself on the big stage, add your championship goal.
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

        // Get linked midcard blocks
        const linkedBlocks = timeBlocks.filter(b => b.linkedGoalId === goal.id);
        const totalHours = linkedBlocks.reduce((sum, b) => sum + b.loggedHours, 0);

        // Qualitative readiness message based on proving ground energy
        const getReadinessMessage = (hours: number) => {
          if (hours === 0) return null;
          if (hours < 10) return "Starting to build...";
          if (hours < 30) return "Cutting your teeth...";
          if (hours < 50) return "Getting over...";
          return "Championship form!";
        };

        const readinessMessage = getReadinessMessage(totalHours);

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
              <div className="flex space-x-4 text-sm mb-2">
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

            {/* Midcard skill-building progress */}
            {linkedBlocks.length > 0 && (
              <div className="mt-3 pt-3 border-t border-kayfabe-gray-dark">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-kayfabe-gray-medium">
                    {linkedBlocks.length} skill{linkedBlocks.length !== 1 ? 's' : ''} in development
                  </span>
                  <span className="text-kayfabe-gold font-bold">
                    {Math.round(totalHours)} hours logged
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">
                  {linkedBlocks.map(block => (
                    <span
                      key={block.id}
                      className="inline-flex items-center px-2 py-1 bg-kayfabe-gray-dark text-kayfabe-cream text-xs rounded"
                    >
                      <span className="mr-1">⭐</span>
                      {block.name}
                    </span>
                  ))}
                </div>
                {readinessMessage && (
                  <p className="text-kayfabe-gold text-xs italic">
                    {readinessMessage}
                  </p>
                )}
              </div>
            )}

            {linkedBlocks.length === 0 && linkedPromos.length > 0 && (
              <div className="mt-3 pt-3 border-t border-kayfabe-gray-dark">
                <p className="text-kayfabe-gray-medium text-xs italic">
                  What skills are you building in the midcard to earn this?
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
