-- Create tables for AI Job Search App

-- Users table (profile data)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Resumes table
CREATE TABLE IF NOT EXISTS public.resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  file_url TEXT NOT NULL,
  extracted_skills TEXT[],
  suggested_roles TEXT[],
  raw_analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT,
  job_type TEXT, -- Remote, Hybrid, On-site
  commitment TEXT, -- Full-time, Internship, etc.
  salary TEXT,
  description TEXT,
  apply_link TEXT,
  source TEXT, -- LinkedIn, Indeed, etc.
  raw_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Saved Jobs table (Tracks bookmarks and application status)
CREATE TABLE IF NOT EXISTS public.saved_jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  job_id UUID REFERENCES public.jobs ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'interested', -- interested, applied, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, job_id)
);

-- Job Alerts table
CREATE TABLE IF NOT EXISTS public.job_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  keywords TEXT[],
  location TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own resumes." ON public.resumes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can upload own resumes." ON public.resumes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Jobs are viewable by logged in users." ON public.jobs FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage own saved jobs." ON public.saved_jobs FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own job alerts." ON public.job_alerts FOR ALL USING (auth.uid() = user_id);
