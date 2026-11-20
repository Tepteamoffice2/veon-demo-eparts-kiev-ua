// Eparts demo: static Astro site. The public address comes from the environment (PUBLIC_SITE_URL), never hard-coded.
import { defineConfig } from "astro/config";

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || undefined,
  build: { inlineStylesheets: "auto" },
  compressHTML: true,
  devToolbar: { enabled: false },
});
