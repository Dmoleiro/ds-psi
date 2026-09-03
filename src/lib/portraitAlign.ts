import type { CSSProperties } from 'react'

/**
 * Fine-tune how a portrait sits inside the circular frame.
 *
 * - scale: zoom in before cropping (use 1.1–1.3 when shifting; 1 = no zoom)
 * - x: horizontal shift in % — negative moves the image left (face moves left).
 *      Keep roughly between -40 and 40; large values push the photo out of frame.
 * - y: vertical shift in % — negative moves the image up (face moves up)
 * - layer: use oversized inner layer (for photos where translate would expose the frame)
 */
export interface PortraitLayerFrame {
  width: string
  height: string
  transform: string
}

export interface PortraitAlign {
  scale?: number
  x?: number
  y?: number
  layer?: boolean
  /** Manual layer sizing/positioning for one-off portraits. */
  layerFrame?: PortraitLayerFrame
}

export interface PortraitImage {
  src: string
  alt: string
  align?: PortraitAlign
}

function readAlign(align: PortraitAlign) {
  const x = clamp(align.x ?? 0, -40, 40)
  const y = clamp(align.y ?? 0, -40, 40)
  const scale = align.scale ?? (x !== 0 || y !== 0 ? 1.15 : 1)
  return { x, y, scale }
}

export function portraitAlignStyle(align?: PortraitAlign): CSSProperties | undefined {
  if (!align || align.layer) return undefined

  const { x, y, scale } = readAlign(align)
  if (scale === 1 && x === 0 && y === 0) return undefined

  return {
    transform: `scale(${scale}) translate3d(${x}%, ${y}%, 0)`,
    transformOrigin: 'center center',
  }
}

export function portraitLayerAlignStyle(align?: PortraitAlign): CSSProperties | undefined {
  if (!align?.layer) return undefined

  if (align.layerFrame) {
    return {
      position: 'absolute',
      left: '50%',
      top: '50%',
      width: align.layerFrame.width,
      height: align.layerFrame.height,
      transform: align.layerFrame.transform,
    }
  }

  const { x, y, scale } = readAlign(align)
  if (scale === 1 && x === 0 && y === 0) return undefined

  const bleed = 1.2 + (Math.abs(x) + Math.abs(y)) / 100
  const sizePercent = Math.round(scale * bleed * 10000) / 100

  return {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: `${sizePercent}%`,
    height: `${sizePercent}%`,
    transform: `translate(calc(-50% + ${x}%), calc(-50% + ${y}%))`,
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
