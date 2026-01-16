import { useState } from 'react';
import { Navigation } from './components/Layout/Navigation';
import { PromoFlow } from './components/Promo/PromoFlow';
import { PromoList } from './components/Promo/PromoList';
import { TheBigOne } from './components/Goals/TheBigOne';
import { GoalList } from './components/Goals/GoalList';
import { GoalForm } from './components/Goals/GoalForm';
import { GoalCompletion } from './components/Goals/GoalCompletion';
import { TradingCard } from './components/Profile/TradingCard';
import { StreakDisplay } from './components/Profile/StreakDisplay';
import { BeltDisplay } from './components/Profile/BeltDisplay';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { AppData, Promo, Goal, GoalTier, GoalStatus } from './types';
import { getDefaultAppData, generateId } from './utils/storage';
import { checkAchievements } from './utils/achievements';

function App() {
  const [appData, setAppData] = useLocalStorage<AppData>('kayfabe_data', getDefaultAppData());
  const [activeTab, setActiveTab] = useState('home');
  const [isWritingPromo, setIsWritingPromo] = useState(false);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [completingGoalId, setCompletingGoalId] = useState<string | null>(null);

  // Check if user needs onboarding
  const needsOnboarding = !appData.user?.hasCompletedOnboarding;

  const handlePromoComplete = (promo: Promo) => {
    setAppData(prev => {
      const updated = {
        ...prev,
        promos: [...prev.promos, promo],
        user: prev.user ? {
          ...prev.user,
          xp: prev.user.xp + promo.xpEarned,
        } : null,
      };
      updated.belts = checkAchievements(updated);
      return updated;
    });
    setIsWritingPromo(false);
    setActiveTab('home');
  };

  const handleAddGoal = (title: string, tier: GoalTier) => {
    const newGoal: Goal = {
      id: generateId(),
      title,
      tier,
      status: 'active',
      createdAt: Date.now(),
      completedAt: null,
      victoryPromo: null,
    };

    setAppData(prev => ({
      ...prev,
      goals: [...prev.goals, newGoal],
    }));
    setIsAddingGoal(false);
  };

  const handleCompleteGoal = (goalId: string, victoryPromo: string) => {
    setAppData(prev => {
      const updated = {
        ...prev,
        goals: prev.goals.map(g =>
          g.id === goalId
            ? { ...g, status: 'completed' as GoalStatus, completedAt: Date.now(), victoryPromo }
            : g
        ),
        user: prev.user ? {
          ...prev.user,
          xp: prev.user.xp + 50, // Bonus XP for completing goal
        } : null,
      };
      updated.belts = checkAchievements(updated);
      return updated;
    });
    setCompletingGoalId(null);
  };

  const handleUpdateBigOne = (description: string, percentage: number) => {
    const prevPercentage = appData.user?.theBigOne?.percentage || 0;
    const increase = Math.max(0, percentage - prevPercentage);

    setAppData(prev => {
      const updated = {
        ...prev,
        user: prev.user ? {
          ...prev.user,
          theBigOne: {
            description,
            percentage,
            createdAt: prev.user.theBigOne?.createdAt || Date.now(),
          },
          xp: prev.user.xp + (increase * 25), // 25 XP per percentage point increase
        } : null,
      };
      updated.belts = checkAchievements(updated);
      return updated;
    });
  };

  if (needsOnboarding) {
    return (
      <div className="min-h-screen bg-kayfabe-black flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="heading-1 mb-8">KAYFABE</h1>
          <p className="text-kayfabe-gray-light mb-8">
            Your brain is a promoter.<br />
            It pitches storylines all day.<br />
            Choose which voice books the next segment.
          </p>
          <button
            className="btn-primary"
            onClick={() => {
              setAppData(prev => ({
                ...prev,
                user: {
                  id: `user-${Date.now()}`,
                  ringName: 'New Talent',
                  epithet: null,
                  createdAt: Date.now(),
                  xp: 0,
                  currentStreak: 0,
                  longestStreak: 0,
                  lastActiveDate: new Date().toISOString().split('T')[0],
                  soundEnabled: true,
                  theBigOne: null,
                  completedBigOnes: [],
                  hasCompletedOnboarding: true,
                }
              }));
            }}
          >
            Enter the Business
          </button>
        </div>
      </div>
    );
  }

  // Main app content based on active tab
  const renderContent = () => {
    if (isWritingPromo) {
      return (
        <PromoFlow
          goals={appData.goals}
          onComplete={handlePromoComplete}
          onCancel={() => setIsWritingPromo(false)}
        />
      );
    }

    switch (activeTab) {
      case 'promo':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="heading-1 mb-4">Cut a Promo</h2>
              <p className="text-kayfabe-gray-light mb-6">
                Time to get on the mic.
              </p>
              <button
                onClick={() => setIsWritingPromo(true)}
                className="btn-primary"
              >
                🎤 Cut a Promo
              </button>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <TradingCard
              user={appData.user!}
              promos={appData.promos}
              goals={appData.goals}
              belts={appData.belts}
            />
            <StreakDisplay
              currentStreak={appData.user!.currentStreak}
              longestStreak={appData.user!.longestStreak}
            />
            <BeltDisplay belts={appData.belts} />
          </div>
        );

      case 'home':
      default:
        return (
          <div className="space-y-6">
            {appData.user && (
              <TheBigOne
                bigOne={appData.user.theBigOne}
                onUpdate={handleUpdateBigOne}
                onComplete={() => {/* Handle Big One completion */}}
              />
            )}

            <div className="flex justify-between items-center">
              <h3 className="heading-2">Storylines</h3>
              <button
                onClick={() => setIsAddingGoal(true)}
                className="text-kayfabe-gold text-sm hover:text-kayfabe-cream"
              >
                + Add
              </button>
            </div>

            {isAddingGoal ? (
              <GoalForm
                onSubmit={handleAddGoal}
                onCancel={() => setIsAddingGoal(false)}
              />
            ) : completingGoalId ? (
              <GoalCompletion
                goal={appData.goals.find(g => g.id === completingGoalId)!}
                onComplete={(victoryPromo) => handleCompleteGoal(completingGoalId, victoryPromo)}
                onCancel={() => setCompletingGoalId(null)}
              />
            ) : (
              <GoalList
                goals={appData.goals}
                promos={appData.promos}
                onCompleteGoal={(id) => setCompletingGoalId(id)}
              />
            )}

            {appData.promos.length > 0 && (
              <>
                <h3 className="heading-2 mt-8">Recent Promos</h3>
                <PromoList promos={appData.promos.slice(0, 5)} />
              </>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-kayfabe-black flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        {renderContent()}
      </main>
      {!isWritingPromo && (
        <Navigation
          activeTab={activeTab}
          onNavigate={setActiveTab}
        />
      )}
    </div>
  );
}

export default App;
