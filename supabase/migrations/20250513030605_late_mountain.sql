-- First, drop existing admin policy to avoid conflicts
DROP POLICY IF EXISTS "Admin users can access all registrations" ON conference_registrations;

-- Create comprehensive admin policy
CREATE POLICY "Admin users can access all registrations"
  ON conference_registrations
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
  WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- Update the user read policy to be more specific
DROP POLICY IF EXISTS "Users can read own conference registrations" ON conference_registrations;
CREATE POLICY "Users can read own conference registrations"
  ON conference_registrations
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() ->> 'role'::text) != 'admin'::text 
    AND auth.uid() = id
  );

-- Ensure anon insert policy exists
DROP POLICY IF EXISTS "Anyone can insert conference registrations" ON conference_registrations;
CREATE POLICY "Anyone can insert conference registrations"
  ON conference_registrations
  FOR INSERT
  TO anon
  WITH CHECK (true);