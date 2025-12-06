import React, { useState } from 'react';
import type { Thumbnail } from '../types';
import { FunnelIcon, XIcon } from '@phosphor-icons/react';

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
  const [showFilter, setShowFilter] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const filteredThumbnails = selectedLetter
    ? thumbnails.filter(img =>
        img.name.toUpperCase().startsWith(selectedLetter)
      )
    : thumbnails;

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
      {/*container with filter button and content */}
      <div className="flex gap-3 ">
        {/* contianer for thumbnails or alphabet grid for filteration*/}
        <div className="flex-1 overflow-hidden">
          {showFilter ? (
            <div className="grid grid-cols-11 gap-2">
              {alphabet.map(letter => (
                <button
                  key={letter}
                  onClick={() => {
                    setSelectedLetter(letter);
                    setShowFilter(false);
                  }}
                  className="flex hover:cursor-pointer items-center justify-center cursor-pointer rounded transition-all"
                  style={{
                    height: 50,
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: 'rgba(255, 255, 255, 0.5)',
                    textShadow: '0 0 20px rgba(255,255,255,0.3)'
                  }}
                >
                  {letter}
                </button>
              ))}
            </div>
          ) : (
            <div
              className="flex overflow-x-auto gap-3"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(255,255,255,0.3) transparent'
              }}
            >
              {filteredThumbnails.map(img => {
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
          )}

          {/*  clear filter button when letter is selected */}
          {selectedLetter && !showFilter && (
            <div className="flex items-center justify-between">
              <span className="text-white text-sm">
                Showing: <strong>{selectedLetter}</strong>
              </span>
              <button
                onClick={() => setSelectedLetter(null)}
                className="px-3 py-1 rounded text-white text-xs transition-all hover:cursor-pointer"
                style={{
                  background: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(8px)'
                }}
              >
                Clear Filter
              </button>
            </div>
          )}
        </div>

        {/* filter toggler*/}
        <div className="flex items-start">
          <button
            onClick={() => {
              setShowFilter(!showFilter);
              setSelectedLetter(null);
            }}
            className="p-3 rounded-lg transition-all duration-100 hover:cursor-pointer"
            style={{
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(8px)'
            }}
          >
            {showFilter ? (
              <XIcon size={24} weight="bold" color="rgba(255, 255, 255, 0.8)" />
            ) : (
              <FunnelIcon
                size={24}
                weight="bold"
                color="rgba(255, 255, 255, 0.8)"
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
