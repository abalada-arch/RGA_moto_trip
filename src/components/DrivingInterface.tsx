import React, { useState, useEffect } from 'react';
import { 
  Navigation, 
  Users, 
  AlertTriangle, 
  Fuel, 
  Coffee, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  MapPin,
  Clock,
  Gauge,
  ThumbsUp,
  Phone
} from 'lucide-react';
import MapComponent from './MapComponent';
import { POI, GPXTrack, RiderStatus } from '../types';

interface DrivingInterfaceProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function DrivingInterface({ activeTab, onTabChange }: DrivingInterfaceProps) {
  const [myStatus, setMyStatus] = useState<'riding' | 'fuel' | 'pause' | 'emergency'>('riding');
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0);
  const [tripDuration, setTripDuration] = useState(0);
  const [fuelLevel, setFuelLevel] = useState(75); // Pourcentage

  // Données du groupe
  const [groupStatus, setGroupStatus] = useState<RiderStatus[]>([
    {
      id: '1',
      name: 'Marc',
      lat: 45.9237,
      lng: 6.8694,
      status: 'riding',
      lastUpdate: new Date(),
      validatedBy: [],
      needsValidation: false
    },
    {
      id: '2',
      name: 'Sophie',
      lat: 45.9200,
      lng: 6.8650,
      status: 'fuel',
      lastUpdate: new Date(Date.now() - 300000),
      statusMessage: 'Station Total',
      validatedBy: ['Marc'],
      needsValidation: true
    },
    {
      id: '3',
      name: 'Pierre',
      lat: 45.9180,
      lng: 6.8600,
      status: 'pause',
      lastUpdate: new Date(Date.now() - 600000),
      statusMessage: 'Pause café',
      validatedBy: [],
      needsValidation: true
    }
  ]);

  const [pois] = useState<POI[]>([]);
  const [gpxTracks] = useState<GPXTrack[]>([]);

  // Simulation données temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setTripDuration(prev => prev + 1);
      // Simulation GPS
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const speed = position.coords.speed ? position.coords.speed * 3.6 : 0;
          setCurrentSpeed(speed);
        },
        () => {},
        { enableHighAccuracy: true }
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const sendStatusUpdate = (status: 'fuel' | 'pause' | 'emergency') => {
    setMyStatus(status);
    // Vibration forte pour feedback
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
    
    // Retour automatique en "riding" après 30s (sauf urgence)
    if (status !== 'emergency') {
      setTimeout(() => setMyStatus('riding'), 30000);
    }
  };

  const validateStatus = (riderId: string) => {
    setGroupStatus(prev => 
      prev.map(rider => 
        rider.id === riderId 
          ? { ...rider, validatedBy: [...rider.validatedBy, 'Vous'] }
          : rider
      )
    );
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
  };

  const startVoiceMessage = () => {
    setIsRecording(true);
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
  };

  const stopVoiceMessage = () => {
    setIsRecording(false);
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
  };

  const renderDrivingContent = () => {
    switch (activeTab) {
      case 'navigation':
        return (
          <div className="space-y-4">
            {/* Données de conduite en temps réel */}
            <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <Gauge className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-white">{currentSpeed.toFixed(0)}</p>
                  <p className="text-sm text-slate-400">km/h</p>
                </div>
                <div className="text-center">
                  <Navigation className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-white">{totalDistance.toFixed(0)}</p>
                  <p className="text-sm text-slate-400">km</p>
                </div>
                <div className="text-center">
                  <Clock className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-white">{Math.floor(tripDuration / 60)}</p>
                  <p className="text-sm text-slate-400">heures</p>
                </div>
              </div>

              {/* Alerte carburant si nécessaire */}
              {fuelLevel < 25 && (
                <div className="bg-red-600/30 border border-red-500 rounded-xl p-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <Fuel className="w-6 h-6 text-red-400" />
                    <div>
                      <p className="font-bold text-red-300">Carburant Bas</p>
                      <p className="text-sm text-red-200">Chercher une station</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Carte navigation plein écran */}
            <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl overflow-hidden">
              <div className="h-96">
                <MapComponent 
                  pois={pois}
                  gpxTracks={gpxTracks}
                  onAddPOI={() => {}}
                  selectedStage={null}
                />
              </div>
            </div>

            {/* Actions rapides conduite */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => sendStatusUpdate('fuel')}
                className="p-6 bg-orange-600/20 border-2 border-orange-500 text-orange-300 rounded-2xl active:bg-orange-600/40 transition-all"
              >
                <Fuel className="w-8 h-8 mx-auto mb-2" />
                <p className="font-bold">ESSENCE</p>
              </button>
              
              <button
                onClick={() => sendStatusUpdate('pause')}
                className="p-6 bg-blue-600/20 border-2 border-blue-500 text-blue-300 rounded-2xl active:bg-blue-600/40 transition-all"
              >
                <Coffee className="w-8 h-8 mx-auto mb-2" />
                <p className="font-bold">PAUSE</p>
              </button>
              
              <button
                onClick={() => sendStatusUpdate('emergency')}
                className="p-6 bg-red-600/20 border-2 border-red-500 text-red-300 rounded-2xl active:bg-red-600/40 transition-all"
              >
                <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                <p className="font-bold">URGENCE</p>
              </button>
            </div>
          </div>
        );

      case 'communication':
        return (
          <div className="space-y-4">
            {/* Intercom simplifié */}
            <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-6 text-center">Intercom Groupe</h3>
              
              {/* Contrôles audio géants */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onTouchStart={startVoiceMessage}
                  onTouchEnd={stopVoiceMessage}
                  onMouseDown={startVoiceMessage}
                  onMouseUp={stopVoiceMessage}
                  className={`p-8 rounded-2xl border-2 transition-all ${
                    isRecording
                      ? 'border-red-500 bg-red-500/30 text-red-300'
                      : 'border-blue-500 bg-blue-500/20 text-blue-400 active:bg-blue-500/40'
                  }`}
                >
                  <div className="text-center">
                    {isRecording ? <MicOff className="w-12 h-12 mx-auto mb-3" /> : <Mic className="w-12 h-12 mx-auto mb-3" />}
                    <p className="font-bold text-xl">
                      {isRecording ? 'PARLER...' : 'APPUYER'}
                    </p>
                    <p className="text-sm opacity-80">
                      {isRecording ? 'Relâcher pour envoyer' : 'Maintenir pour parler'}
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-8 rounded-2xl border-2 transition-all ${
                    isMuted
                      ? 'border-red-500 bg-red-500/20 text-red-400'
                      : 'border-green-500 bg-green-500/20 text-green-400'
                  }`}
                >
                  <div className="text-center">
                    {isMuted ? <VolumeX className="w-12 h-12 mx-auto mb-3" /> : <Volume2 className="w-12 h-12 mx-auto mb-3" />}
                    <p className="font-bold text-xl">
                      {isMuted ? 'MUET' : 'AUDIO'}
                    </p>
                  </div>
                </button>
              </div>

              {/* Messages rapides pour conduite */}
              <div className="grid grid-cols-2 gap-3">
                {['OK reçu', 'Ralentir', 'Danger', 'Tout va bien'].map((message) => (
                  <button
                    key={message}
                    className="p-4 bg-slate-700 text-white rounded-xl active:bg-slate-600 transition-colors font-bold"
                  >
                    {message}
                  </button>
                ))}
              </div>
            </div>

            {/* Statut groupe simplifié */}
            <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6">
              <h4 className="text-lg font-bold text-white mb-4">Groupe</h4>
              
              {groupStatus.filter(rider => rider.needsValidation).length === 0 ? (
                <div className="text-center py-6">
                  <Users className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                  <p className="text-slate-400">Aucune notification groupe</p>
                  <p className="text-sm text-slate-500 mt-1">Les statuts s'afficheront ici</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {groupStatus.filter(rider => rider.needsValidation).map((rider) => (
                    <div key={rider.id} className="bg-slate-700 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full ${
                            rider.status === 'fuel' ? 'bg-orange-500' :
                            rider.status === 'pause' ? 'bg-blue-500' :
                            'bg-red-500'
                          }`} />
                          <div>
                            <p className="font-bold text-white">{rider.name}</p>
                            <p className="text-sm text-slate-300">{rider.statusMessage}</p>
                          </div>
                        </div>
                        
                        {!rider.validatedBy.includes('Vous') && (
                          <button
                            onClick={() => validateStatus(rider.id)}
                            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-bold"
                          >
                            VU
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'emergency':
        return (
          <div className="space-y-4">
            {/* Urgences médicales */}
            <div className="bg-red-600/20 border-2 border-red-500 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-red-300 mb-6 text-center">URGENCES MÉDICALES</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => window.location.href = 'tel:15'}
                  className="p-6 bg-red-600 text-white rounded-2xl active:bg-red-700 transition-colors"
                >
                  <div className="text-center">
                    <Phone className="w-10 h-10 mx-auto mb-2" />
                    <p className="font-bold text-2xl">SAMU</p>
                    <p className="text-lg">15</p>
                  </div>
                </button>
                
                <button
                  onClick={() => window.location.href = 'tel:18'}
                  className="p-6 bg-red-600 text-white rounded-2xl active:bg-red-700 transition-colors"
                >
                  <div className="text-center">
                    <Phone className="w-10 h-10 mx-auto mb-2" />
                    <p className="font-bold text-2xl">POMPIERS</p>
                    <p className="text-lg">18</p>
                  </div>
                </button>
                
                <button
                  onClick={() => window.location.href = 'tel:17'}
                  className="p-6 bg-blue-600 text-white rounded-2xl active:bg-blue-700 transition-colors"
                >
                  <div className="text-center">
                    <Phone className="w-10 h-10 mx-auto mb-2" />
                    <p className="font-bold text-2xl">POLICE</p>
                    <p className="text-lg">17</p>
                  </div>
                </button>
                
                <button
                  onClick={() => window.location.href = 'tel:112'}
                  className="p-6 bg-orange-600 text-white rounded-2xl active:bg-orange-700 transition-colors"
                >
                  <div className="text-center">
                    <Phone className="w-10 h-10 mx-auto mb-2" />
                    <p className="font-bold text-2xl">URGENCES</p>
                    <p className="text-lg">112</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Position actuelle pour secours */}
            <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6">
              <h4 className="text-lg font-bold text-white mb-4">Position Actuelle</h4>
              <div className="bg-slate-700 rounded-xl p-4">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-white font-bold">Position GPS</p>
                  <p className="text-sm text-slate-400">Géolocalisation en cours...</p>
                  <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl">
                    Partager Position
                  </button>
                </div>
              </div>
            </div>

            {/* Hôpitaux proches */}
            <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6">
              <h4 className="text-lg font-bold text-white mb-4">Hôpitaux Proches</h4>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = 'tel:+33450538400'}
                  className="w-full p-4 bg-slate-700 text-white rounded-xl active:bg-slate-600 transition-colors text-left"
                >
                  <p className="font-bold">CH Chamonix</p>
                  <p className="text-sm text-slate-400">+33 4 50 53 84 00 • 2.3 km</p>
                </button>
                
                <button
                  onClick={() => window.location.href = 'tel:+33479417979'}
                  className="w-full p-4 bg-slate-700 text-white rounded-xl active:bg-slate-600 transition-colors text-left"
                >
                  <p className="font-bold">CH Bourg-St-Maurice</p>
                  <p className="text-sm text-slate-400">+33 4 79 41 79 79 • 45 km</p>
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            {/* Interface navigation par défaut */}
            <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl overflow-hidden">
              <div className="h-80">
                <MapComponent 
                  pois={pois}
                  gpxTracks={gpxTracks}
                  onAddPOI={() => {}}
                  selectedStage={null}
                />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div>
      {renderDrivingContent()}
    </div>
  );
}