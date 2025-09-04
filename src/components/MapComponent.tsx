import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { POI, GPXTrack } from '../types';

// Fix pour les icônes Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapComponentProps {
  pois: POI[];
  gpxTracks: GPXTrack[];
  activeNavigationGPXTrack?: GPXTrack | null;
  onAddPOI: (lat: number, lng: number) => void;
  selectedStage: string | null;
  userPosition?: { lat: number; lng: number } | null;
  showUserPosition?: boolean;
}

function MapClickHandler({ onAddPOI }: { onAddPOI: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onAddPOI(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapComponent({ 
  pois, 
  gpxTracks, 
  activeNavigationGPXTrack,
  onAddPOI, 
  selectedStage, 
  userPosition, 
  showUserPosition = false 
}: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null);

  // Centre de la carte sur les Alpes françaises
  const center: [number, number] = userPosition && showUserPosition 
    ? [userPosition.lat, userPosition.lng] 
    : [45.8326, 6.8652];

  // Effet pour centrer la carte sur le tracé GPX actif
  useEffect(() => {
    if (activeNavigationGPXTrack && mapRef.current) {
      const map = mapRef.current;
      const points = activeNavigationGPXTrack.points;
      
      if (points.length > 0) {
        // Calculer les limites du tracé
        const lats = points.map(p => p.lat);
        const lngs = points.map(p => p.lng);
        const bounds = L.latLngBounds(
          [Math.min(...lats), Math.min(...lngs)],
          [Math.max(...lats), Math.max(...lngs)]
        );
        
        // Ajuster la carte pour afficher tout le tracé
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [activeNavigationGPXTrack]);

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

  const getUserPositionIcon = () => {
    return L.divIcon({
      html: `<div style="
        background: #3B82F6; 
        border: 3px solid white; 
        border-radius: 50%; 
        width: 20px; 
        height: 20px; 
        box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        animation: pulse 2s infinite;
      "></div>
      <style>
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
      </style>`,
      className: 'user-position-icon',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };
  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={center}
        zoom={userPosition && showUserPosition ? 15 : 8}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickHandler onAddPOI={onAddPOI} />
        
        {/* Position utilisateur en temps réel */}
        {showUserPosition && userPosition && (
          <Marker
            position={[userPosition.lat, userPosition.lng]}
            icon={getUserPositionIcon()}
          >
            <Popup>
              <div className="p-2">
                <h4 className="font-semibold text-slate-900">Votre Position</h4>
                <p className="text-sm text-slate-600">Position GPS actuelle</p>
                <p className="text-xs text-slate-500 mt-1">
                  {userPosition.lat.toFixed(6)}, {userPosition.lng.toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Affichage des traces GPX */}
        {gpxTracks.map((track) => (
          <Polyline
            key={track.id}
            positions={track.points.map(point => [point.lat, point.lng])}
            color={activeNavigationGPXTrack?.id === track.id ? "#10B981" : "#3B82F6"}
            weight={activeNavigationGPXTrack?.id === track.id ? 6 : 4}
            opacity={activeNavigationGPXTrack?.id === track.id ? 1 : 0.6}
          />
        ))}
        
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
        <div className="space-y-2 text-xs">
          {activeNavigationGPXTrack && (
            <div className="flex items-center space-x-2 pb-2 border-b border-slate-200">
              <div className="w-4 h-1 bg-green-500 rounded"></div>
              <span className="font-medium">Tracé actif</span>
            </div>
          )}
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