import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Download, BarChart3, Navigation, Gauge, TrendingUp, Clock, MapPin, Fuel, Coffee } from 'lucide-react';
import { TripRecording, TripStats } from '../types';

export default function TripRecorderSection() {
  const [isRecording, setIsRecording] = useState(true); // Auto-démarré
  const [currentRecording, setCurrentRecording] = useState<TripRecording | null>(null);
  const [autoRecording, setAutoRecording] = useState(true);
  const [lastMovementTime, setLastMovementTime] = useState<number>(Date.now());
  const [tripStats, setTripStats] = useState<TripStats>({
    totalDistance: 0,
    totalDuration: 0,
    averageSpeed: 0,
    maxSpeed: 0,
    maxLean: 0,
    fuelStops: 0,
    pauseCount: 0,
    recordings: []
  });

  const watchIdRef = useRef<number | null>(null);
  const orientationRef = useRef<DeviceOrientationEvent | null>(null);
  const lastPositionRef = useRef<GeolocationPosition | null>(null);
  const autoStopTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Demander les permissions au montage
  useEffect(() => {
    requestPermissions();
    if (autoRecording) {
      startAutoRecording();
    }
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (autoStopTimeoutRef.current) {
        clearTimeout(autoStopTimeoutRef.current);
      }
    };
  }, []);

  const requestPermissions = async () => {
    try {
      // Permission géolocalisation
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(() => {}, () => {});
      }

      // Permission orientation (iOS)
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        await (DeviceOrientationEvent as any).requestPermission();
      }

      // Écouter l'orientation
      window.addEventListener('deviceorientation', handleOrientation);
    } catch (error) {
      console.log('Permissions non accordées');
    }
  };

  const startAutoRecording = () => {
    if (!autoRecording || isRecording) return;
    
    const recording: TripRecording = {
      id: Date.now().toString(),
      startTime: new Date(),
      isRecording: true,
      distance: 0,
      duration: 0,
      averageSpeed: 0,
      maxSpeed: 0,
      maxLean: 0,
      coordinates: [],
      stageName: `Trajet Auto ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
    };

    setCurrentRecording(recording);
    setIsRecording(true);
    startGPSTracking();
  };

  const checkForMovement = (position: GeolocationPosition) => {
    const speed = position.coords.speed ? position.coords.speed * 3.6 : 0; // km/h
    
    if (speed > 5) { // En mouvement si > 5 km/h
      setLastMovementTime(Date.now());
      
      // Annuler l'arrêt automatique si on bouge
      if (autoStopTimeoutRef.current) {
        clearTimeout(autoStopTimeoutRef.current);
        autoStopTimeoutRef.current = null;
      }
    } else if (speed < 2) { // Arrêté si < 2 km/h
      // Démarrer le timer d'arrêt automatique (5 minutes)
      if (!autoStopTimeoutRef.current && autoRecording) {
        autoStopTimeoutRef.current = setTimeout(() => {
          if (isRecording) {
            stopRecording();
          }
        }, 5 * 60 * 1000); // 5 minutes
      }
    }
  };

  const handleOrientation = (event: DeviceOrientationEvent) => {
    orientationRef.current = event;
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const calculateLeanAngle = (orientation: DeviceOrientationEvent): number => {
    if (!orientation.gamma) return 0;
    return Math.abs(orientation.gamma);
  };

  const startGPSTracking = () => {
    // Démarrer le suivi GPS
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        checkForMovement(position);
        
        if (currentRecording && lastPositionRef.current) {
          const distance = calculateDistance(
            lastPositionRef.current.coords.latitude,
            lastPositionRef.current.coords.longitude,
            position.coords.latitude,
            position.coords.longitude
          );
          
          const speed = position.coords.speed ? position.coords.speed * 3.6 : 0;
          const leanAngle = orientationRef.current ? calculateLeanAngle(orientationRef.current) : 0;
          
          setCurrentRecording(prev => {
            if (!prev) return null;
            
            const newDistance = prev.distance + distance;
            const newDuration = (Date.now() - prev.startTime.getTime()) / 60000; // minutes
            const newAverageSpeed = newDuration > 0 ? (newDistance / newDuration) * 60 : 0;
            
            return {
              ...prev,
              distance: newDistance,
              duration: newDuration,
              averageSpeed: newAverageSpeed,
              maxSpeed: Math.max(prev.maxSpeed, speed),
              maxLean: Math.max(prev.maxLean, leanAngle),
              coordinates: [...prev.coordinates, {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                altitude: position.coords.altitude,
                timestamp: new Date(),
                speed: speed,
                leanAngle: leanAngle
              }]
            };
          });
        }
        
        lastPositionRef.current = position;
      },
      (error) => {
        console.error('Erreur GPS:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000
      }
    );
  };

  const startRecording = () => {
    const recording: TripRecording = {
      id: Date.now().toString(),
      startTime: new Date(),
      isRecording: true,
      distance: 0,
      duration: 0,
      averageSpeed: 0,
      maxSpeed: 0,
      maxLean: 0,
      coordinates: [],
      stageName: `Trajet ${tripStats.recordings.length + 1}`
    };

    setCurrentRecording(recording);
    setIsRecording(true);
    startGPSTracking();

    // Vibration de démarrage
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
  };

  const stopRecording = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    if (autoStopTimeoutRef.current) {
      clearTimeout(autoStopTimeoutRef.current);
      autoStopTimeoutRef.current = null;
    }

    if (currentRecording) {
      const finalRecording = {
        ...currentRecording,
        endTime: new Date(),
        isRecording: false
      };

      setTripStats(prev => ({
        ...prev,
        totalDistance: prev.totalDistance + finalRecording.distance,
        totalDuration: prev.totalDuration + finalRecording.duration,
        averageSpeed: prev.recordings.length > 0 
          ? (prev.totalDistance + finalRecording.distance) / ((prev.totalDuration + finalRecording.duration) / 60)
          : finalRecording.averageSpeed,
        maxSpeed: Math.max(prev.maxSpeed, finalRecording.maxSpeed),
        maxLean: Math.max(prev.maxLean, finalRecording.maxLean),
        recordings: [...prev.recordings, finalRecording]
      }));
    }

    setCurrentRecording(null);
    setIsRecording(false);

    // Vibration d'arrêt
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 100]);
    }

    // Redémarrer automatiquement si activé
    if (autoRecording) {
      setTimeout(() => {
        startAutoRecording();
      }, 2000);
    }
  };

  const exportRecording = (recording: TripRecording) => {
    const gpxContent = generateGPX(recording);
    const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recording.stageName || 'trajet'}-${recording.startTime.toISOString().split('T')[0]}.gpx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateGPX = (recording: TripRecording): string => {
    const tracks = recording.coordinates.map(coord => 
      `<trkpt lat="${coord.lat}" lon="${coord.lng}">
        ${coord.altitude ? `<ele>${coord.altitude}</ele>` : ''}
        <time>${coord.timestamp.toISOString()}</time>
      </trkpt>`
    ).join('\n        ');

    return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="RGA Moto Trip">
  <trk>
    <name>${recording.stageName}</name>
    <trkseg>
        ${tracks}
    </trkseg>
  </trk>
</gpx>`;
  };

  return (
    <div className="space-y-4">
      {/* Statut d'enregistrement automatique */}
      <div className="bg-slate-800 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 text-center">Enregistrement Automatique</h3>
        
        <div className="text-center mb-6">
          <div className={`inline-flex items-center space-x-3 px-6 py-4 rounded-2xl ${
            isRecording 
              ? 'bg-green-600/20 border-2 border-green-500' 
              : 'bg-slate-700 border-2 border-slate-600'
          }`}>
            {isRecording ? (
              <>
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-400 font-bold text-lg">ENREGISTREMENT ACTIF</span>
              </>
            ) : (
              <>
                <div className="w-4 h-4 bg-slate-500 rounded-full" />
                <span className="text-slate-400 font-bold text-lg">EN ATTENTE</span>
              </>
            )}
          </div>
          <p className="text-slate-400 text-sm mt-2">
            {isRecording 
              ? 'Arrêt automatique après 5min d\'immobilité'
              : 'Démarrage automatique en mouvement'
            }
          </p>
        </div>

        {/* Contrôles manuels compacts */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={startRecording}
            disabled={isRecording}
            className={`flex items-center px-6 py-3 rounded-xl transition-all duration-200 ${
              isRecording
                ? 'bg-slate-600 text-slate-400'
                : 'bg-green-600 text-white hover:bg-green-700 active:bg-green-800'
            }`}
          >
            <Play className="w-5 h-5 mr-2" />
            <span className="font-medium">Démarrer</span>
          </button>
          
          <button
            onClick={stopRecording}
            disabled={!isRecording}
            className={`flex items-center px-6 py-3 rounded-xl transition-all duration-200 ${
              !isRecording
                ? 'bg-slate-600 text-slate-400'
                : 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800'
            }`}
          >
            <Square className="w-5 h-5 mr-2" />
            <span className="font-medium">Arrêter</span>
          </button>
        </div>

        {/* Données en temps réel pendant l'enregistrement */}
        {isRecording && currentRecording && (
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-700 rounded-xl p-4 text-center">
              <Navigation className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{currentRecording.distance.toFixed(1)}</p>
              <p className="text-sm text-slate-400">km parcourus</p>
            </div>
            <div className="bg-slate-700 rounded-xl p-4 text-center">
              <Clock className="w-6 h-6 text-orange-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{Math.floor(currentRecording.duration)}</p>
              <p className="text-sm text-slate-400">minutes</p>
            </div>
            <div className="bg-slate-700 rounded-xl p-4 text-center">
              <Gauge className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{currentRecording.averageSpeed.toFixed(0)}</p>
              <p className="text-sm text-slate-400">km/h moy</p>
            </div>
            <div className="bg-slate-700 rounded-xl p-4 text-center">
              <TrendingUp className="w-6 h-6 text-red-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{currentRecording.maxSpeed.toFixed(0)}</p>
              <p className="text-sm text-slate-400">km/h max</p>
            </div>
          </div>
        )}
      </div>

      {/* Statistiques globales du voyage */}
      <div className="bg-slate-800 rounded-2xl p-6">
        <h4 className="text-lg font-bold text-white mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
          Statistiques du Voyage
        </h4>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-700 rounded-xl p-4 text-center">
            <Navigation className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-3xl font-bold text-white">{tripStats.totalDistance.toFixed(0)}</p>
            <p className="text-sm text-slate-400">km total</p>
          </div>
          <div className="bg-slate-700 rounded-xl p-4 text-center">
            <Clock className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <p className="text-3xl font-bold text-white">{Math.floor(tripStats.totalDuration / 60)}</p>
            <p className="text-sm text-slate-400">heures</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-700 rounded-xl p-3 text-center">
            <Gauge className="w-6 h-6 text-green-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-white">{tripStats.averageSpeed.toFixed(0)}</p>
            <p className="text-xs text-slate-400">km/h moy</p>
          </div>
          <div className="bg-slate-700 rounded-xl p-3 text-center">
            <TrendingUp className="w-6 h-6 text-red-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-white">{tripStats.maxSpeed.toFixed(0)}</p>
            <p className="text-xs text-slate-400">km/h max</p>
          </div>
          <div className="bg-slate-700 rounded-xl p-3 text-center">
            <Navigation className="w-6 h-6 text-purple-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-white">{tripStats.maxLean.toFixed(0)}°</p>
            <p className="text-xs text-slate-400">inclin. max</p>
          </div>
        </div>
      </div>

      {/* Historique des trajets */}
      <div className="bg-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold text-white flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-400" />
            Trajets Enregistrés
          </h4>
          <span className="text-sm text-slate-400">{tripStats.recordings.length} trajets</span>
        </div>

        {tripStats.recordings.length === 0 ? (
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">Aucun trajet enregistré</p>
            <p className="text-sm text-slate-500 mt-1">Appuyez sur START pour commencer</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tripStats.recordings.map((recording) => (
              <div key={recording.id} className="bg-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h5 className="font-bold text-white text-lg">{recording.stageName}</h5>
                    <p className="text-slate-400 text-sm">
                      {recording.startTime.toLocaleDateString('fr-FR')} • 
                      {recording.startTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      {recording.endTime && ` - ${recording.endTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`}
                    </p>
                  </div>
                  <button
                    onClick={() => exportRecording(recording)}
                    className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    <span className="font-medium">GPX</span>
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-slate-600 rounded-lg p-2">
                    <Navigation className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                    <p className="text-white font-bold">{recording.distance.toFixed(1)}</p>
                    <p className="text-slate-400 text-xs">km</p>
                  </div>
                  <div className="bg-slate-600 rounded-lg p-2">
                    <Clock className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                    <p className="text-white font-bold">{Math.floor(recording.duration)}</p>
                    <p className="text-slate-400 text-xs">min</p>
                  </div>
                  <div className="bg-slate-600 rounded-lg p-2">
                    <Gauge className="w-4 h-4 text-green-400 mx-auto mb-1" />
                    <p className="text-white font-bold">{recording.averageSpeed.toFixed(0)}</p>
                    <p className="text-slate-400 text-xs">moy</p>
                  </div>
                  <div className="bg-slate-600 rounded-lg p-2">
                    <TrendingUp className="w-4 h-4 text-red-400 mx-auto mb-1" />
                    <p className="text-white font-bold">{recording.maxSpeed.toFixed(0)}</p>
                    <p className="text-slate-400 text-xs">max</p>
                  </div>
                </div>

                {recording.maxLean > 0 && (
                  <div className="mt-3 p-3 bg-purple-600/20 border border-purple-500/50 rounded-lg">
                    <div className="flex items-center justify-center space-x-2">
                      <Navigation className="w-5 h-5 text-purple-400" />
                      <span className="text-purple-300 font-bold">
                        Inclinaison max : {recording.maxLean.toFixed(1)}°
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Paramètres d'enregistrement */}
      <div className="bg-slate-800 rounded-2xl p-6">
        <h4 className="text-lg font-bold text-white mb-4">Paramètres</h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-700 rounded-xl">
            <div>
              <p className="font-medium text-white">Mode Automatique</p>
              <p className="text-sm text-slate-400">Démarre/arrête selon le mouvement</p>
            </div>
            <button
              onClick={() => setAutoRecording(!autoRecording)}
              className={`w-12 h-6 rounded-full transition-colors ${
                autoRecording ? 'bg-green-500' : 'bg-slate-600'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                autoRecording ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
          
          <div className="p-4 bg-slate-700 rounded-xl">
            <p className="font-medium text-white mb-2">Seuils de Détection</p>
            <div className="text-sm text-slate-300 space-y-1">
              <p>• Démarrage : mouvement > 5 km/h</p>
              <p>• Arrêt : immobilité > 5 minutes</p>
              <p>• Précision GPS : haute</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}