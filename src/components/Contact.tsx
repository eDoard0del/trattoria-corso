import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { RESTAURANT_INFO } from '../data';
import { Phone, MapPin, Clock, Calendar, Check, Send, Lock, MessageCircle } from 'lucide-react';
import Map from './Map';
import FadeInSection from './ui/FadeInSection';

export default function Contact() {
  const { openingHours, setIsAdminModalOpen } = useData();
  const [openStatus, setOpenStatus] = useState<{ isOpen: boolean; text: string; subtext?: string }>({
    isOpen: false,
    text: 'Calcolo stato...',
  });

  // Calculate if the restaurant is currently open in Italian timezone (or local browser fallback)
  useEffect(() => {
    // Se openingHours non è ancora caricato, esci
    if (!openingHours || openingHours.length === 0) {
      setOpenStatus({ isOpen: false, text: 'Caricamento orari...' });
      return;
    }

    const checkOpenStatus = () => {
      const now = new Date();
      const currentDay = now.getDay(); // 0 is Sunday, 1 is Monday...
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTotalMinutes = currentHours * 60 + currentMinutes;

      // Find schedule for today
      const todaySchedule = openingHours.find(h => h.dayCode === currentDay);
      if (!todaySchedule || todaySchedule.isClosed) {
        setOpenStatus({ isOpen: false, text: 'Chiuso Ora', subtext: 'Oggi riposo settimanale' });
        return;
      }

      const parseTimeToMinutes = (timeStr: string) => {
        if (!timeStr) return 0;
        const [h, m] = timeStr.split(':').map(Number);
        return h * 60 + m;
      };

      let isOpen = false;
      let text = 'Chiuso Ora';
      let subtext = '';

      // Check lunch
      if (todaySchedule.lunch) {
        const lunchOpenMin = parseTimeToMinutes(todaySchedule.lunch.open);
        const lunchCloseMin = parseTimeToMinutes(todaySchedule.lunch.close);

        if (currentTotalMinutes >= lunchOpenMin && currentTotalMinutes < lunchCloseMin) {
          isOpen = true;
          text = 'Aperto Ora';
          subtext = `Pranzo • Chiude alle ${todaySchedule.lunch.close}`;
        }
      }

      // Check dinner
      if (todaySchedule.dinner) {
        const dinnerOpenMin = parseTimeToMinutes(todaySchedule.dinner.open);
        const dinnerCloseMin = parseTimeToMinutes(todaySchedule.dinner.close);

        if (currentTotalMinutes >= dinnerOpenMin && currentTotalMinutes < dinnerCloseMin) {
          isOpen = true;
          text = 'Aperto Ora';
          subtext = `Cena • Chiude alle ${todaySchedule.dinner.close}`;
        }
      }

      if (!isOpen) {
        // If closed, let's find the next opening session today or tomorrow
        if (todaySchedule.dinner) {
          const dinnerOpenMin = parseTimeToMinutes(todaySchedule.dinner.open);
          if (currentTotalMinutes < dinnerOpenMin) {
            text = 'Chiuso Ora';
            subtext = `Apre stasera alle ${todaySchedule.dinner.open}`;
            setOpenStatus({ isOpen, text, subtext });
            return;
          }
        }
        
        // Find tomorrow's opening
        const tomorrowDay = (currentDay + 1) % 7;
        const tomorrowSchedule = openingHours.find(h => h.dayCode === tomorrowDay);
        if (tomorrowSchedule) {
          if (tomorrowSchedule.lunch) {
            subtext = `Apre domani alle ${tomorrowSchedule.lunch.open}`;
          } else if (tomorrowSchedule.dinner) {
            subtext = `Apre domani alle ${tomorrowSchedule.dinner.open}`;
          } else {
            subtext = 'Ci vediamo presto!';
          }
        }
      }

      setOpenStatus({ isOpen, text, subtext });
    };

    checkOpenStatus();
    // Refresh status check every 60 seconds
    const interval = setInterval(checkOpenStatus, 60000);
    return () => clearInterval(interval);
  }, [openingHours]);

  return (
    <FadeInSection id="contatti" className="py-20 sm:py-24 bg-stone-100 text-stone-900 scroll-mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full">
            Tavolo & Contatti
          </span>
          <h2 className="font-sans font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-stone-900 mt-4 mb-4">
            Vieni a Trovarci
          </h2>
          <p className="font-sans text-stone-600 text-sm sm:text-base leading-relaxed">
            Siamo nel cuore pulsante di Foligno su Corso Cavour. Per assicurarvi un tavolo vicino alla brace del nostro forno a legna, vi consigliamo vivamente la prenotazione telefonica.
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mb-16">
          
          {/* Column Left: Contact Details and Hours (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Phone Call-to-Action Card */}
            <div className="bg-stone-900 text-white rounded-2xl p-6 shadow-lg border border-stone-800 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-24 h-24 bg-amber-500/10 rounded-bl-full" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-amber-500 font-bold block mb-1">
                Prenotazione Diretta
              </span>
              <h3 className="font-sans font-bold text-lg mb-4">Prenota per Telefono</h3>
              <p className="font-sans text-stone-300 text-xs sm:text-sm leading-relaxed mb-6">
                Attualmente non utilizziamo database o sistemi digitali per mantenere i prezzi accessibili e genuini. Chiamaci ora per concordare il tuo tavolo in un attimo.
              </p>
              <a
                href={`tel:${RESTAURANT_INFO.phone}`}
                className="flex-1 flex items-center justify-center gap-3 bg-amber-600 hover:bg-amber-500 text-stone-950 font-sans font-bold py-3.5 px-6 rounded-xl text-sm uppercase tracking-wide transition-all duration-300 shadow-md shadow-amber-600/10 hover:scale-[1.02]"
                id="btn-contacts-call-reserve"
              >
                <Phone className="h-4 w-4 fill-current text-stone-950" />
                <span>Chiama: {RESTAURANT_INFO.phoneFormatted}</span>
              </a>

              <a
                href={RESTAURANT_INFO.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 text-white font-sans font-bold py-3.5 px-6 rounded-xl text-sm uppercase tracking-wide transition-all duration-300 shadow-md shadow-green-600/10 hover:scale-[1.02]"
                id="btn-contacts-whatsapp"
                aria-label="Prenota via WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Address & Real-time Status Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200/60 space-y-5">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-stone-100 rounded-xl text-amber-700 shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-sans font-bold text-sm text-stone-900">Il Nostro Indirizzo</h4>
                  <p className="font-sans text-stone-600 text-xs sm:text-sm mt-1 leading-relaxed">
                    {RESTAURANT_INFO.address}
                  </p>
                </div>
              </div>

              {/* Dynamic Status Badge */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${openStatus.isOpen ? 'bg-green-600 animate-pulse' : 'bg-stone-400'}`} />
                  <span className="font-sans font-bold text-sm text-stone-800">
                    {openStatus.text}
                  </span>
                </div>
                {openStatus.subtext && (
                  <span className="font-mono text-xs text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full font-bold">
                    {openStatus.subtext}
                  </span>
                )}
              </div>
            </div>

            {/* Schedule Accordion Card - CHIAVI UNICHE GARANTITE */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200/60">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-amber-700 shrink-0" />
                  <h4 className="font-sans font-bold text-sm text-stone-900">Orari Settimanali</h4>
                </div>
                <button
                  onClick={() => setIsAdminModalOpen(true)}
                  className="text-[11px] font-sans font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <Lock className="h-3 w-3" />
                  <span>Modifica Orari</span>
                </button>
              </div>
              
              <div className="space-y-2.5 font-sans text-xs sm:text-sm text-stone-600">
                {openingHours && openingHours.length > 0 ? (
                  openingHours.map((sched, index) => {
                    const todayIndex = new Date().getDay();
                    const isToday = sched?.dayCode === todayIndex;
                    const dayName = sched?.dayName || 'Giorno';
                    // CHIAVE UNICA: usa dayCode se disponibile, altrimenti l'indice
                    const uniqueKey = sched?.dayCode !== undefined 
                      ? `day-${sched.dayCode}` 
                      : `day-index-${index}`;
                    // ID unico per l'elemento DOM
                    const elementId = sched?.dayCode !== undefined
                      ? `schedule-day-${sched.dayCode}`
                      : `schedule-day-${index}`;
                    
                    return (
                      <div
                        key={uniqueKey}
                        className={`flex justify-between items-center py-1 px-2 rounded-lg transition-colors ${
                          isToday ? 'bg-amber-100/60 font-semibold text-stone-900 border border-amber-500/10' : ''
                        }`}
                        id={elementId}
                      >
                        <span className="flex items-center gap-1.5">
                          {dayName}
                          {isToday && <span className="text-[9px] uppercase font-mono tracking-widest bg-amber-600 text-stone-950 px-1 py-0.2 rounded font-bold">Oggi</span>}
                        </span>
                        <span>
                          {sched?.isClosed ? (
                            <span className="text-stone-400">Chiuso</span>
                          ) : (
                            <span className="font-mono">
                              {sched?.lunch ? `${sched.lunch.open}-${sched.lunch.close}` : ''}
                              {sched?.lunch && sched?.dinner ? ' e ' : ''}
                              {sched?.dinner ? `${sched.dinner.open}-${sched.dinner.close}` : ''}
                            </span>
                          )}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-stone-500 text-sm py-2 text-center">Caricamento orari...</p>
                )}
              </div>
            </div>

          </div>

          {/* Column Right: Map component embedding (7 Cols) */}
          <div className="lg:col-span-7">
            <Map />
          </div>

        </div>

      </div>
    </FadeInSection>
  );
}