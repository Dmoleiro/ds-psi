# Daniela Santos Psicologia

Website for the psychology clinic **Daniela Santos Psicologia** in Azambuja.

Built with React, TypeScript, Vite, and Vitest.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output is in `dist/`.

## Tests

```bash
npm test
```

## Deploy to GitHub Pages

The repo includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that deploys on every push to `master`.

### One-time setup on GitHub

1. Open **https://github.com/Dmoleiro/ds-psi/settings/pages**
2. Under **Build and deployment → Source**, choose **GitHub Actions** (not “Deploy from a branch”)
3. Push to `master` (or re-run the workflow from the **Actions** tab)

After the workflow succeeds, the site will be at:

**https://dmoleiro.github.io/ds-psi/**

### Manual deploy (optional)

```bash
npm install
VITE_BASE_PATH=/ds-psi/ npm run build
```

Then publish the `dist/` folder with any static host. For Namecheap later, build with `VITE_BASE_PATH=/` (or omit it) if the site lives at the domain root.

## Project structure

- `src/content/` — site copy and data (Portuguese)
- `src/components/sections/` — page sections
- `src/components/layout/` — header, footer, layout primitives
- `src/components/ui/` — reusable UI components

## Planned features

- Patient forms with secure, therapist-specific access links
- Backoffice for patient profile management
- Privacy policy and cookie policy pages


## Dev

- dmoleiro