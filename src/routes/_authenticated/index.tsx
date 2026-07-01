import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/")({
  component: AuthenticatedHome,
});

function AuthenticatedHome() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">Bright Future Bank</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-institutional">
          Your account is ready.
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          Accounts, cards and transfers will appear here as we roll out the platform.
        </p>
      </div>
    </main>
  );
}
