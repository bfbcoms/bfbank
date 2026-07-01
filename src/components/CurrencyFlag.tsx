import { getCurrencyFlagUrl, getCurrency } from "@/lib/currencies";
import { cn } from "@/lib/utils";

type CurrencyFlagProps = {
  code: string;
  size?: number;
  className?: string;
};

/**
 * Circular country flag paired with a currency code. Sourced from the
 * open-source `circle-flags` SVG set (same visual style as Flaticon's
 * circle-flag pack), served via CDN with lazy loading.
 */
export function CurrencyFlag({ code, size = 18, className }: CurrencyFlagProps) {
  const src = getCurrencyFlagUrl(code);
  const meta = getCurrency(code);
  if (!src) return null;
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      loading="lazy"
      title={meta?.name}
      className={cn("inline-block shrink-0 rounded-full object-cover ring-1 ring-border/60", className)}
      style={{ height: size, width: size }}
    />
  );
}

type CurrencyBadgeProps = {
  code: string;
  size?: number;
  className?: string;
  /** Show the currency code text next to the flag. Defaults to true. */
  showCode?: boolean;
};

/** Flag + uppercase currency code, used inside tables, cards, chips. */
export function CurrencyBadge({ code, size = 18, className, showCode = true }: CurrencyBadgeProps) {
  return (
    <span className={cn("inline-flex items-center gap-2 whitespace-nowrap", className)}>
      <CurrencyFlag code={code} size={size} />
      {showCode ? <span className="font-medium uppercase tracking-institutional">{code}</span> : null}
    </span>
  );
}
