import React, { useState } from 'react';
import type { HotTag } from '../../types';

interface HotTagFlowProps {
  onComplete: (tag: HotTag) => void;
  onCancel: () => void;
}

export const HotTagFlow: React.FC<HotTagFlowProps> = ({ onComplete, onCancel }) => {
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    if (!note.trim()) return;

    const tag: HotTag = {
      id: crypto.randomUUID(),
      note: note.trim(),
      createdAt: Date.now(),
      dismissed: false,
    };

    onComplete(tag);
  };

  return (
    <div className="card space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="heading-2">🔥 Hot Tag</h3>
        <button onClick={onCancel} className="text-kayfabe-gray-light hover:text-kayfabe-cream">
          ✕
        </button>
      </div>

      <p className="text-kayfabe-gray-light text-sm">
        Tag yourself in. Make the save later.
      </p>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="What just happened? Your future self will make the save..."
        className="input-field min-h-24"
        autoFocus
      />

      <div className="flex space-x-2">
        <button onClick={handleSubmit} className="btn-primary flex-1">
          🔥 Hot Tag!
        </button>
        <button onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </div>
  );
};
