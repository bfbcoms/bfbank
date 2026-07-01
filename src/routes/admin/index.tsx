import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  component: AdminHome,
});

function AdminHome() {
  return (
    <main className="min-h-screen bg-secondary text-secondary-foreground">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">
          Bright Future Bank · Operations
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-institutional">Admin console</h1>
        <p className="mt-3 max-w-xl text-sm text-secondary-foreground/70">
          Compliance, support and platform tooling will appear here.
        </p>
      </div>
    </main>
  );
}
