// components/Header.js
import { Box, Heading } from '@chakra-ui/react';

const Header = () => {
    return (
        <Box p={4} bg="blue.500" color="white">
            <Heading textAlign="center">Property Listings</Heading>
        </Box>
    );
};

export default Header;
