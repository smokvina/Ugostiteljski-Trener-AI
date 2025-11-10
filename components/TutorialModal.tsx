import React from 'react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-700 rounded-lg shadow-xl p-6 w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-amber-400 mb-4">Dobrodošli u Ugostiteljski Trener AI!</h2>
        <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-strong:text-white">
          <p>
            Spremni ste postati vrhunski ugostiteljski profesionalac? Vaš mentor, <strong>"Kolegij Šefova"</strong>, čeka.
          </p>
          <p>
            On će vas voditi kroz zadatke i simulacije. Vaš cilj je odgovoriti točno kako biste napredovali na teže izazove. Ako pogriješite, vraćate se na osnove.
          </p>
          <p>
            Ovo je vaš put do savršenstva. Jeste li spremni za prvi zadatak?
          </p>
        </div>
        <div className="flex justify-end mt-6">
           <button
            onClick={onClose}
            className="px-6 py-2 bg-amber-600 text-white font-semibold rounded-md hover:bg-amber-500 transition text-lg"
          >
            Spreman sam!
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorialModal;
