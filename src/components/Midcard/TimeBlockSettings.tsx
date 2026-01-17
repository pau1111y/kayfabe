import React, { useState, useEffect } from 'react';
import type { TimeBlock, Goal } from '../../types';
import { TimeBlockItem } from './TimeBlockItem';
import { calculateElapsedHours } from '../../utils/timer';

interface TimeBlockSettingsProps {
  timeBlocks: TimeBlock[];
  goals: Goal[];
  onAddTimeBlock: (name: string, allocatedHours: number, isDaily: boolean, linkedGoalId: string | null) => void;
  onDeleteTimeBlock: (blockId: string) => void;
  onStartTimer: (blockId: string) => void;
  onStopTimer: (blockId: string, elapsedHours: number) => void;
  onManualLog: (blockId: string, hours: number) => void;
}

export const TimeBlockSettings: React.FC<TimeBlockSettingsProps> = ({
  timeBlocks,
  goals,
  onAddTimeBlock,
  onDeleteTimeBlock,
  onStartTimer,
  onStopTimer,
  onManualLog,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newHours, setNewHours] = useState('');
  const [newIsDaily, setNewIsDaily] = useState(true);
  const [newGoalId, setNewGoalId] = useState<string | null>(null);
  const [manualLogId, setManualLogId] = useState<string | null>(null);
  const [manualLogHours, setManualLogHours] = useState('');

  // Update timer display every second for running timers
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      if (timeBlocks.some(block => block.timerStartedAt !== null)) {
        setTick(t => t + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timeBlocks]);

  const handleAdd = () => {
    const hours = parseFloat(newHours);
    if (newName.trim() && !isNaN(hours) && hours > 0) {
      onAddTimeBlock(newName.trim(), hours, newIsDaily, newGoalId);
      setNewName('');
      setNewHours('');
      setNewIsDaily(true);
      setNewGoalId(null);
      setIsAdding(false);
    }
  };

  const handleTimerToggle = (block: TimeBlock) => {
    if (block.timerStartedAt) {
      const elapsed = calculateElapsedHours(block.timerStartedAt);
      onStopTimer(block.id, elapsed);
    } else {
      onStartTimer(block.id);
    }
  };

  const handleManualLog = (blockId: string) => {
    const hours = parseFloat(manualLogHours);
    if (!isNaN(hours) && hours > 0) {
      onManualLog(blockId, hours);
      setManualLogId(null);
      setManualLogHours('');
    }
  };

  const getRunningTime = (block: TimeBlock): string => {
    if (!block.timerStartedAt) return '';
    const elapsed = calculateElapsedHours(block.timerStartedAt);
    return ` (${elapsed.toFixed(2)}h)`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="heading-1 mb-2">⏰ Midcard Settings</h2>
        <p className="text-kayfabe-gray-light text-sm">Manage your time blocks</p>
      </div>

      {/* Add New Time Block */}
      {!isAdding ? (
        <button onClick={() => setIsAdding(true)} className="btn-primary w-full">
          + Add Time Block
        </button>
      ) : (
        <div className="card space-y-4">
          <h3 className="heading-2">New Time Block</h3>

          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Name (e.g., Work, Sleep, Meditation)"
            className="input-field"
            autoFocus
          />

          <input
            type="number"
            step="0.25"
            min="0"
            value={newHours}
            onChange={(e) => setNewHours(e.target.value)}
            placeholder="Allocated hours (e.g., 8)"
            className="input-field"
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isDaily"
              checked={newIsDaily}
              onChange={(e) => setNewIsDaily(e.target.checked)}
              className="accent-kayfabe-gold"
            />
            <label htmlFor="isDaily" className="text-kayfabe-cream text-sm">
              Resets daily at midnight
            </label>
          </div>

          {goals.filter(g => g.status === 'active' && g.tier === 'main').length > 0 && (
            <div>
              <label className="text-kayfabe-gray-light text-sm block mb-2">
                Link to Main Event Goal (optional)
              </label>
              <select
                value={newGoalId || ''}
                onChange={(e) => setNewGoalId(e.target.value || null)}
                className="input-field"
              >
                <option value="">None</option>
                {goals
                  .filter(g => g.status === 'active' && g.tier === 'main')
                  .map(goal => (
                    <option key={goal.id} value={goal.id}>
                      {goal.title}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <div className="flex space-x-3">
            <button onClick={() => setIsAdding(false)} className="btn-secondary flex-1">
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!newName.trim() || !newHours}
              className={`btn-primary flex-1 ${(!newName.trim() || !newHours) ? 'opacity-50' : ''}`}
            >
              Add
            </button>
          </div>
        </div>
      )}

      {/* Existing Time Blocks */}
      {timeBlocks.length > 0 && (
        <div className="space-y-4">
          <h3 className="heading-2">Your Time Blocks</h3>
          {timeBlocks.map(block => (
            <div key={block.id} className="card space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="text-kayfabe-cream font-bold">{block.name}</h4>
                  <p className="text-kayfabe-gray-light text-sm">
                    {block.allocatedHours}h allocated
                    {block.isDaily && ' • Resets daily'}
                  </p>
                  {block.linkedGoalId && (
                    <p className="text-kayfabe-gold text-xs mt-1">
                      → {goals.find(g => g.id === block.linkedGoalId)?.title}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => onDeleteTimeBlock(block.id)}
                  className="text-kayfabe-red text-sm hover:text-kayfabe-cream"
                >
                  Delete
                </button>
              </div>

              <TimeBlockItem
                block={block}
                onToggleComplete={() => {}}
                isMatchCard={false}
              />

              {/* Timer Controls */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleTimerToggle(block)}
                  className={`btn-secondary flex-1 text-sm ${
                    block.timerStartedAt ? 'bg-kayfabe-gold text-kayfabe-black' : ''
                  }`}
                >
                  {block.timerStartedAt
                    ? `⏹ Stop Timer${getRunningTime(block)}`
                    : '▶ Start Timer'}
                </button>
                <button
                  onClick={() => setManualLogId(block.id)}
                  className="btn-secondary flex-1 text-sm"
                >
                  📝 Manual Log
                </button>
              </div>

              {/* Manual Log Input */}
              {manualLogId === block.id && (
                <div className="flex space-x-2 pt-2 border-t border-kayfabe-gray-dark">
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    value={manualLogHours}
                    onChange={(e) => setManualLogHours(e.target.value)}
                    placeholder="Hours to add"
                    className="input-field flex-1"
                    autoFocus
                  />
                  <button
                    onClick={() => handleManualLog(block.id)}
                    disabled={!manualLogHours}
                    className={`btn-primary ${!manualLogHours ? 'opacity-50' : ''}`}
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setManualLogId(null);
                      setManualLogHours('');
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
