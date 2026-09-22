import { useLayoutEffect, useRef, useState } from 'react';
import type { GalleryPhoto } from './Viewer';
import { PhotoLayers } from './PhotoLayers';

export interface ZoomablePhotoProps {
  photo: GalleryPhoto;
  thumbnailSizes: string;
  transitionName: 'gallery-photo' | 'none';
  onImageRef: (image: HTMLImageElement | null) => void;
  onZoomChange?: (zoomed: boolean) => void;
  expandedViewport?: boolean;
  onNavigate: (direction: number) => void;
}

const zoomScale = 2.5;
const dragThreshold = 5;

export function ZoomablePhoto({
  photo,
  thumbnailSizes,
  transitionName,
  onImageRef,
  onZoomChange,
  expandedViewport = false,
  onNavigate,
}: ZoomablePhotoProps) {
  const root = useRef<HTMLButtonElement>(null);
  const limits = useRef({ x: 0, y: 0 });
  const gesture = useRef<{
    pointerId: number;
    x: number;
    y: number;
    panX: number;
    panY: number;
    dragged: boolean;
  } | null>(null);
  const suppressClick = useRef(false);
  const zoomAnchor = useRef<{ x: number; y: number; clientX: number; clientY: number } | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  // Navigation captures the fitted image, not an enlarged crop outside the photo frame.
  const showZoom = zoomed && transitionName === 'none';

  function clampPan(x: number, y: number) {
    return {
      x: Math.max(-limits.current.x, Math.min(limits.current.x, x)),
      y: Math.max(-limits.current.y, Math.min(limits.current.y, y)),
    };
  }

  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    const updateBounds = () => {
      // Use the contained image's visual size, not its transformed bounding box.
      const fit = Math.min(element.clientWidth / photo.width, element.clientHeight / photo.height);
      limits.current = {
        x: Math.max(0, (photo.width * fit * zoomScale - element.clientWidth) / 2),
        y: Math.max(0, (photo.height * fit * zoomScale - element.clientHeight) / 2),
      };
      const anchor = zoomAnchor.current;
      if (anchor) {
        // Preserve the clicked image point under the cursor after the viewport expands.
        const rect = element.getBoundingClientRect();
        setPan(clampPan(
          anchor.clientX - rect.left - rect.width / 2 - anchor.x * photo.width * fit * zoomScale,
          anchor.clientY - rect.top - rect.height / 2 - anchor.y * photo.height * fit * zoomScale,
        ));
        zoomAnchor.current = null;
      } else setPan((current) => clampPan(current.x, current.y));
      const active = gesture.current;
      if (active) {
        gesture.current = null;
        suppressClick.current = true;
        setDragging(false);
        if (element.hasPointerCapture(active.pointerId)) element.releasePointerCapture(active.pointerId);
      }
    };
    updateBounds();
    const observer = new ResizeObserver(updateBounds);
    observer.observe(element);
    return () => observer.disconnect();
  }, [photo.width, photo.height, expandedViewport, zoomed]);

  return (
    <button
      ref={root}
      type="button"
      aria-label={`Zoom photo: ${photo.alt || 'Gallery photo'}`}
      aria-pressed={zoomed}
      title={zoomed ? 'Drag to pan; click to reset zoom' : 'Click to zoom'}
      className={`group relative flex max-h-full w-full min-h-0 shrink-0 items-center justify-center overflow-hidden border-0 p-0 select-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white ${expandedViewport ? 'h-full' : 'rounded'} ${zoomed ? (dragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'}`}
      style={{ aspectRatio: expandedViewport ? undefined : `${photo.width} / ${photo.height}`, touchAction: zoomed ? 'none' : 'pan-y pinch-zoom' }}
      onPointerDown={(event) => {
        if (!event.isPrimary || event.button !== 0 || gesture.current) return;
        suppressClick.current = false;
        gesture.current = {
          pointerId: event.pointerId,
          x: event.clientX,
          y: event.clientY,
          panX: pan.x,
          panY: pan.y,
          dragged: false,
        };
        event.currentTarget.setPointerCapture(event.pointerId);
        if (zoomed) setDragging(true);
      }}
      onPointerMove={(event) => {
        const active = gesture.current;
        if (!active || active.pointerId !== event.pointerId) return;
        const dx = event.clientX - active.x;
        const dy = event.clientY - active.y;
        if (Math.hypot(dx, dy) >= dragThreshold) active.dragged = true;
        if (zoomed && active.dragged) {
          event.preventDefault();
          setPan(clampPan(active.panX + dx, active.panY + dy));
        }
      }}
      onPointerUp={(event) => {
        const active = gesture.current;
        if (!active || active.pointerId !== event.pointerId) return;
        suppressClick.current = active.dragged
          || Math.hypot(event.clientX - active.x, event.clientY - active.y) >= dragThreshold;
        gesture.current = null;
        setDragging(false);
        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
        const dx = event.clientX - active.x;
        const dy = event.clientY - active.y;
        if (!zoomed && Math.abs(dx) >= 40 && Math.abs(dx) > Math.abs(dy) * 1.5) {
          onNavigate(dx < 0 ? 1 : -1);
        }
      }}
      onPointerCancel={() => {
        gesture.current = null;
        suppressClick.current = true;
        setDragging(false);
      }}
      onLostPointerCapture={() => {
        if (gesture.current) suppressClick.current = true;
        gesture.current = null;
        setDragging(false);
      }}
      onClick={(event) => {
        event.stopPropagation();
        // Keyboard/assistive activation has detail 0 and must not inherit drag suppression.
        if (suppressClick.current && event.detail !== 0) {
          suppressClick.current = false;
          return;
        }
        suppressClick.current = false;
        if (!zoomed && event.detail !== 0) {
          const rect = event.currentTarget.getBoundingClientRect();
          const fit = Math.min(rect.width / photo.width, rect.height / photo.height);
          zoomAnchor.current = {
            x: (event.clientX - rect.left - rect.width / 2) / (photo.width * fit),
            y: (event.clientY - rect.top - rect.height / 2) / (photo.height * fit),
            clientX: event.clientX,
            clientY: event.clientY,
          };
        } else zoomAnchor.current = null;
        setPan({ x: 0, y: 0 });
        setZoomed(!zoomed);
        onZoomChange?.(!zoomed);
      }}
    >
      <span
        data-gallery-photo={photo.id}
        className={`pointer-events-none relative block max-h-full w-full bg-surface-150 motion-reduce:transition-none ${expandedViewport ? 'h-full' : ''} ${dragging || transitionName !== 'none' ? 'transition-none' : 'transition-transform duration-200 ease-out'}`}
        style={{
          aspectRatio: `${photo.width} / ${photo.height}`,
          transform: `translate(${showZoom ? pan.x : 0}px, ${showZoom ? pan.y : 0}px) scale(${showZoom ? zoomScale : 1})`,
          viewTransitionName: transitionName,
        }}
      >
        <PhotoLayers photo={photo} thumbnailSizes={thumbnailSizes} onImageRef={onImageRef} contain
          sizes={zoomed ? '(max-width: 864px) calc(250vw - 15rem), 1920px' : '(max-width: 864px) calc(100vw - 6rem), 768px'} />
      </span>

    </button>
  );
}
