// @ts-check
import { defineConfig } from 'astro/config';

/**
 * Moda — Astro-configuratie
 * ---------------------------------------------------------
 * De site is volledig statisch: Astro bouwt gewone HTML-bestanden
 * naar dist/, die je zowel op Cloudflare Pages als op Netlify kan
 * zetten. Er draait geen server, dus er is niets dat kan uitvallen.
 *
 * build.format: 'directory' zorgt dat de adressen exact blijven
 * zoals ze nu zijn: /, /luchthaven/, /transport/ en /travel/.
 */
export default defineConfig({
  output: 'static',
  build: {
    format: 'directory',
  },
  // Alles in public/ (css, js, afbeeldingen, content, admin) wordt
  // letterlijk gekopieerd, zonder dat Astro er iets aan verandert.
  publicDir: 'public',
  srcDir: 'src',
  outDir: 'dist',
});
