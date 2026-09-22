import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import { flushSync } from 'react-dom';
import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useFloating,
} from '@floating-ui/react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDownloadRegular, ChevronRightRegular, DismissRegular, InfoFilled, InfoRegular, ZoomInRegular, ZoomOutRegular } from '$/components/Icons/fluentui';
import { ZoomablePhoto } from './ZoomablePhoto';
import { animateNavigation } from './animateNavigation';
import { PhotoDetails } from './PhotoDetails';
import { PhotoLayers } from './PhotoLayers';
import type { AlbumSlot } from './loadAlbums';
import DropdownSelect from '@/components/DropdownSelect';
import Menu from '@/components/Menu';

export interface GalleryPhoto {
  id: string;
  src: string;
  thumbnail: string;
  srcSet: string;
  width: number;
  height: number;
  alt: string;
  metadata: Array<{ label: string; value: string }>;
  downloads: Array<{ src: string; label: string; width: number; height: number; bytes?: number }>;
  thumbnailPosition: {
    x: number;
    y: number;
  };
}

export interface GalleryAlbum {
  id: string;
  title: string;
  description?: string;
  photos: GalleryPhoto[];
}

interface ViewerProps {
  albums: GalleryAlbum[];
  slots: AlbumSlot[];
  onRetryAlbum: (url: string) => void;
}

interface AlbumBlockProps {
  album: GalleryAlbum;
  expandedAlbumIds: Set<string>;
  expanded: boolean;
  previewCapacity: number;
  activePhotoKey: string | null;
  transitionPhotoKey: string | null;
  reducedMotion: boolean;
  onToggle: (albumId: string, expanded: boolean) => void;
  onOpenPhoto: (albumId: string, photo: GalleryPhoto) => void;
  onAlbumRef: (albumId: string, element: HTMLElement | null) => void;
  onHeaderButtonRef: (albumId: string, element: HTMLButtonElement | null) => void;
  onPhotoButtonRef: (photoKey: string, element: HTMLButtonElement | null) => void;
  onLayoutAnimationComplete: (albumId: string) => void;
}

type TransitionDocument = Document & {
  startViewTransition?: (update: () => Promise<void>) => {
    finished: Promise<void>;
    ready: Promise<void>;
    skipTransition: () => void;
  };
};

type TransitionDirection = 'open' | 'close';

const previewMediaQuery = '(min-width: 64rem) and (width < 96rem), (min-width: 40rem) and (width < 48rem)';
let transitionStyleRequest = 0;
let cancelActiveViewTransition: (() => void) | undefined;

function galleryPhotoKey(albumId: string, photoId: string) {
  return `${albumId}::${photoId}`;
}

function safeDomId(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, '-');
}

function getPreviewCapacity() {
  return window.matchMedia(previewMediaQuery).matches ? 8 : 6;
}

function subscribeToPreviewCapacity(onChange: () => void) {
  const mediaQuery = window.matchMedia(previewMediaQuery);
  mediaQuery.addEventListener('change', onChange);
  return () => mediaQuery.removeEventListener('change', onChange);
}

function usePreviewCapacity() {
  return useSyncExternalStore(subscribeToPreviewCapacity, getPreviewCapacity, () => 6);
}

