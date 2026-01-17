import { useState, useEffect } from 'react';
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
import { AuthScreen } from './components/Auth/AuthScreen';
import { useAuth } from './contexts/AuthContext';
import type { AppData, Promo, Goal, GoalTier, GoalStatus } from './types';
import { generateId } from './utils/storage';
import { checkAchievements } from './utils/achievements';
import { supabaseService } from './services/supabaseService';

function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [appData, setAppData] = useState<AppData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [isWritingPromo, setIsWritingPromo] = useState(false);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [completingGoalId, setCompletingGoalId] = useState<string | null>(null);

  // Load user data from Supabase when user logs in
  useEffect(() => {
    async function loadData() {
      if (!user) {
        setDataLoading(false);
        return;
      }

      const data = await supabaseService.loadUserData();

      if (data) {
        setAppData(data);
      } else {
        // First time user - initialize belts
        await supabaseService.initializeBelts();
        const freshData = await supabaseService.loadUserData();
        setAppData(freshData);
      }

      setDataLoading(false);
    }

    loadData();
  }, [user]);

  // Show loading screen while checking auth or loading data
  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-kayfabe-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="heading-1 mb-4">KAYFABE</h1>
          <p className="text-kayfabe-gray-light">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth screen if not logged in
  if (!user) {
    return <AuthScreen />;
  }

  // Check if user needs onboarding
  const needsOnboarding = !appData?.user?.hasCompletedOnboarding;

  const handlePromoComplete = async (promo: Promo) => {
    if (!appData) return;

    // Save promo to Supabase
    await supabaseService.savePromo(promo);

    // Update local state
    const updated: AppData = {
      ...appData,
      promos: [...appData.promos, promo],
      user: appData.user ? {
        ...appData.user,
        xp: appData.user.xp + promo.xpEarned,
      } : null,
    };
    updated.belts = checkAchievements(updated);

    // Save updated XP and belts to Supabase
    if (updated.user) {
      await supabaseService.updateProfile({ xp: updated.user.xp });
      await supabaseService.saveBelts(updated.belts);
    }

    setAppData(updated);
    setIsWritingPromo(false);
    setActiveTab('home');
  };

  const handleAddGoal = async (title: string, tier: GoalTier) => {
    if (!appData) return;

    const newGoal: Goal = {
      id: generateId(),
      title,
      tier,
      status: 'active',
      createdAt: Date.now(),
      completedAt: null,
      victoryPromo: null,
    };

    // Save to Supabase
    await supabaseService.saveGoal(newGoal);

    // Update local state
    setAppData(prev => prev ? ({
      ...prev,
      goals: [...prev.goals, newGoal],
    }) : null);
    setIsAddingGoal(false);
  };

  const handleCompleteGoal = async (goalId: string, victoryPromo: string) => {
    if (!appData) return;

    // Update goal in Supabase
    await supabaseService.updateGoal(goalId, {
      status: 'completed' as GoalStatus,
      completedAt: Date.now(),
      victoryPromo,
    });

    // Update local state
    const updated: AppData = {
      ...appData,
      goals: appData.goals.map(g =>
        g.id === goalId
          ? { ...g, status: 'completed' as GoalStatus, completedAt: Date.now(), victoryPromo }
          : g
      ),
      user: appData.user ? {
        ...appData.user,
        xp: appData.user.xp + 50, // Bonus XP for completing goal
      } : null,
    };
    updated.belts = checkAchievements(updated);

    // Save updated XP and belts to Supabase
    if (updated.user) {
      await supabaseService.updateProfile({ xp: updated.user.xp });
      await supabaseService.saveBelts(updated.belts);
    }

    setAppData(updated);
    setCompletingGoalId(null);
  };

  const handleUpdateBigOne = async (description: string, percentage: number) => {
    if (!appData || !appData.user) return;

    const prevPercentage = appData.user.theBigOne?.percentage || 0;
    const increase = Math.max(0, percentage - prevPercentage);

    // Update in Supabase
    await supabaseService.updateBigOne(description, percentage);

    // Update local state
    const updated: AppData = {
      ...appData,
      user: {
        ...appData.user,
        theBigOne: {
          description,
          percentage,
          createdAt: appData.user.theBigOne?.createdAt || Date.now(),
        },
        xp: appData.user.xp + (increase * 25), // 25 XP per percentage point increase
      },
    };
    updated.belts = checkAchievements(updated);

    // Save updated XP and belts to Supabase
    if (updated.user) {
      await supabaseService.updateProfile({ xp: updated.user.xp });
    }
    await supabaseService.saveBelts(updated.belts);

    setAppData(updated);
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
            onClick={async () => {
              if (!user) return;

              // Update profile in Supabase to mark onboarding as complete
              await supabaseService.updateProfile({
                ringName: 'New Talent',
              });

              // Reload data
              const freshData = await supabaseService.loadUserData();
              setAppData(freshData);
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
          goals={appData!.goals}
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
              user={appData!.user!}
              promos={appData!.promos}
              goals={appData!.goals}
              belts={appData!.belts}
            />
            <StreakDisplay
              currentStreak={appData!.user!.currentStreak}
              longestStreak={appData!.user!.longestStreak}
            />
            <BeltDisplay belts={appData!.belts} />

            <div className="text-center pt-4">
              <button
                onClick={signOut}
                className="text-kayfabe-gray-medium hover:text-kayfabe-red text-sm uppercase tracking-wide"
              >
                Sign Out
              </button>
            </div>
          </div>
        );

      case 'home':
      default:
        return (
          <div className="space-y-6">
            {appData?.user && (
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
                goal={appData!.goals.find(g => g.id === completingGoalId)!}
                onComplete={(victoryPromo) => handleCompleteGoal(completingGoalId, victoryPromo)}
                onCancel={() => setCompletingGoalId(null)}
              />
            ) : (
              <GoalList
                goals={appData!.goals}
                promos={appData!.promos}
                onCompleteGoal={(id) => setCompletingGoalId(id)}
              />
            )}

            {appData && appData.promos.length > 0 && (
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
