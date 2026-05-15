# arcanesys-website

Source for [arcanesys.fr](https://arcanesys.fr) — the NixFleet public technical reference.
Astro 6 + Tailwind v4, bilingual (FR + EN), deployed to Netlify.

## What this site is

A documentary technical reference for NixFleet (signed-artifact GitOps fleet management
for NixOS). Information architecture: home, product, compliance, vision, pilot, demo,
about, contact, legal/privacy, legal/terms — mirrored under `/en/*` and `/fr/*`.

The site is the **public documentary surface**, not the marketing channel. Marketing
content (LinkedIn posts, forum threads, conference talks) lives elsewhere. Content on
this site should read as documentation — regulation-anchored, technically precise, no
project-status framing.

## Development

```bash
pnpm install
pnpm dev       # local dev server on http://localhost:4321
pnpm build     # static build → dist/
pnpm preview   # serve the built dist/
```

Node ≥ 20 required. Uses `pnpm` v10 via the lockfile.

## Structure

```
src/
  pages/
    index.astro              auto-detect Accept-Language → /fr/ or /en/
    404.astro                404 splash
    en/                      English routes (mirrored under fr/)
      index.astro
      product.astro
      compliance.astro
      vision.astro
      pilot.astro
      demo.astro
      about.astro
      contact.astro          Netlify Form → contact@arcanesys.fr
      legal/
        privacy.astro
        terms.astro
    fr/                      French routes (mirror of en/)
  components/
    Layout.astro             <head>, OG/Twitter meta, hreflang alternates
    Nav.astro                page-link nav with active state + lang toggle
    Hero.astro               home-page header (nav + headline)
    PageHeader.astro         non-home page header (nav + title + subtitle)
    MetricsBar.astro
    CtaSection.astro
    Footer.astro
  i18n/
    en.json
    fr.json
    utils.ts                 t(lang, key) lookup, getLang(url)
  styles/
    global.css               Tailwind v4 import, prose, fonts, grain overlay
  layouts/
    Layout.astro             top-level page wrapper
public/
  fonts/                     self-hosted variable woff2 (Fraunces, Lora, JetBrains Mono)
  robots.txt
  sitemap.xml                hreflang alternates for all 10 routes
netlify.toml                 build config + security headers
tailwind.config.mjs          custom theme: ink / paper / muted / indigo / amber / emerald / rose
astro.config.mjs             Tailwind v4 via @tailwindcss/vite, i18n routing
```

## Design system

- **Type** — Fraunces (display), Lora (body), JetBrains Mono (UI/code), all self-hosted variable woff2
- **Palette** — dark `#0a0e1a` for hero/nav/footer; parchment `#faf8f5` for body; indigo / amber / emerald / rose accents
- **Grain overlay** — SVG fractal noise at low opacity for paper texture
- **Prose** — `.prose` class in `global.css` styles markdown-ish content (h2 with numbered span, tables, bullets, blockquotes, code blocks)

## Internationalisation

- `astro.config.mjs` declares `locales: ['en', 'fr']`, `prefixDefaultLocale: true`
- `/` is a tiny redirect surface — client-side script reads `navigator.language` and replaces with `/fr/` or `/en/` (noscript fallback to `/en/`)
- Per-page language toggle in Nav preserves the current route (`/en/product/` ↔ `/fr/product/`)
- `Layout.astro` emits `<link rel="alternate" hreflang>` for both languages plus `x-default`
- All chrome strings live in `src/i18n/{en,fr}.json` under nested keys; pages call `t(lang, 'nav.product')` etc.
- Long-form content is inline in each page file (paired EN ↔ FR) for diff-able parity

## Contact form

`/contact` uses Netlify Forms — `data-netlify="true"` on the `<form>`, plus a hidden
`form-name` input. No external service required beyond the Netlify hosting account.

After first deploy, configure the email notification in the Netlify dashboard:
**Forms → contact → Notifications → add email** → `contact@arcanesys.fr`.

Topic pre-fill: pages link to `/contact/?topic=pilot|workshop|vision` and a small
inline script populates a hidden field + adds a prefix to the message textarea.

## Deployment

Netlify deploys from the default branch on push. Build command: `pnpm build`,
publish directory: `dist/`. Security headers (X-Frame-Options, Referrer-Policy,
Permissions-Policy) are set in `netlify.toml`.

DNS for `arcanesys.fr` should not be pointed at Netlify until the v0.2 push to
`arcanesys/nixfleet*` repos has landed — otherwise outbound links to source
repositories will 404.

## Editorial guidelines

Two rules govern content on this site:

1. **Documentary tone, not marketing.** No project-status framing (TRL levels,
   release-as-feature), no market-positioning (competition, advisory market, windows).
   Anchor on regulatory deadlines (NIS2, DORA, ANSSI BP-028) and technical answers.
2. **Generalise external integration points.** NixFleet is pluggable. The website
   describes the framework abstractly: "self-hosted Git forge", "Nix binary cache",
   "hardware security tokens" — not specific implementations operators may swap
   (Forgejo, Attic, YubiKey). NixFleet's own implementation choices (Axum, rustls,
   SQLite, Ed25519, JCS, mTLS, TPM2/PCR/EK) stay.

## License

Source: MIT. Logo and copy: © Arcanesys.

Contact: [contact@arcanesys.fr](mailto:contact@arcanesys.fr).
