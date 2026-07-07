import { BrandLogo } from "@/components/BrandLogo";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { makeRouteMeta } from "@/lib/route-meta";

export const Route = createFileRoute("/login")({
  head: () =>
    makeRouteMeta({
      title: "Log in — Bright Future Bank",
      description: "Log in to your Bright Future Bank account securely.",
      path: "/login",
      noindex: true,
    }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: authErr } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authErr) {
      setError(
        authErr.message === "Invalid login credentials"
          ? "The email or password you entered doesn't match our records."
          : authErr.message,
      );
      return;
    }
    // Route guard on /app will send unverified users to /onboarding.
    navigate({ to: "/app/dashboard" });
  }

  return (
    <main className="grid min-h-screen bg-background text-foreground md:grid-cols-[1.1fr_1fr] lg:grid-cols-[1fr_1fr]">
      <aside className="relative hidden bg-secondary p-12 text-secondary-foreground md:flex md:flex-col md:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(219,177,73,0.18),transparent_55%)]" />
        <div className="relative flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3">
            <BrandLogo className="h-9 w-9 object-contain" alt="" />

            <span className="text-sm font-medium tracking-institutional uppercase">
              Bright Future Bank
            </span>
          </Link>
        </div>

        <div className="relative max-w-md">
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Institutional-grade</p>
          <h2 className="mt-6 text-4xl font-semibold tracking-institutional">
            "The account we've been waiting a decade for. Every currency, one login,
            no games with the exchange rate."
          </h2>
          <p className="mt-6 text-sm text-secondary-foreground/60">
            — Amara Osei, Founder & CFO, Meridian Studio
          </p>
        </div>

        <div className="relative flex items-center gap-2 text-xs text-secondary-foreground/60">
          <ShieldCheck className="h-4 w-4 text-primary" strokeWidth={1.5} />
          Every session protected by 2FA and biometric verification.
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
          <h1 className="mt-8 text-3xl font-semibold tracking-institutional">
            Log in to Bright Future
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Continue to your dashboard, cards and transfers.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-5" aria-label="Log in">
            <div>
              <label className="mb-2 block text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
                className="h-12 w-full border-b border-border bg-transparent px-0 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  autoComplete="current-password"
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
            </div>

            {error && (
              <div
                role="alert"
                className="border-l-2 border-red-500 bg-red-500/5 px-3 py-2 text-xs text-red-500"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 inline-flex h-12 w-full items-center justify-center bg-primary text-sm font-medium tracking-institutional uppercase text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-40"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in…
                </>
              ) : (
                "Log in"
              )}
            </button>
          </form>

          <p className="mt-8 text-xs text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-foreground hover:text-primary">
              Open one in minutes →
            </Link>
          </p>

          <p className="mt-6 text-[11px] leading-relaxed text-muted-foreground">
            Protected by end-to-end encryption. By continuing you agree to our{" "}
            <Link to="/legal/terms" className="underline hover:text-foreground">
              terms
            </Link>{" "}
            and{" "}
            <Link to="/legal/privacy" className="underline hover:text-foreground">
              privacy notice
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
