import React, { useState } from 'react';
import type { TimeBlock, Goal, PromoType, Impact, TimeBlockPromo } from '../../types';
import { generateId } from '../../utils/storage';

interface TimeBlockPromoFlowProps {
  block: TimeBlock;
  linkedGoal: Goal | null;
  actualHours: number;
  onComplete: (promo: TimeBlockPromo) => void;
  onCancel: () => void;
}

export const TimeBlockPromoFlow: React.FC<TimeBlockPromoFlowProps> = ({
  block,
  linkedGoal,
  actualHours,
  onComplete,
  onCancel,
}) => {
  const [step, setStep] = useState<'type' | 'content' | 'followup'>('type');
  const [promoType, setPromoType] = useState<PromoType | null>(null);
  const [content, setContent] = useState('');
  const [faceFollowUp, setFaceFollowUp] = useState('');
  const [impact, setImpact] = useState<Impact | null>(null);

  const today = new Date().toISOString().split('T')[0];

  // Calculate performance comparison
  const hoursBooked = block.bookedHours;
  const performanceRatio = hoursBooked > 0 ? actualHours / hoursBooked : 1;
  const exceededBooking = performanceRatio > 1;
  const underperformed = performanceRatio < 0.75;

  const getPromptSuggestion = (): string => {
    if (promoType === 'face') {
      if (exceededBooking) {
        return "You went above and beyond today. What drove that energy?";
      } else if (underperformed) {
        return "You didn't hit your target, but you showed up. What did you learn?";
      } else {
        return "You executed the game plan. How does it feel to deliver?";
      }
    } else {
      if (exceededBooking) {
        return "Even with extra time, what could have been better?";
      } else if (underperformed) {
        return "You fell short today. What got in your way?";
      } else {
        return "What's the honest critique? Where did you cut corners?";
      }
    }
  };

  const calculateXP = (): number => {
    let xp = promoType === 'face' ? 15 : 10;

    // Bonus for linking to Main Event
    if (block.linkedGoalId) {
      xp += 5;
    }

    // Bonus for exceeding booked hours
    if (exceededBooking) {
      xp += 5;
    }

    // Bonus for face follow-up on heel promo
    if (promoType === 'heel' && faceFollowUp.trim()) {
      xp += 10;
    }

    return xp;
  };

  const handleSelectType = (type: PromoType) => {
    setPromoType(type);
    // Auto-set impact based on type
    setImpact(type === 'face' ? 'pop' : 'heat');
    setStep('content');
  };

  const handleSubmitContent = () => {
    if (!content.trim()) return;

    if (promoType === 'heel') {
      setStep('followup');
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    if (!promoType || !content.trim() || !impact) return;

    const promo: TimeBlockPromo = {
      id: generateId(),
      timeBlockId: block.id,
      timeBlockName: block.name,
      linkedGoalId: block.linkedGoalId,
      type: promoType,
      content: content.trim(),
      faceFollowUp: faceFollowUp.trim() || null,
      impact,
      bookedHours: hoursBooked,
      actualHours,
      date: today,
      createdAt: Date.now(),
      xpEarned: calculateXP(),
    };

    onComplete(promo);
  };

  // Step 1: Choose Face or Heel
  if (step === 'type') {
    return (
      <div className="fixed inset-0 bg-kayfabe-black/95 z-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <span className="text-5xl">🎤</span>
            <h2 className="heading-1 mt-4">Cut Your Promo</h2>
            <p className="text-kayfabe-gray-light text-sm mt-2">
              {block.name}
            </p>
          </div>

          {/* Performance Summary */}
          <div className="card text-center">
            <div className="flex justify-around">
              <div>
                <p className="text-kayfabe-gray-light text-xs">Booked</p>
                <p className="text-kayfabe-cream text-xl font-bold">{hoursBooked}h</p>
              </div>
              <div className="text-3xl text-kayfabe-gray-medium">→</div>
              <div>
                <p className="text-kayfabe-gray-light text-xs">Worked</p>
                <p className={`text-xl font-bold ${
                  exceededBooking ? 'text-kayfabe-gold' : underperformed ? 'text-kayfabe-red' : 'text-kayfabe-cream'
                }`}>
                  {actualHours.toFixed(2)}h
                </p>
              </div>
            </div>
            {linkedGoal && (
              <p className="text-kayfabe-gold text-xs mt-3">
                Building toward: {linkedGoal.title}
              </p>
            )}
          </div>

          <p className="text-kayfabe-cream text-center">
            How do you feel about this segment?
          </p>

          {/* Face/Heel Selection */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleSelectType('face')}
              className="card hover:border-kayfabe-gold transition-all text-center py-6"
            >
              <span className="text-4xl">😇</span>
              <p className="text-kayfabe-gold font-bold mt-2">FACE</p>
              <p className="text-kayfabe-gray-light text-xs mt-1">
                Proud of this work
              </p>
            </button>
            <button
              onClick={() => handleSelectType('heel')}
              className="card hover:border-kayfabe-red transition-all text-center py-6"
            >
              <span className="text-4xl">😈</span>
              <p className="text-kayfabe-red font-bold mt-2">HEEL</p>
              <p className="text-kayfabe-gray-light text-xs mt-1">
                Room for growth
              </p>
            </button>
          </div>

          <button
            onClick={onCancel}
            className="btn-secondary w-full"
          >
            Skip for now
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Write the promo content
  if (step === 'content') {
    return (
      <div className="fixed inset-0 bg-kayfabe-black/95 z-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <span className={`text-5xl ${promoType === 'face' ? '' : ''}`}>
              {promoType === 'face' ? '😇' : '😈'}
            </span>
            <h2 className={`heading-1 mt-4 ${promoType === 'face' ? 'text-kayfabe-gold' : 'text-kayfabe-red'}`}>
              {promoType === 'face' ? 'Face Promo' : 'Heel Promo'}
            </h2>
            <p className="text-kayfabe-gray-light text-sm mt-2">
              {block.name} • {actualHours.toFixed(2)}h worked
            </p>
          </div>

          <div className="card">
            <p className="text-kayfabe-gray-light text-sm italic mb-4">
              {getPromptSuggestion()}
            </p>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tell your story..."
              className="input-field min-h-[150px] resize-none"
              autoFocus
            />
          </div>

          {/* XP Preview */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-kayfabe-gray-light">XP Earned:</span>
            <span className="text-kayfabe-gold font-bold">+{calculateXP()} XP</span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('type')}
              className="btn-secondary flex-1"
            >
              Back
            </button>
            <button
              onClick={handleSubmitContent}
              disabled={!content.trim()}
              className={`btn-primary flex-1 ${!content.trim() ? 'opacity-50' : ''}`}
            >
              {promoType === 'heel' ? 'Next' : 'Submit Promo'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Face Follow-up (for heel promos only)
  if (step === 'followup') {
    return (
      <div className="fixed inset-0 bg-kayfabe-black/95 z-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <span className="text-5xl">💡</span>
            <h2 className="heading-1 mt-4 text-kayfabe-gold">Redemption Arc</h2>
            <p className="text-kayfabe-gray-light text-sm mt-2">
              Turn that heat into growth
            </p>
          </div>

          <div className="card border-kayfabe-red">
            <p className="text-kayfabe-red text-xs uppercase tracking-wider mb-2">Your Heel Promo:</p>
            <p className="text-kayfabe-cream text-sm italic">"{content}"</p>
          </div>

          <div className="card border-kayfabe-gold">
            <p className="text-kayfabe-gold text-sm mb-4">
              What will you do differently? How will you turn this around?
            </p>
            <textarea
              value={faceFollowUp}
              onChange={(e) => setFaceFollowUp(e.target.value)}
              placeholder="Your redemption plan..."
              className="input-field min-h-[100px] resize-none"
              autoFocus
            />
            <p className="text-kayfabe-gray-medium text-xs mt-2">
              +10 bonus XP for the face follow-up
            </p>
          </div>

          {/* XP Preview */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-kayfabe-gray-light">XP Earned:</span>
            <span className="text-kayfabe-gold font-bold">+{calculateXP()} XP</span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep('content')}
              className="btn-secondary flex-1"
            >
              Back
            </button>
            <button
              onClick={handleComplete}
              className="btn-primary flex-1"
            >
              {faceFollowUp.trim() ? 'Submit with Redemption' : 'Submit Heel Promo'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
