import React from "react";
import PropTypes from "prop-types";
import { Box, AspectRatio, Container } from "@chakra-ui/react"; // Import necessary Chakra UI components

// Define default center location
const defaultCenter = {
  lat: 37.7749, // Latitude of San Francisco (default)
  lng: -122.4194, // Longitude of San Francisco (default)
};

const Map = ({ center = defaultCenter, zoom = 15 }) => {
  // Construct the URL for the OpenStreetMap iframe
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${center.lng - 0.05},${center.lat - 0.05},${center.lng + 0.05},${center.lat + 0.05}&layer=mapnik&marker=${center.lat},${center.lng}`;

  return (
    <Container maxW="container.xl" centerContent>
      <Box maxW="4xl" w="95%">
        <AspectRatio ratio={16 / 9} rounded="lg" overflow="hidden">
          <iframe
            width="100%"
            height="100%"
            frameBorder="0"
            scrolling="no"
            marginHeight="0"
            marginWidth="0"
            src={mapUrl}
            style={{ border: "none" }}
          ></iframe>
        </AspectRatio>
      </Box>
    </Container>
  );
};

Map.propTypes = {
  center: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  zoom: PropTypes.number.isRequired,
};

export default Map;
