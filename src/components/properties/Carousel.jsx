import React, { useState } from "react";
import { Box, IconButton, Text, useBreakpointValue } from "@chakra-ui/react";
import { GrPrevious, GrNext } from "react-icons/gr";
import { MdOutlinePhotoLibrary } from "react-icons/md";

const Carousel = ({ items = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const itemsToShow = useBreakpointValue({
    base: 1,
    md: 1,
    lg: items.length > 1 ? 2 : 1
  });
  const totalItems = items.length;

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(totalItems - (itemsToShow || 1), prevIndex + 1)
    );
  };

  return (
    <Box position="relative" w="full" h={{ base: "300px", md: "400px", lg: "500px" }} bg="gray.200">
      <Box
        display="flex"
        w="full"
        h="full"
        overflow="hidden"
        position="relative"
        bg="gray.200"
      >
        <Box
          display="flex"
          transform={`translateX(-${currentIndex * (100 / (itemsToShow || 1))}%)`}
          transition="transform 0.7s ease-in-out"
          w={`${totalItems * (100 / (itemsToShow || 1))}%`}
          h="full"
        >
          {items.map((url, index) => (
            <Box
              key={index}
              minW={`${100 / (itemsToShow || 1)}%`}
              h="full"
              p={1}
              boxSizing="border-box"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg="gray.200"
            >
              <img
                src={url}
                alt={`Slide ${index + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  backgroundColor: "gray",
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>
      <IconButton
        aria-label="Previous Slide"
        icon={<GrPrevious />}
        position="absolute"
        top="50%"
        left="0"
        transform="translateY(-50%)"
        onClick={handlePrev}
        isDisabled={currentIndex <= 0}
        bg="blue.600"
        color="white"
        size={{ base: "sm", md: "sm", lg: "lg" }}
        _hover={{ bg: "gray.300", color: "black" }}
      />
      <IconButton
        aria-label="Next Slide"
        icon={<GrNext />}
        position="absolute"
        top="50%"
        right="0"
        transform="translateY(-50%)"
        onClick={handleNext}
        isDisabled={currentIndex >= totalItems - (itemsToShow || 1)}
        bg="blue.600"
        color="white"
        size={{ base: "sm", md: "sm", lg: "lg" }}
        _hover={{ bg: "gray.300", color: "black" }}
      />
      <Box
        position="absolute"
        bottom="0"
        left="50%"
        transform="translateX(-50%)"
        p={2}
        bg="blue.600"
        color="white"
        borderRadius="md"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <MdOutlinePhotoLibrary style={{ marginRight: "8px" }} />
        <Text fontSize={{ base: "xs", md: "md", lg: "lg" }} fontWeight="bold">
          {currentIndex + 1} - {Math.min(currentIndex + (itemsToShow || 1), totalItems)} of {totalItems} Images
        </Text>
      </Box>
    </Box>
  );
};

export default Carousel;