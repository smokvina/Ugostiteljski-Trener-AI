import React from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-700 rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-amber-400">O Aplikaciji: Ugostiteljski Trener AI</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        
        <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white prose-strong:text-amber-400">
            <p>
                Ova aplikacija je vaš osobni AI mentor, <strong>"Kolegij Šefova"</strong>, stvoren da vas vodi kroz vještine i znanje predmeta Ugostiteljsko posluživanje. Cilj je izgraditi vrhunskog profesionalca — tehnički savršenog, mentalno otpornog i besprijekornog u stavu.
            </p>

            <h3 className="mt-4">Tko je "Kolegij Šefova"?</h3>
            <p>
                Vaš mentor je združena AI osobnost koja predstavlja sintezu pet stručnjaka iz svijeta elitnog ugostiteljstva, svaki sa svojim fokusom:
            </p>
            <ul>
                <li><strong>Maître d'Hôtel (Šef sale):</strong> Fokusiran na savršenu tehniku, eleganciju i preciznost. (Strog)</li>
                <li><strong>Profesor Strukovnih Predmeta:</strong> Fokusiran na teorijsko znanje i razumijevanje "zašto". (Blag)</li>
                <li><strong>HR Menadžer:</strong> Fokusiran na komunikaciju, prodajne vještine i rješavanje pritužbi. (Blag)</li>
                <li><strong>F&B Menadžer:</strong> Fokusiran na standarde, procedure, higijenu i profitabilnost. (Strog)</li>
                <li><strong>Restorater "Stare Škole":</strong> Fokusiran na disciplinu, radnu etiku i stav "Gost je uvijek na prvom mjestu". (Vrlo strog)</li>
            </ul>

            <h3 className="mt-4">Metodologija Učenja</h3>
            <p>
                Trening se temelji na metodi <strong>"Korak Nazad, Naprijed Dva"</strong>:
            </p>
            <ul>
                <li><strong>Ako odgovorite TOČNO:</strong> Dobivate priznanje i odmah idete dva koraka naprijed — na teže pitanje ili kombinaciju znanja i simulacije.</li>
                <li><strong>Ako odgovorite NETOČNO:</strong> Mentor vas odmah zaustavlja i vraća jedan korak nazad — na apsolutne osnove teme koju niste savladali.</li>
            </ul>
            <p>
                Ovaj dinamičan pristup ("rolerkoster") osigurava da gradite znanje na čvrstim temeljima i da ste uvijek izazvani na odgovarajućoj razini.
            </p>

             <h3 className="mt-4">Kako koristiti aplikaciju?</h3>
            <ul>
                <li>Odgovarajte na zadatke koje vam "Kolegij Šefova" postavlja.</li>
                <li>Koristite gumb za <strong>generiranje slike</strong> (ikona slike) kako biste vizualizirali koncepte poput postavljanja stola.</li>
                <li>Koristite <strong>ikone palac gore/dolje</strong> ispod odgovora mentora kako biste ocijenili korisnost odgovora.</li>
                <li>Vaš napredak se <strong>automatski sprema</strong>, pa možete nastaviti s vježbom bilo kada.</li>
            </ul>
        </div>
        
        <div className="flex justify-end mt-6">
           <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-600 text-white font-semibold rounded-md hover:bg-amber-500 transition"
          >
            Zatvori
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
