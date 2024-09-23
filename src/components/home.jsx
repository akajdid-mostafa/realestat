import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Heading,
    Text,
    Image,
    Stack,
    Flex,
    useBreakpointValue,
} from '@chakra-ui/react';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { steps } from './data';
import { GrNext, GrPrevious } from 'react-icons/gr';

export default function HomeFinancingSteps() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const visibleSlides = useBreakpointValue({ base: 1.2, md: 1.8, lg: 2.2 ,xl:3.2 });
    const naturalSlideHeight = 120;

    const handleAfterSlide = (index) => {
        setCurrentSlide(index);
    };

    return (
        <Box
            bgGradient="linear(to-l, blue.700, blue.500)"
            mx="auto"
            pt={10}
            pb={10}
            textColor="white"
            borderRadius="lg"
            boxShadow="lg"
            w="full"
            h="780"
            display="flex"
            flexDirection="column"
            alignItems="center"
        >
            <CarouselProvider
                naturalSlideWidth={100}
                naturalSlideHeight={naturalSlideHeight}
                totalSlides={steps.length}
                visibleSlides={visibleSlides}
                infinite={false}
                currentSlide={currentSlide}
                onAfterSlide={handleAfterSlide}
            >
                <Box mx={{ base: 10, lg: 40 }}>
                    <Heading as="h1" size="2xl" fontWeight="bold" animation="fadeIn">
                        Votre <Box as="span" color="gray.200">parcours de financement immobilier</Box> commence ici
                    </Heading>
                    <Text fontSize="xl" mb={4} mt={4}>
                        Vous ne savez pas par où commencer ? Suivez les étapes suivantes pour rentrer chez vous en respectant votre budget.
                    </Text>
                    <Flex spaceX={4} alignItems="end" justifyContent="flex-end" mb={8}>
                        <Button
                            as={ButtonBack}
                            p={5}
                            borderRadius="full"
                            bg="white"
                            color="blue.600"
                        >
                            <GrPrevious />
                        </Button>
                        <Button
                            as={ButtonNext}
                            p={5}
                            borderRadius="full"
                            bg={currentSlide === steps.length - 4 ? 'blue.400' : 'white'}
                            color="blue.700"
                            isDisabled={currentSlide === steps.length - 4}
                        >
                            <GrNext />
                        </Button>
                    </Flex>
                    <Slider>
                        <Stack direction="row" spacing={4}>
                            {steps.map((step, index) => (
                                <Slide index={index} key={index}>
                                    <Box
                                        p={4}
                                        bg="white"
                                        color="gray.800"
                                        borderRadius="lg"
                                        boxShadow="lg"
                                        w="full"
                                        maxW="md"
                                        display="flex"
                                        flexDirection="column"
                                        transition="transform 0.3s"
                                        _hover={{ transform: 'scale(1.05)', boxShadow: '2xl' }}
                                        height="400"
                                        mx={2}
                                    >
                                        <Flex justifyContent="center" mb={4}>
                                            <Image
                                                src={step.image}
                                                alt={step.title}
                                                objectFit="contain"
                                                h="full"
                                                w="auto"
                                            />
                                        </Flex>
                                        <Heading as="h2" size="lg" fontWeight="bold" mb={2}>
                                            {step.title}
                                        </Heading>
                                        <Text fontSize="md" flexGrow={1} mb={2}>
                                            {step.description}
                                        </Text>
                                        {step.linkText && (
                                            <Button
                                                as="a"
                                                href={step.linkUrl}
                                                color="blue.600"
                                                fontWeight="bold"
                                            >
                                                {step.linkText}
                                            </Button>
                                        )}
                                    </Box>
                                </Slide>
                            ))}
                        </Stack>
                    </Slider>
                </Box>
            </CarouselProvider>
        </Box>
    );
}