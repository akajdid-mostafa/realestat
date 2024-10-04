import React from 'react';
import { Box, IconButton, Image, Text, Flex, Tag, Link } from "@chakra-ui/react";
import { FaBed, FaEye, FaCity, FaBath, FaExpandArrowsAlt, FaMapMarkerAlt } from "react-icons/fa";
import { useRouter } from 'next/router';

const PropertyCard = ({ property, onClick }) => {
    const router = useRouter();

    const handleClick = () => {
        onClick(property);
        router.push({
            pathname: '/properties',
            query: { modal: 'yes', id: property.id },
        });
    };

    return (
        <Box
            bg="white"
            borderRadius="md"
            overflow="hidden"
            boxShadow="lg"
            transition="0.3s ease-in-out"
            p={4}
            maxW="sm"
            _hover={{
                boxShadow: "xl",
                transform: "scale(1.05)"
            }}
            cursor="pointer"
        >
            <Link
                cursor="pointer"
                onClick={handleClick}
            >
                <Box position="relative" height="200px">
                    <Image
                        src={property.img[0]} // Updated for API data
                        alt={property.title}
                        objectFit="cover"
                        borderRadius="md"
                        loading="lazy"
                        height="100%"
                        width="100%"
                    />
                    <Flex position="absolute" top={2} left={2} gap={2}>
                        {property.categoryId === 2 && (
                            <Tag bg="red.600" color="white" fontWeight="bold">
                                {property.category.name}
                            </Tag>
                        )}
                        {property.categoryId === 1 && (
                            <Tag bg="green.900" color="white" fontWeight="bold">
                                {property.category.name}
                            </Tag>
                        )}
                    </Flex>

                    {/* <Flex position="absolute" bottom={2} left={2}>
                        <Tag bg="white" color="black" fontWeight="bold">
                            {property.type.type}
                        </Tag>
                    </Flex> */}
                </Box>
            </Link>
            <Box mt={2}>
                <Link
                    cursor="pointer"
                    onClick={handleClick}
                    _hover={{ textDecoration: "none" }}
                >
                    <Flex
                        align="center"
                        justify="space-between" // Changed to space-between to push content to edges
                        mt={1}
                    >
                        <Text
                            fontWeight="bold"
                            fontSize="lg"
                            isTruncated
                            cursor="pointer"
                            color="blue.800"
                            _hover={{ textDecoration: "none", color: "inherit" }}
                        >
                            {property.title}
                        </Text>
                        <Tag bg="blue.600" color="white" fontWeight="bold">
                            {property.ville}
                        </Tag>
                    </Flex>
                    <Flex
                        align="center"
                        justify="space-between" // Changed to space-between to push content to edges
                        mt={1}
                    >
                        <Flex 
                        align="center"
                        >
                            <FaMapMarkerAlt />
                            <Text ml={1} isTruncated>
                                {property.adress}
                            </Text>
                        </Flex>
                    </Flex>
                    <Flex
                        justify="space-between"
                        mt={2}
                    >
                        {property.Detail && property.Detail.rooms && (
                            <Flex align="center">
                                <FaBed />
                                <Text ml={1}>{property.Detail.rooms} chambre</Text>
                            </Flex>
                        )}
                        {property.Detail && property.Detail.bathrooms && (
                            <Flex align="center">
                                <FaBath />
                                <Text ml={1}>{property.Detail.bathrooms} salle de bain</Text>
                            </Flex>
                        )}
                        {property.Detail && property.Detail.surface && (
                            <Flex align="center">
                                <FaExpandArrowsAlt />
                                <Text ml={1}>{property.Detail.surface} m²</Text>
                            </Flex>
                        )}
                    </Flex>
                </Link>
                <Flex justify="space-between" mt={4}>
                    <Tag p={1.5} bg="blue.600" color="white" fontWeight="bold" fontSize="xl">
                        {property.prix}
                    </Tag>
                    <Flex>
                        <Tag color="black" fontWeight="bold">
                            ID : {property.id}
                        </Tag>
                    </Flex>
                </Flex>
            </Box>
        </Box>
    );
};

export default PropertyCard;
