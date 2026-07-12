import type { PortraitAlign } from '../../lib/portraitAlign'
import { portraitAlignStyle } from '../../lib/portraitAlign'
import styles from './PortraitPhoto.module.css'

interface PortraitPhotoProps {
  src: string
  alt: string
  align?: PortraitAlign
  frameClassName?: string
  width?: number
  height?: number
}

export function PortraitPhoto({
  src,
  alt,
  align,
  frameClassName,
  width,
  height,
}: PortraitPhotoProps) {
  return (
    <div className={frameClassName ? `${styles.frame} ${frameClassName}` : styles.frame}>
      <img
        src={src}
        alt={alt}
        className={styles.photo}
        style={portraitAlignStyle(align)}
        width={width}
        height={height}
      />
    </div>
  )
}
