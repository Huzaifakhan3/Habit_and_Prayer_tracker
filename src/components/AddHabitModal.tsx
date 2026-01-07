import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { addCustomHabit } from '../lib/db';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
}

export default function AddHabitModal({ isOpen, onClose, onAdd }: AddHabitModalProps) {
  const [name, setName] = useState('');
  const [habitType, setHabitType] = useState<'checkbox' | 'numeric' | 'time'>('checkbox');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [unit, setUnit] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await addCustomHabit(
        name.trim(),
        habitType,
        frequency,
        habitType !== 'checkbox' ? unit.trim() || undefined : undefined
      );
      setName('');
      setHabitType('checkbox');
      setFrequency('daily');
      setUnit('');
      onAdd();
      onClose();
    } catch (error) {
      console.error('Error adding habit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Add Custom Habit</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Habit Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Morning Exercise"
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tracking Type
            </label>
            <select
              value={habitType}
              onChange={(e) => setHabitType(e.target.value as 'checkbox' | 'numeric' | 'time')}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="checkbox">Checkbox (Done/Not Done)</option>
              <option value="numeric">Numeric (Track Numbers)</option>
              <option value="time">Time-based (Track Duration)</option>
            </select>
          </div>

          {habitType !== 'checkbox' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit (optional)
              </label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="e.g., minutes, reps, km"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frequency
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as 'daily' | 'weekly')}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add Habit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
