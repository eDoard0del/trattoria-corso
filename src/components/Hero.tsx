import React from 'react';
import { Phone, ArrowRight, Star, Flame, MapPin } from 'lucide-react';
import { IMAGES, RESTAURANT_INFO } from '../data';
import { useScrollTo } from '../hooks/useScrollTo';
import FadeInSection from './ui/FadeInSection';

export default function Hero() {
  const { scrollToSection } = useScrollTo();

  const handleScrollToMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    scrollToSection('#menu');
  };

  return (
    <FadeInSection
      id="home"
      className="relative min-h-[92vh] flex items-center justify-center bg-stone-950 text-white overflow-hidden pt-24 pb-16"
    >
      {/* Background Image with Dark Vignette Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
         <img
           src={IMAGES.interior}
           alt="Interno accogliente Trattoria del Corso Foligno"
           className="w-full h-full object-cover object-center scale-105 animate-[subtle-zoom_20s_ease-out_infinite]"
           loading="eager"
           decoding="async"
           referrerPolicy="no-referrer"
         />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/75 to-stone-950/40 z-10" />
      </div>

      {/* Main Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Rating/Location Badge */}
        <div className="inline-flex items-center gap-2 bg-amber-600/90 backdrop-blur-md text-stone-950 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-amber-400/20 shadow-lg">
          <Flame className="h-3.5 w-3.5 fill-current animate-pulse text-stone-950" />
          <span>Forno a Legna Tradizionale</span>
          <span className="text-stone-950/40 font-light">|</span>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-current" />
            <span>4.8</span>
          </div>
        </div>

        {/* Brand Main Title */}
        <h1 className="font-sans font-extrabold text-4xl sm:text-6xl md:text-7xl tracking-tight leading-[1.1] max-w-5xl mx-auto mb-6">
          La Vera Tradizione <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">
            Cotta a Legna
          </span>{' '}
          a Foligno
        </h1>

        {/* Dynamic Pitch Description */}
        <p className="font-sans text-stone-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          In Corso Cavour 54, riscopri i sapori genuini dell’Umbria. Dai celebri{' '}
          <strong className="text-amber-400 font-semibold">5 Cocci</strong> alla dolcissima{' '}
          <strong className="text-amber-400 font-semibold">Rocciata</strong> medievale, con cotture lente a legna e pasta fresca eccezionale.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-16">
          <button
            onClick={handleScrollToMenu}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-stone-950 px-8 py-4 rounded-xl font-sans font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-xl shadow-amber-600/10 hover:shadow-amber-500/20 hover:scale-[1.02]"
            id="hero-btn-menu"
          >
            <span>Esplora il Menù</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <a
            href={`tel:${RESTAURANT_INFO.phone}`}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-stone-900/90 hover:bg-stone-800 text-stone-100 border border-stone-700 hover:border-stone-500 px-8 py-4 rounded-xl font-sans font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-xl"
            id="hero-btn-call"
          >
            <Phone className="h-4 w-4 fill-current text-amber-500" />
            <span>Chiama per Prenotare</span>
          </a>
        </div>

        {/* Social Proof & Practical Info Bento Strips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto border-t border-stone-800/60 pt-10 text-left">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-stone-900/40 backdrop-blur-sm border border-stone-800/40">
            <div className="p-3 rounded-xl bg-amber-600/10 border border-amber-600/20 text-amber-500">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-stone-100 text-sm">Posizione Centrale</h3>
              <p className="font-sans text-stone-400 text-xs mt-1 leading-relaxed">
                Corso Cavour 54, Foligno (PG). Facile da raggiungere nel cuore della città.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-stone-900/40 backdrop-blur-sm border border-stone-800/40">
            <div className="p-3 rounded-xl bg-amber-600/10 border border-amber-600/20 text-amber-500">
              <Star className="h-6 w-6 fill-current" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-stone-100 text-sm">Prezzo Onesto</h3>
              <p className="font-sans text-stone-400 text-xs mt-1 leading-relaxed">
                Costo medio stimato di {RESTAURANT_INFO.averagePrice}, qualità senza compromessi.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-stone-900/40 backdrop-blur-sm border border-stone-800/40">
            <div className="p-3 rounded-xl bg-amber-600/10 border border-amber-600/20 text-amber-500">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-sans font-bold text-stone-100 text-sm">Forno Sempre Acceso</h3>
              <p className="font-sans text-stone-400 text-xs mt-1 leading-relaxed">
                Ogni secondo, bruschetta e coccio viene cotto tradizionalmente a fiamma viva.
              </p>
            </div>
          </div>
        </div>
      </div>
      </FadeInSection>
  );
}
