export function AlbumSkeletons() {
  return (
    <div role="status" aria-label="Loading albums">
      <div className="mb-4"><button className="button btn-action" disabled>Expand all</button></div>
      <div aria-hidden="true" className="grid grid-cols-1 gap-2 md:grid-cols-2 2xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className={`rounded-xl border-2 border-surface-150 bg-surface-100 p-2 ${index >= 4 ? 'hidden 2xl:block' : index >= 2 ? 'hidden md:block' : ''}`}>
            <div className="mb-2 flex h-10 items-center"><div className="h-5 w-2/3 animate-pulse rounded bg-surface-200 motion-reduce:animate-none" /></div>
            <div className="grid grid-cols-3 grid-rows-2 gap-1 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-2 2xl:grid-cols-3">
              {Array.from({ length: 8 }, (_, photo) => <div key={photo} className={`aspect-square animate-pulse rounded-xl bg-surface-200 motion-reduce:animate-none ${photo >= 6 ? 'hidden sm:block md:hidden lg:block 2xl:hidden' : ''}`} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
