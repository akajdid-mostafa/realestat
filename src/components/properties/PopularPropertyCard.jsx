import React, { useState, useEffect, useRef } from 'react';
import { Box, Flex, Text, Image, IconButton, Tag, Link, HStack } from '@chakra-ui/react';
import { CarouselProvider, Slider, Slide } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { FaBed, FaEye, FaBath, FaExpandArrowsAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { TbListDetails } from "react-icons/tb";

const PopularCard = ({ currentCategory }) => {
    const [gridDisplay, setGridDisplay] = useState(false);
    const [slidesToShow, setSlidesToShow] = useState(1);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [posts, setPosts] = useState([]);
    const [details, setDetails] = useState([]);
    const totalSlides = posts.length;
    const intervalRef = useRef(null);

    useEffect(() => {
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
                setCurrentSlide(prev => (prev + 1) % (totalSlides - 3));
            } else if (window.innerWidth >= 768) {
                setCurrentSlide(prev => (prev + 1) % (totalSlides - 2));
            } else {
                setCurrentSlide(prev => (prev + 1) % (totalSlides - 1));
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

    const transformedData = posts.map(post => {
        const detail = details.find(detail => detail.postId === post.id) || {};
        return {
            id: post.id,
            imageSrc: post.img[0] || '/images/card.jpeg',
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

    const filteredData = transformedData.filter(card => card.category === currentCategory);

    return (
        <Box display="flex" flexDirection="column" alignItems="center" p={4}>
            <CarouselProvider
                naturalSlideWidth={100}
                naturalSlideHeight={125}
                totalSlides={filteredData.length}
                visibleSlides={slidesToShow}
                infinite={true}
                isIntrinsicHeight={true}
                className="w-full max-w-7xl"
                currentSlide={currentSlide}
            >
                <Slider>
                    {filteredData.map(card => (
                        <Slide key={card.id} index={card.id} style={{ margin: '0 10px' }}>
                            <Box className="property-item homeya-box card" bg="white" borderRadius="md" boxShadow="lg" overflow="hidden" transition="0.3s">
                                <Link href={`/properties?modal=yes&id=${card.id}`} className="images-group">
                                    <Box position="relative" height="200px">
                                        <Image
                                            src={card.imageSrc}
                                            alt={card.title}
                                            loading="lazy"
                                            objectFit="cover"
                                            width="100%"
                                            height="100%"
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
                                                {card.type && card.type ? card.type : 'Unknown'}
                                            </Tag>
                                        </Flex>
                                        <Flex position="absolute" bottom={2} left={2}>
                                            <Tag bg="blue.600" color="white" fontWeight="bold">
                                                {card.ville}
                                            </Tag>
                                        </Flex>
                                    </Box>
                                </Link>
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
                                    <Text fontWeight="bold" color="blue.800" fontSize="xl">
                                        {card.price}
                                    </Text>
                                    <Flex>
                                        <IconButton
                                            aria-label="Details"
                                            icon={<TbListDetails />}
                                            colorScheme="blue"
                                            fontSize={30}
                                            mr={2}
                                        />
                                        <IconButton
                                            aria-label="View"
                                            icon={<FaEye />}
                                            colorScheme="blue"
                                            fontSize={25}
                                            mr={1}
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