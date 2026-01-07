import { supabase } from './supabase';
import type { Habit, HabitLog, HabitWithLog } from './types';
import { getTodayDate } from './utils';

export async function fetchHabits(): Promise<Habit[]> {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function fetchHabitsWithLogs(date: string): Promise<HabitWithLog[]> {
  const habits = await fetchHabits();

  const { data: logs } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('log_date', date)
    .in(
      'habit_id',
      habits.map((h) => h.id)
    );

  return habits.map((habit) => ({
    ...habit,
    log: logs?.find((log) => log.habit_id === habit.id) || null,
  }));
}

export async function toggleHabitCompletion(
  habitId: string,
  date: string,
  currentStatus: boolean
): Promise<void> {
  const { data: existing } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('habit_id', habitId)
    .eq('log_date', date)
    .maybeSingle();

  if (existing) {
    await supabase
      .from('habit_logs')
      .update({ completed: !currentStatus, updated_at: new Date().toISOString() })
      .eq('id', existing.id);
  } else {
    await supabase.from('habit_logs').insert({
      habit_id: habitId,
      log_date: date,
      completed: true,
    });
  }
}

export async function updateHabitValue(
  habitId: string,
  date: string,
  value: number
): Promise<void> {
  const { data: existing } = await supabase
    .from('habit_logs')
    .select('*')
    .eq('habit_id', habitId)
    .eq('log_date', date)
    .maybeSingle();

  if (existing) {
    await supabase
      .from('habit_logs')
      .update({ value, completed: value > 0, updated_at: new Date().toISOString() })
      .eq('id', existing.id);
  } else {
    await supabase.from('habit_logs').insert({
      habit_id: habitId,
      log_date: date,
      value,
      completed: value > 0,
    });
  }
}

export async function addCustomHabit(
  name: string,
  habitType: 'checkbox' | 'numeric' | 'time',
  frequency: 'daily' | 'weekly',
  unit?: string
): Promise<Habit> {
  const { data: maxOrder } = await supabase
    .from('habits')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data, error } = await supabase
    .from('habits')
    .insert({
      name,
      category: 'custom',
      habit_type: habitType,
      frequency,
      unit,
      is_predefined: false,
      is_active: true,
      sort_order: (maxOrder?.sort_order || 0) + 1,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteHabit(habitId: string): Promise<void> {
  const { error } = await supabase.from('habits').delete().eq('id', habitId);
  if (error) throw error;
}

export async function fetchLogsInRange(
  startDate: string,
  endDate: string
): Promise<HabitLog[]> {
  const { data, error } = await supabase
    .from('habit_logs')
    .select('*')
    .gte('log_date', startDate)
    .lte('log_date', endDate)
    .order('log_date', { ascending: true });

  if (error) throw error;
  return data || [];
}
