import React, { useEffect, useState } from 'react';

interface XPGainProps {
  amount: number;
  multiplier?: number;
  onComplete?: () => void;
}

export const XPGain: React.FC<XPGainProps> = ({ amount, multiplier = 1, onComplete }) => {
  const [isAnimating, setIsAnimating] = useState(true);
  const totalXP = Math.floor(amount * multiplier);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
      onComplete?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-1000 ${
        isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <div className="bg-kayfabe-gold text-kayfabe-black px-6 py-3 rounded-lg shadow-lg font-bold">
        <div className="text-center">
          {multiplier > 1 ? (
            <>
              <p className="text-sm opacity-75">
                {amount} XP × {multiplier.toFixed(1)}x
              </p>
              <p className="text-2xl">+{totalXP} XP</p>
            </>
          ) : (
            <p className="text-2xl">+{totalXP} XP</p>
          )}
        </div>
      </div>
    </div>
  );
};
