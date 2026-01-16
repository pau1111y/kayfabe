import React, { useState } from 'react';
import { Goal } from '../../types';

interface GoalCompletionProps {
  goal: Goal;
  onComplete: (victoryPromo: string) => void;
  onCancel: () => void;
}

export const GoalCompletion: React.FC<GoalCompletionProps> = ({ goal, onComplete, onCancel }) => {
  const [step, setStep] = useState<'confirm' | 'promo' | 'success'>('confirm');
  const [victoryPromo, setVictoryPromo] = useState('');

  if (step === 'confirm') {
    return (
      <div className="text-center space-y-8">
        <div>
          <p className="text-6xl mb-4">🏆</p>
          <h2 className="heading-1 mb-2">Complete This Storyline?</h2>
          <p className="text-kayfabe-cream text-lg">"{goal.title}"</p>
        </div>

        <div className="flex space-x-4">
          <button onClick={onCancel} className="btn-secondary flex-1">
            Not Yet
          </button>
          <button onClick={() => setStep('promo')} className="btn-primary flex-1">
            Yes, I Did It
          </button>
        </div>
      </div>
    );
  }

  if (step === 'promo') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-4xl mb-4">🎤</p>
          <h2 className="heading-2 mb-2">Victory Promo</h2>
          <p className="text-kayfabe-gray-light">
            The winner gets the mic. What do you want to say?
          </p>
        </div>

        <textarea
          value={victoryPromo}
          onChange={(e) => setVictoryPromo(e.target.value)}
          placeholder="You earned this moment. Say what you need to say."
          className="input-field min-h-[150px] resize-none"
          autoFocus
        />

        <button
          onClick={() => {
            if (victoryPromo.trim()) {
              onComplete(victoryPromo.trim());
              setStep('success');
            }
          }}
          disabled={!victoryPromo.trim()}
          className={`btn-primary w-full ${!victoryPromo.trim() ? 'opacity-50' : ''}`}
        >
          Submit Victory Promo
        </button>
      </div>
    );
  }

  return (
    <div className="text-center space-y-8">
      <div>
        <p className="text-6xl mb-4">1... 2... 3!</p>
        <h2 className="heading-1 mb-4">🔔 DING DING DING 🔔</h2>
        <p className="text-kayfabe-gold text-xl uppercase tracking-wider">
          Storyline Complete
        </p>
      </div>

      <div className="card">
        <p className="text-kayfabe-cream">"{goal.title}"</p>
        <p className="text-kayfabe-gray-medium text-sm mt-2">
          That's a clean pin. Savor it.
        </p>
      </div>
    </div>
  );
};
