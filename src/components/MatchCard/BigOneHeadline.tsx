import React, { useState } from 'react';

interface BigOneHeadlineProps {
  bigOne: {
    description: string;
    percentage: number;
    createdAt: number;
  } | null;
  onRequestPromoForChange: (previousPercentage: number, newPercentage: number) => void;
}

export const BigOneHeadline: React.FC<BigOneHeadlineProps> = ({
  bigOne,
  onRequestPromoForChange,
}) => {
  const [tempPercentage, setTempPercentage] = useState<number | null>(null);
  const [pendingPercentage, setPendingPercentage] = useState<number | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  if (!bigOne) {
    return (
      <div className="card text-center py-8">
        <p className="text-kayfabe-gray-medium">No Big One set yet.</p>
        <p className="text-kayfabe-gray-medium text-sm mt-2">
          Define your ultimate goal to get started.
        </p>
      </div>
    );
  }

  // Modified handleSliderChange - just update visual, don't trigger promo
  const handleSliderChange = (value: number) => {
    setTempPercentage(value);
  };

  // New handler for slider release (onPointerUp or onMouseUp)
  const handleSliderRelease = () => {
    const finalValue = tempPercentage !== null ? tempPercentage : bigOne.percentage;
    if (finalValue !== bigOne.percentage) {
      setPendingPercentage(finalValue);
      setShowConfirmation(true);
    }
  };

  // Handler for confirming change
  const handleConfirmChange = () => {
    if (pendingPercentage !== null) {
      onRequestPromoForChange(bigOne.percentage, pendingPercentage);
      setShowConfirmation(false);
      setPendingPercentage(null);
      setTempPercentage(null);
    }
  };

  // Handler for canceling
  const handleCancelChange = () => {
    setTempPercentage(bigOne.percentage); // Reset to original
    setShowConfirmation(false);
    setPendingPercentage(null);
  };

  const currentPercentage = tempPercentage !== null ? tempPercentage : bigOne.percentage;

  // Calculate milestone markers
  const milestones = [25, 50, 75, 100];
  const reachedMilestones = milestones.filter(m => currentPercentage >= m).length;

  return (
    <div className="space-y-4">
      {/* The Big One Banner - Larger, More Dominant */}
      <div className="big-one-banner relative overflow-hidden">
        {/* Championship Plates Background Effect */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-4 h-full">
            {milestones.map((milestone) => (
              <div
                key={milestone}
                className={`border-r border-kayfabe-cream/20 ${
                  currentPercentage >= milestone ? 'bg-kayfabe-cream/10' : ''
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <p className="text-kayfabe-cream text-2xl md:text-3xl text-center font-bold mb-6 leading-tight">
            "{bigOne.description}"
          </p>

          {/* Progress Bar with Milestones */}
          <div className="space-y-3">
            <div className="relative h-6 bg-kayfabe-black/40 rounded-full overflow-hidden border border-kayfabe-cream/20">
              {/* Progress Fill */}
              <div
                className="h-full bg-gradient-to-r from-kayfabe-cream via-kayfabe-gold to-kayfabe-cream transition-all duration-500"
                style={{ width: `${currentPercentage}%` }}
              />

              {/* Milestone Markers */}
              {milestones.slice(0, 3).map((milestone) => (
                <div
                  key={milestone}
                  className="absolute top-0 h-full w-px bg-kayfabe-black/60"
                  style={{ left: `${milestone}%` }}
                />
              ))}
            </div>

            {/* Milestone Labels */}
            <div className="flex justify-between text-xs text-kayfabe-cream/60">
              {milestones.map((milestone) => (
                <span
                  key={milestone}
                  className={currentPercentage >= milestone ? 'text-kayfabe-gold font-bold' : ''}
                >
                  {milestone === 100 ? '🏆' : `${milestone}%`}
                </span>
              ))}
            </div>

            {/* Current Progress Display */}
            <div className="text-center">
              <span className="text-kayfabe-cream font-bold text-3xl">
                {currentPercentage}%
              </span>
              <p className="text-kayfabe-cream/60 text-sm mt-1">
                {reachedMilestones}/4 milestones reached
              </p>
            </div>

            {/* Slider */}
            <input
              type="range"
              min="0"
              max="100"
              value={currentPercentage}
              onChange={(e) => handleSliderChange(Number(e.target.value))}
              onPointerUp={handleSliderRelease}
              onMouseUp={handleSliderRelease}
              className="w-full accent-kayfabe-gold mt-3 cursor-pointer"
              style={{ height: '8px' }}
            />

            {!showConfirmation && (
              <p className="text-kayfabe-cream/50 text-xs text-center italic">
                Adjust progress, then confirm to document your journey
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="card border-2 border-kayfabe-gold bg-kayfabe-gold/5">
          <p className="text-kayfabe-cream text-sm mb-3 text-center">
            Update progress from <span className="font-bold">{bigOne.percentage}%</span> to{' '}
            <span className="font-bold text-kayfabe-gold">{pendingPercentage}%</span>?
          </p>
          <div className="flex space-x-3">
            <button onClick={handleCancelChange} className="btn-secondary flex-1">
              Cancel
            </button>
            <button onClick={handleConfirmChange} className="btn-primary flex-1">
              ✍️ Document the Journey
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
