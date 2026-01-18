import React, { useState } from 'react';
import type { HotTag } from '../../types';

interface HotTagListProps {
  tags: HotTag[];
  onMakeTheSave: (tagId: string) => void;
  onDismiss: (tagId: string) => void;
}

export const HotTagList: React.FC<HotTagListProps> = ({ tags, onMakeTheSave, onDismiss }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const pendingTags = tags.filter(t => !t.dismissed);

  if (pendingTags.length === 0) {
    return (
      <div className="card text-center text-kayfabe-gray-medium">
        <p className="mb-2">🔥 No hot tags waiting.</p>
        <p className="text-sm">Tag yourself in when something big happens.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-kayfabe-gold text-sm font-bold mb-3">
        🔥 {pendingTags.length} Hot Tag{pendingTags.length !== 1 ? 's' : ''} waiting for you to make the save
      </p>
      {pendingTags.map(tag => (
        <div key={tag.id} className="card border-kayfabe-gold/30">
          <div className="flex justify-between items-start">
            <button
              onClick={() => setExpandedId(expandedId === tag.id ? null : tag.id)}
              className="flex-1 text-left text-kayfabe-cream"
            >
              <p className={expandedId === tag.id ? '' : 'truncate'}>{tag.note}</p>
              <p className="text-xs text-kayfabe-gray-medium mt-1">
                {new Date(tag.createdAt).toLocaleDateString()}
              </p>
            </button>
            <div className="flex space-x-2 ml-4">
              <button
                onClick={() => onMakeTheSave(tag.id)}
                className="text-kayfabe-gold hover:text-kayfabe-cream text-sm font-bold"
              >
                Make the Save
              </button>
              <button
                onClick={() => onDismiss(tag.id)}
                className="text-kayfabe-gray-medium hover:text-kayfabe-red text-sm"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
