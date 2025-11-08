-- Add onboarding and profile fields to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS birth_year INTEGER,
ADD COLUMN IF NOT EXISTS height_cm INTEGER,
ADD COLUMN IF NOT EXISTS weight_kg NUMERIC(5,2),
ADD COLUMN IF NOT EXISTS interests TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Update consents table to include required acceptance fields
ALTER TABLE public.consents
ADD COLUMN IF NOT EXISTS accepted_terms BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS accepted_privacy BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create device_connections table
CREATE TABLE IF NOT EXISTS public.device_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  access_token TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'connected',
  last_sync_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metrics_json JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on device_connections
ALTER TABLE public.device_connections ENABLE ROW LEVEL SECURITY;

-- Create policies for device_connections
CREATE POLICY "Users can view their own device connections"
ON public.device_connections
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own device connections"
ON public.device_connections
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own device connections"
ON public.device_connections
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own device connections"
ON public.device_connections
FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_device_connections_user_id ON public.device_connections(user_id);

-- Update the handle_new_user function to initialize onboarding state
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, name, onboarding_completed)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    FALSE
  );
  
  -- Create default consent record with all fields false
  INSERT INTO public.consents (user_id, accepted_terms, accepted_privacy)
  VALUES (new.id, FALSE, FALSE);
  
  -- Log the signup
  INSERT INTO public.audit_logs (user_id, action, scope, details)
  VALUES (new.id, 'SIGNUP', 'account', jsonb_build_object('method', 'email'));
  
  RETURN new;
END;
$function$;