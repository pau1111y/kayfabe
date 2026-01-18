import React, { useState } from 'react';
import type { Goal, Promo, HotTag, RunIn, TimeBlock } from '../../types';
import { GoalCompletion } from './GoalCompletion';

interface MainEventGoalPageProps {
  goal: Goal;
  promos: Promo[];
  hotTags: HotTag[];
  runIns: RunIn[];
  timeBlocks?: TimeBlock[];
  onComplete: (victoryPromo: string) => void;
  onBack: () => void;
}

export const MainEventGoalPage: React.FC<MainEventGoalPageProps> = ({
  goal,
  promos,
  hotTags,
  runIns,
  timeBlocks = [],
  onComplete,
  onBack,
}) => {
  const [showCompletion, setShowCompletion] = useState(false);

  // Filter content related to this goal
  const relatedPromos = promos.filter(p => p.storylineId === goal.id);
  const relatedHotTags = hotTags.filter(ht => !ht.dismissed); // All active hot tags could be relevant
  const relatedRunIns = runIns; // RunIn doesn't have dismissed property

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (showCompletion) {
    return (
      <div className="min-h-screen bg-kayfabe-black p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <GoalCompletion
            goal={goal}
            promos={promos}
            hotTags={hotTags}
            runIns={runIns}
            timeBlocks={timeBlocks}
            onComplete={(victoryPromo) => {
              setShowCompletion(false);
              onComplete(victoryPromo);
            }}
            onCancel={() => setShowCompletion(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kayfabe-black">
      {/* Hero Banner with Championship Photo */}
      <div className="relative h-64 overflow-hidden">
        <img
          src="/photos/main event/E402E48B-77B4-4418-88C4-4F380146F02B_1_105_c.jpeg"
          alt="Main Event Championship"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-kayfabe-black via-kayfabe-black/50 to-transparent" />

        {/* Goal Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <button
            onClick={onBack}
            className="text-kayfabe-gray-light hover:text-kayfabe-cream mb-4 flex items-center gap-2 text-sm"
          >
            ← Back to Card
          </button>
          <div className="flex items-start gap-4">
            <span className="text-6xl">👑</span>
            <div className="flex-1">
              <p className="text-kayfabe-gold text-xs uppercase tracking-wider mb-2">Main Event</p>
              <h1 className="heading-1 text-kayfabe-gold mb-2">{goal.title}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Journey Content */}
      <div className="max-w-2xl mx-auto p-6 space-y-8">
        {/* Journey Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="card text-center">
            <p className="text-3xl font-bold text-kayfabe-gold">{relatedPromos.length}</p>
            <p className="text-kayfabe-gray-light text-xs mt-1">Promos Cut</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-bold text-kayfabe-cream">{relatedHotTags.length}</p>
            <p className="text-kayfabe-gray-light text-xs mt-1">Hot Tags</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-bold text-kayfabe-red">{relatedRunIns.length}</p>
            <p className="text-kayfabe-gray-light text-xs mt-1">Run-Ins</p>
          </div>
        </div>

        {/* Journey Timeline */}
        <div className="space-y-6">
          <h2 className="heading-2 text-center">The Journey</h2>

          {relatedPromos.length === 0 && relatedHotTags.length === 0 && relatedRunIns.length === 0 ? (
            <div className="card text-center py-8">
              <p className="text-kayfabe-gray-light text-sm">
                Your journey begins now. Cut a promo to start building momentum.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Promos */}
              {relatedPromos.map((promo) => (
                <div key={promo.id} className="card border-l-4 border-kayfabe-gold">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🎤</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-xs font-bold uppercase ${
                          promo.type === 'face' ? 'text-kayfabe-gold' : 'text-kayfabe-red'
                        }`}>
                          {promo.type === 'face' ? 'Face Promo' : 'Heel Promo'}
                        </span>
                        <span className="text-kayfabe-gray-light text-xs">
                          {formatDate(promo.createdAt)}
                        </span>
                      </div>
                      <p className="text-kayfabe-cream text-sm whitespace-pre-wrap">
                        {promo.content}
                      </p>
                      {promo.faceFollowUp && (
                        <div className="mt-3 pl-4 border-l-2 border-kayfabe-gray-dark">
                          <p className="text-kayfabe-gold text-xs font-bold mb-1">FACE FOLLOW-UP</p>
                          <p className="text-kayfabe-cream text-sm whitespace-pre-wrap">
                            {promo.faceFollowUp}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Hot Tags */}
              {relatedHotTags.map((hotTag) => (
                <div key={hotTag.id} className="card border-l-4 border-orange-500">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🔥</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold uppercase text-orange-500">
                          Hot Tag
                        </span>
                        <span className="text-kayfabe-gray-light text-xs">
                          {formatDate(hotTag.createdAt)}
                        </span>
                      </div>
                      <p className="text-kayfabe-cream text-sm">
                        {hotTag.note}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Run-Ins */}
              {relatedRunIns.map((runIn) => (
                <div key={runIn.id} className="card border-l-4 border-kayfabe-red">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚡</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-xs font-bold uppercase text-kayfabe-red block">
                            Run-In: {runIn.name}
                          </span>
                          <span className="text-kayfabe-gray-medium text-xs">
                            {runIn.role}
                          </span>
                        </div>
                        <span className="text-kayfabe-gray-light text-xs">
                          {formatDate(runIn.firstEncounter)}
                        </span>
                      </div>
                      <p className="text-kayfabe-cream text-sm">
                        {runIn.notes}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Complete Goal Button */}
        <div className="main-event-card text-center py-8">
          <p className="text-kayfabe-gray-light text-sm mb-4">
            Ready to claim this championship?
          </p>
          <button
            onClick={() => setShowCompletion(true)}
            className="btn-primary text-lg px-8 py-4"
          >
            👑 Complete Main Event
          </button>
        </div>
      </div>
    </div>
  );
};
