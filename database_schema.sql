-- =========================================================================
-- CUBAZE ACADEMY - SUPABASE DATABASE SCHEMA
-- REAL-TIME MESSAGING SYSTEM ("Talk with Tutor" & "Talk with Admin")
-- =========================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- 1. TABLE DEFINITIONS
-- =========================================================================

----------------------------------------------------------------------------
-- Table: cubaze_tutor_conversations ("Talk with Tutor" Threads)
----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cubaze_tutor_conversations (
    id TEXT PRIMARY KEY DEFAULT ('tconv_' || encode(gen_random_bytes(6), 'hex')),
    student_username TEXT NOT NULL,
    tutor_username TEXT NOT NULL,
    course_id TEXT NOT NULL,
    subject TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Open' CONSTRAINT chk_tutor_conv_status CHECK (status IN ('Open', 'Resolved', 'Closed')),
    unread_by_student BOOLEAN NOT NULL DEFAULT FALSE,
    unread_by_tutor BOOLEAN NOT NULL DEFAULT TRUE,
    last_reply_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    last_reply_by TEXT NOT NULL DEFAULT 'student' CONSTRAINT chk_tutor_last_reply_by CHECK (last_reply_by IN ('student', 'tutor')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

----------------------------------------------------------------------------
-- Table: cubaze_tutor_messages ("Talk with Tutor" Messages)
----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cubaze_tutor_messages (
    id TEXT PRIMARY KEY DEFAULT ('tmsg_' || encode(gen_random_bytes(6), 'hex')),
    conversation_id TEXT NOT NULL REFERENCES public.cubaze_tutor_conversations(id) ON DELETE CASCADE,
    sender TEXT NOT NULL,
    message TEXT NOT NULL,
    file_url TEXT DEFAULT NULL,
    file_name TEXT DEFAULT NULL,
    file_type TEXT DEFAULT NULL,
    external_link TEXT DEFAULT NULL,
    is_internal BOOLEAN NOT NULL DEFAULT FALSE,
    seen BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

----------------------------------------------------------------------------
-- Table: public.cubaze_support_conversations ("Talk with Admin" Tickets)
----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cubaze_support_conversations (
    id TEXT PRIMARY KEY DEFAULT ('sconv_' || encode(gen_random_bytes(6), 'hex')),
    student_username TEXT NOT NULL,
    subject TEXT NOT NULL,
    category TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'Medium' CONSTRAINT chk_support_priority CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
    status TEXT NOT NULL DEFAULT 'Open' CONSTRAINT chk_support_status CHECK (status IN ('Open', 'Pending', 'Resolved', 'Closed')),
    unread_by_admin BOOLEAN NOT NULL DEFAULT TRUE,
    unread_by_student BOOLEAN NOT NULL DEFAULT FALSE,
    last_reply_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    last_reply_by TEXT NOT NULL DEFAULT 'student' CONSTRAINT chk_support_last_reply_by CHECK (last_reply_by IN ('student', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

----------------------------------------------------------------------------
-- Table: public.cubaze_support_messages ("Talk with Admin" Messages)
----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cubaze_support_messages (
    id TEXT PRIMARY KEY DEFAULT ('smsg_' || encode(gen_random_bytes(6), 'hex')),
    conversation_id TEXT NOT NULL REFERENCES public.cubaze_support_conversations(id) ON DELETE CASCADE,
    sender TEXT NOT NULL,
    message TEXT NOT NULL,
    file_url TEXT DEFAULT NULL,
    file_name TEXT DEFAULT NULL,
    file_type TEXT DEFAULT NULL,
    external_link TEXT DEFAULT NULL,
    is_internal BOOLEAN NOT NULL DEFAULT FALSE,
    seen BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- =========================================================================
-- 2. INDEX DEFINITIONS (Optimization)
-- =========================================================================

-- Indexes for Tutor Conversations
CREATE INDEX IF NOT EXISTS idx_tutor_conv_student ON public.cubaze_tutor_conversations(student_username);
CREATE INDEX IF NOT EXISTS idx_tutor_conv_tutor ON public.cubaze_tutor_conversations(tutor_username);
CREATE INDEX IF NOT EXISTS idx_tutor_conv_course ON public.cubaze_tutor_conversations(course_id);
CREATE INDEX IF NOT EXISTS idx_tutor_conv_status ON public.cubaze_tutor_conversations(status);
CREATE INDEX IF NOT EXISTS idx_tutor_conv_last_reply ON public.cubaze_tutor_conversations(last_reply_at DESC);

-- Indexes for Tutor Messages
CREATE INDEX IF NOT EXISTS idx_tutor_msg_conv_id ON public.cubaze_tutor_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_tutor_msg_created_at ON public.cubaze_tutor_messages(created_at ASC);

-- Indexes for Support Conversations
CREATE INDEX IF NOT EXISTS idx_support_conv_student ON public.cubaze_support_conversations(student_username);
CREATE INDEX IF NOT EXISTS idx_support_conv_status ON public.cubaze_support_conversations(status);
CREATE INDEX IF NOT EXISTS idx_support_conv_last_reply ON public.cubaze_support_conversations(last_reply_at DESC);

-- Indexes for Support Messages
CREATE INDEX IF NOT EXISTS idx_support_msg_conv_id ON public.cubaze_support_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_support_msg_created_at ON public.cubaze_support_messages(created_at ASC);


-- =========================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- Enable RLS on all tables
ALTER TABLE public.cubaze_tutor_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cubaze_tutor_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cubaze_support_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cubaze_support_messages ENABLE ROW LEVEL SECURITY;

----------------------------------------------------------------------------
-- Helper Functions to Extract Auth Claims from JWT
----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.auth_username() 
RETURNS TEXT AS $$
  SELECT coalesce(
    nullif(current_setting('request.jwt.claims', true)::json->>'username', ''),
    nullif(auth.jwt()->>'username', '')
  );
$$ LANGUAGE sql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.auth_role() 
RETURNS TEXT AS $$
  SELECT coalesce(
    nullif(current_setting('request.jwt.claims', true)::json->>'role', ''),
    nullif(auth.jwt()->>'role', '')
  );
$$ LANGUAGE sql SECURITY DEFINER;


-- =========================================================================
-- 3. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- Enable RLS on all tables
ALTER TABLE public.cubaze_tutor_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cubaze_tutor_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cubaze_support_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cubaze_support_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "tutor_conv_select_policy" ON public.cubaze_tutor_conversations;
DROP POLICY IF EXISTS "tutor_conv_insert_policy" ON public.cubaze_tutor_conversations;
DROP POLICY IF EXISTS "tutor_conv_update_policy" ON public.cubaze_tutor_conversations;

DROP POLICY IF EXISTS "tutor_msg_select_policy" ON public.cubaze_tutor_messages;
DROP POLICY IF EXISTS "tutor_msg_insert_policy" ON public.cubaze_tutor_messages;
DROP POLICY IF EXISTS "tutor_msg_update_policy" ON public.cubaze_tutor_messages;

DROP POLICY IF EXISTS "support_conv_select_policy" ON public.cubaze_support_conversations;
DROP POLICY IF EXISTS "support_conv_insert_policy" ON public.cubaze_support_conversations;
DROP POLICY IF EXISTS "support_conv_update_policy" ON public.cubaze_support_conversations;

DROP POLICY IF EXISTS "support_msg_select_policy" ON public.cubaze_support_messages;
DROP POLICY IF EXISTS "support_msg_insert_policy" ON public.cubaze_support_messages;
DROP POLICY IF EXISTS "support_msg_update_policy" ON public.cubaze_support_messages;

-- Create public access policies matching the rest of the database tables
CREATE POLICY "Allow public select tutor_conv" ON public.cubaze_tutor_conversations FOR SELECT USING (true);
CREATE POLICY "Allow public insert tutor_conv" ON public.cubaze_tutor_conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update tutor_conv" ON public.cubaze_tutor_conversations FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public select tutor_msg" ON public.cubaze_tutor_messages FOR SELECT USING (true);
CREATE POLICY "Allow public insert tutor_msg" ON public.cubaze_tutor_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update tutor_msg" ON public.cubaze_tutor_messages FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public select support_conv" ON public.cubaze_support_conversations FOR SELECT USING (true);
CREATE POLICY "Allow public insert support_conv" ON public.cubaze_support_conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update support_conv" ON public.cubaze_support_conversations FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete support_conv" ON public.cubaze_support_conversations FOR DELETE USING (true);

CREATE POLICY "Allow public select support_msg" ON public.cubaze_support_messages FOR SELECT USING (true);
CREATE POLICY "Allow public insert support_msg" ON public.cubaze_support_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update support_msg" ON public.cubaze_support_messages FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete support_msg" ON public.cubaze_support_messages FOR DELETE USING (true);

-- Table: public.cubaze_posters (Right Side Announcement sliding posters)
CREATE TABLE IF NOT EXISTS public.cubaze_posters (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    image TEXT,
    type TEXT DEFAULT 'General',
    short_description TEXT,
    event_date TEXT,
    button_text TEXT,
    button_link TEXT,
    publish_start_date TEXT,
    publish_end_date TEXT,
    target_audience TEXT DEFAULT 'Everyone',
    status TEXT DEFAULT 'Draft',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.cubaze_posters ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public select posters" ON public.cubaze_posters;
DROP POLICY IF EXISTS "Allow public insert posters" ON public.cubaze_posters;
DROP POLICY IF EXISTS "Allow public update posters" ON public.cubaze_posters;
DROP POLICY IF EXISTS "Allow public delete posters" ON public.cubaze_posters;

CREATE POLICY "Allow public select posters" ON public.cubaze_posters FOR SELECT USING (true);
CREATE POLICY "Allow public insert posters" ON public.cubaze_posters FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update posters" ON public.cubaze_posters FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete posters" ON public.cubaze_posters FOR DELETE USING (true);

----------------------------------------------------------------------------
-- Table: public.cubaze_settings (System settings and API credentials)
----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cubaze_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.cubaze_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select settings" ON public.cubaze_settings;
DROP POLICY IF EXISTS "Allow public insert settings" ON public.cubaze_settings;
DROP POLICY IF EXISTS "Allow public update settings" ON public.cubaze_settings;
DROP POLICY IF EXISTS "Allow public delete settings" ON public.cubaze_settings;

CREATE POLICY "Allow public select settings" ON public.cubaze_settings FOR SELECT USING (true);
CREATE POLICY "Allow public insert settings" ON public.cubaze_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update settings" ON public.cubaze_settings FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete settings" ON public.cubaze_settings FOR DELETE USING (true);

----------------------------------------------------------------------------
-- Table: public.cubaze_notifications (In-app notifications)
----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cubaze_notifications (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    read BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.cubaze_notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select notifications" ON public.cubaze_notifications;
DROP POLICY IF EXISTS "Allow public insert notifications" ON public.cubaze_notifications;
DROP POLICY IF EXISTS "Allow public update notifications" ON public.cubaze_notifications;
DROP POLICY IF EXISTS "Allow public delete notifications" ON public.cubaze_notifications;

CREATE POLICY "Allow public select notifications" ON public.cubaze_notifications FOR SELECT USING (true);
CREATE POLICY "Allow public insert notifications" ON public.cubaze_notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update notifications" ON public.cubaze_notifications FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete notifications" ON public.cubaze_notifications FOR DELETE USING (true);

----------------------------------------------------------------------------
-- Table: public.cubaze_transactions (LMS Transactions and Payments)
----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cubaze_transactions (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL,
    student_name TEXT,
    student_email TEXT,
    student_phone TEXT,
    course_id TEXT NOT NULL,
    course_title TEXT,
    batch_id TEXT,
    batch_name TEXT,
    amount NUMERIC NOT NULL,
    discount NUMERIC DEFAULT 0,
    coupon_code TEXT,
    payment_method TEXT,
    gateway_reference TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING',
    admin_status TEXT NOT NULL DEFAULT 'PENDING',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    invoice_number TEXT,
    screenshot TEXT, -- base64 data URI or file link
    utr TEXT,
    payment_date TEXT,
    rejection_reason TEXT,
    reupload_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.cubaze_transactions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public select transactions" ON public.cubaze_transactions;
DROP POLICY IF EXISTS "Allow public insert transactions" ON public.cubaze_transactions;
DROP POLICY IF EXISTS "Allow public update transactions" ON public.cubaze_transactions;
DROP POLICY IF EXISTS "Allow public delete transactions" ON public.cubaze_transactions;

CREATE POLICY "Allow public select transactions" ON public.cubaze_transactions FOR SELECT USING (true);
CREATE POLICY "Allow public insert transactions" ON public.cubaze_transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update transactions" ON public.cubaze_transactions FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete transactions" ON public.cubaze_transactions FOR DELETE USING (true);

-- =========================================================================
-- MIGRATION STATEMENTS FOR EXISTING SCHEMAS
-- =========================================================================
-- Run these statements in the Supabase SQL editor if your tables already exist:
--
-- ALTER TABLE public.cubaze_transactions ADD COLUMN IF NOT EXISTS student_name TEXT;
-- ALTER TABLE public.cubaze_transactions ADD COLUMN IF NOT EXISTS student_email TEXT;
-- ALTER TABLE public.cubaze_transactions ADD COLUMN IF NOT EXISTS student_phone TEXT;
-- ALTER TABLE public.cubaze_transactions ADD COLUMN IF NOT EXISTS discount NUMERIC DEFAULT 0;
-- ALTER TABLE public.cubaze_transactions ADD COLUMN IF NOT EXISTS coupon_code TEXT;
-- ALTER TABLE public.cubaze_transactions ADD COLUMN IF NOT EXISTS gateway_reference TEXT;
-- ALTER TABLE public.cubaze_transactions ADD COLUMN IF NOT EXISTS screenshot TEXT;
-- ALTER TABLE public.cubaze_transactions ADD COLUMN IF NOT EXISTS utr TEXT;
-- ALTER TABLE public.cubaze_transactions ADD COLUMN IF NOT EXISTS payment_date TEXT;
-- ALTER TABLE public.cubaze_transactions ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
-- ALTER TABLE public.cubaze_transactions ADD COLUMN IF NOT EXISTS reupload_reason TEXT;
-- ALTER TABLE public.cubaze_transactions ADD COLUMN IF NOT EXISTS batch_id TEXT;
-- ALTER TABLE public.cubaze_transactions ADD COLUMN IF NOT EXISTS batch_name TEXT;


-- =========================================================================
-- TABLE: cubaze_common_meetings
-- Academy-wide meetings visible to selected audiences
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.cubaze_common_meetings (
    id                     TEXT PRIMARY KEY,           -- e.g. "CM-FRESH-101"
    title                  TEXT NOT NULL,
    description            TEXT NOT NULL DEFAULT '',
    meet_link              TEXT NOT NULL DEFAULT '',
    date                   TEXT NOT NULL,              -- "YYYY-MM-DD"
    start_time             TEXT NOT NULL DEFAULT '',   -- "HH:MM"
    end_time               TEXT NOT NULL DEFAULT '',   -- "HH:MM"
    host_name              TEXT NOT NULL DEFAULT '',
    status                 TEXT NOT NULL DEFAULT 'Upcoming'
                               CONSTRAINT chk_cm_status
                               CHECK (status IN ('Upcoming', 'Live Now', 'Completed', 'Cancelled')),
    -- JSONB access control object:
    -- { "type": "everyone"|"all_students"|"all_tutors"|"all_students_tutors"
    --           |"selected_courses"|"selected_batches"|"admission_counselors",
    --   "courseIds": [], "batchIds": [] }
    access                 JSONB NOT NULL DEFAULT '{"type":"everyone","courseIds":[],"batchIds":[]}'::jsonb,
    password               TEXT NOT NULL DEFAULT '',
    recording_link         TEXT NOT NULL DEFAULT '',
    google_drive_resources TEXT NOT NULL DEFAULT '',
    notes                  TEXT NOT NULL DEFAULT '',
    created_at             TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at             TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_cm_date        ON public.cubaze_common_meetings (date);
CREATE INDEX IF NOT EXISTS idx_cm_status      ON public.cubaze_common_meetings (status);
CREATE INDEX IF NOT EXISTS idx_cm_access_type ON public.cubaze_common_meetings ((access->>'type'));

-- ── Row Level Security ────────────────────────────────────────────────────────
ALTER TABLE public.cubaze_common_meetings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public select common_meetings"  ON public.cubaze_common_meetings;
DROP POLICY IF EXISTS "Allow public insert common_meetings"  ON public.cubaze_common_meetings;
DROP POLICY IF EXISTS "Allow public update common_meetings"  ON public.cubaze_common_meetings;
DROP POLICY IF EXISTS "Allow public delete common_meetings"  ON public.cubaze_common_meetings;

CREATE POLICY "Allow public select common_meetings"
    ON public.cubaze_common_meetings FOR SELECT USING (true);
CREATE POLICY "Allow public insert common_meetings"
    ON public.cubaze_common_meetings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update common_meetings"
    ON public.cubaze_common_meetings FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete common_meetings"
    ON public.cubaze_common_meetings FOR DELETE USING (true);

-- ── Auto-update updated_at on every UPDATE ────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_cm_updated_at ON public.cubaze_common_meetings;
CREATE TRIGGER trg_cm_updated_at
    BEFORE UPDATE ON public.cubaze_common_meetings
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================================
-- MIGRATION (run only if the table already exists without newer columns)
-- =========================================================================
-- ALTER TABLE public.cubaze_common_meetings ADD COLUMN IF NOT EXISTS password               TEXT NOT NULL DEFAULT '';
-- ALTER TABLE public.cubaze_common_meetings ADD COLUMN IF NOT EXISTS recording_link         TEXT NOT NULL DEFAULT '';
-- ALTER TABLE public.cubaze_common_meetings ADD COLUMN IF NOT EXISTS google_drive_resources TEXT NOT NULL DEFAULT '';
-- ALTER TABLE public.cubaze_common_meetings ADD COLUMN IF NOT EXISTS notes                  TEXT NOT NULL DEFAULT '';
-- ALTER TABLE public.cubaze_common_meetings ADD COLUMN IF NOT EXISTS updated_at             TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW();

-- =========================================================================
-- TABLE: cubaze_live_classes
-- Scheduled live class sessions
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.cubaze_live_classes (
    id            TEXT PRIMARY KEY,
    course_id     TEXT,
    batch_id      TEXT,
    module_id     INTEGER DEFAULT 0,
    tutor_id      TEXT,
    title         TEXT NOT NULL,
    description   TEXT NOT NULL DEFAULT '',
    meet_link     TEXT NOT NULL DEFAULT '',
    date          TEXT NOT NULL,
    start_time    TEXT NOT NULL DEFAULT '',
    end_time      TEXT NOT NULL DEFAULT '',
    status        TEXT NOT NULL DEFAULT 'draft',
    recording_url TEXT NOT NULL DEFAULT '',
    created_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.cubaze_live_classes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public select live_classes" ON public.cubaze_live_classes;
DROP POLICY IF EXISTS "Allow public insert live_classes" ON public.cubaze_live_classes;
DROP POLICY IF EXISTS "Allow public update live_classes" ON public.cubaze_live_classes;
DROP POLICY IF EXISTS "Allow public delete live_classes" ON public.cubaze_live_classes;

-- Create policies for public access (matching rest of database)
CREATE POLICY "Allow public select live_classes" ON public.cubaze_live_classes FOR SELECT USING (true);
CREATE POLICY "Allow public insert live_classes" ON public.cubaze_live_classes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update live_classes" ON public.cubaze_live_classes FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete live_classes" ON public.cubaze_live_classes FOR DELETE USING (true);

-- Auto-update updated_at on every UPDATE
DROP TRIGGER IF EXISTS trg_lc_updated_at ON public.cubaze_live_classes;
CREATE TRIGGER trg_lc_updated_at
    BEFORE UPDATE ON public.cubaze_live_classes
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- =========================================================================
-- TABLE: cubaze_coupons
-- Coupons management
-- =========================================================================

CREATE TABLE IF NOT EXISTS public.cubaze_coupons (
    code        TEXT PRIMARY KEY,
    type        TEXT NOT NULL CONSTRAINT chk_coupon_type CHECK (type IN ('percentage', 'flat')),
    discount    NUMERIC NOT NULL,
    expiry_date TEXT, -- YYYY-MM-DD format
    active      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.cubaze_coupons ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow public select coupons" ON public.cubaze_coupons;
DROP POLICY IF EXISTS "Allow public insert coupons" ON public.cubaze_coupons;
DROP POLICY IF EXISTS "Allow public update coupons" ON public.cubaze_coupons;
DROP POLICY IF EXISTS "Allow public delete coupons" ON public.cubaze_coupons;

-- Create policies for public access (matching rest of database)
CREATE POLICY "Allow public select coupons" ON public.cubaze_coupons FOR SELECT USING (true);
CREATE POLICY "Allow public insert coupons" ON public.cubaze_coupons FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update coupons" ON public.cubaze_coupons FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete coupons" ON public.cubaze_coupons FOR DELETE USING (true);


