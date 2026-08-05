import {
  formatAppointmentRange,
  formatDayLabel,
  formatMonthTitle,
  getCalendarCells,
  groupAppointmentsByDate,
  WEEKDAY_LABELS,
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

function buildHeaderMeta(
  year: number,
  month: number,
  therapistName: string,
  locationLabel: string,
  subtitle: string,
): string {
  const generatedAt = new Date().toLocaleString('pt-PT')
  return `
    <h1>Consultas — ${escapeHtml(formatMonthTitle(year, month))}</h1>
    <p class="header-meta">
      <strong>Vista:</strong> ${escapeHtml(subtitle)}<br />
      <strong>Terapeuta:</strong> ${escapeHtml(therapistName)}<br />
      <strong>Local:</strong> ${escapeHtml(locationLabel)}<br />
      <strong>Documento gerado:</strong> ${escapeHtml(generatedAt)}
    </p>
  `
}

function buildListPrintHtml(
  year: number,
  month: number,
  therapistName: string,
  appointments: AppointmentSummary[],
  locationLabel: string,
): string {
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
                    <td>${escapeHtml(appointment.gabineteName)}</td>
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
                      <th>Gabinete</th>
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
    <title>Consultas (lista) — ${escapeHtml(formatMonthTitle(year, month))}</title>
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
    ${buildHeaderMeta(year, month, therapistName, locationLabel, 'Lista')}
    ${daysHtml}
    <p class="footer">Daniela Santos Psicologia — agenda de consultas</p>
  </body>
</html>`
}

function buildCalendarPrintHtml(
  year: number,
  month: number,
  therapistName: string,
  appointments: AppointmentSummary[],
  locationLabel: string,
): string {
  const cells = getCalendarCells(year, month)
  const appointmentsByDate = groupAppointmentsByDate(appointments)
  const weeks: ReturnType<typeof getCalendarCells>[] = []

  for (let index = 0; index < cells.length; index += 7) {
    weeks.push(cells.slice(index, index + 7))
  }

  const weekdaysHtml = WEEKDAY_LABELS.map(
    (label) => `<th scope="col">${escapeHtml(label)}</th>`,
  ).join('')

  const weeksHtml = weeks
    .map((week) => {
      const daysHtml = week
        .map((cell) => {
          if (!cell.inMonth || !cell.date) {
            return '<td class="day-cell day-cell-outside"></td>'
          }

          const dayAppointments = appointmentsByDate.get(cell.date) ?? []
          const chipsHtml =
            dayAppointments.length === 0
              ? ''
              : dayAppointments
                  .map(
                    (appointment) => `
                      <div class="appointment-chip">
                        <span class="appointment-time">${escapeHtml(appointment.time)} ${escapeHtml(appointment.patientName)}</span>
                        <span class="appointment-meta">${escapeHtml(appointment.gabineteName)} · ${escapeHtml(appointment.locationName)}</span>
                      </div>
                    `,
                  )
                  .join('')

          return `
            <td class="day-cell">
              <div class="day-number">${cell.day}</div>
              <div class="appointment-list">${chipsHtml}</div>
            </td>
          `
        })
        .join('')

      return `<tr class="week-row">${daysHtml}</tr>`
    })
    .join('')

  return `<!DOCTYPE html>
<html lang="pt">
  <head>
    <meta charset="utf-8" />
    <title>Consultas (calendário) — ${escapeHtml(formatMonthTitle(year, month))}</title>
    <style>
      @page {
        size: A4 landscape;
        margin: 10mm;
      }
      * {
        box-sizing: border-box;
      }
      body {
        font-family: "Helvetica Neue", Arial, sans-serif;
        color: #1a1a1a;
        line-height: 1.35;
        margin: 0;
        padding: 0;
      }
      h1 {
        font-size: 1.25rem;
        margin: 0 0 6px;
      }
      .header-meta {
        color: #4a4a4a;
        margin: 0 0 12px;
        font-size: 0.8125rem;
      }
      .calendar {
        width: 100%;
        border: 1px solid #d8d0c8;
        border-collapse: collapse;
        table-layout: fixed;
      }
      .weekday-row th {
        background: #e8f1ec;
        border: 1px solid #d8d0c8;
        padding: 6px 4px;
        text-align: center;
        font-size: 0.6875rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        color: #4a4a4a;
      }
      .week-row td {
        border: 1px solid #d8d0c8;
        vertical-align: top;
        width: 14.285%;
        height: 22mm;
        padding: 3px;
      }
      .day-cell-outside {
        background: #faf8f5;
      }
      .day-cell {
        overflow: hidden;
      }
      .day-number {
        font-size: 0.75rem;
        font-weight: 700;
        margin-bottom: 2px;
        color: #1a1a1a;
      }
      .appointment-list {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .appointment-chip {
        background: #e8f4ec;
        border-left: 2px solid #2f6b4f;
        border-radius: 2px;
        padding: 1px 3px;
        overflow: hidden;
      }
      .appointment-time {
        display: block;
        font-size: 6.5pt;
        font-weight: 600;
        color: #1f4d38;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .appointment-meta {
        display: block;
        font-size: 6pt;
        color: #6b6b6b;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .footer {
        margin-top: 10px;
        font-size: 0.75rem;
        color: #6b6b6b;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    </style>
  </head>
  <body>
    ${buildHeaderMeta(year, month, therapistName, locationLabel, 'Calendário')}
    <table class="calendar" aria-label="Calendário mensal">
      <thead>
        <tr class="weekday-row">
          ${weekdaysHtml}
        </tr>
      </thead>
      <tbody>
        ${weeksHtml}
      </tbody>
    </table>
    <p class="footer">Daniela Santos Psicologia — agenda de consultas</p>
  </body>
</html>`
}

function openPrintDocument(html: string): void {
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

export function exportAppointmentsListPdf(
  year: number,
  month: number,
  therapistName: string,
  appointments: AppointmentSummary[],
  locationLabel = 'Todos os locais',
): void {
  openPrintDocument(buildListPrintHtml(year, month, therapistName, appointments, locationLabel))
}

export function exportAppointmentsCalendarPdf(
  year: number,
  month: number,
  therapistName: string,
  appointments: AppointmentSummary[],
  locationLabel = 'Todos os locais',
): void {
  openPrintDocument(buildCalendarPrintHtml(year, month, therapistName, appointments, locationLabel))
}

/** @deprecated Use exportAppointmentsListPdf */
export const exportAppointmentsPdf = exportAppointmentsListPdf
