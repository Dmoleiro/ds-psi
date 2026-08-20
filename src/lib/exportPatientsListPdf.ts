import type { PatientSummary } from './api'
import { formatPatientSessionFee } from './dashboard'
import { formatSessionStatus } from './intakeStatus'

export type PatientListExportContext = {
  therapistName?: string | null
  search?: string
  locationName?: string | null
}

export type PatientListExportColumnId =
  | 'fullName'
  | 'location'
  | 'sessionFee'
  | 'contact'
  | 'latestForms'
  | 'email'
  | 'email2'
  | 'phone'
  | 'phone2'
  | 'birthDate'
  | 'status'
  | 'createdAt'
  | 'therapist'

export type PatientListExportColumnDefinition = {
  id: PatientListExportColumnId
  label: string
  defaultSelected: boolean
  align?: 'right'
}

export const PATIENT_LIST_EXPORT_COLUMNS: PatientListExportColumnDefinition[] = [
  { id: 'fullName', label: 'Nome', defaultSelected: true },
  { id: 'location', label: 'Local', defaultSelected: true },
  { id: 'sessionFee', label: 'Consulta', defaultSelected: true, align: 'right' },
  { id: 'contact', label: 'Contacto', defaultSelected: true },
  { id: 'latestForms', label: 'Últimos formulários', defaultSelected: true },
  { id: 'email', label: 'Email', defaultSelected: false },
  { id: 'email2', label: 'Email (2.º)', defaultSelected: false },
  { id: 'phone', label: 'Telefone', defaultSelected: false },
  { id: 'phone2', label: 'Telefone (2.º)', defaultSelected: false },
  { id: 'birthDate', label: 'Data de nascimento', defaultSelected: false },
  { id: 'status', label: 'Estado', defaultSelected: false },
  { id: 'createdAt', label: 'Data de registo', defaultSelected: false },
  { id: 'therapist', label: 'Terapeuta', defaultSelected: false },
]

export function defaultPatientListExportColumnIds(): PatientListExportColumnId[] {
  return PATIENT_LIST_EXPORT_COLUMNS.filter((column) => column.defaultSelected).map((column) => column.id)
}

export function resolvePatientListExportColumns(
  selectedColumnIds: PatientListExportColumnId[],
): PatientListExportColumnDefinition[] {
  const selected = new Set(selectedColumnIds)
  return PATIENT_LIST_EXPORT_COLUMNS.filter((column) => selected.has(column.id))
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatOptionalText(value: string | null | undefined): string {
  return value?.trim() ? value.trim() : '—'
}

function formatPatientContact(patient: PatientSummary): string {
  const contact = [patient.email, patient.email2, patient.phone, patient.phone2].filter(Boolean)
  return contact.length > 0 ? contact.join(' · ') : '—'
}

function formatLatestForms(patient: PatientSummary): string {
  const latest = patient.intakeSessions?.[0]
  if (!latest) return '—'
  const date = new Date(latest.createdAt).toLocaleDateString('pt-PT')
  return `${formatSessionStatus(latest.status)} · ${date}`
}

function formatBirthDate(value: string | null): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('pt-PT')
}

function formatCreatedAt(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('pt-PT')
}

function getPatientExportCellValue(columnId: PatientListExportColumnId, patient: PatientSummary): string {
  switch (columnId) {
    case 'fullName':
      return patient.fullName
    case 'location':
      return patient.location?.name ?? '—'
    case 'sessionFee':
      return formatPatientSessionFee(patient.sessionFee)
    case 'contact':
      return formatPatientContact(patient)
    case 'latestForms':
      return formatLatestForms(patient)
    case 'email':
      return formatOptionalText(patient.email)
    case 'email2':
      return formatOptionalText(patient.email2)
    case 'phone':
      return formatOptionalText(patient.phone)
    case 'phone2':
      return formatOptionalText(patient.phone2)
    case 'birthDate':
      return formatBirthDate(patient.birthDate)
    case 'status':
      return patient.active === false ? 'Inactivo' : 'Activo'
    case 'createdAt':
      return formatCreatedAt(patient.createdAt)
    case 'therapist':
      return patient.therapist?.name ?? '—'
    default:
      return '—'
  }
}

function buildFilterSummary(context: PatientListExportContext): string {
  const lines: string[] = []

  if (context.therapistName) {
    lines.push(`<strong>Terapeuta:</strong> ${escapeHtml(context.therapistName)}`)
  }

  const search = context.search?.trim()
  if (search) {
    lines.push(`<strong>Pesquisa:</strong> ${escapeHtml(search)}`)
  }

  if (context.locationName) {
    lines.push(`<strong>Local:</strong> ${escapeHtml(context.locationName)}`)
  }

  return lines.join('<br />')
}

