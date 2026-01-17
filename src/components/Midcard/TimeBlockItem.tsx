import React from 'react';
import type { TimeBlock } from '../../types';

interface TimeBlockItemProps {
  block: TimeBlock;
  onToggleComplete: () => void;
  isMatchCard?: boolean;
}

export const TimeBlockItem: React.FC<TimeBlockItemProps> = ({
  block,
  onToggleComplete,
  isMatchCard = false
}) => {
  const progress = block.allocatedHours > 0
    ? Math.min(100, (block.loggedHours / block.allocatedHours) * 100)
    : 0;

  const isComplete = block.isCompleted;
  const isInProgress = block.timerStartedAt !== null;

  return (
    <div className={`flex items-center justify-between p-3 border ${
      isComplete
        ? 'border-kayfabe-gold bg-kayfabe-gold/5'
        : 'border-kayfabe-gray-dark'
    }`}>
      <div className="flex items-center space-x-3 flex-1">
        {isMatchCard && (
          <button
            onClick={onToggleComplete}
            className={`text-xl ${isComplete ? 'text-kayfabe-gold' : 'text-kayfabe-gray-medium'}`}
          >
            {isComplete ? '✓' : '○'}
          </button>
        )}
        <div className="flex-1">
          <p className={`font-medium ${isComplete ? 'text-kayfabe-gold' : 'text-kayfabe-cream'}`}>
            {block.name}
          </p>
          {!isMatchCard && (
            <div className="mt-1 h-2 bg-kayfabe-gray-dark rounded-full overflow-hidden">
              <div
                className="h-full bg-kayfabe-gold transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <span className={`text-sm ${isComplete ? 'text-kayfabe-gold' : 'text-kayfabe-gray-light'}`}>
          {block.loggedHours.toFixed(2)}h / {block.allocatedHours}h
        </span>
        {isInProgress && (
          <span className="text-xs text-kayfabe-gold">⏱ Running</span>
        )}
      </div>
    </div>
  );
};
