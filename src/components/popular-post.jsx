import React, { useState, useEffect, useRef } from 'react';
import { CarouselProvider, Slider, Slide } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import Image from 'next/image';
import { FaBed, FaBath, FaExpandArrowsAlt } from 'react-icons/fa';
import { MdPhone } from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';
import { cardData } from './data';

const Popular = () => {
    const [gridDisplay, setGridDisplay] = useState(false);
    const [slidesToShow, setSlidesToShow] = useState(1);
    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = cardData.length;
    const intervalRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1224) {
                setGridDisplay(true);
                setSlidesToShow(1);
            } else if (window.innerWidth >= 768) {
                setGridDisplay(false);
                setSlidesToShow(2);
            } else {
                setGridDisplay(false);
                setSlidesToShow(1);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (window.innerWidth >= 1224) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        } else if (window.innerWidth >= 768) {
            intervalRef.current = setInterval(() => {
                setCurrentSlide(prev => (prev + 1) % totalSlides);
            }, 2000);

            return () => {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
            };
        } else {
            intervalRef.current = setInterval(() => {
                setCurrentSlide(prev => (prev + 1) % totalSlides);
            }, 2000);

            return () => {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
            };
        }
    }, [gridDisplay, totalSlides]);

    const handleShowAll = () => {
        console.log('Show All Cards button clicked');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 lg:p-8">
            <div className="mt-8 grid grid-cols-1 pb-6 text-center">
                <h1 className="font-bold text-4xl leading-normal mb-4 animate-popIn">Annonces d'accueil dans Votre Immocean</h1>
                <p className="text-slate-400 max-w-xl mx-auto mb-4 animate-popIn">
                    Avec plus d'un million de locations disponibles, il est facile de trouver ce qui vous convient le mieux.
                </p>
            </div>
            {gridDisplay ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl w-full">
                    {cardData.slice(0, 6).map(card => (
                        <div
                            key={card.id}
                            className="bg-white mb-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 animate-flipIn hover:animate-zoomIn"
                        >
                            <Image
                                src={card.imageSrc}
                                alt={card.title}
                                width={800}
                                height={500}
                                layout="responsive"
                                objectFit="cover"
                                className="rounded-t-lg"
                            />
                            <div className="px-6 py-4">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">{card.title}</h2>
                                <div className="flex items-center">
                                    <div className="mr-3 mb-3 rounded-full bg-blue-600 py-1 px-2 text-xs font-bold text-white">For {card.type}</div>
                                </div>
                                <div className="flex justify-between mb-4">
                                    <div className="flex items-center">
                                        <FaBed size={24} className="text-gray-600" />
                                        <p className="ml-2 text-sm font-medium text-gray-700">{card.bedrooms} Bedrooms</p>
                                    </div>
                                    <div className="flex items-center">
                                        <FaBath size={24} className="text-gray-600" />
                                        <p className="ml-2 text-sm font-medium text-gray-700">{card.bathrooms} Bathrooms</p>
                                    </div>
                                    <div className="flex items-center">
                                        <FaExpandArrowsAlt size={24} className="text-gray-600" />
                                        <p className="ml-2 text-sm font-medium text-gray-700">{card.area}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-4 flex justify-between items-center bg-gray-100 rounded-b-lg">
                                <p className="text-2xl font-extrabold text-blue-800">{card.price}</p>
                                <div className="flex">
                                    <a
                                        href={`tel:${card.phone}`}
                                        className="mr-2 rounded-full bg-green-500 p-2 text-white hover:bg-green-700 transition-colors"
                                    >
                                        <MdPhone size={24} />
                                    </a>
                                    <a
                                        href={`https://wa.me/${card.whatsapp}`}
                                        className="rounded-full bg-green-500 p-2 text-white hover:bg-green-700 transition-colors"
                                    >
                                        <FaWhatsapp size={24} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={handleShowAll}
                        className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
                    >
                        Show All Cards
                    </button>
                </div>
            ) : (
                <CarouselProvider
                    naturalSlideWidth={100}
                    naturalSlideHeight={125}
                    totalSlides={totalSlides}
                    visibleSlides={slidesToShow}
                    infinite={true}
                    isIntrinsicHeight={true}
                    className="w-full max-w-7xl"
                    currentSlide={currentSlide}
                >
                    <Slider className="relative">
                        {cardData.map(card => (
                            <Slide
                                key={card.id}
                                index={card.id}
                                className="flex items-center justify-center px-2 animate-slideUp"
                            >
                                <div className="w-full max-w-lg bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                                    <Image
                                        src={card.imageSrc}
                                        alt={card.title}
                                        width={800}
                                        height={500}
                                        layout="responsive"
                                        objectFit="cover"
                                        className="rounded-t-lg"
                                    />
                                    <div className="px-6 py-4">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{card.title}</h2>
                                        <div className="flex items-center">
                                            <div className="mr-3 mb-3 rounded-full bg-blue-600 py-1 px-2 text-xs font-bold text-white">For {card.type}</div>
                                        </div>
                                        <div className="flex justify-between mb-4">
                                            <div className="flex items-center">
                                                <FaBed size={24} className="text-gray-600" />
                                                <p className="ml-2 text-sm font-medium text-gray-700">{card.bedrooms} Bedrooms</p>
                                            </div>
                                            <div className="flex items-center">
                                                <FaBath size={24} className="text-gray-600" />
                                                <p className="ml-2 text-sm font-medium text-gray-700">{card.bathrooms} Bathrooms</p>
                                            </div>
                                            <div className="flex items-center">
                                                <FaExpandArrowsAlt size={24} className="text-gray-600" />
                                                <p className="ml-2 text-sm font-medium text-gray-700">{card.area}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-6 py-4 flex justify-between items-center bg-gray-100 rounded-b-lg">
                                        <p className="text-2xl font-extrabold text-blue-800">{card.price}</p>
                                        <div className="flex">
                                            <a
                                                href={`tel:${card.phone}`}
                                                className="mr-2 rounded-full bg-green-500 p-2 text-white hover:bg-green-700 transition-colors"
                                            >
                                                <MdPhone size={24} />
                                            </a>
                                            <a
                                                href={`https://wa.me/${card.whatsapp}`}
                                                className="rounded-full bg-green-500 p-2 text-white hover:bg-green-700 transition-colors"
                                            >
                                                <FaWhatsapp size={24} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </Slide>
                        ))}
                    </Slider>
                </CarouselProvider>
            )}
            <button
                onClick={handleShowAll}
                className="mt-6 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
            >
                Show All Cards
            </button>
        </div>
    );
}

export default Popular;
