export function getTodayDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

export function getDateRange(days: number): { start: string; end: string } {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days + 1);

  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
}

export function formatDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getWeekStart(): string {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day;
  const weekStart = new Date(today.setDate(diff));
  return weekStart.toISOString().split('T')[0];
}

export function getMonthStart(): string {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
}
