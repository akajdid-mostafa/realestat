import React from 'react';
import {
  Box,
  Flex,
  Text,
  Icon,
  useBreakpointValue,
  SimpleGrid
} from '@chakra-ui/react';
import {
  MdPool,
  MdBathroom,
  MdFitnessCenter,
  MdGarden,
  MdBalcony,
  MdLocalParking,
  MdRealEstateAgent,
} from 'react-icons/md'; // Replace these with actual icons if they are different
import { RiSofaFill } from "react-icons/ri";
import { GiElevator, GiSecurityGate } from "react-icons/gi";
import { IoDocumentsSharp } from "react-icons/io5";

const FactsAndFeatures = ({
  furnished,
  elevator,
  parking,
  balcony,
  pool,
  Guard,
  Proprietary,
  documents
}) => {
  const iconColor = "blue.600"; // Define a consistent icon color
  const bgColor = "blue.100"; // Define a consistent background color for circles

  return (
    <Box mb={8} width="90%">
      <Box position="relative" mt={2} mb={8}>
        <Box position="absolute"  left={0} top="50%" transform="translateY(-50%)" width="4px" height="100%" bg="blue.600"></Box>
        <Text
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="bold"
          pl={6} // Padding left to give space for the red line
           
        >
          Faits et caractéristiques
        </Text>
      </Box>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <Flex align="center" spacing={4}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            w={12}
            h={12}
            bg={bgColor} // Use consistent background color
            borderRadius="full"
            mr={4}
          >
            <Icon as={RiSofaFill} color={iconColor} w={6} h={6} />
          </Box>
          <Box>
            <Text fontWeight="semibold">Furniture </Text>
            <Text color="gray.500">{furnished}</Text>
          </Box>
        </Flex>
        <Flex align="center" spacing={4}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            w={12}
            h={12}
            bg={bgColor} // Use consistent background color
            borderRadius="full"
            mr={4}
          >
            <Icon as={GiElevator} color={iconColor} w={6} h={6} />
          </Box>
          <Box>
            <Text fontWeight="semibold">Ascenseur</Text>
            <Text color="gray.500">{elevator}</Text>
          </Box>
        </Flex>
        <Flex align="center" spacing={4}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            w={12}
            h={12}
            bg={bgColor} // Use consistent background color
            borderRadius="full"
            mr={4}
          >
            <Icon as={MdLocalParking} color={iconColor} w={6} h={6} />
          </Box>
          <Box>
            <Text fontWeight="semibold">Parking </Text>
          <Text color="gray.500">{parking}</Text>
          </Box>
        </Flex>
        <Flex align="center" spacing={4}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            w={12}
            h={12}
            bg={bgColor} // Use consistent background color
            borderRadius="full"
            mr={4}
          >
            <Icon as={MdBalcony} color={iconColor} w={6} h={6} />
          </Box>
          <Box>
            <Text fontWeight="semibold">Balcon </Text>
            <Text color="gray.500">{balcony}</Text>
          </Box>
        </Flex>
        <Flex align="center" spacing={4}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            w={12}
            h={12}
            bg={bgColor} // Use consistent background color
            borderRadius="full"
            mr={4}
          >
            <Icon as={MdPool} color={iconColor} w={6} h={6} />
          </Box>
          <Box>
            <Text fontWeight="semibold">Piscine </Text>
            <Text color="gray.500">{pool}</Text>
          </Box>
        </Flex>
        <Flex align="center" spacing={4}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            w={12}
            h={12}
            bg={bgColor} // Use consistent background color
            borderRadius="full"
            mr={4}
          >
            <Icon as={GiSecurityGate} color={iconColor} w={6} h={6} />
          </Box>
          <Box>
            <Text fontWeight="semibold">Garde </Text>
            <Text color="gray.500">{Guard}</Text>
          </Box>
        </Flex>
        <Flex align="center" spacing={4}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            w={12}
            h={12}
            bg={bgColor} // Use consistent background color
            borderRadius="full"
            mr={4}
          >
            <Icon as={MdRealEstateAgent} color={iconColor} w={6} h={6} />
          </Box>
          <Box>
            <Text fontWeight="semibold">Propriétaire</Text>
          <Text color="gray.500">{Proprietary}</Text>
          </Box>
        </Flex>
        <Flex align="center" spacing={4}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            w={12}
            h={12}
            bg={bgColor} // Use consistent background color
            borderRadius="full"
            mr={4}
          >
            <Icon as={IoDocumentsSharp} color={iconColor} w={6} h={6} />
          </Box>
          <Box>
            <Text fontWeight="semibold">Les documents juridiques</Text>
            <Text color="gray.500">{documents}</Text>
          </Box>
        </Flex>
      </SimpleGrid>
    </Box>
  );
};

export default FactsAndFeatures;
