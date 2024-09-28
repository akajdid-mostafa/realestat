import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Flex,
  Text,
  Image,
  IconButton,
  Tag,
  Link,
  HStack,
} from "@chakra-ui/react";
import { CarouselProvider, Slider, Slide } from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import {
  FaBed,
  FaEye,
  FaBath,
  FaExpandArrowsAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { TbListDetails } from "react-icons/tb";
import { useBreakpointValue } from "@chakra-ui/react";

const PopularCard = ({ currentCategory }) => {
  const [gridDisplay, setGridDisplay] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [posts, setPosts] = useState([]);
  const [details, setDetails] = useState([]);
  const totalSlides = posts.length;
  const intervalRef = useRef(null);
  const screenSize = useBreakpointValue({ base: "base", md: "md", lg: "lg" });

  const slidesToShow = useBreakpointValue({ base: 1, md: 2, lg: 3 });

  const transformedData = posts.map((post) => {
    const detail = details.find((detail) => detail.postId === post.id) || {};
    return {
      id: post.id,
      imageSrc: post.img[0] || "/images/card.jpeg",
      title: post.title,
      type: post.type?.type || "Unknown",
      location: post.adress,
      ville: post.ville,
      detail: detail, // Changed '=' to ':' for correct object property assignment
      category: post.category?.name || "Unknown",
      rooms: detail.rooms ,
      bathrooms: detail.bathrooms ,
      area: detail.surface ,
      price: `$${post.prix || "0"}`,
      
    };
  });

  const filteredData = transformedData.filter(
    (card) => card.category === currentCategory
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postsResponse = await fetch(
          "https://immoceanrepo.vercel.app/api/posts"
        );
        const postsData = await postsResponse.json();
        setPosts(postsData);

        const detailsResponse = await fetch(
          "https://immoceanrepo.vercel.app/api/details"
        );
        const detailsData = await detailsResponse.json();
        setDetails(detailsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setGridDisplay(false);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {

    const interval = () => {
      if (window.innerWidth >= 1024) { // Changed from 1524 to 1024 for 'lg'
        setCurrentSlide(prev => (prev + 1) % (filteredData.length - 2));
      }
      else if (window.innerWidth >= 640) {
        setCurrentSlide(prev => (prev + 1) % (filteredData.length - 1));
      } else {
        setCurrentSlide(prev => (prev + 1) % filteredData.length);
      }
    };

    if (gridDisplay) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    } else {
      intervalRef.current = setInterval(interval, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [gridDisplay, filteredData.length, screenSize]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      p={4}
      width="100%"
    >
      <CarouselProvider
        naturalSlideWidth={100}
        naturalSlideHeight={125}
        totalSlides={filteredData.length}
        visibleSlides={slidesToShow}
        infinite={true} // Ensure infinite is set to true
        isIntrinsicHeight={true}
        className="w-full max-w-7xl"
        currentSlide={currentSlide}
      >
        <Slider>
          {filteredData.map((card, index) => (
            <Slide
              key={card.id}
              index={index}
              style={{ margin: "0 10px", width: "100%" }}
            >
              <Box
                className="property-item homeya-box card"
                bg="white"
                borderRadius="md"
                boxShadow="lg"
                overflow="hidden"
                transition="0.3s"
                width="100%"
              >
                <Link
                  href={`/properties?modal=yes&id=${card.id}`}
                  className="images-group"
                >
                  <Box position="relative" height="200px">
                    <Image
                      src={card.imageSrc}
                      alt={card.title}
                      loading="lazy"
                      objectFit="cover"
                      width="100%"
                      height="100%"
                    />
                    <Flex position="absolute" top={2} left={2} gap={2}>
                      {card.category === "Vente" && (
                        <Tag bg="green.900" color="white" fontWeight="bold">
                          {card.category}
                        </Tag>
                      )}
                      {card.category === "Location" && (
                        <Tag bg="red.600" color="white" fontWeight="bold">
                          {card.category}
                        </Tag>
                      )}
                    </Flex>
                    <Flex position="absolute" bottom={2} left={2}>
                      <Tag bg="white" color="black" fontWeight="bold">
                        {card.type}
                      </Tag>
                    </Flex>
                  </Box>
                </Link>
                <Box mt={1} p={4}>
                  <Flex
                    align="center"
                    justify="space-between" // Changed to space-between to push content to edges
                    mt={1}
                  >
                    <Text
                      fontWeight="bold"
                      fontSize="lg"
                      isTruncated
                      cursor="pointer"
                      color="blue.800"
                      _hover={{ textDecoration: "none", color: "inherit" }}
                    >
                      {card.title}
                    </Text>
                    <Tag bg="blue.600" color="white" fontWeight="bold">
                      {card.ville}
                    </Tag>
                  </Flex>

                  <Flex alignItems="center" mt={1}>
                    <FaMapMarkerAlt />
                    <Text ml={1} isTruncated>
                      {card.location}
                    </Text>
                  </Flex>
                  {/* <HStack spacing={4} mt={2}> */}
                  <Flex
                        justify="space-between"
                        mt={2}
                    >
                        {card.detail && card.rooms && (
                            <Flex align="center">
                                <FaBed />
                                <Text ml={1}>{card.rooms} chambre</Text>
                            </Flex>
                        )}
                        {card.detail && card.bathrooms && (
                            <Flex align="center">
                                <FaBath />
                                <Text ml={1}>{card.bathrooms } salle de bain</Text>
                            </Flex>
                        )}
                        {card.detail && card.area && (
                            <Flex align="center">
                                <FaExpandArrowsAlt />
                                <Text ml={1}>{card.area} m²</Text>
                            </Flex>
                        )}
                    </Flex>
                    {/* <Flex alignItems="center">
                      <FaBed />
                      <Text ml={1}>{card.bedrooms} Bedrooms</Text>
                    </Flex>
                    <Flex alignItems="center">
                      <FaBath />
                      <Text ml={1}>{card.bathrooms} Bathrooms</Text>
                    </Flex>
                    <Flex alignItems="center">
                      <FaExpandArrowsAlt />
                      <Text ml={1}>{card.area}</Text>
                    </Flex> */}
                  {/* </HStack> */}
                </Box>
                <Flex
                  justify="space-between"
                  align="center"
                  bg="gray.100"
                  p={4}
                >
                  <Text fontWeight="bold" color="blue.800" fontSize="xl">
                    {card.price}
                  </Text>
                  <Flex>
                    <IconButton
                      aria-label="Details"
                      icon={<TbListDetails />}
                      colorScheme="blue"
                      fontSize={30}
                      mr={2}
                    />
                    <IconButton
                      aria-label="View"
                      icon={<FaEye />}
                      colorScheme="blue"
                      fontSize={25}
                      mr={1}
                    />
                  </Flex>
                </Flex>
              </Box>
            </Slide>
          ))}
        </Slider>
      </CarouselProvider>
    </Box>
  );
};

export default PopularCard;
