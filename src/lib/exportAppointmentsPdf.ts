import {
  formatAppointmentRange,
  formatDayLabel,
  formatMonthTitle,
  type AppointmentSummary,
} from './appointments'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function nl2br(value: string): string {
  return value.replace(/\n/g, '<br>')
}

function buildPrintHtml(
  year: number,
  month: number,
  therapistName: string,
  appointments: AppointmentSummary[],
  locationLabel: string,
): string {
  const generatedAt = new Date().toLocaleString('pt-PT')
  const byDate = new Map<string, AppointmentSummary[]>()

  for (const appointment of appointments) {
    const list = byDate.get(appointment.date) ?? []
    list.push(appointment)
    byDate.set(appointment.date, list)
  }

  const sortedDates = [...byDate.keys()].sort()
  const daysHtml =
    sortedDates.length === 0
      ? '<p class="empty">Sem consultas agendadas neste mês.</p>'
      : sortedDates
          .map((date) => {
            const dayAppointments = (byDate.get(date) ?? []).sort((a, b) => a.time.localeCompare(b.time))
            const rows = dayAppointments
              .map(
                (appointment) => `
                  <tr>
                    <td>${escapeHtml(appointment.time)}</td>
                    <td>${escapeHtml(formatAppointmentRange(appointment.time, appointment.durationMinutes))}</td>
                    <td>${escapeHtml(appointment.patientName)}</td>
                    <td>${escapeHtml(appointment.locationName)}</td>
                    <td>${appointment.notes ? nl2br(escapeHtml(appointment.notes)) : '—'}</td>
                  </tr>
                `,
              )
              .join('')

            return `
              <section class="day-block">
                <h2>${escapeHtml(formatDayLabel(date))}</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Hora</th>
                      <th>Duração</th>
                      <th>Paciente</th>
                      <th>Local</th>
                      <th>Notas</th>
                    </tr>
                  </thead>
                  <tbody>${rows}</tbody>
                </table>
              </section>
            `
          })
          .join('')

  return `<!DOCTYPE html>
<html lang="pt">
  <head>
    <meta charset="utf-8" />
    <title>Consultas — ${escapeHtml(formatMonthTitle(year, month))}</title>
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
      .day-block {
        break-inside: avoid;
        margin-bottom: 28px;
      }
      .day-block h2 {
        font-size: 1.05rem;
        margin: 0 0 10px;
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
      .empty {
        color: #6b6b6b;
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
    <h1>Consultas — ${escapeHtml(formatMonthTitle(year, month))}</h1>
    <p class="header-meta">
      <strong>Terapeuta:</strong> ${escapeHtml(therapistName)}<br />
      <strong>Local:</strong> ${escapeHtml(locationLabel)}<br />
      <strong>Documento gerado:</strong> ${escapeHtml(generatedAt)}
    </p>
    ${daysHtml}
    <p class="footer">Daniela Santos Psicologia — agenda de consultas</p>
  </body>
</html>`
}

export function exportAppointmentsPdf(
  year: number,
  month: number,
  therapistName: string,
  appointments: AppointmentSummary[],
  locationLabel = 'Todos os locais',
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
  printDocument.write(buildPrintHtml(year, month, therapistName, appointments, locationLabel))
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
