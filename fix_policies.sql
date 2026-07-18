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
DROP POLICY IF EXISTS "Allow public delete support_conv" ON public.cubaze_support_conversations;

DROP POLICY IF EXISTS "support_msg_select_policy" ON public.cubaze_support_messages;
DROP POLICY IF EXISTS "support_msg_insert_policy" ON public.cubaze_support_messages;
DROP POLICY IF EXISTS "support_msg_update_policy" ON public.cubaze_support_messages;
DROP POLICY IF EXISTS "Allow public delete support_msg" ON public.cubaze_support_messages;

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
CREATE POLICY "Allow public delete support_conv" ON public.cubaze_support_conversations FOR DELETE USING (true);

CREATE POLICY "Allow public select support_msg" ON public.cubaze_support_messages FOR SELECT USING (true);
CREATE POLICY "Allow public insert support_msg" ON public.cubaze_support_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update support_msg" ON public.cubaze_support_messages FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete support_msg" ON public.cubaze_support_messages FOR DELETE USING (true);

-- Drop old policies for posters if they exist
DROP POLICY IF EXISTS "Allow public select posters" ON public.cubaze_posters;
DROP POLICY IF EXISTS "Allow public insert posters" ON public.cubaze_posters;
DROP POLICY IF EXISTS "Allow public update posters" ON public.cubaze_posters;
DROP POLICY IF EXISTS "Allow public delete posters" ON public.cubaze_posters;

-- Create policies for posters
CREATE POLICY "Allow public select posters" ON public.cubaze_posters FOR SELECT USING (true);
CREATE POLICY "Allow public insert posters" ON public.cubaze_posters FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update posters" ON public.cubaze_posters FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete posters" ON public.cubaze_posters FOR DELETE USING (true);

-- Drop old policies for live classes if they exist
DROP POLICY IF EXISTS "Allow public select live_classes" ON public.cubaze_live_classes;
DROP POLICY IF EXISTS "Allow public insert live_classes" ON public.cubaze_live_classes;
DROP POLICY IF EXISTS "Allow public update live_classes" ON public.cubaze_live_classes;
DROP POLICY IF EXISTS "Allow public delete live_classes" ON public.cubaze_live_classes;

-- Create policies for live classes
CREATE POLICY "Allow public select live_classes" ON public.cubaze_live_classes FOR SELECT USING (true);
CREATE POLICY "Allow public insert live_classes" ON public.cubaze_live_classes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update live_classes" ON public.cubaze_live_classes FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete live_classes" ON public.cubaze_live_classes FOR DELETE USING (true);

-- Drop old policies for coupons if they exist
DROP POLICY IF EXISTS "Allow public select coupons" ON public.cubaze_coupons;
DROP POLICY IF EXISTS "Allow public insert coupons" ON public.cubaze_coupons;
DROP POLICY IF EXISTS "Allow public update coupons" ON public.cubaze_coupons;
DROP POLICY IF EXISTS "Allow public delete coupons" ON public.cubaze_coupons;

-- Create policies for coupons
CREATE POLICY "Allow public select coupons" ON public.cubaze_coupons FOR SELECT USING (true);
CREATE POLICY "Allow public insert coupons" ON public.cubaze_coupons FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update coupons" ON public.cubaze_coupons FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete coupons" ON public.cubaze_coupons FOR DELETE USING (true);


