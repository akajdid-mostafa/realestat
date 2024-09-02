import React from 'react';
import {
    Box,
    Button,
    Heading,
    Text,
    Stack,
    Flex,
    SimpleGrid,
    Icon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaMapMarkedAlt, FaStar, FaUserCheck, FaEye } from 'react-icons/fa';

const MotionBox = motion(Box);
const MotionText = motion(Text);
const MotionButton = motion(Button);
const MotionHeading = motion(Heading); // Added MotionHeading

const Cta3 = () => {
    return (
        <MotionBox
            px={{ base: 4, md: 24 }}
            py={{ base: 16, lg: 20 }}
            mx="auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header Section */}
            <Stack spacing={4} textAlign="center" pb={6}>
                <MotionHeading
                    as="h1"
                    fontSize={{ base: '4xl', lg: '5xl' }}
                    fontWeight="bold"
                    transition="transform 0.3s"
                    _hover={{ transform: 'scale(1.05)', color: 'blue.700' }}
                >
                    Trouvez votre prochain <Box as="span" color="blue.600">logement</Box>
                </MotionHeading>
                <MotionText
                    color="gray.400"
                    maxW="xl"
                    mx="auto"
                    mb={4}
                    transition="opacity 0.5s"
                    _hover={{ opacity: 0.8 }}
                >
                    Avec plus d'un million de locations disponibles, il est facile de trouver ce qui vous convient le mieux.
                </MotionText>
            </Stack>

            <Flex flexDirection={{ base: 'column', lg: 'row' }} spacing={4}>
                <MotionBox maxW="xl" pr={{ lg: 16 }} mb={10}>
                    <Heading as="h5" size="lg" mb={6} fontWeight="extrabold">
                        Pourquoi réserver avec Immocean ?
                    </Heading>
                    <Text mb={6} color="gray.900">
                        Immocean vous offre une expertise locale et un service personnalisé
                        pour simplifier votre recherche immobilière. Découvrez des solutions
                        sur mesure et bénéficiez d’un accompagnement professionnel dédié.
                        Faites le choix d’une expérience fluide et sereine avec Immocean pour réaliser
                        votre projet immobilier en toute confiance.
                    </Text>
                    <Flex>
                        <MotionButton
                            colorScheme="blue"
                            size="lg"
                            mr={6}
                            whileHover={{ scale: 1.05 }}
                        >
                            Découvrez Maintenant
                        </MotionButton>
                        <MotionButton
                            as="a"
                            href="/"
                            variant="link"
                            color="blue.600"
                            fontWeight="bold"
                            whileHover={{ color: 'blue.800', scale: 1.05 }}
                        >
                            Plus De Détails
                        </MotionButton>
                    </Flex>
                </MotionBox>

                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
                    <FeatureCard
                        icon={FaMapMarkedAlt}
                        title="Expertise locale"
                        description="Nos agents connaissent parfaitement le marché local pour vous offrir des conseils avisés."
                    />
                    <FeatureCard
                        icon={FaStar}
                        title="Sélection de qualité"
                        description="Nous choisissons des propriétés répondant à des critères stricts pour vous garantir des biens de qualité."
                    />
                    <FeatureCard
                        icon={FaUserCheck}
                        title="Service personnalisé"
                        description="Bénéficiez d'un accompagnement sur mesure adapté à vos besoins spécifiques."
                    />
                    <FeatureCard
                        icon={FaEye}
                        title="Transparence assurée"
                        description="Nous garantissons des informations claires et une communication honnête tout au long du processus."
                    />
                </SimpleGrid>
            </Flex>
        </MotionBox>
    );
};

const FeatureCard = ({ icon, title, description }) => {
    return (
        <MotionBox
            maxW="md"
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            shadow="md"
            whileHover={{ scale: 1.05 }}
            transition="transform 0.3s"
        >
            <Flex alignItems="center" mb={4}>
                <Icon as={icon} w={10} h={10} color="blue.600" />
                <Heading as="h6" size="md" ml={4} fontWeight="bold">{title}</Heading>
            </Flex>
            <Text fontSize="sm" color="gray.700">{description}</Text>
        </MotionBox>
    );
};

export default Cta3;