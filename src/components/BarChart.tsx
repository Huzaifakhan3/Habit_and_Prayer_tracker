interface BarChartProps {
  data: { date: string; count: number }[];
  maxValue?: number;
}

export default function BarChart({ data, maxValue }: BarChartProps) {
  const max = maxValue || Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="flex items-end justify-between gap-1 h-40">
      {data.map((item, index) => {
        const height = max > 0 ? (item.count / max) * 100 : 0;
        const date = new Date(item.date);
        const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);

        return (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full bg-gray-100 rounded-t-lg relative h-full flex items-end">
              {height > 0 && (
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-emerald-400 rounded-t-lg transition-all duration-500"
                  style={{ height: `${height}%` }}
                />
              )}
            </div>
            <div className="text-xs text-gray-500 font-medium">{dayLabel}</div>
          </div>
        );
      })}
    </div>
  );
}
