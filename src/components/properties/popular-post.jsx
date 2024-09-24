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
    Tag,
    Link,
    HStack
} from '@chakra-ui/react';
import { CarouselProvider, Slider, Slide } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { FaBed, FaBath, FaExpandArrowsAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { MdPhone } from 'react-icons/md';
import { FaWhatsapp } from 'react-icons/fa';

const Popular = () => {
    const [gridDisplay, setGridDisplay] = useState(false);
    const [slidesToShow, setSlidesToShow] = useState(1);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [posts, setPosts] = useState([]);
    const [details, setDetails] = useState([]);
    const totalSlides = posts.length;
    const intervalRef = useRef(null);

    useEffect(() => {
        // Fetch posts and details from APIs
        const fetchData = async () => {
            try {
                const postsResponse = await fetch('https://immoceanrepo.vercel.app/api/posts');
                const postsData = await postsResponse.json();
                setPosts(postsData);

                const detailsResponse = await fetch('https://immoceanrepo.vercel.app/api/details');
                const detailsData = await detailsResponse.json();
                setDetails(detailsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

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
                setCurrentSlide(prev => (prev + 1) % (totalSlides - 1));
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

    // Transform API data into the format expected by the component
    const transformedData = posts.map(post => {
        const detail = details.find(detail => detail.postId === post.id) || {};
        return {
            id: post.id,
            imageSrc: post.img[0] || '/images/card.jpeg', // Default image if none provided
            title: post.title,
            urltube: post.youtub || 'https://www.youtube.com/embed/rjKsKbU2Wuo?autoplay=1&controls=1',
            type: post.type?.type || 'Unknown',
            location: post.adress,
            ville: post.ville,
            category: post.category?.name || 'Unknown',
            bedrooms: detail.bedromms || 0,
            kitchen: detail.kitchen || 0,
            bathrooms: detail.bathrooms || 0,
            latitude: post.lat,
            longitude: post.lon,
            area: detail.surface || 'N/A',
            floor: detail.floor || 'N/A',
            price: `$${post.prix || '0'}`,
            images: post.img.map((url, index) => ({
                alt: `image${index + 1}`,
                url
            }))
        };
    });

    return (
        <Box display="flex" flexDirection="column" alignItems="center" p={4}>
            <Box textAlign="center" mt={8} mb={6}>
                <Heading fontSize="4xl" mb={4}>Annonces d'accueil dans Votre Immocean</Heading>
                <Text color="gray.400" maxWidth="xl" mx="auto">
                    Avec plus d'un million de biens disponibles, il est facile de trouver le bien qui vous convient.
                </Text>
            </Box>
            {gridDisplay ? (
                <Grid
                    templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }}
                    gap={6}
                    maxW="7xl"
                >
                    {transformedData.slice(0, 6).map(card => (
                        <Box
                            key={card.id}
                            className="property-item homeya-box card"
                            width="400px"
                            bg="white"
                            borderRadius="md"
                            overflow="hidden"
                            boxShadow="lg"
                            transition="0.3s"
                            maxW="lg"  // Set maximum width
                        >
                            <Link href={`/properties?modal=yes&id=${card.id}`} _hover={{ textDecoration: "none" }} className="images-group">
                                <Box position="relative" height="200px" className="image-container"> {/* Fixed height */}

                                    <Image
                                        src={card.imageSrc}
                                        alt={card.title}
                                        loading="lazy"
                                        objectFit="cover"
                                        borderRadius="md"
                                        width="100%"
                                        height="100%"
                                        className="hover-image" // Added class for hover effect
                                    />

                                    <Flex position="absolute" top={2} left={2} gap={2}>
                                        {card.category === 'Vente' && (
                                            <Tag bg="green.900" color="white" fontWeight="bold">
                                                {card.category}
                                            </Tag>
                                        )}
                                        {card.category === 'Location' && (
                                            <Tag bg="red.600" color="white" fontWeight="bold">
                                                {card.category}
                                            </Tag>
                                        )}
                                    </Flex>
                                    <Flex position="absolute" bottom={2} right={2}>
                                        <Tag bg="white" color="black" fontWeight="bold">
                                            {card.type || 'Unknown'}
                                        </Tag>
                                    </Flex>
                                    <Flex position="absolute" bottom={2} left={2}>
                                        <Tag bg="blue.600" color="white" fontWeight="bold">
                                            {card.ville}
                                        </Tag>
                                    </Flex>
                                </Box>

                                <Box mt={2} p={2}>
                                    <Text fontWeight="bold" fontSize="lg" isTruncated>
                                        <Link
                                            href={`/properties/${card.id}.html`}
                                            textDecoration="none"
                                            color="blue.800"
                                            _hover={{ textDecoration: 'none', color: 'inherit' }}
                                            title={card.title}
                                        >
                                            {card.title}
                                        </Link>
                                    </Text>
                                    <Flex align="center" mt={1}>
                                        <FaMapMarkerAlt />
                                        <Text ml={1} isTruncated>
                                            {card.location}
                                        </Text>
                                    </Flex>
                                    <Flex justify="space-between" mt={2}>
                                        <Flex align="center">
                                            <FaBed />
                                            <Text ml={1}>{card.bedrooms} Bedrooms</Text>
                                        </Flex>
                                        <Flex align="center">
                                            <FaBath />
                                            <Text ml={1}>{card.bathrooms} Bathrooms</Text>
                                        </Flex>
                                        <Flex align="center">
                                            <FaExpandArrowsAlt />
                                            <Text ml={1}>{card.area}</Text>
                                        </Flex>
                                    </Flex>
                                </Box>

                                <Flex justify="space-between" align="center" bg="gray.100" p={4} mt={4}>
                                    <Text fontWeight="bold" color="blue.800" fontSize="xl">
                                        {card.price}
                                    </Text>
                                    <Flex>
                                        <IconButton
                                            as="a"
                                            href={`tel:0762544011`}
                                            aria-label="Call"
                                            icon={<MdPhone />}
                                            colorScheme="green"
                                            mr={2}
                                        />
                                        <IconButton
                                            as="a"
                                            href={`https://wa.me/+212762544011`}
                                            aria-label="WhatsApp"
                                            icon={<FaWhatsapp />}
                                            colorScheme="green"
                                        />
                                    </Flex>
                                </Flex>
                            </Link>
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
                        {transformedData.map(card => (
                            <Slide key={card.id} index={card.id} style={{ margin: '0 10px' }}>
                                <Link href={`/properties?modal=yes&id=${card.id}`} _hover={{ textDecoration: "none" }} className="images-group">
                                    <Box className="property-item homeya-box card" bg="white" borderRadius="md" boxShadow="lg" overflow="hidden" transition="0.3s">
                                        <Box position="relative" height="350px"> {/* Fixed height for consistency */}
                                            <Image
                                                src={card.imageSrc}
                                                alt={card.title}
                                                loading="lazy"
                                                objectFit="cover" // Ensures image covers the area without distortion
                                                width="100%"
                                                height="100%" // Ensures the image fills the container
                                            />
                                            <Flex position="absolute" top={2} left={2} gap={2}>
                                                {card.category === 'Vente' && (
                                                    <Tag bg="green.900" color="white" fontWeight="bold">
                                                        {card.category}
                                                    </Tag>
                                                )}
                                                {card.category === 'Location' && (
                                                    <Tag bg="red.600" color="white" fontWeight="bold">
                                                        {card.category}
                                                    </Tag>
                                                )}
                                            </Flex>
                                            <Flex position="absolute" bottom={2} left={2}>
                                                <Tag bg="white" color="black" fontWeight="bold">
                                                    {card.type && card.type ? card.type : 'Unknown'}
                                                </Tag>
                                            </Flex>
                                        </Box>

                                        <Box mt={1} p={4}>
                                            <Text fontWeight="bold" fontSize="lg" isTruncated>
                                                <Link
                                                    href={`/properties/${card.id}.html`}
                                                    textDecoration="none"
                                                    color="blue.800"
                                                    _hover={{ textDecoration: 'none', color: 'inherit' }}
                                                    title={card.title}
                                                >
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
                                            <Text fontWeight="bold" color="blue.800" fontSize="xl">{card.price}</Text>
                                            <Flex>
                                                <IconButton
                                                    as="a"
                                                    href={`tel:0762544011`}
                                                    aria-label="Call"
                                                    icon={<MdPhone />}
                                                    colorScheme="green"
                                                    mr={2}
                                                />
                                                <IconButton
                                                    as="a"
                                                    href={`https://wa.me/+212762544011`}
                                                    aria-label="WhatsApp"
                                                    icon={<FaWhatsapp />}
                                                    colorScheme="green"
                                                />
                                            </Flex>
                                        </Flex>

                                    </Box>
                                </Link>
                            </Slide>
                        ))}
                    </Slider>
                </CarouselProvider>
            )}
        </Box>
    );
};

export default Popular;