import React from 'react';
import { Impact } from '../../types';

interface ImpactSelectorProps {
  selected: Impact | null;
  onSelect: (impact: Impact) => void;
}

export const ImpactSelector: React.FC<ImpactSelectorProps> = ({ selected, onSelect }) => {
  return (
    <div className="space-y-3">
      <p className="text-kayfabe-gray-light text-sm">
        Pop or Heat?
      </p>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onSelect('pop')}
          className={`p-4 border transition-colors ${
            selected === 'pop'
              ? 'border-kayfabe-gold text-kayfabe-gold'
              : 'border-kayfabe-gray-dark text-kayfabe-gray-light hover:border-kayfabe-gray-medium'
          }`}
        >
          <p className="text-2xl mb-1">📈</p>
          <p className="uppercase tracking-wider text-sm">Pop</p>
          <p className="text-xs opacity-75 mt-1">Momentum. Energy.</p>
        </button>

        <button
          onClick={() => onSelect('heat')}
          className={`p-4 border transition-colors ${
            selected === 'heat'
              ? 'border-kayfabe-red text-kayfabe-red'
              : 'border-kayfabe-gray-dark text-kayfabe-gray-light hover:border-kayfabe-gray-medium'
          }`}
        >
          <p className="text-2xl mb-1">🔥</p>
          <p className="uppercase tracking-wider text-sm">Heat</p>
          <p className="text-xs opacity-75 mt-1">Tension. Processing.</p>
        </button>
      </div>

      <p className="text-kayfabe-gray-medium text-xs text-center">
        Heat isn't bad. Heat builds stories.
      </p>
    </div>
  );
};
