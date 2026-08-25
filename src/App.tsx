import { useEffect } from 'react';
import { DataProvider } from './context/DataContext';
import { useScrollTo } from './hooks/useScrollTo';
import SEO from './components/SEO';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Menu from './components/Menu';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminModal from './components/AdminModal';
import BackToTop from './components/BackToTop';
import CookieBanner from './components/CookieBanner';
import PrivacyPolicy from './components/PrivacyPolicy';

export default function App() {
  const { scrollToSection } = useScrollTo();
  const isPrivacyPage = window.location.pathname === '/privacy';

  // Simple check to handle safe browser scroll triggers if deep linked
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        scrollToSection(hash, { offset: 80 });
      }, 500);
    }
  }, [scrollToSection]);

  if (isPrivacyPage) {
    return (
      <DataProvider>
        <PrivacyPolicy />
      </DataProvider>
    );
  }

  return (
    <DataProvider>
      <div className="bg-stone-50 min-h-screen text-stone-900 selection:bg-amber-600 selection:text-stone-950 flex flex-col font-sans">
        {/* 1. SEO Tag & JSON-LD schema.org Injection */}
        <SEO />

        {/* 2. Responsive Sticky Header/Nav */}
        <Navbar />

        {/* 3. Main Content Container */}
        <main className="flex-1" id="main-content">
          {/* Hero Section */}
          <Hero />

          {/* Brand Method & Local Context */}
          <Features />

          {/* Dynamic Interactive Menu */}
          <Menu />

          {/* Lightbox Photo Gallery */}
          <Gallery />

          {/* Contacts, Real-time Status & Interactive Map */}
          <Contact />
        </main>

        {/* 4. Official Footer */}
        <Footer />

        {/* 5. Reserved Area Management Modal */}
        <AdminModal />

        {/* 6. Back to Top Button */}
        <BackToTop />

        {/* 7. Cookie Consent Banner */}
        <CookieBanner />
      </div>
    </DataProvider>
  );
}
