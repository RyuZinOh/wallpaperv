import { useEffect, useState, useRef } from 'react';
import { CaretDownIcon, CloudArrowDownIcon } from '@phosphor-icons/react';
import Background from './Layout/Background';
import Slider from './Modules/Slider';
import loaderGif from '/Assets/loader.gif';
import type { Thumbnail, GitHubFile } from './types';

function calculatePanningInfo(imgW: number, imgH: number) {
  const screenW = window.innerWidth;
  const screenH = window.innerHeight;
  const imgAspect = imgW / imgH;
  const screenAspect = screenW / screenH;
  const isWide = imgAspect > screenAspect * 1.1;
  const calculatedWidth = isWide ? imgW * (screenH / imgH) : screenW;

  return { isWide, calculatedWidth };
}

export default function App() {
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([]);
  const [selectedImage, setSelectedImage] = useState<Thumbnail | null>(null);
  const [loadedImage, setLoadedImage] = useState<string | null>(null);
  const [isPannable, setIsPannable] = useState(false);
  const [renderedWidth, setRenderedWidth] = useState(1920);
  const [mouseX, setMouseX] = useState(0);
  const [smoothMouseX, setSmoothMouseX] = useState(0);
  const [switching, setSwitching] = useState(false);
  const [sliderOpen, setSliderOpen] = useState(false);

  const sliderRef = useRef<HTMLDivElement>(null);

  // Fetching Images from Github
  useEffect(() => {
    const fetchThumbnails = async () => {
      try {
        const res = await fetch(
          'https://api.github.com/repos/RyuZinOh/.dotfiles/contents/thumbnails?ref=thumbs'
        );
        if (!res.ok) {
          throw new Error('Failed to fetch thumbnails');
        }

        const files: GitHubFile[] = await res.json();
        const thumbs: Thumbnail[] = files
          .filter(f => /\.(jpg|jpeg)$/i.test(f.name)) // regex to see if file ends with that extenstion and insensitive
          .map(f => ({
            name: f.name,
            thumbURL: f.download_url,
            fullURL: `https://raw.githubusercontent.com/RyuZinOh/.dotfiles/main/Pictures/${f.name}` // mapping the gathered name to the real source here!!
          }));

        setThumbnails(thumbs);
        if (thumbs.length > 0) {
          loadImage(thumbs[69 + 1]); //default set when loading site
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchThumbnails();
  }, []);

  /*
   Panning effect similar to this wallpaperservice
   [https://github.com/RyuZinOh/.dotfiles/blob/main/quickshell/Services/WallpaperService/WallpaperService.qml]
  */
  useEffect(() => {
    let frame: number;
    const animate = () => {
      setSmoothMouseX(prev => prev + (mouseX - prev) * 0.12);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [mouseX]);

  // load image & then calculate panning
  const loadImage = (thumb: Thumbnail) => {
    setSwitching(true);
    const img = new Image();
    img.src = thumb.fullURL;

    img.onload = () => {
      const info = calculatePanningInfo(img.width, img.height);
      setIsPannable(info.isWide);
      setRenderedWidth(info.calculatedWidth);
      setLoadedImage(thumb.fullURL);
      setSelectedImage(thumb);

      setTimeout(() => setSwitching(false), 120);
    };
  };

  const handleDownload = async () => {
    if (!selectedImage) {
      return;
    }
    const res = await fetch(selectedImage.fullURL);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = selectedImage.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 bg-black"
      onMouseMove={e => {
        if (!sliderRef.current?.contains(e.target as Node)) {
          setMouseX(e.clientX);
        }
      }}
    >
      {/* Background layer */}
      <Background
        loadedImage={loadedImage}
        isPannable={isPannable}
        renderedWidth={renderedWidth}
        smoothMouseX={smoothMouseX}
        switching={switching}
      />

      {/* selector */}
      <Slider
        thumbnails={thumbnails}
        selectedImage={selectedImage}
        onSelect={loadImage}
        isOpen={sliderOpen}
        sliderRef={sliderRef}
      />

      {/* toggling slider[selector] component */}
      <button
        onClick={() => setSliderOpen(!sliderOpen)}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 rounded-full p-3  hover:cursor-pointer"
        style={{
          backdropFilter: 'blur(16px)',
          background: 'rgba(0,0,0,0.6)',
          transform: sliderOpen
            ? 'translateX(-50%) translateY(-240px)'
            : 'translateX(-50%) translateY(0)'
        }}
      >
        <CaretDownIcon
          size={28}
          weight="bold"
          className="text-white"
          style={{
            transform: sliderOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: '0.3s ease'
          }}
        />
      </button>

      {/* // for user to download  */}
      <button
        onClick={handleDownload}
        className="fixed bottom-6 right-6 z-30 rounded-full p-4  hover:cursor-pointer"
        style={{ backdropFilter: 'blur(16px)', background: 'rgba(0,0,0,0.6)' }}
      >
        <CloudArrowDownIcon size={28} weight="bold" className="text-white" />
      </button>

      {/* //loader gif when switching */}
      {switching && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <img src={loaderGif} alt="Loading..." className="w-24 h-24" />
        </div>
      )}
    </div>
  );
}
