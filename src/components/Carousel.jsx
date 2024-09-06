import React, { useState } from "react";
import { Box, IconButton } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

const Carousel = ({ items = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsToShow = 2; // Number of items to show
  const totalItems = items.length;

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(totalItems - itemsToShow, prevIndex + 1)
    );
  };

  return (
    <Box position="relative" w="full" h="400px" bg="gray.200">
      <Box
        display="flex"
        w="full"
        h="full"
        overflow="hidden"
        position="relative"
        bg="gray.200" // Ensure background color for extra space
      >
        <Box
          display="flex"
          transform={`translateX(-${currentIndex * (100 / itemsToShow)}%)`}
          transition="transform 0.7s ease-in-out"
          w={`${totalItems * (100 / itemsToShow)}%`}
          h="full"
        >
          {items.map((item, index) => (
            <Box
              key={index}
              minW={`${100 / itemsToShow}%`}
              h="full"
              p={1}
              boxSizing="border-box"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg="gray.200" // Background color for extra space
            >
              <img
                src={item.url}
                alt={`Slide ${index + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain", // Ensure the entire image fits within the frame
                  backgroundColor: "gray", // Background color for extra space
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>
      <IconButton
        aria-label="Previous Slide"
        icon={<ChevronLeftIcon />}
        position="absolute"
        top="50%"
        left="0"
        transform="translateY(-50%)"
        onClick={handlePrev}
        isDisabled={currentIndex <= 0} // Disable button at the start
      />
      <IconButton
        aria-label="Next Slide"
        icon={<ChevronRightIcon />}
        position="absolute"
        backgroundColor="blue.600"
        top="50%"
        right="0"
        transform="translateY(-50%)"
        onClick={handleNext}
        isDisabled={currentIndex >= totalItems - itemsToShow} // Disable button at the end
      />
    </Box>
  );
};

export default Carousel;
