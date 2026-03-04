import React, { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';

interface ZoomableImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
  disableLightbox?: boolean;
}

export function ZoomableImage({ src, alt, className, containerClassName = '', disableLightbox = false, ...props }: ZoomableImageProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!src) return null;

  const handleClick = (e: React.MouseEvent) => {
    if (disableLightbox) return;
    e.stopPropagation();
    setIsOpen(true);
  };

  return (
    <>
      <div 
        className={`relative overflow-hidden w-full h-full ${disableLightbox ? '' : 'group cursor-pointer'} ${containerClassName}`}
        onClick={handleClick}
      >
        {/* Blurred Background */}
        <ImageWithFallback
          src={src}
          alt={`Background ${alt || ''}`}
          className="absolute inset-0 w-full h-full object-cover blur-xl opacity-40 scale-125"
        />
        {/* Main Image */}
        <div className="absolute inset-0 z-10 flex items-center justify-center p-2">
          <ImageWithFallback
            src={src}
            alt={alt}
            className={`w-full h-full object-contain ${className || ''}`}
            {...props}
          />
        </div>
        {/* Hover Overlay */}
        {!disableLightbox && (
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center">
            <ZoomIn className="w-8 h-8 text-white drop-shadow-md" />
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center animate-in fade-in duration-200">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors p-2 z-50 bg-black/20 rounded-full"
            aria-label="Fechar"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="relative w-full h-full flex items-center justify-center p-4" onClick={(e) => { e.stopPropagation(); setIsOpen(false) }}>
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-full object-contain animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}
