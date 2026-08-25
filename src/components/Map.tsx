import { useEffect, useRef, useState } from 'react';
import { RESTAURANT_INFO } from '../data';
import { MapPin, Navigation, Eye } from 'lucide-react';
import ErrorBoundary from './ErrorBoundary';

declare global {
  interface Window {
    L: any;
  }
}

export default function Map() {
  return (
    <ErrorBoundary
      fallback={
        <div className="flex flex-col items-center justify-center h-[450px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl border border-slate-200 text-center p-6">
          <MapPin className="h-12 w-12 text-stone-400 mb-3" />
          <h4 className="font-bold text-stone-700 mb-1">Mappa non disponibile</h4>
          <p className="text-stone-500 text-sm">
            Trovaci in Corso Cavour, 54, Foligno (PG)
          </p>
        </div>
      }
    >
      <MapContent />
    </ErrorBoundary>
  );
}

function MapContent() {  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Check if Leaflet is already loaded
    if (window.L) {
      if (isMounted) setLeafletLoaded(true);
      return;
    }

    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.id = 'leaflet-css';
    document.head.appendChild(link);

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.id = 'leaflet-js';
    script.onload = () => {
      if (isMounted) setLeafletLoaded(true);
    };
    script.onerror = () => {
      if (isMounted) setLoadError(true);
    };
    document.head.appendChild(script);

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!leafletLoaded || !mapContainerRef.current || mapInstanceRef.current) return;

    try {
      const L = window.L;
      const { lat, lng } = RESTAURANT_INFO.coordinates;

      // Initialize map instance
      const map = L.map(mapContainerRef.current, {
        scrollWheelZoom: false,
        zoomControl: true,
      }).setView([lat, lng], 17);

      mapInstanceRef.current = map;

      // Use a warm, premium cream-and-slate tile layer (CartoDB Voyager)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      // Create a custom modern red-accent pin using standard Leaflet DivIcon
      const customIcon = L.divIcon({
        html: `
          <div class="relative flex items-center justify-center">
            <span class="absolute inline-flex h-8 w-8 animate-ping rounded-full bg-amber-500 opacity-40"></span>
            <div class="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-amber-700 shadow-lg text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
          </div>
        `,
        className: 'custom-leaflet-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      // Add marker to map
      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      // Add customized elegant popup
      const popupContent = `
        <div class="p-2 font-sans">
          <h4 class="font-bold text-slate-900 text-sm mb-1">${RESTAURANT_INFO.name}</h4>
          <p class="text-xs text-slate-600 mb-2 leading-relaxed">Corso Cavour, 54 - Foligno</p>
          <a href="tel:${RESTAURANT_INFO.phone}" class="inline-flex items-center text-xs font-semibold text-amber-700 hover:underline">
            📞 ${RESTAURANT_INFO.phoneFormatted}
          </a>
        </div>
      `;
      marker.bindPopup(popupContent).openPopup();
    } catch (e) {
      console.error('Error initializing map:', e);
    }

    return () => {
      // Clean up map instance on component unmount to prevent container re-initialization errors
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [leafletLoaded]);

  return (
    <div className="relative w-full h-[450px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl border border-slate-200">
      {/* Background loading fallback */}
      {!leafletLoaded && !loadError && (
        <div className="absolute inset-0 bg-stone-100 flex flex-col items-center justify-center z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-700 border-t-transparent mb-4"></div>
          <p className="text-stone-500 font-sans text-sm font-medium">Caricamento mappa interattiva...</p>
        </div>
      )}

      {loadError && (
        <div className="absolute inset-0 bg-stone-100 flex flex-col items-center justify-center z-10 p-6 text-center">
          <MapPin className="h-12 w-12 text-stone-400 mb-3" />
          <h4 className="font-bold text-stone-700 mb-1">Mappa temporaneamente non disponibile</h4>
          <p className="text-stone-500 text-sm max-w-sm mb-4">
            Non siamo riusciti a caricare la mappa interattiva. Puoi comunque trovarci in Corso Cavour, 54, Foligno.
          </p>
        </div>
      )}

      {/* Map Target Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0" id="trattoria-map" />

      {/* Floating Directions Action Button */}
      <div className="absolute bottom-5 right-5 z-[400]">
        <a
          href={RESTAURANT_INFO.googleMapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-stone-900 text-white hover:bg-amber-700 px-5 py-3 rounded-full text-sm font-semibold shadow-lg transition-colors duration-300"
          id="btn-map-directions"
        >
          <Navigation className="h-4 w-4" />
          <span>Ottieni Indicazioni</span>
        </a>
      </div>
    </div>
  );
}
