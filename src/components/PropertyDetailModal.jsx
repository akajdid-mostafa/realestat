import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  Flex,
  Box,
  Tag,
  Button,
} from "@chakra-ui/react";
import {
  FaBed,
  FaBath,
  FaExpandArrowsAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Carousel from "./Carousel"; // Import the Carousel component


const PropertyDetailModal = ({ isOpen, onClose, property }) => {
  if (!property) return null;

  // Ensure property.images is an array
  const images = Array.isArray(property.images) ? property.images : [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay css={{ width: "100%", height: "100vh", position: "fixed", top: 0, left: 0, zIndex: 10, transform: "translateZ(0)", backgroundColor: "rgba(0, 0, 0, 0.4)", display: "flex", justifyContent: "center", alignItems: "center" }} />
      <ModalContent  maxWidth="80vw" width="80vw">
        <ModalHeader>{property.title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex direction="column" gap={4}>
            <Box>
              {/* Carousel with images */}
              <Carousel items={images} />
            </Box>

            <Flex direction="column" gap={4}>
              <Text fontSize="lg" fontWeight="bold">
                {property.title}
              </Text>
              <Flex align="center">
                <FaMapMarkerAlt />
                <Text ml={2}>{property.location}</Text>
              </Flex>
              <Flex>
                <Flex align="center" mr={4}>
                  <FaBed />
                  <Text ml={2}>{property.bedrooms} Bedrooms</Text>
                </Flex>
                <Flex align="center" mr={4}>
                  <FaBath />
                  <Text ml={2}>{property.bathrooms} Bathrooms</Text>
                </Flex>
                <Flex align="center">
                  <FaExpandArrowsAlt />
                  <Text ml={2}>{property.area}</Text>
                </Flex>
              </Flex>
              <Text fontSize="xl" fontWeight="bold">
                {property.price}
              </Text>
              <Tag colorScheme="teal" mt={2}>
                {property.category}
              </Tag>
            </Flex>

            <Flex justify="flex-end" mt={4}>
              <Button colorScheme="blue" onClick={() => alert("More details")}>
                More Details
              </Button>
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PropertyDetailModal;
