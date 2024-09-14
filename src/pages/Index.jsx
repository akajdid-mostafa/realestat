import { Box, Container, ChakraBaseProvider } from "@chakra-ui/react";
import Hero from "../components/Index/Hero";
import Layout from "../components/Index/Layout";
import theme from "../types/CmsSingleTypes/theme";
import Footer from "../components/Index/Footer";
import "../styles/globals.css";
import ContactForm from "../components/Index/ContactForm";
import Cta3 from "../components/Index/cta";
import Popular from "../components/properties/popular-post";
import HomeFinancingSteps from "../components/home";
import Abouta from "../components/Index/abou";
import Counters from "../components/Index/Counters";
import CardService from '../components/service';



const HomePage = ({ siteInfo, isLoading }) => { // Added isLoading to the function parameters
  return (
    <ChakraBaseProvider theme={theme}>
      
        <Layout siteInfo={siteInfo}>
          <Hero />
          <Popular />
          <CardService />
          <HomeFinancingSteps />
          <Abouta />
          <br />
          <Counters />
          <Cta3 />
          <Box>
            <Container maxW="container.xl" py={4}>
              <ContactForm />
            </Container>
          </Box>
          <Footer /> // Moved inside the Layout component
        </Layout>
    </ChakraBaseProvider>
  );
};

export default HomePage;
