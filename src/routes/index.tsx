import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: LandingHolding,
});

function LandingHolding() {
  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center bg-secondary text-gold font-semibold">
            BFB
          </div>
          <span className="text-sm font-medium tracking-institutional uppercase">
            Bright Future Bank
          </span>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            to="/auth"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Sign in
          </Link>
          <Link
            to="/auth"
            className="inline-flex h-10 items-center bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Open an account
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-24 pt-16 md:pt-28">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">
          Cross-border neobank · Est. 2026
        </p>
        <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-institutional md:text-7xl">
          A brighter standard for cross-border money.
        </h1>
        <p className="mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
          Multi-currency accounts, instant global transfers and institutional-grade
          controls — engineered for people and businesses that move across borders.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/auth"
            className="inline-flex h-12 items-center bg-primary px-8 text-sm font-medium tracking-institutional uppercase text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Get started
          </Link>
          <Link
            to="/auth"
            className="inline-flex h-12 items-center border border-foreground px-8 text-sm font-medium tracking-institutional uppercase text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            Sign in
          </Link>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} Bright Future Bank. All rights reserved.</span>
          <span>Regulated financial services · Deposits held with partner institutions.</span>
        </div>
      </footer>
    </main>
  );
}
