import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const RateInput = z.object({
  from: z.string().length(3).regex(/^[A-Z]{3}$/),
  to: z.string().length(3).regex(/^[A-Z]{3}$/),
});

export type NiumRateResult = {
  rate: number;
  source: "nium" | "fallback";
  fetchedAt: string;
  error?: string;
};

/**
 * Fetch a live FX rate from Nium. Returns `{ source: "fallback" }` with rate=0
 * when credentials or the upstream call fail so the client can degrade to its
 * local cross-rate table without surfacing internal errors.
 */
export const getNiumRate = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => RateInput.parse(input))
  .handler(async ({ data }): Promise<NiumRateResult> => {
    const fetchedAt = new Date().toISOString();
    const { from, to } = data;
    if (from === to) return { rate: 1, source: "nium", fetchedAt };

    const apiKey = process.env.NIUM_API_KEY;
    const clientHashId = process.env.NIUM_CLIENT_HASH_ID;
    const base = process.env.NIUM_BASE_URL ?? "https://gateway.nium.com/api/v1";

    if (!apiKey || !clientHashId) {
      return { rate: 0, source: "fallback", fetchedAt, error: "missing_credentials" };
    }

    const url = new URL(`${base}/client/${encodeURIComponent(clientHashId)}/exchangeRate`);
    url.searchParams.set("sourceCurrencyCode", from);
    url.searchParams.set("destinationCurrencyCode", to);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "x-api-key": apiKey,
          accept: "application/json",
        },
        signal: controller.signal,
      }).finally(() => clearTimeout(timeout));

      if (!res.ok) {
        return { rate: 0, source: "fallback", fetchedAt, error: `http_${res.status}` };
      }
      const body = (await res.json()) as Record<string, unknown>;
      const raw =
        body.exchangeRate ??
        body.fxRate ??
        body.rate ??
        (body.data as Record<string, unknown> | undefined)?.exchangeRate;
      const rate = typeof raw === "string" ? Number(raw) : (raw as number);
      if (!Number.isFinite(rate) || rate <= 0) {
        return { rate: 0, source: "fallback", fetchedAt, error: "invalid_rate" };
      }
      return { rate, source: "nium", fetchedAt };
    } catch (err) {
      const message = err instanceof Error ? err.message : "unknown_error";
      return { rate: 0, source: "fallback", fetchedAt, error: message };
    }
  });
