import React, { useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import PropTypes from 'prop-types';

// Define default container styles
const containerStyle = {
  width: "60%",
  height: "400px", // Default height if not provided
  
};

// Define default center location
const defaultCenter = {
  lat: 37.7749, // Latitude of San Francisco (default)
  lng: -122.4194, // Longitude of San Francisco (default)
};

const Map = ({ height = "400px", center = defaultCenter, zoom = 15 }) => {
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API || "";
  console.log("API Key:", API_KEY); // Add this line to debug API Key issues

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

  return isLoaded ? (
    
    <GoogleMap
      mapContainerStyle={{ ...containerStyle, height }}
      center={center}
      zoom={zoom}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      <Marker position={{ lat: center.lat, lng: center.lng }} />
    </GoogleMap>
  ) : (
    <div>Loading Map...</div>
  );
};

Map.propTypes = {
  height: PropTypes.string, // Optional, defaults to "400px"
  center: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  zoom: PropTypes.number.isRequired,
};

export default Map;
