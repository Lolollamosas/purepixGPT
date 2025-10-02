
-- Crear tabla de perfiles de usuario
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  alias TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  wallet_address TEXT,
  avatar_url TEXT,
  bio TEXT DEFAULT 'Hola, soy nuevo en PurePix',
  location TEXT,
  website TEXT,
  privacy_settings JSONB DEFAULT '{"profile_public": true, "images_public": true}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla para historial de imágenes
CREATE TABLE public.user_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  metadata JSONB,
  nft_data JSONB,
  caption TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_images ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view public profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (
    (privacy_settings->>'profile_public')::boolean = true OR 
    auth.uid() = id
  );

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Políticas para user_images
CREATE POLICY "Users can view public images or their own" 
  ON public.user_images 
  FOR SELECT 
  USING (
    is_public = true OR 
    auth.uid() = user_id
  );

CREATE POLICY "Users can insert their own images" 
  ON public.user_images 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own images" 
  ON public.user_images 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own images" 
  ON public.user_images 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Función para crear perfil automáticamente cuando se registra un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, alias, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para ejecutar la función cuando se crea un nuevo usuario
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at en profiles
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
