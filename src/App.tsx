import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { SiteLayout } from './components/layout/SiteLayout'
import { RequireTherapist } from './components/backoffice/BackofficeLayout'
import { CookiesPolicyPage } from './pages/CookiesPolicyPage'
import { FormulariosPiccaPage } from './pages/FormulariosPiccaPage'
import { HomePage } from './pages/HomePage'
import { AdminCoordinatorsPage } from './pages/backoffice/AdminCoordinatorsPage'
import { AdminLocationsPage } from './pages/backoffice/AdminLocationsPage'
import { AdminTherapistsPage } from './pages/backoffice/AdminTherapistsPage'
import { AppointmentsPage } from './pages/backoffice/AppointmentsPage'
import { AttendancePage } from './pages/backoffice/AttendancePage'
import { BackofficeDashboardPage } from './pages/backoffice/BackofficeDashboardPage'
import { BackofficeLoginPage } from './pages/backoffice/BackofficeLoginPage'
import { PatientCreatePage } from './pages/backoffice/PatientCreatePage'
import { PatientDetailPage } from './pages/backoffice/PatientDetailPage'
import { PatientsListPage } from './pages/backoffice/PatientsListPage'
import { TherapistProfilePage } from './pages/backoffice/TherapistProfilePage'
import { PatientCompletePage } from './pages/patient/PatientCompletePage'
import { PatientFormPage } from './pages/patient/PatientFormPage'
import { PatientPortalPage } from './pages/patient/PatientPortalPage'
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
        <Route
          path="/formularios-picca"
          element={
            <SiteLayout>
              <FormulariosPiccaPage />
            </SiteLayout>
          }
        />
        <Route path="/formularios/p/:token" element={<PatientPortalPage />} />
        <Route path="/formularios/p/:token/concluido" element={<PatientCompletePage />} />
        <Route path="/formularios/p/:token/:formId" element={<PatientFormPage />} />
        <Route path="/backoffice/login" element={<BackofficeLoginPage />} />
        <Route path="/backoffice" element={<BackofficeDashboardPage />} />
        <Route path="/backoffice/patients" element={<RequireTherapist><PatientsListPage /></RequireTherapist>} />
        <Route path="/backoffice/patients/new" element={<RequireTherapist><PatientCreatePage /></RequireTherapist>} />
        <Route path="/backoffice/patients/:id" element={<RequireTherapist><PatientDetailPage /></RequireTherapist>} />
        <Route path="/backoffice/appointments" element={<AppointmentsPage />} />
        <Route path="/backoffice/attendance" element={<AttendancePage />} />
        <Route path="/backoffice/profile" element={<TherapistProfilePage />} />
        <Route path="/backoffice/admin/therapists" element={<AdminTherapistsPage />} />
        <Route path="/backoffice/admin/coordinators" element={<AdminCoordinatorsPage />} />
        <Route path="/backoffice/admin/locations" element={<AdminLocationsPage />} />
        <Route path="/backoffice/*" element={<Navigate to="/backoffice" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
