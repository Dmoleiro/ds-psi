import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { SiteLayout } from './components/layout/SiteLayout'
import { RequirePatientViewer, RequireTherapist } from './components/backoffice/BackofficeLayout'
import { CookiesPolicyPage } from './pages/CookiesPolicyPage'
import { FormulariosPiccaPage } from './pages/FormulariosPiccaPage'
import { WorkshopsPublicPage } from './pages/WorkshopsPublicPage'
import { WorkshopsPastPage } from './pages/WorkshopsPastPage'
import { HomePage } from './pages/HomePage'
import { AdminCoordinatorsPage } from './pages/backoffice/AdminCoordinatorsPage'
import { AdminAnnouncementsPage } from './pages/backoffice/AdminAnnouncementsPage'
import { AdminGabinetesPage } from './pages/backoffice/AdminGabinetesPage'
import { AdminLocationsPage } from './pages/backoffice/AdminLocationsPage'
import { AdminTherapistsPage } from './pages/backoffice/AdminTherapistsPage'
import { AppointmentsPage } from './pages/backoffice/AppointmentsPage'
import { AttendancePage } from './pages/backoffice/AttendancePage'
import { BackofficeDashboardPage } from './pages/backoffice/BackofficeDashboardPage'
import { FinancialOverviewPage } from './pages/backoffice/FinancialOverviewPage'
import { FormPreviewPage } from './pages/backoffice/FormPreviewPage'
import { PiccaLibraryPage } from './pages/backoffice/PiccaLibraryPage'
import {
  PiccaInteractivePreviewPage,
  PiccaModulePreviewPage,
} from './pages/backoffice/PiccaPreviewPage'
import { BackofficeLoginPage } from './pages/backoffice/BackofficeLoginPage'
import { PatientCreatePage } from './pages/backoffice/PatientCreatePage'
import { PatientDetailPage } from './pages/backoffice/PatientDetailPage'
import { PatientsListPage } from './pages/backoffice/PatientsListPage'
import { TherapistProfilePage } from './pages/backoffice/TherapistProfilePage'
import { WorkshopsPage } from './pages/backoffice/WorkshopsPage'
import { PatientCompletePage } from './pages/patient/PatientCompletePage'
import { PatientFormPage } from './pages/patient/PatientFormPage'
import { PatientPortalPage } from './pages/patient/PatientPortalPage'
import { PiccaPortalPage } from './pages/patient/PiccaPortalPage'
import { PiccaModulePage } from './pages/patient/PiccaModulePage'
import { PiccaInteractivePortalPage } from './pages/patient/PiccaInteractivePortalPage'
import { PiccaInteractiveFormPage } from './pages/patient/PiccaInteractiveFormPage'
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
        <Route
          path="/workshops"
          element={
            <SiteLayout>
              <WorkshopsPublicPage />
            </SiteLayout>
          }
        />
        <Route
          path="/workshops/passados"
          element={
            <SiteLayout>
              <WorkshopsPastPage />
            </SiteLayout>
          }
        />
        <Route path="/formularios/p/:token" element={<PatientPortalPage />} />
        <Route path="/formularios/p/:token/concluido" element={<PatientCompletePage />} />
        <Route path="/formularios/p/:token/:formId" element={<PatientFormPage />} />
        <Route path="/formularios/picca/:token" element={<PiccaPortalPage />} />
        <Route path="/formularios/picca/:token/:moduleId" element={<PiccaModulePage />} />
        <Route path="/formularios/picca-interativo/:token" element={<PiccaInteractivePortalPage />} />
        <Route
          path="/formularios/picca-interativo/:token/:formId"
          element={<PiccaInteractiveFormPage />}
        />
        <Route path="/backoffice/login" element={<BackofficeLoginPage />} />
        <Route path="/backoffice" element={<BackofficeDashboardPage />} />
        <Route path="/backoffice/patients" element={<RequirePatientViewer><PatientsListPage /></RequirePatientViewer>} />
        <Route path="/backoffice/patients/new" element={<RequireTherapist><PatientCreatePage /></RequireTherapist>} />
        <Route path="/backoffice/patients/:id" element={<RequirePatientViewer><PatientDetailPage /></RequirePatientViewer>} />
        <Route path="/backoffice/appointments" element={<AppointmentsPage />} />
        <Route path="/backoffice/attendance" element={<AttendancePage />} />
        <Route path="/backoffice/financial" element={<RequireTherapist><FinancialOverviewPage /></RequireTherapist>} />
        <Route path="/backoffice/picca" element={<RequireTherapist><PiccaLibraryPage /></RequireTherapist>} />
        <Route
          path="/backoffice/picca/preview/module/:moduleId"
          element={<RequireTherapist><PiccaModulePreviewPage /></RequireTherapist>}
        />
        <Route
          path="/backoffice/picca/preview/interactive/:formId"
          element={<RequireTherapist><PiccaInteractivePreviewPage /></RequireTherapist>}
        />
        <Route path="/backoffice/forms/preview/:formId" element={<RequireTherapist><FormPreviewPage /></RequireTherapist>} />
        <Route path="/backoffice/profile" element={<TherapistProfilePage />} />
        <Route path="/backoffice/workshops" element={<WorkshopsPage />} />
        <Route path="/backoffice/admin/therapists" element={<AdminTherapistsPage />} />
        <Route path="/backoffice/admin/coordinators" element={<AdminCoordinatorsPage />} />
        <Route path="/backoffice/admin/locations" element={<AdminLocationsPage />} />
        <Route path="/backoffice/admin/gabinetes" element={<AdminGabinetesPage />} />
        <Route path="/backoffice/admin/announcements" element={<AdminAnnouncementsPage />} />
        <Route path="/backoffice/*" element={<Navigate to="/backoffice" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
