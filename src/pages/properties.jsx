// pages/properties.js
import { Box, Flex, Grid } from '@chakra-ui/react';
import { ChakraBaseProvider } from '@chakra-ui/react';
import theme from '../types/CmsSingleTypes/theme';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FilterSidebar from '../components/FilterSidebar';
import PropertyCard from '../components/PropertyCard';
import { cardData } from '../components/data';
import '../styles/globals.css';  
import Layout from '../components/Layout';

const Properties = ({ siteInfo})  => {
    return (
        <ChakraBaseProvider theme={theme}>
        <Layout siteInfo={siteInfo}>
        <Box>
            <Header />
            <Flex direction={{ base: 'column', lg: 'row' }}>
                <FilterSidebar />
                <Box p={4} flex="1">
                    <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
                        {cardData.map(property => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </Grid>
                </Box>
            </Flex>
            <Footer />
        </Box>
        </Layout>
        
    </ChakraBaseProvider>
        
    );
};

export default Properties;
