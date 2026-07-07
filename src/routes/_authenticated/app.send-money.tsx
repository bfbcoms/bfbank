import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CurrencyFlag } from "@/components/CurrencyFlag";
import { ArrowDown, User, Zap } from "lucide-react";
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

const recents = [
  { name: "Aurelia Chen", meta: "HSBC · GBP", initials: "AC" },
  { name: "Northwind Ltd", meta: "Business · USD", initials: "NW" },
  { name: "Marco Rossi", meta: "Intesa · EUR", initials: "MR" },
  { name: "Ade Osei", meta: "Own account · GBP", initials: "AO" },
];

function SendMoneyPage() {
  const [from, setFrom] = useState("GBP");
  const [to, setTo] = useState("EUR");
  const [amount, setAmount] = useState("");
  const fromMeta = getCurrency(from);
  const toMeta = getCurrency(to);
  const rate = 1.1732;
  const converted = amount ? (Number(amount) * rate).toFixed(2) : "0.00";

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <header>
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Send money</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-institutional md:text-3xl">
          New transfer
        </h1>
      </header>

      {/* Amount */}
      <section className="border border-border bg-card">
        <div className="border-b border-border p-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              You send
            </span>
            <CurrencySelect value={from} onChange={setFrom} label="Send currency" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold tracking-institutional text-muted-foreground">
              {fromMeta?.symbol ?? ""}
            </span>
            <input
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="0.00"
              aria-label="Amount to send"
              className="w-full bg-transparent text-4xl font-semibold tracking-institutional placeholder:text-muted-foreground/40 focus:outline-none"
            />
          </div>
        </div>

        <div className="relative">
          <span className="absolute left-1/2 top-0 grid h-8 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center border border-border bg-background text-primary">
            <ArrowDown className="h-4 w-4" strokeWidth={1.5} />
          </span>
        </div>

        <div className="p-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              Recipient gets
            </span>
            <CurrencySelect value={to} onChange={setTo} label="Receive currency" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-semibold tracking-institutional text-muted-foreground">
              {toMeta?.symbol ?? ""}
            </span>
            <p className="w-full text-4xl font-semibold tracking-institutional">{converted}</p>
          </div>
        </div>
      </section>

      {/* Rate + fee */}
      <dl className="divide-y divide-border border-y border-border text-sm">
        <Row k="Exchange rate" v={`1 ${from} = ${rate} ${to}`} />
        <Row k="Transfer fee" v="£0.35 (0.35%)" />
        <Row k="Estimated arrival" v="Within seconds" accent />
      </dl>

      {/* Recents */}
      <section>
        <h2 className="mb-3 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          Send again
        </h2>
        <div className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 md:mx-0 md:px-0">
          {recents.map((r) => (
            <button
              key={r.name}
              type="button"
              className="flex min-w-[110px] snap-start flex-col items-center gap-2 border border-border bg-card p-3 text-center hover:border-primary"
            >
              <span className="grid h-10 w-10 place-items-center border border-primary/40 text-[11px] font-semibold uppercase tracking-institutional text-primary">
                {r.initials}
              </span>
              <span className="text-xs font-medium leading-tight">{r.name}</span>
              <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                {r.meta}
              </span>
            </button>
          ))}
        </div>
      </section>

      <div className="space-y-3">
        <button
          type="button"
          className="inline-flex h-12 w-full items-center justify-center gap-2 border border-border bg-background text-sm font-medium uppercase tracking-[0.2em] hover:border-primary hover:text-primary"
        >
          <User className="h-4 w-4" strokeWidth={1.5} /> Choose recipient
        </button>
        <button
          type="button"
          disabled={!amount}
          className="inline-flex h-12 w-full items-center justify-center gap-2 bg-primary px-6 text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground disabled:opacity-40"
        >
          <Zap className="h-4 w-4" strokeWidth={1.5} /> Review transfer
        </button>
      </div>
    </div>
  );
}

function Row({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between py-3">
      <dt className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{k}</dt>
      <dd className={`text-sm font-medium tracking-institutional ${accent ? "text-primary" : ""}`}>
        {v}
      </dd>
    </div>
  );
}

function CurrencySelect({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        aria-label={label}
        className="h-9 min-w-[110px] gap-2 rounded-none border border-border bg-transparent px-2 text-xs uppercase tracking-[0.2em]"
      >
        <span className="flex items-center gap-2">
          <CurrencyFlag code={value} size={16} />
          <SelectValue />
        </span>
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
  );
}
