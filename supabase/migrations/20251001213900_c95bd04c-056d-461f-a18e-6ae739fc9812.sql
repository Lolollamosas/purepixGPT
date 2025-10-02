-- Secure profiles: remove public direct SELECT and expose a safe RPC for public profiles

-- 1) Drop overly permissive public SELECT policy on base table
DROP POLICY IF EXISTS "Public profiles viewable without PII" ON public.profiles;

-- Keep existing owner-only SELECT policy ("Users can view their own complete profile") and INSERT/UPDATE policies as-is

-- 2) Create a SECURITY DEFINER RPC that returns only non-PII fields for a single public profile
create or replace function public.get_public_profile(_id uuid)
returns table (
  id uuid,
  alias text,
  avatar_url text,
  bio text,
  location text,
  website text,
  privacy_settings jsonb,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    p.id,
    p.alias,
    p.avatar_url,
    p.bio,
    p.location,
    p.website,
    p.privacy_settings,
    p.created_at,
    p.updated_at
  from public.profiles p
  where p.id = _id
    and coalesce((p.privacy_settings ->> 'profile_public')::boolean, true) = true
$$;

-- 3) Grant execute to anon/authenticated roles
grant execute on function public.get_public_profile(uuid) to anon, authenticated;