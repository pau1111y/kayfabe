import React from 'react';
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
  return (
    <div className="space-y-8 text-center">
      <div>
        <span className="text-4xl mb-4 block">🎤</span>
        <h2 className="heading-1 mb-2">Promo Cut</h2>
        <p className="text-kayfabe-gray-light">
          {type === 'face'
            ? "The crowd's with you."
            : "That took guts. The work is the work."}
        </p>
      </div>

      <div className="card">
        <p className="text-kayfabe-gold text-2xl font-bold">+{xpEarned} XP</p>
      </div>

      {type === 'heel' && onFaceFollowUp && (
        <button onClick={onFaceFollowUp} className="btn-secondary w-full">
          Let the Face Respond (+10 XP)
        </button>
      )}

      <button onClick={onContinue} className="btn-primary w-full">
        Continue
      </button>
    </div>
  );
};
