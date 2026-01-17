import React from 'react';
import type { TimeBlock } from '../../types';
import { TimeBlockItem } from './TimeBlockItem';

interface TimeBlockListProps {
  timeBlocks: TimeBlock[];
  dailyBudget: number;
  onToggleComplete: (blockId: string) => void;
}

export const TimeBlockList: React.FC<TimeBlockListProps> = ({
  timeBlocks,
  dailyBudget,
  onToggleComplete,
}) => {
  const totalAllocated = timeBlocks.reduce((sum, block) => sum + block.allocatedHours, 0);
  const budgetPercentage = dailyBudget > 0 ? Math.round((totalAllocated / dailyBudget) * 100) : 0;

  if (timeBlocks.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-kayfabe-gray-medium text-sm">No time blocks yet.</p>
        <p className="text-kayfabe-gray-medium text-xs mt-2">
          Add time blocks in the Midcard tab.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-display uppercase tracking-wider text-kayfabe-cream">
          ⏰ Midcard - Time Slots
        </h3>
      </div>

      <div className="time-block-table">
        {timeBlocks.map(block => (
          <TimeBlockItem
            key={block.id}
            block={block}
            onToggleComplete={() => onToggleComplete(block.id)}
            isMatchCard={true}
          />
        ))}
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-kayfabe-gray-dark">
        <span className="text-kayfabe-gray-light text-sm">Daily Budget:</span>
        <span className={`text-sm font-bold ${
          budgetPercentage > 100 ? 'text-kayfabe-red' : 'text-kayfabe-cream'
        }`}>
          {totalAllocated}h / {dailyBudget}h ({budgetPercentage}%)
        </span>
      </div>

      <p className="text-kayfabe-gray-medium text-xs text-center">
        Manage in Midcard tab →
      </p>
    </div>
  );
};
