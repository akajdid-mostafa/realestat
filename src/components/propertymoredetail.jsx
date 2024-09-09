import React from "react";
import {
    Box,
    Flex,
    Text,
    Divider,
} from "@chakra-ui/react";

const PropertyMoreDetail = ({
    bedrooms,
    kitchens,
    bathrooms,
    area,
    yearBuilt,
    floor,
    facing,
    legalDocuments
}) => {
    return (
        <Flex direction="column" gap={4}>
            <Text
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="bold"
            >
                Property More Detail
            </Text>
            <Box className="property-details-chart my-10" width="100%">
                <Box bg="gray.50" p={4} rounded="md" shadow="md">
                    <Flex
                        direction={["column", "row"]}
                        justify="space-between"
                        align={["flex-start", "center"]}
                    >
                        <Box flex="1" pr={4}>
                            <Flex direction="row" gap={14} my={4}>
                                <Box>
                                    <Text fontSize="md" color="gray.600" lineHeight="2">
                                        Chambres à coucher :
                                    </Text>
                                    <Text fontSize="md" color="gray.600" lineHeight="2">
                                        Cuisine :
                                    </Text>
                                    <Text fontSize="md" color="gray.600" lineHeight="2">
                                        Salles de bains :
                                    </Text>
                                    <Text fontSize="md" color="gray.600" lineHeight="2">
                                        Surface :
                                    </Text>
                                </Box>
                                <Box>
                                    <Text fontSize="md" fontWeight="semibold" lineHeight="2">
                                        {bedrooms}
                                    </Text>
                                    <Text fontSize="md" fontWeight="semibold" lineHeight="2">
                                        {kitchens}
                                    </Text>
                                    <Text fontSize="md" fontWeight="semibold" lineHeight="2">
                                        {bathrooms}
                                    </Text>
                                    <Text fontSize="md" fontWeight="semibold" lineHeight="2">
                                        {area}
                                    </Text>
                                </Box>
                            </Flex>
                        </Box>
                        {/* Vertical Divider */}
                        <Divider
                            orientation="vertical"
                            borderColor="gray.800"
                            display={["none", "block"]}
                            minHeight="150px" // Set a specific minimum height
                            borderWidth="1.5px"
                            mr={6}
                        />
                        <Box flex="1">
                            <Flex direction="row" gap={8} my={4}>
                                <Box>
                                    <Text fontSize="md" color="gray.600" lineHeight="2">
                                        Construction year :
                                    </Text>
                                    <Text fontSize="md" color="gray.600" lineHeight="2">
                                        Floor :
                                    </Text>
                                    <Text fontSize="md" color="gray.600" lineHeight="2">
                                        Faces :
                                    </Text>
                                    <Text fontSize="md" color="gray.600" lineHeight="2">
                                        Les documents juridiques :
                                    </Text>
                                </Box>
                                <Box>
                                    <Text fontSize="md" fontWeight="semibold" lineHeight="2">
                                        {yearBuilt}
                                    </Text>
                                    <Text fontSize="md" fontWeight="semibold" lineHeight="2">
                                        {floor}
                                    </Text>
                                    <Text fontSize="md" fontWeight="semibold" lineHeight="2">
                                        {facing}
                                    </Text>
                                    <Text fontSize="md" fontWeight="semibold" lineHeight="2">
                                        {legalDocuments}
                                    </Text>
                                </Box>
                            </Flex>
                        </Box>
                    </Flex>
                </Box>
            </Box>
        </Flex>
    );
};

export default PropertyMoreDetail;
