import React, { useState } from 'react';
import type { GoalTier } from '../../types';

interface GoalFormProps {
  onSubmit: (title: string, tier: GoalTier) => void;
  onCancel: () => void;
}

const tierOptions: { value: GoalTier; label: string; description: string }[] = [
  { value: 'main', label: 'Main Event ⭐', description: 'Major goals, big projects' },
  { value: 'midcard', label: 'Midcard', description: 'Ongoing work, skill building' },
  { value: 'opening', label: 'Opening Contest', description: 'Daily habits, routine builders' },
];

export const GoalForm: React.FC<GoalFormProps> = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [tier, setTier] = useState<GoalTier>('main');

  const handleSubmit = () => {
    if (title.trim()) {
      onSubmit(title.trim(), tier);
    }
  };

  return (
    <div className="card space-y-6">
      <h3 className="heading-2 text-center">New Storyline</h3>

      <div>
        <label className="text-kayfabe-gray-light text-sm block mb-2">
          What's the storyline?
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Launch my podcast, Learn Spanish, Get promoted"
          className="input-field"
          autoFocus
        />
      </div>

      <div>
        <label className="text-kayfabe-gray-light text-sm block mb-3">
          Where does it go on the card?
        </label>
        <div className="space-y-2">
          {tierOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setTier(option.value)}
              className={`w-full p-4 border text-left transition-colors ${
                tier === option.value
                  ? 'border-kayfabe-gold text-kayfabe-cream'
                  : 'border-kayfabe-gray-dark text-kayfabe-gray-light hover:border-kayfabe-gray-medium'
              }`}
            >
              <p className="font-bold uppercase tracking-wider text-sm">{option.label}</p>
              <p className="text-xs mt-1 opacity-75">{option.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex space-x-3">
        <button onClick={onCancel} className="btn-secondary flex-1">
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!title.trim()}
          className={`btn-primary flex-1 ${!title.trim() ? 'opacity-50' : ''}`}
        >
          Add Storyline
        </button>
      </div>
    </div>
  );
};
