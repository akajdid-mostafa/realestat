// Hero.js
import React, { useState, useEffect } from 'react';
import { Box, Flex, VStack, Text, Heading, Stack, Button } from '@chakra-ui/react';
import Filter from './Filter ' // Import the Filter component
import homePageData from '../types/CmsSingleTypes/homePage';

const sentences = ["Dream Home", "Perfect Home", "Real Estate"];

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
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Flex
      w={'full'}
      h={'100vh'}
      minHeight={'31rem'}
      maxHeight={'50rem'}
      backgroundImage={encodeURI(heroImage.data.attributes.url)}
      backgroundSize={'cover'}
      backgroundPosition={'center'}
      direction="column"
    >
      <VStack
        w={'full'}
        px={[4, 8]}
        pb={[6, 0]}
        backgroundColor='blackAlpha.700'
        flex="1"
      >
        <Stack maxWidth={'4xl'} align={['flex-start']} spacing={['2.5rem', '3rem']}>
          <Box className="heading" textAlign="center">
            <Heading as="h1" size="4xl" color="white">
              Find Your <span>  </span>
              <span className="tf-text s1 cd-words-wrapper">
                <span className={`item-text ${isVisible ? 'animate-in' : 'animate-out'}`}>
                  {sentences[currentSentenceIndex]}
                </span>
              </span>
            </Heading>
            <Text className="subtitle body-1" color="white" mt={14} ml={20} mr={20} fontSize={20}>
              We are a real estate agency that will help you find the best residence you dream of, let’s discuss your dream house?
            </Text>
          </Box>
          <Stack direction={['column', 'row']} spacing={['0.5rem', '1rem']}>
            <Button style={{ backgroundColor: "#0165fc", color: "white" }} size="md" borderRadius="md">
              Explorer l'immobilier local
            </Button>
            <Button as={'a'} size="md" bg={'transparent'} color={'whiteAlpha.800'} _hover={{ bg: 'whiteAlpha.400' }}>
              À propos
            </Button>
          </Stack>
        </Stack>
        <Filter /> {/* Use the Filter component here */}
      </VStack>
    </Flex>
  );
};

export default Hero;