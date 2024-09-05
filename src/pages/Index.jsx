import { Box, Container, ChakraBaseProvider } from '@chakra-ui/react';
import Hero from '../components/Hero';
import Layout from '../components/Layout';
import theme from '../types/CmsSingleTypes/theme';
import Footer from '../components/Footer';
import '../styles/globals.css';
import ContactForm from '../components/ContactForm';
import Cta3 from '../components/cta';
import Popular from '../components/popular-post';
import Aboutt from '../components/aboutt';
import HomeFinancingSteps from '../components/home';
import Abouta from '../components/abou'
import Stat from '../components/stat'
import Counters from '../components/Counters'


const HomePage = ({ homePage, galleryPage, houses, siteInfo }) => {
    return (
        <ChakraBaseProvider theme={theme}>
            <Layout siteInfo={siteInfo}>
                <Hero />
                <Box 
                    position="relative" 
                    zIndex={1} 
                    mt={{ base:-16,md:-36 }}
                    >
                    <Container maxW="container.xl" py={4}>
                            <ContactForm />
                    </Container>
                </Box>
                <Popular />
                <HomeFinancingSteps />
                <Abouta/>
                <br></br>
                <Counters/>
                <Cta3 />
            </Layout>
            <Footer />
        </ChakraBaseProvider>
    );
};

export default HomePage;