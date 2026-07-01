import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Bright Future Bank" },
      {
        name: "description",
        content: "Access your Bright Future Bank account securely.",
      },
    ],
  }),
  component: AuthShell,
});

function AuthShell() {
  return (
    <main className="grid min-h-screen bg-background text-foreground md:grid-cols-2">
      <aside className="hidden bg-secondary p-12 text-secondary-foreground md:flex md:flex-col md:justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center bg-primary text-primary-foreground font-semibold">
            BFB
          </div>
          <span className="text-sm font-medium tracking-institutional uppercase">
            Bright Future Bank
          </span>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-primary">Institutional-grade</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-institutional">
            Move money across borders with confidence.
          </h2>
        </div>
        <p className="text-xs text-secondary-foreground/60">
          Multi-factor authentication is required on every session.
        </p>
      </aside>

      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <Link
            to="/"
            className="text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground"
          >
            ← Back
          </Link>
          <h1 className="mt-8 text-3xl font-semibold tracking-institutional">
            Sign in to your account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Authentication opens next week. Add your email to be first in line.
          </p>

          <div className="mt-8 space-y-4">
            <div>
              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Email
              </label>
              <input
                type="email"
                disabled
                placeholder="you@company.com"
                className="h-12 w-full border-b border-border bg-transparent px-0 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
              />
            </div>
            <button
              type="button"
              disabled
              className="mt-4 inline-flex h-12 w-full items-center justify-center bg-primary px-6 text-sm font-medium tracking-institutional uppercase text-primary-foreground disabled:opacity-40"
            >
              Continue
            </button>
          </div>

          <p className="mt-8 text-xs text-muted-foreground">
            Protected by end-to-end encryption. By continuing you agree to our terms and
            privacy notice.
          </p>
        </div>
      </section>
    </main>
  );
}
