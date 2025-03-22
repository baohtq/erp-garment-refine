-- Create profiles table to store user profile information
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    company TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
-- Admin has full access to all profiles
CREATE POLICY "Admins have full access to profiles" 
    ON public.profiles
    USING (auth.jwt() ->> 'role' = 'admin');

-- Users can view all profiles
CREATE POLICY "Users can view all profiles" 
    ON public.profiles FOR SELECT
    TO authenticated;

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" 
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Trigger to create profile entry when a new user registers
CREATE OR REPLACE FUNCTION public.handle_new_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role, created_at, updated_at)
    VALUES (
        NEW.id,
        coalesce(NEW.raw_user_meta_data->>'full_name', NEW.email),
        coalesce(NEW.raw_user_meta_data->>'role', 'user'),
        NOW(),
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to activate function on new user creation
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_profile(); 