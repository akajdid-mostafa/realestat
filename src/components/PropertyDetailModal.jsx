import React from "react";
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
    Tag,
    useBreakpointValue,
} from "@chakra-ui/react";
import {
    FaBed,
    FaBath,
    FaExpandArrowsAlt,
    FaMapMarkerAlt,
} from "react-icons/fa";
import { FaKitchenSet } from "react-icons/fa6";
import Carousel from "./Carousel"; // Import the Carousel component
import FactsAndFeatures from './factsandfeatures';
import VideoSection from './Videoyoutube';
import PropertyMoreDetail from './propertymoredetail'; // Import the new component
import Map from './PropertyLocationMap'; // Import the PropertyLocationMap component

const PropertyDetailModal = ({ isOpen, onClose, property }) => {
    if (!property) return null;

    // Ensure property.images is an array
    const images = Array.isArray(property.images) ? property.images : [];

    // Define responsive sizes for the modal content
    const modalWidth = useBreakpointValue({
        base: "90vw",
        md: "80vw",
        lg: "80vw",
    });

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
                    {property.title}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Flex direction="column" gap={4}>
                        <Box>
                            {/* Carousel with images */}
                            <Carousel items={images} />
                        </Box>

                        <Box
                            border="1px solid #e2e8f0"
                            borderRadius="md"
                            p={{ base: 2, md: 4 }}
                            boxShadow="md"
                            display="flex"
                            flexDirection={{ base: "column", md: "row" }}
                            justifyContent="space-between"
                            alignItems={{ base: "start", md: "center" }}
                        >
                            <Box fontWeight="bold">
                                <Text fontSize={{ base: "lg", md: "xl", lg: "2xl" }} color="blue.600">
                                    {property.title}
                                </Text>
                                <Flex align="center" mt={{ base: 2, md: 1 }}>
                                    <FaMapMarkerAlt color="blue.600" />
                                    <Text fontSize={{ base: "sm", md: "md" }} ml={2}>
                                        {property.location}
                                    </Text>
                                </Flex>
                                <Tag fontSize={{ base: "sm", md: "md", lg: "lg" }} bg="blue.600" pb={1} textColor="white" mt={2}>
                                    {property.category}
                                </Tag>
                                <Flex fontWeight="bold" flexWrap="wrap">
                                    <Flex align="center" mr={4} mb={{ base: 2, md: 0 }}>
                                        <FaBed />
                                        <Text ml={2} fontSize={{ base: "sm", md: "md" }}>
                                            {property.bedrooms} Bedrooms
                                        </Text>
                                    </Flex>
                                    <Flex align="center" mr={4} mb={{ base: 2, md: 0 }}>
                                        <FaKitchenSet />
                                        <Text ml={2} fontSize={{ base: "sm", md: "md" }}>
                                            {property.kitchens} Kitchen
                                        </Text>
                                    </Flex>
                                    <Flex align="center" mr={4} mb={{ base: 2, md: 0 }}>
                                        <FaBath />
                                        <Text ml={2} fontSize={{ base: "sm", md: "md" }}>
                                            {property.bathrooms} Bathrooms
                                        </Text>
                                    </Flex>
                                    <Flex align="center" mr={4} mb={{ base: 2, md: 0 }}>
                                        <FaExpandArrowsAlt />
                                        <Text ml={2} fontSize={{ base: "sm", md: "md" }}>
                                            {property.area}
                                        </Text>
                                    </Flex>
                                </Flex>
                            </Box>
                            <Box mt={2} mb={2} fontSize={{ base: "lg", md: "xl", lg: "3xl" }} color="blue.600" fontWeight="bold">
                                <Text>{property.price}</Text>
                            </Box>
                        </Box>

                        <PropertyMoreDetail
                            bedrooms={property.bedrooms}
                            kitchens={property.kitchens}
                            bathrooms={property.bathrooms}
                            area={property.area}
                            yearBuilt={property.yearBuilt}
                            floor={property.floor}
                            facing={property.facing}
                            legalDocuments={property.legalDocuments}
                        />

                        <FactsAndFeatures />
                        <Text
                            fontSize={{ base: "xl", md: "2xl" }}
                            fontWeight="bold"
                        >
                            Location
                        </Text>
                        <Map center={{ lat: property.latitude, lng: property.longitude }} zoom={14} />
                        <Text
                            fontSize={{ base: "xl", md: "2xl" }}
                            fontWeight="bold"
                            mt={2}
                        >
                            Location
                        </Text>

                        <VideoSection
                            src={property.urltube} // Example YouTube video URL
                            heading={property.title} // Example heading
                        />
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default PropertyDetailModal;
