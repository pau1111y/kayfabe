import React, { useState } from 'react';
import type { RunIn } from '../../types';

interface RunInFlowProps {
  onComplete: (runIn: RunIn) => void;
  onCancel: () => void;
}

export const RunInFlow: React.FC<RunInFlowProps> = ({ onComplete, onCancel }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) return;

    const runIn: RunIn = {
      id: crypto.randomUUID(),
      name: name.trim(),
      role: role.trim() || 'Unknown',
      notes: notes.trim(),
      firstEncounter: Date.now(),
      lastUpdate: Date.now(),
    };

    onComplete(runIn);
  };

  return (
    <div className="card space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="heading-2">Document a Run-In</h3>
        <button onClick={onCancel} className="text-kayfabe-gray-light hover:text-kayfabe-cream">
          ✕
        </button>
      </div>

      <p className="text-kayfabe-gray-light text-sm">
        Who showed up in your storyline today?
      </p>

      <div className="space-y-3">
        <div>
          <label className="block text-kayfabe-gray-light text-sm mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Who are they?"
            className="input-field"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-kayfabe-gray-light text-sm mb-1">Role</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="How do they fit in? (optional)"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-kayfabe-gray-light text-sm mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What happened? (optional)"
            className="input-field min-h-24"
          />
        </div>
      </div>

      <div className="flex space-x-2">
        <button onClick={handleSubmit} className="btn-primary flex-1">
          Save Run-In
        </button>
        <button onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </div>
  );
};
