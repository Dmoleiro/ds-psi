export type FormSubmissionField = {
  key: string
  label: string
  value: string
}

export type FormSubmissionView = {
  formId: string
  title: string
  submittedAt: string
  fields: FormSubmissionField[]
}

export type SessionSubmissionsView = {
  id: string
  status: string
  patient: { id: string; fullName: string }
  location: { name: string }
  submissions: FormSubmissionView[]
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

function buildPrintHtml(session: SessionSubmissionsView): string {
  const generatedAt = new Date().toLocaleString('pt-PT')
  const formsHtml = session.submissions
    .map((submission) => {
      const submittedAt = new Date(submission.submittedAt).toLocaleString('pt-PT')
      const fieldsHtml = submission.fields
        .map(
          (field) => `
            <div class="field">
              <dt>${escapeHtml(field.label)}</dt>
              <dd>${nl2br(escapeHtml(field.value))}</dd>
            </div>
          `,
        )
        .join('')

      return `
        <section class="form-block">
          <h2>${escapeHtml(submission.title)}</h2>
          <p class="meta">Submetido em ${escapeHtml(submittedAt)}</p>
          <dl>${fieldsHtml}</dl>
        </section>
      `
    })
    .join('')

  return `<!DOCTYPE html>
<html lang="pt">
  <head>
    <meta charset="utf-8" />
    <title>Formulários — ${escapeHtml(session.patient.fullName)}</title>
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
      .form-block {
        break-inside: avoid;
        margin-bottom: 28px;
        padding-bottom: 20px;
        border-bottom: 1px solid #e8ddd2;
      }
      .form-block h2 {
        font-size: 1.125rem;
        margin: 0 0 4px;
      }
      .meta {
        color: #6b6b6b;
        font-size: 0.875rem;
        margin: 0 0 16px;
      }
      dl {
        margin: 0;
      }
      .field {
        margin-bottom: 12px;
      }
      dt {
        font-weight: 700;
        margin: 0 0 4px;
      }
      dd {
        margin: 0;
        white-space: pre-wrap;
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
    <h1>${escapeHtml(session.patient.fullName)}</h1>
    <p class="header-meta">
      <strong>Local:</strong> ${escapeHtml(session.location.name)}<br />
      <strong>Documento gerado:</strong> ${escapeHtml(generatedAt)}
    </p>
    ${formsHtml}
    <p class="footer">Daniela Santos Psicologia — formulários PICCA</p>
  </body>
</html>`
}

export function exportSessionSubmissionsPdf(session: SessionSubmissionsView): void {
  if (session.submissions.length === 0) {
    throw new Error('Não existem formulários submetidos para exportar.')
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
  printDocument.write(buildPrintHtml(session))
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
