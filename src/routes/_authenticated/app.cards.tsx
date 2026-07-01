import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/app/cards")({
  component: CardsPage,
});

function CardsPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Cards</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-institutional">Your cards</h1>
      </header>

      <div className="grid gap-6 sm:grid-cols-2">
        <article className="relative aspect-[1.6/1] bg-secondary p-6 text-secondary-foreground">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary">Metal · Debit</span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-secondary-foreground/60">
              Physical
            </span>
          </div>
          <p className="mt-16 text-lg tracking-[0.35em]">•••• •••• •••• 4820</p>
          <div className="mt-6 flex items-end justify-between text-[10px] uppercase tracking-[0.25em] text-secondary-foreground/60">
            <span>A. Osei</span>
            <span className="text-primary">BFB</span>
          </div>
        </article>

        <article className="relative aspect-[1.6/1] border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary">Virtual</span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              Single-use
            </span>
          </div>
          <p className="mt-16 text-lg tracking-[0.35em]">•••• •••• •••• 1173</p>
          <div className="mt-6 flex items-end justify-between text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            <span>Expires 09/28</span>
            <span className="text-primary">BFB</span>
          </div>
        </article>
      </div>

      <p className="text-xs text-muted-foreground">
        Freeze, replace and manage limits from each card's detail page.
      </p>
    </div>
  );
}
