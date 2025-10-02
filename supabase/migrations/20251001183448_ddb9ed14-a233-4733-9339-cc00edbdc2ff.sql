-- ============================================
-- SECURITY FIX: Remove sensitive data from publicly readable profiles table
-- ============================================

-- 1. Clear existing email and phone data from profiles table
--    These fields should not be duplicated here as they exist securely in auth.users
UPDATE public.profiles 
SET email = NULL, phone = NULL;

-- 2. Update the trigger to NOT copy email/phone to profiles
--    Users should get their email from supabase.auth.getUser() instead
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (id, alias)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$function$;

-- 3. Add helpful comment
COMMENT ON COLUMN public.profiles.email IS 'DEPRECATED: Do not use. Get user email from auth.users via supabase.auth.getUser()';
COMMENT ON COLUMN public.profiles.phone IS 'DEPRECATED: Do not use. Get user phone from auth.users via supabase.auth.getUser()';

-- 4. Future consideration: These columns could be dropped entirely in a future migration
--    For now, we keep them as NULL to avoid breaking existing queries