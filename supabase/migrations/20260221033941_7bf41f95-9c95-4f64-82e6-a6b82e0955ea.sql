
-- Gallery images table
CREATE TABLE public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  alt_text TEXT NOT NULL DEFAULT '',
  display_order INT NOT NULL DEFAULT 0,
  show_on_homepage BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view gallery images"
ON public.gallery_images FOR SELECT USING (true);

CREATE POLICY "Service role can manage gallery images"
ON public.gallery_images FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Points table
CREATE TABLE public.points_table (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name TEXT NOT NULL UNIQUE,
  played INT NOT NULL DEFAULT 0,
  won INT NOT NULL DEFAULT 0,
  lost INT NOT NULL DEFAULT 0,
  points INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.points_table ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view points table"
ON public.points_table FOR SELECT USING (true);

CREATE POLICY "Service role can manage points table"
ON public.points_table FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Upcoming matches
CREATE TABLE public.upcoming_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team1 TEXT NOT NULL,
  team2 TEXT NOT NULL,
  match_date DATE NOT NULL,
  match_time TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT 'Nagendrajha Stadium',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.upcoming_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view upcoming matches"
ON public.upcoming_matches FOR SELECT USING (true);

CREATE POLICY "Service role can manage upcoming matches"
ON public.upcoming_matches FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Top performers
CREATE TABLE public.top_performers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (category IN ('orange', 'purple', 'mvp')),
  name TEXT NOT NULL,
  team TEXT NOT NULL,
  runs INT NOT NULL DEFAULT 0,
  wickets INT NOT NULL DEFAULT 0,
  photo_url TEXT,
  stat_value INT NOT NULL DEFAULT 0,
  stat_label TEXT NOT NULL DEFAULT 'Runs',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.top_performers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view top performers"
ON public.top_performers FOR SELECT USING (true);

CREATE POLICY "Service role can manage top performers"
ON public.top_performers FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Storage bucket for gallery
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true);

CREATE POLICY "Anyone can view gallery files"
ON storage.objects FOR SELECT USING (bucket_id = 'gallery');

CREATE POLICY "Service role can upload gallery files"
ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "Service role can delete gallery files"
ON storage.objects FOR DELETE USING (bucket_id = 'gallery');
