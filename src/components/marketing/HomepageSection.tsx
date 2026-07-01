import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";

export type SectionBullet = { title: string; body: string };

export function HomepageSection({
  eyebrow,
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  imageUrl,
  imageAlt,
  bullets,
  reverse = false,
  dark = false,
}: {
  eyebrow?: string | null;
  title?: string | null;
  subtitle?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  imageUrl?: string | null;
  imageAlt?: string;
  bullets?: SectionBullet[];
  reverse?: boolean;
  dark?: boolean;
}) {
  return (
    <section
      className={
        dark
          ? "bg-secondary text-secondary-foreground"
          : "bg-background text-foreground"
      }
    >
      <div
        className={`mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 md:py-32 lg:grid-cols-2 ${
          reverse ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {eyebrow && (
            <p className="text-xs uppercase tracking-[0.3em] text-primary">{eyebrow}</p>
          )}
          {title && (
            <h2 className="mt-4 text-4xl font-semibold tracking-institutional md:text-5xl">
              {title}
            </h2>
          )}
          {subtitle && (
            <p
              className={`mt-5 max-w-xl text-base md:text-lg ${
                dark ? "text-secondary-foreground/70" : "text-muted-foreground"
              }`}
            >
              {subtitle}
            </p>
          )}

          {bullets && bullets.length > 0 && (
            <ul className="mt-10 space-y-6">
              {bullets.map((b) => (
                <li key={b.title} className="flex gap-4">
                  <span
                    className={`mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full ${
                      dark ? "bg-primary/15 text-primary" : "bg-primary/15 text-primary"
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold tracking-institutional">
                      {b.title}
                    </h3>
                    <p
                      className={`mt-1 text-sm ${
                        dark ? "text-secondary-foreground/70" : "text-muted-foreground"
                      }`}
                    >
                      {b.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {ctaHref && ctaLabel && (
            <Link
              to={ctaHref}
              className="mt-10 inline-flex h-12 items-center bg-primary px-7 text-sm font-medium tracking-institutional uppercase text-primary-foreground transition-all hover:bg-primary/90"
            >
              {ctaLabel}
              <ArrowUpRight className="ml-2 h-4 w-4" strokeWidth={1.5} aria-hidden />
            </Link>
          )}
        </motion.div>

        {imageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative flex items-center justify-center"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-8 bottom-6 h-10 rounded-[50%] bg-black/40 blur-2xl"
            />
            <motion.img
              src={imageUrl}
              alt={imageAlt ?? title ?? "Bright Future Bank"}
              width={1280}
              height={960}
              loading="lazy"
              className="relative w-full max-w-[560px] select-none object-contain drop-shadow-[0_40px_60px_rgba(219,177,73,0.18)]"
              animate={{ y: [0, -14, 0], rotate: [0, 0.6, 0] }}
              transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
              whileHover={{ scale: 1.03, rotate: -1 }}
              draggable={false}
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}
