/*
  # Create patient records table

  1. New Tables
    - `patient_records`
      - `id` (uuid, primary key)
      - `full_name` (text)
      - `age` (integer)
      - `gender` (text)
      - `weight` (decimal)
      - `height` (decimal)
      - `glucose` (decimal)
      - `triglycerides` (decimal)
      - `hdl` (decimal)
      - `hba1c` (decimal)
      - `diabetes` (text)
      - `bmi` (decimal)
      - `tyg_index` (decimal)
      - `tg_hdl_ratio` (decimal)
      - `risk_level` (text)
      - `risk_description` (text)
      - `ai_recommendations` (text)
      - `created_at` (timestamp)
      - `created_by` (text)

  2. Security
    - Enable RLS on `patient_records` table
    - Add policy for authenticated users to manage their records
*/

CREATE TABLE IF NOT EXISTS patient_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  age integer NOT NULL,
  gender text NOT NULL,
  weight decimal(5,2) NOT NULL,
  height decimal(3,2) NOT NULL,
  glucose decimal(6,2) NOT NULL,
  triglycerides decimal(6,2) NOT NULL,
  hdl decimal(6,2) NOT NULL,
  hba1c decimal(4,2) NOT NULL,
  diabetes text NOT NULL,
  bmi decimal(4,1) NOT NULL,
  tyg_index decimal(5,2) NOT NULL,
  tg_hdl_ratio decimal(5,2) NOT NULL,
  risk_level text NOT NULL,
  risk_description text,
  ai_recommendations text,
  created_at timestamptz DEFAULT now(),
  created_by text NOT NULL
);

ALTER TABLE patient_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Healthcare staff can manage patient records"
  ON patient_records
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_patient_records_created_at ON patient_records(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_patient_records_created_by ON patient_records(created_by);
CREATE INDEX IF NOT EXISTS idx_patient_records_risk_level ON patient_records(risk_level);