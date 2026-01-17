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

  return (
    <div className="space-y-2">
      <h3 className="text-center text-kayfabe-gold uppercase tracking-wider text-sm font-bold">
        🏆 The Big One - Headline Match
      </h3>

      <div className="big-one-banner">
        <p className="text-kayfabe-cream text-xl md:text-2xl text-center font-bold mb-4">
          "{bigOne.description}"
        </p>

        <div className="space-y-2">
          <div className="h-4 bg-kayfabe-black/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-kayfabe-cream transition-all duration-300"
              style={{ width: `${currentPercentage}%` }}
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-kayfabe-cream/80">Progress</span>
            <span className="text-kayfabe-cream font-bold text-lg">
              {currentPercentage}%
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={currentPercentage}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            onPointerUp={handleSliderRelease}
            onMouseUp={handleSliderRelease}
            className="w-full accent-kayfabe-cream mt-2"
          />

          {!showConfirmation && (
            <p className="text-kayfabe-cream/60 text-xs text-center italic">
              Adjust freely, then confirm to write promo
            </p>
          )}
        </div>
      </div>

      {showConfirmation && (
        <div className="mt-4 card border-kayfabe-gold">
          <p className="text-kayfabe-cream text-sm mb-3">
            Confirm change from {bigOne.percentage}% to {pendingPercentage}%?
          </p>
          <div className="flex space-x-3">
            <button onClick={handleCancelChange} className="btn-secondary flex-1">
              Cancel
            </button>
            <button onClick={handleConfirmChange} className="btn-primary flex-1">
              Confirm & Write Promo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