async function runViewTransition(
  update: () => void,
  direction: TransitionDirection,
  position: GalleryPhoto['thumbnailPosition'],
): Promise<void> {
  cancelActiveViewTransition?.();
  const styleRequest = ++transitionStyleRequest;
  const root = document.documentElement;
  root.dataset.galleryTransition = direction;
  root.style.setProperty(
    '--gallery-thumbnail-position',
    `${position.x * 100}% ${position.y * 100}%`,
  );
  const clearTransitionStyles = () => {
    if (transitionStyleRequest !== styleRequest) return;
    delete root.dataset.galleryTransition;
    delete root.dataset.galleryMorph;
    for (const name of ['--gallery-thumbnail-position', '--gallery-morph-width', '--gallery-morph-height',
      '--gallery-morph-from-transform', '--gallery-morph-to-transform', '--gallery-morph-from-clip', '--gallery-morph-to-clip']) {
      root.style.removeProperty(name);
    }
  };
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const transitionDocument = document as TransitionDocument;
  if (reducedMotion || !transitionDocument.startViewTransition) {
    flushSync(update);
    clearTransitionStyles();
    return;
  }

  let cancelled = false;
  let updated = false;
  let transition: ReturnType<NonNullable<TransitionDocument['startViewTransition']>> | undefined;
  let finishWaiting!: () => void;
  const interrupted = new Promise<void>((resolve) => { finishWaiting = resolve; });
  const applyUpdate = () => {
    if (cancelled || updated || styleRequest !== transitionStyleRequest) return;
    updated = true;
    flushSync(update);
  };
  const cancel = () => {
    cancelled = true;
    transition?.skipTransition();
    clearTransitionStyles();
    finishWaiting();
  };
  cancelActiveViewTransition = cancel;
  // Normal animation is 250 ms. A stalled browser promise must never keep the
  // selection, scroll lock, or transition names active indefinitely.
  const deadline = window.setTimeout(() => { applyUpdate(); cancel(); }, 1000);

  const transitionImage = () => Array.from(document.querySelectorAll<HTMLElement>('img, [data-gallery-photo]'))
    .find((image) => image.style.viewTransitionName === 'gallery-photo');
  const from = transitionImage()?.getBoundingClientRect();
  try {
    transition = transitionDocument.startViewTransition.call(document, async () => {
      // Never wait for network or image decoding inside the browser's capture
      // callback: Chromium can skip a transition when that callback stalls.
      applyUpdate();
      if (cancelled || styleRequest !== transitionStyleRequest) return;
      const to = transitionImage()?.getBoundingClientRect();
      if (!from?.width || !from.height || !to?.width || !to.height) return;
      const full = direction === 'open' ? to : from;
      // Keep the native snapshot at the full image's dimensions. Changing the
      // crop and a uniform transform avoids the default per-frame width/height
      // layout, while preserving the attention-cropped thumbnail's framing.
      const frame = (rect: DOMRect, radius: number) => {
        const scale = Math.max(rect.width / full.width, rect.height / full.height);
        const cropX = Math.max(0, full.width - rect.width / scale);
        const cropY = Math.max(0, full.height - rect.height / scale);
        const left = cropX * position.x, top = cropY * position.y;
        return {
          transform: `translate3d(${rect.left - left * scale}px, ${rect.top - top * scale}px, 0) scale(${scale})`,
          clip: `inset(${top}px ${cropX - left}px ${cropY - top}px ${left}px round ${radius / scale}px)`,
        };
      };
      const start = frame(from, direction === 'open' ? 12 : 4);
      const end = frame(to, direction === 'open' ? 4 : 12);
      root.style.setProperty('--gallery-morph-width', `${full.width}px`);
      root.style.setProperty('--gallery-morph-height', `${full.height}px`);
      root.style.setProperty('--gallery-morph-from-transform', start.transform);
      root.style.setProperty('--gallery-morph-to-transform', end.transform);
      root.style.setProperty('--gallery-morph-from-clip', start.clip);
      root.style.setProperty('--gallery-morph-to-clip', end.clip);
      root.dataset.galleryMorph = '';
    });
    void transition.ready.catch(() => undefined);
    await Promise.race([transition.finished.catch(() => undefined), interrupted]);
  } catch {
    applyUpdate();
  } finally {
    window.clearTimeout(deadline);
    if (cancelActiveViewTransition === cancel) cancelActiveViewTransition = undefined;
    clearTransitionStyles();
  }
}

// Square object-cover tiles need enough source width for both crop dimensions.
function thumbnailSizes(photo: GalleryPhoto, expanded: boolean) {
  const crop = Math.max(1, photo.width / photo.height);
  const pixels = (size: number) => `${Math.ceil(size * crop)}px`;
  return `(min-width: 1536px) ${pixels(expanded ? 155 : 150)}, `
    + `(min-width: 1280px) ${pixels(expanded ? 143 : 140)}, `
    + `(min-width: 1024px) ${pixels(expanded ? 111 : 108)}, `
    + `(min-width: 768px) ${pixels(expanded ? 111 : 107)}, `
    + `(min-width: 640px) ${pixels(144)}, calc((100vw - 60px) / 3 * ${crop})`;
}

