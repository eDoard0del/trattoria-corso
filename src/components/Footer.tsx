import React from 'react';
import { UtensilsCrossed, Phone, MapPin, Heart, ShieldCheck } from 'lucide-react';
import { RESTAURANT_INFO } from '../data';
import { useData } from '../context/DataContext';
import { useScrollTo } from '../hooks/useScrollTo';

export default function Footer() {
  const { setIsAdminModalOpen } = useData();
  const { scrollToSection } = useScrollTo();
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    scrollToSection(href);
  };

  return (
    <footer className="bg-stone-950 text-stone-400 py-12 border-t border-stone-800" id="main-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Col 1: Brand details */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <div className="p-1.5 rounded-lg bg-amber-600">
                <UtensilsCrossed className="h-4 w-4 text-stone-900" />
              </div>
              <span className="font-sans font-extrabold text-lg tracking-tight">
                Trattoria del Corso
              </span>
            </div>
            <p className="font-sans text-xs leading-relaxed text-stone-400">
              {RESTAURANT_INFO.description}
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4 md:pl-8">
            <h4 className="font-sans font-bold text-sm text-white uppercase tracking-wider">
              Navigazione
            </h4>
            <ul className="space-y-2 text-xs font-sans">
              <li>
                <a
                  href="#home"
                  onClick={(e) => handleLinkClick(e, '#home')}
                  className="hover:text-amber-500 transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#metodo"
                  onClick={(e) => handleLinkClick(e, '#metodo')}
                  className="hover:text-amber-500 transition-colors"
                >
                  Il Nostro Metodo
                </a>
              </li>
              <li>
                <a
                  href="#menu"
                  onClick={(e) => handleLinkClick(e, '#menu')}
                  className="hover:text-amber-500 transition-colors"
                >
                  Menù
                </a>
              </li>
              <li>
                <a
                  href="#galleria"
                  onClick={(e) => handleLinkClick(e, '#galleria')}
                  className="hover:text-amber-500 transition-colors"
                >
                  Galleria
                </a>
              </li>
              <li>
                <a
                  href="#contatti"
                  onClick={(e) => handleLinkClick(e, '#contatti')}
                  className="hover:text-amber-500 transition-colors"
                >
                  Dove Trovarci
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contacts */}
          <div className="space-y-4">
            <h4 className="font-sans font-bold text-sm text-white uppercase tracking-wider">
              Trattoria del Corso
            </h4>
            <ul className="space-y-2.5 text-xs font-sans">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span>{RESTAURANT_INFO.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-amber-500 shrink-0" />
                <a href={`tel:${RESTAURANT_INFO.phone}`} className="hover:text-white transition-colors">
                  {RESTAURANT_INFO.phoneFormatted}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-center">
          <p className="text-[11px] font-sans text-stone-500">
            &copy; {currentYear} {RESTAURANT_INFO.name}. Tutti i diritti riservati.
          </p>

          <button
            onClick={() => setIsAdminModalOpen(true)}
            className="text-[11px] font-sans text-stone-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
            <span>Area Riservata Gestore</span>
          </button>

          <p className="text-[11px] font-sans text-stone-500 flex items-center gap-1 justify-center">
            <span>Cucina tipica di Foligno realizzata con</span>
            <Heart className="h-3 w-3 text-red-600 fill-current" />
            <span>in Umbria</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
