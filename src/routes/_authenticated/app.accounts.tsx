import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/accounts")({
  component: AccountsPage,
});

const accounts = [
  { name: "Sterling", currency: "GBP", iban: "GB29 BFBK 6016 1331 9268 19", balance: "£8,204.10" },
  { name: "Euro", currency: "EUR", iban: "DE89 3704 0044 0532 0130 00", balance: "€3,110.44" },
  { name: "US dollar", currency: "USD", iban: "Routing 026073150", balance: "$1,384.62" },
];

function AccountsPage() {
  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Accounts</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-institutional">Multi-currency</h1>
      </header>

      <ul className="divide-y divide-border border-y border-border">
        {accounts.map((a) => (
          <li key={a.currency} className="grid gap-1 py-5 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="min-w-0">
              <p className="text-sm font-medium tracking-institutional">
                {a.name} · {a.currency}
              </p>
              <p className="mt-1 truncate text-xs text-muted-foreground">{a.iban}</p>
            </div>
            <p className="text-lg font-semibold tracking-institutional sm:text-right">
              {a.balance}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
