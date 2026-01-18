import React, { useState } from 'react';

interface BigOneSetupFlowProps {
  onComplete: (description: string) => void;
  onSkip: () => void;
}

type SetupStep = 'intro' | 'examples' | 'reflection' | 'commitment';

export const BigOneSetupFlow: React.FC<BigOneSetupFlowProps> = ({ onComplete, onSkip }) => {
  const [step, setStep] = useState<SetupStep>('intro');
  const [bigOneDescription, setBigOneDescription] = useState('');

  // Step 1: Arena Introduction
  if (step === 'intro') {
    return (
      <div className="min-h-screen bg-kayfabe-black flex items-center justify-center p-4">
        <div className="relative w-full max-w-4xl">
          {/* Full-screen arena photo background */}
          <div className="absolute inset-0 overflow-hidden rounded-lg">
            <img
              src="/photos/big one/37EF92E8-6347-4D02-BDBD-855492CC732E_1_105_c.jpeg"
              alt="The Arena"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-kayfabe-black via-kayfabe-black/80 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center px-6 py-16 space-y-8">
            <div className="space-y-4">
              <p className="text-kayfabe-gold text-sm uppercase tracking-widest animate-pulse">
                Hall of Fame Career
              </p>
              <h1 className="text-5xl md:text-7xl font-display uppercase tracking-wider text-kayfabe-cream">
                The Big One
              </h1>
              <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-kayfabe-gold to-transparent" />
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              <p className="text-kayfabe-cream text-xl md:text-2xl font-bold leading-relaxed">
                What's the vision, the one that you've always wanted, the one you've thought about since you were young?
              </p>
              <p className="text-kayfabe-cream/80 text-lg">
                The vision is what the face and heel both want but are too afraid to go get.
                They just show their fears differently.
              </p>
              <p className="text-kayfabe-gold text-lg font-bold italic">
                This is their space, this is their chase.
              </p>
            </div>

            <div className="pt-8 space-y-4">
              <button
                onClick={() => setStep('examples')}
                className="btn-primary text-lg px-12 py-4 mx-auto block"
              >
                I'm Ready to Dream Big
              </button>
              <button
                onClick={onSkip}
                className="text-kayfabe-gray-medium hover:text-kayfabe-cream text-sm block mx-auto"
              >
                I'll set this later
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Examples & Inspiration
  if (step === 'examples') {
    const examples = [
      {
        category: "I'm moved to MAKE something",
        examples: [
          'Write and publish a novel that moves people',
          'Direct a feature film that changes perspectives',
          'Build a game studio and ship my dream game',
          'Create a product used by millions',
        ],
      },
      {
        category: "I'm moved to SEE something",
        examples: [
          'Build a company that employs 100+ people',
          'Watch my kids grow into amazing humans',
          'See my art in major galleries worldwide',
          'Witness a community I built thriving',
        ],
      },
      {
        category: "I'm moved to HEAR something",
        examples: [
          'Hear my music played at venues around the world',
          'Listen to people say my work changed their life',
          'Be told "you inspired me to start"',
          'Hear my name called as an industry leader',
        ],
      },
      {
        category: "I'm moved to FEEL something",
        examples: [
          'Feel financially free for the first time',
          'Experience crossing an ultramarathon finish line',
          'Feel the pride of mastering my craft',
          'Know I made a real difference in the world',
        ],
      },
    ];

    return (
      <div className="min-h-screen bg-kayfabe-black p-6">
        <div className="max-w-4xl mx-auto py-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <p className="text-kayfabe-gold text-xs uppercase tracking-widest">Step 1 of 3</p>
            <h2 className="heading-1">What Makes It "Big One" Worthy?</h2>
            <p className="text-kayfabe-cream/80 max-w-2xl mx-auto">
              The Big One isn't about being perfect. It's about being legendary <em>to you</em>.
              Here are some examples to spark inspiration.
            </p>
          </div>

          {/* Examples Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {examples.map((category) => (
              <div key={category.category} className="card">
                <h3 className="text-kayfabe-gold font-bold text-sm uppercase tracking-wider mb-3">
                  {category.category}
                </h3>
                <ul className="space-y-2">
                  {category.examples.map((example, idx) => (
                    <li key={idx} className="text-kayfabe-cream text-sm flex items-start gap-2">
                      <span className="text-kayfabe-gold mt-1">•</span>
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Key Message */}
          <div className="card border-kayfabe-gold bg-kayfabe-gold/5 text-center py-6">
            <p className="text-kayfabe-cream text-lg leading-relaxed">
              Your Big One may feel out of reach and that's okay.
            </p>
            <p className="text-kayfabe-gold font-bold text-xl mt-2">
              That's why we're here.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-4">
            <button
              onClick={() => setStep('intro')}
              className="text-kayfabe-gray-light hover:text-kayfabe-cream"
            >
              ← Back
            </button>
            <button onClick={() => setStep('reflection')} className="btn-primary">
              Next: Reflect →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Guided Reflection
  if (step === 'reflection') {
    const reflectionPrompts = [
      "What would make you feel like you've truly \"made it\" in your life?",
      "What's the one thing you'd regret not attempting?",
      "If you could only accomplish one major thing in the next 10 years, what would it be?",
      "What achievement would make your younger self proud?",
      "What feels impossible right now, but would be legendary if you pulled it off?",
    ];

    return (
      <div className="min-h-screen bg-kayfabe-black p-6">
        <div className="max-w-2xl mx-auto py-8 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <p className="text-kayfabe-gold text-xs uppercase tracking-widest">Step 2 of 3</p>
            <h2 className="heading-1">Think Bigger</h2>
            <p className="text-kayfabe-cream/80">
              Take a moment to reflect. There's no wrong answer here.
            </p>
          </div>

          {/* Reflection Prompts */}
          <div className="space-y-4">
            <p className="text-kayfabe-cream text-sm font-bold">
              Consider these questions:
            </p>
            {reflectionPrompts.map((prompt, idx) => (
              <div key={idx} className="card border-l-4 border-kayfabe-gold">
                <p className="text-kayfabe-cream text-sm italic">"{prompt}"</p>
              </div>
            ))}
          </div>

          {/* Encouragement */}
          <div className="card bg-kayfabe-gold/5 border-kayfabe-gold">
            <p className="text-kayfabe-cream text-sm leading-relaxed">
              💡 <strong>Pro tip:</strong> Your Big One should scare you a little. If it doesn't
              make you think "Can I actually do this?", you might be thinking too small.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-4">
            <button
              onClick={() => setStep('examples')}
              className="text-kayfabe-gray-light hover:text-kayfabe-cream"
            >
              ← Back
            </button>
            <button onClick={() => setStep('commitment')} className="btn-primary">
              I'm Ready to Commit →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 4: The Commitment
  if (step === 'commitment') {
    return (
      <div className="min-h-screen bg-kayfabe-black flex items-center justify-center p-4">
        <div className="relative w-full max-w-3xl">
          {/* Championship photo background */}
          <div className="absolute inset-0 overflow-hidden rounded-lg">
            <img
              src="/photos/main event/70C11649-098C-41F2-AB02-D495F7CCBA26_1_105_c.jpeg"
              alt="Championship Moment"
              className="w-full h-full object-cover opacity-15"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-kayfabe-black via-kayfabe-black/90 to-kayfabe-black/70" />
          </div>

          {/* Content */}
          <div className="relative z-10 px-6 py-12 space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <p className="text-kayfabe-gold text-xs uppercase tracking-widest">Step 3 of 3</p>
              <h2 className="heading-1">Your Hall of Fame Career Goal</h2>
              <p className="text-kayfabe-cream/80 max-w-xl mx-auto">
                This is the legendary story. Write it down. Make it real.
              </p>
            </div>

            {/* Input */}
            <div className="space-y-4">
              <textarea
                value={bigOneDescription}
                onChange={(e) => setBigOneDescription(e.target.value)}
                placeholder="What's your Big One? Be specific. Make it legendary."
                className="input-field min-h-[150px] text-lg resize-none border-2 border-kayfabe-gold"
                autoFocus
              />
              <p className="text-kayfabe-gray-light text-xs italic text-center">
                This becomes your north star. You can update it anytime, but choose something that
                excites you.
              </p>
            </div>

            {/* Examples below input */}
            <div className="card bg-kayfabe-black/50 border-kayfabe-gray-dark">
              <p className="text-kayfabe-gray-light text-xs mb-2">GOOD EXAMPLES:</p>
              <ul className="space-y-1 text-kayfabe-cream/60 text-sm">
                <li>• "Build and sell a SaaS company that helps 10,000+ small businesses"</li>
                <li>• "Write a fantasy novel series and get it traditionally published"</li>
                <li>• "Become a world-class ceramicist with work in major galleries"</li>
              </ul>
            </div>

            {/* Commitment */}
            <div className="big-one-banner text-center py-6">
              <p className="text-kayfabe-cream text-sm mb-4">
                By setting this goal, you're committing to the journey.
                <br />
                <span className="text-kayfabe-gold font-bold">
                  This is your Hall of Fame moment.
                </span>
              </p>
              <button
                onClick={() => {
                  if (bigOneDescription.trim()) {
                    onComplete(bigOneDescription.trim());
                  }
                }}
                disabled={!bigOneDescription.trim()}
                className="btn-primary text-lg px-12 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🏆 Lock It In
              </button>
            </div>

            {/* Navigation */}
            <div className="text-center">
              <button
                onClick={() => setStep('reflection')}
                className="text-kayfabe-gray-medium hover:text-kayfabe-cream text-sm"
              >
                ← Back to Reflection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
