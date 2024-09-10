import React, { useState, useEffect, useRef } from 'react';
import {
    Box, Button, Flex, Heading, Text, Image, Grid,
    IconButton,
    Tag,
    Link,
    HStack
} from '@chakra-ui/react';
import { CarouselProvider, Slider, Slide } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { FaBed, FaBath, FaExpandArrowsAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { MdPhone } from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';
import { cardData } from '../data';

const PopularCard = () => {
    const [gridDisplay, setGridDisplay] = useState(false);
    const [slidesToShow, setSlidesToShow] = useState(1);
    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = cardData.length;
    const intervalRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1524) {
                setGridDisplay(false);
                setSlidesToShow(3);
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
        const interval = () => {

            if (window.innerWidth >= 1524) {
                setCurrentSlide(prev => (prev + 1) % (totalSlides - 2));
            } else if (window.innerWidth >= 768) {
                setCurrentSlide(prev => (prev + 1) % (totalSlides - 1));
            } else {
                setCurrentSlide(prev => (prev + 1) % totalSlides);
            }
            
            
        };

        if (gridDisplay) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        } else {
            intervalRef.current = setInterval(interval, 5000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [gridDisplay, totalSlides]);

    return (
        <Box display="flex" flexDirection="column" alignItems="center" p={4}>
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
                <Slider>
                    {cardData.map(card => (
                        <Slide key={card.id} index={card.id} style={{ margin: '0 10px' }}>
                            <Box className="property-item homeya-box card" bg="white" borderRadius="md" boxShadow="lg" overflow="hidden" transition="0.3s">
                                <Link href={`/properties/${card.id}.html`} className="images-group">
                                    <Box position="relative">
                                        <Image
                                            src={card.imageSrc}
                                            alt={card.title}
                                            loading="lazy"
                                            objectFit="cover"
                                            borderRadius="md"
                                        />
                                        <Flex position="absolute" top={2} left={2} gap={2}>
                                            {card.type === 'Vent' && (
                                                <Tag bg="green.900" color="white" fontWeight="bold">{card.type}</Tag>
                                            )}
                                            {card.type === 'Location' && (
                                                <Tag bg="red.600" color="white" fontWeight="bold">{card.type}</Tag>
                                            )}
                                        </Flex>
                                        <Flex position="absolute" bottom={2} left={2}>
                                            <Tag bg="white" color="black" fontWeight="bold">{card.category}</Tag>
                                        </Flex>
                                    </Box>
                                </Link>
                                <Box mt={4} p={4}>
                                    <Text fontWeight="bold" fontSize="lg" isTruncated>
                                        <Link href={`/properties/${card.id}.html`} title={card.title}>
                                            {card.title}
                                        </Link>
                                    </Text>
                                    <Flex alignItems="center" mt={1}>
                                        <FaMapMarkerAlt />
                                        <Text ml={1} isTruncated>
                                            {card.location}
                                        </Text>
                                    </Flex>
                                    <HStack spacing={4} mt={2}>
                                        <Flex alignItems="center">
                                            <FaBed />
                                            <Text ml={1}>{card.bedrooms} Bedrooms</Text>
                                        </Flex>
                                        <Flex alignItems="center">
                                            <FaBath />
                                            <Text ml={1}>{card.bathrooms} Bathrooms</Text>
                                        </Flex>
                                        <Flex alignItems="center">
                                            <FaExpandArrowsAlt />
                                            <Text ml={1}>{card.area}</Text>
                                        </Flex>
                                    </HStack>
                                </Box>
                                <Flex justify="space-between" align="center" bg="gray.100" p={4}>
                                    {card.type === 'Vent' && (
                                        <Text fontWeight="bold" color="blue.800" fontSize="xl">{card.price}</Text>
                                    )}
                                    {card.type === 'Location' && (
                                        <Text fontWeight="bold" color="blue.800" fontSize="xl">{card.price}/month</Text>
                                    )}
                                    <Flex>
                                        <IconButton
                                            as="a"
                                            href={`tel:${card.phone}`}
                                            aria-label="Call"
                                            icon={<MdPhone />}
                                            colorScheme="green"
                                            mr={2}
                                        />
                                        <IconButton
                                            as="a"
                                            href={`https://wa.me/${card.whatsapp}`}
                                            aria-label="WhatsApp"
                                            icon={<FaWhatsapp />}
                                            colorScheme="green"
                                        />
                                    </Flex>
                                </Flex>
                            </Box>
                        </Slide>
                    ))}
                </Slider>
            </CarouselProvider>

        </Box>
    );
};

export default PopularCard;