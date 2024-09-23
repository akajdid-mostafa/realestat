// PropertySummary.js
import React from 'react';
import {
    Box,
    Flex,
    Text,
    Tag,
    Button,
    Icon,
    useBreakpointValue
} from '@chakra-ui/react';
import {
    FaBed,
    FaBath,
    FaExpandArrowsAlt,
    FaMapMarkerAlt,
    FaPhone,
    FaWhatsapp,
} from 'react-icons/fa';
import { SiWhatsapp } from "react-icons/si";
import { FaKitchenSet } from 'react-icons/fa6';

const PropertySummary = ({ title, location, category, bedrooms, kitchens, bathrooms, area, price }) => {
    const callButtonText = useBreakpointValue({ base: "appel", md: "0762544011", lg: "0762544011" });
    const whatssapButtonText = useBreakpointValue({ base: "WhatsApp", md: "Envoyer WhatsApp", lg: "Envoyer WhatsApp" });

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
            <Box mt={{ base: 2, md: 0 }} textAlign={{ base: "left", md: "right", lg: "right" }} >
                <Text fontSize={{ base: "xl", md: "xl", lg: "3xl" }} color="blue.600" fontWeight="bold">
                    {price}
                </Text>
                <Flex mt={{ base: 2, md: 4 }} mb={{ base: 2, md: 0 }} textAlign="right" >
                    <Button
                        leftIcon={<Icon as={FaPhone} />}
                        colorScheme="teal"
                        onClick={() => window.location.href = "tel:123456789"}
                        mr={3}
                        position="relative"
                        zIndex="1"
                        px="4" // Reduced padding on x-axis
                        py="2" // Reduced padding on y-axis
                        color="white"
                        fontWeight="bold"
                        fontSize={{ base: "xs", md: "sm", lg: "md" }} // Smaller font sizes
                        bg="#198754"
                        borderRadius="15px"
                        boxShadow="md"
                        overflow="hidden"
                        transition="all 0.25s"
                        _hover={{
                            color: "#white",
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
                            bg: "#20c997",
                            zIndex: "-1",
                            boxShadow: "md",
                            transition: "all 0.25s",
                        }}
                    >
                        {callButtonText}
                    </Button>
                    <Button
                        leftIcon={<Icon as={SiWhatsapp} />}
                        colorScheme="green"
                        onClick={() => window.open("https://wa.me/123456789", "_blank")}
                        position="relative"
                        zIndex="1"
                        px="4" // Reduced padding on x-axis
                        py="2" // Reduced padding on y-axis
                        color="white"
                        fontWeight="bold"
                        fontSize={{ base: "xs", md: "sm", lg: "md" }} // Smaller font sizes
                        bg="#198754"
                        borderRadius="15px"
                        boxShadow="md"
                        overflow="hidden"
                        transition="all 0.25s"
                        _hover={{
                            color: "#white",
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
                            bg: "#20c997",
                            zIndex: "-1",
                            boxShadow: "md",
                            transition: "all 0.25s",
                        }}
                    >
                        {whatssapButtonText}
                    </Button>
                </Flex>
            </Box>
        </Box>
    );
};

export default PropertySummary;