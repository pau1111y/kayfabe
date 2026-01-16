import React, { useState } from 'react';
import type { PromoType, Promo, Goal, Impact } from '../../types';
import { FaceHeelSelector } from './FaceHeelSelector';
import { PromptDisplay } from './PromptDisplay';
import { PromoEditor } from './PromoEditor';
import { PromoSuccess } from './PromoSuccess';
import { StorylineSelector } from './StorylineSelector';
import { ImpactSelector } from './ImpactSelector';
import { getRandomPrompt, getRandomFollowUpPrompt } from '../../data/prompts';
import { generateId } from '../../utils/storage';

type FlowStep = 'select' | 'prompt' | 'write' | 'storyline' | 'impact' | 'success' | 'followup';

interface PromoFlowProps {
  goals: Goal[];
  onComplete: (promo: Promo) => void;
  onCancel: () => void;
}

export const PromoFlow: React.FC<PromoFlowProps> = ({ goals, onComplete, onCancel }) => {
  const [step, setStep] = useState<FlowStep>('select');
  const [promoType, setPromoType] = useState<PromoType | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null);
  const [isFreestyle, setIsFreestyle] = useState(false);
  const [content, setContent] = useState('');
  const [storylineId, setStorylineId] = useState<string | null>(null);
  const [impact, setImpact] = useState<Impact | null>(null);
  const [savedPromo, setSavedPromo] = useState<Promo | null>(null);

  const activeGoals = goals.filter(g => g.status === 'active');

  const handleTypeSelect = (type: PromoType) => {
    setPromoType(type);
    setCurrentPrompt(getRandomPrompt(type));
    setStep('prompt');
  };

  const handleRefreshPrompt = () => {
    if (promoType) {
      setCurrentPrompt(getRandomPrompt(promoType));
    }
  };

  const handleFreestyle = () => {
    setCurrentPrompt(null);
    setIsFreestyle(true);
    setStep('write');
  };

  const handleAcceptPrompt = () => {
    setIsFreestyle(false);
    setStep('write');
  };

  const handleContentSubmit = (promoContent: string) => {
    setContent(promoContent);
    // If there are active goals, ask for storyline
    if (activeGoals.length > 0) {
      setStep('storyline');
    } else {
      setStep('impact');
    }
  };

  const handleStorylineSelect = (goalId: string | null) => {
    setStorylineId(goalId);
    setStep('impact');
  };

  const calculateXP = (): number => {
    let xp = isFreestyle ? 20 : 15;
    if (storylineId) xp += 5; // Bonus for tagging storyline
    return xp;
  };

  const handleImpactSelect = (selectedImpact: Impact) => {
    setImpact(selectedImpact);

    const xpEarned = calculateXP();

    const promo: Promo = {
      id: generateId(),
      type: promoType!,
      content,
      promptUsed: currentPrompt,
      isFreestyle,
      storylineId,
      impact: selectedImpact,
      faceFollowUp: null,
      createdAt: Date.now(),
      xpEarned,
    };

    setSavedPromo(promo);
    setStep('success');
  };

  const handleFaceFollowUp = () => {
    setCurrentPrompt(getRandomFollowUpPrompt());
    setStep('followup');
  };

  const handleSubmitFollowUp = (followUpContent: string) => {
    if (!savedPromo) return;

    const updatedPromo: Promo = {
      ...savedPromo,
      faceFollowUp: followUpContent,
      xpEarned: savedPromo.xpEarned + 10,
    };

    onComplete(updatedPromo);
  };

  const handleContinue = () => {
    if (savedPromo) {
      onComplete(savedPromo);
    }
  };

  return (
    <div className="py-4">
      {step === 'select' && (
        <FaceHeelSelector onSelect={handleTypeSelect} />
      )}

      {step === 'prompt' && promoType && currentPrompt && (
        <PromptDisplay
          prompt={currentPrompt}
          type={promoType}
          onRefresh={handleRefreshPrompt}
          onFreestyle={handleFreestyle}
          onAccept={handleAcceptPrompt}
        />
      )}

      {step === 'write' && promoType && (
        <PromoEditor
          type={promoType}
          prompt={currentPrompt}
          onSubmit={handleContentSubmit}
          onCancel={onCancel}
        />
      )}

      {step === 'storyline' && (
        <div className="space-y-6">
          <StorylineSelector
            goals={goals}
            selectedId={storylineId}
            onSelect={handleStorylineSelect}
          />
        </div>
      )}

      {step === 'impact' && (
        <div className="space-y-6">
          <ImpactSelector
            selected={impact}
            onSelect={handleImpactSelect}
          />
        </div>
      )}

      {step === 'success' && savedPromo && (
        <PromoSuccess
          type={savedPromo.type}
          xpEarned={savedPromo.xpEarned}
          onContinue={handleContinue}
          onFaceFollowUp={savedPromo.type === 'heel' ? handleFaceFollowUp : undefined}
        />
      )}

      {step === 'followup' && (
        <PromoEditor
          type="face"
          prompt={currentPrompt}
          onSubmit={handleSubmitFollowUp}
          onCancel={handleContinue}
        />
      )}
    </div>
  );
};
