import { useState, useEffect } from 'react';
import { Check, BookOpen } from 'lucide-react';
import type { HabitWithLog } from '../lib/types';
import { updateHabitValue } from '../lib/db';

interface QuranTrackerProps {
  habit: HabitWithLog;
  date: string;
  onUpdate: () => void;
}

export default function QuranTracker({ habit, date, onUpdate }: QuranTrackerProps) {
  const [value, setValue] = useState<string>(habit.log?.value?.toString() || '');
  const [isEditing, setIsEditing] = useState(false);
  const isCompleted = habit.log?.completed || false;

  useEffect(() => {
    setValue(habit.log?.value?.toString() || '');
  }, [habit.log?.value]);

  const handleSave = async () => {
    const numValue = parseFloat(value) || 0;
    if (numValue >= 0) {
      await updateHabitValue(habit.id, date, numValue);
      onUpdate();
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setValue(habit.log?.value?.toString() || '');
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
          <BookOpen size={20} className="text-teal-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Qur'an Recitation</h2>
      </div>

      <div className="flex items-center gap-3">
        {isEditing ? (
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            placeholder="0"
            min="0"
            step="0.5"
            autoFocus
            className="flex-1 px-4 py-3 border-2 border-teal-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all text-left ${
              isCompleted
                ? 'bg-teal-50 border-teal-500'
                : 'bg-gray-50 border-gray-200 hover:border-teal-300'
            }`}
          >
            <span className={isCompleted ? 'text-teal-700' : 'text-gray-500'}>
              {value ? `${value} ${habit.unit || 'pages'}` : `Enter ${habit.unit || 'pages'}...`}
            </span>
          </button>
        )}

        {isCompleted && (
          <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center">
            <Check size={20} className="text-white" />
          </div>
        )}
      </div>
    </div>
  );
}
