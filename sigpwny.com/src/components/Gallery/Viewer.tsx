import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { FloatingOverlay } from '@floating-ui/react';

interface GalleryViewerContextType {
  setSelectedPhotoIndex: (index: number) => void;
}

interface ViewerProps {
  children: React.ReactNode;
  photos: { src: string }[];
}

interface ViewerTriggerProps {
  children: React.ReactNode;
  photoIndex: number;
}

export const GalleryViewerContext = createContext<GalleryViewerContextType>({
  setSelectedPhotoIndex: () => { console.warn('GalleryViewerContext not initialized'); },
});

export function ViewerTrigger({ children, photoIndex }: ViewerTriggerProps) {
  const { setSelectedPhotoIndex } = useContext(GalleryViewerContext);
  return (
    <div
      className="cursor-pointer"
      data-photo-index={photoIndex}
      onClick={() => setSelectedPhotoIndex(photoIndex)}
    >
      {children}
    </div>
  );
}

export function GalleryViewer({ children, photos }: ViewerProps) {
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const overlayRef = useRef(null);
  const closeViewer = () => {
    setCurrentIndex(null);
  }

  const setCurrentIndexWithLog = (index: number) => {
    console.log('Setting current index to:', index);
    setCurrentIndex(index);
  }

  return (
    <GalleryViewerContext.Provider value={{ setSelectedPhotoIndex: setCurrentIndexWithLog }}>
      {children}
      {currentIndex !== null ? (
        <FloatingOverlay
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
          lockScroll
          onClick={(e) => {
            if (e.target === overlayRef.current) closeViewer();
          }}
          ref={overlayRef}
        >
          <div className="relative max-w-screen-md max-h-screen p-4">
            <img
              src={photos[currentIndex].src} // Ensure your `photos` includes `.src`
              alt={`Photo ${currentIndex}`}
              className="object-contain max-h-full max-w-full rounded shadow-xl"
            />
            <button
              onClick={closeViewer}
              className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded"
            >
              ✕
            </button>
          </div>
        </FloatingOverlay>
      ) : null}
    </GalleryViewerContext.Provider>
  );
}
