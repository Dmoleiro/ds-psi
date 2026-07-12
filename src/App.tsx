import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SiteLayout } from './components/layout/SiteLayout'
import { CookiesPolicyPage } from './pages/CookiesPolicyPage'
import { HomePage } from './pages/HomePage'
import './styles/global.css'

function getBasename(): string {
  const base = import.meta.env.BASE_URL
  if (!base || base === '/') return '/'
  return base.endsWith('/') ? base.slice(0, -1) : base
}

export function App() {
  return (
    <BrowserRouter basename={getBasename()}>
      <Routes>
        <Route
          path="/"
          element={
            <SiteLayout>
              <HomePage />
            </SiteLayout>
          }
        />
        <Route
          path="/politica-cookies"
          element={
            <SiteLayout>
              <CookiesPolicyPage />
            </SiteLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
