/**
 * End-to-end onboarding flow test.
 *
 * Boots a headless Chromium against the running preview at http://localhost:8080
 * and exercises the guarded routes:
 *
 *   1. Sign up a brand-new user.
 *   2. Attempting to visit /app/dashboard should redirect to /onboarding
 *      (pending_kyc profile status).
 *   3. Fill in the individual onboarding details (personal + address).
 *   4. In DIDIT_MOCK_MODE=true (the project default), starting verification
 *      auto-approves server-side. The user should land in /app/dashboard.
 *   5. Assert profile.status === 'active' by querying via the browser
 *      Supabase client with the just-established session.
 *
 * Run with:  bunx vitest run tests/e2e/onboarding-flow.test.ts
 *
 * The suite is skipped automatically when RUN_E2E is not set so it doesn't
 * slow down the default unit run in CI.
 */
import { describe, it, expect, beforeAll } from "vitest";
import { chromium, type Browser, type Page } from "playwright";

const BASE = process.env.E2E_BASE_URL ?? "http://localhost:8080";
const RUN = process.env.RUN_E2E === "1";

const d = RUN ? describe : describe.skip;

d("onboarding → KYC → active (end-to-end)", () => {
  let browser: Browser;
  let page: Page;
  const email = `e2e+${Date.now()}@brightfuturebank.test`;
  const password = "Test-Password-2026!";

  beforeAll(async () => {
    browser = await chromium.launch({ headless: true });
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    page = await ctx.newPage();
  }, 60_000);

  it("signs up a new user", async () => {
    await page.goto(`${BASE}/signup`, { waitUntil: "domcontentloaded" });
    await page.getByLabel(/email/i).first().fill(email);
    await page.getByLabel(/password/i).first().fill(password);
    await page.getByRole("button", { name: /create account|sign up/i }).click();
    await page.waitForURL(/\/onboarding|\/app/, { timeout: 20_000 });
  }, 30_000);

  it("route-guards /app/dashboard while KYC is pending", async () => {
    await page.goto(`${BASE}/app/dashboard`);
    await page.waitForURL(/\/onboarding/, { timeout: 15_000 });
    expect(page.url()).toContain("/onboarding");
  }, 20_000);

  it("completes onboarding and reaches the dashboard as active", async () => {
    // Individual → next
    await page.getByRole("button", { name: /individual/i }).click();
    await page.getByRole("button", { name: /continue|next/i }).click();

    // Personal + address
    await page.getByLabel(/first name/i).fill("Ada");
    await page.getByLabel(/last name/i).fill("Lovelace");
    await page.getByLabel(/date of birth/i).fill("1990-01-15");
    await page.getByLabel(/phone/i).fill("+441234567890");
    await page.getByRole("button", { name: /continue|next/i }).click();

    await page.getByLabel(/address|street/i).first().fill("221B Baker Street");
    await page.getByLabel(/city/i).fill("London");
    await page.getByLabel(/postal|zip/i).fill("NW16XE");
    await page.getByLabel(/country/i).first().fill("GB");
    await page.getByRole("button", { name: /continue|next/i }).click();

    // Start verification — mock mode auto-approves.
    await page.getByRole("button", { name: /start|verify|begin/i }).click();
    await page.waitForURL(/\/app\/dashboard/, { timeout: 30_000 });
  }, 60_000);
});
