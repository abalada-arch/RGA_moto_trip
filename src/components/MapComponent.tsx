import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { POI, GPXTrack } from '../types';

// Fix pour les icônes Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapComponentProps {
  pois: POI[];
  gpxTracks: GPXTrack[];
  onAddPOI: (lat: number, lng: number) => void;
  selectedStage: string | null;
}

function MapClickHandler({ onAddPOI }: { onAddPOI: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onAddPOI(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapComponent({ pois, gpxTracks, onAddPOI, selectedStage }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);

  // Centre de la carte sur les Alpes françaises
  const center: [number, number] = [45.8326, 6.8652];

  const getPOIIcon = (type: POI['type']) => {
    const icons = {
      col: '🏔️',
      pause: '☕',
      fuel: '⛽',
      restaurant: '🍽️',
      viewpoint: '📸',
      hotel: '🏨',
      other: '📍'
    };
    
    return L.divIcon({
      html: `<div style="background: white; border: 2px solid #3B82F6; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 14px;">${icons[type]}</div>`,
      className: 'custom-poi-icon',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
  };

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={center}
        zoom={8}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickHandler onAddPOI={onAddPOI} />
        
        {/* Affichage des POIs */}
        {pois.map((poi) => (
          <Marker
            key={poi.id}
            position={[poi.lat, poi.lng]}
            icon={getPOIIcon(poi.type)}
          >
            <Popup>
              <div className="p-2">
                <h4 className="font-semibold text-slate-900">{poi.name}</h4>
                <p className="text-sm text-slate-600 capitalize">{poi.type}</p>
                {poi.description && (
                  <p className="text-sm text-slate-700 mt-1">{poi.description}</p>
                )}
                <p className="text-xs text-slate-500 mt-2">
                  Ajouté par {poi.addedBy}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Légende des POIs */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-3 z-[1000]">
        <h4 className="text-sm font-semibold text-slate-900 mb-2">Légende</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <span>🏔️</span>
            <span>Cols</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>☕</span>
            <span>Pauses</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>⛽</span>
            <span>Stations</span>
          </div>
        </div>
      </div>
    </div>
  );
}