import React, { useState } from 'react';
import type { Goal } from '../../types';

interface GoalCompletionProps {
  goal: Goal;
  onComplete: (victoryPromo: string) => void;
  onCancel: () => void;
}

export const GoalCompletion: React.FC<GoalCompletionProps> = ({ goal, onComplete, onCancel }) => {
  const [step, setStep] = useState<'confirm' | 'promo' | 'success'>('confirm');
  const [victoryPromo, setVictoryPromo] = useState('');

  const isMainEvent = goal.tier === 'main';

  if (step === 'confirm') {
    return (
      <div className="text-center space-y-8">
        <div>
          <p className="text-6xl mb-4">{isMainEvent ? '👑' : '🏆'}</p>
          <h2 className={`heading-1 mb-2 ${isMainEvent ? 'text-kayfabe-gold' : ''}`}>
            {isMainEvent ? 'Complete This Main Event?' : 'Complete This Storyline?'}
          </h2>
          <p className={`text-lg ${isMainEvent ? 'text-kayfabe-gold' : 'text-kayfabe-cream'}`}>
            "{goal.title}"
          </p>
          {isMainEvent && (
            <p className="text-kayfabe-gray-light text-sm mt-2">
              This is a championship moment.
            </p>
          )}
        </div>

        <div className="flex space-x-4">
          <button onClick={onCancel} className="btn-secondary flex-1">
            Not Yet
          </button>
          <button onClick={() => setStep('promo')} className="btn-primary flex-1">
            {isMainEvent ? 'Claim Victory' : 'Yes, I Did It'}
          </button>
        </div>
      </div>
    );
  }

  if (step === 'promo') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-4xl mb-4">{isMainEvent ? '🏆' : '🎤'}</p>
          <h2 className={`heading-2 mb-2 ${isMainEvent ? 'text-kayfabe-gold' : ''}`}>
            {isMainEvent ? 'Championship Victory Speech' : 'Victory Promo'}
          </h2>
          <p className="text-kayfabe-gray-light">
            {isMainEvent
              ? 'The champion gets the mic. This is your moment. Tell your story.'
              : 'The winner gets the mic. What do you want to say?'}
          </p>
        </div>

        <textarea
          value={victoryPromo}
          onChange={(e) => setVictoryPromo(e.target.value)}
          placeholder={isMainEvent
            ? "This is your championship moment. What did it take to get here? Who helped you? What's next?"
            : "You earned this moment. Say what you need to say."}
          className={`input-field min-h-[200px] resize-none ${isMainEvent ? 'border-kayfabe-gold' : ''}`}
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
          {isMainEvent ? 'Raise The Belt' : 'Submit Victory Promo'}
        </button>
      </div>
    );
  }

  return (
    <div className="text-center space-y-8">
      {isMainEvent ? (
        <>
          <div className="big-one-banner py-12">
            <p className="text-8xl mb-6">🏆</p>
            <h2 className="text-4xl font-display uppercase tracking-wider text-kayfabe-cream mb-2">
              CHAMPION!
            </h2>
            <p className="text-kayfabe-cream/80 text-sm uppercase tracking-wider">
              Main Event Victory
            </p>
          </div>

          <div className="main-event-card">
            <p className="text-kayfabe-gold text-2xl font-bold mb-4">"{goal.title}"</p>
            <p className="text-kayfabe-cream text-sm">
              You did it. You fought through everything and came out on top.
            </p>
            <p className="text-kayfabe-gray-light text-xs mt-4">
              This victory has been added to your Hall of Fame.
            </p>
          </div>

          <div className="card border-kayfabe-gold">
            <p className="text-kayfabe-gold font-bold text-xl">+100 XP</p>
            <p className="text-kayfabe-gray-medium text-sm mt-1">Championship Bonus</p>
          </div>
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};
