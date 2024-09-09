import React from 'react';
import { Box, Heading, Stack, AspectRatio } from '@chakra-ui/react';

const VideoSection = ({ src, heading }) => {
  return (
    <Box maxW="4xl"  w="60%">
      <AspectRatio ratio={16 / 9} rounded="lg" overflow="hidden">
        <iframe
          src={src} // Use the src prop for the YouTube video URL
          frameBorder="0"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={heading} // Use the heading prop for the title attribute
          style={{ width: '100%', height: '100%' }} // Ensures iframe fits the AspectRatio container
        />
      </AspectRatio>
      <Stack mt={4} spacing={2}>
        <Heading as="h2" fontSize="2xl" fontWeight="bold">
          {heading} {/* Use the heading prop for the Heading text */}
        </Heading>
      </Stack>
    </Box>
  );
};

export default VideoSection;
