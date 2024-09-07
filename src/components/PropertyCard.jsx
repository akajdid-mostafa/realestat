import {
  Box,
  IconButton,
  Image,
  Text,
  Flex,
  Tag,
  Link,
} from "@chakra-ui/react";
import {
  FaBed,
  FaEye,
  FaBath,
  FaExpandArrowsAlt,
  FaMapMarkerAlt,
  FaWhatsapp,
} from "react-icons/fa";
import { TbListDetails } from "react-icons/tb";

const PropertyCard = ({ property, onClick }) => {
  return (
    <Box
      className="property-item homeya-box card" // Add 'card' class here if required for additional styling
      bg="white"
      borderRadius="md"
      overflow="hidden"
      boxShadow="lg"
      transition="0.3s"
      p={4}
      maxW="sm"
    >
      {/* // href={`/properties/${property.id}.html`} */}
      <Link
        className="images-group"
        cursor="pointer"
        onClick={() => onClick(property)}
      >
        <Box position="relative">
          <Image
            src={property.imageSrc}
            alt={property.title}
            objectFit="cover"
            borderRadius="md"
            loading="lazy"
          />
          <Flex position="absolute" top={2} left={2} gap={2}>
            {property.type === "Vent" && (
              <Tag bg="green.900" color="white" fontWeight="bold">
                {property.type}
              </Tag>
            )}
            {property.type === "Location" && (
              <Tag bg="red.600" color="white" fontWeight="bold">
                {property.type}
              </Tag>
            )}
          </Flex>
          <Flex position="absolute" bottom={2} left={2}>
            <Tag bg="white" color="black" fontWeight="bold">
              {property.category}
            </Tag>
          </Flex>
        </Box>
      </Link>
      <Box mt={2}>
        <Text
          fontWeight="bold"
          fontSize="lg"
          isTruncated
          cursor="pointer"
          onClick={() => onClick(property)}
        >
          <Link
            // href={`/properties/${property.id}.html`}
            textDecoration="none"
            color="blue.800"
            _hover={{ textDecoration: "none", color: "inherit" }}
            title={property.title}
          >
            {property.title}
          </Link>
        </Text>
        <Flex
          align="center"
          mt={1}
          cursor="pointer"
          onClick={() => onClick(property)}
        >
          <FaMapMarkerAlt />
          <Text ml={1} isTruncated>
            {property.location}
          </Text>
        </Flex>
        <Flex
          justify="space-between"
          mt={2}
          cursor="pointer"
          onClick={() => onClick(property)}
        >
          <Flex align="center">
            <FaBed />
            <Text ml={1}>{property.bedrooms} Bedrooms</Text>
          </Flex>
          <Flex align="center">
            <FaBath />
            <Text ml={1}>{property.bathrooms} Bathrooms</Text>
          </Flex>
          <Flex align="center">
            <FaExpandArrowsAlt />
            <Text ml={1}>{property.area}</Text>
          </Flex>
        </Flex>
        <Flex justify="space-between" mt={4}>
          {property.type === "Vent" && (
            <Text fontWeight="bold" color="blue.800" fontSize="xl">
              {property.price}
            </Text>
          )}
          {property.type === "Location" && (
            <Text fontWeight="bold" color="blue.800" fontSize="xl">
              {property.price}/month
            </Text>
          )}
          <Flex>
            <IconButton
              cursor="pointer"
              onClick={() => onClick(property)}
              href="#"
              aria-label="Details"
              icon={<TbListDetails />}
              colorScheme="blue"
              fontSize={30}
              mr={2}
            />
            <IconButton
              href="#"
              aria-label="View"
              icon={<FaEye />}
              colorScheme="blue"
              fontSize={25}
              mr={1}
            />
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default PropertyCard;
