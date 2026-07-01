import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Building2, User, ShieldCheck, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { createDiditSession } from "@/lib/didit.functions";
import { makeRouteMeta } from "@/lib/route-meta";

type Step = 1 | 2 | 3 | 4;
type AccountType = "individual" | "business";

export const Route = createFileRoute("/onboarding")({
  ssr: false,
  head: () =>
    makeRouteMeta({
      title: "Verify your identity — Bright Future Bank",
      description: "Complete a short verification to activate your Bright Future account.",
      path: "/onboarding",
      noindex: true,
    }),
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/login" });

    const { data: profile } = await supabase
      .from("profiles")
      .select("status, account_type")
      .eq("id", data.user.id)
      .maybeSingle();

    if (profile?.status === "active") throw redirect({ to: "/app/dashboard" });
    return { user: data.user, profile };
  },
  component: OnboardingPage,
});

function OnboardingPage() {
  const { user, profile } = Route.useRouteContext();
  const navigate = useNavigate();
  const startVerification = useServerFn(createDiditSession);

  const [step, setStep] = useState<Step>(1);
  const [accountType, setAccountType] = useState<AccountType>(
    (profile?.account_type as AccountType) ?? "individual",
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  const [personal, setPersonal] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    addressLine: "",
    city: "",
    country: "",
    postalCode: "",
  });
  const [business, setBusiness] = useState({
    companyName: "",
    registrationNumber: "",
    countryOfIncorporation: "",
    businessType: "",
    userTitle: "",
  });

  async function saveDetails() {
    setSaving(true);
    setError(null);
    try {
      const profilePatch = {
        account_type: accountType,
        first_name: personal.firstName || null,
        last_name: personal.lastName || null,
        full_name:
          [personal.firstName, personal.lastName].filter(Boolean).join(" ") || null,
        date_of_birth: personal.dateOfBirth || null,
        address_line: personal.addressLine || null,
        city: personal.city || null,
        country: personal.country || null,
        postal_code: personal.postalCode || null,
        title: accountType === "business" ? business.userTitle || null : null,
      };
      const { error: pErr } = await supabase.from("profiles").update(profilePatch).eq("id", user.id);
      if (pErr) throw pErr;

      if (accountType === "business") {
        const { error: bErr } = await supabase.from("businesses").upsert(
          {
            user_id: user.id,
            company_name: business.companyName,
            registration_number: business.registrationNumber,
            country_of_incorporation: business.countryOfIncorporation,
            business_type: business.businessType || null,
            user_title: business.userTitle || null,
          },
          { onConflict: "user_id" },
        );
        if (bErr) throw bErr;
      }
      setStep(3);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  async function beginVerification() {
    setVerifying(true);
    setError(null);
    try {
      const returnUrl = `${window.location.origin}/onboarding?step=4`;
      const result = await startVerification({
        data: { accountType, returnUrl },
      });
      if (result.mockMode) {
        // Verification auto-approved server-side; refresh session and go to dashboard.
        setStep(4);
        setTimeout(() => navigate({ to: "/app/dashboard" }), 1600);
      } else {
        window.location.href = result.verificationUrl;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start verification.");
      setVerifying(false);
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("step") === "4") setStep(4);
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-6 py-14">
        <header className="mb-10">
          <p className="text-[11px] uppercase tracking-[0.3em] text-primary">Bright Future Bank</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-institutional">
            Let's activate your account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Four short steps. Your details are encrypted and only visible to our compliance team.
          </p>
        </header>

        <Stepper current={step} />

        <section className="mt-10 border border-border bg-background p-8">
          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold tracking-institutional">
                Choose your account type
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                You can open the other later from your settings.
              </p>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                <TypeCard
                  icon={User}
                  active={accountType === "individual"}
                  onSelect={() => setAccountType("individual")}
                  title="Personal"
                  body="For individuals, travellers, and expats. Multi-currency wallet and cards."
                />
                <TypeCard
                  icon={Building2}
                  active={accountType === "business"}
                  onSelect={() => setAccountType("business")}
                  title="Business"
                  body="For companies, freelancers, and international teams. Team cards & payouts."
                />
              </div>
              <div className="mt-8 flex justify-end">
                <PrimaryButton onClick={() => setStep(2)}>Continue</PrimaryButton>
              </div>
            </div>
          )}

          {step === 2 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void saveDetails();
              }}
            >
              <h2 className="text-lg font-semibold tracking-institutional">
                {accountType === "individual" ? "Your details" : "Business details"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                We use this to comply with financial regulations in your country.
              </p>

              {accountType === "individual" ? (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <Field
                    label="First name"
                    required
                    value={personal.firstName}
                    onChange={(v) => setPersonal({ ...personal, firstName: v })}
                  />
                  <Field
                    label="Last name"
                    required
                    value={personal.lastName}
                    onChange={(v) => setPersonal({ ...personal, lastName: v })}
                  />
                  <Field
                    label="Date of birth"
                    type="date"
                    required
                    value={personal.dateOfBirth}
                    onChange={(v) => setPersonal({ ...personal, dateOfBirth: v })}
                  />
                  <Field
                    label="Country of residence"
                    required
                    value={personal.country}
                    onChange={(v) => setPersonal({ ...personal, country: v })}
                  />
                  <Field
                    label="Address"
                    required
                    className="md:col-span-2"
                    value={personal.addressLine}
                    onChange={(v) => setPersonal({ ...personal, addressLine: v })}
                  />
                  <Field
                    label="City"
                    required
                    value={personal.city}
                    onChange={(v) => setPersonal({ ...personal, city: v })}
                  />
                  <Field
                    label="Postal code"
                    required
                    value={personal.postalCode}
                    onChange={(v) => setPersonal({ ...personal, postalCode: v })}
                  />
                </div>
              ) : (
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <Field
                    label="Registered company name"
                    required
                    className="md:col-span-2"
                    value={business.companyName}
                    onChange={(v) => setBusiness({ ...business, companyName: v })}
                  />
                  <Field
                    label="Registration number"
                    required
                    value={business.registrationNumber}
                    onChange={(v) => setBusiness({ ...business, registrationNumber: v })}
                  />
                  <Field
                    label="Country of incorporation"
                    required
                    value={business.countryOfIncorporation}
                    onChange={(v) =>
                      setBusiness({ ...business, countryOfIncorporation: v })
                    }
                  />
                  <Field
                    label="Business type (e.g. LLC, Ltd)"
                    value={business.businessType}
                    onChange={(v) => setBusiness({ ...business, businessType: v })}
                  />
                  <Field
                    label="Your title"
                    required
                    value={business.userTitle}
                    onChange={(v) => setBusiness({ ...business, userTitle: v })}
                  />
                </div>
              )}

              {error && <p className="mt-4 text-xs text-red-500">{error}</p>}

              <div className="mt-8 flex items-center justify-between">
                <button
                  type="button"
                  className="text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
                  onClick={() => setStep(1)}
                >
                  ← Back
                </button>
                <PrimaryButton disabled={saving} type="submit">
                  {saving ? "Saving…" : "Continue"}
                </PrimaryButton>
              </div>
            </form>
          )}

          {step === 3 && (
            <div>
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 place-items-center border border-primary/40 bg-primary/5">
                  <ShieldCheck className="h-5 w-5 text-primary" strokeWidth={1.5} />
                </span>
                <div>
                  <h2 className="text-lg font-semibold tracking-institutional">
                    Verify your identity
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    To keep your money safe, we need to verify your identity with our partner
                    Didit. This takes about two minutes and you'll need a government-issued ID.
                  </p>
                </div>
              </div>

              <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                {[
                  "Bank-grade encryption — your documents are never stored on our servers",
                  "Reviewed by our licensed compliance team",
                  "You'll get an email the moment your account is activated",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-1.5 inline-block h-1.5 w-1.5 bg-primary" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>

              {error && <p className="mt-4 text-xs text-red-500">{error}</p>}

              <div className="mt-8 flex items-center justify-between">
                <button
                  type="button"
                  className="text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
                  onClick={() => setStep(2)}
                >
                  ← Back
                </button>
                <PrimaryButton disabled={verifying} onClick={beginVerification}>
                  {verifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Preparing…
                    </>
                  ) : (
                    "Start verification"
                  )}
                </PrimaryButton>
              </div>
            </div>
          )}

          {step === 4 && <PendingState />}
        </section>
      </div>
    </main>
  );
}

