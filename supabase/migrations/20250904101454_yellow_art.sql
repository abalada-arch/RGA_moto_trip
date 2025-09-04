/*
  # Create trip recordings table

  1. New Tables
    - `trip_recordings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz, nullable)
      - `distance` (real, default 0)
      - `duration` (real, default 0)
      - `average_speed` (real, default 0)
      - `max_speed` (real, default 0)
      - `max_lean` (real, default 0)
      - `coordinates` (jsonb, array of GPS points)
      - `stage_name` (text, nullable)
      - `is_recording` (boolean, default false)
      - `created_at` (timestamptz, default now)

  2. Security
    - Enable RLS on `trip_recordings` table
    - Add policies for authenticated users to manage their own recordings
*/

CREATE TABLE IF NOT EXISTS trip_recordings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  distance real DEFAULT 0,
  duration real DEFAULT 0,
  average_speed real DEFAULT 0,
  max_speed real DEFAULT 0,
  max_lean real DEFAULT 0,
  coordinates jsonb,
  stage_name text,
  is_recording boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE trip_recordings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own trip recordings"
  ON trip_recordings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own trip recordings"
  ON trip_recordings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trip recordings"
  ON trip_recordings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trip recordings"
  ON trip_recordings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);