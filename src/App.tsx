import { useState, useEffect } from 'react';
import { Navigation } from './components/Layout/Navigation';
import { PromoFlow } from './components/Promo/PromoFlow';
import { GoalForm } from './components/Goals/GoalForm';
import { GoalCompletion } from './components/Goals/GoalCompletion';
import { TradingCard } from './components/Profile/TradingCard';
import { StreakDisplay } from './components/Profile/StreakDisplay';
import { BeltDisplay } from './components/Profile/BeltDisplay';
import { ProfileEditor } from './components/Profile/ProfileEditor';
import { OnboardingFlow } from './components/Onboarding/OnboardingFlow';
import { AuthScreen } from './components/Auth/AuthScreen';
import { HabitList } from './components/OpeningContest/HabitList';
import { OpeningContestSettings } from './components/OpeningContest/OpeningContestSettings';
import { TimeBlockList } from './components/Midcard/TimeBlockList';
import { TimeBlockSettings } from './components/Midcard/TimeBlockSettings';
import { MatchCardHeader } from './components/MatchCard/MatchCardHeader';
import { BigOneHeadline } from './components/MatchCard/BigOneHeadline';
import { MainEventSection } from './components/MatchCard/MainEventSection';
import { QuickTagFlow } from './components/QuickTag/QuickTagFlow';
import { RunInFlow } from './components/RunIn/RunInFlow';
import { DarkMatchFlow } from './components/DarkMatch/DarkMatchFlow';
import { useAuth } from './contexts/AuthContext';
import type { AppData, Promo, Goal, GoalTier, GoalStatus, QuickTag, RunIn, TimeBlock, BigOneUpdate } from './types';
import { generateId } from './utils/storage';
import { checkAchievements, checkAvatarUnlocks } from './utils/achievements';
import { calculateXPWithMultiplier } from './utils/xp';
import { checkAndResetDaily } from './utils/dailyReset';
import { supabaseService } from './services/supabaseService';
import { AVATAR_CATALOG } from './data/avatars';

