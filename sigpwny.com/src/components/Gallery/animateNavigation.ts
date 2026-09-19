import { flushSync } from 'react-dom';

// Animate the layered photo frames while keeping the toolbar stationary.
export async function animateNavigation(
  stage: HTMLElement, update: () => void, signal: AbortSignal,
) {
  if (signal.aborted) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    flushSync(update);
    return;
  }
  const bounds = stage.getBoundingClientRect();
  function frames() {
    return new Map(Array.from(stage.querySelectorAll<HTMLElement>('[data-gallery-photo]')).map((frame) => {
      const image = frame.querySelector('img')!;
      const rect = frame.getBoundingClientRect();
      return [frame.dataset.galleryPhoto!, {
        element: frame.cloneNode(true) as HTMLElement,
        width: Number(image.getAttribute('width')),
        height: Number(image.getAttribute('height')),
        background: getComputedStyle(frame).backgroundColor,
        frame: {
          left: `${rect.left - bounds.left}px`, top: `${rect.top - bounds.top}px`,
          width: `${rect.width}px`, height: `${rect.height}px`,
          opacity: getComputedStyle(frame).opacity,
          imageOpacity: getComputedStyle(image).opacity,
          backgroundColor: getComputedStyle(frame).backgroundColor,
          borderRadius: image.closest('button')?.hasAttribute('aria-pressed') ? '4px' : '8px',
        },
      }];
    }));
  }
  const before = frames();
  // Snapshot DOM layers, not decoded pixels. Empty frames animate too, and
  // their native responsive images can finish loading during the animation.
  const layer = document.createElement('div');
  layer.ariaHidden = 'true';
  layer.dataset.galleryAnimation = '';
  layer.style.cssText = 'position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:1';
  const animations: Animation[] = [];
  const cleanUp = () => {
    animations.forEach((animation) => animation.cancel());
    layer.remove();
    delete stage.dataset.animating;
  };
  signal.addEventListener('abort', cleanUp, { once: true });
  try {
    flushSync(update);
    const after = frames();
    // Reuse complete layered frames across main/adjacent positions.
    for (const id of new Set([...before.keys(), ...after.keys()])) {
      const old = before.get(id);
      const next = after.get(id);
      const source = old ?? next!;
      const clone = source.element;
      clone.removeAttribute('data-gallery-photo');
      clone.className = '';
      clone.style.cssText = 'position:absolute;left:0;top:0;max-width:none;transform-origin:0 0;will-change:transform,opacity,clip-path;';
      clone.style.backgroundColor = source.background;
      const from = old?.frame ?? { ...next!.frame, opacity: '0' };
      const to = next?.frame ?? { ...old!.frame, opacity: '0' };
      // Keep the image's layout dimensions fixed. Uniform scaling preserves
      // its aspect ratio; an inset crop expands from the narrow side preview.
      const width = source.width;
      const height = source.height;
      clone.style.width = `${width}px`;
      clone.style.height = `${height}px`;
      const keyframe = (frame: typeof to) => {
        const w = Number.parseFloat(frame.width), h = Number.parseFloat(frame.height);
        const scale = Math.max(w / width, h / height);
        const cropX = Math.max(0, (width - w / scale) / 2);
        const cropY = Math.max(0, (height - h / scale) / 2);
        const x = Number.parseFloat(frame.left) - cropX * scale;
        const y = Number.parseFloat(frame.top) - cropY * scale;
        return {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
          clipPath: `inset(${cropY}px ${cropX}px round ${Number.parseFloat(frame.borderRadius) / scale}px)`,
          opacity: frame.opacity,
          backgroundColor: frame.backgroundColor,
        };
      };
      Object.assign(clone.style, keyframe(to));
      for (const image of clone.querySelectorAll('img')) {
        image.style.opacity = to.imageOpacity;
        animations.push(image.animate([{ opacity: from.imageOpacity }, { opacity: to.imageOpacity }], {
          duration: 250, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'both',
        }));
      }
      layer.append(clone);
      animations.push(clone.animate([keyframe(from), keyframe(to)], {
        duration: 250, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'both',
      }));
    }
    stage.dataset.animating = '';
    stage.append(layer);
    await Promise.all(animations.map((animation) => animation.finished.catch(() => undefined)));
  } finally {
    signal.removeEventListener('abort', cleanUp);
    cleanUp();
  }
}
