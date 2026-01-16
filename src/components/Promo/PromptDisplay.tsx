import React from 'react';
import { PromoType } from '../../types';

interface PromptDisplayProps {
  prompt: string;
  type: PromoType;
  onRefresh: () => void;
  onFreestyle: () => void;
  onAccept: () => void;
}

export const PromptDisplay: React.FC<PromptDisplayProps> = ({
  prompt,
  type,
  onRefresh,
  onFreestyle,
  onAccept,
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <span className={`text-sm uppercase tracking-wider ${
          type === 'face' ? 'text-kayfabe-gold' : 'text-kayfabe-red'
        }`}>
          {type} Promo
        </span>
      </div>

      <div className="card">
        <p className="text-xl text-kayfabe-cream leading-relaxed text-center">
          "{prompt}"
        </p>
      </div>

      <div className="flex flex-col space-y-3">
        <button onClick={onAccept} className="btn-primary w-full">
          Use This Prompt
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={onRefresh} className="btn-secondary">
            New Prompt
          </button>
          <button onClick={onFreestyle} className="btn-secondary">
            Freestyle
          </button>
        </div>
      </div>
    </div>
  );
};
