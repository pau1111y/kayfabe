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

  const handleSliderChange = (value: number) => {
    if (value !== bigOne.percentage) {
      setTempPercentage(value);
      onRequestPromoForChange(bigOne.percentage, value);
    }
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
            className="w-full accent-kayfabe-cream mt-2"
          />

          <p className="text-kayfabe-cream/60 text-xs text-center italic">
            Moving the slider requires cutting a promo
          </p>
        </div>
      </div>
    </div>
  );
};
