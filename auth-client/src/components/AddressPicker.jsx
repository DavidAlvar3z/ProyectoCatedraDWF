import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Configurar iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

// Custom marker icon con animación
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function AddressPicker({ onSelect, initialPosition, zoom = 13 }) {
  const [position, setPosition] = useState(
    initialPosition || { lat: 13.7034, lng: -89.2345 }
  );

  function LocationMarker() {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
        onSelect({ latitud: e.latlng.lat, longitud: e.latlng.lng });
      }
    });
    return position ? <Marker position={position} icon={customIcon} /> : null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-indigo-200"
    >
      {/* Map info overlay */}
      <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-md rounded-xl px-4 py-3 shadow-lg">
        <div className="flex items-center gap-2 text-sm">
          <i className="fas fa-map-marker-alt text-indigo-600"></i>
          <span className="font-semibold text-gray-700">Haz clic en el mapa para seleccionar</span>
        </div>
        {position && (
          <div className="mt-2 text-xs text-gray-600 flex items-center gap-2">
            <i className="fas fa-crosshairs text-indigo-500"></i>
            <span>
              {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
            </span>
          </div>
        )}
      </div>

      {/* Coordenadas actuales - esquina inferior derecha */}
      {position && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 right-4 z-[1000] bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl px-4 py-2 shadow-lg"
        >
          <div className="flex items-center gap-2 text-xs font-semibold">
            <i className="fas fa-check-circle"></i>
            <span>Ubicación seleccionada</span>
          </div>
        </motion.div>
      )}

      {/* Map Container */}
      <MapContainer
        center={position}
        zoom={zoom}
        style={{ height: '400px', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
      </MapContainer>

      {/* Decorative border animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>
      </div>
    </motion.div>
  );
}