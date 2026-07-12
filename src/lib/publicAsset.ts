/** Resolve a public-folder path for the current Vite base (e.g. /ds-psi/ on GitHub Pages). */
export function publicAsset(path: string): string {
  const normalized = path.replace(/^\//, '')
  return `${import.meta.env.BASE_URL}${normalized}`
}
