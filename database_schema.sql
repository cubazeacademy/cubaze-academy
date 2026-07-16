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


----------------------------------------------------------------------------
-- Policies for: cubaze_tutor_conversations
----------------------------------------------------------------------------

-- SELECT: Students can read their own; tutors can read their own; admins can read all
CREATE POLICY "tutor_conv_select_policy" ON public.cubaze_tutor_conversations
    FOR SELECT
    USING (
        student_username = public.auth_username()
        OR tutor_username = public.auth_username()
        OR public.auth_role() = 'admin'
    );

-- INSERT: Students can start conversations; admins can create all
CREATE POLICY "tutor_conv_insert_policy" ON public.cubaze_tutor_conversations
    FOR INSERT
    WITH CHECK (
        student_username = public.auth_username()
        OR public.auth_role() = 'admin'
    );

-- UPDATE: Participants and admins can update metadata (status, unread indicators)
CREATE POLICY "tutor_conv_update_policy" ON public.cubaze_tutor_conversations
    FOR UPDATE
    USING (
        student_username = public.auth_username()
        OR tutor_username = public.auth_username()
        OR public.auth_role() = 'admin'
    )
    WITH CHECK (
        student_username = public.auth_username()
        OR tutor_username = public.auth_username()
        OR public.auth_role() = 'admin'
    );


----------------------------------------------------------------------------
-- Policies for: cubaze_tutor_messages
----------------------------------------------------------------------------

-- SELECT: Tutors & students can read messages in their authorized conversations; admins can read all
-- Students cannot see internal notes (is_internal = false)
CREATE POLICY "tutor_msg_select_policy" ON public.cubaze_tutor_messages
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.cubaze_tutor_conversations c
            WHERE c.id = conversation_id
            AND (
                (c.student_username = public.auth_username() AND NOT is_internal)
                OR c.tutor_username = public.auth_username()
                OR public.auth_role() = 'admin'
            )
        )
    );

-- INSERT: Participants can send messages to their authorized conversations; admins can send all
CREATE POLICY "tutor_msg_insert_policy" ON public.cubaze_tutor_messages
    FOR INSERT
    WITH CHECK (
        sender = public.auth_username()
        AND EXISTS (
            SELECT 1 FROM public.cubaze_tutor_conversations c
            WHERE c.id = conversation_id
            AND (
                c.student_username = public.auth_username()
                OR c.tutor_username = public.auth_username()
                OR public.auth_role() = 'admin'
            )
        )
    );

-- UPDATE: Tutors/Students can update message status (e.g., mark as seen)
CREATE POLICY "tutor_msg_update_policy" ON public.cubaze_tutor_messages
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.cubaze_tutor_conversations c
            WHERE c.id = conversation_id
            AND (
                c.student_username = public.auth_username()
                OR c.tutor_username = public.auth_username()
                OR public.auth_role() = 'admin'
            )
        )
    );


----------------------------------------------------------------------------
-- Policies for: cubaze_support_conversations (Talk with Admin)
----------------------------------------------------------------------------

-- SELECT: Students can view their support threads; admins can view all
CREATE POLICY "support_conv_select_policy" ON public.cubaze_support_conversations
    FOR SELECT
    USING (
        student_username = public.auth_username()
        OR public.auth_role() = 'admin'
    );

-- INSERT: Students can create support tickets; admins can create all
CREATE POLICY "support_conv_insert_policy" ON public.cubaze_support_conversations
    FOR INSERT
    WITH CHECK (
        student_username = public.auth_username()
        OR public.auth_role() = 'admin'
    );

-- UPDATE: Students (to update metadata/reopen) and admins (to resolve/assign)
CREATE POLICY "support_conv_update_policy" ON public.cubaze_support_conversations
    FOR UPDATE
    USING (
        student_username = public.auth_username()
        OR public.auth_role() = 'admin'
    )
    WITH CHECK (
        student_username = public.auth_username()
        OR public.auth_role() = 'admin'
    );


----------------------------------------------------------------------------
-- Policies for: cubaze_support_messages (Talk with Admin)
----------------------------------------------------------------------------

-- SELECT: Students can read messages in their tickets (non-internal only); admins can read all
CREATE POLICY "support_msg_select_policy" ON public.cubaze_support_messages
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.cubaze_support_conversations c
            WHERE c.id = conversation_id
            AND (
                (c.student_username = public.auth_username() AND NOT is_internal)
                OR public.auth_role() = 'admin'
            )
        )
    );

-- INSERT: Students can post messages to their tickets; admins can post to all
CREATE POLICY "support_msg_insert_policy" ON public.cubaze_support_messages
    FOR INSERT
    WITH CHECK (
        sender = public.auth_username()
        AND EXISTS (
            SELECT 1 FROM public.cubaze_support_conversations c
            WHERE c.id = conversation_id
            AND (
                c.student_username = public.auth_username()
                OR public.auth_role() = 'admin'
            )
        )
    );

-- UPDATE: Mark support messages as seen/read
CREATE POLICY "support_msg_update_policy" ON public.cubaze_support_messages
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.cubaze_support_conversations c
            WHERE c.id = conversation_id
            AND (
                c.student_username = public.auth_username()
                OR public.auth_role() = 'admin'
            )
        )
    );
