import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";

const primaryNav = [
  { to: "/personal", label: "Personal" },
  { to: "/business", label: "Business" },
  { to: "/transfers", label: "Transfers" },
  { to: "/cards", label: "Cards" },
  { to: "/pricing", label: "Pricing" },
  { to: "/security", label: "Security" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "border-b border-border bg-background/85 backdrop-blur-md"
            : "border-b border-transparent bg-background/0"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-8 w-8 place-items-center bg-secondary text-primary text-sm font-semibold">
              B
            </span>
            <span className="text-sm font-medium tracking-institutional uppercase">
              Bright Future Bank
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {primaryNav.map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`text-sm transition-colors ${
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground md:inline-flex"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="hidden h-10 items-center bg-primary px-5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 md:inline-flex"
            >
              Get started
            </Link>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              className="grid h-11 w-11 place-items-center border border-border text-foreground lg:hidden"
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${drawerOpen ? "pointer-events-auto" : "pointer-events-none"}`}
        aria-hidden={!drawerOpen}
      >
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
            drawerOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setDrawerOpen(false)}
        />
        <aside
          className={`absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-secondary text-secondary-foreground transition-transform duration-300 ease-out ${
            drawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <span className="text-xs uppercase tracking-[0.3em] text-primary">Menu</span>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close menu"
              className="grid h-11 w-11 place-items-center border border-white/15"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-6 py-8">
            <ul className="space-y-1">
              {primaryNav.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="flex items-center justify-between border-b border-white/5 py-4 text-xl font-semibold tracking-institutional transition-colors hover:text-primary"
                  >
                    {item.label}
                    <ArrowUpRight className="h-5 w-5 opacity-40" strokeWidth={1.5} />
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/help"
                  className="flex items-center justify-between border-b border-white/5 py-4 text-xl font-semibold tracking-institutional transition-colors hover:text-primary"
                >
                  Help centre
                  <ArrowUpRight className="h-5 w-5 opacity-40" strokeWidth={1.5} />
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="flex items-center justify-between border-b border-white/5 py-4 text-xl font-semibold tracking-institutional transition-colors hover:text-primary"
                >
                  About
                  <ArrowUpRight className="h-5 w-5 opacity-40" strokeWidth={1.5} />
                </Link>
              </li>
            </ul>
          </nav>

          <div className="space-y-3 border-t border-white/10 px-6 py-6">
            <Link
              to="/signup"
              className="flex h-12 items-center justify-center bg-primary text-sm font-medium tracking-institutional uppercase text-primary-foreground"
            >
              Open an account
            </Link>
            <Link
              to="/login"
              className="flex h-12 items-center justify-center border border-white/20 text-sm tracking-institutional uppercase"
            >
              Log in
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
