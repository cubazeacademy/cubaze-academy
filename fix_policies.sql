-- Drop the existing strict blocking policies
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

-- Create public access policies matching the rest of the database
CREATE POLICY "Allow public select tutor_conv" ON public.cubaze_tutor_conversations FOR SELECT USING (true);
CREATE POLICY "Allow public insert tutor_conv" ON public.cubaze_tutor_conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update tutor_conv" ON public.cubaze_tutor_conversations FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public select tutor_msg" ON public.cubaze_tutor_messages FOR SELECT USING (true);
CREATE POLICY "Allow public insert tutor_msg" ON public.cubaze_tutor_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update tutor_msg" ON public.cubaze_tutor_messages FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public select support_conv" ON public.cubaze_support_conversations FOR SELECT USING (true);
CREATE POLICY "Allow public insert support_conv" ON public.cubaze_support_conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update support_conv" ON public.cubaze_support_conversations FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public select support_msg" ON public.cubaze_support_messages FOR SELECT USING (true);
CREATE POLICY "Allow public insert support_msg" ON public.cubaze_support_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update support_msg" ON public.cubaze_support_messages FOR UPDATE USING (true) WITH CHECK (true);
