// pages/properties.js
// ... existing imports ...
import { useRouter } from 'next/router';
import { Box, Flex, Grid } from '@chakra-ui/react';
import { ChakraBaseProvider } from '@chakra-ui/react';
import theme from '../../../types/CmsSingleTypes/theme';
import Header from '../../../components/Header';
import Footer from '../../../components/Index/Footer';
import '../styles/globals.css';
import Layout from '../../../components/Index/Layout';
import PropertyDetailModal from '../../../components/properties/PropertyDetailModal'



const Detailproperties = ({ siteInfo  }) => {
    const router = useRouter();
    const { id } = router.query; // Extracting the property ID from the URL

    return (
        <ChakraBaseProvider theme={theme}>
            <Layout siteInfo={siteInfo}>
                <Box p={5} shadow="md" borderWidth="1px">
                    <Heading fontSize="xl">Property Details</Heading>
                    <Text mt={4}>ID: {id}</Text>
                    <Text mt={4}>Description: This is a placeholder description.</Text>
                </Box>
            </Layout>
        </ChakraBaseProvider>
    );
};

export default Detailproperties;