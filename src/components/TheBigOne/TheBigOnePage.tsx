import React from 'react';
import type { Promo, HotTag, RunIn } from '../../types';

interface TheBigOnePageProps {
  bigOne: {
    description: string;
    percentage: number;
    createdAt: number;
    updates: Array<{
      id: string;
      previousPercentage: number;
      newPercentage: number;
      promoId: string;
      timestamp: number;
    }>;
  };
  promos: Promo[];
  hotTags: HotTag[];
  runIns: RunIn[];
  onUpdateProgress: (newProgress: number) => void;
  onBack: () => void;
}

export const TheBigOnePage: React.FC<TheBigOnePageProps> = ({
  bigOne,
  promos,
  hotTags,
  runIns,
  onUpdateProgress,
  onBack,
}) => {
  const currentPercentage = Math.min(100, Math.max(0, bigOne.percentage));
  const milestones = [25, 50, 75, 100];
  const reachedMilestones = milestones.filter(m => currentPercentage >= m);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Sort updates by timestamp, most recent first
  const sortedUpdates = [...bigOne.updates].sort((a, b) => b.timestamp - a.timestamp);

  // All promos could be building toward The Big One
  const journeyPromos = promos.slice(-10); // Last 10 promos
  const activeHotTags = hotTags.filter(ht => !ht.dismissed);
  const activeRunIns = runIns; // RunIn doesn't have dismissed property

  return (
    <div className="min-h-screen bg-kayfabe-black">
      {/* Hero Banner with Arena Photo */}
      <div className="relative h-80 overflow-hidden">
        <img
          src="/photos/big one/37EF92E8-6347-4D02-BDBD-855492CC732E_1_105_c.jpeg"
          alt="The Big One Arena"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-kayfabe-black via-kayfabe-black/60 to-transparent" />

        {/* Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <button
            onClick={onBack}
            className="text-kayfabe-gray-light hover:text-kayfabe-cream mb-4 flex items-center gap-2 text-sm"
          >
            ← Back to Card
          </button>
          <div className="text-center">
            <p className="text-kayfabe-gold text-xs uppercase tracking-widest mb-2">
              Hall of Fame Career
            </p>
            <h1 className="text-4xl md:text-5xl font-display uppercase tracking-wider text-kayfabe-cream mb-3">
              The Big One
            </h1>
            <p className="text-kayfabe-cream/80 text-sm max-w-2xl mx-auto">
              {bigOne.description}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="max-w-2xl mx-auto p-6 space-y-8">
        {/* Championship Plates Progress */}
        <div className="big-one-banner relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-4 h-full">
              {milestones.map((milestone) => (
                <div
                  key={milestone}
                  className={`border-r border-kayfabe-cream/20 last:border-r-0 ${
                    currentPercentage >= milestone ? 'bg-kayfabe-cream/10' : ''
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="relative p-8 space-y-6">
            <div className="flex justify-between items-center mb-2">
              {milestones.map((milestone) => (
                <div key={milestone} className="text-center">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                    currentPercentage >= milestone
                      ? 'border-kayfabe-gold bg-kayfabe-gold text-kayfabe-black'
                      : 'border-kayfabe-gray-dark text-kayfabe-gray-dark'
                  }`}>
                    {currentPercentage >= milestone ? '✓' : ''}
                  </div>
                  <p className={`text-xs mt-1 ${
                    currentPercentage >= milestone ? 'text-kayfabe-gold' : 'text-kayfabe-gray-dark'
                  }`}>
                    {milestone}%
                  </p>
                </div>
              ))}
            </div>

            <div className="relative h-6 bg-kayfabe-black/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-kayfabe-cream via-kayfabe-gold to-kayfabe-cream transition-all duration-500"
                style={{ width: `${currentPercentage}%` }}
              />
            </div>

            <div className="text-center">
              <p className="text-6xl font-bold text-kayfabe-cream mb-2">
                {currentPercentage}%
              </p>
              <p className="text-kayfabe-gold text-sm">
                {reachedMilestones.length}/4 milestones reached
              </p>
              {currentPercentage === 100 && (
                <p className="text-kayfabe-gold text-lg font-bold mt-4 animate-pulse">
                  🏆 HALL OF FAME WORTHY 🏆
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Update Progress */}
        <div className="card space-y-4">
          <h2 className="heading-2 text-center">Update Your Progress</h2>
          <p className="text-kayfabe-gray-light text-sm text-center">
            This is the legendary story. How far have you come?
          </p>
          <div className="flex gap-3">
            {[10, 25, 50].map((increment) => (
              <button
                key={increment}
                onClick={() => {
                  const newProgress = Math.min(100, currentPercentage + increment);
                  onUpdateProgress(newProgress);
                }}
                disabled={currentPercentage >= 100}
                className="btn-secondary flex-1 disabled:opacity-30"
              >
                +{increment}%
              </button>
            ))}
          </div>
        </div>

        {/* Progress Updates Timeline */}
        <div className="space-y-4">
          <h2 className="heading-2 text-center">Progress Updates</h2>
          {sortedUpdates.length === 0 ? (
            <div className="card text-center py-8">
              <p className="text-kayfabe-gray-light text-sm">
                No updates yet. Every step forward is worth documenting.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedUpdates.map((update) => {
                const progressAdded = update.newPercentage - update.previousPercentage;
                return (
                  <div key={update.id} className="card border-l-4 border-kayfabe-gold">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-kayfabe-gold font-bold text-lg mb-1">
                          +{progressAdded}% → {update.newPercentage}%
                        </p>
                      </div>
                      <span className="text-kayfabe-gray-light text-xs">
                        {formatDate(update.timestamp)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Journey Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="card text-center">
            <p className="text-3xl font-bold text-kayfabe-gold">{journeyPromos.length}</p>
            <p className="text-kayfabe-gray-light text-xs mt-1">Recent Promos</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-bold text-orange-500">{activeHotTags.length}</p>
            <p className="text-kayfabe-gray-light text-xs mt-1">Hot Tags</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-bold text-kayfabe-red">{activeRunIns.length}</p>
            <p className="text-kayfabe-gray-light text-xs mt-1">Run-Ins</p>
          </div>
        </div>

        {/* Recent Journey Entries */}
        <div className="space-y-4">
          <h2 className="heading-2 text-center">The Journey</h2>
          <div className="space-y-3">
            {journeyPromos.slice(0, 5).map((promo) => (
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
                    <p className="text-kayfabe-cream text-sm line-clamp-3">
                      {promo.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {journeyPromos.length === 0 && (
            <div className="card text-center py-8">
              <p className="text-kayfabe-gray-light text-sm">
                Your journey begins with the first promo you cut.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