function PendingState() {
  return (
    <div className="text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center border border-primary/40 bg-primary/5">
        <CheckCircle2 className="h-6 w-6 text-primary" strokeWidth={1.5} />
      </div>
      <h2 className="mt-6 text-xl font-semibold tracking-institutional">
        Verification received
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        We've received your documents. Our compliance team is reviewing them now.
        You'll get an email the moment your account is activated — usually within a few
        minutes.
      </p>
      <div className="mt-8">
        <a
          href="/app/dashboard"
          className="inline-flex h-11 items-center justify-center bg-primary px-6 text-xs font-medium uppercase tracking-[0.25em] text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Continue to dashboard
        </a>
      </div>
    </div>
  );
}

function Stepper({ current }: { current: Step }) {
  const items = [
    { n: 1, label: "Account type" },
    { n: 2, label: "Details" },
    { n: 3, label: "Identity" },
    { n: 4, label: "Review" },
  ];
  return (
    <ol className="flex items-center gap-3">
      {items.map((it, i) => {
        const done = current > it.n;
        const active = current === it.n;
        return (
          <li key={it.n} className="flex flex-1 items-center gap-3">
            <div className="flex items-center gap-2">
              <span
                className={`grid h-7 w-7 place-items-center border text-xs font-semibold ${
                  done || active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground"
                }`}
              >
                {it.n}
              </span>
              <span
                className={`hidden text-[11px] uppercase tracking-[0.25em] md:inline ${
                  active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {it.label}
              </span>
            </div>
            {i < items.length - 1 && <span className="h-px flex-1 bg-border" aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}

function TypeCard({
  icon: Icon,
  active,
  onSelect,
  title,
  body,
}: {
  icon: typeof User;
  active: boolean;
  onSelect: () => void;
  title: string;
  body: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex items-start gap-4 border p-5 text-left transition-colors ${
        active ? "border-primary bg-primary/5" : "border-border hover:border-foreground"
      }`}
    >
      <Icon
        className={`mt-0.5 h-5 w-5 shrink-0 ${active ? "text-primary" : "text-foreground"}`}
        strokeWidth={1.5}
      />
      <div>
        <p className="text-sm font-semibold tracking-institutional">{title}</p>
        <p className="mt-1 text-xs text-muted-foreground">{body}</p>
      </div>
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-2 block text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full border-b border-border bg-transparent px-0 text-sm text-foreground focus:border-primary focus:outline-none"
      />
    </label>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-11 items-center justify-center bg-primary px-8 text-xs font-medium uppercase tracking-[0.25em] text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
    >
      {children}
    </button>
  );
}

// Suppress unused import lint (XCircle reserved for a future rejection view)
void XCircle;
