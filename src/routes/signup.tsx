import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, ShieldCheck, User, Building2 } from "lucide-react";
import { makeRouteMeta } from "@/lib/route-meta";

export const Route = createFileRoute("/signup")({
  head: () =>
    makeRouteMeta({
      title: "Open an account — Bright Future Bank",
      description: "Open a Bright Future Bank account in minutes. Multi-currency, real exchange rates, institutional-grade security.",
      path: "/signup",
    }),
  component: SignupPage,
});

type AccountType = "personal" | "business" | null;

function SignupPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState<AccountType>(null);

  return (
    <main className="grid min-h-screen bg-background text-foreground md:grid-cols-[1.1fr_1fr] lg:grid-cols-[1fr_1fr]">
      <aside className="relative hidden bg-secondary p-12 text-secondary-foreground md:flex md:flex-col md:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(219,177,73,0.2),transparent_60%)]" />

        <Link to="/" className="relative flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center bg-primary text-primary-foreground text-sm font-semibold">
            B
          </span>
          <span className="text-sm font-medium tracking-institutional uppercase">
            Bright Future Bank
          </span>
        </Link>

        <div className="relative max-w-md">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Open an account</p>
          <h2 className="mt-6 text-4xl font-semibold tracking-institutional">
            Five minutes to a multi-currency account you'll actually enjoy using.
          </h2>
          <ul className="mt-8 space-y-3 text-sm text-secondary-foreground/70">
            {[
              "Real mid-market exchange rate",
              "Local details in GBP, USD, EUR, AED",
              "Freeze / unfreeze cards in one tap",
              "24/7 human support inside the app",
            ].map((f) => (
              <li key={f} className="flex items-center gap-3">
                <span className="inline-block h-1.5 w-1.5 bg-primary" aria-hidden />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative flex items-center gap-2 text-xs text-secondary-foreground/60">
          <ShieldCheck className="h-4 w-4 text-primary" strokeWidth={1.5} />
          Verification is completed inside the app with your government-issued ID.
        </div>
      </aside>

      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link
            to="/"
            className="text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground"
          >
            ← Back to homepage
          </Link>

          <div className="mt-8 flex items-center gap-2">
            <StepPill n={1} active={step === 1} done={step > 1} label="Credentials" />
            <span className="h-px flex-1 bg-border" aria-hidden />
            <StepPill n={2} active={step === 2} done={false} label="Account type" />
          </div>

          {step === 1 && (
            <div className="mt-8">
              <h1 className="text-3xl font-semibold tracking-institutional">
                Create your account
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Start with your email and a strong password. We'll take it from there.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setStep(2);
                }}
                className="mt-8 space-y-5"
              >
                <div>
                  <label className="mb-2 block text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@company.com"
                    autoComplete="email"
                    className="h-12 w-full border-b border-border bg-transparent px-0 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={10}
                      placeholder="At least 10 characters"
                      autoComplete="new-password"
                      className="h-12 w-full border-b border-border bg-transparent px-0 pr-10 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" strokeWidth={1.5} />
                      ) : (
                        <Eye className="h-4 w-4" strokeWidth={1.5} />
                      )}
                    </button>
                  </div>
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    Use at least 10 characters, mixing letters, numbers and symbols.
                  </p>
                </div>

                <button
                  type="submit"
                  className="mt-4 inline-flex h-12 w-full items-center justify-center bg-primary text-sm font-medium tracking-institutional uppercase text-primary-foreground transition-all hover:bg-primary/90"
                >
                  Continue
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="mt-8">
              <h1 className="text-3xl font-semibold tracking-institutional">
                Personal or business?
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Choose the type of account you'd like to open. You can add the other
                later.
              </p>

              <div className="mt-8 grid gap-3">
                <TypeCard
                  icon={User}
                  active={accountType === "personal"}
                  onSelect={() => setAccountType("personal")}
                  title="Personal"
                  body="For individuals, travellers and expats. Multi-currency wallet, cards and transfers."
                />
                <TypeCard
                  icon={Building2}
                  active={accountType === "business"}
                  onSelect={() => setAccountType("business")}
                  title="Business"
                  body="For companies, freelancers and international teams. Team cards and contractor payouts."
                />
              </div>

              <button
                type="button"
                disabled={!accountType}
                className="mt-8 inline-flex h-12 w-full items-center justify-center bg-primary text-sm font-medium tracking-institutional uppercase text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-40"
              >
                Continue to verification
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="mt-4 block w-full text-center text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
              >
                ← Back
              </button>
            </div>
          )}

          <p className="mt-8 text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-foreground hover:text-primary">
              Log in →
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

function StepPill({
  n,
  active,
  done,
  label,
}: {
  n: number;
  active: boolean;
  done: boolean;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`grid h-7 w-7 place-items-center border text-xs font-semibold ${
          active || done
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border text-muted-foreground"
        }`}
      >
        {n}
      </span>
      <span
        className={`text-[11px] uppercase tracking-[0.25em] ${
          active ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        {label}
      </span>
    </div>
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
        active
          ? "border-primary bg-primary/5"
          : "border-border hover:border-foreground"
      }`}
    >
      <Icon
        className={`mt-0.5 h-5 w-5 shrink-0 ${active ? "text-primary" : "text-foreground"}`}
        strokeWidth={1.5}
      />
      <div className="min-w-0">
        <p className="text-sm font-semibold tracking-institutional">{title}</p>
        <p className="mt-1 text-xs text-muted-foreground">{body}</p>
      </div>
    </button>
  );
}
