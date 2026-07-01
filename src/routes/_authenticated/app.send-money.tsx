import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CurrencyFlag } from "@/components/CurrencyFlag";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NIUM_CURRENCIES, getCurrency } from "@/lib/currencies";

export const Route = createFileRoute("/_authenticated/app/send-money")({
  component: SendMoneyPage,
});

function SendMoneyPage() {
  const [currency, setCurrency] = useState("GBP");
  const meta = getCurrency(currency);

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
              Amount {meta?.symbol ? `(${meta.symbol})` : ""}
            </span>
            <input
              disabled
              placeholder="0.00"
              className="h-12 w-full border-b border-border bg-transparent text-2xl tracking-institutional placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
            />
          </label>
          <div className="flex items-end">
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger
                aria-label="Send currency"
                className="h-[46px] min-w-[112px] gap-2 rounded-none border border-border bg-transparent px-3 text-xs uppercase tracking-[0.25em]"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                {NIUM_CURRENCIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    <span className="flex items-center gap-2">
                      <CurrencyFlag code={c.code} />
                      <span className="uppercase tracking-institutional">{c.code}</span>
                      <span className="ml-1 text-xs font-normal text-muted-foreground">{c.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          Payouts available in {NIUM_CURRENCIES.length}+ currencies across our global network. Transfers unlock after identity verification.
        </p>
      </form>
    </div>
  );
}

