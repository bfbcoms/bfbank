// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

// Post-build helper: TanStack Start emits the client to dist/client/, but
// vite-plugin-pwa writes sw.js/workbox-*.js to dist/. Copy them alongside
// the client bundle so they're served from the site root in production.
function copyPwaAssetsToClient() {
  return {
    name: "bfb-copy-pwa-to-client",
    apply: "build" as const,
    closeBundle() {
      const distRoot = resolve(process.cwd(), "dist");
      const clientDir = resolve(distRoot, "client");
      if (!existsSync(clientDir)) mkdirSync(clientDir, { recursive: true });
      for (const name of ["sw.js", "sw.js.map"]) {
        const from = resolve(distRoot, name);
        if (existsSync(from)) cpSync(from, resolve(clientDir, name));
      }
      // Workbox runtime chunk has a content-hash suffix — pick it up dynamically.
      // Kept in sync via glob on next build.
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require("node:fs") as typeof import("node:fs");
      for (const entry of fs.readdirSync(distRoot)) {
        if (/^workbox-[0-9a-f]+\.js(\.map)?$/i.test(entry)) {
          cpSync(resolve(distRoot, entry), resolve(clientDir, entry));
        }
      }
    },
  };
}

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  plugins: [
    VitePWA({
      // We register the SW ourselves via a guarded wrapper in src/pwa/register.ts.
      injectRegister: null,
      // Never emit a service worker in dev — Lovable preview must stay uncached.
      devOptions: { enabled: false },
      registerType: "autoUpdate",
      filename: "sw.js",
      manifest: false, // we ship our own public/manifest.webmanifest
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff2}"],
        navigateFallback: "/",
        navigateFallbackDenylist: [/^\/~oauth/, /^\/api\//, /^\/admin/],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            // HTML navigations — always try network first so new deploys land immediately.
            urlPattern: ({ request }) => request.mode === "navigate",
            handler: "NetworkFirst",
            options: {
              cacheName: "bfb-html",
              networkTimeoutSeconds: 3,
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 },
            },
          },
          {
            // Hashed same-origin assets — safe to cache-first.
            urlPattern: ({ url, request, sameOrigin }) =>
              sameOrigin &&
              ["style", "script", "worker", "font", "image"].includes(request.destination) &&
              /\.[0-9a-f]{8,}\./i.test(url.pathname),
            handler: "CacheFirst",
            options: {
              cacheName: "bfb-assets",
              expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
    copyPwaAssetsToClient(),
  ],
});

