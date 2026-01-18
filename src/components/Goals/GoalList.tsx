import React from 'react';
import type { Goal, Promo, GoalTier } from '../../types';
import { GoalCard } from './GoalCard';

interface GoalListProps {
  goals: Goal[];
  promos: Promo[];
  onCompleteGoal: (goalId: string) => void;
}

const tierOrder: GoalTier[] = ['main', 'midcard'];

export const GoalList: React.FC<GoalListProps> = ({ goals, promos, onCompleteGoal }) => {
  const activeGoals = goals.filter(g => g.status === 'active');

  if (activeGoals.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-kayfabe-gray-medium">No active storylines.</p>
        <p className="text-kayfabe-gray-medium text-sm mt-2">
          Add a storyline to start tracking your goals.
        </p>
      </div>
    );
  }

  const groupedGoals = tierOrder.reduce((acc, tier) => {
    const tierGoals = activeGoals.filter(g => g.tier === tier);
    if (tierGoals.length > 0) {
      acc[tier] = tierGoals;
    }
    return acc;
  }, {} as Record<GoalTier, Goal[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedGoals).map(([tier, tierGoals]) => (
        <div key={tier} className="space-y-3">
          {tierGoals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              promos={promos}
              onComplete={() => onCompleteGoal(goal.id)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
