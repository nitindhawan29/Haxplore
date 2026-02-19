"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { SimulatedBin } from "@/lib/simulation";

// Fix Leaflet's default icon issue in Next.js
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const activeIcon = L.icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Component to handle flying to location
function MapController({
    center,
    zoom
}: {
    center: [number, number],
    zoom: number
}) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, zoom, { duration: 1.5 });
    }, [center, zoom, map]);
    return null;
}

interface CityMapProps {
    center: [number, number];
    zoom: number;
    bins: SimulatedBin[];
    activeBinId: string | null;
    onBinClick: (bin: SimulatedBin) => void;
    userLocation: { lat: number, lng: number } | null;
}

export default function CityMap({ center, zoom, bins, activeBinId, onBinClick, userLocation }: CityMapProps) {
    return (
        <MapContainer
            key="city-map" /* Fix for React Strict Mode / Re-mounting issues */
            center={center}
            zoom={zoom}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%", zIndex: 0 }}
            zoomControl={false}
        >
            <TileLayer
                attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />

            <MapController center={center} zoom={zoom} />

            {/* User Location Marker */}
            {userLocation && (
                <Marker
                    position={[userLocation.lat, userLocation.lng]}
                    icon={L.icon({
                        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
                        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowSize: [41, 41]
                    })}
                >
                    <Popup>You are here</Popup>
                </Marker>
            )}

            {/* Bins */}
            {bins.map((bin) => (
                <Marker
                    key={bin.id}
                    position={[bin.lat, bin.lng]}
                    icon={activeBinId === bin.id ? activeIcon : icon}
                    eventHandlers={{
                        click: (e) => {
                            L.DomEvent.stopPropagation(e.originalEvent);
                            onBinClick(bin);
                        },
                    }}
                />
            ))}
        </MapContainer>
    );
}
