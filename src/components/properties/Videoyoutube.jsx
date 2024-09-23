import React from 'react';
import { Box, Heading, Stack, AspectRatio, Container } from '@chakra-ui/react';

const VideoSection = ({ src, heading }) => {
  // Extract video ID from the URL
  const extractVideoId = (url) => {
    if (!url) return null; // Return null if url is undefined or empty
    const regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Ensure src is a valid string
  const videoId = typeof src === 'string' ? extractVideoId(src) : null;
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : '';

  return (
    <Container maxW="container.xl" centerContent>
      <Box maxW="4xl" w="95%">
        <AspectRatio ratio={16 / 9} rounded="lg" overflow="hidden">
          <iframe
            src={embedUrl} // Use the formatted embed URL
            frameBorder="0"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={heading} // Use the heading prop for the title attribute
            style={{ width: '100%', height: '100%' }} // Ensures iframe fits the AspectRatio container
          />
        </AspectRatio>
        <Stack mt={4} spacing={2}>
          <Heading as="h2" fontSize="xl" fontWeight="bold">
            {heading} {/* Use the heading prop for the Heading text */}
          </Heading>
        </Stack>
      </Box>
    </Container>
  );
};

export default VideoSection;
