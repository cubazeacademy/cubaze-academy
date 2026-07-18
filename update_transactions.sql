-- Migration to update cubaze_transactions schema for manual payments
-- Run these statements in the Supabase SQL editor:

ALTER TABLE public.cubaze_transactions ADD COLUMN IF NOT EXISTS student_name TEXT;
ALTER TABLE public.cubaze_transactions ADD COLUMN IF NOT EXISTS student_email TEXT;
ALTER TABLE public.cubaze_transactions ADD COLUMN IF NOT EXISTS student_phone TEXT;
ALTER TABLE public.cubaze_transactions ADD COLUMN IF NOT EXISTS discount NUMERIC DEFAULT 0;
ALTER TABLE public.cubaze_transactions ADD COLUMN IF NOT EXISTS coupon_code TEXT;
ALTER TABLE public.cubaze_transactions ADD COLUMN IF NOT EXISTS gateway_reference TEXT;
ALTER TABLE public.cubaze_transactions ADD COLUMN IF NOT EXISTS screenshot TEXT;
ALTER TABLE public.cubaze_transactions ADD COLUMN IF NOT EXISTS utr TEXT;
ALTER TABLE public.cubaze_transactions ADD COLUMN IF NOT EXISTS payment_date TEXT;
ALTER TABLE public.cubaze_transactions ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE public.cubaze_transactions ADD COLUMN IF NOT EXISTS reupload_reason TEXT;
ALTER TABLE public.cubaze_transactions ADD COLUMN IF NOT EXISTS batch_id TEXT;
ALTER TABLE public.cubaze_transactions ADD COLUMN IF NOT EXISTS batch_name TEXT;
