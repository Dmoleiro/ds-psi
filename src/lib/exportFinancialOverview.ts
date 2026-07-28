import { formatMonthTitle, type FinancialOverview, type FinancialRow, type FinancialSummary } from './appointments'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatEuro(value: number): string {
  return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value)
}

function formatDate(isoDate: string): string {
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString('pt-PT')
}

function csvCell(value: string | number): string {
  const text = String(value)
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}

function csvRow(values: Array<string | number>): string {
  return values.map(csvCell).join(',')
}

type TableSection = {
  title: string
  rows: FinancialRow[]
  totals: FinancialSummary
}

function buildTableRowsHtml(rows: FinancialRow[], totals: FinancialSummary): string {
  const body =
    rows.length === 0
      ? '<tr><td colspan="9">Sem registos nesta secção.</td></tr>'
      : rows
          .map(
            (row) => `
              <tr>
                <td>${escapeHtml(formatDate(row.date))}</td>
                <td>${escapeHtml(row.patientName)}</td>
                <td>${escapeHtml(row.locationName)}</td>
                <td class="money">${escapeHtml(formatEuro(row.gross))}</td>
                <td class="money">${escapeHtml(formatEuro(row.socialSecurity))}</td>
                <td class="money">${escapeHtml(formatEuro(row.irs))}</td>
                <td class="money">${escapeHtml(formatEuro(row.savings))}</td>
                <td class="money">${escapeHtml(formatEuro(row.totalReserves))}</td>
                <td class="money">${escapeHtml(formatEuro(row.available))}</td>
              </tr>
            `,
          )
          .join('')

  return `
    <tbody>${body}</tbody>
    <tfoot>
      <tr>
        <td colspan="3"><strong>Total</strong></td>
        <td class="money"><strong>${escapeHtml(formatEuro(totals.gross))}</strong></td>
        <td class="money"><strong>${escapeHtml(formatEuro(totals.socialSecurity))}</strong></td>
        <td class="money"><strong>${escapeHtml(formatEuro(totals.irs))}</strong></td>
        <td class="money"><strong>${escapeHtml(formatEuro(totals.savings))}</strong></td>
        <td class="money"><strong>${escapeHtml(formatEuro(totals.totalReserves))}</strong></td>
        <td class="money"><strong>${escapeHtml(formatEuro(totals.available))}</strong></td>
      </tr>
    </tfoot>
  `
}

function buildSectionHtml(section: TableSection): string {
  return `
    <section class="section">
      <h2>${escapeHtml(section.title)}</h2>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Paciente</th>
            <th>Local</th>
            <th>Bruto</th>
            <th>SS</th>
            <th>IRS</th>
            <th>Poupança</th>
            <th>Reservas</th>
            <th>Disponível</th>
          </tr>
        </thead>
        ${buildTableRowsHtml(section.rows, section.totals)}
      </table>
    </section>
  `
}

function buildPrintHtml(overview: FinancialOverview, therapistName: string): string {
  const generatedAt = new Date().toLocaleString('pt-PT')
  const monthTitle = formatMonthTitle(overview.year, overview.month)
  const sections: TableSection[] = [
    {
      title: 'Realizado — presenças pagas',
      rows: overview.realizedRows,
      totals: overview.summary.realized,
    },
    {
      title: 'Por receber — presenças por pagar',
      rows: overview.unpaidRows,
      totals: overview.summary.unpaid,
    },
    {
      title: 'Previsto — consultas futuras',
      rows: overview.forecastRows,
      totals: overview.summary.forecast,
    },
  ]

  return `<!DOCTYPE html>
<html lang="pt">
  <head>
    <meta charset="utf-8" />
    <title>Finanças — ${escapeHtml(monthTitle)}</title>
    <style>
      body { font-family: system-ui, sans-serif; color: #1f2a24; margin: 1.5rem; }
      h1 { margin: 0 0 0.25rem; font-size: 1.35rem; }
      .meta { margin: 0 0 1.5rem; color: #5c6b63; font-size: 0.9rem; }
      .section { margin-bottom: 2rem; page-break-inside: avoid; }
      h2 { margin: 0 0 0.75rem; font-size: 1rem; }
      table { width: 100%; border-collapse: collapse; font-size: 0.82rem; }
      th, td { border: 1px solid #d8e0da; padding: 0.4rem 0.5rem; text-align: left; vertical-align: top; }
      th { background: #f4f7f5; }
      tfoot td { background: #eef4f0; }
      .money { text-align: right; white-space: nowrap; }
      .footer { margin-top: 2rem; font-size: 0.75rem; color: #5c6b63; }
      @media print { body { margin: 0.75rem; } }
    </style>
  </head>
  <body>
    <h1>Finanças — ${escapeHtml(monthTitle)}</h1>
    <p class="meta">
      <strong>Terapeuta:</strong> ${escapeHtml(therapistName)}<br />
      <strong>Documento gerado:</strong> ${escapeHtml(generatedAt)}
    </p>
    ${sections.map(buildSectionHtml).join('')}
    <p class="footer">Daniela Santos Psicologia — resumo financeiro (planeamento)</p>
  </body>
</html>`
}

function buildCsvSection(section: TableSection): string[] {
  const lines = [section.title, csvRow(['Data', 'Paciente', 'Local', 'Bruto', 'SS', 'IRS', 'Poupança', 'Reservas', 'Disponível'])]
  for (const row of section.rows) {
    lines.push(
      csvRow([
        formatDate(row.date),
        row.patientName,
        row.locationName,
        row.gross.toFixed(2),
        row.socialSecurity.toFixed(2),
        row.irs.toFixed(2),
        row.savings.toFixed(2),
        row.totalReserves.toFixed(2),
        row.available.toFixed(2),
      ]),
    )
  }
  lines.push(
    csvRow([
      'Total',
      '',
      '',
      section.totals.gross.toFixed(2),
      section.totals.socialSecurity.toFixed(2),
      section.totals.irs.toFixed(2),
      section.totals.savings.toFixed(2),
      section.totals.totalReserves.toFixed(2),
      section.totals.available.toFixed(2),
    ]),
  )
  return lines
}

export function exportFinancialOverviewPdf(overview: FinancialOverview, therapistName: string): void {
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
  printDocument.write(buildPrintHtml(overview, therapistName))
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

export function exportFinancialOverviewCsv(overview: FinancialOverview): void {
  const monthTitle = formatMonthTitle(overview.year, overview.month)
  const sections: TableSection[] = [
    {
      title: 'Realizado — presenças pagas',
      rows: overview.realizedRows,
      totals: overview.summary.realized,
    },
    {
      title: 'Por receber — presenças por pagar',
      rows: overview.unpaidRows,
      totals: overview.summary.unpaid,
    },
    {
      title: 'Previsto — consultas futuras',
      rows: overview.forecastRows,
      totals: overview.summary.forecast,
    },
  ]

  const lines = [`Finanças — ${monthTitle}`, '']
  for (const section of sections) {
    lines.push(...buildCsvSection(section), '')
  }

  const blob = new Blob([`\uFEFF${lines.join('\n')}`], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `financas-${overview.year}-${String(overview.month).padStart(2, '0')}.csv`
  anchor.click()
  URL.revokeObjectURL(url)
}
