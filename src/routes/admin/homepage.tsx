import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { AdminLayout } from "@/layouts/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { homepageSectionsQuery, type HomepageSection } from "@/lib/homepage-content";
import { ArrowLeft, Save, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/admin/homepage")({
  ssr: false,
  loader: ({ context }) => context.queryClient.ensureQueryData(homepageSectionsQuery()),
  component: AdminHomepage,
});

function AdminHomepage() {
  const { data: sections } = useSuspenseQuery(homepageSectionsQuery());
  const [selectedSlug, setSelectedSlug] = useState<string>(sections[0]?.slug ?? "hero");
  const selected = useMemo(
    () => sections.find((s) => s.slug === selectedSlug) ?? sections[0],
    [sections, selectedSlug],
  );

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          <Link to="/admin" className="inline-flex items-center gap-1 hover:text-foreground">
            <ArrowLeft className="h-3 w-3" aria-hidden /> Admin
          </Link>
          <span>·</span>
          <span className="text-foreground">Homepage sections</span>
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-institutional">Homepage content</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Every section of the public homepage is managed here. Changes go live the moment they save.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="border border-border bg-background">
            <ul>
              {sections.map((s) => {
                const active = s.slug === selected?.slug;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedSlug(s.slug)}
                      className={`flex w-full items-center justify-between border-b border-border px-4 py-3 text-left text-sm transition-colors ${
                        active ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span className="font-medium tracking-institutional">{s.slug}</span>
                      {s.is_visible ? (
                        <Eye className="h-3.5 w-3.5 text-primary" aria-label="Visible" />
                      ) : (
                        <EyeOff className="h-3.5 w-3.5 text-muted-foreground" aria-label="Hidden" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {selected && <SectionEditor key={selected.id} section={selected} />}
        </div>
      </div>
    </AdminLayout>
  );
}

function SectionEditor({ section }: { section: HomepageSection }) {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    eyebrow: section.eyebrow ?? "",
    title: section.title ?? "",
    subtitle: section.subtitle ?? "",
    body: section.body ?? "",
    cta_label: section.cta_label ?? "",
    cta_href: section.cta_href ?? "",
    image_url: section.image_url ?? "",
    content: JSON.stringify(section.content ?? {}, null, 2),
    sort_order: section.sort_order,
    is_visible: section.is_visible,
  });
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const save = useMutation({
    mutationFn: async () => {
      let parsed: Record<string, unknown> = {};
      try {
        parsed = JSON.parse(form.content || "{}");
      } catch {
        throw new Error("Content JSON is invalid — check your syntax.");
      }
      const { error: err } = await supabase
        .from("homepage_sections")
        .update({
          eyebrow: form.eyebrow || null,
          title: form.title || null,
          subtitle: form.subtitle || null,
          body: form.body || null,
          cta_label: form.cta_label || null,
          cta_href: form.cta_href || null,
          image_url: form.image_url || null,
          content: parsed as never,
          sort_order: form.sort_order,
          is_visible: form.is_visible,
        })
        .eq("id", section.id);
      if (err) throw new Error(err.message);
    },
    onSuccess: () => {
      setSaved(true);
      setError(null);
      qc.invalidateQueries({ queryKey: ["homepage_sections"] });
      setTimeout(() => setSaved(false), 1800);
    },
    onError: (e: Error) => setError(e.message),
  });

  const F = "block w-full border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";
  const L = "text-[11px] uppercase tracking-[0.2em] text-muted-foreground";

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); save.mutate(); }}
      className="space-y-6 border border-border bg-background p-6"
    >
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <p className={L}>Section</p>
          <p className="mt-1 font-mono text-sm">{section.slug}</p>
        </div>
        <label className="inline-flex cursor-pointer items-center gap-2 text-xs uppercase tracking-[0.2em]">
          <input
            type="checkbox"
            checked={form.is_visible}
            onChange={(e) => setForm((f) => ({ ...f, is_visible: e.target.checked }))}
            className="h-4 w-4 accent-primary"
          />
          Visible on site
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className={L}>Eyebrow</span>
          <input className={`${F} mt-2`} value={form.eyebrow} onChange={(e) => setForm({ ...form, eyebrow: e.target.value })} />
        </label>
        <label className="block">
          <span className={L}>Sort order</span>
          <input type="number" className={`${F} mt-2`} value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })} />
        </label>
      </div>

      <label className="block">
        <span className={L}>Title</span>
        <input className={`${F} mt-2`} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </label>

      <label className="block">
        <span className={L}>Subtitle</span>
        <textarea rows={3} className={`${F} mt-2`} value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
      </label>

      <label className="block">
        <span className={L}>Body</span>
        <textarea rows={3} className={`${F} mt-2`} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className={L}>CTA label</span>
          <input className={`${F} mt-2`} value={form.cta_label} onChange={(e) => setForm({ ...form, cta_label: e.target.value })} />
        </label>
        <label className="block">
          <span className={L}>CTA href</span>
          <input className={`${F} mt-2`} value={form.cta_href} onChange={(e) => setForm({ ...form, cta_href: e.target.value })} />
        </label>
      </div>

      <label className="block">
        <span className={L}>Image URL (optional override)</span>
        <input className={`${F} mt-2`} value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="/__l5e/assets-v1/..." />
      </label>

      <label className="block">
        <span className={L}>Structured content (JSON)</span>
        <textarea
          rows={14}
          className={`${F} mt-2 font-mono text-xs`}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          spellCheck={false}
        />
        <p className="mt-1 text-[11px] text-muted-foreground">
          Section-specific data: bullets, stats, panels, feature grid entries.
        </p>
      </label>

      {error && (
        <p role="alert" className="border border-destructive/40 bg-destructive/5 px-3 py-2 text-xs text-destructive">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3 border-t border-border pt-4">
        <button
          type="submit"
          disabled={save.isPending}
          className="inline-flex h-11 items-center gap-2 bg-primary px-6 text-sm font-medium tracking-institutional uppercase text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          <Save className="h-4 w-4" aria-hidden />
          {save.isPending ? "Saving…" : "Save section"}
        </button>
        {saved && <span className="text-xs uppercase tracking-[0.2em] text-primary">Saved</span>}
      </div>
    </form>
  );
}
