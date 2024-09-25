import React, { useState, useEffect } from "react";
import { Box, Flex, VStack, Text, Heading, Stack, Grid } from "@chakra-ui/react";

const sentences = [
    "Ancien bien: résidentiel ou commercial",
    "Propriété: maison ou appartement",
    "Local pro: bureau ou boutique",
    "Terrain: constructible ou agricole",
    "Bien locatif: appartement ou maison de vacances"
];

const imageUrls = [
    "/images/agadir.jpg",
    "/images/casa.jpg",
    "/images/rabat.jpg",
    "/images/marrakech.jpg",
];

// Mock properties data


const Heroservice = () => {
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

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


    return (
        <Flex
            w="full"
            h="auto"
            minHeight={{ base: "30vh", md: "25rem" }}
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

                        <Flex
                            direction="column"
                            align="center"
                            justify="center"
                        >
                            <Grid templateColumns="auto" gap={4} mb={4}>
                                <Heading
                                    as="h1"
                                    size={{ base: "lg", md: "xl", lg: "2xl" }}
                                    color="white"
                                    fontWeight="bold"
                                >
                                    <Box mr={{ base: 0, md: 4 }}>Votre partenaire pour la gestion ou la vente</Box>
                                </Heading>
                            </Grid>
                            <Grid templateColumns="auto">
                                <Heading
                                    as="h1"
                                    size={{ base: "md", md: "lg", lg: "xl" }}
                                    color="white"
                                    fontWeight="bold"
                                >
                                    <Box>
                                        <span className="tf-text">
                                            <span className="item-text">
                                                {sentences[currentSentenceIndex]}
                                            </span>
                                        </span>
                                    </Box>
                                </Heading>

                            </Grid>
                        </Flex>

                        <Box display="flex" justifyContent="center" alignItems="center" width="100%">
                            <Text
                                textAlign="center"
                                color="white"
                                width="70%"
                                fontWeight="bold"
                                mt={{ base: 6, md: 6 }}
                                fontSize={{ base: "md", md: "lg" }}
                            >
                                Découvrez un service complet qui associe l'expertise de la gestion immobilière à des stratégies de vente efficaces. Que vous cherchiez à maximiser votre rendement ou à vendre votre bien au meilleur prix, notre équipe dévouée est là pour vous accompagner à chaque étape.
                            </Text>
                        </Box>
                    </Box>
                </Stack>

            </VStack>
        </Flex>
    );
};

export default Heroservice;