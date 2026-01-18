import React, { useState } from 'react';
import type { HotTag } from '../../types';

interface HotTagFlowProps {
  onComplete: (tag: HotTag) => void;
  onCancel: () => void;
}

export const HotTagFlow: React.FC<HotTagFlowProps> = ({ onComplete, onCancel }) => {
  const [note, setNote] = useState('');
  const [characterType, setCharacterType] = useState<'face' | 'heel' | null>(null);

  const handleSubmit = () => {
    if (!note.trim() || !characterType) return;

    const tag: HotTag = {
      id: crypto.randomUUID(),
      note: note.trim(),
      characterType,
      createdAt: Date.now(),
      dismissed: false,
    };

    onComplete(tag);
  };

  return (
    <div className="card space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="heading-2">🔥 Hot Tag</h3>
        <button onClick={onCancel} className="text-kayfabe-gray-light hover:text-kayfabe-cream">
          ✕
        </button>
      </div>

      <div className="space-y-2">
        <p className="text-kayfabe-cream font-bold">Who made the save?</p>
        <p className="text-kayfabe-gray-light text-sm">
          These moments build your story. Recognize the choices that got you here.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setCharacterType('face')}
          className={`p-4 rounded border-2 transition-all ${
            characterType === 'face'
              ? 'border-kayfabe-gold bg-kayfabe-gold/10 text-kayfabe-gold'
              : 'border-kayfabe-gray-dark text-kayfabe-gray-light hover:border-kayfabe-gray-medium'
          }`}
        >
          <div className="text-4xl mb-2">😇</div>
          <div className="font-bold">Face</div>
          <div className="text-xs mt-1 opacity-80">
            Kindness, boundaries, getting up when you wanted to stay down
          </div>
        </button>
        <button
          onClick={() => setCharacterType('heel')}
          className={`p-4 rounded border-2 transition-all ${
            characterType === 'heel'
              ? 'border-kayfabe-red bg-kayfabe-red/10 text-kayfabe-red'
              : 'border-kayfabe-gray-dark text-kayfabe-gray-light hover:border-kayfabe-gray-medium'
          }`}
        >
          <div className="text-4xl mb-2">😈</div>
          <div className="font-bold">Heel</div>
          <div className="text-xs mt-1 opacity-80">
            Lit a fire, pushed harder, chose the funkier tshirt
          </div>
        </button>
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="What just happened? How did this moment build your skills?"
        className="input-field min-h-24"
        autoFocus
      />

      <div className="flex space-x-2">
        <button
          onClick={handleSubmit}
          className={`btn-primary flex-1 ${(!note.trim() || !characterType) ? 'opacity-50' : ''}`}
          disabled={!note.trim() || !characterType}
        >
          🔥 Hot Tag!
        </button>
        <button onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </div>
  );
};
