import React from 'react';
import { MdSecurity, MdPermMedia } from "react-icons/md";
import { BiSupport } from "react-icons/bi";
import { FaSackDollar, FaClipboardList } from "react-icons/fa6";

const Aboutt = () => {
    return (
        <section className="relative bg-blueGray-50">
            {/* Header Section */}
            <div className="mt-8 mb-10 grid grid-cols-1 pb-6 text-center animate-fadeIn">
                <h1 className="font-bold text-4xl leading-normal mb-4 animate-slideInDown">
                À PROPOS DE NOUS IMMOCEAN
                </h1>
            </div>

            {/* Main Content Section */}
            <div className="relative pt-16 pb-32 flex content-center items-center justify-center min-h-screen-75">
                <div className="absolute top-0 w-full h-full bg-center bg-cover" style={{
                    backgroundImage: "url('/images/aboutt.jpg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                }}>
                    <span id="blackOverlay" className="w-full h-full absolute opacity-75 bg-neutral-800"></span>
                </div>
                <div className="container relative mx-auto animate-fadeIn">
                    <div className="items-center flex flex-wrap">
                        <div className="w-full lg:w-6/12 px-4 ml-auto mr-auto text-center">
                            <div className="pr-12">
                                <h1 className="text-white font-semibold text-5xl animate-slideInLeft">
                                Votre histoire commence avec nous.
                                </h1>
                                <p className="mt-4 text-lg text-gray-200 animate-slideInLeft">
                                Bienvenue chez IMMOCEAN, votre première destination pour trouver des appartements exceptionnels qui correspondent à votre style de vie unique.
                                    Avec un engagement d'excellence et une passion pour l'immobilier, nous sommes spécialisés dans l'aide à la découverte de la maison de vos rêves.
                                    Notre équipe expérimentée de professionnels dévoués est là pour vous guider à travers chaque étape du processus d'achat, en veillant à ce que vous trouviez l'appartement parfait qui se sentira vraiment comme chez vous.
                                    Découvrez notre gamme variée d'annonces, nos services personnalisés et notre expertise inégalée. Nous travaillerons ensemble pour faire de votre voyage immobilier un succès inoubliable.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <section className="pb-10 bg-blueGray-200 -mt-24">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap">
                        <div className="lg:pt-12 pt-6 w-full md:w-4/12 px-4 text-center">
                            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg hover:scale-105 transition-transform duration-300">
                                <div className="px-4 py-5 flex-auto">
                                    <div className="text-white p-3 text-center inline-flex items-center justify-center mb-5 shadow-lg rounded-full bg-blue-600 transition-transform transform hover:animate-rotateOnce">
                                        <MdSecurity className="w-12 h-12 text-white" />
                                    </div>
                                    <h6 className="text-xl font-semibold animate-slideInUp">Sécurité</h6>
                                    <p className="mt-2 mb-4 text-blueGray-500 animate-fadeIn">
                                        Nous garantissons la sécurité de vos transactions immobilières en vérifiant minutieusement chaque propriété. Notre objectif est de vous offrir une expérience sans souci avec des normes de sécurité élevées.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-4/12 px-4 text-center">
                            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg hover:scale-105 transition-transform duration-300">
                                <div className="px-4 py-5 flex-auto">
                                    <div className="text-white p-3 text-center inline-flex items-center justify-center mb-5 shadow-lg rounded-full bg-blue-600 transition-transform transform hover:animate-rotateOnce">
                                        <FaSackDollar className="w-12 h-12 text-white" />
                                    </div>
                                    <h6 className="text-xl font-semibold animate-slideInUp">Prix Juste</h6>
                                    <p className="mt-2 mb-4 text-blueGray-500 animate-fadeIn">
                                        Nous nous engageons à offrir des prix transparents et compétitifs pour toutes nos propriétés. Notre expertise locale assure que vous bénéficiez de la meilleure valeur pour votre achat ou location.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="pt-6 w-full md:w-4/12 px-4 text-center">
                            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-8 shadow-lg rounded-lg hover:scale-105 transition-transform duration-300">
                                <div className="px-4 py-5 flex-auto">
                                    <div className="text-white p-3 text-center inline-flex items-center justify-center mb-5 shadow-lg rounded-full bg-blue-600 transition-transform transform hover:animate-rotateOnce">
                                        <BiSupport className="w-12 h-12 text-white" />
                                    </div>
                                    <h6 className="text-xl font-semibold animate-slideInUp">Support</h6>
                                    <p className="mt-2 mb-4 text-blueGray-500 animate-fadeIn">
                                        Notre équipe est à votre disposition pour vous aider tout au long du processus immobilier. Que vous ayez des questions ou besoin d’assistance, nous assurons un service rapide et efficace.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </section>
    );
};

export default Aboutt;
