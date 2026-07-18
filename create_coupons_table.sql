-- Standalone migration to create cubaze_coupons table and policies in Supabase.
-- Run these statements in the Supabase SQL editor:

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

-- Create policies for public access
CREATE POLICY "Allow public select coupons" ON public.cubaze_coupons FOR SELECT USING (true);
CREATE POLICY "Allow public insert coupons" ON public.cubaze_coupons FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update coupons" ON public.cubaze_coupons FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow public delete coupons" ON public.cubaze_coupons FOR DELETE USING (true);
