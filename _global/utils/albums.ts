import path from 'node:path';
import { getCollection, type CollectionEntry } from 'astro:content';

export async function getAlbums() {
  const albums = await getCollection('albums');
  return albums;
}

export async function getPhotosByAlbum(album: CollectionEntry<'albums'>) {
  const albumDir = path.posix.parse(album.filePath).dir;
  // Construct glob for photos in the album directory (*.jpg, *.jpeg, *.png)
  // const glob = path.join(albumDir, '**', '*.{jpg,jpeg,png}');
  const photoPromises = import.meta.glob('/../_global/content/albums/**/*.{png,jpg,jpeg}');
  const filteredPhotos = Object.fromEntries(
    Object.entries(photoPromises).filter(([key]) => key.startsWith(albumDir))
  );
  // const filteredPhotos = Object.keys(photoPromises).filter((key) => key.startsWith(albumDir));
  const photos = await Promise.all(
    Object.values(filteredPhotos).map((image: any) => image().then((mod: any) => mod.default))
  );
  return photos.filter((photo: any) => photo !== undefined);
}