export function buildPatientsListPrintHtml(
  patients: PatientSummary[],
  context: PatientListExportContext,
  columns: PatientListExportColumnDefinition[],
): string {
  if (columns.length === 0) {
    throw new Error('Seleccione pelo menos uma coluna para exportar.')
  }

  const generatedAt = new Date().toLocaleString('pt-PT')
  const filterSummary = buildFilterSummary(context)
  const columnCount = columns.length

  const headerCells = columns
    .map((column) => {
      const className = column.align === 'right' ? ' class="money"' : ''
      return `<th${className}>${escapeHtml(column.label)}</th>`
    })
    .join('')

  const tableRows =
    patients.length === 0
      ? `<tr><td colspan="${columnCount}">Nenhum paciente corresponde aos filtros.</td></tr>`
      : patients
          .map((patient) => {
            const cells = columns
              .map((column) => {
                const className = column.align === 'right' ? ' class="money"' : ''
                return `<td${className}>${escapeHtml(getPatientExportCellValue(column.id, patient))}</td>`
              })
              .join('')
            return `<tr>${cells}</tr>`
          })
          .join('')

  return `<!DOCTYPE html>
<html lang="pt">
  <head>
    <meta charset="utf-8" />
    <title>Lista de pacientes</title>
    <style>
      body {
        font-family: "Helvetica Neue", Arial, sans-serif;
        color: #1a1a1a;
        line-height: 1.5;
        margin: 32px;
      }
      h1 {
        font-size: 1.5rem;
        margin: 0 0 8px;
      }
      .header-meta {
        color: #4a4a4a;
        margin: 0 0 24px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.9rem;
      }
      th, td {
        border-bottom: 1px solid #e8ddd2;
        padding: 8px 10px;
        text-align: left;
        vertical-align: top;
      }
      th {
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: #6b6b6b;
      }
      td.money, th.money {
        text-align: right;
        white-space: nowrap;
      }
      tfoot td {
        font-weight: 600;
        border-top: 2px solid #d4c4b5;
      }
      .footer {
        margin-top: 32px;
        font-size: 0.8125rem;
        color: #6b6b6b;
      }
      @media print {
        body { margin: 18mm; }
      }
    </style>
  </head>
  <body>
    <h1>Lista de pacientes</h1>
    <p class="header-meta">
      ${filterSummary ? `${filterSummary}<br />` : ''}
      <strong>Documento gerado:</strong> ${escapeHtml(generatedAt)}
    </p>
    <table>
      <thead>
        <tr>${headerCells}</tr>
      </thead>
      <tbody>${tableRows}</tbody>
      ${
        patients.length > 0
          ? `<tfoot>
        <tr>
          <td colspan="${columnCount}">Total: ${patients.length} paciente${patients.length === 1 ? '' : 's'}</td>
        </tr>
      </tfoot>`
          : ''
      }
    </table>
    <p class="footer">Daniela Santos Psicologia — lista de pacientes</p>
  </body>
</html>`
}

export function exportPatientsListPdf(
  patients: PatientSummary[],
  context: PatientListExportContext = {},
  selectedColumnIds: PatientListExportColumnId[] = defaultPatientListExportColumnIds(),
): void {
  if (patients.length === 0) {
    throw new Error('Não existem pacientes para exportar.')
  }

  const columns = resolvePatientListExportColumns(selectedColumnIds)
  const html = buildPatientsListPrintHtml(patients, context, columns)

  const iframe = document.createElement('iframe')
  iframe.setAttribute('title', 'Pré-visualização de impressão')
  iframe.setAttribute('aria-hidden', 'true')
  Object.assign(iframe.style, {
    position: 'fixed',
    right: '0',
    bottom: '0',
    width: '0',
    height: '0',
    border: '0',
    opacity: '0',
    pointerEvents: 'none',
  })

  document.body.appendChild(iframe)

  const printWindow = iframe.contentWindow
  const printDocument = iframe.contentDocument ?? printWindow?.document

  if (!printWindow || !printDocument) {
    iframe.remove()
    throw new Error('Não foi possível preparar a impressão neste browser.')
  }

  printDocument.open()
  printDocument.write(html)
  printDocument.close()

  const cleanup = () => {
    iframe.remove()
  }

  const runPrint = () => {
    printWindow.focus()
    printWindow.print()
    printWindow.addEventListener('afterprint', cleanup, { once: true })
    window.setTimeout(cleanup, 60_000)
  }

  if (printDocument.readyState === 'complete') {
    window.setTimeout(runPrint, 150)
  } else {
    iframe.addEventListener('load', () => window.setTimeout(runPrint, 150), { once: true })
  }
}
