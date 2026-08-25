import { Star, ExternalLink } from 'lucide-react';
import FadeInSection from './ui/FadeInSection';

export default function Reviews() {
  return (
    <FadeInSection
      id="recensioni"
      className="py-20 sm:py-24 bg-stone-50 text-stone-900 scroll-mt-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="font-mono text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full">
            Lasciaci unfeedback
          </span>
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-stone-900 mt-4 mb-4">
            Recensioni della Trattoria
          </h2>
          <p className="font-sans text-stone-600 text-sm sm:text-base leading-relaxed">
            Ti invitiamo a lasciarci una recensione sui nostri canali ufficiali.
            Il tuo giudizio aiuta altri appassionati di cucina a
            trovare il posto giusto per gustare la cucina umbra autentica.
          </p>
        </div>

        {/* External Review Links */}
        <div className="flex justify-center gap-6 flex-wrap">
          <a
            href="https://maps.google.com/maps/place/Trattoria+del+Corso+Foligno"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white border border-stone-200 px-6 py-3 rounded-xl text-sm font-semibold text-stone-700 hover:border-amber-600 hover:text-amber-700 transition-all duration-200"
            id="review-google-link"
          >
            <Star className="h-5 w-5 fill-current text-amber-500" />
            Recensisci su Google
            <ExternalLink className="h-4 w-4 text-stone-400" />
          </a>
          <a
            href="https://www.tripadvisor.it/Restaurant_Review-Trattoria_del_Corso-Foligno-Umbria.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white border border-stone-200 px-6 py-3 rounded-xl text-sm font-semibold text-stone-700 hover:border-amber-600 hover:text-amber-700 transition-all duration-200"
            id="review-tripadvisor-link"
          >
            Recensisci su TripAdvisor
            <ExternalLink className="h-4 w-4 text-stone-400" />
          </a>
        </div>
      </div>
    </FadeInSection>
  );
}
