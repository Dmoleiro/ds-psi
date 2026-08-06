import type { PatientSummary } from './api'
import { formatPatientSessionFee } from './dashboard'
import { formatSessionStatus } from './intakeStatus'

export type PatientListExportContext = {
  therapistName?: string | null
  search?: string
  locationName?: string | null
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
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

function buildPrintHtml(patients: PatientSummary[], context: PatientListExportContext): string {
  const generatedAt = new Date().toLocaleString('pt-PT')
  const filterSummary = buildFilterSummary(context)

  const tableRows =
    patients.length === 0
      ? '<tr><td colspan="5">Nenhum paciente corresponde aos filtros.</td></tr>'
      : patients
          .map(
            (patient) => `
              <tr>
                <td>${escapeHtml(patient.fullName)}</td>
                <td>${escapeHtml(patient.location?.name ?? '—')}</td>
                <td class="money">${escapeHtml(formatPatientSessionFee(patient.sessionFee))}</td>
                <td>${escapeHtml(formatPatientContact(patient))}</td>
                <td>${escapeHtml(formatLatestForms(patient))}</td>
              </tr>
            `,
          )
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
        <tr>
          <th>Nome</th>
          <th>Local</th>
          <th class="money">Consulta</th>
          <th>Contacto</th>
          <th>Últimos formulários</th>
        </tr>
      </thead>
      <tbody>${tableRows}</tbody>
      ${
        patients.length > 0
          ? `<tfoot>
        <tr>
          <td colspan="5">Total: ${patients.length} paciente${patients.length === 1 ? '' : 's'}</td>
        </tr>
      </tfoot>`
          : ''
      }
    </table>
    <p class="footer">Daniela Santos Psicologia — lista de pacientes</p>
  </body>
</html>`
}

export function exportPatientsListPdf(patients: PatientSummary[], context: PatientListExportContext = {}): void {
  if (patients.length === 0) {
    throw new Error('Não existem pacientes para exportar.')
  }

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
  printDocument.write(buildPrintHtml(patients, context))
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
