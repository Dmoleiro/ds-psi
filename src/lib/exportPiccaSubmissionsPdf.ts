import { piccaFullModuleLabel } from './piccaModuleIds'
import { formatPiccaModuleAnswers } from './piccaPresentation'

export type PiccaModuleSubmissionView = {
  moduleId: string
  title: string
  volume?: number
  moduleNumber?: number
  submittedAt: string
  answers: Record<string, unknown>
}

export type PiccaSessionSubmissionsView = {
  id: string
  status: string
  patient: { id: string; fullName: string }
  location: { name: string }
  modules: PiccaModuleSubmissionView[]
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function nl2br(value: string): string {
  return escapeHtml(value).replace(/\n/g, '<br>')
}

function buildPrintHtml(session: PiccaSessionSubmissionsView): string {
  const generatedAt = new Date().toLocaleString('pt-PT')
  const modulesHtml = session.modules
    .map((mod) => {
      const submittedAt = new Date(mod.submittedAt).toLocaleString('pt-PT')
      const moduleTitle = piccaFullModuleLabel(mod.moduleId, mod.title, mod.volume)
      const sections = formatPiccaModuleAnswers(mod.moduleId, mod.answers)

      const sectionsHtml = sections
        .map((section) => {
          const fieldsHtml = section.fields
            .map(
              (field) => `
            <div class="field">
              <dt>${escapeHtml(field.label)}</dt>
              <dd>${nl2br(field.value)}</dd>
            </div>
          `,
            )
            .join('')

          return `
            <div class="form-section">
              <h3>${escapeHtml(section.title)}</h3>
              <dl>${fieldsHtml}</dl>
            </div>
          `
        })
        .join('')

      return `
        <section class="module-block">
          <h2>${escapeHtml(moduleTitle)}</h2>
          <p class="meta">Submetido em ${escapeHtml(submittedAt)}</p>
          ${sectionsHtml}
        </section>
      `
    })
    .join('')

  return `<!DOCTYPE html>
<html lang="pt">
  <head>
    <meta charset="utf-8" />
    <title>PICCA — ${escapeHtml(session.patient.fullName)}</title>
    <style>
      body { font-family: "Helvetica Neue", Arial, sans-serif; color: #1a1a1a; line-height: 1.5; margin: 32px; }
      h1 { font-size: 1.5rem; margin: 0 0 8px; }
      .header-meta { color: #4a4a4a; margin: 0 0 24px; }
      .module-block { margin-bottom: 36px; page-break-inside: avoid; }
      .module-block > h2 { font-size: 1.15rem; margin: 0 0 4px; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
      .meta { color: #666; font-size: 0.9rem; margin: 0 0 16px; }
      .form-section { margin-bottom: 20px; }
      .form-section h3 { font-size: 1rem; margin: 0 0 8px; color: #333; }
      .field { margin-bottom: 10px; }
      dt { font-weight: 600; font-size: 0.85rem; }
      dd { margin: 2px 0 0; white-space: pre-wrap; }
      .footer { margin-top: 40px; font-size: 0.8rem; color: #888; }
    </style>
  </head>
  <body>
    <h1>PICCA — ${escapeHtml(session.patient.fullName)}</h1>
    <p class="header-meta">${escapeHtml(session.location.name)} · Gerado em ${escapeHtml(generatedAt)}</p>
    ${modulesHtml}
    <p class="footer">Documento gerado a partir do backoffice clínico.</p>
  </body>
</html>`
}

export function exportPiccaSubmissionsPdf(session: PiccaSessionSubmissionsView): void {
  const html = buildPrintHtml(session)
  const iframe = document.createElement('iframe')
  iframe.style.position = 'fixed'
  iframe.style.right = '0'
  iframe.style.bottom = '0'
  iframe.style.width = '0'
  iframe.style.height = '0'
  iframe.style.border = 'none'
  document.body.appendChild(iframe)

  const doc = iframe.contentDocument
  if (!doc) {
    document.body.removeChild(iframe)
    throw new Error('Não foi possível preparar a impressão')
  }

  doc.open()
  doc.write(html)
  doc.close()

  iframe.onload = () => {
    iframe.contentWindow?.focus()
    iframe.contentWindow?.print()
    window.setTimeout(() => document.body.removeChild(iframe), 1000)
  }
}
