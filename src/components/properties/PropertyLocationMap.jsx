import React, { useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import PropTypes from 'prop-types';
import { Box, AspectRatio, Container } from '@chakra-ui/react'; // Import necessary Chakra UI components

// Define default center location
const defaultCenter = {
  lat: 37.7749, // Latitude of San Francisco (default)
  lng: -122.4194, // Longitude of San Francisco (default)
};

// Define a container for the map for better styling, similar to a video embed
const mapWrapperStyle = {
  padding: "0",
  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
  borderRadius: "4px",
  overflow: "hidden",
  position: "relative",
  width: "95%",
  paddingBottom: "56.25%", // Maintains a 16:9 aspect ratio
  height: 0,
  backgroundColor: "#f5f5f5", // Consistent background color
};

const mapContainerStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  border: "1px solid #ccc" // Consistent border color
};

const Map = ({ center = defaultCenter, zoom = 15 }) => {
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API || "";
  console.log("API Key:", API_KEY); // Debug API Key issues

  const [map, setMap] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: API_KEY,
  });

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  return (
    <Container maxW="container.xl" centerContent>
      <Box maxW="4xl" w="95%">
        <AspectRatio ratio={16 / 9} rounded="lg" overflow="hidden">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '100%', border: 'none' }}
              center={center}
              zoom={zoom}
              onLoad={onLoad}
              onUnmount={onUnmount}
            >
              <Marker position={{ lat: center.lat, lng: center.lng }} />
            </GoogleMap>
          ) : (
            <div>Loading Map...</div>
          )}
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
