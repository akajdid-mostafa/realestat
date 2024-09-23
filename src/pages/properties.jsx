import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { Box, Flex, ChakraBaseProvider } from '@chakra-ui/react'; // Combine Chakra UI imports
import theme from '../types/CmsSingleTypes/theme';
import Header from '../components/Header';
import Footer from '../components/Index/Footer';
import '../styles/globals.css';
import Layout from '../components/Index/Layout';
import PropertyList from '../components/properties/PropertyList';
import LoadingAnimation from '../components/Loading';

const Properties = ({ siteInfo }) => {
    const [isLoading, setIsLoading] = useState(true); // Add loading state

    useEffect(() => {
        // Simulate a loading process, e.g., fetching data
        const timer = setTimeout(() => {
            setIsLoading(false); // Set loading to false after a delay
        }, 1000); // Adjust delay as needed

        return () => clearTimeout(timer); // Cleanup the timer
    }, []);



    return (
        <ChakraBaseProvider theme={theme}>
            {isLoading ? (
                        <LoadingAnimation /> // Show loading animation when isLoading is true
                    ) : (
            <Layout siteInfo={siteInfo}>
                <Box>
                        <Flex direction={{ base: 'column', lg: 'row' }}>
                            <Box p={4} flex="1">
                                <PropertyList />
                            </Box>
                        </Flex>
                    <Footer />
                </Box>
            </Layout>
            )}

        </ChakraBaseProvider>
    );
};
export default Properties;
