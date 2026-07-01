/**
 * Unit coverage for the Didit webhook processor and the KYC CSV export.
 *
 * The webhook processor is dependency-injected, so we drive it with an
 * in-memory Supabase-shaped fake — no HTTP, no DB. Covers:
 *   - missing secret / bad signature / invalid JSON / invalid payload
 *   - unknown session (404)
 *   - happy-path approve + profile flip + notification write
 *   - idempotent redelivery of a terminal event
 *   - refusal to overwrite a terminal state with a conflicting one
 *   - transient DB error → 200 retryable (never 5xx)
 */
import { describe, it, expect } from "vitest";
import { createHmac } from "crypto";
import { processDiditWebhook, verifyDiditSignature } from "@/lib/didit-webhook.server";
import { buildKycCsv } from "@/lib/kyc-csv";

const SECRET = "test-secret-abcdef";

function sign(body: string): string {
  return createHmac("sha256", SECRET).update(body).digest("hex");
}

interface FakeVerification {
  id: string;
  user_id: string;
  didit_session_id: string;
  didit_status: "pending" | "approved" | "rejected" | "expired";
}

function makeFakeAdmin(opts: {
  verifications?: FakeVerification[];
  readError?: string;
  updateError?: string;
} = {}) {
  const store = {
    verifications: [...(opts.verifications ?? [])],
    profiles: [] as Array<{ id: string; status: string; rejection_reason: string | null }>,
    notifications: [] as unknown[],
  };
  const admin = {
    from(table: string) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const builder: any = {
        _table: table,
        _op: "select",
        _filter: null as null | { col: string; val: unknown },
        _payload: null as unknown,
        select() {
          this._op = "select";
          return this;
        },
        insert(payload: unknown) {
          if (table === "notification_logs") store.notifications.push(payload);
          return Promise.resolve({ error: null });
        },
        update(payload: unknown) {
          this._op = "update";
          this._payload = payload;
          return this;
        },
        eq(col: string, val: unknown) {
          this._filter = { col, val };
          if (this._op === "update") {
            if (opts.updateError) return Promise.resolve({ error: { message: opts.updateError } });
            if (table === "kyc_verifications") {
              const v = store.verifications.find((x) => (x as any)[col] === val);
              if (v) Object.assign(v, this._payload);
            }
            if (table === "profiles") {
              const p = { id: val as string, status: "pending_kyc", rejection_reason: null };
              const existing = store.profiles.find((x) => x.id === val);
              const target = existing ?? p;
              Object.assign(target, this._payload);
              if (!existing) store.profiles.push(target);
            }
            return Promise.resolve({ error: null });
          }
          return this;
        },
        maybeSingle() {
          if (opts.readError) return Promise.resolve({ data: null, error: { message: opts.readError } });
          const row = store.verifications.find(
            (v) => (v as any)[this._filter!.col] === this._filter!.val,
          );
          return Promise.resolve({ data: row ?? null, error: null });
        },
      };
      return builder;
    },
    auth: { admin: { getUserById: async () => ({ data: { user: { email: "u@example.com" } } }) } },
    rpc: async () => ({ data: true, error: null }),
  } as any;
  return { admin, store };
}

const validBody = (overrides: Record<string, unknown> = {}) =>
  JSON.stringify({ session_id: "sess_1", status: "approved", ...overrides });

describe("verifyDiditSignature", () => {
  it("passes on a matching HMAC", () => {
    const body = validBody();
    expect(verifyDiditSignature(body, sign(body), SECRET)).toBe(true);
  });
  it("rejects null / empty / wrong-length signatures", () => {
    expect(verifyDiditSignature("x", null, SECRET)).toBe(false);
    expect(verifyDiditSignature("x", "", SECRET)).toBe(false);
    expect(verifyDiditSignature("x", "deadbeef", SECRET)).toBe(false);
  });
});

