import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/send-money")({
  component: SendMoneyPage,
});

function SendMoneyPage() {
  return (
    <div className="mx-auto max-w-lg space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Send money</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-institutional">New transfer</h1>
      </header>

      <form className="space-y-6">
        <label className="block">
          <span className="mb-2 block text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            Recipient
          </span>
          <input
            disabled
            placeholder="Name or account number"
            className="h-12 w-full border-b border-border bg-transparent text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
          />
        </label>

        <div className="grid grid-cols-[1fr_auto] gap-4">
          <label className="block">
            <span className="mb-2 block text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              Amount
            </span>
            <input
              disabled
              placeholder="0.00"
              className="h-12 w-full border-b border-border bg-transparent text-2xl tracking-institutional placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
            />
          </label>
          <div className="flex items-end">
            <span className="border border-border px-4 py-3 text-xs uppercase tracking-[0.25em]">
              GBP
            </span>
          </div>
        </div>

        <label className="block">
          <span className="mb-2 block text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            Reference
          </span>
          <input
            disabled
            placeholder="Optional note"
            className="h-12 w-full border-b border-border bg-transparent text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
          />
        </label>

        <button
          type="button"
          disabled
          className="inline-flex h-12 w-full items-center justify-center bg-primary px-6 text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-40"
        >
          Review transfer
        </button>

        <p className="text-xs text-muted-foreground">
          Transfers unlock after identity verification. Same-currency payments settle instantly.
        </p>
      </form>
    </div>
  );
}
