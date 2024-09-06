import React, { useState } from 'react';
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
    IconButton,
    css
} from '@chakra-ui/react';
import { FaBed, FaBath, FaExpandArrowsAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

// Apply custom styles using css prop
const modalContainerStyles = css({
    width: '100%',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 10,
    transform: 'translateZ(0)',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

// Carousel Component
const Carousel = ({ items = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsToShow = 2; // Number of items to show
    const spacing = 16; // Space between images in pixels

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex <= 0 ? Math.max(0, items.length - itemsToShow) : prevIndex - 1
        );
    };

    const handleNext = () => {
        const handleNext = () => {
            setCurrentIndex((prevIndex) =>
                prevIndex >= items.length - itemsToShow ? 0 : prevIndex + 1
            );
        };
    };

    return (
        <Box position="relative" w="full" h="300px">
            <Box
                display="flex"
                w="full"
                h="full"
                overflow="hidden"
                position="relative"
            >
                <Box
                    display="flex"
                    transform={`translateX(-${currentIndex * 100}%)`}
                    transition="transform 0.7s ease-in-out"
                    w="full"
                    h="full"
                >
                    {items.map((item, index) => (
                        <Box key={index} minW="full" h="full">
                            <img
                                src={item.url}
                                alt={`Slide ${index + 1}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </Box>
                    ))}
                </Box>
            </Box>
            <IconButton
                aria-label="Previous Slide"
                icon={<ChevronLeftIcon />}
                position="absolute"
                top="50%"
                left="0"
                transform="translateY(-50%)"
                onClick={handlePrev}
            />
            <IconButton
                aria-label="Next Slide"
                icon={<ChevronRightIcon />}
                position="absolute"
                top="50%"
                right="0"
                transform="translateY(-50%)"
                onClick={handleNext}
            />
        </Box>
    );
};

const PropertyDetailModal = ({ isOpen, onClose, property }) => {
    if (!property) return null;

    // Ensure property.images is an array
    const images = Array.isArray(property.images) ? property.images : [];

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="full">
            <ModalOverlay css={modalContainerStyles} />
            <ModalContent mt={20} maxWidth="80vw" width="80vw">
                <ModalHeader>{property.title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Flex direction="column" gap={4}>
                        <Box>
                            {/* Carousel with images */}
                            <Carousel items={images} />
                        </Box>

                        <Flex direction="column" gap={4}>
                            <Text fontSize="lg" fontWeight="bold">{property.title}</Text>
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
                            <Text fontSize="xl" fontWeight="bold">{property.price}</Text>
                            <Tag colorScheme="teal" mt={2}>{property.category}</Tag>
                        </Flex>

                        <Flex justify="flex-end" mt={4}>
                            <Button colorScheme="blue" onClick={() => alert('More details')}>More Details</Button>
                        </Flex>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default PropertyDetailModal;
