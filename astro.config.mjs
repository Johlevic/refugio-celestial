import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import AstroPWA from "@vite-pwa/astro";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  output: "static",
  /** Barra flotante de Astro solo en desarrollo; desactivada si no la usas. */
  devToolbar: { enabled: false },
  integrations: [
    react(),
    tailwind({ applyBaseStyles: true }),
    AstroPWA({
      registerType: "autoUpdate",
      includeAssets: ["img/logo-refugio-celestial-best.png"],
      manifest: {
        name: "Refugio Celestial",
        short_name: "Refugio",
        description:
          "Meditación bíblica con versículos, categorías y modo offline básico.",
        theme_color: "#0b0f24",
        background_color: "#060612",
        display: "standalone",
        start_url: "/",
        scope: "/",
        lang: "es",
        icons: [
          {
            src: "/img/logo-refugio-celestial-best.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/img/logo-refugio-celestial-best.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        navigateFallback: "/index.html",
        globPatterns: ["**/*.{js,css,html,ico,png,jpg,jpeg,svg,woff2}"],
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  vite: {
    resolve: {
      alias: { "@": path.resolve(__dirname, "src") },
    },
  },
});
