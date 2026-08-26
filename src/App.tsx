import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import AdminModal from './components/AdminModal';
import BackToTop from './components/BackToTop';
import CookieBanner from './components/CookieBanner';
import SEO from './components/SEO';

export default function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <div className="bg-stone-50 min-h-screen text-stone-900 selection:bg-amber-600 selection:text-stone-950 flex flex-col font-sans">
          <SEO />
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/galleria" element={<Gallery />} />
              <Route path="/contatti" element={<Contact />} />
              <Route path="/privacy" element={<Privacy />} />
            </Routes>
          </main>
          <Footer />
          <AdminModal />
          <BackToTop />
          <CookieBanner />
        </div>
      </BrowserRouter>
    </DataProvider>
  );
}
