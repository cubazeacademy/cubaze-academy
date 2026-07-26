-- ============================================================
-- CUBAZE ACADEMY LMS — SINGLE ACTIVE SESSION SECURITY SCHEMA
-- Run this in your Supabase SQL Editor to create the sessions table
-- ============================================================

-- 1. Create cubaze_sessions Table
CREATE TABLE IF NOT EXISTS public.cubaze_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    username TEXT NOT NULL,
    session_token TEXT,
    device_id TEXT,
    device_name TEXT,
    browser TEXT,
    os TEXT,
    ip_address TEXT,
    country TEXT,
    state TEXT,
    city TEXT,
    login_time TIMESTAMPTZ DEFAULT NOW(),
    last_activity TIMESTAMPTZ DEFAULT NOW(),
    logout_time TIMESTAMPTZ,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Logged Out', 'Expired', 'Blocked'))
);

-- 2. Create Performance Indexes
CREATE INDEX IF NOT EXISTS idx_cubaze_sessions_user_status ON public.cubaze_sessions(username, status);
CREATE INDEX IF NOT EXISTS idx_cubaze_sessions_token ON public.cubaze_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_cubaze_sessions_status ON public.cubaze_sessions(status);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.cubaze_sessions ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies for Public Access (Idempotent)
DROP POLICY IF EXISTS "Allow public read access on cubaze_sessions" ON public.cubaze_sessions;
CREATE POLICY "Allow public read access on cubaze_sessions" 
ON public.cubaze_sessions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert access on cubaze_sessions" ON public.cubaze_sessions;
CREATE POLICY "Allow public insert access on cubaze_sessions" 
ON public.cubaze_sessions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update access on cubaze_sessions" ON public.cubaze_sessions;
CREATE POLICY "Allow public update access on cubaze_sessions" 
ON public.cubaze_sessions FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete access on cubaze_sessions" ON public.cubaze_sessions;
CREATE POLICY "Allow public delete access on cubaze_sessions" 
ON public.cubaze_sessions FOR DELETE USING (true);

