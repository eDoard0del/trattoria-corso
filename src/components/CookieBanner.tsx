import { useState, useEffect } from 'react';
import { X, Cookie, Shield } from 'lucide-react';

const STORAGE_KEY = 'trattoria_cookie_consent_v1';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem(STORAGE_KEY, 'rejected');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-stone-950 border-t border-stone-800 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-start gap-3 text-stone-300">
            <Cookie className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-sans text-stone-200 mb-1">
                Utilizziamo cookie tecnici strettamente necessari al corretto
                funzionamento del sito. Non ricorriamo ad analytics o cookie di profilazione.
              </p>
              <p className="font-sans text-xs text-stone-500">
                Per informazioni leggi la nostra{' '}
                <a
                  href="/privacy"
                  className="text-amber-500 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Informativa sulla Privacy
                </a>
                .
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap justify-center">
            <button
              onClick={handleReject}
              className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg font-sans text-xs transition-colors border border-stone-700"
            >
              Rifiuta
            </button>
            <button
              onClick={handleAccept}
              className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 rounded-lg font-sans font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Accetta
            </button>
            <button
              onClick={handleAccept}
              className="p-1.5 text-stone-500 hover:text-stone-300 rounded-lg transition-colors"
              aria-label="Chiudi banner cookie"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-stone-500">
          <Shield className="h-3 w-3 text-amber-500" />
          <span>
            I dati non vengono venduti a terzi. Solo cookie tecnici necessari al funzionamento del sito.
          </span>
        </div>
      </div>
    </div>
  );
}