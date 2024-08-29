import React, { useState, useEffect } from 'react';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { steps } from './data';
import { GrNext, GrPrevious } from "react-icons/gr";

export default function HomeFinancingSteps() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [visibleSlides, setVisibleSlides] = useState(3); // Default value for large screens
    const [naturalSlideHeight, setNaturalSlideHeight] = useState(120); // Default height

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1224) { // Large screens
                setVisibleSlides(3);
                setNaturalSlideHeight(130); // Example height for large screens

            } else if (window.innerWidth >= 768) { // Medium screens
                setVisibleSlides(2);
                setNaturalSlideHeight(120); // Example height for large screens

            } else { // Small screens
                setVisibleSlides(1);
                setNaturalSlideHeight(80); // Example height for large screens

            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Set initial value

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleAfterSlide = (index) => {
        setCurrentSlide(index);
    };

    return (
    <div className="bg-gradient-to-l  bg-blue-700 mx-auto pt-10 pb-10 text-white rounded-lg shadow-lg   w-full flex flex-col justify-center items-center"style={{width:'100%'}}>
            <CarouselProvider
                naturalSlideWidth={100}
                naturalSlideHeight={naturalSlideHeight}
                totalSlides={steps.length}
                visibleSlides={visibleSlides}
                infinite={false}
                currentSlide={currentSlide}
                onAfterSlide={handleAfterSlide}
            >
                <div className=" ml-10 mr-10 lg:ml-40 lg:mr-40 ">
                    <h1 className="text-4xl font-bold">
                        Your <span className="text-green-300">home financing journey</span> starts here
                    </h1>
                    <p className="text-xl mb-4  mt-4">
                        Vous ne savez pas par où commencer ? Suivez les étapes suivantes pour rentrer chez vous en respectant votre budget.
                    </p>
                    <div className="flex space-x-4  items-end justify-end mb-8">
                            <ButtonBack className="p-5 rounded-full bg-white text-teal-700">
                                <GrPrevious />
                            </ButtonBack>
                            <ButtonNext
                                className={`p-5 rounded-full ${currentSlide === steps.length - 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-white text-teal-700'}`}
                                disabled={currentSlide === steps.length - 1}
                            >
                                <GrNext />
                            </ButtonNext>
                    </div>
                    <Slider>
                        {steps.map((step, index) => (
                            <Slide index={index} key={index}>
                                <div className="p-6 bg-white text-gray-800 rounded-lg shadow-lg mx-auto" style={{ width: '95%', height: '100%' }}>
                                    <div className="flex justify-center mb-4">
                                        <img
                                            src={step.image}
                                            alt={step.title}
                                            className="object-contain"
                                        />
                                    </div>
                                    <h2 className="text-2xl font-semibold mb-4">{step.title}</h2>
                                    <p className="text-lg mb-4">{step.description}</p>
                                    {step.linkText && (
                                        <a
                                            href={step.linkUrl}
                                            className="text-teal-500 text-lg font-semibold hover:underline"
                                        >
                                            {step.linkText}
                                        </a>
                                    )}
                                </div>
                            </Slide>
                        ))}
                    </Slider>
                </div>
            </CarouselProvider>
        </div>
    );
}
