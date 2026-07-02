
ALTER TYPE public.kyc_status ADD VALUE IF NOT EXISTS 'in_progress';
ALTER TYPE public.kyc_status ADD VALUE IF NOT EXISTS 'abandoned';

ALTER TABLE public.kyc_verifications
  ADD COLUMN IF NOT EXISTS workflow_id text,
  ADD COLUMN IF NOT EXISTS session_token text,
  ADD COLUMN IF NOT EXISTS decision_data jsonb;
