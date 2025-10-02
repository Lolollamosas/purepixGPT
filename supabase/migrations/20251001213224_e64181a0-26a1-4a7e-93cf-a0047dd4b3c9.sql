-- Fix PII exposure in profiles table
-- Remove overly permissive policy and replace with granular policies

-- 1. Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Users can view public profiles" ON public.profiles;

-- 2. Create policy for viewing own complete profile (all fields including PII)
CREATE POLICY "Users can view their own complete profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- 3. Create policy for viewing public profile data (NO PII fields)
-- Note: This policy is applied in combination with the above. If user is viewing their own profile,
-- the first policy applies. If viewing another user's profile, this applies but the client
-- MUST explicitly exclude PII fields in the SELECT query for proper security.
CREATE POLICY "Public profiles viewable without PII"
ON public.profiles
FOR SELECT
USING (
  -- Only allow viewing other users' profiles if they are public
  ((privacy_settings ->> 'profile_public')::boolean = true)
  AND (auth.uid() != id OR auth.uid() IS NULL)
);

-- Important: The frontend MUST be updated to:
-- 1. When viewing own profile: SELECT all fields
-- 2. When viewing others' public profiles: SELECT only: id, alias, avatar_url, bio, location, website, privacy_settings, created_at, updated_at
-- 3. NEVER SELECT email, phone, wallet_address for other users' profiles