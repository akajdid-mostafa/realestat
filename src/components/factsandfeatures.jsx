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
    MdPool , 
  MdBathroom, 
  MdFitnessCenter, 
  MdGarden, 
  MdBalcony ,
  MdLocalParking, 
  MdRealEstateAgent,
} from 'react-icons/md'; // Replace these with actual icons if they are different
import { RiSofaFill } from "react-icons/ri";
import { GiElevator , GiSecurityGate } from "react-icons/gi";
import { IoDocumentsSharp } from "react-icons/io5";

const FactsAndFeatures = () => {
  return (
    <Box mb={8}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>Facts And Features</Text>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <Flex align="center" spacing={4}>
          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="center" 
            w={12} 
            h={12} 
            bg="blue.100" 
            borderRadius="full"
            mr={4}
          >
            <Icon as={RiSofaFill} color="blue.600" w={6} h={6}  />
          </Box>
          <Box>
            <Text fontWeight="semibold">Furniture </Text>
            <Text color="gray.500">Available</Text>
          </Box>
        </Flex>
        <Flex align="center" spacing={4}>
          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="center" 
            w={12} 
            h={12} 
            bg="blue.100" 
            borderRadius="full"
            mr={4}
          >
            <Icon as={GiElevator} color="blue.600" w={6} h={6} />
          </Box>
          <Box>
            <Text fontWeight="semibold">Elevator</Text>
            <Text color="gray.500">Available</Text>
          </Box>
        </Flex>
        <Flex align="center" spacing={4}>
          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="center" 
            w={12} 
            h={12} 
            bg="blue.100" 
            borderRadius="full"
            mr={4}
          >
            <Icon as={MdLocalParking} color="blue.600" w={6} h={6} />
          </Box>
          <Box>
            <Text fontWeight="semibold">Parking </Text>
            <Text color="gray.500">Available</Text>
          </Box>
        </Flex>
        <Flex align="center" spacing={4}>
          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="center" 
            w={12} 
            h={12} 
            bg="blue.100" 
            borderRadius="full"
            mr={4}
          >
            <Icon as={MdBalcony} color="blue.600" w={6} h={6} />
          </Box>
          <Box>
            <Text fontWeight="semibold">Balcon </Text>
            <Text color="gray.500">Available</Text>
          </Box>
        </Flex>
        <Flex align="center" spacing={4}>
          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="center" 
            w={12} 
            h={12} 
            bg="blue.100" 
            borderRadius="full"
            mr={4}
          >
            <Icon as={MdPool} color="blue.600" w={6} h={6} />
          </Box>
          <Box>
            <Text fontWeight="semibold">Pool </Text>
            <Text color="gray.500">Available</Text>
          </Box>
        </Flex>
        <Flex align="center" spacing={4}>
          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="center" 
            w={12} 
            h={12} 
            bg="blue.100" 
            borderRadius="full"
            mr={4}
          >
            <Icon as={GiSecurityGate} color="blue.600" w={6} h={6} />
          </Box>
          <Box>
            <Text fontWeight="semibold">Guard </Text>
            <Text color="gray.500">Available</Text>
          </Box>
        </Flex>
        <Flex align="center" spacing={4}>
          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="center" 
            w={12} 
            h={12} 
            bg="blue.100" 
            borderRadius="full"
            mr={4}
          >
            <Icon as={MdRealEstateAgent} color="blue.600" w={6} h={6} />
          </Box>
          <Box>
            <Text fontWeight="semibold">Proprietary</Text>
            <Text color="gray.500">Available</Text>
          </Box>
        </Flex>
        <Flex align="center" spacing={4}>
          <Box 
            display="flex" 
            alignItems="center" 
            justifyContent="center" 
            w={12} 
            h={12} 
            bg="blue.100" 
            borderRadius="full"
            mr={4}
          >
            <Icon as={IoDocumentsSharp } color="blue.600" w={6} h={6} />
          </Box>
          <Box>
            <Text fontWeight="semibold">The documents Legal</Text>
            <Text color="gray.500">Available</Text>
          </Box>
        </Flex>
      </SimpleGrid>
    </Box>
  );
};

export default FactsAndFeatures;
