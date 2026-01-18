import React, { useState, useEffect } from 'react';
import type { PromoType } from '../../types';

interface PromoSuccessProps {
  type: PromoType;
  xpEarned: number;
  onContinue: () => void;
  onFaceFollowUp?: () => void;
}

export const PromoSuccess: React.FC<PromoSuccessProps> = ({
  type,
  xpEarned,
  onContinue,
  onFaceFollowUp,
}) => {
  const [showXP, setShowXP] = useState(false);
  const [displayXP, setDisplayXP] = useState(0);

  // Animate XP counter
  useEffect(() => {
    setShowXP(true);
    const duration = 1000; // 1 second
    const steps = 20;
    const increment = xpEarned / steps;
    let current = 0;

    const interval = setInterval(() => {
      current += increment;
      if (current >= xpEarned) {
        setDisplayXP(xpEarned);
        clearInterval(interval);
      } else {
        setDisplayXP(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(interval);
  }, [xpEarned]);

  const crowdReaction = type === 'face'
    ? '👏 👏 👏 POP! 👏 👏 👏'
    : '😤 😤 😤 HEAT! 😤 😤 😤';

  const crowdMessage = type === 'face'
    ? "The crowd's with you!"
    : "You got heat! They're listening.";

  return (
    <div className="space-y-6">
      {/* Crowd Reaction Banner */}
      <div className={`card border-2 text-center py-6 ${
        type === 'face'
          ? 'border-kayfabe-gold bg-kayfabe-gold/10 animate-pulse'
          : 'border-kayfabe-red bg-kayfabe-red/10 animate-pulse'
      }`}>
        <div className="text-3xl mb-3">🎤</div>
        <h2 className="heading-1 mb-3">Promo Cut!</h2>
        <p className={`text-lg font-bold mb-2 ${
          type === 'face' ? 'text-kayfabe-gold' : 'text-kayfabe-red'
        }`}>
          {crowdReaction}
        </p>
        <p className="text-kayfabe-cream text-sm">
          {crowdMessage}
        </p>
      </div>

      {/* XP Earned Display */}
      <div className="card border-kayfabe-gold bg-kayfabe-gold/5 text-center py-8">
        <p className="text-kayfabe-gray-light text-sm mb-2">XP EARNED</p>
        <p className={`text-5xl font-bold transition-all duration-300 ${
          showXP ? 'text-kayfabe-gold scale-100' : 'text-kayfabe-gray-dark scale-50'
        }`}>
          +{displayXP}
        </p>
        {displayXP === xpEarned && (
          <p className="text-kayfabe-cream text-xs mt-3 italic animate-pulse">
            "Champions do the work."
          </p>
        )}
      </div>

      {/* Follow-up Option */}
      {type === 'heel' && onFaceFollowUp && (
        <button onClick={onFaceFollowUp} className="btn-secondary w-full">
          💬 Let the Face Respond (+10 XP)
        </button>
      )}

      {/* Continue Button */}
      <button onClick={onContinue} className="btn-primary w-full">
        Continue to Card
      </button>
    </div>
  );
};
