import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Flex,
    Box,
    Text,
    useBreakpointValue,
    FormControl,
    FormLabel,
    InputGroup,
    InputLeftElement,
    Input,
    Textarea,
    Button,
} from "@chakra-ui/react";
import {
    FaPhone,
    FaEnvelope,
    FaUser,
} from "react-icons/fa";
import Carousel from "./Carousel";
import FactsAndFeatures from './factsandfeatures';
import VideoSection from './Videoyoutube';
import PropertyMoreDetail from './propertymoredetail';
import Map from './PropertyLocationMap';
import PopularCard from './PopularPropertyCard';
import PropertySummary from './PropertySumary';




const POSTS_API_URL = 'https://immoceanrepo.vercel.app/api/posts';
const DETAILS_API_URL = 'https://immoceanrepo.vercel.app/api/details';

const PropertyDetailModal = ({ isOpen, onClose }) => {
    const router = useRouter();
    const { query } = router;

    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    const modalWidth = useBreakpointValue({
        base: "90vw",
        md: "80vw",
        lg: "80vw",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (query.modal === 'yes' && query.id) {
                    const postId = parseInt(query.id, 10);

                    // Fetch posts data
                    const postsResponse = await fetch(POSTS_API_URL);
                    const postsData = await postsResponse.json();

                    // Fetch details data
                    const detailsResponse = await fetch(DETAILS_API_URL);
                    const detailsData = await detailsResponse.json();

                    // Find the property from posts
                    const post = postsData.find(item => item.id === postId);
                    if (post) {
                        // Find the corresponding detail
                        const detail = detailsData.find(d => d.postId === postId);

                        // Combine post and detail data
                        setProperty({
                            ...post,
                            ...detail,
                            images: post.img, // Assuming images are from the post
                            youtubeUrl: post.youtub,
                            location: post.adress,
                            price: post.prix,
                            category: post.category.name,
                            type: post.type.type,
                        });
                    } else {
                        setError('Property not found');
                    }
                }
            } catch (error) {
                setError('Failed to fetch data');
                console.error('Error fetching property data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [query]);

    useEffect(() => {
        if (property) {
            setMessage(`Je suis intéressé par ${property.title} avec l'ID de référence ${property.id}, au prix de ${property.price} et ...`);
        }
    }, [property]);

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>{error}</Text>;

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="full">
            <ModalOverlay
                css={{
                    width: "100%",
                    height: "100vh",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    zIndex: 10,
                    transform: "translateZ(0)",
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            />
            <ModalContent maxWidth={modalWidth} width={modalWidth}>
                <ModalHeader fontSize={{ base: "lg", md: "xl", lg: "2xl" }}>
                    <Box position="relative">
                        <Box position="absolute" left={0} top="50%" transform="translateY(-50%)" width="4px" height="100%" bg="blue.600"></Box>
                        <Text
                            fontSize={{ base: "xl", md: "2xl" }}
                            fontWeight="bold"
                            pl={6}
                        >
                            {property?.title || "Loading..."}
                        </Text>
                    </Box>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Flex direction="column" gap={4}>
                        <Box>
                            <Carousel items={property?.images || []} />
                        </Box>
                        <Box>
                            <PropertySummary
                                title={property?.title}
                                location={property?.location}
                                category={property?.type}
                                bedrooms={property?.bedrooms}
                                kitchens={property?.kitchen}
                                bathrooms={property?.bathrooms}
                                area={property?.surface}
                                price={property?.price}
                            />
                        </Box>
                        <Flex direction={{ base: "column", lg: "row" }} gap={4}>
                            <Box flex={{ base: "1", lg: "0.7" }}>
                                <PropertyMoreDetail
                                    rooms={property?.rooms}
                                    bedrooms={property?.livingrooms}
                                    kitchens={property?.kitchen}
                                    bathrooms={property?.bathrooms}
                                    area={property?.surface}
                                    yearBuilt={property?.constructionyear}
                                    floor={property?.floor}
                                    facing={property?.facade}

                                />
                                <FactsAndFeatures
                                    furnished={property?.furnished}
                                    elevator={property?.elevator}
                                    parking={property?.parking}
                                    balcony={property?.balcony}
                                    pool={property?.pool}
                                    documents={property?.documents}
                                />
                                <Box position="relative" mt={4} mb={8}>
                                    <Box position="absolute" left={0} top="50%" transform="translateY(-50%)" width="4px" height="100%" bg="blue.600"></Box>
                                    <Text
                                        fontSize={{ base: "xl", md: "2xl" }}
                                        fontWeight="bold"
                                        pl={6}
                                    >
                                        Localisation sur Google Map
                                    </Text>
                                </Box>
                                <Map center={{ lat: property?.lat, lng: property?.lon }} zoom={14} />
                                <Box>
                                    <Box position="relative" mt={8} mb={8}>
                                        <Box position="absolute" left={0} top="50%" transform="translateY(-50%)" width="4px" height="100%" bg="blue.600"></Box>
                                        <Text
                                            fontSize={{ base: "xl", md: "2xl" }}
                                            fontWeight="bold"
                                            pl={6}
                                        >
                                            Vidéo YouTube
                                        </Text>
                                    </Box>
                                    <VideoSection
                                        src={property?.youtubeUrl}
                                        heading={property?.title}
                                    />
                                </Box>
                            </Box>
                            <Box flex={{ base: "1", lg: "0.3" }} p={4} position="sticky" top={0} mr="10" height="100%" width="100%" overflowY="auto" bg="white" boxShadow="md">
                                <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
                                    Besoin d&apos;être contacté ?
                                </Text>
                                <FormControl mb={4}>
                                    <FormLabel>Name</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement
                                            pointerEvents="none"
                                        >
                                            <FaUser />
                                        </InputLeftElement>
                                        <Input placeholder="Your Name" />
                                    </InputGroup>
                                </FormControl>
                                <FormControl mb={4}>
                                    <FormLabel>Email</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement
                                            pointerEvents="none"
                                        >
                                            <FaEnvelope />
                                        </InputLeftElement>
                                        <Input type="email" placeholder="Your Email" />
                                    </InputGroup>
                                </FormControl>
                                <FormControl mb={4}>
                                    <FormLabel>Your Number Phone</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement
                                            pointerEvents="none"
                                        >
                                            <FaPhone />
                                        </InputLeftElement>
                                        <Input type="tel" placeholder="Your Phone Number" />
                                    </InputGroup>
                                </FormControl>
                                <FormControl mb={4}>
                                    <FormLabel>Message</FormLabel>
                                    <Textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Your Message"
                                        style={{
                                            fontWeight: "semibold",
                                            borderColor: 'blue.600',
                                            boxShadow: '0 0 5px rgba(0, 128, 128, 0.5)',
                                            height: '150px'
                                        }}
                                    />
                                </FormControl>
                                <Button
                                    colorScheme="blue"
                                    width="full"
                                    bg="blue.600"
                                    _hover={{ transform: 'scale(1.05)' }}
                                    transition="transform 0.2s"
                                >
                                    Send Message
                                </Button>
                                <Text
                                    textAlign="center"
                                    fontSize="sm"
                                    color="gray.600"
                                    mt={2}
                                >
                                    En continuant, vous acceptez de recevoir des textes à l&apos;adresse électronique que vous avez fournie. Nous nous engageons à ne pas vous spammer.
                                </Text>
                            </Box>
                        </Flex>

                        <Box position="relative" mt={8} mb={8}>
                            <Box position="absolute" left={0} top="50%" transform="translateY(-50%)" width="4px" height="100%" bg="blue.600"></Box>
                            <Text
                                fontSize={{ base: "xl", md: "2xl" }}
                                fontWeight="bold"
                                pl={6}
                            >
                                Les plus populaires
                            </Text>
                        </Box>
                        <PopularCard />
                        <Image
                            src="/images/footer-art.svg"
                            alt=""
                            width="1200"
                            height="160"
                        />
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default PropertyDetailModal;
