import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search, ShieldCheck, X } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Row = Database["public"]["Tables"]["kyc_verifications"]["Row"] & {
  profile?: {
    id: string;
    full_name: string | null;
    first_name: string | null;
    last_name: string | null;
    account_type: Database["public"]["Enums"]["account_type"];
    status: Database["public"]["Enums"]["account_status"];
    country: string | null;
  } | null;
  business?: {
    company_name: string;
    registration_number: string;
    country_of_incorporation: string;
    business_type: string | null;
  } | null;
};

type StatusFilter = "all" | Database["public"]["Enums"]["kyc_status"];

export const Route = createFileRoute("/admin/kyc")({
  component: AdminKycQueue,
});

function AdminKycQueue() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<StatusFilter>("pending");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<Row | null>(null);

  async function load() {
    setLoading(true);
    let query = supabase
      .from("kyc_verifications")
      .select(
        "id, user_id, account_type, didit_status, didit_session_id, rejection_reason, submitted_at, completed_at, profile:profiles!kyc_verifications_user_id_fkey(id, full_name, first_name, last_name, account_type, status, country)",
      )
      .order("submitted_at", { ascending: false })
      .limit(200);
    if (status !== "all") query = query.eq("didit_status", status);
    const { data, error } = await query;
    if (error || !data) {
      setLoading(false);
      return;
    }

    // Fetch matching businesses in one shot for business-type applicants.
    const bizUserIds = data
      .filter((r) => r.account_type === "business")
      .map((r) => r.user_id);
    const businessMap = new Map<string, Row["business"]>();
    if (bizUserIds.length) {
      const { data: bizData } = await supabase
        .from("businesses")
        .select("user_id, company_name, registration_number, country_of_incorporation, business_type")
        .in("user_id", bizUserIds);
      (bizData ?? []).forEach((b) => businessMap.set(b.user_id, b));
    }

    setRows(
      data.map((r) => ({ ...(r as unknown as Row), business: businessMap.get(r.user_id) ?? null })),
    );
    setLoading(false);
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const filtered = useMemo(() => {
    if (!q.trim()) return rows;
    const t = q.toLowerCase();
    return rows.filter((r) => {
      const name =
        r.profile?.full_name ??
        [r.profile?.first_name, r.profile?.last_name].filter(Boolean).join(" ");
      return (
        name.toLowerCase().includes(t) ||
        r.business?.company_name?.toLowerCase().includes(t) ||
        r.didit_session_id?.toLowerCase().includes(t)
      );
    });
  }, [rows, q]);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary">Compliance</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-institutional">
            KYC / KYB queue
          </h1>
          <p className="mt-1 text-xs text-secondary-foreground/60">
            Review identity verifications submitted by customers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-secondary-foreground/40"
              strokeWidth={1.5}
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, company or session…"
              className="h-9 w-72 border border-white/10 bg-black/40 pl-8 pr-3 text-xs text-secondary-foreground placeholder:text-secondary-foreground/40 focus:border-primary focus:outline-none"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            className="h-9 border border-white/10 bg-black/40 px-3 text-xs uppercase tracking-[0.15em] text-secondary-foreground focus:border-primary focus:outline-none"
          >
            {(["pending", "approved", "rejected", "expired", "all"] as const).map((s) => (
              <option key={s} value={s} className="bg-black">
                {s}
              </option>
            ))}
          </select>
        </div>
      </header>

      <section className="border border-white/10 bg-black/40">
        <div className="grid grid-cols-[1.6fr_1.4fr_0.9fr_0.9fr_0.9fr_0.6fr] gap-2 border-b border-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.25em] text-secondary-foreground/50">
          <div>Applicant</div>
          <div>Detail</div>
          <div>Type</div>
          <div>Submitted</div>
          <div>Status</div>
          <div className="text-right">Action</div>
        </div>
        {loading ? (
          <div className="flex items-center gap-2 px-4 py-8 text-xs text-secondary-foreground/50">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading…
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-4 py-8 text-xs text-secondary-foreground/50">
            No verifications match this filter.
          </div>
        ) : (
          filtered.map((r) => {
            const name =
              r.profile?.full_name ??
              [r.profile?.first_name, r.profile?.last_name].filter(Boolean).join(" ") ??
              "—";
            return (
              <button
                key={r.id}
                onClick={() => setSelected(r)}
                className="grid w-full grid-cols-[1.6fr_1.4fr_0.9fr_0.9fr_0.9fr_0.6fr] items-center gap-2 border-b border-white/5 px-4 py-3 text-left text-xs transition-colors hover:bg-white/[0.03]"
              >
                <div>
                  <p className="text-secondary-foreground">{name || "Unnamed"}</p>
                  <p className="text-[10px] text-secondary-foreground/40">
                    {r.profile?.country ?? "—"}
                  </p>
                </div>
                <div className="truncate text-secondary-foreground/70">
                  {r.business?.company_name ?? r.didit_session_id ?? "—"}
                </div>
                <div className="uppercase tracking-[0.15em] text-secondary-foreground/60">
                  {r.account_type}
                </div>
                <div className="text-secondary-foreground/60">
                  {new Date(r.submitted_at).toLocaleDateString()}
                </div>
                <div>
                  <StatusBadge value={r.didit_status} />
                </div>
                <div className="text-right text-[10px] uppercase tracking-[0.25em] text-primary">
                  Review →
                </div>
              </button>
            );
          })
        )}
      </section>

      {selected && (
        <ReviewDrawer
          row={selected}
          onClose={() => setSelected(null)}
          onDone={() => {
            setSelected(null);
            void load();
          }}
        />
      )}
    </div>
  );
}

