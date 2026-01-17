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
import { HabitList } from './components/OpeningContest/HabitList';
import { HabitSettings } from './components/OpeningContest/HabitSettings';
import { QuickTagFlow } from './components/QuickTag/QuickTagFlow';
import { TagList } from './components/QuickTag/TagList';
import { RunInFlow } from './components/RunIn/RunInFlow';
import { DarkMatchFlow } from './components/DarkMatch/DarkMatchFlow';
import { useAuth } from './contexts/AuthContext';
import type { AppData, Promo, Goal, GoalTier, GoalStatus, QuickTag, RunIn } from './types';
import { generateId } from './utils/storage';
import { checkAchievements } from './utils/achievements';
import { calculateXPWithMultiplier } from './utils/xp';
import { supabaseService } from './services/supabaseService';

function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [appData, setAppData] = useState<AppData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [isWritingPromo, setIsWritingPromo] = useState(false);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [completingGoalId, setCompletingGoalId] = useState<string | null>(null);
  const [showHabitSettings, setShowHabitSettings] = useState(false);
  const [showQuickTag, setShowQuickTag] = useState(false);
  const [showRunIn, setShowRunIn] = useState(false);
  const [showDarkMatch, setShowDarkMatch] = useState(false);

  // Load user data from Supabase when user logs in
  useEffect(() => {
    async function loadData() {
      if (!user) {
        setDataLoading(false);
        return;
      }

      try {
        const data = await supabaseService.loadUserData();

        if (data) {
          setAppData(data);
        } else {
          // First time user - initialize belts
          await supabaseService.initializeBelts();
          const freshData = await supabaseService.loadUserData();
          setAppData(freshData);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setLoadError(error instanceof Error ? error.message : 'Failed to load data');
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

  // Show error screen if data failed to load
  if (loadError) {
    return (
      <div className="min-h-screen bg-kayfabe-black flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="heading-1 mb-4">KAYFABE</h1>
          <div className="card space-y-4">
            <p className="text-kayfabe-red font-bold">Database Error</p>
            <p className="text-kayfabe-gray-light text-sm">
              Unable to load your data. This usually means the database schema needs to be updated.
            </p>
            <p className="text-kayfabe-gray-medium text-xs">
              Check IMPORTANT_UPDATE_SCHEMA.md in the project for instructions.
            </p>
            <p className="text-kayfabe-gray-dark text-xs break-all">
              {loadError}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-secondary"
            >
              Retry
            </button>
            <button
              onClick={signOut}
              className="text-kayfabe-gray-medium hover:text-kayfabe-cream text-sm"
            >
              Sign Out
            </button>
          </div>
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
    if (!appData || !appData.user) return;

    // Apply streak multiplier to XP
    const multipliedXP = calculateXPWithMultiplier(
      promo.xpEarned,
      appData.user.currentStreak
    );

    // Save promo to Supabase
    await supabaseService.savePromo(promo);

    // Update local state
    const updated: AppData = {
      ...appData,
      promos: [...appData.promos, promo],
      user: {
        ...appData.user,
        xp: appData.user.xp + multipliedXP,
      },
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
    if (!appData || !appData.user) return;

    // Update goal in Supabase
    await supabaseService.updateGoal(goalId, {
      status: 'completed' as GoalStatus,
      completedAt: Date.now(),
      victoryPromo,
    });

    // Apply streak multiplier to bonus XP
    const bonusXP = calculateXPWithMultiplier(50, appData.user.currentStreak);

    // Update local state
    const updated: AppData = {
      ...appData,
      goals: appData.goals.map(g =>
        g.id === goalId
          ? { ...g, status: 'completed' as GoalStatus, completedAt: Date.now(), victoryPromo }
          : g
      ),
      user: {
        ...appData.user,
        xp: appData.user.xp + bonusXP,
      },
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

    // Apply streak multiplier to Big One XP
    const baseXP = increase * 25; // 25 XP per percentage point increase
    const xpGain = calculateXPWithMultiplier(baseXP, appData.user.currentStreak);

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
        xp: appData.user.xp + xpGain,
      },
    };
    updated.belts = checkAchievements(updated);

    // Save updated XP and belts to Supabase
    if (updated.user) {
      await supabaseService.updateProfile({ xp: updated.user.xp });
      await supabaseService.saveBelts(updated.belts);
    }

    setAppData(updated);
  };

  const handleToggleHabit = async (habitId: string) => {
    if (!appData || !appData.user) return;

    const isCompleted = appData.openingContest.completedToday.includes(habitId);
    const enabledHabits = appData.openingContest.habits.filter(h => h.enabled);
    const today = new Date().toISOString().split('T')[0];

    let baseXP = 0;
    let updatedCompletedToday: string[];

    if (isCompleted) {
      // Uncomplete
      updatedCompletedToday = appData.openingContest.completedToday.filter(id => id !== habitId);
      await supabaseService.deleteHabitCompletion(habitId, today);
    } else {
      // Complete
      updatedCompletedToday = [...appData.openingContest.completedToday, habitId];
      baseXP = 10; // Base XP for completing a habit

      // Check for clean sweep
      const allCompleted = enabledHabits.every(h =>
        updatedCompletedToday.includes(h.id)
      );
      if (allCompleted) {
        baseXP += 15; // Bonus for clean sweep
      }

      await supabaseService.saveHabitCompletion(habitId, today);
    }

    // Apply streak multiplier
    const xpGain = calculateXPWithMultiplier(baseXP, appData.user.currentStreak);

    const updated: AppData = {
      ...appData,
      openingContest: {
        ...appData.openingContest,
        completedToday: updatedCompletedToday,
      },
      user: {
        ...appData.user,
        xp: appData.user.xp + xpGain,
      },
    };

    if (xpGain > 0 && updated.user) {
      await supabaseService.updateProfile({ xp: updated.user.xp });
    }

    setAppData(updated);
  };

  const handleToggleHabitEnabled = async (habitId: string) => {
    if (!appData) return;

    const habit = appData.openingContest.habits.find(h => h.id === habitId);
    if (!habit) return;

    const newEnabled = !habit.enabled;

    setAppData({
      ...appData,
      openingContest: {
        ...appData.openingContest,
        habits: appData.openingContest.habits.map(h =>
          h.id === habitId ? { ...h, enabled: newEnabled } : h
        ),
      },
    });

    await supabaseService.updateHabit(habitId, { enabled: newEnabled });
  };

  const handleAddCustomHabit = async (name: string) => {
    if (!appData) return;

    const newHabit = {
      id: generateId(),
      name,
      isHardcoded: false,
      enabled: true,
    };

    setAppData({
      ...appData,
      openingContest: {
        ...appData.openingContest,
        habits: [...appData.openingContest.habits, newHabit],
      },
    });

    await supabaseService.saveHabit(newHabit);
  };

  const handleQuickTagComplete = async (tag: QuickTag) => {
    if (!appData) return;

    setAppData({
      ...appData,
      quickTags: [...appData.quickTags, tag],
    });

    setShowQuickTag(false);

    await supabaseService.saveQuickTag(tag);
  };

  const handleExpandTag = (tagId: string) => {
    const tag = appData?.quickTags.find(t => t.id === tagId);
    if (!tag) return;

    // Pre-fill promo with tag content
    setIsWritingPromo(true);
    // TODO: Pass tag content to PromoFlow (future enhancement)
  };

  const handleDismissTag = async (tagId: string) => {
    if (!appData) return;

    setAppData({
      ...appData,
      quickTags: appData.quickTags.map(t =>
        t.id === tagId ? { ...t, dismissed: true } : t
      ),
    });

    await supabaseService.updateQuickTag(tagId, { dismissed: true });
  };

  const handleRunInComplete = async (runIn: RunIn) => {
    if (!appData) return;

    setAppData({
      ...appData,
      runIns: [...appData.runIns, runIn],
    });

    setShowRunIn(false);

    await supabaseService.saveRunIn(runIn);
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
            {/* Opening Contest - Daily Habits */}
            {appData && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="heading-2">Opening Contest</h3>
                  <button
                    onClick={() => setShowHabitSettings(!showHabitSettings)}
                    className="text-kayfabe-gray-light hover:text-kayfabe-cream text-sm"
                  >
                    ⚙️
                  </button>
                </div>
                {showHabitSettings ? (
                  <HabitSettings
                    habits={appData.openingContest.habits}
                    onToggleEnabled={handleToggleHabitEnabled}
                    onAddCustom={handleAddCustomHabit}
                    onClose={() => setShowHabitSettings(false)}
                  />
                ) : (
                  <HabitList
                    habits={appData.openingContest.habits}
                    completedToday={appData.openingContest.completedToday}
                    onToggleHabit={handleToggleHabit}
                  />
                )}
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setShowQuickTag(true)}
                className="btn-secondary py-2 text-sm"
              >
                🏷️ Tag
              </button>
              <button
                onClick={() => setShowRunIn(true)}
                className="btn-secondary py-2 text-sm"
              >
                👤 Run-In
              </button>
              <button
                onClick={() => setShowDarkMatch(true)}
                className="btn-secondary py-2 text-sm"
              >
                🌑 Vent
              </button>
            </div>

            {/* Quick Tag Flow */}
            {showQuickTag && (
              <QuickTagFlow
                onComplete={handleQuickTagComplete}
                onCancel={() => setShowQuickTag(false)}
              />
            )}

            {/* Run-In Flow */}
            {showRunIn && (
              <RunInFlow
                onComplete={handleRunInComplete}
                onCancel={() => setShowRunIn(false)}
              />
            )}

            {/* Dark Match Flow */}
            {showDarkMatch && (
              <DarkMatchFlow
                onComplete={() => setShowDarkMatch(false)}
                onCancel={() => setShowDarkMatch(false)}
              />
            )}

            {/* Pending Quick Tags */}
            {appData && appData.quickTags.filter(t => !t.dismissed).length > 0 && (
              <div className="space-y-2">
                <h3 className="heading-2">Tagged Moments</h3>
                <TagList
                  tags={appData.quickTags}
                  onExpand={handleExpandTag}
                  onDismiss={handleDismissTag}
                />
              </div>
            )}

            {/* The Big One */}
            {appData?.user && (
              <TheBigOne
                bigOne={appData.user.theBigOne}
                onUpdate={handleUpdateBigOne}
                onComplete={() => {/* Handle Big One completion */}}
              />
            )}

            {/* Storylines */}
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

            {/* Recent Promos */}
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
