import { Box, Button, Container, Flex, Heading, Image, Stack, Text } from "@chakra-ui/react";

const CoreFeatures = ({ firsttitle, title ,text,image }) => {
  return (
    <Container maxW="container.xl" my={20}>
      <Flex direction={{ base: "column", lg: "row" }} align="center" gap={{ base: 14, lg: 20 }}>
        <Stack spacing={2} flex={1}>
          <Text color="rose.600" textTransform="uppercase" fontWeight="semibold" letterSpacing="wider">
            {firsttitle}
          </Text>
          <Heading as="h2" size={{ base: "md", md: "lg", xl: "xl" }} my={3} textTransform="capitalize">
            {title}
          </Heading>
          <Text fontSize="lg" lineHeight="tall">
            {text}
          </Text>
          <Button
            color="white"
            width="fit-content"
            mt={5}
            size="lg"
            bgColor="blue.600"
            borderRadius="full"
            _hover={{
              borderColor: "blue.600",
              boxShadow: "2xl",
            }}
          >
            Contact Us
          </Button>
        </Stack>

        <Box flex={1} position="relative" w="full">
          <Box
            position="relative"
            _before={{
              content: '""',
              position: "absolute",
              width: "full",
              height: "full",
              bottom: { md: "-24", lg: "-20" },
              right: { md: "-16", lg: "-12", xl: "-5" },
              backgroundPosition: "right bottom",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              zIndex: -1,
              display: { base: "none", md: "block" },
            }}
          >
            <Image
              src={image}
              alt="core features"
              objectFit="cover"
              width={{ base: "full", md: "90%", xl: "80%" }}
              height={{ base: "auto", md: "400px", xl: "auto" }}
              borderRadius="lg"
            />
          </Box>
        </Box>
      </Flex>
    </Container>
  );
};

export default CoreFeatures;
