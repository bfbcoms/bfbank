
-- admin_users: explicit deny of client-side mutations (service_role bypasses RLS)
DROP POLICY IF EXISTS "admin_users deny inserts" ON public.admin_users;
CREATE POLICY "admin_users deny inserts"
  ON public.admin_users FOR INSERT TO anon, authenticated
  WITH CHECK (false);

DROP POLICY IF EXISTS "admin_users deny updates" ON public.admin_users;
CREATE POLICY "admin_users deny updates"
  ON public.admin_users FOR UPDATE TO anon, authenticated
  USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS "admin_users deny deletes" ON public.admin_users;
CREATE POLICY "admin_users deny deletes"
  ON public.admin_users FOR DELETE TO anon, authenticated
  USING (false);

-- didit_webhook_events: explicit deny of client-side inserts (service_role bypasses RLS)
DROP POLICY IF EXISTS "didit_webhook_events deny client inserts" ON public.didit_webhook_events;
CREATE POLICY "didit_webhook_events deny client inserts"
  ON public.didit_webhook_events FOR INSERT TO anon, authenticated
  WITH CHECK (false);

DROP POLICY IF EXISTS "didit_webhook_events deny client updates" ON public.didit_webhook_events;
CREATE POLICY "didit_webhook_events deny client updates"
  ON public.didit_webhook_events FOR UPDATE TO anon, authenticated
  USING (false) WITH CHECK (false);

DROP POLICY IF EXISTS "didit_webhook_events deny client deletes" ON public.didit_webhook_events;
CREATE POLICY "didit_webhook_events deny client deletes"
  ON public.didit_webhook_events FOR DELETE TO anon, authenticated
  USING (false);

-- Revoke public execute on SECURITY DEFINER trigger functions.
-- Trigger functions run in the trigger context and do not need caller EXECUTE rights.
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;

-- Restrict role-check helpers: signed-in users need EXECUTE for RLS evaluation,
-- but anonymous callers do not. This narrows the anon exposure flagged by the linter.
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.is_staff(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_staff(uuid) TO authenticated, service_role;
