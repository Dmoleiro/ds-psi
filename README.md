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

1. Set the base path if deploying to a project subdirectory:

```bash
VITE_BASE_PATH=/ds-psi/ npm run build
```

2. Deploy the `dist/` folder to GitHub Pages.

For a custom domain on Namecheap, build with the default base (`/`) and upload `dist/` contents to your hosting.

## Project structure

- `src/content/` — site copy and data (Portuguese)
- `src/components/sections/` — page sections
- `src/components/layout/` — header, footer, layout primitives
- `src/components/ui/` — reusable UI components

## Planned features

- Patient forms with secure, therapist-specific access links
- Backoffice for patient profile management
- Privacy policy and cookie policy pages
