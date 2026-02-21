
ALTER TABLE public.top_performers
ADD COLUMN IF NOT EXISTS matches_played integer NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS matches_won integer NOT NULL DEFAULT 0;
