/*
  # Add Hall of Fame nomination policies

  1. Changes
    - Enable RLS on hall_of_fame_nominations table
    - Add policies for status updates by admin users
    - Add policies for public read access
    - Add policies for public insert access

  2. Security
    - Enable RLS
    - Admin users can perform all operations
    - Public users can read and submit nominations
*/

-- Enable RLS
ALTER TABLE hall_of_fame_nominations ENABLE ROW LEVEL SECURITY;

-- Remove any existing policies
DROP POLICY IF EXISTS "Allow admin full access to nominations" ON hall_of_fame_nominations;
DROP POLICY IF EXISTS "Allow public to read nominations" ON hall_of_fame_nominations;
DROP POLICY IF EXISTS "Anyone can insert hall of fame nominations" ON hall_of_fame_nominations;

-- Add admin policy for all operations
CREATE POLICY "Allow admin full access to nominations"
ON hall_of_fame_nominations
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Add read policy for all users
CREATE POLICY "Allow public to read nominations"
ON hall_of_fame_nominations
FOR SELECT
TO public
USING (true);

-- Add insert policy for public submissions
CREATE POLICY "Anyone can insert hall of fame nominations"
ON hall_of_fame_nominations
FOR INSERT
TO public
WITH CHECK (true);