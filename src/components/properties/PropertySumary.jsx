// PropertySummary.js
import React from 'react';
import {
    Box,
    Flex,
    Text,
    Tag,
    Button,
    Icon,
} from '@chakra-ui/react';
import {
    FaBed,
    FaBath,
    FaExpandArrowsAlt,
    FaMapMarkerAlt,
    FaPhone,
    FaWhatsapp,
} from 'react-icons/fa';
import { FaKitchenSet } from 'react-icons/fa6';

const PropertySummary = ({ title, location, category, bedrooms, kitchens, bathrooms, area, price }) => {
    return (
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
                    {title}
                </Text>
                <Flex align="center" mt={{ base: 2, md: 1 }}>
                    <FaMapMarkerAlt color="blue.600" />
                    <Text fontSize={{ base: "sm", md: "md" }} ml={2}>
                        {location}
                    </Text>
                </Flex>
                <Tag fontSize={{ base: "sm", md: "md", lg: "lg" }} bg="blue.600" pb={1} textColor="white" mt={2}>
                    {category}
                </Tag>
                {/* <Flex fontWeight="bold" flexWrap="wrap" mt={2}>
                    <Flex align="center" mr={4} mb={{ base: 2, md: 0 }}>
                        <FaBed />
                        <Text ml={2} fontSize={{ base: "sm", md: "md" }}>
                            {bedrooms} Bedrooms
                        </Text>
                    </Flex>
                    <Flex align="center" mr={4} mb={{ base: 2, md: 0 }}>
                        <FaKitchenSet />
                        <Text ml={2} fontSize={{ base: "sm", md: "md" }}>
                            {kitchens} Kitchen
                        </Text>
                    </Flex>
                    <Flex align="center" mr={4} mb={{ base: 2, md: 0 }}>
                        <FaBath />
                        <Text ml={2} fontSize={{ base: "sm", md: "md" }}>
                            {bathrooms} Bathrooms
                        </Text>
                    </Flex>
                    <Flex align="center" mr={4} mb={{ base: 2, md: 0 }}>
                        <FaExpandArrowsAlt />
                        <Text ml={2} fontSize={{ base: "sm", md: "md" }}>
                            {area}
                        </Text>
                    </Flex>
                </Flex> */}
            </Box>
            <Box mt={{ base: 2, md: 0 }} textAlign="right">
                <Text fontSize={{ base: "lg", md: "xl", lg: "3xl" }} color="blue.600" fontWeight="bold">
                    {price}
                </Text>
                <Flex mt={2}>
                    <Button
                        leftIcon={<Icon as={FaPhone} />}
                        colorScheme="teal"
                        onClick={() => window.location.href = "tel:123456789"}
                        mr={3}
                    >
                        Make a Call
                    </Button>
                    <Button
                        leftIcon={<Icon as={FaWhatsapp} />}
                        colorScheme="green"
                        onClick={() => window.open("https://wa.me/123456789", "_blank")}
                    >
                        Send WhatsApp
                    </Button>
                </Flex>
                <Box position="relative" display="inline-block">
                    <Button
                        leftIcon={<Icon as={FaWhatsapp} />}
                        colorScheme="green"
                        onClick={() => window.open("https://wa.me/123456789", "_blank")}
                        position="relative"
                        zIndex="1"
                        px="6"
                        py="3"
                        color="#212121"
                        fontWeight="extrabold"
                        fontSize="lg"
                        bg="#e8e8e8"
                        borderRadius="15px"
                        boxShadow="md"
                        overflow="hidden"
                        transition="all 0.25s"
                        _hover={{
                            color: "#e8e8e8",
                            _before: {
                                width: "100%",
                            },
                        }}
                        _before={{
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            height: "100%",
                            width: "0",
                            borderRadius: "15px",
                            bg: "#212121",
                            zIndex: "-1",
                            boxShadow: "md",
                            transition: "all 0.25s",
                        }}
                    >
                        Send WhatsApp
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default PropertySummary;