import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/templates")({
  component: TemplatesPage,
});

type Template = {
  id: string;
  template_key: string;
  subject: string;
  is_active: boolean;
  updated_at: string;
};

function useTemplates() {
  return useSuspenseQuery({
    queryKey: ["admin", "email_templates"],
    queryFn: async (): Promise<Template[]> => {
      const { data, error } = await supabase
        .from("email_templates")
        .select("id, template_key, subject, is_active, updated_at")
        .order("template_key");
      if (error) throw error;
      return (data ?? []) as Template[];
    },
  });
}

function TemplatesTable() {
  const { data } = useTemplates();
  return (
    <table className="w-full text-xs">
      <thead className="border-b border-white/10 text-left text-[10px] uppercase tracking-[0.25em] text-secondary-foreground/50">
        <tr>
          <th className="px-4 py-3 font-normal">Key</th>
          <th className="px-4 py-3 font-normal">Subject</th>
          <th className="px-4 py-3 font-normal">Status</th>
          <th className="px-4 py-3 font-normal">Updated</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/5">
        {data.length === 0 && (
          <tr>
            <td colSpan={4} className="px-4 py-10 text-center text-secondary-foreground/50">
              No templates configured. Seed transactional emails before go-live.
            </td>
          </tr>
        )}
        {data.map((t) => (
          <tr key={t.id} className="hover:bg-white/5">
            <td className="px-4 py-2.5 font-mono text-[11px] text-primary">{t.template_key}</td>
            <td className="px-4 py-2.5">{t.subject}</td>
            <td className="px-4 py-2.5">
              <span
                className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] ${
                  t.is_active ? "text-primary" : "text-secondary-foreground/40"
                }`}
              >
                <span
                  className={`inline-block h-1.5 w-1.5 ${
                    t.is_active ? "bg-primary" : "bg-secondary-foreground/30"
                  }`}
                  aria-hidden
                />
                {t.is_active ? "Live" : "Draft"}
              </span>
            </td>
            <td className="px-4 py-2.5 font-mono text-[10px] text-secondary-foreground/50">
              {new Date(t.updated_at).toISOString().slice(0, 10)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TemplatesPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="text-[10px] uppercase tracking-[0.3em] text-primary">Email templates</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-institutional">
          Transactional communications
        </h1>
        <p className="mt-1 text-xs text-secondary-foreground/60">
          Manage subjects, HTML bodies and activation state. Changes are audited.
        </p>
      </header>

      <div className="border border-white/10 bg-black/40">
        <Suspense fallback={<div className="p-6 text-xs text-secondary-foreground/50">Loading…</div>}>
          <TemplatesTable />
        </Suspense>
      </div>
    </div>
  );
}
