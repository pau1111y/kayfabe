import React from 'react';
import type { Promo } from '../../types';

interface PromoListProps {
  promos: Promo[];
}

export const PromoList: React.FC<PromoListProps> = ({ promos }) => {
  if (promos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-kayfabe-gray-medium">No promos yet.</p>
        <p className="text-kayfabe-gray-medium text-sm mt-2">
          Cut your first promo to get started.
        </p>
      </div>
    );
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      {promos
        .sort((a, b) => b.createdAt - a.createdAt)
        .map((promo) => (
          <div key={promo.id} className="card">
            <div className="flex justify-between items-start mb-3">
              <span className={`text-xs uppercase tracking-wider ${
                promo.type === 'face' ? 'text-kayfabe-gold' : 'text-kayfabe-red'
              }`}>
                {promo.type} {promo.isFreestyle ? '(Freestyle)' : ''}
              </span>
              <span className="text-xs text-kayfabe-gray-medium">
                {formatDate(promo.createdAt)}
              </span>
            </div>

            {promo.promptUsed && (
              <p className="text-kayfabe-gray-medium text-sm italic mb-2 border-l-2 border-kayfabe-gray-dark pl-3">
                "{promo.promptUsed}"
              </p>
            )}

            <p className="text-kayfabe-cream whitespace-pre-wrap">
              {promo.content}
            </p>

            {promo.faceFollowUp && (
              <div className="mt-4 pt-4 border-t border-kayfabe-gray-dark">
                <p className="text-xs text-kayfabe-gold uppercase tracking-wider mb-2">
                  Face Response
                </p>
                <p className="text-kayfabe-cream whitespace-pre-wrap">
                  {promo.faceFollowUp}
                </p>
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-kayfabe-gray-dark">
              <span className="text-xs text-kayfabe-gold">+{promo.xpEarned} XP</span>
            </div>
          </div>
        ))}
    </div>
  );
};
