// components/PropertyCard.js
import { Box, Image, Text, Flex, Tag, Link } from '@chakra-ui/react';
import { FaBed, FaBath, FaExpandArrowsAlt } from 'react-icons/fa';
import { FaMapMarkerAlt } from 'react-icons/fa';

const PropertyCard = ({ property }) => {
    return (
        <Box className="property-item" bg="white" borderRadius="md" overflow="hidden" boxShadow="lg" p={4} maxW="sm">
            <Link href={`/properties/${property.id}`}>
                <Image src={property.imageSrc} alt={property.title} objectFit="cover" borderRadius="md" />
                <Box mt={2}>
                    <Text fontWeight="bold" fontSize="lg">{property.title}</Text>
                    <Flex align="center" mt={1}>
                        <FaMapMarkerAlt />
                        <Text ml={1}>{property.location}</Text>
                    </Flex>
                    <Flex justify="space-between" mt={2}>
                        <Tag colorScheme="purple">{property.category}</Tag>
                        <Text fontWeight="bold">{property.price}</Text>
                    </Flex>
                    <Flex justify="space-between" mt={2}>
                        <Flex align="center">
                            <FaBed />
                            <Text ml={1}>{property.bedrooms} Bedrooms</Text>
                        </Flex>
                        <Flex align="center">
                            <FaBath />
                            <Text ml={1}>{property.bathrooms} Bathrooms</Text>
                        </Flex>
                        <Flex align="center">
                            <FaExpandArrowsAlt />
                            <Text ml={1}>{property.area}</Text>
                        </Flex>
                    </Flex>
                </Box>
            </Link>
        </Box>
    );
};

export default PropertyCard;
