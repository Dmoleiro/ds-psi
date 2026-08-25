export function sanitizeDeliveredFormIds(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  const ids = new Set<string>()
  for (const item of value) {
    if (typeof item === 'string' && item.trim()) {
      ids.add(item.trim().slice(0, 64))
    }
  }
  return [...ids]
}

export function mergeDeliveredFormIds(existing: string[], formIds: string[]): string[] {
  const merged = new Set(sanitizeDeliveredFormIds(existing))
  for (const formId of sanitizeDeliveredFormIds(formIds)) {
    merged.add(formId)
  }
  return [...merged]
}

export function isFormDelivered(deliveredFormIds: string[], formId: string): boolean {
  return sanitizeDeliveredFormIds(deliveredFormIds).includes(formId)
}

export function setFormDelivered(
  deliveredFormIds: string[],
  formId: string,
  delivered: boolean,
): string[] {
  const ids = new Set(sanitizeDeliveredFormIds(deliveredFormIds))
  const normalized = formId.trim().slice(0, 64)
  if (!normalized) return [...ids]
  if (delivered) {
    ids.add(normalized)
  } else {
    ids.delete(normalized)
  }
  return [...ids]
}
