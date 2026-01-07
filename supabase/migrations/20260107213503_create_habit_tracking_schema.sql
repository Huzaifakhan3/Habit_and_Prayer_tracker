/*
  # Habit Tracking Schema for Islamic and General Habits

  ## Overview
  This migration creates the core schema for a habit tracking application with support
  for Islamic practices (Salah, Qur'an) and general/custom habits.

  ## New Tables

  ### `habits`
  Stores habit definitions and configurations
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Display name of the habit (e.g., "Fajr", "Exercise")
  - `category` (text) - Category: 'prayer', 'quran', 'general', 'custom'
  - `habit_type` (text) - Type: 'checkbox', 'numeric', 'time'
  - `frequency` (text) - Reset frequency: 'daily', 'weekly'
  - `is_active` (boolean) - Whether habit is currently active/enabled
  - `is_predefined` (boolean) - Distinguishes built-in vs custom habits
  - `unit` (text, nullable) - Unit for numeric habits (e.g., 'pages', 'minutes')
  - `sort_order` (integer) - Display order for habits
  - `created_at` (timestamptz) - Creation timestamp

  ### `habit_logs`
  Stores daily habit completion records
  - `id` (uuid, primary key) - Unique identifier
  - `habit_id` (uuid, foreign key) - References habits table
  - `log_date` (date) - The date this log entry is for
  - `completed` (boolean) - Completion status for checkbox habits
  - `value` (numeric, nullable) - Value for numeric/time-based habits
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on both tables
  - Public read access for MVP (can be restricted later with auth)
  - Public write access for MVP (can be restricted later with auth)

  ## Notes
  - Unique constraint on (habit_id, log_date) prevents duplicate entries
  - Predefined habits include 5 daily prayers and Qur'an recitation
  - Historical data is preserved even when habits are disabled
*/

-- Create habits table
CREATE TABLE IF NOT EXISTS habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('prayer', 'quran', 'general', 'custom')),
  habit_type text NOT NULL CHECK (habit_type IN ('checkbox', 'numeric', 'time')),
  frequency text NOT NULL DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly')),
  is_active boolean NOT NULL DEFAULT true,
  is_predefined boolean NOT NULL DEFAULT false,
  unit text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create habit_logs table
CREATE TABLE IF NOT EXISTS habit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id uuid NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  log_date date NOT NULL,
  completed boolean NOT NULL DEFAULT false,
  value numeric,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(habit_id, log_date)
);

-- Create index for faster date-based queries
CREATE INDEX IF NOT EXISTS idx_habit_logs_date ON habit_logs(log_date DESC);
CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_date ON habit_logs(habit_id, log_date DESC);

-- Enable Row Level Security
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (MVP - can be restricted later with authentication)
CREATE POLICY "Allow public read access to habits"
  ON habits FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to habits"
  ON habits FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update to habits"
  ON habits FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from habits"
  ON habits FOR DELETE
  TO anon
  USING (true);

CREATE POLICY "Allow public read access to habit_logs"
  ON habit_logs FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert to habit_logs"
  ON habit_logs FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public update to habit_logs"
  ON habit_logs FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete from habit_logs"
  ON habit_logs FOR DELETE
  TO anon
  USING (true);

-- Insert predefined Islamic habits (5 daily prayers)
INSERT INTO habits (name, category, habit_type, frequency, is_active, is_predefined, sort_order)
VALUES
  ('Fajr', 'prayer', 'checkbox', 'daily', true, true, 1),
  ('Dhuhr', 'prayer', 'checkbox', 'daily', true, true, 2),
  ('Asr', 'prayer', 'checkbox', 'daily', true, true, 3),
  ('Maghrib', 'prayer', 'checkbox', 'daily', true, true, 4),
  ('Isha', 'prayer', 'checkbox', 'daily', true, true, 5),
  ('Qur''an Recitation', 'quran', 'numeric', 'daily', true, true, 6)
ON CONFLICT DO NOTHING;

-- Update unit for Qur'an habit
UPDATE habits SET unit = 'pages' WHERE name = 'Qur''an Recitation' AND is_predefined = true;