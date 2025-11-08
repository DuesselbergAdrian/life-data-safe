-- Create research projects table
CREATE TABLE IF NOT EXISTS public.research_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  institute TEXT NOT NULL,
  description TEXT NOT NULL,
  data_requested TEXT[] NOT NULL, -- e.g., ['steps', 'sleep', 'heart_rate', 'location', 'videos']
  benefits TEXT[] NOT NULL, -- e.g., ['Better sleep predictions', 'Early disease detection']
  compensation_type TEXT, -- e.g., 'monetary', 'insights', 'free_analysis'
  compensation_value TEXT, -- e.g., '$50/month', 'Premium features'
  participant_count INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active', -- active, paused, completed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on research_projects
ALTER TABLE public.research_projects ENABLE ROW LEVEL SECURITY;

-- Anyone can view active research projects
CREATE POLICY "Anyone can view active research projects"
ON public.research_projects
FOR SELECT
USING (status = 'active');

-- Create project consents table
CREATE TABLE IF NOT EXISTS public.project_consents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES research_projects(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active', -- active, revoked
  consented_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  revoked_at TIMESTAMP WITH TIME ZONE,
  data_shared TEXT[] NOT NULL, -- What data types they agreed to share
  UNIQUE(user_id, project_id)
);

-- Enable RLS on project_consents
ALTER TABLE public.project_consents ENABLE ROW LEVEL SECURITY;

-- Users can view their own project consents
CREATE POLICY "Users can view their own project consents"
ON public.project_consents
FOR SELECT
USING (auth.uid() = user_id);

-- Users can create their own project consents
CREATE POLICY "Users can create their own project consents"
ON public.project_consents
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own project consents
CREATE POLICY "Users can update their own project consents"
ON public.project_consents
FOR UPDATE
USING (auth.uid() = user_id);

-- Create trigger for updated_at on research_projects
CREATE TRIGGER update_research_projects_updated_at
BEFORE UPDATE ON public.research_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample research projects
INSERT INTO public.research_projects (name, institute, description, data_requested, benefits, compensation_type, compensation_value, participant_count) VALUES
(
  'Sleep Quality & Longevity Study',
  'Stanford Sleep Research Institute',
  'We are studying the correlation between sleep patterns and long-term health outcomes. Your data will help us develop better sleep recommendations and early warning systems for sleep disorders.',
  ARRAY['sleep', 'heart_rate', 'steps', 'age'],
  ARRAY['Personalized sleep quality reports', 'Early sleep disorder detection', 'Access to premium sleep insights'],
  'insights',
  'Monthly sleep analysis reports',
  1247
),
(
  'Urban Health & Activity Research',
  'MIT Urban Health Lab',
  'Understanding how city living affects physical activity and mental wellbeing. Help us design healthier cities and improve public health policies.',
  ARRAY['steps', 'location', 'heart_rate', 'stress_level'],
  ARRAY['Better activity recommendations', 'City health score access', 'Contribute to urban planning'],
  'monetary',
  '$25/month',
  3891
),
(
  'AI-Powered Heart Health Prediction',
  'Harvard Medical AI Research',
  'Training next-generation AI models to predict cardiovascular events weeks in advance. Your contribution could save lives.',
  ARRAY['heart_rate', 'sleep', 'steps', 'weight', 'blood_pressure'],
  ARRAY['Advanced heart health predictions', 'Real-time cardiovascular risk alerts', 'Free annual health assessment'],
  'insights',
  'Premium heart health monitoring',
  892
),
(
  'Mental Health & Digital Wellbeing',
  'Oxford Psychology Research Center',
  'Exploring the relationship between digital device usage, social connections, and mental health to develop better wellness interventions.',
  ARRAY['screen_time', 'social_interactions', 'sleep', 'mood', 'steps'],
  ARRAY['Mental wellness score', 'Personalized stress reduction tips', 'Early anxiety detection'],
  'monetary',
  '$15/month + insights',
  2156
),
(
  'Nutrition & Metabolic Health Study',
  'Johns Hopkins Nutrition Lab',
  'Understanding how lifestyle and activity affect metabolism. Help us create personalized nutrition plans based on real-world data.',
  ARRAY['weight', 'steps', 'sleep', 'meal_logs', 'glucose'],
  ARRAY['Personalized nutrition recommendations', 'Metabolic health tracking', 'Free dietary consultation'],
  'insights',
  'Custom meal plans & analysis',
  1634
);