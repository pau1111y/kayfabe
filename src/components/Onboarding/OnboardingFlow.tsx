import React, { useState } from 'react';
import type { Avatar } from '../../types';
import { AvatarGrid } from '../Profile/AvatarGrid';

type OnboardingStep = 'welcome' | 'avatar';

interface OnboardingFlowProps {
  starterAvatars: Avatar[];
  onComplete: (ringName: string, epithet: string, avatarId: string) => Promise<void>;
  onCheckUniqueness: (ringName: string, epithet: string) => Promise<boolean>;
}

// Generate unique rookie name
const generateRookieName = (): string => {
  const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit number
  return `Rookie #${randomNum}`;
};

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  starterAvatars,
  onComplete,
}) => {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(starterAvatars[0]?.id || '');
  const [isCompleting, setIsCompleting] = useState(false);
  const [rookieName] = useState(generateRookieName());

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      // Auto-assigned rookie name, empty epithet for now
      await onComplete(rookieName, '', selectedAvatar);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      setIsCompleting(false);
    }
  };

  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-kayfabe-black flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="heading-1 mb-8">KAYFABE</h1>
          <p className="text-kayfabe-gray-light mb-8">
            Your brain is a promoter.<br />
            It pitches storylines all day.<br />
            Choose which voice books the next segment.
          </p>
          <button className="btn-primary" onClick={() => setStep('avatar')}>
            Enter the Business
          </button>
        </div>
      </div>
    );
  }

  if (step === 'avatar') {
    const selectedAvatarData = starterAvatars.find(a => a.id === selectedAvatar);

    return (
      <div className="min-h-screen bg-kayfabe-black flex items-center justify-center p-4">
        <div className="card max-w-2xl w-full space-y-6">
          <h2 className="heading-2 text-center">Choose Your Avatar</h2>

          <AvatarGrid
            availableAvatars={starterAvatars}
            selectedAvatarId={selectedAvatar}
            onSelect={setSelectedAvatar}
          />

          {selectedAvatarData && (
            <div className="card border-kayfabe-gold p-6 text-center">
              <div className="w-24 h-24 mx-auto mb-4">
                <img src={selectedAvatarData.svgPath} alt={selectedAvatarData.name} className="w-full h-full" />
              </div>
              <h3 className="text-2xl font-bold text-kayfabe-cream uppercase tracking-wider">
                {rookieName}
              </h3>
              <p className="text-kayfabe-gray-medium text-sm mt-2">{selectedAvatarData.description}</p>
              <p className="text-kayfabe-gray-light text-xs mt-3">
                You'll earn the right to choose your own ring name at 250 XP!
              </p>
            </div>
          )}

          <div className="flex space-x-3">
            <button onClick={() => setStep('welcome')} className="btn-secondary flex-1">
              Back
            </button>
            <button
              onClick={handleComplete}
              disabled={!selectedAvatar || isCompleting}
              className={`btn-primary flex-1 ${(!selectedAvatar || isCompleting) ? 'opacity-50' : ''}`}
            >
              {isCompleting ? 'Starting...' : 'Start Your Journey'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
