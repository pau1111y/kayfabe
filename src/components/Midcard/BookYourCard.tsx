import React, { useState } from 'react';
import type { TimeBlock, Goal, PendingPromoBlock } from '../../types';

interface BookYourCardProps {
  timeBlocks: TimeBlock[];
  goals: Goal[];
  dailyBudget: number;
  cardBookedForDate: string | null;
  showStarted: boolean;
  pendingPromoBlocks: PendingPromoBlock[];
  onBookBlock: (blockId: string, hours: number) => void;
  onUnbookBlock: (blockId: string) => void;
  onStartShow: () => void;
  onCatchUpPromos: () => void;
}

export const BookYourCard: React.FC<BookYourCardProps> = ({
  timeBlocks,
  goals,
  dailyBudget,
  cardBookedForDate,
  showStarted,
  pendingPromoBlocks,
  onBookBlock,
  onUnbookBlock,
  onStartShow,
  onCatchUpPromos,
}) => {
  const today = new Date().toISOString().split('T')[0];
  const isCardBookedForToday = cardBookedForDate === today;
  const hasPendingPromos = pendingPromoBlocks.length > 0;

  // Local state for booking hours before confirming
  const [bookingHours, setBookingHours] = useState<Record<string, string>>({});

  // Get blocks booked for today
  const todaysBookedBlocks = timeBlocks.filter(b => b.bookedForDate === today);
  const totalBookedHours = todaysBookedBlocks.reduce((sum, b) => sum + b.bookedHours, 0);
  const budgetRemaining = dailyBudget - totalBookedHours;

  // Available blocks to book (not already booked for today)
  const availableBlocks = timeBlocks.filter(b => b.bookedForDate !== today);

  const getLinkedGoalTitle = (goalId: string | null): string | null => {
    if (!goalId) return null;
    const goal = goals.find(g => g.id === goalId);
    return goal?.title || null;
  };

  // If there are pending promos from yesterday, show catch-up prompt
  if (hasPendingPromos) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="heading-1 mb-2">Last Night's Card</h2>
          <p className="text-kayfabe-gray-light text-sm">
            Before booking today's show, let's close out yesterday
          </p>
        </div>

        <div className="card border-kayfabe-gold border-2">
          <div className="text-center mb-4">
            <span className="text-4xl">🎤</span>
            <h3 className="heading-2 mt-2">Promos Owed</h3>
            <p className="text-kayfabe-gray-light text-sm">
              You worked these segments but haven't told your story yet
            </p>
          </div>

          <div className="space-y-3">
            {pendingPromoBlocks.map(block => (
              <div
                key={block.timeBlockId}
                className="flex items-center justify-between p-3 bg-kayfabe-gray-dark rounded"
              >
                <div>
                  <p className="text-kayfabe-cream font-bold">{block.timeBlockName}</p>
                  <p className="text-kayfabe-gray-light text-xs">
                    {block.bookedHours}h planned → {block.actualHours.toFixed(2)}h worked
                  </p>
                  {block.linkedGoalId && (
                    <p className="text-kayfabe-gold text-xs">
                      → {getLinkedGoalTitle(block.linkedGoalId)}
                    </p>
                  )}
                </div>
                <span className="text-kayfabe-gold">🎤</span>
              </div>
            ))}
          </div>

          <button
            onClick={onCatchUpPromos}
            className="btn-primary w-full mt-4"
          >
            Cut Your Promos
          </button>
        </div>
      </div>
    );
  }

  // If show already started, show the working view
  if (isCardBookedForToday && showStarted) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="heading-1 mb-2">Tonight's Card</h2>
          <p className="text-kayfabe-gold text-sm font-bold">LIVE NOW</p>
        </div>

        <div className="space-y-3">
          {todaysBookedBlocks.map(block => {
            const linkedGoal = getLinkedGoalTitle(block.linkedGoalId);
            const isComplete = block.isCompleted;
            const needsPromo = isComplete && !block.promoCompleted;

            return (
              <div
                key={block.id}
                className={`card ${isComplete ? 'border-kayfabe-gold' : 'border-kayfabe-gray-dark'} ${
                  needsPromo ? 'animate-pulse border-2' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl ${isComplete ? 'text-kayfabe-gold' : 'text-kayfabe-gray-medium'}`}>
                      {isComplete ? '✓' : '○'}
                    </span>
                    <div>
                      <p className={`font-bold ${isComplete ? 'text-kayfabe-gold' : 'text-kayfabe-cream'}`}>
                        {block.name}
                      </p>
                      <p className="text-kayfabe-gray-light text-xs">
                        {block.bookedHours}h booked
                        {linkedGoal && <span className="text-kayfabe-gold ml-2">→ {linkedGoal}</span>}
                      </p>
                    </div>
                  </div>
                  {needsPromo && (
                    <span className="text-kayfabe-gold text-sm font-bold">
                      🎤 Promo Time!
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <p className="text-kayfabe-gray-light text-sm">
            Complete blocks in the Midcard tab, then cut your promos
          </p>
        </div>
      </div>
    );
  }

  // Main booking interface
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="heading-1 mb-2">Book Your Card</h2>
        <p className="text-kayfabe-gray-light text-sm">
          Make your time matter today
        </p>
      </div>

      {/* Budget Overview */}
      <div className="card text-center">
        <div className="flex justify-between items-center mb-2">
          <span className="text-kayfabe-gray-light">Daily Budget</span>
          <span className={`font-bold ${budgetRemaining < 0 ? 'text-kayfabe-red' : 'text-kayfabe-gold'}`}>
            {totalBookedHours}h / {dailyBudget}h booked
          </span>
        </div>
        <div className="h-2 bg-kayfabe-gray-dark rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              budgetRemaining < 0 ? 'bg-kayfabe-red' : 'bg-kayfabe-gold'
            }`}
            style={{ width: `${Math.min(100, (totalBookedHours / dailyBudget) * 100)}%` }}
          />
        </div>
        <p className="text-xs text-kayfabe-gray-medium mt-2">
          {budgetRemaining > 0
            ? `${budgetRemaining}h remaining to book`
            : budgetRemaining < 0
              ? `${Math.abs(budgetRemaining)}h over budget (ambitious!)`
              : 'Fully booked!'
          }
        </p>
      </div>

      {/* Today's Card */}
      {todaysBookedBlocks.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-kayfabe-cream uppercase tracking-wider text-sm font-bold">
            Tonight's Card
          </h3>
          {todaysBookedBlocks.map(block => {
            const linkedGoal = getLinkedGoalTitle(block.linkedGoalId);
            return (
              <div key={block.id} className="card border-kayfabe-gold">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-kayfabe-cream font-bold">{block.name}</p>
                    <p className="text-kayfabe-gray-light text-xs">
                      {block.bookedHours}h booked
                      {linkedGoal && <span className="text-kayfabe-gold ml-2">→ {linkedGoal}</span>}
                    </p>
                  </div>
                  <button
                    onClick={() => onUnbookBlock(block.id)}
                    className="text-kayfabe-red text-sm hover:text-kayfabe-cream"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Available Blocks to Book */}
      {availableBlocks.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-kayfabe-cream uppercase tracking-wider text-sm font-bold">
            Available Segments
          </h3>
          {availableBlocks.map(block => {
            const linkedGoal = getLinkedGoalTitle(block.linkedGoalId);
            return (
              <div key={block.id} className="card">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-kayfabe-cream font-bold">
                      {block.name}
                      {block.linkedGoalId && <span className="text-kayfabe-gold ml-2">⭐</span>}
                    </p>
                    <p className="text-kayfabe-gray-light text-xs">
                      Typical: {block.allocatedHours}h
                      {linkedGoal && <span className="text-kayfabe-gold ml-2">→ {linkedGoal}</span>}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.25"
                    min="0.25"
                    value={bookingHours[block.id] || ''}
                    onChange={(e) => setBookingHours(prev => ({ ...prev, [block.id]: e.target.value }))}
                    placeholder={`Hours (default: ${block.allocatedHours})`}
                    className="input-field flex-1"
                  />
                  <button
                    onClick={() => {
                      const hours = parseFloat(bookingHours[block.id] || String(block.allocatedHours));
                      if (hours > 0) {
                        onBookBlock(block.id, hours);
                        setBookingHours(prev => ({ ...prev, [block.id]: '' }));
                      }
                    }}
                    className="btn-secondary"
                  >
                    + Book
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* No segments available */}
      {timeBlocks.length === 0 && (
        <div className="card text-center py-8">
          <p className="text-kayfabe-gray-medium text-sm">No segments created yet.</p>
          <p className="text-kayfabe-gray-medium text-xs mt-2">
            Create segments in the Segments tab, then book them here.
          </p>
        </div>
      )}

      {/* Start the Show Button */}
      {todaysBookedBlocks.length > 0 && (
        <button
          onClick={onStartShow}
          className="btn-primary w-full text-lg py-4"
        >
          Start the Show
        </button>
      )}

      {todaysBookedBlocks.length === 0 && timeBlocks.length > 0 && (
        <p className="text-kayfabe-gray-medium text-sm text-center">
          Book at least one segment to start today's show
        </p>
      )}
    </div>
  );
};
