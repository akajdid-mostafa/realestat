import React, { useState, useEffect } from 'react';
import { Box, Flex, VStack, Text, Heading, Stack, Grid } from '@chakra-ui/react';
import Filter from './Filter '; // Import the Filter component
import homePageData from '../types/CmsSingleTypes/homePage';


const sentences = ["Maison de rêve", "Un foyer parfait", "Rêve immobilier", "Luxe et confort"];

const Hero = () => {
  const { heroImage } = homePageData;
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentSentenceIndex(prevIndex => (prevIndex + 1) % sentences.length);
        setIsVisible(true);
      }, 500);
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Flex
      w="full"
      h={{ base: '100vh', md: '100vh' }}  // Adjust height for smaller screens
      minHeight={{ base: '40vh', md: '31rem' }}  // Minimum height for different screens
      maxHeight={{ base: 'none', md: '50rem' }}  // Maximum height for medium screens and up
      backgroundImage={`url(${heroImage.data.attributes.url})`}
      backgroundSize="cover"
      backgroundPosition="center"
      direction="column"
    >
      <VStack
        w="full"
        px={{ base: 4, md: 8 }}  // Padding for smaller screens
        pb={{ base: 6, md: 0 }}  // Padding for smaller screens
        backgroundColor="blackAlpha.700"
        flex="1"
        justifyContent="center"
        align="center"  // Center align items for smaller screens
      >
        <Stack
          maxWidth={{ base: 'full', md: '6xl' }}  // Max width for different screens
          spacing={{ base: '1.5rem', md: '2.5rem' }}  // Spacing for different screens
          textAlign="center"  // Center align text for smaller screens
        >
          <Box className="heading">
            <Heading
              as="h1"
              size={{ base: '2xl', md: '2xl' , lg: '4xl' }}  // Font size for different screens
              color="white"
            >
              <Flex
                direction={{ base: 'column', md: 'row' }}  // Stack items vertically on smaller screens
                align="center"
                justify="center"  // Center items for smaller screens
              >
                <Grid
                  templateColumns="auto"
                  gap={4}
                  mb={{ base: 4, md: 0 }}  // Margin bottom for smaller screens
                >
                  <Box mr={{ base: 0, md: 4 }}>
                    Trouvez votre
                  </Box>
                </Grid>
                <Grid
                  templateColumns="auto"
                >
                  <Box>
                    <span className="tf-text">
                      <span className={`item-text ${isVisible ? 'animate-in' : 'animate-out'}`}>
                        {sentences[currentSentenceIndex]}
                      </span>
                    </span>
                  </Box>
                </Grid>
              </Flex>
            </Heading>
            <Text
              className="subtitle body-1"
              color="white"
              mt={{ base: 6, md: 14 }}  // Margin top for different screens
              mx={{ base: 4, md: 20 }}  // Horizontal margin for different screens
              fontSize={{ base: 'md', md: 'lg' }}  // Font size for different screens
            >
              We are a real estate agency that will help you find the best residence you dream of. Let’s discuss your dream house?
            </Text>
          </Box>
        </Stack>
        <Filter /> {/* Use the Filter component here */}
      </VStack>
    </Flex>
  );
};

export default Hero;
