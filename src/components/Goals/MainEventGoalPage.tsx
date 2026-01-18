import React, { useState } from 'react';
import type { Goal, Promo, HotTag, RunIn, TimeBlock, TimeBlockPromo } from '../../types';
import { GoalCompletion } from './GoalCompletion';

interface MainEventGoalPageProps {
  goal: Goal;
  promos: Promo[];
  hotTags: HotTag[];
  runIns: RunIn[];
  timeBlocks?: TimeBlock[];
  timeBlockPromos?: TimeBlockPromo[];
  onComplete: (victoryPromo: string) => void;
  onBack: () => void;
}

export const MainEventGoalPage: React.FC<MainEventGoalPageProps> = ({
  goal,
  promos,
  hotTags,
  runIns,
  timeBlocks = [],
  timeBlockPromos = [],
  onComplete,
  onBack,
}) => {
  const [showCompletion, setShowCompletion] = useState(false);
  const [activeTab, setActiveTab] = useState<'origin' | 'journey'>('origin');

  // Filter content related to this goal
  const relatedPromos = promos.filter(p => p.storylineId === goal.id);
  const relatedHotTags = hotTags.filter(ht => !ht.dismissed);
  const relatedRunIns = runIns.filter(r => r.linkedGoalId === goal.id);
  const linkedTimeBlocks = timeBlocks.filter(b => b.linkedGoalId === goal.id);
  const relatedTimeBlockPromos = timeBlockPromos.filter(p => p.linkedGoalId === goal.id);

  // Calculate origin story stats
  const totalMidcardHours = linkedTimeBlocks.reduce((sum, b) => sum + b.loggedHours, 0);
  const totalRunInHours = relatedRunIns.reduce((sum, r) => sum + (r.hoursContributed || 0), 0);
  const totalHours = totalMidcardHours + totalRunInHours;

  // Calculate Face/Heel ratio from time block promos
  const facePromos = relatedTimeBlockPromos.filter(p => p.type === 'face').length;
  const heelPromos = relatedTimeBlockPromos.filter(p => p.type === 'heel').length;
  const totalBlockPromos = facePromos + heelPromos;
  const facePercentage = totalBlockPromos > 0 ? Math.round((facePromos / totalBlockPromos) * 100) : 0;

  // Days since goal creation
  const daysSinceCreation = Math.floor((Date.now() - goal.createdAt) / (1000 * 60 * 60 * 24));

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
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-3">
          <div className="card text-center py-3">
            <p className="text-2xl font-bold text-kayfabe-gold">{daysSinceCreation}</p>
            <p className="text-kayfabe-gray-light text-xs mt-1">Days</p>
          </div>
          <div className="card text-center py-3">
            <p className="text-2xl font-bold text-kayfabe-cream">{Math.round(totalHours)}</p>
            <p className="text-kayfabe-gray-light text-xs mt-1">Hours</p>
          </div>
          <div className="card text-center py-3">
            <p className="text-2xl font-bold text-kayfabe-gold">{relatedPromos.length + totalBlockPromos}</p>
            <p className="text-kayfabe-gray-light text-xs mt-1">Promos</p>
          </div>
          <div className="card text-center py-3">
            <p className="text-2xl font-bold text-kayfabe-gold">{facePercentage}%</p>
            <p className="text-kayfabe-gray-light text-xs mt-1">Face</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-kayfabe-gray-dark">
          <button
            onClick={() => setActiveTab('origin')}
            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
              activeTab === 'origin'
                ? 'text-kayfabe-gold border-b-2 border-kayfabe-gold'
                : 'text-kayfabe-gray-medium hover:text-kayfabe-cream'
            }`}
          >
            Origin Story
          </button>
          <button
            onClick={() => setActiveTab('journey')}
            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
              activeTab === 'journey'
                ? 'text-kayfabe-gold border-b-2 border-kayfabe-gold'
                : 'text-kayfabe-gray-medium hover:text-kayfabe-cream'
            }`}
          >
            Journey Timeline
          </button>
        </div>

        {/* Origin Story Tab */}
        {activeTab === 'origin' && (
          <div className="space-y-6">
            {/* What Got You Here - Midcard Skills */}
            {linkedTimeBlocks.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-kayfabe-cream uppercase tracking-wider text-sm font-bold flex items-center gap-2">
                  <span>⏰</span> What Got You Here
                </h3>
                <div className="space-y-2">
                  {linkedTimeBlocks.map(block => {
                    const blockPromos = relatedTimeBlockPromos.filter(p => p.timeBlockId === block.id);
                    const blockFace = blockPromos.filter(p => p.type === 'face').length;
                    const blockHeel = blockPromos.filter(p => p.type === 'heel').length;

                    return (
                      <div key={block.id} className="card">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-kayfabe-gold">⭐</span>
                            <span className="text-kayfabe-cream font-bold">{block.name}</span>
                          </div>
                          <span className="text-kayfabe-gold font-bold">
                            {block.loggedHours.toFixed(1)}h
                          </span>
                        </div>
                        {blockPromos.length > 0 && (
                          <div className="flex items-center gap-4 text-xs text-kayfabe-gray-light">
                            <span>{blockPromos.length} promos</span>
                            <span className="text-kayfabe-gold">↑{blockFace} pop</span>
                            <span className="text-kayfabe-red">↓{blockHeel} heat</span>
                          </div>
                        )}
                        {/* Show latest promo snippet */}
                        {blockPromos.length > 0 && (
                          <p className="text-kayfabe-gray-medium text-xs mt-2 italic line-clamp-2">
                            "{blockPromos[blockPromos.length - 1].content}"
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Run-Ins That Shaped This Journey */}
            {relatedRunIns.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-kayfabe-cream uppercase tracking-wider text-sm font-bold flex items-center gap-2">
                  <span>⚡</span> Run-Ins That Shaped This Journey
                </h3>
                <div className="space-y-2">
                  {/* Group by type */}
                  {relatedRunIns.filter(r => r.type === 'person').length > 0 && (
                    <div className="space-y-2">
                      {relatedRunIns.filter(r => r.type === 'person').map(runIn => (
                        <div key={runIn.id} className="card border-l-4 border-kayfabe-red">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span>👤</span>
                              <span className="text-kayfabe-cream font-bold">{runIn.name}</span>
                            </div>
                            {runIn.hoursContributed > 0 && (
                              <span className="text-kayfabe-gold text-sm">
                                {runIn.hoursContributed}h
                              </span>
                            )}
                          </div>
                          <p className="text-kayfabe-gray-medium text-xs">{runIn.role}</p>
                          {runIn.entryPromo && (
                            <p className="text-kayfabe-gray-light text-xs mt-2 italic line-clamp-2">
                              "{runIn.entryPromo}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {relatedRunIns.filter(r => r.type === 'moment').length > 0 && (
                    <div className="space-y-2">
                      {relatedRunIns.filter(r => r.type === 'moment').map(runIn => (
                        <div key={runIn.id} className="card border-l-4 border-kayfabe-gold">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                              <span>✨</span>
                              <span className="text-kayfabe-cream font-bold">{runIn.momentTitle}</span>
                            </div>
                            {runIn.hoursContributed > 0 && (
                              <span className="text-kayfabe-gold text-sm">
                                {runIn.hoursContributed}h
                              </span>
                            )}
                          </div>
                          {runIn.entryPromo && (
                            <p className="text-kayfabe-gray-light text-xs mt-2 italic line-clamp-2">
                              "{runIn.entryPromo}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Empty State */}
            {linkedTimeBlocks.length === 0 && relatedRunIns.length === 0 && (
              <div className="card text-center py-8">
                <p className="text-kayfabe-gray-light text-sm">
                  Your origin story is waiting to be written.
                </p>
                <p className="text-kayfabe-gray-medium text-xs mt-2">
                  Link skill blocks in the Midcard, or log run-ins that contribute to this goal.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Journey Timeline Tab */}
        {activeTab === 'journey' && (
          <div className="space-y-4">
            {relatedPromos.length === 0 && relatedTimeBlockPromos.length === 0 && relatedHotTags.length === 0 ? (
              <div className="card text-center py-8">
                <p className="text-kayfabe-gray-light text-sm">
                  Your journey begins now. Cut a promo to start building momentum.
                </p>
              </div>
            ) : (
              <>
                {/* Combine and sort all timeline items */}
                {[
                  ...relatedPromos.map(p => ({ type: 'promo' as const, item: p, date: p.createdAt })),
                  ...relatedTimeBlockPromos.map(p => ({ type: 'blockPromo' as const, item: p, date: p.createdAt })),
                  ...relatedHotTags.map(ht => ({ type: 'hotTag' as const, item: ht, date: ht.createdAt })),
                ]
                  .sort((a, b) => b.date - a.date)
                  .map((entry) => {
                    if (entry.type === 'promo') {
                      const promo = entry.item as Promo;
                      return (
                        <div key={`promo-${promo.id}`} className="card border-l-4 border-kayfabe-gold">
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
                      );
                    }

                    if (entry.type === 'blockPromo') {
                      const blockPromo = entry.item as TimeBlockPromo;
                      return (
                        <div key={`block-${blockPromo.id}`} className={`card border-l-4 ${
                          blockPromo.type === 'face' ? 'border-kayfabe-gold' : 'border-kayfabe-red'
                        }`}>
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">⏰</span>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <span className={`text-xs font-bold uppercase ${
                                    blockPromo.type === 'face' ? 'text-kayfabe-gold' : 'text-kayfabe-red'
                                  }`}>
                                    {blockPromo.type === 'face' ? 'Face' : 'Heel'} - {blockPromo.timeBlockName}
                                  </span>
                                  <span className="text-kayfabe-gray-medium text-xs ml-2">
                                    ({blockPromo.actualHours.toFixed(1)}h worked)
                                  </span>
                                </div>
                                <span className="text-kayfabe-gray-light text-xs">
                                  {formatDate(blockPromo.createdAt)}
                                </span>
                              </div>
                              <p className="text-kayfabe-cream text-sm whitespace-pre-wrap">
                                {blockPromo.content}
                              </p>
                              {blockPromo.faceFollowUp && (
                                <div className="mt-3 pl-4 border-l-2 border-kayfabe-gray-dark">
                                  <p className="text-kayfabe-gold text-xs font-bold mb-1">REDEMPTION</p>
                                  <p className="text-kayfabe-cream text-sm whitespace-pre-wrap">
                                    {blockPromo.faceFollowUp}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    if (entry.type === 'hotTag') {
                      const hotTag = entry.item as HotTag;
                      return (
                        <div key={`hottag-${hotTag.id}`} className="card border-l-4 border-orange-500">
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
                      );
                    }

                    return null;
                  })}
              </>
            )}
          </div>
        )}

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
