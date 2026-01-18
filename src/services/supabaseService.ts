import { supabase } from '../lib/supabase';
import type { AppData, Promo, Goal, Belt, HotTag, RunIn, Habit, Avatar } from '../types';
import { DEFAULT_BELTS, DEFAULT_HABITS } from '../utils/storage';
import { AVATAR_CATALOG } from '../data/avatars';

export const supabaseService = {
  // Load all user data from Supabase
  async loadUserData(): Promise<AppData | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Check and update streak on each load
      await this.checkAndUpdateStreak();

      // Load profile (will have updated streak values)
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profile) return null;

      // Load The Big One
      const { data: bigOne } = await supabase
        .from('the_big_one')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // Load goals
      const { data: goals } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Load promos
      const { data: promos } = await supabase
        .from('promos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Load belts
      const { data: belts } = await supabase
        .from('belts')
        .select('*')
        .eq('user_id', user.id);

      // Load habits
      const { data: habits } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', user.id);

      // Load habit completions for today
      const today = new Date().toISOString().split('T')[0];
      const { data: habitCompletions } = await supabase
        .from('habit_completions')
        .select('habit_id')
        .eq('user_id', user.id)
        .eq('completed_date', today);

      // Load quick tags
      const { data: hotTags } = await supabase
        .from('hot_tags')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Load run-ins
      const { data: runIns } = await supabase
        .from('run_ins')
        .select('*')
        .eq('user_id', user.id)
        .order('last_update', { ascending: false });

      // Transform to AppData format
      const appData: AppData = {
        user: {
          id: profile.id,
          ringName: profile.ring_name,
          epithet: profile.epithet,
          createdAt: new Date(profile.created_at).getTime(),
          xp: profile.xp,
          currentStreak: profile.current_streak,
          longestStreak: profile.longest_streak,
          lastActiveDate: profile.last_active_date,
          soundEnabled: profile.sound_enabled,
          selectedAvatar: profile.selected_avatar || 'avatar-rookie-default',
          theBigOne: bigOne ? {
            description: bigOne.description,
            percentage: bigOne.percentage,
            createdAt: new Date(bigOne.created_at).getTime(),
            updates: [],
          } : null,
          completedBigOnes: [],
          hasCompletedOnboarding: profile.has_completed_onboarding || false,
        },
        promos: (promos || []).map(p => ({
          id: p.id,
          type: p.type as 'face' | 'heel',
          content: p.content,
          promptUsed: p.prompt_used,
          isFreestyle: p.is_freestyle,
          storylineId: p.storyline_id,
          impact: p.impact as 'pop' | 'heat',
          faceFollowUp: p.face_follow_up,
          xpEarned: p.xp_earned,
          createdAt: new Date(p.created_at).getTime(),
        })),
        goals: (goals || []).map(g => ({
          id: g.id,
          title: g.title,
          tier: g.tier as 'midcard' | 'main' | 'runin',
          status: g.status as 'active' | 'completed',
          createdAt: new Date(g.created_at).getTime(),
          completedAt: g.completed_at ? new Date(g.completed_at).getTime() : null,
          victoryPromo: g.victory_promo,
        })),
        belts: (belts || []).map(b => ({
          id: b.belt_id,
          name: b.name,
          requirement: b.requirement,
          earnedAt: b.earned_at ? new Date(b.earned_at).getTime() : null,
        })),
        hotTags: (hotTags || []).map(qt => ({
          id: qt.id,
          note: qt.note,
          createdAt: new Date(qt.created_at).getTime(),
          dismissed: qt.dismissed,
        })),
        runIns: (runIns || []).map(ri => ({
          id: ri.id,
          name: ri.name,
          role: ri.role,
          notes: ri.notes,
          firstEncounter: new Date(ri.first_encounter).getTime(),
          lastUpdate: new Date(ri.last_update).getTime(),
        })),
        openingContest: {
          habits: habits && habits.length > 0 ? habits.map(h => ({
            id: h.habit_id,
            name: h.name,
            isHardcoded: h.is_hardcoded,
            enabled: h.enabled,
          })) : DEFAULT_HABITS,
          completedToday: (habitCompletions || []).map(hc => hc.habit_id),
          lastResetDate: today,
        },
        midcardConfig: {
          timeBlocks: [],
          dailyBudget: 24,
          lastResetDate: today,
        },
        availableAvatars: [],
      };

      // Load avatars
      const avatars = await this.loadUserAvatars();

      // If no avatars, initialize starters
      if (avatars.length === 0) {
        await this.initializeStarterAvatars();
        appData.availableAvatars = await this.loadUserAvatars();
      } else {
        appData.availableAvatars = avatars;
      }

      return appData;
    } catch (error) {
      console.error('Error loading user data:', error);
      return null;
    }
  },

  // Save promo
  async savePromo(promo: Promo): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    await supabase.from('promos').insert({
      user_id: user.id,
      type: promo.type,
      content: promo.content,
      prompt_used: promo.promptUsed,
      is_freestyle: promo.isFreestyle,
      storyline_id: promo.storylineId,
      impact: promo.impact,
      face_follow_up: promo.faceFollowUp,
      xp_earned: promo.xpEarned,
      created_at: new Date(promo.createdAt).toISOString(),
    });
  },

  // Save goal
  async saveGoal(goal: Goal): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase.from('goals').insert({
      id: goal.id,
      user_id: user.id,
      title: goal.title,
      tier: goal.tier,
      status: goal.status,
      victory_promo: goal.victoryPromo,
      created_at: new Date(goal.createdAt).toISOString(),
      completed_at: goal.completedAt ? new Date(goal.completedAt).toISOString() : null,
    });

    if (error) {
      console.error('Error saving goal:', error);
      throw error;
    }
  },

  // Update goal
  async updateGoal(goalId: string, updates: Partial<Goal>): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const dbUpdates: Record<string, unknown> = {};
    if (updates.status) dbUpdates.status = updates.status;
    if (updates.victoryPromo) dbUpdates.victory_promo = updates.victoryPromo;
    if (updates.completedAt) dbUpdates.completed_at = new Date(updates.completedAt).toISOString();

    await supabase
      .from('goals')
      .update(dbUpdates)
      .eq('id', goalId)
      .eq('user_id', user.id);
  },

  // Update profile (including XP, streak, etc.)
  async updateProfile(updates: {
    ringName?: string;
    epithet?: string;
    xp?: number;
    currentStreak?: number;
    longestStreak?: number;
    lastActiveDate?: string;
  }): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const dbUpdates: Record<string, unknown> = {};
    if (updates.ringName !== undefined) dbUpdates.ring_name = updates.ringName;
    if (updates.epithet !== undefined) dbUpdates.epithet = updates.epithet;
    if (updates.xp !== undefined) dbUpdates.xp = updates.xp;
    if (updates.currentStreak !== undefined) dbUpdates.current_streak = updates.currentStreak;
    if (updates.longestStreak !== undefined) dbUpdates.longest_streak = updates.longestStreak;
    if (updates.lastActiveDate !== undefined) dbUpdates.last_active_date = updates.lastActiveDate;

    await supabase
      .from('profiles')
      .update(dbUpdates)
      .eq('id', user.id);
  },

  // Update The Big One
  async updateBigOne(description: string, percentage: number): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Check if exists
    const { data: existing } = await supabase
      .from('the_big_one')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      // Update existing
      await supabase
        .from('the_big_one')
        .update({
          description,
          percentage,
          completed_at: percentage === 100 ? new Date().toISOString() : null,
        })
        .eq('user_id', user.id);
    } else {
      // Insert new
      await supabase.from('the_big_one').insert({
        user_id: user.id,
        description,
        percentage,
      });
    }
  },

  // Save belts
  async saveBelts(belts: Belt[]): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Delete all existing belts
    await supabase.from('belts').delete().eq('user_id', user.id);

    // Insert new belts
    const beltRecords = belts.map(b => ({
      user_id: user.id,
      belt_id: b.id,
      name: b.name,
      requirement: b.requirement,
      earned_at: b.earnedAt ? new Date(b.earnedAt).toISOString() : null,
    }));

    if (beltRecords.length > 0) {
      await supabase.from('belts').insert(beltRecords);
    }
  },

  // Initialize user's belts when they first sign up
  async initializeBelts(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const beltRecords = DEFAULT_BELTS.map(b => ({
      user_id: user.id,
      belt_id: b.id,
      name: b.name,
      requirement: b.requirement,
      earned_at: null,
    }));

    await supabase.from('belts').insert(beltRecords);
  },

  // Quick Tags
  async saveHotTag(tag: HotTag): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    await supabase.from('hot_tags').insert({
      id: tag.id,
      user_id: user.id,
      note: tag.note,
      dismissed: tag.dismissed,
      created_at: new Date(tag.createdAt).toISOString(),
    });
  },

  async updateHotTag(tagId: string, updates: Partial<HotTag>): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const dbUpdates: Record<string, unknown> = {};
    if (updates.dismissed !== undefined) dbUpdates.dismissed = updates.dismissed;
    if (updates.note !== undefined) dbUpdates.note = updates.note;

    await supabase
      .from('hot_tags')
      .update(dbUpdates)
      .eq('id', tagId)
      .eq('user_id', user.id);
  },

  // Run-Ins
  async saveRunIn(runIn: RunIn): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    await supabase.from('run_ins').insert({
      id: runIn.id,
      user_id: user.id,
      name: runIn.name,
      role: runIn.role,
      notes: runIn.notes,
      first_encounter: new Date(runIn.firstEncounter).toISOString(),
      last_update: new Date(runIn.lastUpdate).toISOString(),
    });
  },

  async updateRunIn(runInId: string, updates: Partial<RunIn>): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const dbUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.role !== undefined) dbUpdates.role = updates.role;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
    if (updates.lastUpdate !== undefined) {
      dbUpdates.last_update = new Date(updates.lastUpdate).toISOString();
    }

    await supabase
      .from('run_ins')
      .update(dbUpdates)
      .eq('id', runInId)
      .eq('user_id', user.id);
  },

  // Habits
  async saveHabit(habit: Habit): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    await supabase.from('habits').insert({
      user_id: user.id,
      habit_id: habit.id,
      name: habit.name,
      is_hardcoded: habit.isHardcoded,
      enabled: habit.enabled,
    });
  },

  async updateHabit(habitId: string, updates: Partial<Habit>): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const dbUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.enabled !== undefined) dbUpdates.enabled = updates.enabled;

    await supabase
      .from('habits')
      .update(dbUpdates)
      .eq('habit_id', habitId)
      .eq('user_id', user.id);
  },

  async saveHabitCompletion(habitId: string, date: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    await supabase.from('habit_completions').insert({
      user_id: user.id,
      habit_id: habitId,
      completed_date: date,
    });
  },

  async deleteHabitCompletion(habitId: string, date: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    await supabase
      .from('habit_completions')
      .delete()
      .eq('user_id', user.id)
      .eq('habit_id', habitId)
      .eq('completed_date', date);
  },

  // Streak Automation
  async checkAndUpdateStreak(): Promise<{ currentStreak: number; longestStreak: number }> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get current profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('current_streak, longest_streak, last_active_date')
      .eq('id', user.id)
      .single();

    if (!profile) throw new Error('Profile not found');

    const today = new Date().toISOString().split('T')[0];
    const lastActiveDate = profile.last_active_date;

    // If already active today, no change needed
    if (lastActiveDate === today) {
      return {
        currentStreak: profile.current_streak,
        longestStreak: profile.longest_streak,
      };
    }

    // Calculate days since last activity
    const lastDate = new Date(lastActiveDate);
    const currentDate = new Date(today);
    const diffTime = currentDate.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    let newStreak = profile.current_streak;

    if (diffDays === 1) {
      // Consecutive day - increment streak
      newStreak = profile.current_streak + 1;
    } else if (diffDays > 1) {
      // Missed days - reset streak
      newStreak = 1;
    }

    // Update longest streak if necessary
    const newLongestStreak = Math.max(newStreak, profile.longest_streak);

    // Update profile
    await supabase
      .from('profiles')
      .update({
        current_streak: newStreak,
        longest_streak: newLongestStreak,
        last_active_date: today,
      })
      .eq('id', user.id);

    return {
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
    };
  },

  // Load user's unlocked avatars
  async loadUserAvatars(): Promise<Avatar[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('avatars')
      .select('avatar_id, unlocked_at')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error loading avatars:', error);
      return [];
    }

    return (data || []).map(row => {
      const catalogAvatar = AVATAR_CATALOG.find(a => a.id === row.avatar_id);
      return catalogAvatar!;
    }).filter(Boolean);
  },

  // Unlock new avatars
  async unlockAvatars(avatarIds: string[]): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const rows = avatarIds.map(id => ({
      user_id: user.id,
      avatar_id: id,
    }));

    const { error } = await supabase
      .from('avatars')
      .insert(rows);

    if (error) {
      console.error('Error unlocking avatars:', error);
      throw error;
    }
  },

  // Update selected avatar
  async updateSelectedAvatar(avatarId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('profiles')
      .update({ selected_avatar: avatarId })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating selected avatar:', error);
      throw error;
    }
  },

  // Complete onboarding
  async completeOnboarding(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('profiles')
      .update({ has_completed_onboarding: true })
      .eq('id', user.id);

    if (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  },

  // Initialize starter avatars on first login
  async initializeStarterAvatars(): Promise<void> {
    const starterAvatars = AVATAR_CATALOG.filter(a => a.unlockedAtXP === 0);
    await this.unlockAvatars(starterAvatars.map(a => a.id));
  },

  // Check if wrestler name + epithet combination is unique
  async checkWrestlerUniqueness(ringName: string, epithet: string, excludeUserId?: string): Promise<boolean> {
    let query = supabase
      .from('profiles')
      .select('id')
      .eq('ring_name', ringName)
      .eq('epithet', epithet);

    if (excludeUserId) {
      query = query.neq('id', excludeUserId);
    }

    const { data, error } = await query.maybeSingle();

    if (error) {
      console.error('Error checking wrestler uniqueness:', error);
      throw error;
    }

    return data === null; // Returns true if no match (unique), false if exists
  },
};
