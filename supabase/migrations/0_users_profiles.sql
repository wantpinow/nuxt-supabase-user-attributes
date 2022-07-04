-- Metadata table (editable by admins)
CREATE TABLE IF NOT EXISTS public.user_metadata
(
    id UUID NOT NULL,
    role TEXT COLLATE pg_catalog."default" DEFAULT 'user'::TEXT,
    email TEXT NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_id_fkey FOREIGN KEY (id)
        REFERENCES auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

-- Profiles table (editable by all users)
CREATE TABLE IF NOT EXISTS public.profiles
(
    id UUID NOT NULL,
    CONSTRAINT profiles_pkey PRIMARY KEY (id),
    CONSTRAINT profiles_id_fkey FOREIGN KEY (id)
        REFERENCES auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

-- DB trigger: insert into metadata and profiles when new user registers
CREATE OR REPLACE FUNCTION public.add_public_user()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF SECURITY DEFINER
    SET search_path=public
AS $BODY$
BEGIN
  INSERT INTO public.user_metadata (id, email)
  VALUES (new.id, new.email) ON CONFLICT DO NOTHING;
  INSERT INTO public.profiles (id)
  VALUES (new.id) ON CONFLICT DO NOTHING;
  RETURN new;
END;
$BODY$;

CREATE trigger on_auth_user__CREATEd
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.add_public_user();

-- DB trigger: ensure the public.user_metadata.email field matches auth.users.email
CREATE OR REPLACE FUNCTION public.update_public_user()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF SECURITY DEFINER
    SET search_path=public
AS $BODY$
BEGIN
  UPDATE public.user_metadata SET email = new.email WHERE id=new.id; 
  RETURN new;
END;
$BODY$;

CREATE trigger on_auth_user__updated
  after update on auth.users
  for each row execute procedure public.update_public_user();


-- Helper function for RLS: select user role
CREATE or replace function public.user_role(_user_id uuid)
RETURNS TEXT
language sql
SECURITY DEFINER
SET search_path = public
stable
AS $$
    SELECT role
    FROM public.user_metadata
    WHERE public.user_metadata.id = _user_id;
$$;

-- RLS: enable
ALTER TABLE IF EXISTS public.user_metadata
    ENABLE ROW LEVEL SECURITY;

ALTER TABLE IF EXISTS public.profiles
    ENABLE ROW LEVEL SECURITY;

-- RLS: admins can view all user metadata
CREATE POLICY user_metadata__admin_select_all
    ON public.user_metadata
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING ((user_role(auth.uid()) = 'admin'::TEXT));

-- RLS: admins can update all user metadata
CREATE POLICY user_metadata__admin_update_all
    ON public.user_metadata
    AS PERMISSIVE
    FOR UPDATE
    TO public
    USING ((user_role(auth.uid()) = 'admin'::TEXT));

-- RLS: users can view their own metadata
CREATE POLICY user_metadata__user_select_own
    ON public.user_metadata
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING ((auth.uid() = id));

-- RLS: admins can view all profiles
CREATE POLICY profiles__admin_select_all
    ON public.profiles
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING ((user_role(auth.uid()) = 'admin'::TEXT));

-- RLS: admins can update all profiles
CREATE POLICY profiles__admin_update_all
    ON public.profiles
    AS PERMISSIVE
    FOR UPDATE
    TO public
    USING ((user_role(auth.uid()) = 'admin'::TEXT));

-- RLS: users can view their own profile
CREATE POLICY profiles__user_select_own
    ON public.profiles
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING ((auth.uid() = id));

-- RLS: users can update their own metadata
CREATE POLICY profiles__user_update_own
    ON public.profiles
    AS PERMISSIVE
    FOR UPDATE
    TO public
    USING ((auth.uid() = id));
