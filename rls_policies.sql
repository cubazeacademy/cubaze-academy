-- Enable Row Level Security for cubaze_tutor_conversations and cubaze_tutor_messages
ALTER TABLE cubaze_tutor_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cubaze_tutor_messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow student select conversations" ON cubaze_tutor_conversations;
DROP POLICY IF EXISTS "Allow tutor select conversations" ON cubaze_tutor_conversations;
DROP POLICY IF EXISTS "Allow student insert conversations" ON cubaze_tutor_conversations;
DROP POLICY IF EXISTS "Allow select messages" ON cubaze_tutor_messages;
DROP POLICY IF EXISTS "Allow insert messages" ON cubaze_tutor_messages;

-- Policy for cubaze_tutor_conversations (SELECT)
-- Allows students to see conversations they own, and allows tutors to see conversations assigned to them
CREATE POLICY "Allow student select conversations" ON cubaze_tutor_conversations
    FOR SELECT
    USING (
        student_username = coalesce(auth.jwt()->>'username', current_setting('request.jwt.claims', true)::json->>'username')
    );

CREATE POLICY "Allow tutor select conversations" ON cubaze_tutor_conversations
    FOR SELECT
    USING (
        tutor_username = coalesce(auth.jwt()->>'username', current_setting('request.jwt.claims', true)::json->>'username')
    );

-- Policy for cubaze_tutor_conversations (INSERT)
-- Restricts insertion to only when the authenticated user is the student in the conversation
CREATE POLICY "Allow student insert conversations" ON cubaze_tutor_conversations
    FOR INSERT
    WITH CHECK (
        student_username = coalesce(auth.jwt()->>'username', current_setting('request.jwt.claims', true)::json->>'username')
    );

-- Policy for cubaze_tutor_messages (SELECT)
-- Users can only read messages belonging to conversations they are part of
CREATE POLICY "Allow select messages" ON cubaze_tutor_messages
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM cubaze_tutor_conversations c
            WHERE c.id = conversation_id
            AND (
                c.student_username = coalesce(auth.jwt()->>'username', current_setting('request.jwt.claims', true)::json->>'username')
                OR c.tutor_username = coalesce(auth.jwt()->>'username', current_setting('request.jwt.claims', true)::json->>'username')
            )
        )
    );

-- Policy for cubaze_tutor_messages (INSERT)
-- Users can only post messages to conversations they are part of
CREATE POLICY "Allow insert messages" ON cubaze_tutor_messages
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM cubaze_tutor_conversations c
            WHERE c.id = conversation_id
            AND (
                c.student_username = coalesce(auth.jwt()->>'username', current_setting('request.jwt.claims', true)::json->>'username')
                OR c.tutor_username = coalesce(auth.jwt()->>'username', current_setting('request.jwt.claims', true)::json->>'username')
            )
        )
    );
