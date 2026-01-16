import React, { useState } from 'react';
import { PromoType } from '../../types';
import { Button } from '../Shared/Button';

interface PromoEditorProps {
  type: PromoType;
  prompt: string | null;
  onSubmit: (content: string) => void;
  onCancel: () => void;
}

export const PromoEditor: React.FC<PromoEditorProps> = ({
  type,
  prompt,
  onSubmit,
  onCancel,
}) => {
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content.trim());
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <span className={`text-sm uppercase tracking-wider ${
          type === 'face' ? 'text-kayfabe-gold' : 'text-kayfabe-red'
        }`}>
          {type} Promo {prompt ? '' : '(Freestyle)'}
        </span>
      </div>

      {prompt && (
        <div className="border-l-2 border-kayfabe-gray-medium pl-4">
          <p className="text-kayfabe-gray-light italic">"{prompt}"</p>
        </div>
      )}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={prompt ? "Respond to the prompt..." : "What's on your mind?"}
        className="input-field min-h-[200px] resize-none"
        autoFocus
      />

      <div className="flex space-x-3">
        <button onClick={onCancel} className="btn-secondary flex-1">
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!content.trim()}
          className={`btn-primary flex-1 ${!content.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Submit Promo
        </button>
      </div>
    </div>
  );
};
