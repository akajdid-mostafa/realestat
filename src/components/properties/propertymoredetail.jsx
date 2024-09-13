import React from "react";
import {
    Box,
    Flex,
    Text,
    Divider,
} from "@chakra-ui/react";

const PropertyMoreDetail = ({
    rooms,
    bedrooms,
    kitchens,
    bathrooms,
    area,
    yearBuilt,
    floor,
    facing
}) => {
    // Check if all props are null
    if (!rooms && !bedrooms && !kitchens && !bathrooms && !area && !yearBuilt && !floor && !facing) {
        return null; // Do not render the component
    }

    // Collect all items in an array
    const items = [
        rooms && { label: "Nombre de pièces :", value: rooms },
        bedrooms && { label: "Chambres à coucher :", value: bedrooms },
        kitchens && { label: "Cuisine :", value: kitchens },
        bathrooms && { label: "Salles de bains :", value: bathrooms },
        area && { label: "Surface :", value: `${area} m²` },
        yearBuilt && { label: "Construction year :", value: yearBuilt },
        floor && { label: "Floor :", value: floor },
        facing && { label: "Faces :", value: facing }
    ].filter(Boolean); // Filter out undefined items

    // Determine the split point for the items
    const splitIndex = Math.ceil(items.length / 2);

    // Split items into two groups
    const firstBoxItems = items.slice(0, splitIndex);
    const secondBoxItems = items.slice(splitIndex);

    return (
        <Flex direction="column" gap={4}>
            <Box position="relative" mt={4} mb={4}>
                <Box position="absolute" left={0} top="50%" transform="translateY(-50%)" width="4px" height="100%" bg="blue.600"></Box>
                <Text
                    fontSize={{ base: "xl", md: "2xl" }}
                    fontWeight="bold"
                    pl={6}
                // Padding left to give space for the red line
                >
                    Propriété Plus de détails
                </Text>
            </Box>

            <Box className="property-details-chart mt-2" width="95%" mb={8}>
                <Box bg="blue.50" p={4} rounded="md" shadow="md">
                    <Flex
                        direction={["column", "row"]}
                        justify="space-between"
                        align="flex-start"
                    >
                        <Box flex="1" pr={4} fontWeight={{ base: "semibold", md: "bold" }}>
                            <Flex direction="column" gap={2} my={4}>
                                {firstBoxItems.map(item => (
                                    <Flex justify="space-between" key={item.label}>
                                        <Text fontSize="md" lineHeight="2">{item.label}</Text>
                                        <Text textAlign="start" fontSize="md" lineHeight="2">{item.value}</Text>
                                    </Flex>
                                ))}
                            </Flex>
                        </Box>
                        <Divider
                            orientation="vertical"
                            borderColor="blue.800"
                            display={["none", "block"]}
                            borderWidth="1.5px"
                            mr={6}
                        />
                        <Box flex="1" fontWeight={{ base: "semibold", md: "bold" }}>
                            <Flex direction="column" gap={2} my={4}>
                                {secondBoxItems.map(item => (
                                    <Flex justify="space-between" key={item.label}>
                                        <Text fontSize="md" lineHeight="2">{item.label}</Text>
                                        <Text fontSize="md" lineHeight="2">{item.value}</Text>
                                    </Flex>
                                ))}
                            </Flex>
                        </Box>
                    </Flex>
                </Box>
            </Box>
        </Flex>
    );
};

export default PropertyMoreDetail;
