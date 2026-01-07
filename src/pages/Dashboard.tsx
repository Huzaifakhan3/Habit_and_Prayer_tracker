import { useState, useEffect } from 'react';
import { Plus, TrendingUp } from 'lucide-react';
import PrayerTracker from '../components/PrayerTracker';
import QuranTracker from '../components/QuranTracker';
import HabitItem from '../components/HabitItem';
import AddHabitModal from '../components/AddHabitModal';
import MotivationalMessage from '../components/MotivationalMessage';
import { fetchHabitsWithLogs, deleteHabit } from '../lib/db';
import { getTodayDate } from '../lib/utils';
import type { HabitWithLog } from '../lib/types';

interface DashboardProps {
  onNavigate: (page: 'dashboard' | 'insights') => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [habits, setHabits] = useState<HabitWithLog[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const today = getTodayDate();

  const loadHabits = async () => {
    try {
      const data = await fetchHabitsWithLogs(today);
      setHabits(data);
    } catch (error) {
      console.error('Error loading habits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHabits();
  }, []);

  const handleDelete = async (habitId: string) => {
    if (confirm('Are you sure you want to delete this habit?')) {
      await deleteHabit(habitId);
      loadHabits();
    }
  };

  const prayers = habits.filter((h) => h.category === 'prayer');
  const quranHabit = habits.find((h) => h.category === 'quran');
  const otherHabits = habits.filter((h) => h.category !== 'prayer' && h.category !== 'quran');

  const totalCompleted = habits.filter((h) => h.log?.completed).length;
  const totalHabits = habits.length;
  const completionPercentage = totalHabits > 0 ? Math.round((totalCompleted / totalHabits) * 100) : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-800">My Habits</h1>
            <button
              onClick={() => onNavigate('insights')}
              className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
            >
              <TrendingUp size={24} className="text-blue-600" />
            </button>
          </div>
          <p className="text-gray-600">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>

          <div className="mt-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Today's Progress</span>
              <span className="text-lg font-semibold text-blue-600">{completionPercentage}%</span>
            </div>
            <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {totalHabits > 0 && (
            <div className="mt-4">
              <MotivationalMessage completionPercentage={completionPercentage} />
            </div>
          )}
        </header>

        <div className="space-y-6">
          {prayers.length > 0 && (
            <PrayerTracker prayers={prayers} date={today} onUpdate={loadHabits} />
          )}

          {quranHabit && (
            <QuranTracker habit={quranHabit} date={today} onUpdate={loadHabits} />
          )}

          {otherHabits.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Other Habits</h2>
              <div className="space-y-3">
                {otherHabits.map((habit) => (
                  <HabitItem
                    key={habit.id}
                    habit={habit}
                    date={today}
                    onUpdate={loadHabits}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-all flex items-center justify-center gap-2 font-medium"
          >
            <Plus size={20} />
            Add Custom Habit
          </button>
        </div>

        <AddHabitModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={loadHabits}
        />
      </div>
    </div>
  );
}
