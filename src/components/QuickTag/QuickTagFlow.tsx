import React, { useState } from 'react';
import type { QuickTag } from '../../types';

interface QuickTagFlowProps {
  onComplete: (tag: QuickTag) => void;
  onCancel: () => void;
}

export const QuickTagFlow: React.FC<QuickTagFlowProps> = ({ onComplete, onCancel }) => {
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    if (!note.trim()) return;

    const tag: QuickTag = {
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
        <h3 className="heading-2">Quick Tag</h3>
        <button onClick={onCancel} className="text-kayfabe-gray-light hover:text-kayfabe-cream">
          ✕
        </button>
      </div>

      <p className="text-kayfabe-gray-light text-sm">
        Tag something worth expanding on later. Keep it brief.
      </p>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Something interesting just happened..."
        className="input-field min-h-24"
        autoFocus
      />

      <div className="flex space-x-2">
        <button onClick={handleSubmit} className="btn-primary flex-1">
          Tag It
        </button>
        <button onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </div>
  );
};
