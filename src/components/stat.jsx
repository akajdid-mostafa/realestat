import React from 'react';
import { Box, Flex, Grid, Text, Heading } from '@chakra-ui/react';

const Stat = () => {
    return (
        <Box bg="gray.900" pb="12">
            <Box bgGradient="linear(to-l, blue.600, blue.700)" h="72">
                <Flex justify="center" align="center" direction="column">
                    <Box mt="12">
                        <Heading size="2xl" fontWeight="black" color="white">En chiffres</Heading>
                    </Box>
                    <Box mt="3" mx="2" textAlign="center">
                        <Text fontSize="xs" color="white">
                            5 ans, une qualité constante et des résultats. Peu importe ce que
                        </Text>
                    </Box>
                </Flex>
            </Box>
            <Flex justify="center" mt={{ base: "-12", md: "-20" }}>
                <Grid
                    templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}
                    gap={3}
                >
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
    <Flex
        direction="column"
        align="center"
        justify="center"
        w={{ base: "10", md: "36", lg: "20" }}
        h={{ base: "10", md: "36", lg: "20" }}
        bg="white"
        shadow="md"
        rounded="lg"
    >
        <Heading
            fontSize={{ base: "lg", md: "2xl", lg: "xl" }}
            fontWeight="extrabold"
            textAlign="center"
            color="gray.800"
        >
            {title}
        </Heading>
        <Text
            mt="1"
            fontSize={{ base: "xs", md: "sm", lg: "xs" }}
            textAlign="center"
            color="gray.600"
        >
            {subtitle}
        </Text>
    </Flex>
);

export default Stat;