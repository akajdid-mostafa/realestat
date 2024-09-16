import React, { useState, useEffect } from 'react';
import { Box, Container, ChakraBaseProvider } from "@chakra-ui/react";
import Hero from "../components/Index/Hero";
import Layout from "../components/Index/Layout";
import theme from "../types/CmsSingleTypes/theme";
import Footer from "../components/Index/Footer";
import "../styles/Carousel.module.scss";
import "../styles/globals.css";
import ContactForm from "../components/Index/ContactForm";
import Cta3 from "../components/Index/cta";
import Popular from "../components/properties/popular-post";
import HomeFinancingSteps from "../components/home";
import Abouta from "../components/Index/abou";
import Counters from "../components/Index/Counters";
import CardService from '../components/service';
import LoadingAnimation from '../components/Loading';




const HomePage = ({ siteInfo }) => { // Added isLoading to the function parameters
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
          <Footer /> 
        </Layout>
         )}
    </ChakraBaseProvider>
  );
};

export default HomePage;
