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
import { cardData } from '../data'; // Import JSON data

const PropertyDetailModal = ({ isOpen, onClose, property }) => {
    const router = useRouter();
    const { query } = router;

    const modalWidth = useBreakpointValue({
        base: "90vw",
        md: "80vw",
        lg: "80vw",
    });

    useEffect(() => {
        if (query.modal === 'yes' && query.id) {
            const fetchedProperty = cardData.find(item => item.id === parseInt(query.id, 10));
            if (fetchedProperty) {
                // If fetchedProperty exists, it means data should be present
                // You might want to update state or similar here if needed
            }
        }
    }, [query]);

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
                            pl={6} // Padding left to give space for the blue line
                        >
                            {property?.title || "Loading..."}
                        </Text>
                    </Box>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Flex direction="column" gap={4}>
                        <Box>
                            {/* Carousel with images */}
                            <Carousel items={property?.images || []} />
                        </Box>
                        <Box>
                            <PropertySummary
                                title={property?.title}
                                location={property?.location}
                                category={property?.category}
                                bedrooms={property?.bedrooms}
                                kitchens={property?.kitchens}
                                bathrooms={property?.bathrooms}
                                area={property?.area}
                                price={property?.price}
                            />
                        </Box>
                        <Flex direction={{ base: "column", lg: "row" }} gap={4}>
                            <Box flex={{ base: "1", lg: "0.7" }}>
                                <PropertyMoreDetail
                                    bedrooms={property?.bedrooms}
                                    kitchens={property?.kitchens}
                                    bathrooms={property?.bathrooms}
                                    area={property?.area}
                                    yearBuilt={property?.yearBuilt}
                                    floor={property?.floor}
                                    facing={property?.facing}
                                    legalDocuments={property?.legalDocuments}
                                />
                                <FactsAndFeatures />
                                <Box position="relative" mt={4} mb={8}>
                                    <Box position="absolute" left={0} top="50%" transform="translateY(-50%)" width="4px" height="100%" bg="blue.600"></Box>
                                    <Text
                                        fontSize={{ base: "xl", md: "2xl" }}
                                        fontWeight="bold"
                                        pl={6} // Padding left to give space for the blue line
                                    >
                                        Localisation sur Google Map
                                    </Text>
                                </Box>
                                <Map center={{ lat: property?.latitude, lng: property?.longitude }} zoom={14} />
                                <Box>
                                    <Box position="relative" mt={8} mb={8}>
                                        <Box position="absolute" left={0} top="50%" transform="translateY(-50%)" width="4px" height="100%" bg="blue.600"></Box>
                                        <Text
                                            fontSize={{ base: "xl", md: "2xl" }}
                                            fontWeight="bold"
                                            pl={6} // Padding left to give space for the blue line
                                        >
                                            Vidéo YouTube
                                        </Text>
                                    </Box>
                                    <VideoSection
                                        src={property?.urltube}
                                        heading={property?.title}
                                    />
                                </Box>
                            </Box>
                            <Box flex={{ base: "1", lg: "0.3" }} p={4} position="sticky" top={0} mr="10" height="100%" width="100%" overflowY="auto" bg="white" boxShadow="md">
                                <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
                                    Besoin d'être contacté ?
                                </Text>
                                <FormControl mb={4}>
                                    <FormLabel>Name</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement
                                            pointerEvents="none"
                                            children={<FaUser />}
                                        />
                                        <Input placeholder="Your Name" />
                                    </InputGroup>
                                </FormControl>
                                <FormControl mb={4}>
                                    <FormLabel>Email</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement
                                            pointerEvents="none"
                                            children={<FaEnvelope />}
                                        />
                                        <Input type="email" placeholder="Your Email" />
                                    </InputGroup>
                                </FormControl>
                                <FormControl mb={4}>
                                    <FormLabel>Your Number Phone</FormLabel>
                                    <InputGroup>
                                        <InputLeftElement
                                            pointerEvents="none"
                                            children={<FaPhone />}
                                        />
                                        <Input type="tel" placeholder="Your Phone Number" />
                                    </InputGroup>
                                </FormControl>
                                <FormControl mb={4}>
                                    <FormLabel>Message</FormLabel>
                                    <Textarea
                                        placeholder="Your Message"
                                        defaultValue={`Je suis intéressé par ${property?.title} avec l'ID de référence ${property?.id}, au prix de ${property?.price} et ...`}
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
                                    En continuant, vous acceptez de recevoir des textes à l'adresse électronique que vous avez fournie. Nous nous engageons à ne pas vous spammer.
                                </Text>
                            </Box>
                        </Flex>

                         <Box position="relative" mt={8} mb={8}>
                                        <Box position="absolute" left={0} top="50%" transform="translateY(-50%)" width="4px" height="100%" bg="blue.600"></Box>
                                        <Text
                                            fontSize={{ base: "xl", md: "2xl" }}
                                            fontWeight="bold"
                                            pl={6} // Padding left to give space for the blue line
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