function PhotoButton({
  album,
  photo,
  index,
  activePhotoKey,
  transitionPhotoKey,
  newlyRevealed,
  expanded,
  reducedMotion,
  onOpenPhoto,
  onPhotoButtonRef,
}: {
  album: GalleryAlbum;
  photo: GalleryPhoto;
  index: number;
  activePhotoKey: string | null;
  transitionPhotoKey: string | null;
  newlyRevealed: boolean;
  expanded: boolean;
  reducedMotion: boolean;
  onOpenPhoto: (albumId: string, photo: GalleryPhoto) => void;
  onPhotoButtonRef: (photoKey: string, element: HTMLButtonElement | null) => void;
}) {
  const photoKey = galleryPhotoKey(album.id, photo.id);
  return (
    <motion.button
      type="button"
      ref={(button) => onPhotoButtonRef(photoKey, button)}
      initial={newlyRevealed ? { opacity: 0, y: 8 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.2 }}
      className="aspect-square cursor-pointer overflow-hidden rounded-xl bg-surface-200"
      aria-label={`Open photo ${index + 1} of ${album.photos.length} from ${album.title}`}
      onClick={() => onOpenPhoto(album.id, photo)}
    >
      <img
        src={photo.thumbnail}
        srcSet={photo.srcSet}
        sizes={thumbnailSizes(photo, expanded)}
        width={photo.width}
        height={photo.height}
        alt={photo.alt}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
        style={{
          objectPosition: `${photo.thumbnailPosition.x * 100}% ${photo.thumbnailPosition.y * 100}%`,
          viewTransitionName: transitionPhotoKey === photoKey && activePhotoKey !== photoKey
            ? 'gallery-photo'
            : 'none',
        }}
      />
    </motion.button>
  );
}

function useLatestCallback<Args extends unknown[], Result>(callback: (...args: Args) => Result) {
  const latest = useRef(callback);
  useLayoutEffect(() => { latest.current = callback; });
  return useCallback((...args: Args) => latest.current(...args), []);
}

const AlbumBlock = memo(function AlbumBlock({
  album,
  expandedAlbumIds,
  expanded,
  previewCapacity,
  activePhotoKey,
  transitionPhotoKey,
  reducedMotion,
  onToggle,
  onOpenPhoto,
  onAlbumRef,
  onHeaderButtonRef,
  onPhotoButtonRef,
  onLayoutAnimationComplete,
}: AlbumBlockProps) {
  const hasHiddenPhotos = album.photos.length > previewCapacity;
  const previewPhotoCount = hasHiddenPhotos ? previewCapacity - 1 : album.photos.length;
  const visiblePhotos = expanded ? album.photos : album.photos.slice(0, previewPhotoCount);
  const hiddenPhotoCount = album.photos.length - previewPhotoCount;
  const contentId = `album-${safeDomId(album.id)}-photos`;

  return (
    <motion.article
      ref={(article) => onAlbumRef(album.id, article)}
      layout="position"
      layoutDependency={expandedAlbumIds}
      onLayoutAnimationComplete={() => onLayoutAnimationComplete(album.id)}
      transition={{ layout: { duration: reducedMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] } }}
      className={`page-scroll-target flex flex-col overflow-hidden rounded-xl border-2 border-surface-150 bg-surface-100 text-content ${expanded ? 'md:col-span-2 2xl:col-span-3' : ''}`}
    >
      <header className="flex items-start justify-between gap-2 p-2">
        <div className={expanded ? 'max-w-prose' : undefined}>
          <h2 className="m-0 text-xl">{album.title}</h2>
          {expanded && album.description && (
            <p className="mb-0 mt-1">
              {album.description.split(/(https?:\/\/[^\s]+)/g).map((part, index) =>
                index % 2 === 1
                  ? <a key={index} href={part} className="underline underline-offset-2">{part}</a>
                  : part,
              )}
            </p>
          )}
        </div>
        <button
          type="button"
          ref={(button) => onHeaderButtonRef(album.id, button)}
          className="button btn-action flex size-10 shrink-0 items-center justify-center !p-0"
          aria-label={`${expanded ? 'Minimize' : 'Expand'} ${album.title}`}
          aria-expanded={expanded}
          aria-controls={contentId}
          title={expanded ? 'Minimize album' : 'Expand album'}
          onClick={() => onToggle(album.id, !expanded)}
        >
          <span
            aria-hidden="true"
            className={`transition-transform duration-200 motion-reduce:transition-none ${expanded ? '-rotate-90' : 'rotate-90'}`}
          >
            <ChevronRightRegular width="1em" height="1em" />
          </span>
        </button>
      </header>

      <div
        id={contentId}
        className={`mt-auto grid gap-1 px-2 pb-2 lg:gap-2 ${expanded
          ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 2xl:grid-cols-9'
          : 'grid-rows-2 grid-cols-3 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-3'}`}
      >
        {visiblePhotos.map((photo, index) => (
          <PhotoButton
            key={photo.id}
            album={album}
            photo={photo}
            index={index}
            activePhotoKey={activePhotoKey}
            transitionPhotoKey={transitionPhotoKey}
            expanded={expanded}
            newlyRevealed={expanded && index >= previewPhotoCount}
            reducedMotion={reducedMotion}
            onOpenPhoto={onOpenPhoto}
            onPhotoButtonRef={onPhotoButtonRef}
          />
        ))}

        {!expanded && hasHiddenPhotos && (
          <button
            type="button"
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-surface-200"
            aria-label={`Show all ${album.photos.length} photos in ${album.title}`}
            aria-expanded="false"
            aria-controls={contentId}
            onClick={() => onToggle(album.id, true)}
          >
            <img
              src={album.photos[previewPhotoCount].thumbnail}
              srcSet={album.photos[previewPhotoCount].srcSet}
              sizes={thumbnailSizes(album.photos[previewPhotoCount], false)}
              width={album.photos[previewPhotoCount].width}
              height={album.photos[previewPhotoCount].height}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="h-full w-full scale-110 object-cover brightness-[0.3] blur-md transition-transform duration-200 group-hover:scale-125 motion-reduce:transition-none"
              style={{
                objectPosition: `${album.photos[previewPhotoCount].thumbnailPosition.x * 100}% ${album.photos[previewPhotoCount].thumbnailPosition.y * 100}%`,
              }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-3xl font-normal text-white">
              +{hiddenPhotoCount}
            </span>
          </button>
        )}
      </div>
    </motion.article>
  );
});

