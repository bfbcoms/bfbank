import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownUp, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Circle-style country flag icons (SVG, matching the Flaticon "circle flags" style)
const FLAGS: Record<string, string> = {
  GBP: "https://hatscripts.github.io/circle-flags/flags/gb.svg",
  USD: "https://hatscripts.github.io/circle-flags/flags/us.svg",
  EUR: "https://hatscripts.github.io/circle-flags/flags/european_union.svg",
  NGN: "https://hatscripts.github.io/circle-flags/flags/ng.svg",
  INR: "https://hatscripts.github.io/circle-flags/flags/in.svg",
  AED: "https://hatscripts.github.io/circle-flags/flags/ae.svg",
};

function CurrencyFlag({ code, size = 18 }: { code: string; size?: number }) {
  const src = FLAGS[code];
  if (!src) return null;
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      loading="lazy"
      className="h-[18px] w-[18px] shrink-0 rounded-full object-cover ring-1 ring-border/60"
      style={{ height: size, width: size }}
    />
  );
}

function CurrencySelect({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  ariaLabel: string;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        aria-label={ariaLabel}
        className="h-11 w-auto min-w-[104px] shrink-0 gap-2 rounded-xl border-border bg-background px-3 text-sm font-medium uppercase tracking-institutional text-foreground focus:border-primary focus:ring-2 focus:ring-primary/30"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o} className="pl-2">
            <span className="flex items-center gap-2 font-medium uppercase tracking-institutional">
              <CurrencyFlag code={o} />
              {o}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}


// Illustrative mid-market rates (static — for UI demonstration only)
const RATES: Record<string, Record<string, number>> = {
  GBP: { USD: 1.2712, EUR: 1.1834, NGN: 2015.42, INR: 105.71, AED: 4.6714 },
  USD: { GBP: 0.7868, EUR: 0.9309, NGN: 1585.30, INR: 83.14, AED: 3.6725 },
  EUR: { GBP: 0.8451, USD: 1.0742, NGN: 1702.88, INR: 89.31, AED: 3.9451 },
};

const SEND_CURRENCIES = ["GBP", "USD", "EUR"] as const;
const RECEIVE_CURRENCIES = ["USD", "EUR", "GBP", "NGN", "INR", "AED"] as const;

const FEE_RATE = 0.0035; // 0.35%
const MAX_AMOUNT = 250_000;
const MIN_AMOUNT = 1;

export function SendMoneyCalculator() {
  const [amount, setAmount] = useState("1000");
  const [send, setSend] = useState<(typeof SEND_CURRENCIES)[number]>("GBP");
  const [receive, setReceive] = useState<(typeof RECEIVE_CURRENCIES)[number]>("USD");

  const numeric = Number(amount.replace(/,/g, "")) || 0;

  const validation = useMemo(() => {
    if (amount.trim() === "") return { ok: false, message: "Enter an amount to preview your transfer." };
    if (Number.isNaN(numeric)) return { ok: false, message: "That doesn't look like a valid amount." };
    if (numeric > 0 && numeric < MIN_AMOUNT) return { ok: false, message: `Minimum transfer is ${MIN_AMOUNT} ${send}.` };
    if (numeric > MAX_AMOUNT)
      return { ok: false, message: `For transfers above ${new Intl.NumberFormat("en-GB").format(MAX_AMOUNT)} ${send}, contact our payments desk.` };
    return { ok: true, message: "" };
  }, [amount, numeric, send]);

  const rate = useMemo(() => (send === receive ? 1 : RATES[send]?.[receive] ?? 1), [send, receive]);
  const fee = numeric * FEE_RATE;
  const converted = validation.ok ? (numeric - fee) * rate : 0;

  const fmt = (v: number, ccy: string) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: ccy, maximumFractionDigits: 2 }).format(v);
  const fmtNumber = (v: number) =>
    new Intl.NumberFormat("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v);

  const swap = () => {
    if ((SEND_CURRENCIES as readonly string[]).includes(receive)) {
      const next = receive as (typeof SEND_CURRENCIES)[number];
      setReceive(send as (typeof RECEIVE_CURRENCIES)[number]);
      setSend(next);
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-background text-foreground shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          Live transfer preview
        </p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Live
        </span>
      </div>

      <div className="space-y-2 p-6">
        <Row
          label="You send"
          value={amount}
          onValue={setAmount}
          currency={send}
          onCurrency={(v) => setSend(v as typeof send)}
          options={SEND_CURRENCIES as unknown as string[]}
          invalid={!validation.ok}
        />

        <div className="relative flex items-center gap-3 px-1 py-1 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          <button
            type="button"
            onClick={swap}
            aria-label="Swap send and receive currencies"
            className="grid h-9 w-9 place-items-center rounded-full border border-border bg-background text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <ArrowDownUp className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="rounded-2xl border border-border bg-muted/40 px-4 py-3">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <div className="min-w-0">
              <label className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                Recipient gets
              </label>
              <div className="mt-1 h-8 overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={`${converted.toFixed(2)}-${receive}`}
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -12, opacity: 0 }}
                    transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
                    className="text-2xl font-semibold tracking-institutional text-foreground tabular-nums"
                  >
                    {fmtNumber(converted)}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            <select
              value={receive}
              onChange={(e) => setReceive(e.target.value as typeof receive)}
              aria-label="Recipient currency"
              className="h-11 shrink-0 rounded-xl border border-border bg-background px-3 text-sm font-medium tracking-institutional uppercase text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {RECEIVE_CURRENCIES.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>

        <AnimatePresence>
          {!validation.ok && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
              role="alert"
              aria-live="polite"
            >
              <div className="mt-2 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
                <span>{validation.message}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <dl className="grid grid-cols-3 border-t border-border text-xs">
        <div className="border-r border-border px-4 py-4">
          <dt className="text-muted-foreground">Our fee</dt>
          <dd className="mt-1 font-medium text-foreground tabular-nums">
            <AnimatedNumber value={fee} format={(v) => fmt(v, send)} />
          </dd>
        </div>
        <div className="border-r border-border px-4 py-4">
          <dt className="text-muted-foreground">Rate</dt>
          <dd className="mt-1 font-medium text-foreground tabular-nums">
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
  label, value, onValue, currency, onCurrency, options, invalid,
}: {
  label: string;
  value: string;
  onValue: (v: string) => void;
  currency: string;
  onCurrency: (v: string) => void;
  options: string[];
  invalid?: boolean;
}) {
  const inputId = `calc-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div
      className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border px-4 py-3 transition-colors ${
        invalid ? "border-destructive/50" : "border-border focus-within:border-primary"
      }`}
    >
      <div className="min-w-0">
        <label htmlFor={inputId} className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </label>
        <input
          id={inputId}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          aria-invalid={invalid}
          onChange={(e) => {
            const cleaned = e.target.value.replace(/[^0-9.,]/g, "");
            // Prevent multiple decimal points
            const parts = cleaned.split(".");
            const safe = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join("")}` : cleaned;
            onValue(safe);
          }}
          className="mt-1 w-full bg-transparent text-2xl font-semibold tracking-institutional text-foreground tabular-nums focus:outline-none"
        />
      </div>
      <select
        value={currency}
        onChange={(e) => onCurrency(e.target.value)}
        aria-label={`${label} currency`}
        className="h-11 shrink-0 rounded-xl border border-border bg-background px-3 text-sm font-medium tracking-institutional uppercase text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function AnimatedNumber({ value, format }: { value: number; format: (v: number) => string }) {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    const start = display;
    const delta = value - start;
    if (delta === 0) return;
    const duration = 350;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(start + delta * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return <span>{format(display)}</span>;
}
