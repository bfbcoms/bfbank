-- Extend profiles with onboarding details
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS first_name text,
  ADD COLUMN IF NOT EXISTS last_name text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS date_of_birth date,
  ADD COLUMN IF NOT EXISTS address_line text,
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS postal_code text,
  ADD COLUMN IF NOT EXISTS title text,
  ADD COLUMN IF NOT EXISTS rejection_reason text;

-- Enum for KYC status
DO $$ BEGIN
  CREATE TYPE public.kyc_status AS ENUM ('pending','approved','rejected','expired');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- kyc_verifications
CREATE TABLE IF NOT EXISTS public.kyc_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_type public.account_type NOT NULL,
  provider text NOT NULL DEFAULT 'didit',
  didit_session_id text UNIQUE,
  didit_verification_url text,
  didit_status public.kyc_status NOT NULL DEFAULT 'pending',
  rejection_reason text,
  raw_payload jsonb,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS kyc_verifications_user_id_idx ON public.kyc_verifications(user_id);
CREATE INDEX IF NOT EXISTS kyc_verifications_status_idx ON public.kyc_verifications(didit_status);

GRANT SELECT, INSERT, UPDATE ON public.kyc_verifications TO authenticated;
GRANT ALL ON public.kyc_verifications TO service_role;

ALTER TABLE public.kyc_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "KYC: user reads own" ON public.kyc_verifications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "KYC: user inserts own" ON public.kyc_verifications
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "KYC: staff read all" ON public.kyc_verifications
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

CREATE POLICY "KYC: staff update" ON public.kyc_verifications
  FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER kyc_verifications_touch
  BEFORE UPDATE ON public.kyc_verifications
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- businesses (KYB details)
CREATE TABLE IF NOT EXISTS public.businesses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  registration_number text NOT NULL,
  country_of_incorporation text NOT NULL,
  business_type text,
  user_title text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.businesses TO authenticated;
GRANT ALL ON public.businesses TO service_role;

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Businesses: owner read" ON public.businesses
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Businesses: owner write" ON public.businesses
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Businesses: owner update" ON public.businesses
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Businesses: staff read all" ON public.businesses
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

CREATE TRIGGER businesses_touch
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Allow staff to update profile status/rejection during KYC review
CREATE POLICY "Profiles: staff read" ON public.profiles
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

CREATE POLICY "Profiles: staff update" ON public.profiles
  FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- Allow staff to insert audit logs from admin actions
CREATE POLICY "Audit: staff insert" ON public.audit_logs
  FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));