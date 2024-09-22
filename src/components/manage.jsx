import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Image,
  Heading,
  Text,
  Input,
  Textarea,
  Button,
  Checkbox,
  VStack,
} from "@chakra-ui/react";

const PropertyEnquiry = () => {
  

  return (
    <Flex justify="center" align="center" h="100vh" bg="gray.50" p={5}>
      <Flex
        direction={{ base: "column", md: "row" }}
        maxW="1000px"
        w="100%"
        bg="white"
        boxShadow="md"
        borderRadius="md"
      >
        <Box flex="5" p={5} width={{ base: "100%", md: "90%" }}>
          <Image
            src="https://via.placeholder.com/600x400"
            alt="Property"
            borderRadius="md"
            mb={4}
          />
          <Text fontSize="sm" color="gray.600" textTransform="uppercase" mb={2}>
            Properties for Sale
          </Text>
          <Heading as="h1" size="lg" mb={4} fontFamily="serif">
            Explore Good Places
          </Heading>
          <Text color="gray.600" mb={4}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit
            amet nulla auctor, vestibulum magna sed, convallis ex.
          </Text>
          <Text color="gray.600" mb={4}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit
            amet nulla auctor, vestibulum magna sed, convallis ex.
          </Text>
        </Box>
       
      </Flex>
    </Flex>
  );
};

export default PropertyEnquiry;
