
-- Fix points_table: drop restrictive SELECT, create permissive SELECT
DROP POLICY IF EXISTS "Anyone can view points table" ON public.points_table;
CREATE POLICY "Anyone can view points table" ON public.points_table FOR SELECT USING (true);

-- Fix scoreboard_updates
DROP POLICY IF EXISTS "Anyone can view scoreboard updates" ON public.scoreboard_updates;
CREATE POLICY "Anyone can view scoreboard updates" ON public.scoreboard_updates FOR SELECT USING (true);

-- Fix news
DROP POLICY IF EXISTS "Anyone can view news" ON public.news;
CREATE POLICY "Anyone can view news" ON public.news FOR SELECT USING (true);

-- Fix gallery_images
DROP POLICY IF EXISTS "Anyone can view gallery images" ON public.gallery_images;
CREATE POLICY "Anyone can view gallery images" ON public.gallery_images FOR SELECT USING (true);

-- Fix upcoming_matches
DROP POLICY IF EXISTS "Anyone can view upcoming matches" ON public.upcoming_matches;
CREATE POLICY "Anyone can view upcoming matches" ON public.upcoming_matches FOR SELECT USING (true);

-- Fix top_performers
DROP POLICY IF EXISTS "Anyone can view top performers" ON public.top_performers;
CREATE POLICY "Anyone can view top performers" ON public.top_performers FOR SELECT USING (true);
