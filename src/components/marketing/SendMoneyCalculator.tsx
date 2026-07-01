import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownUp, AlertCircle, Check, ChevronDown, RefreshCw } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { CurrencyFlag } from "@/components/CurrencyFlag";
import { cn } from "@/lib/utils";
import {
  NIUM_CURRENCIES,
  SEND_CURRENCY_CODES,
  RECEIVE_CURRENCY_CODES,
  getCurrency,
} from "@/lib/currencies";

/**
 * Searchable currency picker: type-to-filter by code or name, arrow-key
 * navigation, Enter to select, Esc to close.
 */
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
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label={ariaLabel}
        className="inline-flex h-11 min-w-[112px] shrink-0 items-center gap-2 rounded-xl border border-border bg-background px-3 text-sm font-medium uppercase tracking-institutional text-foreground transition-colors hover:border-primary/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        <CurrencyFlag code={value} />
        <span>{value}</span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.75} />
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 p-0" sideOffset={6}>
        <Command
          filter={(itemValue, search) => {
            const code = itemValue.toLowerCase();
            const meta = getCurrency(code);
            const q = search.trim().toLowerCase();
            if (!q) return 1;
            if (code.includes(q)) return 1;
            if (meta?.name.toLowerCase().includes(q)) return 0.9;
            return 0;
          }}
        >
          <CommandInput placeholder="Search currency or country…" />
          <CommandList className="max-h-72">
            <CommandEmpty>No currency found.</CommandEmpty>
            <CommandGroup>
              {options.map((o) => {
                const meta = getCurrency(o);
                return (
                  <CommandItem
                    key={o}
                    value={o}
                    onSelect={(v) => {
                      onChange(v.toUpperCase());
                      setOpen(false);
                    }}
                    className="gap-2"
                  >
                    <CurrencyFlag code={o} />
                    <span className="font-medium uppercase tracking-institutional">{o}</span>
                    {meta ? (
                      <span className="ml-1 truncate text-xs font-normal normal-case text-muted-foreground">
                        {meta.name}
                      </span>
                    ) : null}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4 text-primary",
                        value === o ? "opacity-100" : "opacity-0",
                      )}
                      strokeWidth={2}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

// Illustrative mid-market rates per 1 USD (static — for UI demonstration only).
// Any pair is computed via USD cross-rate: (from → USD) × (USD → to).
const USD_RATES: Record<string, number> = Object.fromEntries(
  NIUM_CURRENCIES.map((c) => [c.code, 1]),
);
Object.assign(USD_RATES, {
  USD: 1, GBP: 0.7868, EUR: 0.9309, AED: 3.6725, AUD: 1.5210, BDT: 117.10,
  BGN: 1.8210, BHD: 0.3760, BRL: 5.0450, CAD: 1.3620, CHF: 0.8830, CLP: 940.20,
  CNY: 7.2450, COP: 4020.10, CZK: 23.140, DKK: 6.9410, EGP: 47.850, FJD: 2.2410,
  GEL: 2.7020, GHS: 15.310, HKD: 7.8010, HRK: 7.0110, HUF: 361.20, IDR: 15840,
  ILS: 3.7020, INR: 83.14, JPY: 152.30, KES: 129.40, KRW: 1360.10, KWD: 0.3072,
  LKR: 292.40, MAD: 10.040, MXN: 17.510, MYR: 4.6810, NGN: 1585.30, NOK: 10.720,
  NPR: 133.10, NZD: 1.6420, OMR: 0.3845, PEN: 3.7420, PHP: 56.310, PKR: 278.20,
  PLN: 4.0110, QAR: 3.6410, RON: 4.5620, RSD: 108.70, SAR: 3.7502, SEK: 10.510,
  SGD: 1.3410, THB: 34.410, TND: 3.1210, TRY: 32.410, TWD: 32.140, TZS: 2610,
  UGX: 3720, UYU: 39.410, VND: 24810, XAF: 611.20, XOF: 611.20, ZAR: 18.410,
});

function crossRate(from: string, to: string): number {
  if (from === to) return 1;
  const f = USD_RATES[from];
  const t = USD_RATES[to];
  if (!f || !t) throw new Error(`Missing rate for ${!f ? from : to}`);
  return t / f;
}

/**
 * Simulated async rate lookup (matches the shape of a real /rates call).
 * Kept intentionally fast (~250ms) but instrumented with a 3s timeout so
 * the UI can render a clean error path if the network stalls.
 */
async function fetchRate(from: string, to: string, signal: AbortSignal): Promise<number> {
  await new Promise<void>((resolve, reject) => {
    const id = setTimeout(resolve, 220 + Math.random() * 180);
    signal.addEventListener("abort", () => {
      clearTimeout(id);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
  return crossRate(from, to);
}

const SEND_CURRENCIES = SEND_CURRENCY_CODES;
const RECEIVE_CURRENCIES = RECEIVE_CURRENCY_CODES;

const FEE_RATE = 0.0035; // 0.35%
const MAX_AMOUNT = 250_000;
const MIN_AMOUNT = 1;
const RATE_TIMEOUT_MS = 3000;

type RateState =
  | { status: "loading" }
  | { status: "ready"; rate: number }
  | { status: "error"; message: string };

export function SendMoneyCalculator() {
  const [amount, setAmount] = useState("1000");
  const [send, setSend] = useState<string>("GBP");
  const [receive, setReceive] = useState<string>("USD");
  const [rateState, setRateState] = useState<RateState>({ status: "loading" });
  const [reloadKey, setReloadKey] = useState(0);
  const attemptRef = useRef(0);

  const numeric = Number(amount.replace(/,/g, "")) || 0;

  const validation = useMemo(() => {
    if (amount.trim() === "") return { ok: false, message: "Enter an amount to preview your transfer." };
    if (Number.isNaN(numeric)) return { ok: false, message: "That doesn't look like a valid amount." };
    if (numeric > 0 && numeric < MIN_AMOUNT) return { ok: false, message: `Minimum transfer is ${MIN_AMOUNT} ${send}.` };
    if (numeric > MAX_AMOUNT)
      return { ok: false, message: `For transfers above ${new Intl.NumberFormat("en-GB").format(MAX_AMOUNT)} ${send}, contact our payments desk.` };
    return { ok: true, message: "" };
  }, [amount, numeric, send]);

  useEffect(() => {
    const controller = new AbortController();
    const attempt = ++attemptRef.current;
    setRateState({ status: "loading" });
    const timeoutId = setTimeout(() => controller.abort(), RATE_TIMEOUT_MS);
    fetchRate(send, receive, controller.signal)
      .then((rate) => {
        if (attempt !== attemptRef.current) return;
        setRateState({ status: "ready", rate });
      })
      .catch((err: unknown) => {
        if (attempt !== attemptRef.current) return;
        const isAbort = err instanceof DOMException && err.name === "AbortError";
        setRateState({
          status: "error",
          message: isAbort
            ? "Rate lookup timed out. Please try again."
            : err instanceof Error
              ? err.message
              : "Couldn't load rate.",
        });
      })
      .finally(() => clearTimeout(timeoutId));
    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [send, receive, reloadKey]);

  const rate = rateState.status === "ready" ? rateState.rate : 0;
  const fee = numeric * FEE_RATE;
  const converted = validation.ok && rateState.status === "ready" ? (numeric - fee) * rate : 0;

  const fmt = (v: number, ccy: string) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: ccy, maximumFractionDigits: 2 }).format(v);
  const fmtNumber = (v: number) =>
    new Intl.NumberFormat("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v);

  const swap = () => {
    if ((SEND_CURRENCIES as readonly string[]).includes(receive)) {
      const next = receive;
      setReceive(send);
      setSend(next);
    }
  };

  const retry = () => setReloadKey((k) => k + 1);

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-background text-foreground shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          Live transfer preview
        </p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-primary">
          <span className={cn("h-1.5 w-1.5 rounded-full bg-primary", rateState.status === "loading" && "animate-pulse")} />
          {rateState.status === "loading" ? "Fetching" : rateState.status === "error" ? "Offline" : "Live"}
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
              <div className="mt-1 h-8 overflow-hidden" aria-live="polite" aria-busy={rateState.status === "loading"}>
                {rateState.status === "loading" ? (
                  <div className="h-7 w-40 animate-pulse rounded-md bg-muted-foreground/10" />
                ) : rateState.status === "error" ? (
                  <span className="text-sm font-medium text-destructive">—</span>
                ) : (
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
                )}
              </div>
            </div>
            <CurrencySelect
              value={receive}
              onChange={(v) => setReceive(v as typeof receive)}
              options={RECEIVE_CURRENCIES}
              ariaLabel="Recipient currency"
            />
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
          {rateState.status === "error" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
              role="alert"
              aria-live="assertive"
            >
              <div className="mt-2 flex items-center justify-between gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
                <span className="flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
                  <span>{rateState.message}</span>
                </span>
                <button
                  type="button"
                  onClick={retry}
                  className="inline-flex items-center gap-1 rounded-md border border-destructive/40 px-2 py-1 text-[11px] font-medium text-destructive transition-colors hover:bg-destructive/10"
                >
                  <RefreshCw className="h-3 w-3" strokeWidth={2} />
                  Retry
                </button>
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
            {rateState.status === "loading" ? (
              <span className="inline-block h-3.5 w-24 animate-pulse rounded bg-muted-foreground/10 align-middle" />
            ) : rateState.status === "error" ? (
              <span className="text-destructive">Unavailable</span>
            ) : (
              <>1 {send} = {rate.toFixed(4)} {receive}</>
            )}
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
            const parts = cleaned.split(".");
            const safe = parts.length > 2 ? `${parts[0]}.${parts.slice(1).join("")}` : cleaned;
            onValue(safe);
          }}
          className="mt-1 w-full bg-transparent text-2xl font-semibold tracking-institutional text-foreground tabular-nums focus:outline-none"
        />
      </div>
      <CurrencySelect
        value={currency}
        onChange={onCurrency}
        options={options}
        ariaLabel={`${label} currency`}
      />
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
