import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { useScrollTo } from '../hooks/useScrollTo';

export default function BackToTop() {
  const { scrollToTop } = useScrollTo();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  if (!isVisible) return null;

  return (
    <button
      onClick={() => scrollToTop({ behavior: 'smooth' })}
      aria-label="Torna in cima"
      title="Torna in cima"
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-12 h-12 rounded-full bg-amber-600 hover:bg-amber-500 text-stone-900 shadow-xl shadow-amber-600/20 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
      id="back-to-top-btn"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
