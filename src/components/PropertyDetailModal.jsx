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

            {/* New styled component */}
            <Box
              border="1px solid #e2e8f0"
              borderRadius="md"
              p={{ base: 0, md: 4 }}
              boxShadow="md"
              display="flex"
              flexDirection={{ base: "column", md: "row" }}
              justifyContent="space-between"
              justifyItems="start"
              alignItems={{ base: "start", md: "center" }}
            >
              <Box fontWeight="bold">
                <Text fontSize={{ base: "lg", md: "xl" , lg:"2xl" }} color="blue.600">
                  {property.title}
                </Text>
                <Flex align="center" mt={{ base: 2, md: 1 }}>
                  <FaMapMarkerAlt color="blue.600" />
                  <Text fontSize={{ base: "sm", md: "md" }} ml={2}>
                    {property.location}
                  </Text>
                </Flex>
                <Tag fontSize={{ base: "sm", md: "md" , lg:"lg" }} bg="blue.600" pb={1} textColor="white" mt={2}>
                  {property.category}
                </Tag>
              </Box >
              <Box mt={2} mb={2} fontSize={{ base: "lg", md: "xl" , lg:"3xl" }} color="blue.600" fontWeight="bold">
              {property.type === "Vent" && (
                <Text  >
                  {property.price}
                </Text>
              )}
              {property.type === "Location" && (
                <Text >
                  {property.price}/month
                </Text>
              )}
              </Box>
            </Box>

            <Flex direction="column" gap={4}>
              <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">
                Détails de la propriété
              </Text>
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
                    {property.bathrooms} kitchen
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
