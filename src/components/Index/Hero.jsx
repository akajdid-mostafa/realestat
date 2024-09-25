import React, { useState, useEffect } from "react";
import { Box, Flex, VStack, Text, Heading, Stack, Grid } from "@chakra-ui/react";
import PropertySearchPage from "../properties/fillter"; // Import the Filter component
import { useRouter } from 'next/router'; // Import useRouter if you're using Next.js

const sentences = [
  "Maison de rêve",
  "Un foyer parfait",
  "Rêve immobilier",
  "Luxe et confort",
];

const imageUrls = [
  "/images/21009878_6.jpg",
  "/images/image11.jpg",
  "/images/image12.jpg",
  "/images/image13.jpg",
  "/images/image14.jpg",
  "/images/21009878_6.jpg", // Duplicate the first image
];

// Mock properties data


const Hero = () => {
  const showSearch = false; // or false based on your logic

  const [properties, setProperties] = useState([]); // Initialize properties state
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedTab, setSelectedTab] = useState('ALL TYPE'); // Default tab
  const router = useRouter();

  useEffect(() => {
    // Using the provided API endpoint
    fetch("https://immoceanrepo.vercel.app/api/posts")
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // Assuming the data is directly in the format needed
        setProperties(data);
        console.log("Properties fetched successfully:", data);
      })
      .catch(error => {
        console.error('Error fetching properties:', error);
      });
  }, []);

  useEffect(() => {
    const sentenceIntervalId = setInterval(() => {
      setCurrentSentenceIndex(prevIndex => (prevIndex + 1) % sentences.length);
    }, 3000); // Interval for changing sentences

    return () => clearInterval(sentenceIntervalId);
  }, []);

  useEffect(() => {
    const imageIntervalId = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex(prevIndex => {
          if (prevIndex === imageUrls.length - 1) {
            setIsTransitioning(false);
            return 1; // Skip duplicate to create seamless loop
          }
          return prevIndex + 1;
        });
      }, 2000); // Duration of the transition effect
    }, 6000); // Interval for changing images

    return () => clearInterval(imageIntervalId);
  }, []);

  const handleTabChange = (tab) => {
    console.log("Tab changed to:", tab);
    // Additional logic for handling tab change
  };

  const handlePropertyTypeChange = (type) => {
    console.log("Property type changed to:", type);
    // Additional logic for handling property type change
  };

  const handleCityChange = (city) => {
    console.log("City changed to:", city);
    // Additional logic for handling city change
  };

  const handleRoomCountChange = (count) => {
    console.log("Room count changed to:", count);
    // Additional logic for handling room count change
  };

  const handleBathroomsCountChange = (count) => {
    console.log("Bathrooms count changed to:", count);
    // Additional logic for handling bathrooms count change
  };

  const handleHeroSearch = () => {
    const queryParams = new URLSearchParams({
      tab: selectedTab.replace(/\s/g, '+') // Replace spaces with '+' for URL encoding
    }).toString();
    router.push(`/properties?${queryParams}`);
  };

  return (
    <Flex
      w="full"
      h={{ base: "auto", md: "100vh" }}
      minHeight={{ base: "40vh", md: "31rem" }}
      maxHeight={{ base: "none", md: "50rem" }}
      overflow="hidden"
      position="relative"
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        w="full"
        h="full"
        display="flex"
        transition={`transform ${isTransitioning ? '1s' : '0s'} ease-in-out`}
        transform={`translateX(-${currentImageIndex * 100}%)`}
      >
        {imageUrls.map((url, index) => (
          <Box
            key={index}
            flex="none"
            w="full"
            h="full"
            backgroundImage={`url(${url})`}
            backgroundSize="cover"
            backgroundPosition="center"
          />
        ))}
      </Box>
      <VStack
        w="full"
        px={{ base: 4, md: 8 }}
        pb={{ base: 6, md: 0 }}
        backgroundColor="blackAlpha.700"
        flex="1"
        justifyContent="center"
        align="center"
        position="relative"
        zIndex={1}
      >
        <Stack
          maxWidth={{ base: "full", md: "6xl" }}
          spacing={{ base: "1.5rem", md: "2.5rem" }}
          textAlign="center"
        >
          <Box className="heading">
            <Heading
              as="h1"
              size={{ base: "2xl", md: "2xl", lg: "4xl" }}
              color="white"
            >
              <Flex
                direction={{ base: "column", md: "row" }}
                align="center"
                justify="center"
              >
                <Grid templateColumns="auto" gap={4} mb={{ base: 4, md: 0 }}>
                  <Box mr={{ base: 0, md: 4 }}>Trouvez votre</Box>
                </Grid>
                <Grid templateColumns="auto">
                  <Box>
                    <span className="tf-text">
                      <span className="item-text">
                        {sentences[currentSentenceIndex]}
                      </span>
                    </span>
                  </Box>
                </Grid>
              </Flex>
            </Heading>
            <Box display="flex" justifyContent="center" alignItems="center" width="100%">
              <Text
                textAlign="center"
                color="white"
                width="70%"
                fontWeight="bold"
                mt={{ base: 6, md: 14 }}
                mx={{ base: 4, md: 20 }}
                fontSize={{ base: "md", md: "lg" }}
              >
                We are a real estate agency that will help you find the best
                residence you dream of. Let’s discuss your dream house?
              </Text>
            </Box>
          </Box>
        </Stack>
        <PropertySearchPage
          properties={properties} // Pass fetched properties to PropertySearchPage
          onTabChange={handleTabChange}
          onPropertyTypeChange={handlePropertyTypeChange}
          onCityChange={handleCityChange}
          onRoomCountChange={handleRoomCountChange}
          onBathroomsCountChange={handleBathroomsCountChange}
          searchDisplay={showSearch ? 'block' : 'none'} // Set display value based on condition
          num={3}
        />
      </VStack>
    </Flex>
  );
};

export default Hero;