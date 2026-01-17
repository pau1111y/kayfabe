import React, { useState } from 'react';

interface DarkMatchFlowProps {
  onComplete: () => void;
  onCancel: () => void;
}

export const DarkMatchFlow: React.FC<DarkMatchFlowProps> = ({ onComplete, onCancel }) => {
  const [content, setContent] = useState('');
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = () => {
    if (!content.trim()) return;

    // Show success message
    setIsDone(true);

    // Auto-close after 2 seconds
    setTimeout(() => {
      onComplete();
    }, 2000);
  };

  if (isDone) {
    return (
      <div className="card text-center space-y-4">
        <h3 className="heading-2 text-kayfabe-gold">Released Into the Void</h3>
        <p className="text-kayfabe-gray-light">
          Sometimes you just need to let it out.<br />
          Nothing was saved. You're good.
        </p>
      </div>
    );
  }

  return (
    <div className="card space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="heading-2">Dark Match</h3>
        <button onClick={onCancel} className="text-kayfabe-gray-light hover:text-kayfabe-cream">
          ✕
        </button>
      </div>

      <div className="bg-kayfabe-gray-dark/30 p-3 rounded border border-kayfabe-gray-dark">
        <p className="text-kayfabe-gray-light text-sm">
          ⚠️ This is a safe space to vent. Nothing you write here will be saved.
          When you're done, it disappears forever.
        </p>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Let it all out. This won't be saved..."
        className="input-field min-h-48"
        autoFocus
      />

      <div className="flex space-x-2">
        <button onClick={handleSubmit} className="btn-primary flex-1">
          Release It
        </button>
        <button onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </div>
  );
};
