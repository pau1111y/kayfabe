import React, { useState } from 'react';
import type { GoalTier } from '../../types';

interface GoalFormProps {
  onSubmit: (title: string, tier: GoalTier) => void;
  onCancel: () => void;
}

export const GoalForm: React.FC<GoalFormProps> = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [step, setStep] = useState<'intro' | 'input'>('intro');

  const handleSubmit = () => {
    if (title.trim()) {
      onSubmit(title.trim(), 'main');
    }
  };

  // Intro screen with guidance
  if (step === 'intro') {
    return (
      <div className="card space-y-6">
        <div className="text-center">
          <span className="text-4xl">⭐</span>
          <h3 className="heading-1 mt-2">Main Event</h3>
          <p className="text-kayfabe-gray-light text-sm mt-2">
            A monumental achievement worth dedicating your time to
          </p>
        </div>

        <div className="space-y-4 text-sm">
          <div className="bg-kayfabe-gray-dark p-4 rounded">
            <p className="text-kayfabe-gold font-bold mb-2">This is NOT a task list item.</p>
            <p className="text-kayfabe-gray-light">
              Main Events are championships you're earning through daily dedication.
              Things you'll look back on and say "I did that."
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-kayfabe-cream font-bold">Good Main Events:</p>
            <ul className="text-kayfabe-gray-light space-y-2 pl-4">
              <li>• Launch my podcast</li>
              <li>• Write my novel</li>
              <li>• Get promoted to senior engineer</li>
              <li>• Run a marathon</li>
              <li>• Learn to speak Spanish fluently</li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-kayfabe-cream font-bold">NOT Main Events:</p>
            <ul className="text-kayfabe-gray-medium space-y-2 pl-4">
              <li>• Clean my room <span className="text-kayfabe-gray-dark">(that's a segment)</span></li>
              <li>• Reply to emails <span className="text-kayfabe-gray-dark">(that's a segment)</span></li>
              <li>• Go to the gym <span className="text-kayfabe-gray-dark">(that's a segment serving a Main Event)</span></li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <p className="text-kayfabe-gold text-xs italic mb-4">
            Your segments will build toward this. Every hour you book is a step closer.
          </p>
        </div>

        <div className="flex space-x-3">
          <button onClick={onCancel} className="btn-secondary flex-1">
            Cancel
          </button>
          <button
            onClick={() => setStep('input')}
            className="btn-primary flex-1"
          >
            I'm Ready
          </button>
        </div>
      </div>
    );
  }

  // Input screen
  return (
    <div className="card space-y-6">
      <div className="text-center">
        <span className="text-4xl">⭐</span>
        <h3 className="heading-2 mt-2">Name Your Main Event</h3>
        <p className="text-kayfabe-gray-light text-sm mt-1">
          What monumental thing are you working toward?
        </p>
      </div>

      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Launch my podcast"
          className="input-field text-lg"
          autoFocus
        />
        <p className="text-kayfabe-gray-medium text-xs mt-2 text-center">
          Make it specific. Make it meaningful. Make it yours.
        </p>
      </div>

      <div className="flex space-x-3">
        <button onClick={() => setStep('intro')} className="btn-secondary flex-1">
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!title.trim()}
          className={`btn-primary flex-1 ${!title.trim() ? 'opacity-50' : ''}`}
        >
          Add Main Event
        </button>
      </div>
    </div>
  );
};
