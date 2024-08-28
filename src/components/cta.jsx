import React from 'react';
import { FaMapMarkedAlt, FaStar, FaUserCheck, FaEye } from 'react-icons/fa';

const Cta3 = () => {
  return (
    <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20">
      {/* Header Section with Updated Title Styling */}
      <div className="grid grid-cols-1 pb-6 text-center animate-fadeIn">
        <h1 className="font-bold text-4xl lg:text-5xl leading-tight mb-4 transition-transform transform hover:scale-105 hover:text-blue-700">
          Trouvez votre prochain <span className="text-blue-600">logement</span>
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto mb-4 transition-opacity duration-500 hover:opacity-80">
          Avec plus d'un million de locations disponibles, il est facile de trouver ce qui vous convient le mieux.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className="max-w-xl pr-16 mx-auto mb-10 animate-slideInLeft">
          <h5 className="mb-6 text-2xl font-extrabold leading-none transition-transform transform hover:scale-105">
            Pourquoi réserver avec Immocean ?
          </h5>
          <p className="mb-6 text-gray-900 animate-fadeIn">
            Immocean vous offre une expertise locale et un service personnalisé
            pour simplifier votre recherche immobilière. Découvrez des solutions
            sur mesure et bénéficiez d’un accompagnement professionnel dédié.
            Faites le choix d’une expérience fluide et sereine avec Immocean pour réaliser
            votre projet immobilier en toute confiance.
          </p>
          <div className="flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center h-12 px-6 mr-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-blue-600 hover:bg-blue-700 focus:shadow-outline focus:outline-none transform hover:scale-105"
            >
              Découvrez Maintenant
            </button>
            <a
              href="/"
              aria-label="Learn more"
              className="inline-flex items-center font-semibold transition-colors duration-200 text-blue-600 hover:text-blue-800 transform hover:scale-105"
            >
              Plus De Détails
            </a>
          </div>
        </div>
        <div className="grid gap-5 row-gap-5 sm:grid-cols-2">
          <div className="max-w-md animate-slideInUp">
            <div className='flex items-center'>
              <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-indigo-50 transition-transform transform hover:scale-125">
                <FaMapMarkedAlt className="w-10 h-10 text-blue-600" />
              </div>
              <h6 className="mb-2 ml-4 text-lg font-bold leading-5">Expertise locale</h6>
            </div>
            <p className="text-sm text-gray-700 inline-flex items-center justify-center">
              Nos agents connaissent parfaitement le marché local pour vous offrir des conseils avisés.
            </p>
          </div>
          <div className="max-w-md animate-slideInUp">
            <div className='flex items-center'>
              <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-indigo-50 transition-transform transform hover:scale-125">
                <FaStar className="w-10 h-10 text-blue-600" />
              </div>
              <h6 className="mb-2 ml-4 text-lg font-bold leading-5">Sélection de qualité</h6>
            </div>
            <p className="text-sm text-gray-700">
              Nous choisissons des propriétés répondant à des critères stricts pour vous garantir des biens de qualité.
            </p>
          </div>
          <div className="max-w-md animate-slideInUp">
            <div className='flex items-center'>
              <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-indigo-50 transition-transform transform hover:scale-125">
                <FaUserCheck className="w-10 h-10 text-blue-600" />
              </div>
              <h6 className="mb-2 ml-4 text-lg font-bold leading-5">Service personnalisé</h6>
            </div>
            <p className="text-sm text-gray-700">
              Bénéficiez d'un accompagnement sur mesure adapté à vos besoins spécifiques.
            </p>
          </div>
          <div className="max-w-md animate-slideInUp">
            <div className='flex items-center'>
              <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-indigo-50 transition-transform transform hover:scale-125">
                <FaEye className="w-10 h-10 text-blue-600" />
              </div>
              <h6 className="mb-2 ml-4 text-lg font-bold leading-5">Transparence assurée</h6>
            </div>
            <p className="text-sm text-gray-700">
              Nous garantissons des informations claires et une communication honnête tout au long du processus.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cta3;
