import { supabase } from '../lib/supabase';
import type { AppData, Promo, Goal, Belt, HotTag, RunIn, Habit, Avatar, TimeBlockPromo, PendingPromoBlock } from '../types';
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

      // Load time block promos
      const { data: timeBlockPromos } = await supabase
        .from('time_block_promos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Load pending promo blocks
      const { data: pendingPromoBlocks } = await supabase
        .from('pending_promo_blocks')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

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
          characterType: qt.character_type as 'face' | 'heel',
          createdAt: new Date(qt.created_at).getTime(),
          dismissed: qt.dismissed,
        })),
        runIns: (runIns || []).map(ri => ({
          id: ri.id,
          type: (ri.type as 'person' | 'moment') || 'person',
          name: ri.name || '',
          role: ri.role || '',
          momentTitle: ri.moment_title || null,
          notes: ri.notes || '',
          linkedGoalId: ri.linked_goal_id || null,
          hoursContributed: ri.hours_contributed || 0,
          firstEncounter: new Date(ri.first_encounter).getTime(),
          lastUpdate: new Date(ri.last_update).getTime(),
          entryPromo: ri.entry_promo || null,
          impact: ri.impact as 'pop' | 'heat' | null,
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
          cardBookedForDate: null,
          showStarted: false,
        },
        timeBlockPromos: (timeBlockPromos || []).map(tbp => ({
          id: tbp.id,
          timeBlockId: tbp.time_block_id,
          timeBlockName: tbp.time_block_name,
          linkedGoalId: tbp.linked_goal_id,
          type: tbp.type as 'face' | 'heel',
          content: tbp.content,
          faceFollowUp: tbp.face_follow_up,
          impact: tbp.impact as 'pop' | 'heat',
          bookedHours: parseFloat(tbp.booked_hours) || 0,
          actualHours: parseFloat(tbp.actual_hours) || 0,
          date: tbp.date,
          createdAt: new Date(tbp.created_at).getTime(),
          xpEarned: tbp.xp_earned,
        })),
        pendingPromoBlocks: (pendingPromoBlocks || []).map(ppb => ({
          timeBlockId: ppb.time_block_id,
          timeBlockName: ppb.time_block_name,
          linkedGoalId: ppb.linked_goal_id,
          bookedHours: parseFloat(ppb.booked_hours) || 0,
          actualHours: parseFloat(ppb.actual_hours) || 0,
          date: ppb.date,
        })),
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
      console.error('Error details:', JSON.stringify(error, null, 2));
      console.error('Goal data attempted:', { id: goal.id, title: goal.title, tier: goal.tier, user_id: user.id });
      throw new Error(`Database error: ${error.message || error.hint || 'Unknown database error'}`);
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
      const { error } = await supabase
        .from('the_big_one')
        .update({
          description,
          percentage,
          completed_at: percentage === 100 ? new Date().toISOString() : null,
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating Big One:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        throw new Error(`Database error updating Big One: ${error.message || error.hint || 'Unknown database error'}`);
      }
    } else {
      // Insert new
      const { error } = await supabase.from('the_big_one').insert({
        user_id: user.id,
        description,
        percentage,
      });

      if (error) {
        console.error('Error inserting Big One:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        throw new Error(`Database error inserting Big One: ${error.message || error.hint || 'Unknown database error'}`);
      }
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

    const { error } = await supabase.from('hot_tags').insert({
      id: tag.id,
      user_id: user.id,
      note: tag.note,
      character_type: tag.characterType,
      dismissed: tag.dismissed,
      created_at: new Date(tag.createdAt).toISOString(),
    });

    if (error) {
      console.error('Error saving hot tag:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      throw new Error(`Database error: ${error.message || error.hint || 'Unknown database error'}`);
    }
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
      type: runIn.type,
      name: runIn.name,
      role: runIn.role,
      moment_title: runIn.momentTitle,
      notes: runIn.notes,
      linked_goal_id: runIn.linkedGoalId,
      hours_contributed: runIn.hoursContributed,
      first_encounter: new Date(runIn.firstEncounter).toISOString(),
      last_update: new Date(runIn.lastUpdate).toISOString(),
      entry_promo: runIn.entryPromo,
      impact: runIn.impact,
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

  // Time Block Promos
  async saveTimeBlockPromo(promo: TimeBlockPromo): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase.from('time_block_promos').insert({
      id: promo.id,
      user_id: user.id,
      time_block_id: promo.timeBlockId,
      time_block_name: promo.timeBlockName,
      linked_goal_id: promo.linkedGoalId,
      type: promo.type,
      content: promo.content,
      face_follow_up: promo.faceFollowUp,
      impact: promo.impact,
      booked_hours: promo.bookedHours,
      actual_hours: promo.actualHours,
      date: promo.date,
      xp_earned: promo.xpEarned,
      created_at: new Date(promo.createdAt).toISOString(),
    });

    if (error) {
      console.error('Error saving time block promo:', error);
      throw new Error(`Database error: ${error.message || 'Unknown database error'}`);
    }
  },

  // Pending Promo Blocks
  async savePendingPromoBlock(block: PendingPromoBlock): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase.from('pending_promo_blocks').insert({
      user_id: user.id,
      time_block_id: block.timeBlockId,
      time_block_name: block.timeBlockName,
      linked_goal_id: block.linkedGoalId,
      booked_hours: block.bookedHours,
      actual_hours: block.actualHours,
      date: block.date,
    });

    if (error) {
      console.error('Error saving pending promo block:', error);
      throw new Error(`Database error: ${error.message || 'Unknown database error'}`);
    }
  },

  async deletePendingPromoBlock(timeBlockId: string, date: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('pending_promo_blocks')
      .delete()
      .eq('user_id', user.id)
      .eq('time_block_id', timeBlockId)
      .eq('date', date);

    if (error) {
      console.error('Error deleting pending promo block:', error);
      throw new Error(`Database error: ${error.message || 'Unknown database error'}`);
    }
  },

  async clearAllPendingPromoBlocks(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('pending_promo_blocks')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('Error clearing pending promo blocks:', error);
      throw new Error(`Database error: ${error.message || 'Unknown database error'}`);
    }
  },
};
