import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Button,
    Flex,
    Heading,
    Text,
    Image,
    Grid,
    IconButton,
    useBreakpointValue,
} from '@chakra-ui/react';
import { CarouselProvider, Slider, Slide } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
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
            if (window.innerWidth >= 1524) {
                setGridDisplay(true);
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
            if (window.innerWidth >= 768) {
                setCurrentSlide(prev => (prev + 1) % (totalSlides-1));
            } else {
                setCurrentSlide(prev => (prev + 1) % totalSlides);
            }

            
        };

        if (gridDisplay) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        } else {
            intervalRef.current = setInterval(interval, 2000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [gridDisplay, totalSlides]);

    return (
        <Box display="flex" flexDirection="column" alignItems="center" p={4}>
            <Box textAlign="center" mt={8} mb={6}>
                <Heading fontSize="4xl" mb={4}>Annonces d'accueil dans Votre Immocean</Heading>
                <Text color="gray.400" maxWidth="xl" mx="auto">
                    Avec plus d'un million de locations disponibles, il est facile de trouver ce qui vous convient le mieux.
                </Text>
            </Box>
            {gridDisplay ? (
                <Grid
                    templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
                    gap={6} // Increase gap for spacing
                    maxW="7xl"
                    w="full"
                >
                    {cardData.slice(0, 6).map(card => (
                        <Box
                            key={card.id}
                            bg="white"
                            borderRadius="lg"
                            boxShadow="lg"
                            overflow="hidden"
                            transition="0.3s"
                            _hover={{ boxShadow: 'xl' }}
                        >
                            <Image src={card.imageSrc} alt={card.title} width={500} height={300} layout="responsive" objectFit="cover" borderTopRadius="lg" />
                            <Box p={4}>
                                <Heading size="md" mb={2}>{card.title}</Heading>
                                <Text color="blue.600" mb={2}>For {card.type}</Text>
                                <Flex justify="space-between" mb={4}>
                                    <Flex align="center">
                                        <FaBed size={24} />
                                        <Text ml={2}>{card.bedrooms} Bedrooms</Text>
                                    </Flex>
                                    <Flex align="center">
                                        <FaBath size={24} />
                                        <Text ml={2}>{card.bathrooms} Bathrooms</Text>
                                    </Flex>
                                    <Flex align="center">
                                        <FaExpandArrowsAlt size={24} />
                                        <Text ml={2}>{card.area}</Text>
                                    </Flex>
                                </Flex>
                            </Box>
                            <Flex justify="space-between" align="center" bg="gray.100" p={4}>
                                <Text fontWeight="bold" color="blue.800" fontSize="xl">{card.price}</Text>
                                <Flex>
                                    <IconButton
                                        as="a"
                                        href={`tel:${card.phone}`}
                                        aria-label="Call"
                                        icon={<MdPhone />}
                                        colorScheme="green"
                                        mr={2} // Add margin-right for spacing
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
                    ))}
                </Grid>
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
    <Slider>
        {cardData.map(card => (
            <Slide key={card.id} index={card.id} style={{ margin: '0 10px' }}>
                <Box bg="white" borderRadius="lg" boxShadow="lg" overflow="hidden" transition="0.3s" _hover={{ boxShadow: 'xl' }}>
                    <Image src={card.imageSrc} alt={card.title} width={800} height={500} layout="responsive" objectFit="cover" borderTopRadius="lg" />
                    <Box p={4}>
                        <Heading size="md" mb={2}>{card.title}</Heading>
                        <Text color="blue.600" mb={2}>For {card.type}</Text>
                        <Flex justify="space-between" mb={4}>
                            <Flex align="center">
                                <FaBed size={24} />
                                <Text ml={2}>{card.bedrooms} Bedrooms</Text>
                            </Flex>
                            <Flex align="center">
                                <FaBath size={24} />
                                <Text ml={2}>{card.bathrooms} Bathrooms</Text>
                            </Flex>
                            <Flex align="center">
                                <FaExpandArrowsAlt size={24} />
                                <Text ml={2}>{card.area}</Text>
                            </Flex>
                        </Flex>
                    </Box>
                    <Flex justify="space-between" align="center" bg="gray.100" p={4}>
                        <Text fontWeight="bold" color="blue.800" fontSize="xl">{card.price}</Text>
                        <Flex>
                            <IconButton 
                                as="a" 
                                href={`tel:${card.phone}`} 
                                aria-label="Call" 
                                icon={<MdPhone />} 
                                colorScheme="green" 
                                mr={2} // Add margin-right for spacing
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
            )}
            <Button
                mt={6}
                px={6}
                py={3}
                colorScheme="blue"
                variant="solid"
                size="lg"
                borderRadius="md"
                boxShadow="md"
                _hover={{ bg: 'blue.700' }}
            >
                SHOW ALL POST
            </Button>
        </Box>
    );
};

export default Popular;