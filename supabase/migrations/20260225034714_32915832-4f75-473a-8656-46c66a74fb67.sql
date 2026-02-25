
-- Fix all RLS SELECT policies: drop RESTRICTIVE ones, recreate as PERMISSIVE
-- points_table
DROP POLICY IF EXISTS "Anyone can view points table" ON public.points_table;
CREATE POLICY "Public read points_table" ON public.points_table FOR SELECT TO anon, authenticated USING (true);

-- upcoming_matches
DROP POLICY IF EXISTS "Anyone can view upcoming matches" ON public.upcoming_matches;
CREATE POLICY "Public read upcoming_matches" ON public.upcoming_matches FOR SELECT TO anon, authenticated USING (true);

-- top_performers
DROP POLICY IF EXISTS "Anyone can view top performers" ON public.top_performers;
CREATE POLICY "Public read top_performers" ON public.top_performers FOR SELECT TO anon, authenticated USING (true);

-- gallery_images
DROP POLICY IF EXISTS "Anyone can view gallery images" ON public.gallery_images;
CREATE POLICY "Public read gallery_images" ON public.gallery_images FOR SELECT TO anon, authenticated USING (true);

-- Add unique constraint on team_name for upsert to work
ALTER TABLE public.points_table ADD CONSTRAINT points_table_team_name_unique UNIQUE (team_name);
