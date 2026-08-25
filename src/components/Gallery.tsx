import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../context/DataContext';
import { GalleryItem } from '../types';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import FadeInSection from './ui/FadeInSection';

export default function Gallery() {
  const { galleryItems } = useData();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const lightboxImgRef = useRef<HTMLImageElement>(null);

  // Lock body scroll and set inert on background when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      document.getElementById('gallery-grid')?.setAttribute('inert', 'true');
      return () => {
        document.body.style.overflow = originalOverflow;
        document.getElementById('gallery-grid')?.removeAttribute('inert');
      };
    }
  }, [lightboxIndex]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevSlide();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextSlide();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex]);

  // Focus management: focus the lightbox image when opened
  useEffect(() => {
    if (lightboxIndex !== null) {
      setTimeout(() => lightboxImgRef.current?.focus(), 50);
    }
  }, [lightboxIndex]);

  const tabs = [
    { code: 'all', name: 'Tutte le Foto' },
    { code: 'piatti', name: 'I Nostri Piatti' },
    { code: 'ambiente', name: 'La Trattoria' },
    { code: 'dettagli', name: 'Dettagli & Materia' }
  ];

  const filteredGallery = galleryItems.filter(item => {
    if (activeTab === 'all') return true;
    return item.category === activeTab;
  });

  const openLightbox = (id: string) => {
    const index = filteredGallery.findIndex(item => item.id === id);
    if (index !== -1) {
      setLightboxIndex(index);
    }
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextSlide = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return (prev + 1) % filteredGallery.length;
    });
  };

  const prevSlide = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => {
      if (prev === null) return null;
      return prev === 0 ? filteredGallery.length - 1 : prev - 1;
    });
  };

  // Swipe detection for lightbox navigation
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    setTouchEnd(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const deltaX = touchStart.x - touchEnd.x;
    const deltaY = touchStart.y - touchEnd.y;
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleImageLoad = (id: string) => {
    setLoadedImages(prev => new Set(prev).add(id));
  };

  const Skeleton = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-stone-800/40 animate-pulse">
      <svg className="h-8 w-8 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-4-4l4.586-4.586a2 2 0 012.828 0L20 8" />
      </svg>
    </div>
  );

  return (
    <FadeInSection id="galleria" className="py-20 sm:py-24 bg-stone-900 text-white scroll-mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="font-mono text-xs font-bold text-amber-500 uppercase tracking-widest bg-stone-800 px-3 py-1 rounded-full border border-stone-800">
            Un Viaggio Visivo
          </span>
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white mt-4 mb-4">
            Galleria Fotografica
          </h2>
          <p className="font-sans text-stone-400 text-sm sm:text-base leading-relaxed">
            Sfoglia gli scatti rubati alla nostra sala storica e alle preparazioni calde appena sfornate dal forno a legna. 
            Clicca su qualsiasi immagine per ingrandirla.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.code}
              onClick={() => {
                setActiveTab(tab.code);
                closeLightbox();
              }}
              className={`px-4.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 ${
                activeTab === tab.code
                  ? 'bg-amber-600 text-stone-950 shadow-md font-bold'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
              }`}
              id={`gallery-tab-${tab.code}`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Photo Grid with Masonry Aspect Ratio style */}
        <div 
          id="gallery-grid"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          role="group"
          aria-label="Galleria fotografica immagini"
        >
          {filteredGallery.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => openLightbox(item.id)}
              className="group relative rounded-2xl overflow-hidden aspect-4/3 sm:aspect-square bg-stone-950 border border-stone-800/40 cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300"
              id={`gallery-item-${item.id}`}
            >
              {!loadedImages.has(item.id) && <Skeleton />}
              <img
                src={item.src}
                alt={item.alt}
                loading={idx < 4 ? 'eager' : 'lazy'}
                decoding="async"
                onLoad={() => handleImageLoad(item.id)}
                className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${loadedImages.has(item.id) ? 'opacity-100' : 'opacity-0'}`}
                referrerPolicy="no-referrer"
              />
              {/* Hover Dark Vignette and Action Overlay */}
              <div className="absolute inset-0 bg-stone-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 z-10" />
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <div className="p-3 bg-amber-600 rounded-full text-stone-950 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <Maximize2 className="h-5 w-5" />
                </div>
              </div>

              {/* Title Overlay in bottom margin */}
              {item.title && (
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-stone-950 via-stone-950/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                  <h4 className="font-sans font-bold text-sm text-white">{item.title}</h4>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-amber-500 mt-0.5 block">
                    {item.category}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Dynamic Lightbox Modal */}
        {lightboxIndex !== null && (
          <div
            className="fixed inset-0 bg-stone-950/98 backdrop-blur-md z-[100] flex flex-col justify-between p-4 sm:p-6"
            onClick={closeLightbox}
            id="gallery-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Ingrandimento immagine galleria"
          >
            {/* Header / Top controls */}
            <div className="flex justify-between items-center w-full max-w-7xl mx-auto relative z-10">
              <span className="font-mono text-xs text-stone-400">
                Immagine {lightboxIndex + 1} di {filteredGallery.length}
              </span>
              <button
                onClick={closeLightbox}
                className="p-2 rounded-xl bg-stone-900/80 text-white hover:text-amber-500 transition-colors border border-stone-800"
                aria-label="Chiudi gallery lightbox"
                id="lightbox-close-btn"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Main Stage */}
            <div 
              className="relative flex-1 flex items-center justify-center max-w-5xl mx-auto w-full py-4"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Prev Button */}
              <button
                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                className="absolute left-0 sm:-left-16 p-3 rounded-full bg-stone-900/60 hover:bg-stone-800 text-white hover:text-amber-500 transition-colors border border-stone-800 z-10"
                aria-label="Immagine precedente"
                id="lightbox-prev-btn"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* Central Expanded Image Wrapper */}
              <div 
                className="relative max-h-[70vh] max-w-full rounded-2xl overflow-hidden shadow-2xl border border-stone-800 bg-stone-950 flex justify-center items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  ref={lightboxImgRef}
                  src={filteredGallery[lightboxIndex].src}
                  alt={filteredGallery[lightboxIndex].alt}
                  className="max-h-[70vh] object-contain focus:outline-none"
                  tabIndex={-1}
                  draggable={false}
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Next Button */}
              <button
                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                className="absolute right-0 sm:-right-16 p-3 rounded-full bg-stone-900/60 hover:bg-stone-800 text-white hover:text-amber-500 transition-colors border border-stone-800 z-10"
                aria-label="Immagine successiva"
                id="lightbox-next-btn"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Bottom Caption */}
            <div className="text-center w-full max-w-4xl mx-auto pb-4 relative z-10">
              <h3 className="font-sans font-bold text-lg text-white mb-1">
                {filteredGallery[lightboxIndex].title || 'Specialità della Trattoria'}
              </h3>
              <p className="font-sans text-sm text-stone-400 max-w-2xl mx-auto leading-relaxed">
                {filteredGallery[lightboxIndex].alt}
              </p>
            </div>
          </div>
        )}

      </div>
    </FadeInSection>
  );
}
