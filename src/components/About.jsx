import React from 'react';
import Image from 'next/image';
import { MdSecurity, MdPermMedia } from 'react-icons/md';
import { FaSackDollar, FaClipboardList } from 'react-icons/fa6';
import { BiSupport } from 'react-icons/bi';
import { RiTeamFill } from 'react-icons/ri';

const About = () => {
    return (
        <main>
            <div className="2xl:container 2xl:mx-auto lg:py-16 lg:px-20 md:py-12 md:px-6 py-9 px-4">
                <p className="font-normal text-sm leading-3 text-indigo-700 dark:text-indigo-500 hover:text-indigo-800 cursor-pointer pb-2">À propos</p>
                <div className="flex lg:flex-row flex-col lg:gap-8 sm:gap-10 gap-12">
                    <div className="w-full lg:w-6/12">
                        <h1 className="w-full font-bold lg:text-4xl text-3xl lg:leading-10 dark:text-white leading-9">
                            À propos d&apos;ImmOcean
                        </h1>
                        <p className="font-normal text-lg text-base leading-6 text-gray-600 dark:text-gray-200 mt-6">
                            Welcome to IMMOCEAN, your premier destination for finding exceptional apartments that suit your unique lifestyle.
                            With a commitment to excellence and a passion for real estate, we specialize in helping you discover your dream home.
                            Our experienced team of dedicated professionals is here to guide you through every step of the buying process, ensuring that you find the perfect apartment that truly feels like home.
                            Explore our diverse range of listings, personalized services, and unmatched expertise as we work together to make your property journey an unforgettable success.
                        </p>
                    </div>
                    <div className="w-full lg:w-6/12">
                        <div className="relative w-full h-auto">
                            <Image
                                className="rounded-[4%] w-full h-auto object-cover"
                                src="/images/aboutt.jpg"
                                alt="Image About"
                                width={400}
                                height={200}
                            />
                        </div>
                    </div>
                </div>

                <div className="relative mt-24">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mx-4">
                        {/* Item 1 */}
                        <div className="flex flex-col items-center text-center">
                            <div className="flex items-center justify-center mb-4">
                                <MdSecurity className="w-12 h-12 text-blue-600 rounded-full" />
                            </div>
                            <p className="font-bold text-xl lg:text-2xl text-gray-800 dark:text-white mb-2">Sécurité</p>
                            <p className="font-normal text-base text-gray-600 dark:text-gray-200">
                                Nous garantissons la sécurité de vos transactions immobilières en vérifiant minutieusement chaque propriété. Notre objectif est de vous offrir une expérience sans souci avec des normes de sécurité élevées.
                            </p>
                        </div>

                        {/* Item 2 */}
                        <div className="flex flex-col items-center text-center">
                            <div className="flex items-center justify-center mb-4">
                                <FaSackDollar className="w-12 h-12 text-blue-600 rounded-full" />
                            </div>
                            <p className="font-bold text-xl lg:text-2xl text-gray-800 dark:text-white mb-2">Prix Juste</p>
                            <p className="font-normal text-base text-gray-600 dark:text-gray-200">
                                Nous nous engageons à offrir des prix transparents et compétitifs pour toutes nos propriétés. Notre expertise locale assure que vous bénéficiez de la meilleure valeur pour votre achat ou location.
                            </p>
                        </div>

                        {/* Item 3 */}
                        <div className="flex flex-col items-center text-center">
                            <div className="flex items-center justify-center mb-4">
                                <BiSupport className="w-12 h-12 text-blue-600 rounded-full" />
                            </div>
                            <p className="font-bold text-xl lg:text-2xl text-gray-800 dark:text-white mb-2">Support</p>
                            <p className="font-normal text-base text-gray-600 dark:text-gray-200">
                                Notre équipe est à votre disposition pour vous aider tout au long du processus immobilier. Que vous ayez des questions ou besoin d&apos;assistance, nous assurons un service rapide et efficace.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex lg:flex-row flex-col md:gap-14 gap-16 justify-between lg:mt-20 mt-16">
                    <div className="w-full lg:w-6/12">
                        <h2 className="font-bold lg:text-4xl text-3xl lg:leading-9 leading-7 text-gray-800 dark:text-white">Notre mission</h2>
                        <p className="font-normal text-base leading-6 text-gray-600 dark:text-gray-200 mt-6 w-full lg:w-10/12 xl:w-9/12">
                            Notre mission est de rendre l’achat, la vente et la location de propriétés accessibles et sans tracas pour tous. Nous nous efforçons d’offrir un service personnalisé, en mettant l’accent sur la transparence et la confiance, pour que chaque transaction se déroule en toute sérénité.
                        </p>
                        <p className="font-normal text-base leading-6 text-gray-600 dark:text-gray-200 w-full lg:w-10/12 xl:w-9/12 mt-10">
                            Nous visons à être le partenaire immobilier de choix en offrant une expertise approfondie et un accompagnement complet à chaque étape du processus. Grâce à notre connaissance du marché et à notre engagement envers l'excellence, nous nous engageons à dépasser vos attentes et à réaliser vos projets immobiliers avec succès.
                        </p>
                    </div>
                    <div className="w-full lg:w-6/12">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 lg:gap-12 gap-10">
                            {/* Team Card */}
                            <div className="flex p-4 shadow-md">
                                <div className="mr-6">
                                    <RiTeamFill className="text-justify-center w-8 h-8 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-xl lg:text-2xl text-gray-800 dark:text-white mb-2">Équipe</p>
                                    <p className="mt-2 font-normal text-base leading-6 text-gray-600 dark:text-gray-200">
                                        Notre équipe d&apos;experts en immobilier est là pour vous guider à chaque étape de votre projet, assurant un service personnalisé et efficace.
                                    </p>
                                </div>
                            </div>
                            {/* Board Card */}
                            <div className="flex p-4 shadow-md">
                                <div className="mr-6">
                                    <FaClipboardList className="text-justify-center w-8 h-8 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-bold lg:text-2xl text-xl lg:leading-6 leading-5 text-gray-800 dark:text-white">Conseil</p>
                                    <p className="mt-2 font-normal text-base leading-6 text-gray-600 dark:text-gray-200">
                                        Recevez des conseils professionnels pour optimiser vos décisions d&apos;achat, de vente ou de location de biens immobiliers.
                                    </p>
                                </div>
                            </div>
                            {/* Press Card */}
                            <div className="flex p-4 shadow-md">
                                <div className="mr-6">
                                    <MdPermMedia className="text-justify-center w-8 h-8 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-bold lg:text-2xl text-xl lg:leading-6 leading-5 text-gray-800 dark:text-white">Médias</p>
                                    <p className="mt-2 font-normal text-base leading-6 text-gray-600 dark:text-gray-200">
                                        Découvrez nos apparitions dans les médias, reflétant notre expertise et notre engagement dans le secteur immobilier.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default About;
