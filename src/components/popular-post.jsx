import React, { useState, useEffect } from 'react';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import Image from 'next/image';
import { FaBed, FaBath, FaExpandArrowsAlt } from 'react-icons/fa'; // Bedroom, Bathroom, and Area icons
import { MdPhone } from 'react-icons/md'; // Phone icon
import { FaWhatsapp } from 'react-icons/fa'; // WhatsApp icon
import { cardData } from './data'; // Import your data
import { GrFormNextLink , GrFormPreviousLink  } from "react-icons/gr";

const Popular = () => {
    const [slidesToShow, setSlidesToShow] = useState(1); // Default value for smaller screens

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSlidesToShow(3); // Large screens
            } else if (window.innerWidth >= 768) {
                setSlidesToShow(2); // Medium screens
            } else {
                setSlidesToShow(1); // Small screens
            }
        };

        handleResize(); // Initial check
        window.addEventListener('resize', handleResize); // Update on resize

        return () => window.removeEventListener('resize', handleResize); // Cleanup on unmount
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 lg:p-8">
            <CarouselProvider
                naturalSlideWidth={100}
                naturalSlideHeight={125}
                totalSlides={cardData.length}
                visibleSlides={slidesToShow}
                infinite={true}
                isIntrinsicHeight={true}
                className="w-full max-w-7xl"
            >
                <Slider className="relative">
                    {cardData.map(card => (
                        <Slide
                            key={card.id}
                            index={card.id}
                            className="flex items-center justify-center px-2"
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
                <div className="flex justify-between mt-6">
                    <ButtonBack className="bg-blue-600 text-white font-bold p-4 rounded-full shadow-md hover:bg-blue-800 transition-colors transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50">
                         <GrFormPreviousLink fontSize={25}/>
                    </ButtonBack>
                    
                    <ButtonNext className="bg-blue-600 text-white font-bold p-4 rounded-full shadow-md hover:bg-blue-800 transition-colors transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50">
                       <GrFormNextLink fontSize={25}/> 
                    </ButtonNext>
                </div>
            </CarouselProvider>
        </div>
    );
}

export default Popular;
