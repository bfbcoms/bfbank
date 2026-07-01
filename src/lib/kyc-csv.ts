/**
 * CSV export for the admin KYC / KYB queue.
 *
 * Mirrors the filters + free-text search currently applied to the on-screen
 * table so the exported file matches what the compliance officer sees.
 * RFC 4180 quoting; safe against Excel formula injection (leading =, +, -, @).
 */
import type { Database } from "@/integrations/supabase/types";

type Kyc = Database["public"]["Tables"]["kyc_verifications"]["Row"];
type ExportRow = Kyc & {
  profile?: {
    full_name: string | null;
    first_name: string | null;
    last_name: string | null;
    country: string | null;
    status: Database["public"]["Enums"]["account_status"];
  } | null;
  business?: {
    company_name: string;
    registration_number: string;
    country_of_incorporation: string;
  } | null;
};

const HEADERS = [
  "Verification ID",
  "User ID",
  "Applicant",
  "Country",
  "Account type",
  "Company",
  "Registration",
  "Provider session",
  "KYC status",
  "Profile status",
  "Submitted at",
  "Completed at",
  "Rejection reason",
] as const;

function esc(value: unknown): string {
  if (value === null || value === undefined) return "";
  let s = String(value);
  // Neutralize spreadsheet formula injection.
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  if (/[",\n\r]/.test(s)) s = `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function buildKycCsv(rows: ExportRow[]): string {
  const lines: string[] = [HEADERS.join(",")];
  for (const r of rows) {
    const name =
      r.profile?.full_name ??
      [r.profile?.first_name, r.profile?.last_name].filter(Boolean).join(" ").trim() ??
      "";
    lines.push(
      [
        r.id,
        r.user_id,
        name,
        r.profile?.country ?? "",
        r.account_type,
        r.business?.company_name ?? "",
        r.business?.registration_number ?? "",
        r.didit_session_id ?? "",
        r.didit_status,
        r.profile?.status ?? "",
        r.submitted_at,
        r.completed_at ?? "",
        r.rejection_reason ?? "",
      ]
        .map(esc)
        .join(","),
    );
  }
  return lines.join("\r\n");
}

export interface KycExportContext {
  status: string;
  q: string;
}

export function exportKycRowsToCsv(rows: ExportRow[], ctx: KycExportContext): void {
  const csv = buildKycCsv(rows);
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const parts = ["bfb-kyc", ctx.status, ctx.q ? "search" : null, ts].filter(Boolean).join("_");
  const a = document.createElement("a");
  a.href = url;
  a.download = `${parts}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
