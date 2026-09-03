import type { PortraitAlign } from '../../lib/portraitAlign'
import { portraitAlignStyle, portraitLayerAlignStyle } from '../../lib/portraitAlign'
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
  const layerStyle = portraitLayerAlignStyle(align)
  const imageStyle = portraitAlignStyle(align)
  const frameClass = [
    styles.frame,
    frameClassName,
    layerStyle ? styles.frameAligned : undefined,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={frameClass}>
      {layerStyle ? (
        <div className={styles.photoLayer} style={layerStyle}>
          <img
            src={src}
            alt={alt}
            className={styles.photo}
            width={width}
            height={height}
          />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={styles.photo}
          style={imageStyle}
          width={width}
          height={height}
        />
      )}
    </div>
  )
}
