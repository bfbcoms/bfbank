
CREATE TABLE public.didit_webhook_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id text NOT NULL,
  status text NOT NULL,
  decision_id text,
  received_at timestamptz NOT NULL DEFAULT now(),
  payload jsonb NOT NULL,
  processed_status text,
  CONSTRAINT didit_webhook_events_session_status_unique UNIQUE (session_id, status)
);
CREATE INDEX didit_webhook_events_session_id_idx ON public.didit_webhook_events(session_id);
CREATE INDEX didit_webhook_events_received_at_idx ON public.didit_webhook_events(received_at DESC);

GRANT SELECT ON public.didit_webhook_events TO authenticated;
GRANT ALL ON public.didit_webhook_events TO service_role;

ALTER TABLE public.didit_webhook_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Webhook events: staff read" ON public.didit_webhook_events
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

-- Allow staff to review OTP records for support/compliance.
CREATE POLICY "OTP: staff select" ON public.otp_requests
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
