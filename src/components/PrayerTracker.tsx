import { Check } from 'lucide-react';
import type { HabitWithLog } from '../lib/types';
import { toggleHabitCompletion } from '../lib/db';

interface PrayerTrackerProps {
  prayers: HabitWithLog[];
  date: string;
  onUpdate: () => void;
}

export default function PrayerTracker({ prayers, date, onUpdate }: PrayerTrackerProps) {
  const handleToggle = async (prayer: HabitWithLog) => {
    await toggleHabitCompletion(prayer.id, date, prayer.log?.completed || false);
    onUpdate();
  };

  const completedCount = prayers.filter((p) => p.log?.completed).length;
  const totalCount = prayers.length;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Daily Salah</h2>
        <div className="text-sm font-medium text-emerald-600">
          {completedCount}/{totalCount}
        </div>
      </div>

      <div className="space-y-3">
        {prayers.map((prayer) => {
          const isCompleted = prayer.log?.completed || false;

          return (
            <button
              key={prayer.id}
              onClick={() => handleToggle(prayer)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                isCompleted
                  ? 'bg-emerald-50 border-emerald-500'
                  : 'bg-gray-50 border-gray-200 hover:border-emerald-300'
              }`}
            >
              <span
                className={`font-medium ${
                  isCompleted ? 'text-emerald-700' : 'text-gray-700'
                }`}
              >
                {prayer.name}
              </span>

              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                  isCompleted
                    ? 'bg-emerald-500'
                    : 'bg-white border-2 border-gray-300'
                }`}
              >
                {isCompleted && <Check size={16} className="text-white" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
