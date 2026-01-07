import { useState, useEffect } from 'react';
import { ArrowLeft, TrendingUp, Flame, Target, Calendar } from 'lucide-react';
import BarChart from '../components/BarChart';
import { fetchHabits, fetchLogsInRange } from '../lib/db';
import { getTodayDate, getWeekStart, getMonthStart } from '../lib/utils';
import { calculateHabitStats, getWeeklyData, getMonthlyData } from '../lib/analytics';
import type { Habit, HabitLog } from '../lib/types';

interface InsightsProps {
  onNavigate: (page: 'dashboard' | 'insights') => void;
}

export default function Insights({ onNavigate }: InsightsProps) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    try {
      const habitsData = await fetchHabits();
      const today = getTodayDate();
      const startDate = period === 'week' ? getWeekStart() : getMonthStart();

      const logsData = await fetchLogsInRange(startDate, today);

      setHabits(habitsData);
      setLogs(logsData);
    } catch (error) {
      console.error('Error loading insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 flex items-center justify-center">
        <div className="text-gray-600">Loading insights...</div>
      </div>
    );
  }

  const today = getTodayDate();
  const chartData = period === 'week' ? getWeeklyData(logs, today) : getMonthlyData(logs, today);
  const totalDays = period === 'week' ? 7 : 30;
  const stats = habits.map((habit) => calculateHabitStats(habit, logs, totalDays));

  const totalCompletions = logs.filter((log) => log.completed).length;
  const totalPossible = habits.length * totalDays;
  const overallCompletionRate = totalPossible > 0 ? (totalCompletions / totalPossible) * 100 : 0;

  const topHabits = stats
    .filter((s) => s.completionRate > 0)
    .sort((a, b) => b.completionRate - a.completionRate)
    .slice(0, 3);

  const needsImprovement = stats
    .filter((s) => s.completionRate < 100 && s.completionRate >= 0)
    .sort((a, b) => a.completionRate - b.completionRate)
    .slice(0, 3);

  const bestStreak = stats.reduce(
    (max, stat) => (stat.currentStreak > max ? stat.currentStreak : max),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="p-2 hover:bg-white rounded-xl transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Insights & Progress</h1>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setPeriod('week')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                period === 'week'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                period === 'month'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Month
            </button>
          </div>
        </header>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <TrendingUp size={20} className="text-blue-600" />
                </div>
                <span className="text-sm text-gray-600">Completion Rate</span>
              </div>
              <div className="text-3xl font-bold text-gray-800">
                {overallCompletionRate.toFixed(0)}%
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Flame size={20} className="text-orange-600" />
                </div>
                <span className="text-sm text-gray-600">Best Streak</span>
              </div>
              <div className="text-3xl font-bold text-gray-800">
                {bestStreak} <span className="text-lg text-gray-500">days</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Target size={20} className="text-emerald-600" />
                </div>
                <span className="text-sm text-gray-600">Total Completed</span>
              </div>
              <div className="text-3xl font-bold text-gray-800">{totalCompletions}</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <Calendar size={24} className="text-gray-700" />
              <h2 className="text-xl font-semibold text-gray-800">
                {period === 'week' ? 'This Week' : 'This Month'}
              </h2>
            </div>
            <BarChart data={chartData} maxValue={habits.length} />
          </div>

          {topHabits.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">🌟</span>
                Strong Habits
              </h2>
              <div className="space-y-3">
                {topHabits.map((stat) => (
                  <div key={stat.habitId} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-800">{stat.habitName}</span>
                        <span className="text-sm text-emerald-600 font-semibold">
                          {stat.completionRate.toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all"
                          style={{ width: `${stat.completionRate}%` }}
                        />
                      </div>
                      {stat.currentStreak > 0 && (
                        <div className="mt-1 text-xs text-gray-500">
                          <Flame size={12} className="inline text-orange-500" /> {stat.currentStreak}{' '}
                          day streak
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {needsImprovement.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                Room for Growth
              </h2>
              <div className="space-y-3">
                {needsImprovement.map((stat) => (
                  <div key={stat.habitId} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-800">{stat.habitName}</span>
                        <span className="text-sm text-blue-600 font-semibold">
                          {stat.completionRate.toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all"
                          style={{ width: `${stat.completionRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
