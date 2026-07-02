import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BadgeCheck, Clock, ShieldX, Loader2, ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Row = Database["public"]["Tables"]["kyc_verifications"]["Row"];
type Status = Database["public"]["Enums"]["kyc_status"];

export const Route = createFileRoute("/_authenticated/app/verification")({
  component: VerificationStatus,
});

const COPY: Record<
  Status,
  { title: string; body: string; tone: "amber" | "emerald" | "red" | "muted"; icon: typeof BadgeCheck }
> = {
  pending: {
    title: "Verification not started",
    body: "Complete identity verification to unlock accounts, cards and international transfers.",
    tone: "muted",
    icon: Clock,
  },
  in_progress: {
    title: "Verification in progress",
    body: "We've received your submission and our provider is running checks. This usually takes a few minutes.",
    tone: "amber",
    icon: Loader2,
  },
  approved: {
    title: "Verification approved",
    body: "You're fully verified. All account features, cards and cross-border transfers are available.",
    tone: "emerald",
    icon: BadgeCheck,
  },
  rejected: {
    title: "Verification declined",
    body: "Your submission couldn't be approved. See the reason below and start a new verification if you believe this is a mistake.",
    tone: "red",
    icon: ShieldX,
  },
  expired: {
    title: "Verification session expired",
    body: "The verification link expired before it was completed. Please start a new session.",
    tone: "muted",
    icon: Clock,
  },
  abandoned: {
    title: "Verification abandoned",
    body: "The last verification session wasn't completed. Restart to continue opening your account.",
    tone: "muted",
    icon: Clock,
  },
};

const TONE = {
  amber: "border-amber-500/40 bg-amber-500/5 text-amber-300",
  emerald: "border-emerald-500/40 bg-emerald-500/5 text-emerald-300",
  red: "border-red-500/40 bg-red-500/5 text-red-300",
  muted: "border-white/10 bg-white/[0.02] text-secondary-foreground",
};

function VerificationStatus() {
  const [row, setRow] = useState<Row | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: me } = await supabase.auth.getUser();
      if (!me.user) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("kyc_verifications")
        .select("*")
        .eq("user_id", me.user.id)
        .order("submitted_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      setRow((data as Row) ?? null);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading verification status…
      </div>
    );
  }

  const status: Status = row?.didit_status ?? "pending";
  const meta = COPY[status];
  const Icon = meta.icon;

  return (
    <div className="max-w-3xl space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Identity</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-institutional">Verification</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your current KYC status, powered by our verification partner.
        </p>
      </header>

      <section className={`border p-6 ${TONE[meta.tone]}`}>
        <div className="flex items-start gap-4">
          <Icon
            className={`h-6 w-6 shrink-0 ${status === "in_progress" ? "animate-spin" : ""}`}
            strokeWidth={1.5}
          />
          <div className="flex-1">
            <h2 className="text-lg font-semibold tracking-institutional">{meta.title}</h2>
            <p className="mt-2 text-sm opacity-90">{meta.body}</p>
            {status === "rejected" && row?.rejection_reason && (
              <div className="mt-4 border border-red-500/30 bg-black/40 p-3 text-xs">
                <span className="uppercase tracking-[0.2em] opacity-70">Reason</span>
                <p className="mt-1 text-red-200">{row.rejection_reason}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="border border-border bg-card p-6 text-sm">
        <h3 className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Details</h3>
        <dl className="mt-4 grid grid-cols-1 gap-y-3 sm:grid-cols-2">
          <Field label="Applicant type" value={row?.account_type ?? "—"} />
          <Field
            label="Submitted"
            value={row?.submitted_at ? new Date(row.submitted_at).toLocaleString() : "—"}
          />
          <Field
            label="Last update"
            value={row?.updated_at ? new Date(row.updated_at).toLocaleString() : "—"}
          />
          <Field
            label="Completed"
            value={row?.completed_at ? new Date(row.completed_at).toLocaleString() : "—"}
          />
          <Field label="Provider" value={row?.provider ?? "—"} />
          <Field label="Reference" value={row?.didit_session_id ?? "—"} mono />
        </dl>
      </section>

      {(status === "pending" ||
        status === "rejected" ||
        status === "expired" ||
        status === "abandoned") && (
        <Link
          to="/onboarding"
          className="inline-flex h-11 items-center gap-2 bg-primary px-5 text-xs font-medium uppercase tracking-[0.25em] text-primary-foreground hover:bg-primary/90"
        >
          {status === "pending" ? "Start verification" : "Restart verification"}
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
        </Link>
      )}
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</dt>
      <dd className={`mt-1 text-sm text-foreground ${mono ? "font-mono text-xs" : ""}`}>{value}</dd>
    </div>
  );
}
