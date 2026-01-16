import React from 'react';
import { Belt } from '../../types';

interface BeltDisplayProps {
  belts: Belt[];
}

export const BeltDisplay: React.FC<BeltDisplayProps> = ({ belts }) => {
  const earned = belts.filter(b => b.earnedAt !== null);
  const unearned = belts.filter(b => b.earnedAt === null);

  return (
    <div className="space-y-6">
      {earned.length > 0 && (
        <div>
          <h3 className="heading-2 mb-4">Your Championships</h3>
          <div className="space-y-3">
            {earned.map(belt => (
              <div key={belt.id} className="card border-kayfabe-gold">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <p className="text-kayfabe-gold font-bold">{belt.name}</p>
                    <p className="text-kayfabe-gray-medium text-xs">
                      Earned {new Date(belt.earnedAt!).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="heading-2 mb-4">Available Championships</h3>
        <div className="space-y-3">
          {unearned.map(belt => (
            <div key={belt.id} className="card opacity-60">
              <div className="flex items-center space-x-3">
                <span className="text-2xl opacity-50">🏆</span>
                <div>
                  <p className="text-kayfabe-gray-light font-bold">{belt.name}</p>
                  <p className="text-kayfabe-gray-medium text-xs">{belt.requirement}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
