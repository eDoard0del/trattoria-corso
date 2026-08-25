import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import FadeInSection from './ui/FadeInSection';

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = 'Privacy Policy - Trattoria del Corso';
  }, []);

  return (
    <FadeInSection className="py-12 sm:py-16 bg-white text-stone-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-600 mb-6 font-sans text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Torna al sito
        </a>

        <h1 className="font-sans font-extrabold text-3xl sm:text-4xl text-stone-900 mb-8">
          Informativa sulla Privacy
        </h1>

        <div className="prose prose-stone prose-sm sm:prose-base max-w-none">
          <p className="font-sans text-stone-600 leading-relaxed">
            <strong>Data controller:</strong><br />
            Trattoria del Corso<br />
            Corso Cavour, 54 - 06034 Foligno (PG), Italia<br />
            Email: info@trattoriadelcorso.it<br />
            Tel: +39 0742 97033
          </p>

          <h2 className="font-sans font-bold text-xl text-stone-900 mt-8">Tipi di dati personali raccolti</h2>
          <p>
            Il sito raccoglie i seguenti tipi di dati:
          </p>
          <ul>
            <li><strong>Dati di navigazione:</strong> indirizzo IP, nome dominio, tipo di browser, sistema operativo, pagina di provenienza.</li>
            <li><strong>Dati forniti volontariamente:</strong> nome, email e messaggio inviati tramite formula di contatto.</li>
          </ul>

          <h2 className="font-sans font-bold text-xl text-stone-900 mt-8">Cookie tecnici</h2>
          <p>
            Il sito utilizza esclusivamente cookie tecnici strettamente necessari al funzionamento:
          </p>
          <ul>
            <li><strong>cookie di sessione:</strong> per mantenere lo stato dell'admin panel (non persistenti).</li>
            <li><strong>cookie di preferenza:</strong> per ricordare il consenso ai cookie (durata 12 mesi).</li>
          </ul>

          <h2 className="font-sans font-bold text-xl text-stone-900 mt-8">Cookie analytics</h2>
          <p>
            Il sito <strong>non utilizza</strong> Google Analytics, Facebook Pixel o altri strumenti di tracciamento basati su cookie di profilazione. Nessun dato è condiviso con terzi per scopi pubblicitari.
          </p>

          <h2 className="font-sans font-bold text-xl text-stone-900 mt-8">Diritti degli interessati</h2>
          <p>
            In qualità di interessato, hai diritto di:
          </p>
          <ul>
            <li>Accedere ai tuoi dati personali</li>
            <li>Rettificare dati inesatti</li>
            <li>Richiedere la cancellazione</li>
            <li>Limitare il trattamento</li>
            <li>Opporsi al trattamento</li>
            <li>Esercitare il diritto alla portabilità dei dati</li>
          </ul>
          <p>
            Per esercitare questi diritti, contatta: <strong>info@trattoriadelcorso.it</strong>
          </p>

          <h2 className="font-sans font-bold text-xl text-stone-900 mt-8">Misure di sicurezza</h2>
          <p>
            I dati vengono conservati in forma digitale limitata al tempo strettamente necessario e protetti da misure tecniche e organizzative adeguate.
          </p>

          <h2 className="font-sans font-bold text-xl text-stone-900 mt-8">Contatti</h2>
          <p>
            Per qualsiasi informazione sulla privacy: <strong>info@trattoriadelcorso.it</strong>
          </p>

          <p className="font-sans text-xs text-stone-500 mt-12">
            Ultimo aggiornamento: 22 Agosto 2026
          </p>
        </div>
      </div>
    </FadeInSection>
  );
}
