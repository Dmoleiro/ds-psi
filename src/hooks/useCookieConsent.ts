const CONSENT_KEY = 'ds-psi-cookie-consent'

export type CookieConsent = 'accepted' | 'pending'

export function getCookieConsent(): CookieConsent {
  if (typeof window === 'undefined') return 'pending'
  return localStorage.getItem(CONSENT_KEY) === 'accepted' ? 'accepted' : 'pending'
}

export function acceptCookieConsent(): void {
  localStorage.setItem(CONSENT_KEY, 'accepted')
}

export function clearCookieConsent(): void {
  localStorage.removeItem(CONSENT_KEY)
}
