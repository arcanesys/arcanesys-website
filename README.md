# arcanesys-website

Source code for the Arcane Systems website, deployed to https://arcanesys.fr via Netlify.

## Development

```bash
pnpm install
pnpm astro dev     # local dev server
pnpm astro build   # production build
pnpm astro preview # preview production build
```

## Structure

- `src/pages/en/` — English pages
- `src/pages/fr/` — French pages
- `src/components/` — Astro components
- `src/i18n/` — translation strings
- `src/styles/global.css` — Tailwind + fonts + grain overlay
- `public/fonts/` — self-hosted woff2 fonts

## Deployment

Netlify deploys from `main` on every push. Build command: `pnpm build`, publish directory: `dist`.

Contact: [contact@arcanesys.fr](mailto:contact@arcanesys.fr)
