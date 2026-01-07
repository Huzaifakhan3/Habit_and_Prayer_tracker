export type Database = {
  public: {
    Tables: {
      habits: {
        Row: {
          id: string;
          name: string;
          category: 'prayer' | 'quran' | 'general' | 'custom';
          habit_type: 'checkbox' | 'numeric' | 'time';
          frequency: 'daily' | 'weekly';
          is_active: boolean;
          is_predefined: boolean;
          unit: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: 'prayer' | 'quran' | 'general' | 'custom';
          habit_type: 'checkbox' | 'numeric' | 'time';
          frequency?: 'daily' | 'weekly';
          is_active?: boolean;
          is_predefined?: boolean;
          unit?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: 'prayer' | 'quran' | 'general' | 'custom';
          habit_type?: 'checkbox' | 'numeric' | 'time';
          frequency?: 'daily' | 'weekly';
          is_active?: boolean;
          is_predefined?: boolean;
          unit?: string | null;
          sort_order?: number;
          created_at?: string;
        };
      };
      habit_logs: {
        Row: {
          id: string;
          habit_id: string;
          log_date: string;
          completed: boolean;
          value: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          habit_id: string;
          log_date: string;
          completed?: boolean;
          value?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          habit_id?: string;
          log_date?: string;
          completed?: boolean;
          value?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};

export type Habit = Database['public']['Tables']['habits']['Row'];
export type HabitLog = Database['public']['Tables']['habit_logs']['Row'];

export interface HabitWithLog extends Habit {
  log?: HabitLog | null;
}
