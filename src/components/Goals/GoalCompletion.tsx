import React, { useState } from 'react';
import type { Goal, Promo, HotTag, RunIn, TimeBlock } from '../../types';

interface GoalCompletionProps {
  goal: Goal;
  promos?: Promo[];
  hotTags?: HotTag[];
  runIns?: RunIn[];
  timeBlocks?: TimeBlock[];
  onComplete: (victoryPromo: string) => void;
  onCancel: () => void;
}

export const GoalCompletion: React.FC<GoalCompletionProps> = ({
  goal,
  promos = [],
  hotTags: _hotTags = [],
  runIns: _runIns = [],
  timeBlocks = [],
  onComplete,
  onCancel
}) => {
  const [step, setStep] = useState<'confirm' | 'journey' | 'promo' | 'victory' | 'success'>('confirm');
  const [victoryPromo, setVictoryPromo] = useState('');

  const isMainEvent = goal.tier === 'main';

  // Calculate journey stats for Main Event
  const relatedPromos = promos.filter(p => p.storylineId === goal.id);
  const popCount = relatedPromos.filter(p => p.impact === 'pop').length;
  const heatCount = relatedPromos.filter(p => p.impact === 'heat').length;
  const totalXP = relatedPromos.reduce((sum, p) => sum + (p.xpEarned || 0), 0);

  // Calculate journey duration
  const firstPromo = relatedPromos.length > 0
    ? relatedPromos.reduce((earliest, p) => p.createdAt < earliest.createdAt ? p : earliest)
    : null;
  const journeyDays = firstPromo
    ? Math.ceil((Date.now() - firstPromo.createdAt) / (1000 * 60 * 60 * 24))
    : 0;

  // Calculate midcard origin story
  const linkedBlocks = timeBlocks.filter(b => b.linkedGoalId === goal.id);
  const midcardHours = linkedBlocks.reduce((sum, b) => sum + b.loggedHours, 0);
  const midcardSkills = linkedBlocks.map(b => b.name);

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
          <button onClick={() => setStep(isMainEvent ? 'journey' : 'promo')} className="btn-primary flex-1">
            {isMainEvent ? 'Claim Victory' : 'Yes, I Did It'}
          </button>
        </div>
      </div>
    );
  }

  // Journey Stats Reveal (Main Event only)
  if (step === 'journey') {
    return (
      <div className="min-h-screen bg-kayfabe-black -m-4 p-4">
        <div className="max-w-2xl mx-auto space-y-8 pt-8">
          {/* Championship Photo Header */}
          <div className="relative h-64 overflow-hidden rounded-lg">
            <img
              src="/photos/main event/E402E48B-77B4-4418-88C4-4F380146F02B_1_105_c.jpeg"
              alt="Championship Moment"
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-kayfabe-black via-kayfabe-black/60 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-kayfabe-gold text-sm uppercase tracking-widest mb-2">
                  You Did It
                </p>
                <h2 className="text-4xl md:text-5xl font-display uppercase tracking-wider text-kayfabe-cream">
                  YOU TOOK CONTROL
                </h2>
              </div>
            </div>
          </div>

          {/* The Journey Stats */}
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="heading-2 text-kayfabe-gold mb-2">Your Championship Journey</h3>
              <p className="text-kayfabe-cream/80 text-sm">
                Look at what YOU made happen.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Midcard Hours - The Origin Story (Featured First if exists) */}
              {midcardHours > 0 && (
                <div className="main-event-card text-center py-6 col-span-2 border-kayfabe-gold border-2">
                  <p className="text-6xl font-bold text-kayfabe-gold mb-2">{Math.round(midcardHours)}</p>
                  <p className="text-kayfabe-gold text-sm uppercase tracking-wider">Hours in the Midcard</p>
                  <p className="text-kayfabe-gray-light text-xs mt-2">
                    YOU put in the work to earn this championship
                  </p>
                  {midcardSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1 justify-center mt-3">
                      {midcardSkills.map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-kayfabe-gray-dark text-kayfabe-gold text-xs rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-kayfabe-cream text-xs mt-2 italic">
                    Every hour was YOU cutting your teeth, getting disciplined, proving yourself
                  </p>
                </div>
              )}

              <div className="main-event-card text-center py-6">
                <p className="text-5xl font-bold text-kayfabe-cream mb-2">{relatedPromos.length}</p>
                <p className="text-kayfabe-gold text-sm uppercase tracking-wider">Promos Cut</p>
                <p className="text-kayfabe-gray-light text-xs mt-1">
                  Every word was YOU showing up
                </p>
              </div>

              <div className="main-event-card text-center py-6">
                <p className="text-5xl font-bold text-kayfabe-cream mb-2">{journeyDays}</p>
                <p className="text-kayfabe-gold text-sm uppercase tracking-wider">
                  {journeyDays === 1 ? 'Day' : 'Days'}
                </p>
                <p className="text-kayfabe-gray-light text-xs mt-1">
                  YOU stayed committed
                </p>
              </div>

              <div className="main-event-card text-center py-6">
                <p className="text-5xl font-bold text-kayfabe-gold mb-2">{popCount}</p>
                <p className="text-kayfabe-gold text-sm uppercase tracking-wider">Pop Moments</p>
                <p className="text-kayfabe-gray-light text-xs mt-1">
                  YOU built momentum
                </p>
              </div>

              <div className="main-event-card text-center py-6">
                <p className="text-5xl font-bold text-kayfabe-red mb-2">{heatCount}</p>
                <p className="text-kayfabe-red text-sm uppercase tracking-wider">Heat Moments</p>
                <p className="text-kayfabe-gray-light text-xs mt-1">
                  YOU pushed through
                </p>
              </div>
            </div>

            {/* Journey Highlights */}
            {relatedPromos.length > 0 && (
              <div className="card border-kayfabe-gold">
                <p className="text-kayfabe-gold font-bold text-sm uppercase tracking-wider mb-3">
                  Total XP Earned
                </p>
                <p className="text-kayfabe-cream text-4xl font-bold">+{totalXP} XP</p>
                <p className="text-kayfabe-gray-light text-xs mt-2">
                  From {relatedPromos.length} promo{relatedPromos.length !== 1 ? 's' : ''} on this journey
                </p>
              </div>
            )}

            {/* Empowering Message */}
            <div className="big-one-banner text-center py-8">
              <p className="text-kayfabe-cream text-lg leading-relaxed mb-4">
                You didn't wait for permission.<br />
                You didn't wait for the perfect moment.<br />
                <span className="text-kayfabe-gold font-bold text-xl">
                  YOU TOOK CONTROL AND MADE IT HAPPEN.
                </span>
              </p>
            </div>

            {/* Continue Button */}
            <button
              onClick={() => setStep('promo')}
              className="btn-primary w-full text-lg py-4"
            >
              The Champion Gets The Mic →
            </button>
          </div>
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
            {isMainEvent ? 'The Champion Gets The Mic' : 'Victory Promo'}
          </h2>
          <p className="text-kayfabe-gray-light">
            {isMainEvent
              ? 'This is YOUR moment. Tell the world what YOU just accomplished.'
              : 'The winner gets the mic. What do you want to say?'}
          </p>
        </div>

        <textarea
          value={victoryPromo}
          onChange={(e) => setVictoryPromo(e.target.value)}
          placeholder={isMainEvent
            ? "What did YOU overcome? What did YOU prove? Who's next?"
            : "You earned this moment. Say what you need to say."}
          className={`input-field min-h-[200px] resize-none ${isMainEvent ? 'border-kayfabe-gold' : ''}`}
          autoFocus
        />

        <button
          onClick={() => {
            if (victoryPromo.trim()) {
              onComplete(victoryPromo.trim());
              setStep(isMainEvent ? 'victory' : 'success');
            }
          }}
          disabled={!victoryPromo.trim()}
          className={`btn-primary w-full ${!victoryPromo.trim() ? 'opacity-50' : ''}`}
        >
          {isMainEvent ? '🏆 Raise The Belt' : 'Submit Victory Promo'}
        </button>
      </div>
    );
  }

  // Victory Celebration (Main Event)
  if (step === 'victory') {
    return (
      <div className="min-h-screen bg-kayfabe-black -m-4 p-4">
        <div className="max-w-2xl mx-auto space-y-8 pt-8">
          {/* Championship Banner with Photo */}
          <div className="relative h-96 overflow-hidden rounded-lg">
            <img
              src="/photos/main event/70C11649-098C-41F2-AB02-D495F7CCBA26_1_105_c.jpeg"
              alt="Championship Victory"
              className="w-full h-full object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-kayfabe-black via-kayfabe-black/70 to-kayfabe-black/40" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <p className="text-8xl mb-6 animate-pulse">🏆</p>
              <h1 className="text-5xl md:text-7xl font-display uppercase tracking-wider text-kayfabe-cream mb-4">
                CHAMPION!
              </h1>
              <p className="text-kayfabe-gold text-xl uppercase tracking-wider">
                Main Event Victory
              </p>
              <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-kayfabe-gold to-transparent mt-4" />
            </div>
          </div>

          {/* Victory Message */}
          <div className="big-one-banner py-8">
            <h2 className="text-kayfabe-gold text-3xl font-bold mb-4 text-center">
              "{goal.title}"
            </h2>
            <p className="text-kayfabe-cream text-lg text-center leading-relaxed">
              <span className="text-kayfabe-gold font-bold">YOU</span> didn't just complete a goal.<br />
              <span className="text-kayfabe-gold font-bold">YOU</span> took control of your story.<br />
              <span className="text-kayfabe-gold font-bold">YOU</span> made this happen.
            </p>
          </div>

          {/* XP Bonus */}
          <div className="main-event-card text-center py-8">
            <p className="text-kayfabe-gold font-bold text-5xl mb-2">+100 XP</p>
            <p className="text-kayfabe-cream text-sm uppercase tracking-wider">Championship Bonus</p>
            <p className="text-kayfabe-gray-light text-xs mt-2">
              This victory has been added to your Hall of Fame
            </p>
          </div>

          {/* The Victory Promo */}
          {victoryPromo && (
            <div className="card border-l-4 border-kayfabe-gold">
              <p className="text-kayfabe-gold text-xs font-bold uppercase tracking-wider mb-3">
                Your Victory Speech
              </p>
              <p className="text-kayfabe-cream text-sm leading-relaxed whitespace-pre-wrap">
                {victoryPromo}
              </p>
            </div>
          )}

          {/* Final Empowering Message */}
          <div className="card bg-kayfabe-gold/5 border-kayfabe-gold text-center py-8">
            <p className="text-kayfabe-cream text-base leading-relaxed">
              Remember this feeling.<br />
              <span className="text-kayfabe-gold font-bold text-lg">
                You are in charge of the life you live.
              </span><br />
              And you just proved it.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Success (Non-Main Event)
  if (step === 'success') {
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
  }

  return null;
};
