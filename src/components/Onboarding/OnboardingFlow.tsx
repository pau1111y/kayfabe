import React, { useState } from 'react';
import type { Avatar } from '../../types';
import { AvatarGrid } from '../Profile/AvatarGrid';

type OnboardingStep = 'welcome' | 'name' | 'epithet' | 'avatar';

interface OnboardingFlowProps {
  starterAvatars: Avatar[];
  onComplete: (ringName: string, epithet: string, avatarId: string) => Promise<void>;
  onCheckUniqueness: (ringName: string, epithet: string) => Promise<boolean>;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  starterAvatars,
  onComplete,
  onCheckUniqueness,
}) => {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [ringName, setRingName] = useState('');
  const [epithet, setEpithet] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(starterAvatars[0]?.id || '');
  const [uniquenessError, setUniquenessError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const handleNameNext = () => {
    if (ringName.trim().length >= 2) {
      setStep('epithet');
    }
  };

  const handleEpithetNext = async () => {
    if (epithet.trim().length < 2) return;

    setIsChecking(true);
    setUniquenessError(null);

    try {
      const isUnique = await onCheckUniqueness(ringName.trim(), epithet.trim());
      if (!isUnique) {
        setUniquenessError('This wrestler already exists in the roster. Try a different epithet.');
        setIsChecking(false);
        return;
      }

      setStep('avatar');
    } catch (error) {
      console.error('Error checking uniqueness:', error);
      setUniquenessError('Error checking availability. Please try again.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await onComplete(ringName.trim(), epithet.trim(), selectedAvatar);
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
          <button className="btn-primary" onClick={() => setStep('name')}>
            Enter the Business
          </button>
        </div>
      </div>
    );
  }

  if (step === 'name') {
    return (
      <div className="min-h-screen bg-kayfabe-black flex items-center justify-center p-4">
        <div className="card max-w-md w-full space-y-6">
          <h2 className="heading-2 text-center">Create Your Wrestler</h2>

          <div>
            <label className="text-kayfabe-gray-light text-sm block mb-2">
              What's your wrestler name?
            </label>
            <input
              type="text"
              value={ringName}
              onChange={(e) => setRingName(e.target.value)}
              placeholder="e.g., The Rock, Stone Cold, [Your Name]"
              className="input-field"
              maxLength={30}
              autoFocus
              onKeyPress={(e) => e.key === 'Enter' && handleNameNext()}
            />
            <p className="text-kayfabe-gray-medium text-xs mt-1">
              2-30 characters
            </p>
          </div>

          {ringName.trim().length >= 2 && (
            <div className="card border-kayfabe-gold p-4">
              <p className="text-kayfabe-cream text-center text-xl font-bold uppercase tracking-wider">
                {ringName}
              </p>
            </div>
          )}

          <button
            onClick={handleNameNext}
            disabled={ringName.trim().length < 2}
            className={`btn-primary w-full ${ringName.trim().length < 2 ? 'opacity-50' : ''}`}
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  if (step === 'epithet') {
    return (
      <div className="min-h-screen bg-kayfabe-black flex items-center justify-center p-4">
        <div className="card max-w-md w-full space-y-6">
          <h2 className="heading-2 text-center">Your Epithet</h2>

          <div>
            <label className="text-kayfabe-gray-light text-sm block mb-2">
              What's your epithet?
            </label>
            <input
              type="text"
              value={epithet}
              onChange={(e) => {
                setEpithet(e.target.value);
                setUniquenessError(null);
              }}
              placeholder="e.g., The People's Champion, The Texas Rattlesnake"
              className="input-field"
              maxLength={50}
              autoFocus
              onKeyPress={(e) => e.key === 'Enter' && handleEpithetNext()}
            />
            {uniquenessError && (
              <p className="text-red-500 text-xs mt-1">{uniquenessError}</p>
            )}
            <p className="text-kayfabe-gray-medium text-xs mt-1">
              Your epithet makes your name unique in the roster
            </p>
          </div>

          {epithet.trim().length >= 2 && (
            <div className="card border-kayfabe-gold p-4">
              <p className="text-kayfabe-cream text-center text-xl font-bold uppercase tracking-wider">
                {ringName}
              </p>
              <p className="text-kayfabe-gold text-center italic mt-1">
                "{epithet}"
              </p>
            </div>
          )}

          <div className="flex space-x-3">
            <button onClick={() => setStep('name')} className="btn-secondary flex-1">
              Back
            </button>
            <button
              onClick={handleEpithetNext}
              disabled={epithet.trim().length < 2 || isChecking}
              className={`btn-primary flex-1 ${(epithet.trim().length < 2 || isChecking) ? 'opacity-50' : ''}`}
            >
              {isChecking ? 'Checking...' : 'Next'}
            </button>
          </div>
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
                {ringName}
              </h3>
              <p className="text-kayfabe-gold italic">"{epithet}"</p>
              <p className="text-kayfabe-gray-medium text-sm mt-2">{selectedAvatarData.description}</p>
            </div>
          )}

          <div className="flex space-x-3">
            <button onClick={() => setStep('epithet')} className="btn-secondary flex-1">
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
