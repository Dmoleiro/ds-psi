/**
 * cPanel startup file — use this in Setup Node.js App (not app.js).
 * Passenger's Node loader works more reliably with CommonJS entry points.
 */
if (typeof PhusionPassenger !== 'undefined') {
  PhusionPassenger.configure({ autoInstall: false })
}

async function loadApp() {
  await import('./start.mjs')
}

loadApp().catch((err) => {
  console.error(err)
  process.exit(1)
})
