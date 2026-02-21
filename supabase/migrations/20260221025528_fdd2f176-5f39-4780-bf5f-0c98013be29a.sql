
CREATE TABLE public.registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  dob DATE NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  document_type TEXT NOT NULL,
  document_number TEXT NOT NULL,
  player_type TEXT NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public registration form)
CREATE POLICY "Anyone can submit registration"
  ON public.registrations FOR INSERT
  WITH CHECK (true);

-- No one can read registrations from the client (only edge function/service role)
CREATE POLICY "No public read access"
  ON public.registrations FOR SELECT
  USING (false);
