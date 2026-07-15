import nodemailer from 'nodemailer'
import type SMTPTransport from 'nodemailer/lib/smtp-transport/index.js'
import type { FormattedField } from './formPresentation.js'

type MailConfig = {
  host: string
  port: number
  secure: boolean
  user: string
  pass: string
  from: string
}

function getMailConfig(): MailConfig | null {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!host || !user || !pass) return null

  const port = Number(process.env.SMTP_PORT ?? 587)
  const secure =
    process.env.SMTP_SECURE === 'true' || process.env.SMTP_SECURE === '1' || port === 465

  return {
    host,
    port,
    secure,
    user,
    pass,
    from: process.env.SMTP_FROM ?? user,
  }
}

function createMailTransporter(config: MailConfig) {
  const options: SMTPTransport.Options = {
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 20_000,
  }

  // Namecheap / cPanel: port 587 uses STARTTLS (secure=false)
  if (!config.secure && config.port === 587) {
    options.requireTLS = true
  }

  return nodemailer.createTransport(options)
}

export function formatSmtpError(err: unknown): string {
  const code =
    err && typeof err === 'object' && 'code' in err ? String((err as { code: string }).code) : ''
  const response =
    err && typeof err === 'object' && 'response' in err
      ? String((err as { response: string }).response)
      : ''

  if (code === 'EAUTH') {
    return 'Autenticação SMTP falhou. Confirme SMTP_USER (email completo) e SMTP_PASS.'
  }
  if (code === 'ESOCKET' || code === 'ETIMEDOUT' || code === 'ECONNECTION') {
    return 'Não foi possível ligar ao servidor SMTP. Confirme SMTP_HOST e SMTP_PORT (465 ou 587).'
  }
  if (code === 'ECONNREFUSED') {
    return 'Ligação recusada pelo servidor SMTP. Verifique a porta (465 com SSL ou 587 com TLS).'
  }
  if (response.toLowerCase().includes('sender')) {
    return 'O remetente (SMTP_FROM) deve ser um email válido deste servidor.'
  }

  return 'Não foi possível enviar o email. Verifique a configuração SMTP no servidor.'
}

export function isMailConfigured(): boolean {
  return getMailConfig() !== null
}

type FormSubmittedEmailParams = {
  therapistEmail: string
  therapistName: string
  patientName: string
  locationName: string
  formTitle: string
  fields: FormattedField[]
  backofficeUrl: string
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

async function sendMail(config: MailConfig, message: nodemailer.SendMailOptions): Promise<void> {
  const transporter = createMailTransporter(config)
  await transporter.sendMail(message)
}

export async function sendFormSubmittedEmail(params: FormSubmittedEmailParams): Promise<void> {
  const config = getMailConfig()
  if (!config) {
    console.warn('SMTP not configured — skipping therapist notification email')
    return
  }

  const fieldsText = params.fields.map((field) => `${field.label}: ${field.value}`).join('\n')
  const fieldsHtml = params.fields
    .map(
      (field) =>
        `<tr><th style="text-align:left;padding:8px 12px 8px 0;vertical-align:top;">${escapeHtml(field.label)}</th><td style="padding:8px 0;vertical-align:top;">${nl2br(escapeHtml(field.value))}</td></tr>`,
    )
    .join('')

  const subject = `Formulário submetido — ${params.patientName}`
  const text = [
    `Olá ${params.therapistName},`,
    '',
    `O paciente ${params.patientName} submeteu o formulário «${params.formTitle}».`,
    `Local: ${params.locationName}`,
    '',
    fieldsText,
    '',
    `Ver no backoffice: ${params.backofficeUrl}`,
  ].join('\n')

  const html = `
    <p>Olá ${escapeHtml(params.therapistName)},</p>
    <p>O paciente <strong>${escapeHtml(params.patientName)}</strong> submeteu o formulário <strong>${escapeHtml(params.formTitle)}</strong>.</p>
    <p><strong>Local:</strong> ${escapeHtml(params.locationName)}</p>
    <table style="border-collapse:collapse;width:100%;max-width:640px;">${fieldsHtml}</table>
    <p style="margin-top:24px;"><a href="${escapeHtml(params.backofficeUrl)}">Abrir ficha do paciente no backoffice</a></p>
  `

  await sendMail(config, {
    from: config.from,
    to: params.therapistEmail,
    subject,
    text,
    html,
  })
}

export async function sendTestEmail(to: string, name: string): Promise<void> {
  const config = getMailConfig()
  if (!config) {
    throw new Error('SMTP_NOT_CONFIGURED')
  }

  const subject = 'Teste de email — Daniela Santos Psicologia'
  const text = [
    `Olá ${name},`,
    '',
    'Este é um email de teste enviado a partir da plataforma.',
    'Se recebeu esta mensagem, as notificações de formulários submetidos devem funcionar corretamente.',
  ].join('\n')

  const html = `
    <p>Olá ${escapeHtml(name)},</p>
    <p>Este é um email de teste enviado a partir da plataforma.</p>
    <p>Se recebeu esta mensagem, as notificações de formulários submetidos devem funcionar corretamente.</p>
  `

  await sendMail(config, {
    from: config.from,
    to,
    subject,
    text,
    html,
  })
}
