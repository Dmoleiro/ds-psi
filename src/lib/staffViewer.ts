import type { StaffUser } from './api'

export function isStaffReadOnlyViewer(user: StaffUser | null | undefined): boolean {
  return user?.role === 'coordinator' || Boolean(user?.readOnly)
}

export function usesCoordinatorApi(user: StaffUser | null | undefined): boolean {
  return user?.role === 'coordinator'
}

export function isShadowTherapistViewer(user: StaffUser | null | undefined): boolean {
  return user?.role === 'therapist' && Boolean(user?.readOnly)
}

export function needsTherapistPicker(user: StaffUser | null | undefined): boolean {
  return usesCoordinatorApi(user) || isShadowTherapistViewer(user)
}
