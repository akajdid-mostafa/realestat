// pages/properties.js
import { Box, Flex, Grid } from '@chakra-ui/react';
import { ChakraBaseProvider } from '@chakra-ui/react';
import theme from '../types/CmsSingleTypes/theme';
import Header from '../components/Header';
import Footer from '../components/Index/Footer';
import PropertyCard from '../components/properties/PropertyCard';
import { cardData } from '../components/data';
import '../styles/globals.css';
import Layout from '../components/Index/Layout';
import PropertyList from '../components/properties/PropertyList';



const Properties = ({ siteInfo }) => {
    return (
        <ChakraBaseProvider theme={theme}>
            <Layout siteInfo={siteInfo}>
                <Box>
                    <Header />

                    <Flex direction={{ base: 'column', lg: 'row' }}>
                        <Box p={4} flex="1">
                            <PropertyList properties={cardData} />
                        </Box>
                    </Flex>

                    <Footer />
                </Box>
            </Layout>

        </ChakraBaseProvider>

    );
};

export default Properties;
