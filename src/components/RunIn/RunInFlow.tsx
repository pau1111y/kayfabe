import React, { useState } from 'react';
import type { RunIn, RunInType, Goal, Impact } from '../../types';

interface RunInFlowProps {
  goals: Goal[];
  onComplete: (runIn: RunIn) => void;
  onCancel: () => void;
}

export const RunInFlow: React.FC<RunInFlowProps> = ({ goals, onComplete, onCancel }) => {
  const [step, setStep] = useState<'type' | 'details' | 'promo'>('type');
  const [runInType, setRunInType] = useState<RunInType | null>(null);

  // Person fields
  const [name, setName] = useState('');
  const [role, setRole] = useState('');

  // Moment fields
  const [momentTitle, setMomentTitle] = useState('');

  // Shared fields
  const [notes, setNotes] = useState('');
  const [linkedGoalId, setLinkedGoalId] = useState<string | null>(null);
  const [hoursContributed, setHoursContributed] = useState('');

  // Promo fields
  const [entryPromo, setEntryPromo] = useState('');
  const [impact, setImpact] = useState<Impact>('pop');

  const mainEventGoals = goals.filter(g => g.tier === 'main' && g.status === 'active');

  const handleSelectType = (type: RunInType) => {
    setRunInType(type);
    setStep('details');
  };

  const handleDetailsNext = () => {
    if (runInType === 'person' && !name.trim()) return;
    if (runInType === 'moment' && !momentTitle.trim()) return;
    setStep('promo');
  };

  const handleSubmit = () => {
    if (!entryPromo.trim()) return;

    const runIn: RunIn = {
      id: crypto.randomUUID(),
      type: runInType || 'person',
      // Person fields
      name: runInType === 'person' ? name.trim() : '',
      role: runInType === 'person' ? (role.trim() || 'Unexpected ally') : '',
      // Moment fields
      momentTitle: runInType === 'moment' ? momentTitle.trim() : null,
      // Shared fields
      notes: notes.trim(),
      linkedGoalId,
      hoursContributed: parseFloat(hoursContributed) || 0,
      firstEncounter: Date.now(),
      lastUpdate: Date.now(),
      // Promo fields
      entryPromo: entryPromo.trim(),
      impact,
    };

    onComplete(runIn);
  };

  // Step 1: Choose type
  if (step === 'type') {
    return (
      <div className="card space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="heading-2">Log a Run-In</h3>
          <button onClick={onCancel} className="text-kayfabe-gray-light hover:text-kayfabe-cream">
            ✕
          </button>
        </div>

        <p className="text-kayfabe-gray-light text-sm">
          Something unexpected contributed to your journey. What was it?
        </p>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleSelectType('person')}
            className="card hover:border-kayfabe-gold transition-all text-center py-6"
          >
            <span className="text-4xl">👤</span>
            <p className="text-kayfabe-gold font-bold mt-2">Person</p>
            <p className="text-kayfabe-gray-light text-xs mt-1">
              Someone who showed up
            </p>
          </button>
          <button
            onClick={() => handleSelectType('moment')}
            className="card hover:border-kayfabe-gold transition-all text-center py-6"
          >
            <span className="text-4xl">✨</span>
            <p className="text-kayfabe-gold font-bold mt-2">Moment</p>
            <p className="text-kayfabe-gray-light text-xs mt-1">
              An unexpected spark
            </p>
          </button>
        </div>
      </div>
    );
  }

  // Step 2: Details
  if (step === 'details') {
    return (
      <div className="card space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="heading-2">
            {runInType === 'person' ? '👤 Person Run-In' : '✨ Moment Run-In'}
          </h3>
          <button onClick={onCancel} className="text-kayfabe-gray-light hover:text-kayfabe-cream">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {runInType === 'person' ? (
            <>
              <div>
                <label className="block text-kayfabe-gray-light text-sm mb-1">Who made the run-in?</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  className="input-field"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-kayfabe-gray-light text-sm mb-1">Their role in your story</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g., Unexpected muse, Accountability partner"
                  className="input-field"
                />
              </div>
            </>
          ) : (
            <div>
              <label className="block text-kayfabe-gray-light text-sm mb-1">What was this moment?</label>
              <input
                type="text"
                value={momentTitle}
                onChange={(e) => setMomentTitle(e.target.value)}
                placeholder="e.g., Coffee shop epiphany, Museum visit spark"
                className="input-field"
                autoFocus
              />
            </div>
          )}

          <div>
            <label className="block text-kayfabe-gray-light text-sm mb-1">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What happened? Context for later..."
              className="input-field min-h-20"
            />
          </div>

          {mainEventGoals.length > 0 && (
            <div>
              <label className="block text-kayfabe-gold text-sm mb-1 font-bold">
                Link to Main Event
              </label>
              <select
                value={linkedGoalId || ''}
                onChange={(e) => setLinkedGoalId(e.target.value || null)}
                className="input-field"
              >
                <option value="">General contribution</option>
                {mainEventGoals.map(goal => (
                  <option key={goal.id} value={goal.id}>
                    ⭐ {goal.title}
                  </option>
                ))}
              </select>
              <p className="text-kayfabe-gray-medium text-xs mt-1">
                This run-in will appear in your origin story
              </p>
            </div>
          )}

          <div>
            <label className="block text-kayfabe-gray-light text-sm mb-1">
              Hours to credit (optional)
            </label>
            <input
              type="number"
              step="0.25"
              min="0"
              value={hoursContributed}
              onChange={(e) => setHoursContributed(e.target.value)}
              placeholder="0"
              className="input-field"
            />
            <p className="text-kayfabe-gray-medium text-xs mt-1">
              Time value of this contribution toward your goal
            </p>
          </div>
        </div>

        <div className="flex space-x-2">
          <button onClick={() => setStep('type')} className="btn-secondary flex-1">
            Back
          </button>
          <button
            onClick={handleDetailsNext}
            disabled={(runInType === 'person' && !name.trim()) || (runInType === 'moment' && !momentTitle.trim())}
            className={`btn-primary flex-1 ${
              ((runInType === 'person' && !name.trim()) || (runInType === 'moment' && !momentTitle.trim()))
                ? 'opacity-50'
                : ''
            }`}
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  // Step 3: Cut the promo
  if (step === 'promo') {
    const displayName = runInType === 'person' ? name : momentTitle;

    return (
      <div className="card space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="heading-2">🎤 Cut the Promo</h3>
          <button onClick={onCancel} className="text-kayfabe-gray-light hover:text-kayfabe-cream">
            ✕
          </button>
        </div>

        <div className="bg-kayfabe-gray-dark p-3 rounded">
          <p className="text-kayfabe-cream font-bold">
            {runInType === 'person' ? '👤' : '✨'} {displayName}
          </p>
          {linkedGoalId && (
            <p className="text-kayfabe-gold text-xs mt-1">
              → {mainEventGoals.find(g => g.id === linkedGoalId)?.title}
            </p>
          )}
          {parseFloat(hoursContributed) > 0 && (
            <p className="text-kayfabe-gray-light text-xs mt-1">
              {hoursContributed}h credited
            </p>
          )}
        </div>

        <div>
          <label className="block text-kayfabe-gray-light text-sm mb-1">
            Tell the story - what happened?
          </label>
          <textarea
            value={entryPromo}
            onChange={(e) => setEntryPromo(e.target.value)}
            placeholder={runInType === 'person'
              ? "How did they change your trajectory today?"
              : "What sparked? What shifted?"
            }
            className="input-field min-h-[120px]"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-kayfabe-gray-light text-sm mb-2">Impact</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setImpact('pop')}
              className={`p-3 rounded border transition-all ${
                impact === 'pop'
                  ? 'border-kayfabe-gold bg-kayfabe-gold/10 text-kayfabe-gold'
                  : 'border-kayfabe-gray-dark text-kayfabe-gray-light hover:border-kayfabe-gold'
              }`}
            >
              <span className="text-xl">↑</span>
              <p className="text-sm font-bold mt-1">Pop</p>
              <p className="text-xs opacity-70">Positive energy</p>
            </button>
            <button
              onClick={() => setImpact('heat')}
              className={`p-3 rounded border transition-all ${
                impact === 'heat'
                  ? 'border-kayfabe-red bg-kayfabe-red/10 text-kayfabe-red'
                  : 'border-kayfabe-gray-dark text-kayfabe-gray-light hover:border-kayfabe-red'
              }`}
            >
              <span className="text-xl">↓</span>
              <p className="text-sm font-bold mt-1">Heat</p>
              <p className="text-xs opacity-70">Challenging moment</p>
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center text-sm border-t border-kayfabe-gray-dark pt-3">
          <span className="text-kayfabe-gray-light">XP Earned:</span>
          <span className="text-kayfabe-gold font-bold">
            +{10 + (linkedGoalId ? 5 : 0)} XP
          </span>
        </div>

        <div className="flex space-x-2">
          <button onClick={() => setStep('details')} className="btn-secondary flex-1">
            Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={!entryPromo.trim()}
            className={`btn-primary flex-1 ${!entryPromo.trim() ? 'opacity-50' : ''}`}
          >
            ⚡ Add Run-In
          </button>
        </div>
      </div>
    );
  }

  return null;
};
