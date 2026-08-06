export type PatientAppointmentNotesExport = {
  fullName: string
  birthDate: string | null
  locationName: string | null
  therapistName: string | null
  email: string | null
  phone: string | null
  appointmentNotes: string
}

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

function formatBirthDate(value: string | null): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('pt-PT')
}

function buildPrintHtml(data: PatientAppointmentNotesExport): string {
  const generatedAt = new Date().toLocaleString('pt-PT')
  const metaRows = [
    data.birthDate ? `<strong>Data de nascimento:</strong> ${escapeHtml(formatBirthDate(data.birthDate))}` : null,
    data.locationName ? `<strong>Local:</strong> ${escapeHtml(data.locationName)}` : null,
    data.therapistName ? `<strong>Terapeuta:</strong> ${escapeHtml(data.therapistName)}` : null,
    data.email ? `<strong>Email:</strong> ${escapeHtml(data.email)}` : null,
    data.phone ? `<strong>Telefone:</strong> ${escapeHtml(data.phone)}` : null,
    `<strong>Documento gerado:</strong> ${escapeHtml(generatedAt)}`,
  ].filter(Boolean)

  return `<!DOCTYPE html>
<html lang="pt">
  <head>
    <meta charset="utf-8" />
    <title>Notas de consulta — ${escapeHtml(data.fullName)}</title>
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
      .notes {
        white-space: pre-wrap;
        border-top: 1px solid #ddd;
        padding-top: 20px;
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
    <h1>${escapeHtml(data.fullName)}</h1>
    <p class="header-meta">${metaRows.join('<br />')}</p>
    <h2>Notas de consulta</h2>
    <div class="notes">${nl2br(escapeHtml(data.appointmentNotes))}</div>
    <p class="footer">Daniela Santos Psicologia — notas de consulta</p>
  </body>
</html>`
}

export function exportPatientAppointmentNotes(data: PatientAppointmentNotesExport): void {
  if (!data.appointmentNotes.trim()) {
    throw new Error('Não existem notas para exportar.')
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
    border: 'none',
  })
  document.body.appendChild(iframe)

  const doc = iframe.contentDocument
  if (!doc) {
    document.body.removeChild(iframe)
    throw new Error('Não foi possível preparar a impressão')
  }

  doc.open()
  doc.write(buildPrintHtml(data))
  doc.close()

  iframe.onload = () => {
    iframe.contentWindow?.focus()
    iframe.contentWindow?.print()
    window.setTimeout(() => document.body.removeChild(iframe), 1000)
  }
}
