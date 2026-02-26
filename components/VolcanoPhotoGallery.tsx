'use client';

import { useState } from 'react';

interface Photo {
  url: string;
  alt: string;
  attribution: {
    photographer: string;
    photographerUrl: string;
    source: string;
  };
}

interface VolcanoPhotoGalleryProps {
  photos: Photo[];
  volcanoName: string;
}

export default function VolcanoPhotoGallery({ photos, volcanoName }: VolcanoPhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});

  if (!photos || photos.length === 0) {
    return (
      <div className="bg-volcanic-900 border border-volcanic-700 rounded-xl p-8 text-center">
        <p className="text-volcanic-400">No photos available for {volcanoName}</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {photos.map((photo, index) => (
          <div
            key={index}
            className="relative group cursor-pointer overflow-hidden rounded-xl border border-volcanic-700 hover:border-lava transition-all"
            onClick={() => setSelectedPhoto(photo)}
          >
            {!imageError[index] ? (
              <img
                src={photo.url}
                alt={photo.alt}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
                onError={() => setImageError(prev => ({ ...prev, [index]: true }))}
              />
            ) : (
              <div className="w-full h-64 bg-volcanic-800 flex items-center justify-center">
                <p className="text-volcanic-500 text-sm">Image unavailable</p>
              </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <p className="text-sm font-medium">{photo.attribution.photographer}</p>
                <p className="text-xs text-gray-300">via {photo.attribution.source}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-5xl w-full">
            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.alt}
              className="w-full h-auto rounded-xl"
            />
            
            <div className="absolute bottom-4 left-4 bg-black/70 rounded-lg px-4 py-2 backdrop-blur-sm">
              <p className="text-white text-sm">
                Photo by{' '}
                <a
                  href={selectedPhoto.attribution.photographerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lava hover:text-lava-dark"
                  onClick={(e) => e.stopPropagation()}
                >
                  {selectedPhoto.attribution.photographer}
                </a>
                {' '}on {selectedPhoto.attribution.source}
              </p>
            </div>
            
            <button
              className="absolute top-4 right-4 text-white bg-black/70 rounded-full p-2 hover:bg-black/90 transition-colors"
              onClick={() => setSelectedPhoto(null)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}