function StatusBadge({ value }: { value: Database["public"]["Enums"]["kyc_status"] }) {
  const map: Record<string, string> = {
    pending: "border-primary/60 text-primary bg-primary/10",
    approved: "border-emerald-500/60 text-emerald-400 bg-emerald-500/10",
    rejected: "border-red-500/60 text-red-400 bg-red-500/10",
    expired: "border-white/30 text-secondary-foreground/60 bg-white/5",
  };
  return (
    <span
      className={`inline-flex items-center border px-2 py-0.5 text-[10px] uppercase tracking-[0.25em] ${map[value]}`}
    >
      {value}
    </span>
  );
}

function ReviewDrawer({
  row,
  onClose,
  onDone,
}: {
  row: Row;
  onClose: () => void;
  onDone: () => void;
}) {
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState<"approve" | "reject" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function decide(decision: "approve" | "reject") {
    setError(null);
    if (decision === "reject" && reason.trim().length < 4) {
      setError("Please provide a rejection reason (at least a few words).");
      return;
    }
    setBusy(decision);

    const nextStatus = decision === "approve" ? "approved" : "rejected";
    const { error: kErr } = await supabase
      .from("kyc_verifications")
      .update({
        didit_status: nextStatus,
        rejection_reason: decision === "reject" ? reason.trim() : null,
        completed_at: new Date().toISOString(),
      })
      .eq("id", row.id);

    if (kErr) {
      setBusy(null);
      setError(kErr.message);
      return;
    }

    const { error: pErr } = await supabase
      .from("profiles")
      .update({
        status: decision === "approve" ? "active" : "suspended",
        rejection_reason: decision === "reject" ? reason.trim() : null,
      })
      .eq("id", row.user_id);

    if (pErr) {
      setBusy(null);
      setError(pErr.message);
      return;
    }

    // Best-effort audit log (RLS: staff can insert)
    const { data: me } = await supabase.auth.getUser();
    const { data: admin } = me.user
      ? await supabase.from("admin_users").select("id").eq("user_id", me.user.id).maybeSingle()
      : { data: null };
    await supabase.from("audit_logs").insert({
      admin_id: admin?.id ?? null,
      action: decision === "approve" ? "kyc.force_approve" : "kyc.force_reject",
      target_entity: "kyc_verifications",
      target_id: row.id,
      metadata: { reason: decision === "reject" ? reason.trim() : null } as never,
    });

    setBusy(null);
    onDone();
  }

  const name =
    row.profile?.full_name ??
    [row.profile?.first_name, row.profile?.last_name].filter(Boolean).join(" ") ??
    "Unnamed";

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60" onClick={onClose}>
      <aside
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-lg flex-col overflow-y-auto border-l border-white/10 bg-black text-secondary-foreground"
      >
        <header className="flex items-start justify-between border-b border-white/10 px-6 py-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary">Verification</p>
            <h2 className="mt-1 text-lg font-semibold tracking-institutional">{name}</h2>
            <p className="mt-0.5 text-[11px] text-secondary-foreground/50">
              Submitted {new Date(row.submitted_at).toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-secondary-foreground/50 hover:text-secondary-foreground"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </header>

        <div className="space-y-6 px-6 py-6 text-sm">
          <DetailBlock title="Account">
            <Row label="Type" value={row.account_type} />
            <Row label="Status" value={row.profile?.status ?? "—"} />
            <Row label="Country" value={row.profile?.country ?? "—"} />
          </DetailBlock>

          {row.business && (
            <DetailBlock title="Business">
              <Row label="Company" value={row.business.company_name} />
              <Row label="Reg. number" value={row.business.registration_number} />
              <Row label="Country" value={row.business.country_of_incorporation} />
              <Row label="Type" value={row.business.business_type ?? "—"} />
            </DetailBlock>
          )}

          <DetailBlock title="Verification">
            <Row label="Provider" value="Didit" />
            <Row label="Session" value={row.didit_session_id ?? "—"} />
            <Row label="Status" value={row.didit_status} />
            {row.rejection_reason && <Row label="Reason" value={row.rejection_reason} />}
          </DetailBlock>

          <div className="border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-primary">
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.5} /> Manual override
            </div>
            <p className="mt-2 text-[11px] text-secondary-foreground/60">
              Actions are logged to the audit trail and immediately affect the customer's
              account status.
            </p>
            <label className="mt-4 block">
              <span className="mb-1.5 block text-[10px] uppercase tracking-[0.25em] text-secondary-foreground/60">
                Rejection reason (required to reject)
              </span>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full border border-white/10 bg-black/50 px-3 py-2 text-xs text-secondary-foreground focus:border-primary focus:outline-none"
              />
            </label>

            {error && <p className="mt-2 text-[11px] text-red-400">{error}</p>}

            <div className="mt-4 flex items-center gap-2">
              <button
                disabled={busy !== null}
                onClick={() => decide("approve")}
                className="inline-flex h-10 flex-1 items-center justify-center bg-primary text-[11px] font-medium uppercase tracking-[0.25em] text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
              >
                {busy === "approve" ? "Approving…" : "Force approve"}
              </button>
              <button
                disabled={busy !== null}
                onClick={() => decide("reject")}
                className="inline-flex h-10 flex-1 items-center justify-center border border-red-500/60 text-[11px] font-medium uppercase tracking-[0.25em] text-red-400 hover:bg-red-500/10 disabled:opacity-40"
              >
                {busy === "reject" ? "Rejecting…" : "Force reject"}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function DetailBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-secondary-foreground/50">
        {title}
      </p>
      <div className="border border-white/10 bg-white/[0.02]">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-4 border-b border-white/5 px-3 py-2 text-xs last:border-b-0">
      <div className="text-secondary-foreground/50">{label}</div>
      <div className="truncate text-secondary-foreground">{value}</div>
    </div>
  );
}
