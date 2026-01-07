import type { Habit, HabitLog } from './types';
import { getTodayDate } from './utils';

export interface HabitStats {
  habitId: string;
  habitName: string;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  totalCompleted: number;
  totalDays: number;
}

export function calculateStreak(logs: HabitLog[], habitId: string): number {
  const habitLogs = logs
    .filter((log) => log.habit_id === habitId && log.completed)
    .sort((a, b) => new Date(b.log_date).getTime() - new Date(a.log_date).getTime());

  if (habitLogs.length === 0) return 0;

  let streak = 0;
  const today = new Date(getTodayDate());
  let currentDate = new Date(today);

  for (const log of habitLogs) {
    const logDate = new Date(log.log_date);
    const diffDays = Math.floor(
      (currentDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (diffDays === 1) {
      streak++;
      currentDate = new Date(logDate);
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export function calculateLongestStreak(logs: HabitLog[], habitId: string): number {
  const habitLogs = logs
    .filter((log) => log.habit_id === habitId && log.completed)
    .sort((a, b) => new Date(a.log_date).getTime() - new Date(b.log_date).getTime());

  if (habitLogs.length === 0) return 0;

  let maxStreak = 0;
  let currentStreak = 1;

  for (let i = 1; i < habitLogs.length; i++) {
    const prevDate = new Date(habitLogs[i - 1].log_date);
    const currDate = new Date(habitLogs[i].log_date);
    const diffDays = Math.floor(
      (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 1) {
      currentStreak++;
    } else {
      maxStreak = Math.max(maxStreak, currentStreak);
      currentStreak = 1;
    }
  }

  return Math.max(maxStreak, currentStreak);
}

export function calculateHabitStats(
  habit: Habit,
  logs: HabitLog[],
  totalDays: number
): HabitStats {
  const habitLogs = logs.filter((log) => log.habit_id === habit.id);
  const completedLogs = habitLogs.filter((log) => log.completed);

  return {
    habitId: habit.id,
    habitName: habit.name,
    currentStreak: calculateStreak(logs, habit.id),
    longestStreak: calculateLongestStreak(logs, habit.id),
    completionRate: totalDays > 0 ? (completedLogs.length / totalDays) * 100 : 0,
    totalCompleted: completedLogs.length,
    totalDays,
  };
}

export function getWeeklyData(logs: HabitLog[], startDate: string): { date: string; count: number }[] {
  const data: { date: string; count: number }[] = [];
  const dateMap = new Map<string, number>();

  logs.forEach((log) => {
    if (log.completed) {
      dateMap.set(log.log_date, (dateMap.get(log.log_date) || 0) + 1);
    }
  });

  for (let i = 6; i >= 0; i--) {
    const date = new Date(startDate);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    data.push({
      date: dateStr,
      count: dateMap.get(dateStr) || 0,
    });
  }

  return data;
}

export function getMonthlyData(logs: HabitLog[], startDate: string): { date: string; count: number }[] {
  const data: { date: string; count: number }[] = [];
  const dateMap = new Map<string, number>();

  logs.forEach((log) => {
    if (log.completed) {
      dateMap.set(log.log_date, (dateMap.get(log.log_date) || 0) + 1);
    }
  });

  for (let i = 29; i >= 0; i--) {
    const date = new Date(startDate);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    data.push({
      date: dateStr,
      count: dateMap.get(dateStr) || 0,
    });
  }

  return data;
}
