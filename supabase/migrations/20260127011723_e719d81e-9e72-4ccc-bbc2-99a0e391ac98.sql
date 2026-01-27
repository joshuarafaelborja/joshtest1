-- Fix function search path for generate_unique_slug
CREATE OR REPLACE FUNCTION public.generate_unique_slug()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  new_slug TEXT;
  slug_exists BOOLEAN;
BEGIN
  LOOP
    new_slug := lower(substring(md5(random()::text) from 1 for 8));
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE slug = new_slug) INTO slug_exists;
    EXIT WHEN NOT slug_exists;
  END LOOP;
  RETURN new_slug;
END;
$$;

-- Fix function search path for update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;