"use client";

import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { Box } from "@chakra-ui/react";
import Image from 'next/image';
import "leaflet/dist/leaflet.css";
import Link from 'next/link';

// Dynamically import MapContainer with SSR disabled
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });
const ZoomControl = dynamic(() => import("react-leaflet").then(mod => mod.ZoomControl), { ssr: false });

export default function Maps({ center, markers = [] }) {
  const iconCache = useRef({});

  useEffect(() => {
    import("leaflet").then(L => {
      markers.forEach(marker => {
        if (!iconCache.current[marker.iconUrl]) {
          const icon = L.icon({
            iconUrl: marker.iconUrl,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
          });
          iconCache.current[marker.iconUrl] = icon;
        }
      });
    });
  }, [markers]);

  return (
    <Box maxW="7xl" mx="auto" p={4}>
      <Box borderWidth="1px" borderRadius="lg" overflow="hidden" h="800px">
        {Object.keys(iconCache.current).length > 0 && (
          <MapContainer
            center={center}
            zoom={6}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <ZoomControl position="topright" />
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                position={marker.position}
                icon={iconCache.current[marker.iconUrl]}
                
              >
                <Popup>
                  <div className="flex w-64 h-40">
                    <div className="w-2/5 h-full relative">
                      <Link href={`/properties?modal=yes&id=${marker.id}`}>
                        <Image
                          src={marker.imageUrl}
                          alt={marker.title}
                          layout="fill"
                          objectFit="cover"
                          className="rounded-l-md"
                        />
                      </Link>
                    </div>
                    <div className="w-3/5 p-2 bg-white rounded-r-md">
                      <Link href={`/properties?modal=yes&id=${marker.id}`}>
                        <h3 className="text-md font-bold text-blue-600">{marker.title}</h3>
                      </Link>
                      <p className="text-sm text-gray-600 mb-1">{marker.adress}</p>
                      <Link href={`/properties?modal=yes&id=${marker.id}`}>
                        <p className="text-md font-bold text-blue-600">{marker.price}</p>
                      </Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </Box>
    </Box>
  );
}
