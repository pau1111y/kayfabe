import React from 'react';
import type { Avatar } from '../../types';

interface AvatarGridProps {
  availableAvatars: Avatar[];
  selectedAvatarId: string;
  onSelect: (avatarId: string) => void;
}

export const AvatarGrid: React.FC<AvatarGridProps> = ({
  availableAvatars,
  selectedAvatarId,
  onSelect,
}) => {
  return (
    <div className="grid grid-cols-4 gap-3">
      {availableAvatars.map(avatar => {
        const isSelected = selectedAvatarId === avatar.id;

        return (
          <button
            key={avatar.id}
            onClick={() => onSelect(avatar.id)}
            className={`p-4 border text-center transition-all ${
              isSelected
                ? 'border-kayfabe-gold bg-kayfabe-gold/10'
                : 'border-kayfabe-gray-dark hover:border-kayfabe-gray-medium'
            }`}
            title={avatar.description}
          >
            <div className="w-16 h-16 mx-auto mb-2">
              <img src={avatar.svgPath} alt={avatar.name} className="w-full h-full" />
            </div>
            <div className="text-xs text-kayfabe-gray-light truncate">
              {avatar.name}
            </div>
          </button>
        );
      })}
    </div>
  );
};
