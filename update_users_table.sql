-- Run these statements in your Supabase SQL Editor to add the missing profile columns to the cubaze_users table:
ALTER TABLE public.cubaze_users ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.cubaze_users ADD COLUMN IF NOT EXISTS dob TEXT;
ALTER TABLE public.cubaze_users ADD COLUMN IF NOT EXISTS qualification TEXT;
ALTER TABLE public.cubaze_users ADD COLUMN IF NOT EXISTS qualification_other TEXT;
ALTER TABLE public.cubaze_users ADD COLUMN IF NOT EXISTS whatsapp TEXT;
ALTER TABLE public.cubaze_users ADD COLUMN IF NOT EXISTS profile_photo TEXT;
