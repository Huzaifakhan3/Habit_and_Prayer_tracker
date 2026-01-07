import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import type { HabitWithLog } from '../lib/types';
import { toggleHabitCompletion, updateHabitValue } from '../lib/db';

interface HabitItemProps {
  habit: HabitWithLog;
  date: string;
  onUpdate: () => void;
  onDelete?: (id: string) => void;
}

export default function HabitItem({ habit, date, onUpdate, onDelete }: HabitItemProps) {
  const [value, setValue] = useState<string>(habit.log?.value?.toString() || '');
  const [isEditing, setIsEditing] = useState(false);
  const isCompleted = habit.log?.completed || false;

  useEffect(() => {
    setValue(habit.log?.value?.toString() || '');
  }, [habit.log?.value]);

  const handleToggle = async () => {
    if (habit.habit_type === 'checkbox') {
      await toggleHabitCompletion(habit.id, date, isCompleted);
      onUpdate();
    }
  };

  const handleSave = async () => {
    if (habit.habit_type !== 'checkbox') {
      const numValue = parseFloat(value) || 0;
      if (numValue >= 0) {
        await updateHabitValue(habit.id, date, numValue);
        onUpdate();
      }
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

  const renderCheckbox = () => (
    <button
      onClick={handleToggle}
      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
        isCompleted
          ? 'bg-blue-50 border-blue-500'
          : 'bg-gray-50 border-gray-200 hover:border-blue-300'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`font-medium ${isCompleted ? 'text-blue-700' : 'text-gray-700'}`}>
          {habit.name}
        </span>
        {!habit.is_predefined && onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(habit.id);
            }}
            className="p-1 hover:bg-red-100 rounded-full transition-colors"
          >
            <X size={16} className="text-red-500" />
          </button>
        )}
      </div>

      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
          isCompleted ? 'bg-blue-500' : 'bg-white border-2 border-gray-300'
        }`}
      >
        {isCompleted && <Check size={16} className="text-white" />}
      </div>
    </button>
  );

  const renderNumeric = () => (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        {isEditing ? (
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            placeholder="0"
            min="0"
            step="1"
            autoFocus
            className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all text-left ${
              isCompleted
                ? 'bg-blue-50 border-blue-500'
                : 'bg-gray-50 border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={isCompleted ? 'text-blue-700 font-medium' : 'text-gray-700'}>
                  {habit.name}
                </span>
                {!habit.is_predefined && onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(habit.id);
                    }}
                    className="p-1 hover:bg-red-100 rounded-full transition-colors"
                  >
                    <X size={14} className="text-red-500" />
                  </button>
                )}
              </div>
              <span className={isCompleted ? 'text-blue-600' : 'text-gray-500'}>
                {value ? `${value} ${habit.unit || ''}` : `0 ${habit.unit || ''}`}
              </span>
            </div>
          </button>
        )}
      </div>

      {isCompleted && (
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
          <Check size={20} className="text-white" />
        </div>
      )}
    </div>
  );

  if (habit.habit_type === 'checkbox') {
    return renderCheckbox();
  }

  return renderNumeric();
}
