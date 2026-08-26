import { Flame, Droplet, Wine, Sparkles } from 'lucide-react';
import { RESTAURANT_INFO } from '../data';
import FadeInSection from './ui/FadeInSection';

export default function Features() {
  return (
    <FadeInSection id="metodo" className="py-20 sm:py-24 bg-stone-50 text-stone-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="font-mono text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full">
            La Nostra Filosofia
          </span>
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-stone-900 mt-4 mb-6">
            La Brace Arde, <br className="sm:hidden" /> Il Bollitore Sfrigola
          </h2>
          <p className="font-sans text-stone-600 text-base sm:text-lg leading-relaxed">
            Alla <strong className="text-stone-900 font-semibold">Trattoria del Corso</strong>, la cucina rispetta i tempi e i rituali della tradizione umbra. 
            Abbiamo bandito la fretta: ogni ingrediente trova il suo perfetto elemento di cottura.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12">
          
          {/* Card 1: Forno a Legna */}
          <div 
            className="flex flex-col h-full bg-white rounded-2xl p-8 shadow-md border border-stone-100 hover:shadow-xl hover:border-amber-500/20 transition-all duration-300 relative overflow-hidden group"
            id="feature-card-forno"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full transition-all duration-300 group-hover:scale-110" />
            
            <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-amber-600/10 text-amber-600 mb-6 group-hover:bg-amber-600 group-hover:text-stone-900 transition-colors duration-300">
              <Flame className="h-7 w-7" />
            </div>
            
            <h3 className="font-sans font-bold text-xl text-stone-800 mb-4 flex items-center gap-2">
              <span>{RESTAURANT_INFO.features.cookingType}</span>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-600" />
            </h3>
            
            <p className="font-sans text-stone-700 text-base leading-relaxed mb-6 flex-1">
              {RESTAURANT_INFO.features.cookingDetail}
            </p>

            <div className="mt-auto pt-4 border-t border-stone-50 flex items-center gap-2 font-mono text-xs text-amber-700 font-bold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Sapore rustico, cottura lenta</span>
            </div>
          </div>

          {/* Card 2: Bollitore della Pasta */}
          <div 
            className="flex flex-col h-full bg-white rounded-2xl p-8 shadow-md border border-stone-100 hover:shadow-xl hover:border-amber-500/20 transition-all duration-300 relative overflow-hidden group"
            id="feature-card-pasta"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full transition-all duration-300 group-hover:scale-110" />
            
            <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-amber-600/10 text-amber-600 mb-6 group-hover:bg-amber-600 group-hover:text-stone-900 transition-colors duration-300">
              <Droplet className="h-7 w-7" />
            </div>
            
            <h3 className="font-sans font-bold text-xl text-stone-800 mb-4 flex items-center gap-2">
              <span>La Pasta sul Bollitore</span>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-600" />
            </h3>
            
            <p className="font-sans text-stone-700 text-base leading-relaxed mb-6 flex-1">
              La pasta è un'arte sacra che richiede precisione al secondo. Mentre la brace cuoce lentamente le carni, la nostra pasta fresca viene curata e mantenuta sul bollitore dedicato, garantendo un'idratazione ottimale e un grado di cottura sempre al dente, pronto ad abbracciare i sughi ricchi di lepre, porcina o Norcina.
            </p>

            <div className="mt-auto pt-4 border-t border-stone-50 flex items-center gap-2 font-mono text-xs text-amber-700 font-bold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Cottura al dente artigianale</span>
            </div>
          </div>

          {/* Card 3: La Cantina */}
          <div 
            className="flex flex-col h-full bg-white rounded-2xl p-8 shadow-md border border-stone-100 hover:shadow-xl hover:border-amber-500/20 transition-all duration-300 relative overflow-hidden group"
            id="feature-card-vini"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full transition-all duration-300 group-hover:scale-110" />
            
            <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-amber-600/10 text-amber-600 mb-6 group-hover:bg-amber-600 group-hover:text-stone-900 transition-colors duration-300">
              <Wine className="h-7 w-7" />
            </div>
            
            <h3 className="font-sans font-bold text-xl text-stone-800 mb-4 flex items-center gap-2">
              <span>La Cantina</span>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-600" />
            </h3>
            
            <p className="font-sans text-stone-700 text-base leading-relaxed mb-6 flex-1">
              La nostra cantina è un viaggio tra le migliori etichette italiane: dai nobili rossi umbri come il Sagrantino di Montefalco, ai grandi vini toscani, sardi, veneti, friulani, piemontesi e lombardi. Ogni bottiglia è selezionata per esaltare al meglio le nostre carni cotte a legna e i sapori decisi della cucina tradizionale.
            </p>

            <div className="mt-auto pt-4 border-t border-stone-50 flex flex-wrap items-center gap-2 font-mono text-xs text-amber-700 font-bold">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Umbria • Toscana • Sardegna • Veneto • Friuli • Piemonte • Lombardia</span>
            </div>
          </div>

        </div>

        {/* Localized Territory Infobox */}
        <div className="mt-16 sm:mt-24 rounded-3xl bg-stone-900 text-white p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-12 translate-y-12 scale-125">
            <Flame className="w-96 h-96" />
          </div>
          
          <div className="relative z-10 max-w-3xl">
            <span className="font-mono text-xs font-semibold text-amber-500 uppercase tracking-widest">
              L'Arte dell'Accoglienza
            </span>
            <h3 className="font-sans font-bold text-2xl sm:text-3xl text-white mt-2 mb-4">
              Un'esperienza conviviale, ad un prezzo autentico
            </h3>
            <p className="font-sans text-stone-300 text-sm sm:text-base leading-relaxed mb-6">
              Crediamo che il buon cibo debba unire e non dividere. Per questo manteniamo una filosofia di prezzi accessibili, con una spesa media votata dai nostri ospiti tra i <strong className="text-white font-semibold">20 e i 30 € a persona</strong>. Questo ci permette di offrire prodotti sani del territorio umbro a chiunque desideri sedersi alla nostra tavola su Corso Cavour.
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-mono font-bold text-stone-100">
              <div className="bg-stone-800 border border-stone-700 px-3.5 py-1.5 rounded-lg flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                <span>Nessun costo di coperto gonfiato</span>
              </div>
              <div className="bg-stone-800 border border-stone-700 px-3.5 py-1.5 rounded-lg flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                <span>Ingredienti di produttori di Foligno</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </FadeInSection>
  );
}