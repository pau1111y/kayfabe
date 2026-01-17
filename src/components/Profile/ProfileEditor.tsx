import React, { useState } from 'react';
import type { Avatar } from '../../types';
import { AvatarGrid } from './AvatarGrid';

interface ProfileEditorProps {
  currentRingName: string;
  currentEpithet: string;
  currentAvatarId: string;
  currentUserId: string;
  availableAvatars: Avatar[];
  onSave: (ringName: string, epithet: string, avatarId: string) => Promise<void>;
  onCancel: () => void;
  onCheckUniqueness: (ringName: string, epithet: string, excludeUserId: string) => Promise<boolean>;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({
  currentRingName,
  currentEpithet,
  currentAvatarId,
  currentUserId,
  availableAvatars,
  onSave,
  onCancel,
  onCheckUniqueness,
}) => {
  const [editedRingName, setEditedRingName] = useState(currentRingName);
  const [editedEpithet, setEditedEpithet] = useState(currentEpithet);
  const [editedAvatar, setEditedAvatar] = useState(currentAvatarId);
  const [uniquenessError, setUniquenessError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    // Validation
    if (!editedRingName.trim()) {
      return;
    }
    if (!editedEpithet.trim()) {
      return;
    }

    // Check uniqueness if name or epithet changed
    if (editedRingName !== currentRingName || editedEpithet !== currentEpithet) {
      const isUnique = await onCheckUniqueness(editedRingName.trim(), editedEpithet.trim(), currentUserId);
      if (!isUnique) {
        setUniquenessError('This wrestler already exists in the roster. Try a different epithet.');
        return;
      }
    }

    setIsSaving(true);
    try {
      await onSave(editedRingName.trim(), editedEpithet.trim(), editedAvatar);
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = editedRingName !== currentRingName ||
    editedEpithet !== currentEpithet ||
    editedAvatar !== currentAvatarId;

  return (
    <div className="card space-y-6">
      <h3 className="heading-2 text-center">Edit Your Profile</h3>

      {/* Wrestler Name */}
      <div>
        <label className="text-kayfabe-gray-light text-sm block mb-2">
          Wrestler Name
        </label>
        <input
          type="text"
          value={editedRingName}
          onChange={(e) => {
            setEditedRingName(e.target.value);
            setUniquenessError(null);
          }}
          className="input-field"
          maxLength={30}
          required
        />
      </div>

      {/* Epithet */}
      <div>
        <label className="text-kayfabe-gray-light text-sm block mb-2">
          Epithet (Required)
        </label>
        <input
          type="text"
          value={editedEpithet}
          onChange={(e) => {
            setEditedEpithet(e.target.value);
            setUniquenessError(null);
          }}
          placeholder="e.g., The People's Champion, The Heartbreak Kid"
          className="input-field"
          maxLength={50}
          required
        />
        {uniquenessError && (
          <p className="text-red-500 text-xs mt-1">{uniquenessError}</p>
        )}
        <p className="text-kayfabe-gray-medium text-xs mt-1">
          Your epithet makes your wrestler name unique
        </p>
      </div>

      {/* Avatar Selection */}
      <div>
        <label className="text-kayfabe-gray-light text-sm block mb-3">
          Avatar
        </label>
        <AvatarGrid
          availableAvatars={availableAvatars}
          selectedAvatarId={editedAvatar}
          onSelect={setEditedAvatar}
        />
      </div>

      {/* Actions */}
      <div className="flex space-x-3">
        <button onClick={onCancel} className="btn-secondary flex-1">
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!editedRingName.trim() || !editedEpithet.trim() || !hasChanges || isSaving}
          className={`btn-primary flex-1 ${(!editedRingName.trim() || !editedEpithet.trim() || !hasChanges || isSaving) ? 'opacity-50' : ''}`}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};
