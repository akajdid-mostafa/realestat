import React from 'react';
import { Box, Heading, Text, Image } from '@chakra-ui/react';

const ItemNotFound = () => {
    return (
        <Box textAlign="center" mb={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }} px={{ base: 4, md: 6 }}>
            <Box 
                display="flex" 
                justifyContent="center" 
                mb={4}
            >
                <Image
                    src="/images/foundd.png"
                    alt="Not Found"
                    boxSize={{ base: '200px', md: '300px', lg: '400px' }} // responsive image size
                    objectFit="contain" // ensures image scales correctly
                />
            </Box>
            <Heading 
                as="h1" 
                size={{ base: 'xl', md: '2xl' }} 
                mb={4} 
                color="blue.700"
            >
                No properties found
            </Heading>
            <Text 
                fontSize={{ base: 'md', md: 'lg' }} 
                color="gray.500"
            >
                L'article que vous recherchez n'existe pas ou a été supprimé.
            </Text>
        </Box>
    );
};

export default ItemNotFound;
