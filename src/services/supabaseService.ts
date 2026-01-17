import { supabase } from '../lib/supabase';
import type { AppData, Promo, Goal, Belt } from '../types';
import { DEFAULT_BELTS, DEFAULT_HABITS } from '../utils/storage';

export const supabaseService = {
  // Load all user data from Supabase
  async loadUserData(): Promise<AppData | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Load profile
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
          theBigOne: bigOne ? {
            description: bigOne.description,
            percentage: bigOne.percentage,
            createdAt: new Date(bigOne.created_at).getTime(),
          } : null,
          completedBigOnes: [],
          hasCompletedOnboarding: true,
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
          tier: g.tier as 'opening' | 'midcard' | 'main' | 'runin',
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
        quickTags: [],
        runIns: [],
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
      };

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

    await supabase.from('goals').insert({
      id: goal.id,
      user_id: user.id,
      title: goal.title,
      tier: goal.tier,
      status: goal.status,
      victory_promo: goal.victoryPromo,
      created_at: new Date(goal.createdAt).toISOString(),
      completed_at: goal.completedAt ? new Date(goal.completedAt).toISOString() : null,
    });
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
};
