export type SessionStatus = 'active' | 'in_progress' | 'completed' | 'revoked'
export type FormStatus = 'not_started' | 'in_progress' | 'submitted'

export const SESSION_STATUS_LABELS: Record<SessionStatus, string> = {
  active: 'Ativa',
  in_progress: 'Em curso',
  completed: 'Concluída',
  revoked: 'Revogada',
}

export const FORM_STATUS_LABELS: Record<FormStatus, string> = {
  not_started: 'Por iniciar',
  in_progress: 'Em progresso',
  submitted: 'Submetido',
}

export function formatSessionStatus(status: string): string {
  return SESSION_STATUS_LABELS[status as SessionStatus] ?? status
}

export function formatFormStatus(status: string): string {
  return FORM_STATUS_LABELS[status as FormStatus] ?? status
}

export function sessionStatusBadgeVariant(status: string): 'default' | 'muted' | 'accent' {
  switch (status) {
    case 'completed':
      return 'accent'
    case 'active':
    case 'in_progress':
      return 'default'
    default:
      return 'muted'
  }
}

export function formStatusBadgeVariant(status: string): 'default' | 'muted' | 'accent' {
  switch (status) {
    case 'submitted':
      return 'accent'
    case 'in_progress':
      return 'default'
    default:
      return 'muted'
  }
}
