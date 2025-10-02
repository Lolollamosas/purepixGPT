-- Fix critical security issue: Block user access to payment events
-- Only service role (backend) can access this table

CREATE POLICY "Block user access to payment events" 
ON public.payments_events 
FOR SELECT 
USING (false);

-- Ensure no users can modify payment events either
CREATE POLICY "Block user updates to payment events" 
ON public.payments_events 
FOR UPDATE 
USING (false);

CREATE POLICY "Block user deletes of payment events" 
ON public.payments_events 
FOR DELETE 
USING (false);

-- Note: INSERT policy "admin insert events" already exists and uses USING (true)
-- which is correct - service role bypasses RLS, regular users will be blocked