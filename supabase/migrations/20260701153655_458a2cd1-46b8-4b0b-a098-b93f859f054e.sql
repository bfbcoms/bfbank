
DROP POLICY IF EXISTS "hs_read" ON public.homepage_sections;

CREATE POLICY "hs_read_public" ON public.homepage_sections
  FOR SELECT TO anon
  USING (is_visible = true);

CREATE POLICY "hs_read_auth" ON public.homepage_sections
  FOR SELECT TO authenticated
  USING (is_visible = true OR public.has_role(auth.uid(), 'super_admin') OR public.has_role(auth.uid(), 'compliance'));
