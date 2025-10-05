'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageOption {
  path: string;
  name: string;
  filename: string;
}

interface ImageSelectorProps {
  selectedImage: string;
  onSelect: (path: string) => void;
}

export default function ImageSelector({ selectedImage, onSelect }: ImageSelectorProps) {
  const [images, setImages] = useState<ImageOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/admin/images');
      const data = await res.json();
      setImages(data.images || []);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = images.filter(img =>
    img.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    img.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="border border-gray-300 rounded-lg p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
        <p className="text-gray-500 mt-2">Loading images...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Search */}
      <input
        type="text"
        placeholder="Search images..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      />

      {/* Image Grid */}
      <div className="border border-gray-300 rounded-lg p-4 max-h-96 overflow-y-auto">
        {filteredImages.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No images found</p>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {filteredImages.map((img) => (
              <div
                key={img.path}
                onClick={() => onSelect(img.path)}
                className={`relative cursor-pointer border-2 rounded-lg overflow-hidden transition-all hover:scale-105 ${
                  selectedImage === img.path
                    ? 'border-primary-600 ring-2 ring-primary-300'
                    : 'border-gray-200 hover:border-primary-400'
                }`}
                style={{ aspectRatio: '1/1' }}
              >
                <Image
                  src={img.path}
                  alt={img.name}
                  fill
                  className="object-cover"
                  sizes="150px"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center truncate">
                  {img.name}
                </div>
                {selectedImage === img.path && (
                  <div className="absolute top-1 right-1 bg-primary-600 text-white rounded-full p-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500">
        {filteredImages.length} image{filteredImages.length !== 1 ? 's' : ''} available
        {searchTerm && ` (filtered from ${images.length})`}
      </p>
    </div>
  );
}
