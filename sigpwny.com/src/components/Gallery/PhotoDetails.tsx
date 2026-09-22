import { useLayoutEffect, useRef, useState } from 'react';
import type { GalleryPhoto } from './Viewer';

export function PhotoDetails({ photo }: {
  photo: GalleryPhoto;
}) {
  const scroller = useRef<HTMLElement>(null);
  const [moreBelow, setMoreBelow] = useState(false);
  useLayoutEffect(() => {
    const element = scroller.current!;
    element.scrollTop = 0;
    const measure = () => setMoreBelow(element.scrollHeight - element.clientHeight - element.scrollTop > 2);
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    observer.observe(element.firstElementChild!);
    element.addEventListener('scroll', measure, { passive: true });
    measure();
    return () => { observer.disconnect(); element.removeEventListener('scroll', measure); };
  }, [photo.id]);
  const rows = [
    ...photo.metadata.map(({ label, value }) => ({
      label,
      value: /resolution|size/i.test(label)
        ? value.replace(/(\d+)\s*[x×]\s*(\d+)\s*(?:CSS\s+)?pixels\b/gi, '$1x$2') : value,
    })),
  ];
  return (
    <div className="relative mx-auto mt-2 max-w-prose overflow-hidden rounded-xl border-2 border-surface-150 bg-surface-100 text-sm">
      <section ref={scroller} id="gallery-photo-details" aria-label="Photo details" tabIndex={0}
        className="custom-scrollbar h-[min(16rem,30dvh)] select-text overflow-y-auto overscroll-contain p-4 pb-9 [scrollbar-gutter:stable]">
        <dl className="m-0 grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-x-4">
          {rows.map(({ label, value }, index) => (
            <div key={`${label}-${index}`} className="contents">
              <dt className="border-b border-surface-150 py-2 text-white/60">{label}</dt>
              <dd className="m-0 min-w-0 border-b border-surface-150 py-2 font-mono text-xs leading-5 [overflow-wrap:anywhere]">{value}</dd>
            </div>
          ))}
        </dl>
      </section>
      {moreBelow && <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-surface-100 via-surface-100/95 to-transparent pt-5 pb-1 text-center text-xs text-white/70">
        More details below <span aria-hidden="true">↓</span>
      </div>}
    </div>
  );
}
