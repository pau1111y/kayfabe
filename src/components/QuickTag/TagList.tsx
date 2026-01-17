import React, { useState } from 'react';
import type { QuickTag } from '../../types';

interface TagListProps {
  tags: QuickTag[];
  onExpand: (tagId: string) => void;
  onDismiss: (tagId: string) => void;
}

export const TagList: React.FC<TagListProps> = ({ tags, onExpand, onDismiss }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const pendingTags = tags.filter(t => !t.dismissed);

  if (pendingTags.length === 0) {
    return (
      <div className="card text-center text-kayfabe-gray-medium">
        No tags pending. Hit the tag button when something worth remembering happens.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {pendingTags.map(tag => (
        <div key={tag.id} className="card">
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
                onClick={() => onExpand(tag.id)}
                className="text-kayfabe-gold hover:text-kayfabe-cream text-sm"
              >
                Expand
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
