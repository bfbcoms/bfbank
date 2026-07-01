import { useMemo, useState } from "react";
import { ArrowDown } from "lucide-react";

// Illustrative mid-market rates (static — for UI demonstration only)
const RATES: Record<string, Record<string, number>> = {
  GBP: { USD: 1.2712, EUR: 1.1834, NGN: 2015.42, INR: 105.71, AED: 4.6714 },
  USD: { GBP: 0.7868, EUR: 0.9309, NGN: 1585.30, INR: 83.14, AED: 3.6725 },
  EUR: { GBP: 0.8451, USD: 1.0742, NGN: 1702.88, INR: 89.31, AED: 3.9451 },
};

const SEND_CURRENCIES = ["GBP", "USD", "EUR"] as const;
const RECEIVE_CURRENCIES = ["USD", "EUR", "GBP", "NGN", "INR", "AED"] as const;

const FEE_RATE = 0.0035; // 0.35% platform fee

export function SendMoneyCalculator() {
  const [amount, setAmount] = useState("1000");
  const [send, setSend] = useState<(typeof SEND_CURRENCIES)[number]>("GBP");
  const [receive, setReceive] = useState<(typeof RECEIVE_CURRENCIES)[number]>("USD");

  const numeric = Number(amount.replace(/,/g, "")) || 0;
  const rate = useMemo(() => {
    if (send === receive) return 1;
    return RATES[send]?.[receive] ?? 1;
  }, [send, receive]);

  const fee = numeric * FEE_RATE;
  const converted = (numeric - fee) * rate;

  const fmt = (v: number, ccy: string) =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: ccy,
      maximumFractionDigits: 2,
    }).format(v);

  return (
    <div className="border border-border bg-background">
      <div className="border-b border-border px-6 py-4">
        <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          Live transfer preview
        </p>
      </div>

      <div className="space-y-3 p-6">
        <Row
          label="You send"
          value={amount}
          onValue={setAmount}
          currency={send}
          onCurrency={(v) => setSend(v as typeof send)}
          options={SEND_CURRENCIES as unknown as string[]}
        />

        <div className="flex items-center gap-3 px-1 py-1 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          <ArrowDown className="h-4 w-4" strokeWidth={1.5} />
          <span className="h-px flex-1 bg-border" />
        </div>

        <Row
          label="Recipient gets"
          value={numeric === 0 ? "0.00" : converted.toFixed(2)}
          readOnly
          currency={receive}
          onCurrency={(v) => setReceive(v as typeof receive)}
          options={RECEIVE_CURRENCIES as unknown as string[]}
        />
      </div>

      <dl className="grid grid-cols-3 border-t border-border text-xs">
        <div className="border-r border-border px-4 py-4">
          <dt className="text-muted-foreground">Our fee</dt>
          <dd className="mt-1 font-medium text-foreground">{fmt(fee, send)}</dd>
        </div>
        <div className="border-r border-border px-4 py-4">
          <dt className="text-muted-foreground">Rate</dt>
          <dd className="mt-1 font-medium text-foreground">
            1 {send} = {rate.toFixed(4)} {receive}
          </dd>
        </div>
        <div className="px-4 py-4">
          <dt className="text-muted-foreground">Arrives</dt>
          <dd className="mt-1 font-medium text-foreground">In seconds</dd>
        </div>
      </dl>

      <div className="border-t border-border bg-muted/40 px-6 py-4 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
        Mid-market rate · No hidden spread
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  onValue,
  currency,
  onCurrency,
  options,
  readOnly,
}: {
  label: string;
  value: string;
  onValue?: (v: string) => void;
  currency: string;
  onCurrency: (v: string) => void;
  options: string[];
  readOnly?: boolean;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border border-border px-4 py-3">
      <div className="min-w-0">
        <label className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </label>
        <input
          type="text"
          inputMode="decimal"
          value={value}
          readOnly={readOnly}
          onChange={(e) => onValue?.(e.target.value.replace(/[^0-9.,]/g, ""))}
          className="mt-1 w-full bg-transparent text-2xl font-semibold tracking-institutional text-foreground focus:outline-none"
        />
      </div>
      <select
        value={currency}
        onChange={(e) => onCurrency(e.target.value)}
        className="h-11 shrink-0 border border-border bg-background px-3 text-sm font-medium tracking-institutional uppercase text-foreground focus:border-primary focus:outline-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
