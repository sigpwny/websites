import { useEffect, useRef, useState } from 'react';
import { AlbumSkeletons } from './AlbumSkeletons';
import { GalleryViewer } from './Viewer';
import { loadAlbum, loadCollection, type AlbumEntry, type AlbumSlot } from './loadAlbums';

type LoadState = { status: 'loading' } | { status: 'error' } | { status: 'ready'; slots: AlbumSlot[] };

export function GalleryLoader({ manifestUrl }: { manifestUrl: string }) {
  const [state, setState] = useState<LoadState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const activeRequest = useRef<AbortController | null>(null);
  const pendingAlbums = useRef(new Set<string>());

  async function settleAlbum(entry: AlbumEntry, signal: AbortSignal): Promise<AlbumSlot> {
    try {
      const album = await loadAlbum(entry.url, signal);
      return { ...entry, status: 'ready', album };
    } catch {
      return { ...entry, status: 'error' };
    }
  }

  async function requestAlbum(entry: AlbumEntry, signal: AbortSignal) {
    if (pendingAlbums.current.has(entry.url)) return;
    pendingAlbums.current.add(entry.url);
    const update = (slot: AlbumSlot) => {
      if (signal.aborted) return;
      setState((current) => current.status === 'ready'
        ? { ...current, slots: current.slots.map((item) => item.url === entry.url ? slot : item) }
        : current);
    };
    update({ ...entry, status: 'loading' });
    const slot = await settleAlbum(entry, signal);
    update(slot);
    if (!signal.aborted) pendingAlbums.current.delete(entry.url);
  }

  useEffect(() => {
    const controller = new AbortController();
    activeRequest.current = controller;
    pendingAlbums.current.clear();
    setState({ status: 'loading' });
    void (async () => {
      try {
        const entries = await loadCollection(manifestUrl, controller.signal);
        if (controller.signal.aborted) return;
        // Keep the initial skeleton until every independent request settles.
        const slots = await Promise.all(entries.map((entry) =>
          settleAlbum(entry, controller.signal)));
        if (!controller.signal.aborted) setState({ status: 'ready', slots });
      } catch {
        if (!controller.signal.aborted) setState({ status: 'error' });
      }
    })();
    return () => controller.abort();
  }, [manifestUrl, attempt]);

  if (state.status === 'loading') return <AlbumSkeletons />;
  if (state.status === 'error') return <div role="alert">
    <p>Couldn’t load the album list.</p>
    <button type="button" className="button btn-action" onClick={() => setAttempt((value) => value + 1)}>Try again</button>
  </div>;
  if (state.slots.length === 0) return <p>No photo albums yet.</p>;
  return <GalleryViewer
    albums={state.slots.flatMap((slot) => slot.status === 'ready' ? [slot.album] : [])}
    slots={state.slots}
    onRetryAlbum={(url) => {
      const entry = state.slots.find((slot) => slot.url === url);
      const controller = activeRequest.current;
      if (entry && controller && !controller.signal.aborted) void requestAlbum(entry, controller.signal);
    }}
  />;
}
