"use client";
import dynamic from "next/dynamic";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

const FixMapCenter = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, map.getZoom(), { animate: true });
  }, [map, position]);
  return null;
};

const MapInner = () => {
  // 🗺️ Koordinat lokasi marker
  const markerPosition = [-6.976892539590171, 107.63101589759397];

  // Fungsi untuk buka Google Maps
  const openGoogleMaps = () => {
    const [lat, lng] = markerPosition;
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, "_blank"); // buka tab baru
  };

  return (
    <MapContainer
      center={markerPosition}
      zoom={16}
      className="w-full h-[500px] rounded-xl shadow-md z-0"
    >
      <FixMapCenter position={markerPosition} />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={markerPosition} eventHandlers={{ click: openGoogleMaps }}>
        <Popup>
          <div className="text-center">
            <button
              onClick={openGoogleMaps}
              className="text-blue-600 underline mt-1 hover:text-blue-800"
            >
                <p className="font-semibold">Gedung F - HUMIC</p>
            </button>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default dynamic(() => Promise.resolve(MapInner), { ssr: false });
