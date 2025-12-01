"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix icon default Leaflet (karena issue dengan webpack)
if (typeof window !== "undefined") {
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
}

const Map = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    // Pastikan kode hanya jalan di client-side
    if (typeof window === "undefined" || !mapRef.current) return;

    // Jika map sudah ada, jangan buat lagi
    if (mapInstanceRef.current) return;

    // Koordinat Telkom University Bandung
    const position = [-6.9734, 107.6297]; // lat, lng

    // Inisialisasi map
    const map = L.map(mapRef.current).setView(position, 16);

    // Tambah tile layer (peta dasar)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Tambah marker
    L.marker(position)
      .addTo(map)
      .bindPopup("<b>Telkom University</b><br>Gedung F")
      .openPopup();

    // Simpan instance map
    mapInstanceRef.current = map;

    // Cleanup saat component unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapRef}
      className="w-full h-96 rounded-lg"
      style={{ minHeight: "400px" }}
    />
  );
};

export default Map;
