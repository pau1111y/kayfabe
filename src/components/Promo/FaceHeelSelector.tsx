import React from 'react';
import { PromoType } from '../../types';

interface FaceHeelSelectorProps {
  onSelect: (type: PromoType) => void;
}

export const FaceHeelSelector: React.FC<FaceHeelSelectorProps> = ({ onSelect }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="heading-1 mb-4">Cut a Promo</h2>
        <p className="text-kayfabe-gray-light">Face or Heel?</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onSelect('face')}
          className="card hover:border-kayfabe-gold transition-colors group py-12"
        >
          <div className="text-center">
            <span className="text-4xl mb-4 block">😇</span>
            <span className="text-xl uppercase tracking-wider group-hover:text-kayfabe-gold transition-colors">
              Face
            </span>
            <p className="text-kayfabe-gray-medium text-sm mt-2">
              The good. The light.
            </p>
          </div>
        </button>

        <button
          onClick={() => onSelect('heel')}
          className="card hover:border-kayfabe-red transition-colors group py-12"
        >
          <div className="text-center">
            <span className="text-4xl mb-4 block">😈</span>
            <span className="text-xl uppercase tracking-wider group-hover:text-kayfabe-red transition-colors">
              Heel
            </span>
            <p className="text-kayfabe-gray-medium text-sm mt-2">
              Let it out. No judgment.
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};
