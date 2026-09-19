import type { GalleryPhoto } from './Viewer';

/** Native responsive layers: keep the index-sized image beneath the display image. */
export function PhotoLayers({ photo, thumbnailSizes, sizes, onImageRef, decorative = false, contain = false }: {
  photo: GalleryPhoto;
  thumbnailSizes: string;
  sizes: string;
  onImageRef?: (image: HTMLImageElement | null) => void;
  decorative?: boolean;
  contain?: boolean;
}) {
  return <>
    <picture className="contents"><img
      src={photo.thumbnail} srcSet={photo.srcSet} sizes={thumbnailSizes}
      width={photo.width} height={photo.height} alt="" aria-hidden="true"
      decoding="async" draggable={false}
      style={{ opacity: decorative ? 0.5 : 1 }}
      className={`absolute inset-0 h-full w-full ${contain ? 'object-contain' : 'object-cover'}`}
    /></picture>
    <picture className="contents"><img
      ref={onImageRef} src={photo.src} srcSet={photo.srcSet} sizes={sizes}
      width={photo.width} height={photo.height} alt={decorative ? '' : photo.alt}
      aria-hidden={decorative || undefined} decoding="async" draggable={false}
      style={{ opacity: decorative ? 0.5 : 1 }}
      className={`absolute inset-0 h-full w-full ${contain ? 'object-contain' : 'object-cover'}`}
    /></picture>
  </>;
}
