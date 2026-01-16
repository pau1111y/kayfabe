import React, { useState } from 'react';

interface TheBigOneProps {
  bigOne: {
    description: string;
    percentage: number;
    createdAt: number;
  } | null;
  onUpdate: (description: string, percentage: number) => void;
  onComplete: () => void;
}

export const TheBigOne: React.FC<TheBigOneProps> = ({ bigOne, onUpdate, onComplete }) => {
  const [isEditing, setIsEditing] = useState(!bigOne);
  const [description, setDescription] = useState(bigOne?.description || '');
  const [percentage, setPercentage] = useState(bigOne?.percentage || 0);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSave = () => {
    if (description.trim()) {
      onUpdate(description.trim(), percentage);
      setIsEditing(false);
    }
  };

  const handleSliderChange = (value: number) => {
    setPercentage(value);
    if (value === 100) {
      setShowConfirm(true);
    }
  };

  const handleConfirmComplete = () => {
    onComplete();
    setShowConfirm(false);
  };

  if (showConfirm) {
    return (
      <div className="card text-center space-y-6">
        <h3 className="heading-1">Are You Sure?</h3>
        <p className="text-kayfabe-gray-light">
          This ends the current game.<br />
          Your journey will be archived.<br />
          Your legacy preserved.
        </p>
        <p className="text-kayfabe-red">There's no undoing this.</p>
        <div className="flex space-x-4">
          <button
            onClick={() => {
              setShowConfirm(false);
              setPercentage(99);
            }}
            className="btn-secondary flex-1"
          >
            Not Yet
          </button>
          <button onClick={handleConfirmComplete} className="btn-primary flex-1">
            Yes, I've Won
          </button>
        </div>
      </div>
    );
  }

  if (isEditing || !bigOne) {
    return (
      <div className="card space-y-6">
        <div className="text-center">
          <h3 className="heading-2 mb-2">The Big One</h3>
          <p className="text-kayfabe-gray-light text-sm">
            What's your Wrestlemania moment?
          </p>
        </div>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your ultimate dream. The confetti. The pyro. The thing you want most."
          className="input-field min-h-[120px] resize-none"
        />

        <div>
          <label className="text-kayfabe-gray-light text-sm block mb-2">
            How close does it feel? ({percentage}%)
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={percentage}
            onChange={(e) => setPercentage(Number(e.target.value))}
            className="w-full accent-kayfabe-gold"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={!description.trim()}
          className={`btn-primary w-full ${!description.trim() ? 'opacity-50' : ''}`}
        >
          Set The Big One
        </button>
      </div>
    );
  }

  return (
    <div className="card space-y-4">
      <div className="flex justify-between items-start">
        <h3 className="text-kayfabe-gold uppercase tracking-wider text-sm">The Big One</h3>
        <button
          onClick={() => setIsEditing(true)}
          className="text-kayfabe-gray-medium text-sm hover:text-kayfabe-cream"
        >
          Edit
        </button>
      </div>

      <p className="text-kayfabe-cream text-lg">"{bigOne.description}"</p>

      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-kayfabe-gray-light">Progress</span>
          <span className="text-kayfabe-gold font-bold">{bigOne.percentage}%</span>
        </div>
        <div className="h-2 bg-kayfabe-gray-dark rounded">
          <div
            className="h-full bg-kayfabe-gold rounded transition-all duration-300"
            style={{ width: `${bigOne.percentage}%` }}
          />
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={bigOne.percentage}
          onChange={(e) => handleSliderChange(Number(e.target.value))}
          className="w-full accent-kayfabe-gold mt-2"
        />
      </div>
    </div>
  );
};
