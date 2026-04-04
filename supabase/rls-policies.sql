-- RentNowPk — Row Level Security (STUB)
-- Apply in Supabase SQL Editor after Drizzle migrations, or via supabase db push.
-- Server Actions using Drizzle with DATABASE_URL often use a role that bypasses RLS;
-- for client-side Supabase access, enable RLS and add policies below.

-- Example pattern (uncomment and adjust when exposing tables to PostgREST):
--
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
--
-- CREATE POLICY "users_select_own"
--   ON public.users FOR SELECT
--   USING (auth.uid() = id);
--
-- Vendor-owned rows: join users.role = 'VENDOR' and vendor_profiles.user_id = auth.uid()
-- Customer-owned rows: customer_profiles.user_id = auth.uid()
-- Admin: use service role in server-only code or a dedicated is_admin() claim.

-- Tables that MUST have policies before any anon/authenticated direct access:
-- users, customer_profiles, vendor_profiles, vehicles, vehicle_*,
-- bookings, chat_threads, messages, reviews, notifications, incidents, vehicle_date_blocks
