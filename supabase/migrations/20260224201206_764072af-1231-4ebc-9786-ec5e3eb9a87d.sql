
CREATE TABLE public.scoreboard_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.scoreboard_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view scoreboard updates" ON public.scoreboard_updates FOR SELECT USING (true);
CREATE POLICY "Service role can manage scoreboard updates" ON public.scoreboard_updates FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
