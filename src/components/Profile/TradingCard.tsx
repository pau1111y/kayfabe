import React from 'react';
import { UserProfile, Promo, Goal, Belt } from '../../types';
import { getCurrentTitle, getNextTitle, getXPToNextTitle, getStreakMultiplier } from '../../utils/xp';

interface TradingCardProps {
  user: UserProfile;
  promos: Promo[];
  goals: Goal[];
  belts: Belt[];
}

export const TradingCard: React.FC<TradingCardProps> = ({ user, promos, goals, belts }) => {
  const currentTitle = getCurrentTitle(user.xp);
  const nextTitle = getNextTitle(user.xp);
  const xpToNext = getXPToNextTitle(user.xp);
  const multiplier = getStreakMultiplier(user.currentStreak);

  const totalPromos = promos.length;
  const facePromos = promos.filter(p => p.type === 'face').length;
  const facePercent = totalPromos > 0 ? Math.round((facePromos / totalPromos) * 100) : 0;

  const popPromos = promos.filter(p => p.impact === 'pop').length;
  const popRate = totalPromos > 0 ? Math.round((popPromos / totalPromos) * 100) : 0;

  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const earnedBelts = belts.filter(b => b.earnedAt !== null);

  return (
    <div className="card border-2 border-kayfabe-gray-medium">
      {/* Header */}
      <div className="text-center pb-4 border-b border-kayfabe-gray-dark">
        <div className="w-20 h-20 mx-auto mb-3 border-2 border-kayfabe-gray-medium rounded-full flex items-center justify-center text-4xl">
          🎭
        </div>
        <h2 className="text-2xl font-bold text-kayfabe-cream uppercase tracking-wider">
          {user.ringName}
        </h2>
        {user.epithet && (
          <p className="text-kayfabe-gold italic">"The {user.epithet}"</p>
        )}
        <p className="text-kayfabe-gray-light text-sm mt-2 uppercase tracking-wider">
          {currentTitle.name}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="py-4 border-b border-kayfabe-gray-dark">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-kayfabe-gold text-2xl font-bold">{user.xp.toLocaleString()}</p>
            <p className="text-kayfabe-gray-medium text-xs uppercase">Total XP</p>
          </div>
          <div>
            <p className="text-kayfabe-cream text-2xl font-bold">{user.currentStreak}</p>
            <p className="text-kayfabe-gray-medium text-xs uppercase">Day Streak</p>
          </div>
          <div>
            <p className="text-kayfabe-cream text-2xl font-bold">{totalPromos}</p>
            <p className="text-kayfabe-gray-medium text-xs uppercase">Promos</p>
          </div>
          <div>
            <p className="text-kayfabe-cream text-2xl font-bold">{completedGoals}</p>
            <p className="text-kayfabe-gray-medium text-xs uppercase">Goals Done</p>
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="py-4 border-b border-kayfabe-gray-dark space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-kayfabe-gray-light">Face/Heel Ratio</span>
          <span className="text-kayfabe-cream">{facePercent}% / {100 - facePercent}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-kayfabe-gray-light">Pop Rate</span>
          <span className="text-kayfabe-cream">{popRate}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-kayfabe-gray-light">Longest Streak</span>
          <span className="text-kayfabe-cream">{user.longestStreak} days</span>
        </div>
        <div className="flex justify-between">
          <span className="text-kayfabe-gray-light">XP Multiplier</span>
          <span className="text-kayfabe-gold">{multiplier}x</span>
        </div>
        {user.theBigOne && (
          <div className="flex justify-between">
            <span className="text-kayfabe-gray-light">The Big One</span>
            <span className="text-kayfabe-gold">{user.theBigOne.percentage}%</span>
          </div>
        )}
      </div>

      {/* Next Title Progress */}
      {nextTitle && (
        <div className="py-4 border-b border-kayfabe-gray-dark">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-kayfabe-gray-light">Next: {nextTitle.name}</span>
            <span className="text-kayfabe-gray-medium">{xpToNext.toLocaleString()} XP</span>
          </div>
          <div className="h-2 bg-kayfabe-gray-dark rounded">
            <div
              className="h-full bg-kayfabe-gold rounded"
              style={{
                width: `${Math.min(100, ((user.xp - currentTitle.xpRequired) /
                  (nextTitle.xpRequired - currentTitle.xpRequired)) * 100)}%`
              }}
            />
          </div>
        </div>
      )}

      {/* Championships */}
      {earnedBelts.length > 0 && (
        <div className="pt-4">
          <p className="text-kayfabe-gray-medium text-xs uppercase mb-2">Championships</p>
          <div className="flex flex-wrap gap-2">
            {earnedBelts.map(belt => (
              <span key={belt.id} className="text-xs bg-kayfabe-gold text-kayfabe-black px-2 py-1 rounded">
                🏆 {belt.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
