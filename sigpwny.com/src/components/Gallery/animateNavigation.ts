import { flushSync } from 'react-dom';

// Animate only the photo stage. Document snapshots can hide/fade the toolbar and
// abort when a decode stalls, especially during repeated navigation in Chromium.
export async function animateNavigation(
  stage: HTMLElement, update: () => void, signal: AbortSignal,
  incomingId: string, preloaded: Map<string, HTMLImageElement>,
) {
  if (signal.aborted) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    flushSync(update);
    return;
  }
  const bounds = stage.getBoundingClientRect();
  function frames() {
    return new Map(Array.from(stage.querySelectorAll<HTMLImageElement>('[data-gallery-photo]')).map((image) => {
      const rect = image.getBoundingClientRect();
      return [image.dataset.galleryPhoto!, {
        main: image.closest('button')?.hasAttribute('aria-pressed'),
        src: image.currentSrc || image.src,
        frame: {
          left: `${rect.left - bounds.left}px`, top: `${rect.top - bounds.top}px`,
          width: `${rect.width}px`, height: `${rect.height}px`,
          opacity: getComputedStyle(image).opacity,
          borderRadius: image.closest('button')?.hasAttribute('aria-pressed') ? '4px' : '8px',
        },
      }];
    }));
  }
  const before = frames();
  const decoded = new Map<string, HTMLImageElement>();
  const sources = new Map(Array.from(preloaded, ([id, image]) => [id, image.currentSrc || image.src]));
  before.forEach(({ src }, id) => sources.set(id, src));
  const decoding = new Map(Array.from(sources, ([id, src]) => [id, (async () => {
    const cached = preloaded.get(id);
    if (cached?.currentSrc === src && cached.complete && cached.naturalWidth > 0) {
      decoded.set(id, cached);
      return;
    }
    const image = new Image();
    image.src = src;
    let timer: number | undefined;
    const ready = await Promise.race([
      image.decode().then(() => true, () => false),
      new Promise<boolean>((resolve) => { timer = window.setTimeout(() => resolve(false), 3000); }),
    ]);
    window.clearTimeout(timer);
    if (ready) decoded.set(id, image);
  })()]));
  // Only the two moving photos gate navigation; a slow outer preview must not
  // hold up every click while the currently displayed photos are already ready.
  await Promise.all([
    decoding.get(incomingId),
    ...Array.from(before).filter(([, item]) => item.main).map(([id]) => decoding.get(id)),
  ]);
  if (signal.aborted) return;
  // Keep the current view if either moving image cannot be decoded. A later
  // click retries rather than committing a blank frame.
  if (!decoded.has(incomingId) || Array.from(before).some(([id, item]) => item.main && !decoded.has(id))) return;
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
    // Reuse each decoded image across its main/adjacent positions. Newly exposed
    // edge previews fade in; the current and outgoing images never crossfade.
    for (const id of new Set([...before.keys(), ...after.keys()])) {
      const old = before.get(id);
      const next = after.get(id);
      const clone = decoded.get(id) ?? document.createElement('img');
      if (!decoded.has(id)) clone.src = (old ?? next)!.src;
      clone.alt = '';
      clone.style.cssText = 'position:absolute;left:0;top:0;max-width:none;transform-origin:0 0;will-change:transform,opacity,clip-path;';
      const from = old?.frame ?? { ...next!.frame, opacity: '0' };
      const to = next?.frame ?? { ...old!.frame, opacity: '0' };
      // Keep the image's layout dimensions fixed. Uniform scaling preserves
      // its aspect ratio; an inset crop expands from the narrow side preview.
      const width = clone.naturalWidth || Number.parseFloat(to.width);
      const height = clone.naturalHeight || Number.parseFloat(to.height);
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
        };
      };
      Object.assign(clone.style, keyframe(to));
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
