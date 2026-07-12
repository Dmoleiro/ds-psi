import type { CSSProperties } from 'react'

/**
 * Fine-tune how a portrait sits inside the circular frame.
 *
 * - scale: zoom in before cropping (use 1.1–1.3 when shifting; 1 = no zoom)
 * - x: horizontal shift in % — negative moves the image left (face moves left).
 *      Keep roughly between -40 and 40; large values push the photo out of frame.
 * - y: vertical shift in % — negative moves the image up (face moves up)
 */
export interface PortraitAlign {
  scale?: number
  x?: number
  y?: number
}

export interface PortraitImage {
  src: string
  alt: string
  align?: PortraitAlign
}

export function portraitAlignStyle(align?: PortraitAlign): CSSProperties | undefined {
  if (!align) return undefined

  const x = clamp(align.x ?? 0, -40, 40)
  const y = clamp(align.y ?? 0, -40, 40)
  const scale = align.scale ?? (x !== 0 || y !== 0 ? 1.15 : 1)

  if (scale === 1 && x === 0 && y === 0) return undefined

  return {
    transform: `scale(${scale}) translate3d(${x}%, ${y}%, 0)`,
    transformOrigin: 'center center',
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
