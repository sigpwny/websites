import type { GalleryAlbum, GalleryPhoto } from './Viewer';

type LanguageMap = Record<string, string[]>;

interface IiifImage {
  id: string;
  type: 'Image';
  width: number;
  height: number;
  label?: LanguageMap;
  'sigpwny:byteSize'?: number;
  'sigpwny:objectPosition'?: {
    'sigpwny:x'?: number;
    'sigpwny:y'?: number;
  };
}

interface IiifCanvas {
  id: string;
  label?: LanguageMap;
  metadata?: Array<{ label: LanguageMap; value: LanguageMap }>;
  rendering?: Array<IiifImage & { format?: string }>;
  thumbnail?: IiifImage[];
  items: Array<{
    items: Array<{
      body: {
        type: 'Choice';
        items: IiifImage[];
      };
    }>;
  }>;
}

interface IiifManifest {
  id: string;
  label?: LanguageMap;
  summary?: LanguageMap;
  items: IiifCanvas[];
}

interface IiifCollection {
  items: Array<{ id: string; label?: LanguageMap }>;
}

function languageText(value?: LanguageMap) {
  return value?.en?.[0] ?? Object.values(value ?? {})[0]?.[0] ?? '';
}

function normalizedCoordinate(value: number | undefined) {
  return typeof value === 'number' ? Math.min(1, Math.max(0, value)) : 0.5;
}

async function fetchIiif<T>(url: string, signal: AbortSignal): Promise<T> {
  const requestSignal = AbortSignal.any([signal, AbortSignal.timeout(15_000)]);
  const response = await fetch(url, { signal: requestSignal, cache: 'no-cache' });
  if (!response.ok) {
    throw new Error(`Unable to load photos from ${url}: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

function canvasToPhoto(canvas: IiifCanvas): GalleryPhoto | undefined {
  const images = canvas.items[0]?.items[0]?.body.items
    .filter((image) => image.type === 'Image')
    .sort((left, right) => left.width - right.width);
  const fullImage = images?.at(-1);
  if (!fullImage) return undefined;

  const thumbnail = canvas.thumbnail?.[0] ?? images[0] ?? fullImage;
  const position = thumbnail['sigpwny:objectPosition'];
  return {
    id: canvas.id,
    src: fullImage.id,
    thumbnail: thumbnail.id,
    srcSet: [...new Map([thumbnail, ...images].map((image) => [image.width, image])).values()]
      .sort((left, right) => left.width - right.width)
      .map((image) => `${image.id} ${image.width}w`).join(', '),
    width: fullImage.width,
    height: fullImage.height,
    alt: languageText(fullImage.label) || languageText(canvas.label) || 'SIGPwny photo',
    metadata: (canvas.metadata ?? []).map(({ label, value }) => ({
      label: languageText(label),
      value: languageText(value),
    })),
    downloads: (canvas.rendering ?? []).map((image) => ({
      src: image.id,
      label: languageText(image.label).replace(/^(Download original) .+$/, '$1') || 'Download image',
      width: image.width,
      height: image.height,
      bytes: image['sigpwny:byteSize'],
    })),
    thumbnailPosition: {
      x: normalizedCoordinate(position?.['sigpwny:x']),
      y: normalizedCoordinate(position?.['sigpwny:y']),
    },
  };
}

export interface AlbumEntry { url: string; title: string }
export type AlbumSlot = AlbumEntry & ({ status: 'loading' | 'error' } | { status: 'ready'; album: GalleryAlbum });

export async function loadCollection(url: string, signal: AbortSignal): Promise<AlbumEntry[]> {
  const collection = await fetchIiif<IiifCollection>(url, signal);
  return collection.items.map(({ id, label }) => ({ url: id, title: languageText(label) || 'Photo album' }));
}

export async function loadAlbum(url: string, signal: AbortSignal): Promise<GalleryAlbum> {
  const manifest = await fetchIiif<IiifManifest>(url, signal);
  return {
    id: new URL(manifest.id).pathname.split('/').at(-2) ?? manifest.id,
    title: languageText(manifest.label) || 'Untitled album',
    description: languageText(manifest.summary),
    photos: manifest.items.map(canvasToPhoto).filter((photo) => photo !== undefined),
  };
}
