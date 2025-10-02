-- Tabla de pagos
CREATE TABLE IF NOT EXISTS public.payments (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  mp_preference_id TEXT,
  status TEXT DEFAULT 'created',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabla de eventos de pagos (webhook)
CREATE TABLE IF NOT EXISTS public.payments_events (
  id BIGSERIAL PRIMARY KEY,
  mp_id TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments_events ENABLE ROW LEVEL SECURITY;

-- Políticas para payments
CREATE POLICY "user can view own payments"
  ON public.payments FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "admin insert via service role"
  ON public.payments FOR INSERT WITH CHECK (true);

-- Políticas para payments_events
CREATE POLICY "admin insert events"
  ON public.payments_events FOR INSERT WITH CHECK (true);

-- Trigger para updated_at en payments
CREATE TRIGGER set_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Políticas de Storage para bucket post-images

-- Lectura pública
CREATE POLICY "public read post images"
ON storage.objects FOR SELECT
USING (bucket_id = 'post-images');

-- Subida solo autenticados
CREATE POLICY "auth upload post images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'post-images' AND auth.role() = 'authenticated');

-- Borrado solo dueño
CREATE POLICY "owner delete post images"
ON storage.objects FOR DELETE
USING (bucket_id = 'post-images' AND owner = auth.uid());