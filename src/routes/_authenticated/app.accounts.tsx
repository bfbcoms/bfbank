import { createFileRoute } from "@tanstack/react-router";
import { Copy, ArrowUpRight, ArrowDownLeft, Plus } from "lucide-react";
import { CurrencyFlag } from "@/components/CurrencyFlag";

export const Route = createFileRoute("/_authenticated/app/accounts")({
  component: AccountsPage,
});

const accounts = [
  {
    name: "Sterling",
    currency: "GBP",
    balance: "£8,204.10",
    details: [
      { k: "IBAN", v: "GB29 BFBK 6016 1331 9268 19" },
      { k: "Sort code", v: "60-16-13" },
      { k: "Account", v: "31926819" },
      { k: "BIC", v: "BFBKGB2L" },
    ],
  },
  {
    name: "Euro",
    currency: "EUR",
    balance: "€3,110.44",
    details: [
      { k: "IBAN", v: "DE89 3704 0044 0532 0130 00" },
      { k: "BIC", v: "BFBKDEFF" },
    ],
  },
  {
    name: "US dollar",
    currency: "USD",
    balance: "$1,384.62",
    details: [
      { k: "Routing (ACH)", v: "026073150" },
      { k: "Account", v: "8400 1332 4192" },
      { k: "SWIFT", v: "BFBKUS33" },
    ],
  },
];

function AccountsPage() {
  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Accounts</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-institutional md:text-3xl">
            Multi-currency
          </h1>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 border border-primary px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-primary hover:bg-primary hover:text-primary-foreground"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={1.5} /> Add
        </button>
      </header>

      <ul className="space-y-3">
        {accounts.map((a) => (
          <li key={a.currency} className="border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border p-5">
              <div className="flex items-center gap-3">
                <CurrencyFlag code={a.currency} size={26} />
                <div>
                  <p className="text-sm font-medium tracking-institutional">
                    {a.name}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    {a.currency} · Personal
                  </p>
                </div>
              </div>
              <p className="text-xl font-semibold tracking-institutional">{a.balance}</p>
            </div>

            <dl className="divide-y divide-border">
              {a.details.map((d) => (
                <div key={d.k} className="flex items-center justify-between gap-3 px-5 py-3">
                  <dt className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    {d.k}
                  </dt>
                  <dd className="flex items-center gap-2">
                    <span className="text-sm font-medium tracking-institutional">{d.v}</span>
                    <button
                      type="button"
                      aria-label={`Copy ${d.k}`}
                      className="grid h-7 w-7 place-items-center border border-border text-muted-foreground hover:border-primary hover:text-primary"
                    >
                      <Copy className="h-3 w-3" strokeWidth={1.5} />
                    </button>
                  </dd>
                </div>
              ))}
            </dl>

            <div className="grid grid-cols-2 border-t border-border">
              <button className="flex items-center justify-center gap-2 py-3 text-[11px] uppercase tracking-[0.2em] text-foreground hover:bg-muted">
                <ArrowDownLeft className="h-3.5 w-3.5" strokeWidth={1.5} /> Add money
              </button>
              <button className="flex items-center justify-center gap-2 border-l border-border py-3 text-[11px] uppercase tracking-[0.2em] text-primary hover:bg-primary hover:text-primary-foreground">
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.5} /> Send
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
