import React from 'react';
import { Box, Flex, Grid, Text, Heading } from '@chakra-ui/react';

const Stat = () => {
    return (
        <Box bg="gray.900" pb="20">
            <Box bgGradient="linear(to-l, blue.600, blue.700)" h="96">
                <Flex justify="center" align="center" direction="column">
                    <Box mt="20">
                        <Heading size="4xl" fontWeight="black" color="white">En chiffres</Heading>
                    </Box>
                    <Box mt="6" mx="2" textAlign="center">
                        <Text fontSize="sm" color="white">5 ans, une qualité constante et des résultats. Peu importe ce que</Text>
                    </Box>
                </Flex>
            </Box>
            <Flex justify="center" mt={{ base: "-20", md: "-28" }}>
                <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={6}>
                    <StatBox title="40+" subtitle="Des clients heureux" />
                    <StatBox title="540+" subtitle="Projets achevés" />
                    <StatBox title="300" subtitle="Membres dévoués" />
                    <StatBox title="25+" subtitle="Prix remportés" />
                </Grid>
            </Flex>
        </Box>
    );
}

const StatBox = ({ title, subtitle }) => (
    <Flex direction="column" align="center" justify="center" w={{ base: "36", md: "44", lg: "56" }} h={{ base: "36", md: "48", lg: "56" }} bg="white" shadow="md" rounded="2xl">
        <Heading fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }} fontWeight="extrabold" textAlign="center" color="gray.800">{title}</Heading>
        <Text mt="4" fontSize={{ base: "sm", md: "base", lg: "lg" }} textAlign="center" color="gray.600">{subtitle}</Text>
    </Flex>
);

export default Stat;