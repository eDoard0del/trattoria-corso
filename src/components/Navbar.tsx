import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, UtensilsCrossed, ShieldCheck } from 'lucide-react';
import { RESTAURANT_INFO } from '../data';
import { useData } from '../context/DataContext';
import { useScrollTo } from '../hooks/useScrollTo';

export default function Navbar() {
  const { setIsAdminModalOpen, isAdminLoggedIn } = useData();
  const { scrollToSection } = useScrollTo();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Il Nostro Metodo', href: '#metodo' },
    { name: 'Menù', href: '#menu' },
    { name: 'Galleria', href: '#galleria' },
    { name: 'Contatti', href: '#contatti' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    scrollToSection(href);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-stone-900/95 backdrop-blur-md shadow-md py-3 text-white'
          : 'bg-transparent py-5 text-white'
      }`}
      id="main-navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo Brand */}
          <a
            href="#home"
            onClick={(e) => handleLinkClick(e, '#home')}
            className="flex items-center gap-2 group focus:outline-none"
            id="brand-logo"
          >
            <div className="p-1.5 rounded-lg bg-amber-600 group-hover:bg-amber-500 transition-colors duration-300">
              <UtensilsCrossed className="h-5 w-5 text-stone-900" />
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-extrabold text-lg sm:text-xl tracking-tight leading-none">
                Trattoria del Corso
              </span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-amber-500 font-semibold leading-none mt-1">
                Foligno • Umbria
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`font-sans font-medium text-sm transition-colors duration-300 hover:text-amber-500 ${
                    scrolled ? 'text-stone-300' : 'text-stone-100'
                  }`}
                  id={`nav-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {link.name}
                </a>
              ))}
            </div>

            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="flex items-center gap-1.5 bg-stone-800/80 hover:bg-stone-800 text-stone-200 hover:text-amber-400 px-3 py-1.5 rounded-full font-sans font-medium text-xs border border-stone-700/70 transition-all duration-300"
              title="Area Riservata Gestore"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
              <span>Area Riservata</span>
            </button>

            <a
              href={`tel:${RESTAURANT_INFO.phone}`}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500 text-stone-900 px-4 py-2 rounded-full font-sans font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-md hover:shadow-amber-600/20 hover:scale-105"
              id="desktop-nav-call-to-action"
            >
              <Phone className="h-3 w-3 fill-current" />
              <span>Chiama e Prenota</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-lg text-stone-200 hover:text-amber-500 hover:bg-stone-800/50 transition-colors duration-300"
              aria-label="Toggle navigation menu"
              id="mobile-menu-btn"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden absolute top-full left-0 w-full bg-stone-950/98 backdrop-blur-xl border-b border-stone-800 transition-all duration-300 origin-top ${
          isOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'
        }`}
        id="mobile-navigation-drawer"
      >
        <div className="px-4 py-6 space-y-4">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="font-sans font-medium text-base text-stone-300 hover:text-amber-500 py-2 transition-colors duration-200"
                id={`mobile-nav-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-stone-800 space-y-3">
            <button
              onClick={() => {
                setIsOpen(false);
                setIsAdminModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 bg-stone-800 hover:bg-stone-700 text-amber-400 border border-stone-700 w-full py-2.5 rounded-xl font-sans font-bold text-xs uppercase tracking-wider transition-colors duration-200"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Area Riservata (Gestione)</span>
            </button>

            <a
              href={`tel:${RESTAURANT_INFO.phone}`}
              className="flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-500 text-stone-900 w-full py-3 rounded-xl font-sans font-bold text-sm uppercase tracking-wider transition-colors duration-200 shadow-md"
              id="mobile-nav-call-to-action"
            >
              <Phone className="h-4 w-4 fill-current" />
              <span>Prenota al {RESTAURANT_INFO.phoneFormatted}</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
