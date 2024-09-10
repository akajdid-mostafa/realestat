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
import PopularCard from './PopularPropertyCard'; // Import the new component
import PropertySummary  from './PropertySumary';


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
                        <Box>
                        <PropertySummary
                            title={property.title}
                            location={property.location}
                            category={property.category}
                            bedrooms={property.bedrooms}
                            kitchens={property.kitchens}
                            bathrooms={property.bathrooms}
                            area={property.area}
                            price={property.price}
                        />
                        </Box>
                        <PropertyMoreDetail
                            bedrooms={property.bedrooms}
                            kitchens={property.kitchen}
                            bathrooms={property.bathrooms}
                            area={property.area}
                            yearBuilt={property.bathrooms}
                            floor={property.floor}
                            facing={property.bathrooms}
                            legalDocuments={property.bathrooms}
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
                            Video YouTube
                        </Text>
                        <VideoSection
                            src={property.urltube} // Example YouTube video URL
                            heading={property.title} // Example heading
                        />
                        {/* New section for The Most Popular property */}
                        <Text
                            fontSize={{ base: "xl", md: "2xl" }}
                            fontWeight="bold"
                            mt={4}
                        >
                            The Most Popular
                        </Text>
                        <PopularCard />
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
export default PropertyDetailModal;
