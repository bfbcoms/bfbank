
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE IF NOT EXISTS public.homepage_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  eyebrow text, title text, subtitle text, body text,
  cta_label text, cta_href text, image_url text,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  sort_order int NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.homepage_sections TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.homepage_sections TO authenticated;
GRANT ALL ON public.homepage_sections TO service_role;

ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "hs_read" ON public.homepage_sections FOR SELECT
  USING (is_visible = true OR public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'compliance'));
CREATE POLICY "hs_insert" ON public.homepage_sections FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'compliance'));
CREATE POLICY "hs_update" ON public.homepage_sections FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'compliance'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'compliance'));
CREATE POLICY "hs_delete" ON public.homepage_sections FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'compliance'));

CREATE TRIGGER trg_homepage_sections_updated BEFORE UPDATE ON public.homepage_sections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.homepage_sections (slug, eyebrow, title, subtitle, body, cta_label, cta_href, sort_order, content) VALUES
('hero', 'Cross-border neobank · Est. 2026', 'Banking, perfected for a world without borders.', 'Hold, send and spend in 40+ currencies at the real exchange rate. No hidden markups. No monthly fees. Just a modern account built for people and businesses that move.', NULL, 'Open an account', '/signup', 10,
  '{"secondary_cta_label":"Explore transfers","secondary_cta_href":"/transfers","stats":[{"value":"40+","label":"Currencies"},{"value":"150+","label":"Countries"},{"value":"0.35%","label":"Transfer fee"}]}'::jsonb),
('trust_bar', NULL, NULL, NULL, NULL, NULL, NULL, 20,
  '{"items":[{"label":"FCA-registered EMI","icon":"ShieldCheck"},{"label":"AES-256 encryption","icon":"Lock"},{"label":"Safeguarded funds","icon":"Landmark"},{"label":"SOC 2 Type II","icon":"ShieldCheck"}]}'::jsonb),
('feature_grid', 'What you get', 'One account. Every currency. Anywhere.', NULL, NULL, NULL, NULL, 30,
  '{"features":[{"icon":"Wallet","title":"Virtual accounts","body":"Local GBP, USD, EUR and AED account details in your name. Get paid like a local — anywhere you work."},{"icon":"CreditCard","title":"Global cards","body":"Physical and virtual cards on Visa and Mastercard rails. Freeze, unfreeze and spend in over 150 countries with Apple Pay & Google Pay."},{"icon":"Globe2","title":"Cross-border transfers","body":"Send money at the mid-market rate to 40+ currencies. Most transfers arrive in seconds; every transfer tracked in real time."}]}'::jsonb),
('virtual_accounts', 'Virtual accounts', 'A local account in every currency you earn.', 'Get paid like a local in GBP, USD, EUR and AED. Real account numbers in your name — no intermediaries, no lifting fees, no waiting three business days for cleared funds.', NULL, 'Open a multi-currency account', '/signup', 40,
  '{"bullets":[{"title":"Real IBANs and sort codes","body":"UK sort code, US routing and account, Eurozone IBAN and AED account details — issued in your own name."},{"title":"Zero receiving fees","body":"Accept salary, invoices and marketplace payouts in the local rail. We never take a cut on incoming payments."},{"title":"Instant currency swap","body":"Convert between any held balance at the mid-market rate in a single tap. No spread, no surprise."}]}'::jsonb),
('global_cards', 'Global cards', 'One card. 150 countries. Zero drama.', 'Physical metal, contactless virtual, and disposable single-use cards — all on Visa and Mastercard rails. Freeze, unfreeze and control every merchant category from your phone.', NULL, 'Order your card', '/cards', 50,
  '{"bullets":[{"title":"Apple Pay and Google Pay day one","body":"Provision your card to Wallet the moment it is issued — start spending before the physical arrives."},{"title":"Merchant-level controls","body":"Block gambling, ATM withdrawals or online payments in one tap. Set per-day, per-transaction and per-category limits."},{"title":"Real-time spend intelligence","body":"Every tap is receipted in-app in under a second, with the merchant, category and FX rate you paid."}]}'::jsonb),
('cross_border', 'Cross-border transfers', 'Send money the way the internet moves data.', 'Real mid-market rate on every transfer. 60% of corridors settle in under sixty seconds. Every payment is tracked end-to-end, with a receipt the moment it lands.', NULL, 'See supported corridors', '/transfers', 60,
  '{"bullets":[{"title":"40+ currencies, 150+ countries","body":"Payout via local rails in each corridor — SEPA Instant, Faster Payments, ACH, IMPS, PIX and more."},{"title":"Live tracking, not silence","body":"See the status of every leg of the transfer, with a firm ETA and a receipt the moment funds land."},{"title":"Transparent per-transfer fee","body":"A single, published percentage. No margin baked into the exchange rate. Ever."}]}'::jsonb),
('split_cta', NULL, NULL, NULL, NULL, NULL, NULL, 70,
  '{"panels":[{"eyebrow":"For individuals","title":"Built for your life abroad.","body":"Whether you are moving overseas, sending money home or travelling for months, Bright Future keeps every currency in one place.","cta":"Explore Personal","to":"/personal"},{"eyebrow":"For business","title":"Global payments, without the friction.","body":"Multi-currency accounts, batch payouts, contractor payments and expense cards — all under one operating account.","cta":"Explore Business","to":"/business"}]}'::jsonb),
('closing', 'Ready when you are', 'Open your account in under 5 minutes.', 'Fully digital onboarding. Biometric login from day one. Cancel any time.', NULL, 'Get started', '/signup', 80, '{}'::jsonb)
ON CONFLICT (slug) DO NOTHING;
