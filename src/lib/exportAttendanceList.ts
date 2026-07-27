import { formatDayLabel } from './appointments'
import type { AttendanceStatus } from './api'
import { STATUS_LABELS } from './attendance'

export type AttendanceExportRow = {
  patientName: string
  date: string
  status: AttendanceStatus
  sessionFee: number
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value)
}

function formatMonthTitle(year: number, month: number): string {
  return new Date(year, month - 1, 1).toLocaleDateString('pt-PT', {
    month: 'long',
    year: 'numeric',
  })
}

function buildPrintHtml(
  year: number,
  month: number,
  therapistName: string,
  locationName: string,
  rows: AttendanceExportRow[],
): string {
  const generatedAt = new Date().toLocaleString('pt-PT')
  const sortedRows = [...rows].sort((a, b) => {
    const byDate = a.date.localeCompare(b.date)
    if (byDate !== 0) return byDate
    return a.patientName.localeCompare(b.patientName, 'pt')
  })

  const total = sortedRows.reduce((sum, row) => sum + row.sessionFee, 0)

  const tableRows =
    sortedRows.length === 0
      ? '<tr><td colspan="4">Sem registos de presença neste mês.</td></tr>'
      : sortedRows
          .map(
            (row) => `
              <tr>
                <td>${escapeHtml(formatDayLabel(row.date))}</td>
                <td>${escapeHtml(row.patientName)}</td>
                <td>${escapeHtml(STATUS_LABELS[row.status])}</td>
                <td class="money">${escapeHtml(formatMoney(row.sessionFee))}</td>
              </tr>
            `,
          )
          .join('')

  return `<!DOCTYPE html>
<html lang="pt">
  <head>
    <meta charset="utf-8" />
    <title>Presenças — ${escapeHtml(formatMonthTitle(year, month))}</title>
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
    <h1>Presenças — ${escapeHtml(formatMonthTitle(year, month))}</h1>
    <p class="header-meta">
      <strong>Terapeuta:</strong> ${escapeHtml(therapistName)}<br />
      <strong>Local:</strong> ${escapeHtml(locationName)}<br />
      <strong>Documento gerado:</strong> ${escapeHtml(generatedAt)}
    </p>
    <table>
      <thead>
        <tr>
          <th>Data</th>
          <th>Paciente</th>
          <th>Estado</th>
          <th class="money">Valor</th>
        </tr>
      </thead>
      <tbody>${tableRows}</tbody>
      ${
        sortedRows.length > 0
          ? `<tfoot>
        <tr>
          <td colspan="3">Total (${sortedRows.length} registos)</td>
          <td class="money">${escapeHtml(formatMoney(total))}</td>
        </tr>
      </tfoot>`
          : ''
      }
    </table>
    <p class="footer">Daniela Santos Psicologia — lista de presenças</p>
  </body>
</html>`
}

export function exportAttendanceList(
  year: number,
  month: number,
  therapistName: string,
  locationName: string,
  rows: AttendanceExportRow[],
): void {
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
  printDocument.write(buildPrintHtml(year, month, therapistName, locationName, rows))
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
