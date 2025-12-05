import React from 'react';
import type { Thumbnail } from '../types';

export default function Slider({
  thumbnails,
  onSelect,
  isOpen,
  sliderRef
}: {
  thumbnails: Thumbnail[]; // array ho YO!
  selectedImage: Thumbnail | null;
  onSelect: (t: Thumbnail) => void; // callback function for thumbnail clicked
  isOpen: boolean;
  sliderRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={sliderRef}
      className="fixed bottom-6 left-1/2 w-[90vw] max-w-[1280px] p-3 rounded-lg transition-all duration-100"
      style={{
        backdropFilter: 'blur(16px)',
        background: 'rgba(0, 0, 0, 0.6)',
        transform: isOpen
          ? 'translateX(-50%) translateY(0)'
          : 'translateX(-50%) translateY(150%)',
        opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none'
      }}
    >
      <div
        className="flex overflow-x-auto gap-3"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.3) transparent'
        }}
      >
        {thumbnails.map(img => {
          const nameWithoutExt = img.name.replace(/\.[^/.]+$/, ''); //removing extenstion

          return (
            <div
              key={img.name}
              onClick={() => onSelect(img)} //trigger here callback
              className={`relative cursor-pointer overflow-hidden rounded shrink-0 border-2 transition-color`}
              style={{ width: 320, height: 200 }}
            >
              <img
                src={img.thumbURL}
                className="object-cover w-full h-full"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-25 opacity-0 hover:opacity-50 transition-opacity flex items-center justify-center">
                <span className="text-white font-medium text-sm truncate px-2">
                  {nameWithoutExt}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
