import { Sparkles } from 'lucide-react';

interface MotivationalMessageProps {
  completionPercentage: number;
}

const messages = {
  100: [
    'Outstanding! You completed all your habits today!',
    'Perfect day! Keep up the amazing work!',
    'All done! Your dedication is inspiring!',
  ],
  80: [
    'Great progress! You are almost there!',
    'Wonderful effort today!',
    'You are doing amazing!',
  ],
  50: [
    'Good start! Keep going!',
    'You are making progress!',
    'Every habit counts!',
  ],
  0: [
    'New day, new opportunities!',
    'Start with one small habit!',
    'You can do this!',
  ],
};

export default function MotivationalMessage({ completionPercentage }: MotivationalMessageProps) {
  let messageArray = messages[0];

  if (completionPercentage === 100) {
    messageArray = messages[100];
  } else if (completionPercentage >= 80) {
    messageArray = messages[80];
  } else if (completionPercentage >= 50) {
    messageArray = messages[50];
  }

  const message = messageArray[Math.floor(Math.random() * messageArray.length)];

  if (completionPercentage < 50 && completionPercentage > 0) {
    return null;
  }

  return (
    <div
      className={`p-4 rounded-xl border-2 flex items-center gap-3 ${
        completionPercentage === 100
          ? 'bg-emerald-50 border-emerald-200'
          : completionPercentage >= 80
          ? 'bg-blue-50 border-blue-200'
          : 'bg-gray-50 border-gray-200'
      }`}
    >
      <Sparkles
        size={24}
        className={
          completionPercentage === 100
            ? 'text-emerald-600'
            : completionPercentage >= 80
            ? 'text-blue-600'
            : 'text-gray-600'
        }
      />
      <p
        className={`font-medium ${
          completionPercentage === 100
            ? 'text-emerald-700'
            : completionPercentage >= 80
            ? 'text-blue-700'
            : 'text-gray-700'
        }`}
      >
        {message}
      </p>
    </div>
  );
}