export function GalleryViewer({ albums, slots, onRetryAlbum }: ViewerProps) {
  const previewCapacity = usePreviewCapacity();
  const reducedMotion = useReducedMotion() ?? false;
  const [expandedAlbumIds, setExpandedAlbumIds] = useState<Set<string>>(() => new Set());
  const [currentPhotoSelection, setCurrentPhotoSelection] = useState<{
    albumId: string;
    photoId: string;
  } | null>(null);
  const [transitionPhotoKey, setTransitionPhotoKey] = useState<string | null>(null);
  const [showMetadata, setShowMetadata] = useState(false);
  const photoStage = useRef<HTMLDivElement>(null);
  const navigationAnimation = useRef<AbortController | null>(null);
  const navigating = useRef(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [viewerImage, setViewerImage] = useState<HTMLImageElement | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const [downloadsOpen, setDownloadsOpen] = useState(false);
  const openingPhotoButton = useRef<HTMLButtonElement | null>(null);
  const operationVersion = useRef(0);
  const albumElements = useRef(new Map<string, HTMLElement>());
  const headerButtons = useRef(new Map<string, HTMLButtonElement>());
  const photoButtons = useRef(new Map<string, HTMLButtonElement>());
  const pendingScrollAlbumId = useRef<string | null>(null);
  const currentAlbum = currentPhotoSelection
    ? albums.find((album) => album.id === currentPhotoSelection.albumId)
    : undefined;
  const currentPhoto = currentAlbum?.photos.find(
    (photo) => photo.id === currentPhotoSelection?.photoId,
  );
  const activePhotoKey = currentPhotoSelection && currentPhoto
    ? galleryPhotoKey(currentPhotoSelection.albumId, currentPhoto.id)
    : null;
  const albumIds = albums.map((album) => album.id);
  const anyExpanded = albumIds.some((albumId) => expandedAlbumIds.has(albumId));
  const floating = useFloating({ open: currentPhoto !== undefined });
  const isOpen = currentPhoto !== undefined;
  const currentPhotoIndex = currentAlbum?.photos.findIndex((photo) => photo.id === currentPhoto?.id) ?? -1;
  const previousPhoto = currentAlbum?.photos[currentPhotoIndex - 1];
  const nextPhoto = currentAlbum?.photos[currentPhotoIndex + 1];

  function photoTransitionName(photoId: string): 'gallery-photo' | 'none' {
    return transitionPhotoKey && currentPhoto?.id === photoId ? 'gallery-photo' : 'none';
  }

  useEffect(() => () => {
    ++operationVersion.current;
    navigationAnimation.current?.abort();
    cancelActiveViewTransition?.();
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) return;
    // Lock the root scroller without fixing/clipping the body or displacing its sticky navbar.
    document.documentElement.dataset.galleryOpen = 'true';
    return () => { delete document.documentElement.dataset.galleryOpen; };
  }, [isOpen]);

  function setMapElement<T extends HTMLElement>(
    map: Map<string, T>,
    key: string,
    element: T | null,
  ) {
    if (element) map.set(key, element);
    else map.delete(key);
  }

  function toggleAlbum(albumId: string, expanded: boolean) {
    const album = albumElements.current.get(albumId);
    const previousTop = album?.offsetTop;
    const previousLeft = album?.offsetLeft;
    pendingScrollAlbumId.current = albumId;
    flushSync(() => {
      setExpandedAlbumIds((current) => {
        const next = new Set(current);
        if (expanded) next.add(albumId);
        else next.delete(albumId);
        return next;
      });
    });
    // Position-only layout changes have no completion callback if the card stays put.
    if (reducedMotion || (album?.offsetTop === previousTop && album?.offsetLeft === previousLeft)) {
      requestAnimationFrame(() => finishAlbumLayout(albumId));
    }
  }

  function finishAlbumLayout(albumId: string) {
    if (pendingScrollAlbumId.current !== albumId) return;
    pendingScrollAlbumId.current = null;
    headerButtons.current.get(albumId)?.focus({ preventScroll: true });
    albumElements.current.get(albumId)?.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  }

  function toggleAllAlbums() {
    pendingScrollAlbumId.current = null;
    setExpandedAlbumIds((current) => {
      if (albumIds.some((albumId) => current.has(albumId))) return new Set();
      const next = new Set(current);
      albumIds.forEach((albumId) => next.add(albumId));
      return next;
    });
  }

  function openPhoto(albumId: string, photo: GalleryPhoto) {
    if (currentPhoto) return;
    pendingScrollAlbumId.current = null;
    const request = ++operationVersion.current;
    cancelActiveViewTransition?.();
    const photoKey = galleryPhotoKey(albumId, photo.id);
    openingPhotoButton.current = photoButtons.current.get(photoKey) ?? null;
    setShowMetadata(false);
    setIsZoomed(false);
    flushSync(() => setTransitionPhotoKey(photoKey));
    const transitionFinished = runViewTransition(
      () => {
        if (operationVersion.current !== request) return;
        setCurrentPhotoSelection({ albumId, photoId: photo.id });
      },
      'open',
      photo.thumbnailPosition,
    );
    void transitionFinished.then(() => {
      if (operationVersion.current === request) {
        setTransitionPhotoKey(null);
      }
    });

  }

  function closePhoto() {
    setDownloadsOpen(false);
    navigationAnimation.current?.abort();
    navigating.current = false;
    if (!currentPhoto || !activePhotoKey) return;
    const closingPhotoKey = activePhotoKey;
    const request = ++operationVersion.current;
    cancelActiveViewTransition?.();
    const thumbnail = photoButtons.current.get(closingPhotoKey);
    const rect = thumbnail?.getBoundingClientRect();
    const thumbnailVisible = !isZoomed && rect && rect.bottom > 0 && rect.top < window.innerHeight;
    flushSync(() => {
      setTransitionPhotoKey(thumbnailVisible ? closingPhotoKey : null);
    });
    const close = () => {
      if (operationVersion.current !== request) return;
      setCurrentPhotoSelection(null);
      setIsZoomed(false);
    };
    let transitionFinished: Promise<void>;
    if (thumbnailVisible) {
      transitionFinished = runViewTransition(close, 'close', currentPhoto.thumbnailPosition);
    } else {
      flushSync(close);
      transitionFinished = Promise.resolve();
    }
    void transitionFinished.then(() => {
      if (operationVersion.current !== request) return;
      setTransitionPhotoKey(null);
      const albumButton = currentAlbum && headerButtons.current.get(currentAlbum.id);
      const focusTarget = [thumbnail, openingPhotoButton.current, albumButton].find((button) => {
        if (!button?.isConnected) return false;
        const bounds = button.getBoundingClientRect();
        return bounds.bottom > 0 && bounds.top < window.innerHeight;
      }) ?? albumButton;
      focusTarget?.focus({ preventScroll: true });
    });
  }

  function navigatePhoto(direction: number) {
    const photo = currentAlbum?.photos[currentPhotoIndex + direction];
    if (!photo || !currentAlbum || !currentPhoto || navigating.current || isZoomed || transitionPhotoKey || !photoStage.current) return;
    setDownloadsOpen(false);
    const request = ++operationVersion.current;
    navigating.current = true;
    const restoreImageFocus = document.activeElement === viewerImage?.closest('button');
    const controller = new AbortController();
    navigationAnimation.current = controller;
    const update = () => {
      if (operationVersion.current !== request) return;
      setCurrentPhotoSelection({ albumId: currentAlbum.id, photoId: photo.id });
    };
    const finished = animateNavigation(photoStage.current, update, controller.signal);
    void finished.catch(() => undefined).then(() => {
      if (operationVersion.current !== request) return;
      navigating.current = false;
      navigationAnimation.current = null;
      if (restoreImageFocus) {
        floating.refs.floating.current?.querySelector<HTMLButtonElement>('button[aria-pressed]')?.focus({ preventScroll: true });
      }
    });
  }

  useEffect(() => {
    if (!currentPhoto) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        if (downloadsOpen) setDownloadsOpen(false);
        else closePhoto();
        return;
      }
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        navigatePhoto(event.key === 'ArrowLeft' ? -1 : 1);
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [currentPhoto, viewerImage, isZoomed, downloadsOpen, transitionPhotoKey]);

  const onOpenPhoto = useLatestCallback(openPhoto);
  const onToggleAlbum = useLatestCallback(toggleAlbum);
  const onAlbumLayoutComplete = useLatestCallback(finishAlbumLayout);
  const onAlbumRef = useLatestCallback((id: string, element: HTMLElement | null) => setMapElement(albumElements.current, id, element));
  const onHeaderRef = useLatestCallback((id: string, element: HTMLButtonElement | null) => setMapElement(headerButtons.current, id, element));
  const onPhotoRef = useLatestCallback((id: string, element: HTMLButtonElement | null) => setMapElement(photoButtons.current, id, element));

  return (
    <>
      {albumIds.length > 0 && (
        <div className="mb-4">
          <button
            type="button"
            className="button btn-action"
            onClick={toggleAllAlbums}
          >
            {anyExpanded ? 'Minimize all' : 'Expand all'}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-2 overflow-x-clip md:grid-cols-2 2xl:grid-cols-3">
        {slots.map((slot) => {
          if (slot.status !== 'ready') return (
            <article key={slot.url} className="min-h-64 rounded-xl border-2 border-surface-150 bg-surface-100 p-2">
              <h2 className="m-0 text-xl">{slot.title}</h2>
              {slot.status === 'error' ? <div role="alert">
                <p>Couldn’t load this album.</p>
                <button type="button" className="button btn-action" aria-label={`Try again: ${slot.title}`} onClick={() => onRetryAlbum(slot.url)}>Try again</button>
              </div> : <div role="status" aria-label={`Loading ${slot.title}`} className="mt-2 grid grid-cols-3 grid-rows-2 gap-1 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-2 2xl:grid-cols-3">
                {Array.from({ length: 8 }, (_, index) => <div key={index} className={`aspect-square animate-pulse rounded-xl bg-surface-200 motion-reduce:animate-none ${index >= 6 ? 'hidden sm:block md:hidden lg:block 2xl:hidden' : ''}`} />)}
              </div>}
            </article>
          );
          const album = slot.album;
          const expanded = expandedAlbumIds.has(album.id);
          return (
            <AlbumBlock
              key={album.id}
              album={album}
              expandedAlbumIds={expandedAlbumIds}
              expanded={expanded}
              previewCapacity={previewCapacity}
              activePhotoKey={transitionPhotoKey ? activePhotoKey : null}
              transitionPhotoKey={transitionPhotoKey}
              reducedMotion={reducedMotion}
              onToggle={onToggleAlbum}
              onOpenPhoto={onOpenPhoto}
              onAlbumRef={onAlbumRef}
              onHeaderButtonRef={onHeaderRef}
              onPhotoButtonRef={onPhotoRef}
              onLayoutAnimationComplete={onAlbumLayoutComplete}
            />
          );
        })}
      </div>

      {currentPhoto && (
        <FloatingPortal>
          <FloatingFocusManager context={floating.context} modal initialFocus={closeButton} returnFocus={false}>
            <FloatingOverlay
              ref={floating.refs.setFloating}
              className="fixed inset-0 z-50 flex select-none flex-col bg-black/70 pb-[calc(3.75rem+env(safe-area-inset-bottom))] backdrop-blur-sm text-white overscroll-contain lg:pb-0"
              role="dialog"
              aria-modal="true"
              aria-label={`Photo viewer: ${currentAlbum?.title}`}
              onClick={(event) => {
                if (event.target === event.currentTarget) closePhoto();
              }}
            >
              <div className="relative z-10 grid shrink-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-2 py-2 sm:px-4">
                <p className="col-start-1 row-start-1 m-0 h-11 w-fit max-w-full truncate rounded-xl border-2 border-surface-150 bg-surface-100/80 px-3 text-sm leading-10 backdrop-blur-xl" title={currentAlbum?.title}>
                  {currentAlbum?.title}
                </p>
                <p className="col-start-2 row-start-1 m-0 flex h-11 items-center rounded-xl border-2 border-surface-150 bg-surface-100/80 px-3 text-sm tabular-nums backdrop-blur-xl" aria-live="polite" aria-atomic="true">{currentPhotoIndex + 1} / {currentAlbum?.photos.length}</p>
                <div className="col-start-3 row-start-1 flex items-center gap-4 justify-self-end">
                  <div role="group" aria-label="Photo actions" className="fixed inset-x-0 bottom-[max(0.5rem,env(safe-area-inset-bottom))] flex items-center justify-center gap-1 lg:static">
                    <button type="button" aria-label={isZoomed ? 'Zoom out' : 'Zoom in'} title={isZoomed ? 'Zoom out' : 'Zoom in'}
                      onClick={() => viewerImage?.closest('button')?.click()}
                      className="flex size-11 cursor-pointer items-center justify-center rounded-xl border-2 border-surface-150 bg-surface-100/80 backdrop-blur-xl hover:bg-surface-200 focus-visible:outline-2 focus-visible:outline-white">
                      {isZoomed ? <ZoomOutRegular aria-hidden="true" width="24" height="24" /> : <ZoomInRegular aria-hidden="true" width="24" height="24" />}
                    </button>
                    <button type="button" aria-label="Toggle photo info" title="Toggle photo info" aria-expanded={showMetadata && !isZoomed} aria-controls="gallery-photo-details"
                      onClick={() => {
                        if (isZoomed) viewerImage?.closest('button')?.click();
                        setShowMetadata(isZoomed || !showMetadata);
                      }}
                      className="flex size-11 cursor-pointer items-center justify-center rounded-xl border-2 border-surface-150 bg-surface-100/80 backdrop-blur-xl hover:bg-surface-200 focus-visible:outline-2 focus-visible:outline-white">
                      {showMetadata && !isZoomed ? <InfoFilled aria-hidden="true" width="24" height="24" /> : <InfoRegular aria-hidden="true" width="24" height="24" />}
                    </button>
                    {currentPhoto.downloads.length > 0 && (
                      <DropdownSelect
                        displayText={<ArrowDownloadRegular aria-hidden="true" width="24" height="24" />}
                        triggerAriaLabel="Download photos"
                        triggerTitle="Download photos"
                        showChevron={false}
                        open={downloadsOpen}
                        onOpenChange={setDownloadsOpen}
                        placement="bottom-end"
                        closeOnSelect
                        triggerClassName="!size-11 !justify-center !gap-0 !p-0 !rounded-xl !border-2 !border-surface-150 !bg-surface-100/80 hover:!bg-surface-150 backdrop-blur-xl"
                        contentRootClassName="z-[60] w-64 max-w-[calc(100vw-1rem)] select-none text-sm"
                      >
                        <Menu><ul aria-label="Download options">
                          {currentPhoto.downloads.map((download) => (
                            <li key={download.src}><a href={download.src} download target="_blank" rel="noopener noreferrer" className="py-2">
                              <span><span className="block font-bold">{download.label}</span>
                              <span className="block font-mono text-xs text-white/60">{download.width}x{download.height}{download.bytes !== undefined && ` · ${(download.bytes / 1024 / 1024).toFixed(2)} MiB`}</span></span>
                            </a></li>
                          ))}
                        </ul></Menu>
                      </DropdownSelect>
                    )}
                  </div>
                <button ref={closeButton} type="button" onClick={closePhoto} aria-label="Close photo viewer"
                  className="flex size-11 justify-self-end cursor-pointer items-center justify-center rounded-xl border-2 border-surface-150 bg-surface-100/80 backdrop-blur-xl hover:bg-surface-200 focus-visible:outline-2 focus-visible:outline-white">
                  <DismissRegular aria-hidden="true" width="24" height="24" />
                </button>
                </div>
              </div>
              <div ref={photoStage} className="relative min-h-0 w-full flex-1 [container-type:size]">
                <div className="absolute inset-0 grid" style={{
                  gridTemplateColumns: isZoomed ? '0 minmax(0,1fr) 0' : `minmax(3rem, 1fr) min(calc(100cqw - 6rem), 48rem, ${100 * currentPhoto.width / currentPhoto.height}cqh) minmax(3rem, 1fr)`,
                }}>
                 <button hidden={isZoomed} type="button" aria-label="Previous photo" aria-disabled={!previousPhoto} tabIndex={previousPhoto && !isZoomed ? 0 : -1}
                   onClick={() => navigatePhoto(-1)} className={`group relative h-full w-full overflow-hidden focus-visible:outline-2 focus-visible:-outline-offset-2 ${previousPhoto ? 'cursor-pointer' : 'cursor-default'}`}>
                   {!isZoomed && previousPhoto && <span data-gallery-photo={previousPhoto.id} className="pointer-events-none absolute top-1/2 right-2 w-3/4 max-w-40 -translate-y-1/2 overflow-hidden rounded-lg bg-surface-200"
                     style={{ height: `min(80cqh, ${(previousPhoto.height / previousPhoto.width) * 38.4}rem, calc((100cqw - 6rem) * ${0.8 * previousPhoto.height / previousPhoto.width}))` }}>
                     <PhotoLayers photo={previousPhoto} thumbnailSizes={thumbnailSizes(previousPhoto, expandedAlbumIds.has(currentAlbum!.id))}
                       sizes="(max-width: 864px) calc((100vw - 6rem) * 0.8), 614.4px" decorative />
                   </span>}
                 </button>
                <div className="col-start-2 flex h-full min-h-0 items-center justify-center" onClick={(event) => { if (!isZoomed && event.target === event.currentTarget) closePhoto(); }}>
                   <ZoomablePhoto key={currentPhoto.id} photo={currentPhoto} thumbnailSizes={thumbnailSizes(currentPhoto, expandedAlbumIds.has(currentAlbum!.id))}
                     onNavigate={navigatePhoto}
                    transitionName={photoTransitionName(currentPhoto.id)} onImageRef={setViewerImage}
                    expandedViewport={isZoomed} onZoomChange={(value) => {
                      if (value && navigating.current) {
                        navigationAnimation.current?.abort();
                        ++operationVersion.current;
                        navigating.current = false;
                      }
                      setIsZoomed(value);
                    }} />
                </div>
                 <button hidden={isZoomed} type="button" aria-label="Next photo" aria-disabled={!nextPhoto} tabIndex={nextPhoto && !isZoomed ? 0 : -1}
                   onClick={() => navigatePhoto(1)} className={`group relative h-full w-full overflow-hidden focus-visible:outline-2 focus-visible:-outline-offset-2 ${nextPhoto ? 'cursor-pointer' : 'cursor-default'}`}>
                   {!isZoomed && nextPhoto && <span data-gallery-photo={nextPhoto.id} className="pointer-events-none absolute top-1/2 left-2 w-3/4 max-w-40 -translate-y-1/2 overflow-hidden rounded-lg bg-surface-200"
                     style={{ height: `min(80cqh, ${(nextPhoto.height / nextPhoto.width) * 38.4}rem, calc((100cqw - 6rem) * ${0.8 * nextPhoto.height / nextPhoto.width}))` }}>
                     <PhotoLayers photo={nextPhoto} thumbnailSizes={thumbnailSizes(nextPhoto, expandedAlbumIds.has(currentAlbum!.id))}
                       sizes="(max-width: 864px) calc((100vw - 6rem) * 0.8), 614.4px" decorative />
                   </span>}
                </button>
                </div>
              </div>
              <div hidden={isZoomed || !showMetadata} className="shrink-0 px-4 py-3">
                {showMetadata && (
                  <PhotoDetails photo={currentPhoto} />
                )}
              </div>
            </FloatingOverlay>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </>
  );
}