function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [appData, setAppData] = useState<AppData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [isWritingPromo, setIsWritingPromo] = useState(false);
  const [bigOnePromoContext, setBigOnePromoContext] = useState<{previousPercentage: number; newPercentage: number} | null>(null);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [completingGoalId, setCompletingGoalId] = useState<string | null>(null);
  const [showQuickTag, setShowQuickTag] = useState(false);
  const [showRunIn, setShowRunIn] = useState(false);
  const [showDarkMatch, setShowDarkMatch] = useState(false);
  const [showProfileEditor, setShowProfileEditor] = useState(false);

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
          // Apply daily reset if needed
          const resetData = checkAndResetDaily(data);
          setAppData(resetData);
        } else {
          // First time user - initialize belts
          await supabaseService.initializeBelts();
          const freshData = await supabaseService.loadUserData();
          const resetFreshData = freshData ? checkAndResetDaily(freshData) : freshData;
          setAppData(resetFreshData);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setLoadError(error instanceof Error ? error.message : 'Failed to load data');
      }

      setDataLoading(false);
    }

    loadData();
  }, [user]);

  // Listen for tab visibility changes to check for daily reset
  useEffect(() => {
    if (!appData || !user) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const today = new Date().toISOString().split('T')[0];
        const needsReset =
          appData.openingContest.lastResetDate !== today ||
          appData.midcardConfig.lastResetDate !== today;

        if (needsReset) {
          const resetData = checkAndResetDaily(appData);
          setAppData(resetData);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [appData, user]);

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

  // Onboarding handlers
  const handleOnboardingComplete = async (ringName: string, epithet: string, avatarId: string) => {
    if (!user) return;

    try {
      console.log('Starting onboarding completion...', { ringName, epithet, avatarId });

      // Update profile with ring name and epithet
      await supabaseService.updateProfile({
        ringName,
        epithet,
      });
      console.log('Profile updated');

      // Update selected avatar
      await supabaseService.updateSelectedAvatar(avatarId);
      console.log('Avatar updated');

      // Mark onboarding as completed
      await supabaseService.completeOnboarding();
      console.log('Onboarding marked complete');

      // Reload data
      const freshData = await supabaseService.loadUserData();
      console.log('Fresh data loaded:', freshData);

      if (freshData) {
        setAppData(freshData);
        console.log('AppData set successfully');
      } else {
        console.error('freshData is null!');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  };

  const handleCheckUniqueness = async (ringName: string, epithet: string) => {
    return await supabaseService.checkWrestlerUniqueness(ringName, epithet);
  };

  // Profile editor handlers
  const handleEditProfile = () => {
    setShowProfileEditor(true);
  };

  const handleProfileSave = async (ringName: string, epithet: string, avatarId: string) => {
    if (!appData || !user) return;

    await supabaseService.updateProfile({
      ringName,
      epithet,
    });
    await supabaseService.updateSelectedAvatar(avatarId);

    // Update local state
    const updated: AppData = {
      ...appData,
      user: appData.user ? {
        ...appData.user,
        ringName,
        epithet,
        selectedAvatar: avatarId,
      } : null,
    };

    setAppData(updated);
    setShowProfileEditor(false);
  };

  const handleCheckUniquenessForEdit = async (ringName: string, epithet: string, excludeUserId: string) => {
    return await supabaseService.checkWrestlerUniqueness(ringName, epithet, excludeUserId);
  };

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

    // Check for avatar unlocks
    if (updated.user) {
      const newlyUnlockedAvatars = checkAvatarUnlocks(updated.user.xp, appData.availableAvatars);
      if (newlyUnlockedAvatars.length > 0) {
        updated.availableAvatars = [...appData.availableAvatars, ...newlyUnlockedAvatars];
        await supabaseService.unlockAvatars(newlyUnlockedAvatars.map(a => a.id));
      }
    }

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

    const goal = appData.goals.find(g => g.id === goalId);
    if (!goal) return;

    // Update goal in Supabase
    await supabaseService.updateGoal(goalId, {
      status: 'completed' as GoalStatus,
      completedAt: Date.now(),
      victoryPromo,
    });

    // Apply tier-aware bonus XP: 100 for main event, 50 for others
    const baseBonus = goal.tier === 'main' ? 100 : 50;
    const bonusXP = calculateXPWithMultiplier(baseBonus, appData.user.currentStreak);

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

    // Check for avatar unlocks
    if (updated.user) {
      const newlyUnlockedAvatars = checkAvatarUnlocks(updated.user.xp, appData.availableAvatars);
      if (newlyUnlockedAvatars.length > 0) {
        updated.availableAvatars = [...appData.availableAvatars, ...newlyUnlockedAvatars];
        await supabaseService.unlockAvatars(newlyUnlockedAvatars.map(a => a.id));
      }
    }

    // Save updated XP and belts to Supabase
    if (updated.user) {
      await supabaseService.updateProfile({ xp: updated.user.xp });
      await supabaseService.saveBelts(updated.belts);
    }

    setAppData(updated);
    setCompletingGoalId(null);
  };

  const handleRequestBigOnePromo = (previousPercentage: number, newPercentage: number) => {
    setBigOnePromoContext({ previousPercentage, newPercentage });
    setIsWritingPromo(true);
  };

  const handleBigOnePromoComplete = async (promo: Promo) => {
    if (!appData || !appData.user || !bigOnePromoContext) return;

    const { previousPercentage, newPercentage } = bigOnePromoContext;

    // Apply streak multiplier to XP
    const multipliedXP = calculateXPWithMultiplier(
      promo.xpEarned,
      appData.user.currentStreak
    );

    // Calculate Big One XP bonus
    const percentageChange = Math.abs(newPercentage - previousPercentage);
    const bigOneBaseXP = percentageChange * 25; // 25 XP per percentage point
    const bigOneXP = calculateXPWithMultiplier(bigOneBaseXP, appData.user.currentStreak);

    // Save promo to Supabase
    await supabaseService.savePromo(promo);

    // Create Big One update record
    const bigOneUpdate: BigOneUpdate = {
      id: generateId(),
      previousPercentage,
      newPercentage,
      promoId: promo.id,
      timestamp: Date.now(),
    };

    const description = appData.user.theBigOne?.description || '';

    // Update in Supabase
    await supabaseService.updateBigOne(description, newPercentage);

    // Update local state
    const updated: AppData = {
      ...appData,
      promos: [...appData.promos, promo],
      user: {
        ...appData.user,
        theBigOne: {
          description,
          percentage: newPercentage,
          createdAt: appData.user.theBigOne?.createdAt || Date.now(),
          updates: [...(appData.user.theBigOne?.updates || []), bigOneUpdate],
        },
        xp: appData.user.xp + multipliedXP + bigOneXP,
      },
    };
    updated.belts = checkAchievements(updated);

    // Check for avatar unlocks
    if (updated.user) {
      const newlyUnlockedAvatars = checkAvatarUnlocks(updated.user.xp, appData.availableAvatars);
      if (newlyUnlockedAvatars.length > 0) {
        updated.availableAvatars = [...appData.availableAvatars, ...newlyUnlockedAvatars];
        await supabaseService.unlockAvatars(newlyUnlockedAvatars.map(a => a.id));
      }
    }

    // Save updated XP and belts to Supabase
    if (updated.user) {
      await supabaseService.updateProfile({ xp: updated.user.xp });
      await supabaseService.saveBelts(updated.belts);
    }

    setAppData(updated);
    setBigOnePromoContext(null);
    setIsWritingPromo(false);
    setActiveTab('home');
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

  // Time Block Handlers
  const handleAddTimeBlock = (name: string, allocatedHours: number, isDaily: boolean, linkedGoalId: string | null) => {
    if (!appData) return;

    const newBlock: TimeBlock = {
      id: generateId(),
      name,
      allocatedHours,
      loggedHours: 0,
      isDaily,
      isCompleted: false,
      linkedGoalId,
      timerStartedAt: null,
      createdAt: Date.now(),
    };

    setAppData({
      ...appData,
      midcardConfig: {
        ...appData.midcardConfig,
        timeBlocks: [...appData.midcardConfig.timeBlocks, newBlock],
      },
    });
  };

  const handleUpdateTimeBlock = (blockId: string, updates: Partial<TimeBlock>) => {
    if (!appData) return;

    setAppData({
      ...appData,
      midcardConfig: {
        ...appData.midcardConfig,
        timeBlocks: appData.midcardConfig.timeBlocks.map(block =>
          block.id === blockId ? { ...block, ...updates } : block
        ),
      },
    });
  };

  const handleDeleteTimeBlock = (blockId: string) => {
    if (!appData) return;

    setAppData({
      ...appData,
      midcardConfig: {
        ...appData.midcardConfig,
        timeBlocks: appData.midcardConfig.timeBlocks.filter(block => block.id !== blockId),
      },
    });
  };

  const handleStartTimer = (blockId: string) => {
    handleUpdateTimeBlock(blockId, { timerStartedAt: Date.now() });
  };

  const handleStopTimer = (blockId: string, elapsedHours: number) => {
    if (!appData) return;

    const block = appData.midcardConfig.timeBlocks.find(b => b.id === blockId);
    if (!block) return;

    const newLoggedHours = block.loggedHours + elapsedHours;
    handleUpdateTimeBlock(blockId, {
      loggedHours: newLoggedHours,
      timerStartedAt: null,
    });
  };

  const handleManualLog = (blockId: string, hours: number) => {
    if (!appData) return;

    const block = appData.midcardConfig.timeBlocks.find(b => b.id === blockId);
    if (!block) return;

    const newLoggedHours = block.loggedHours + hours;
    handleUpdateTimeBlock(blockId, { loggedHours: newLoggedHours });
  };

  const handleToggleTimeBlockComplete = (blockId: string) => {
    if (!appData) return;

    const block = appData.midcardConfig.timeBlocks.find(b => b.id === blockId);
    if (!block) return;

    handleUpdateTimeBlock(blockId, { isCompleted: !block.isCompleted });
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
    const starterAvatars = AVATAR_CATALOG.filter(a => a.unlockedAtXP === 0);

    return (
      <OnboardingFlow
        starterAvatars={starterAvatars}
        onComplete={handleOnboardingComplete}
        onCheckUniqueness={handleCheckUniqueness}
      />
    );
  }

  // Main app content based on active tab
  const renderContent = () => {
    if (isWritingPromo) {
      return (
        <PromoFlow
          goals={appData!.goals}
          onComplete={bigOnePromoContext ? handleBigOnePromoComplete : handlePromoComplete}
          onCancel={() => {
            setIsWritingPromo(false);
            setBigOnePromoContext(null);
          }}
          bigOneContext={bigOnePromoContext || undefined}
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

      case 'midcard':
        return (
          <div className="space-y-6">
            <TimeBlockSettings
              timeBlocks={appData!.midcardConfig.timeBlocks}
              goals={appData!.goals}
              onAddTimeBlock={handleAddTimeBlock}
              onDeleteTimeBlock={handleDeleteTimeBlock}
              onStartTimer={handleStartTimer}
              onStopTimer={handleStopTimer}
              onManualLog={handleManualLog}
            />
          </div>
        );

      case 'opening':
        return (
          <div className="space-y-6">
            <OpeningContestSettings
              habits={appData!.openingContest.habits}
              onToggleEnabled={handleToggleHabitEnabled}
              onAddCustom={handleAddCustomHabit}
            />
          </div>
        );

      case 'profile':
        if (showProfileEditor) {
          return (
            <div className="space-y-6">
              <ProfileEditor
                currentRingName={appData!.user!.ringName}
                currentEpithet={appData!.user!.epithet || ''}
                currentAvatarId={appData!.user!.selectedAvatar}
                currentUserId={appData!.user!.id}
                availableAvatars={appData!.availableAvatars}
                onSave={handleProfileSave}
                onCancel={() => setShowProfileEditor(false)}
                onCheckUniqueness={handleCheckUniquenessForEdit}
              />
            </div>
          );
        }

        const selectedAvatarData = appData!.availableAvatars.find(a => a.id === appData!.user!.selectedAvatar);

        return (
          <div className="space-y-6">
            <TradingCard
              user={appData!.user!}
              promos={appData!.promos}
              goals={appData!.goals}
              belts={appData!.belts}
              selectedAvatar={selectedAvatarData}
              onEditProfile={handleEditProfile}
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
        // Handle modals first
        if (isAddingGoal) {
          return (
            <div className="space-y-6">
              <GoalForm
                onSubmit={handleAddGoal}
                onCancel={() => setIsAddingGoal(false)}
              />
            </div>
          );
        }

        if (completingGoalId) {
          return (
            <div className="space-y-6">
              <GoalCompletion
                goal={appData!.goals.find(g => g.id === completingGoalId)!}
                onComplete={(victoryPromo) => handleCompleteGoal(completingGoalId, victoryPromo)}
                onCancel={() => setCompletingGoalId(null)}
              />
            </div>
          );
        }

        if (showQuickTag) {
          return (
            <div className="space-y-6">
              <QuickTagFlow
                onComplete={handleQuickTagComplete}
                onCancel={() => setShowQuickTag(false)}
              />
            </div>
          );
        }

        if (showRunIn) {
          return (
            <div className="space-y-6">
              <RunInFlow
                onComplete={handleRunInComplete}
                onCancel={() => setShowRunIn(false)}
              />
            </div>
          );
        }

        if (showDarkMatch) {
          return (
            <div className="space-y-6">
              <DarkMatchFlow
                onComplete={() => setShowDarkMatch(false)}
                onCancel={() => setShowDarkMatch(false)}
              />
            </div>
          );
        }

        // Match Card main view
        return (
          <div className="space-y-6">
            {/* Match Card Header */}
            {appData?.user && (
              <MatchCardHeader currentStreak={appData.user.currentStreak} />
            )}

            {/* The Big One - Headline */}
            {appData?.user && (
              <BigOneHeadline
                bigOne={appData.user.theBigOne}
                onRequestPromoForChange={handleRequestBigOnePromo}
              />
            )}

            {/* Main Event Section */}
            <MainEventSection
              goals={appData!.goals}
              promos={appData!.promos}
              onCompleteGoal={(id) => setCompletingGoalId(id)}
            />

            {/* Midcard - Time Slots */}
            {appData && appData.midcardConfig.timeBlocks.length > 0 && (
              <TimeBlockList
                timeBlocks={appData.midcardConfig.timeBlocks}
                dailyBudget={appData.midcardConfig.dailyBudget}
                onToggleComplete={handleToggleTimeBlockComplete}
              />
            )}

            {/* Opening Contest - Daily Habits */}
            {appData && (
              <div className="space-y-2">
                <h3 className="text-xl font-display uppercase tracking-wider text-kayfabe-cream">
                  🏋️ Opening Contest - Daily Habits
                </h3>
                <HabitList
                  habits={appData.openingContest.habits}
                  completedToday={appData.openingContest.completedToday}
                  onToggleHabit={handleToggleHabit}
                />
                <p className="text-kayfabe-gray-medium text-xs text-center">
                  Manage in Opening tab →
                </p>
              </div>
            )}

            {/* Quick Actions - Keep for convenience */}
            <div className="grid grid-cols-3 gap-2 pt-4">
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

            {/* Add Storyline Button */}
            <div className="text-center pt-2">
              <button
                onClick={() => setIsAddingGoal(true)}
                className="btn-secondary w-full"
              >
                + Add Storyline
              </button>
            </div>
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
