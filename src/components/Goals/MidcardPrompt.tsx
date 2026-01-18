import React from 'react';
import type { Goal } from '../../types';

interface MidcardPromptProps {
  goal: Goal;
  onCreateSkills: () => void;
  onSkipForNow: () => void;
}

export const MidcardPrompt: React.FC<MidcardPromptProps> = ({
  goal,
  onCreateSkills,
  onSkipForNow,
}) => {
  return (
    <div className="card space-y-6">
      <div className="text-center">
        <p className="text-5xl mb-4">💪</p>
        <h2 className="heading-2 text-kayfabe-gold mb-3">
          Main Event Runs Are Earned in the Midcard
        </h2>
        <p className="text-kayfabe-cream text-lg mb-2">
          "{goal.title}"
        </p>
        <p className="text-kayfabe-gray-light text-sm">
          What skills will you build to achieve this championship goal?
        </p>
      </div>

      <div className="bg-kayfabe-gray-dark p-4 rounded border border-kayfabe-gray-medium">
        <p className="text-kayfabe-gray-light text-sm mb-2">
          <span className="text-kayfabe-gold font-bold">Example:</span>
        </p>
        <p className="text-kayfabe-cream text-sm mb-2">
          If your goal is "Become a booked wrestling photographer"
        </p>
        <p className="text-kayfabe-gray-light text-xs">
          Your midcard might include building:
        </p>
        <ul className="text-kayfabe-gray-light text-xs mt-2 space-y-1 ml-4">
          <li>• <span className="text-kayfabe-cream">Creativity</span> - 20 mins daily with camera</li>
          <li>• <span className="text-kayfabe-cream">Connection</span> - Network with promoters</li>
          <li>• <span className="text-kayfabe-cream">Physical activity</span> - Stay match-ready</li>
        </ul>
      </div>

      <div className="space-y-3">
        <button
          onClick={onCreateSkills}
          className="btn-primary w-full py-4"
        >
          Build My Skills →
        </button>
        <button
          onClick={onSkipForNow}
          className="btn-secondary w-full"
        >
          I'll Add Skills Later
        </button>
      </div>

      <p className="text-kayfabe-gray-medium text-xs text-center italic">
        Every championship has a midcard origin story. Tell yours.
      </p>
    </div>
  );
};
