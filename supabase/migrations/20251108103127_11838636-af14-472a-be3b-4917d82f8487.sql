-- Create profiles table that extends auth.users
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text,
  avatar_url text,
  impact_points integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create uploads table for video/file metadata
CREATE TABLE public.uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  url text NOT NULL,
  thumb_url text,
  mime_type text NOT NULL,
  size_bytes bigint NOT NULL,
  duration_seconds integer,
  title text,
  ai_summary jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own uploads"
  ON public.uploads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own uploads"
  ON public.uploads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own uploads"
  ON public.uploads FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own uploads"
  ON public.uploads FOR DELETE
  USING (auth.uid() = user_id);

-- Create consents table
CREATE TABLE public.consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  share_anonymized boolean DEFAULT false NOT NULL,
  share_private_circle boolean DEFAULT false NOT NULL,
  share_communities boolean DEFAULT false NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own consents"
  ON public.consents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own consents"
  ON public.consents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own consents"
  ON public.consents FOR UPDATE
  USING (auth.uid() = user_id);

-- Create contacts table for private circle
CREATE TABLE public.contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  relation text,
  can_see_steps boolean DEFAULT false NOT NULL,
  can_see_sleep boolean DEFAULT false NOT NULL,
  can_see_mood boolean DEFAULT false NOT NULL,
  can_see_ai_summary boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own contacts"
  ON public.contacts FOR ALL
  USING (auth.uid() = user_id);

-- Create communities table
CREATE TABLE public.communities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  blurb text,
  member_count integer DEFAULT 0 NOT NULL,
  contributions_this_month integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view communities"
  ON public.communities FOR SELECT
  USING (true);

-- Create memberships table
CREATE TABLE public.memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  community_id uuid REFERENCES public.communities(id) ON DELETE CASCADE NOT NULL,
  role text DEFAULT 'member' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, community_id)
);

ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own memberships"
  ON public.memberships FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can join communities"
  ON public.memberships FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave communities"
  ON public.memberships FOR DELETE
  USING (auth.uid() = user_id);

-- Create audit_logs table for GDPR compliance
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  action text NOT NULL,
  scope text NOT NULL,
  actor text DEFAULT 'self' NOT NULL,
  details jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own audit logs"
  ON public.audit_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert audit logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create impact_events table for gamification
CREATE TABLE public.impact_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  value integer DEFAULT 1 NOT NULL,
  description text,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.impact_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own impact events"
  ON public.impact_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can create impact events"
  ON public.impact_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  
  -- Create default consent record
  INSERT INTO public.consents (user_id)
  VALUES (new.id);
  
  -- Log the signup
  INSERT INTO public.audit_logs (user_id, action, scope, details)
  VALUES (new.id, 'SIGNUP', 'account', jsonb_build_object('method', 'email'));
  
  RETURN new;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_consents_updated_at
  BEFORE UPDATE ON public.consents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for video uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'health-videos',
  'health-videos',
  true,
  209715200, -- 200MB
  ARRAY['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo']
);

-- Storage policies for health-videos bucket
CREATE POLICY "Users can upload their own videos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'health-videos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own videos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'health-videos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own videos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'health-videos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Seed demo communities
INSERT INTO public.communities (id, name, blurb, member_count, contributions_this_month)
VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Women''s Hormone Health', 'Supporting women through hormonal health journeys', 1247, 89),
  ('550e8400-e29b-41d4-a716-446655440002', 'Diabetes T1 Community', 'Type 1 diabetes management and support', 892, 112),
  ('550e8400-e29b-41d4-a716-446655440003', 'Copenhagen Health Circle', 'Local health initiatives in Copenhagen', 456, 67),
  ('550e8400-e29b-41d4-a716-446655440004', 'Mental Wellness Hub', 'Mental health support and mindfulness', 2103, 234),
  ('550e8400-e29b-41d4-a716-446655440005', 'Active Aging Network', 'Health and fitness for 50+', 678, 45);