describe("processDiditWebhook", () => {
  it("returns 500 when secret is missing", async () => {
    const { admin } = makeFakeAdmin();
    const r = await processDiditWebhook("{}", "x", undefined, admin);
    expect(r.status).toBe(500);
  });

  it("returns 401 on bad signature", async () => {
    const { admin } = makeFakeAdmin();
    const r = await processDiditWebhook(validBody(), "not-a-real-sig", SECRET, admin);
    expect(r.status).toBe(401);
  });

  it("returns 400 on invalid JSON", async () => {
    const { admin } = makeFakeAdmin();
    const body = "not-json";
    const r = await processDiditWebhook(body, sign(body), SECRET, admin);
    expect(r.status).toBe(400);
  });

  it("returns 400 on schema-invalid payload", async () => {
    const { admin } = makeFakeAdmin();
    const body = JSON.stringify({ session_id: "s", status: "spaceship" });
    const r = await processDiditWebhook(body, sign(body), SECRET, admin);
    expect(r.status).toBe(400);
  });

  it("returns 404 when the session is unknown", async () => {
    const { admin } = makeFakeAdmin();
    const body = validBody();
    const r = await processDiditWebhook(body, sign(body), SECRET, admin);
    expect(r.status).toBe(404);
  });

  it("approves the verification, flips the profile, and enqueues a notification", async () => {
    const { admin, store } = makeFakeAdmin({
      verifications: [
        { id: "v1", user_id: "u1", didit_session_id: "sess_1", didit_status: "pending" },
      ],
    });
    const body = validBody();
    const r = await processDiditWebhook(body, sign(body), SECRET, admin);
    expect(r.status).toBe(200);
    expect(store.verifications[0].didit_status).toBe("approved");
    expect(store.profiles[0]).toMatchObject({ id: "u1", status: "active" });
    expect(store.notifications).toHaveLength(1);
  });

  it("is idempotent for repeat terminal deliveries", async () => {
    const { admin, store } = makeFakeAdmin({
      verifications: [
        { id: "v1", user_id: "u1", didit_session_id: "sess_1", didit_status: "approved" },
      ],
    });
    const body = validBody();
    const r = await processDiditWebhook(body, sign(body), SECRET, admin);
    expect(r.status).toBe(200);
    expect(r.body).toMatchObject({ idempotent: true });
    expect(store.notifications).toHaveLength(0);
  });

  it("refuses to overwrite a terminal state with a conflicting one", async () => {
    const { admin } = makeFakeAdmin({
      verifications: [
        { id: "v1", user_id: "u1", didit_session_id: "sess_1", didit_status: "rejected" },
      ],
    });
    const body = validBody(); // approved
    const r = await processDiditWebhook(body, sign(body), SECRET, admin);
    expect(r.status).toBe(409);
  });

  it("returns 200 retryable on a transient read failure (never 5xx)", async () => {
    const { admin } = makeFakeAdmin({ readError: "connection reset" });
    const body = validBody();
    const r = await processDiditWebhook(body, sign(body), SECRET, admin);
    expect(r.status).toBe(200);
    expect(r.body).toMatchObject({ ok: false, retryable: true });
  });
});

describe("buildKycCsv", () => {
  it("emits headers plus one row per record", () => {
    const csv = buildKycCsv([
      {
        id: "k1",
        user_id: "u1",
        account_type: "individual",
        provider: "didit",
        didit_session_id: "sess_1",
        didit_status: "approved",
        didit_verification_url: null,
        raw_payload: null,
        rejection_reason: null,
        submitted_at: "2026-06-01T10:00:00.000Z",
        completed_at: "2026-06-01T10:05:00.000Z",
        updated_at: "2026-06-01T10:05:00.000Z",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    ]);
    expect(csv.split("\r\n")).toHaveLength(2);
    expect(csv).toContain("Verification ID");
    expect(csv).toContain("k1");
  });

  it("neutralizes leading-equals formula injection", () => {
    const csv = buildKycCsv([
      {
        id: "k1",
        user_id: "u1",
        account_type: "individual",
        provider: "didit",
        didit_session_id: "=SUM(A1:A9)",
        didit_status: "pending",
        didit_verification_url: null,
        raw_payload: null,
        rejection_reason: null,
        submitted_at: "2026-06-01T10:00:00.000Z",
        completed_at: null,
        updated_at: "2026-06-01T10:00:00.000Z",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    ]);
    expect(csv).toContain("'=SUM(A1:A9)");
  });

  it("quotes fields with commas and doubles embedded quotes", () => {
    const csv = buildKycCsv([
      {
        id: "k1",
        user_id: "u1",
        account_type: "individual",
        provider: "didit",
        didit_session_id: 'has,comma and "quote"',
        didit_status: "pending",
        didit_verification_url: null,
        raw_payload: null,
        rejection_reason: null,
        submitted_at: "2026-06-01T10:00:00.000Z",
        completed_at: null,
        updated_at: "2026-06-01T10:00:00.000Z",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
    ]);
    expect(csv).toContain('"has,comma and ""quote"""');
  });
});
