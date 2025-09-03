import React, { useState } from 'react';
import { Upload, MapPin, Clock, Navigation, Route, Fuel, Coffee, Maximize2, Minimize2, AlertTriangle, ThumbsUp } from 'lucide-react';
import MapComponent from './MapComponent';
import { TripStage, POI, GPXTrack } from '../types';

export default function ItineraryModule() {
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [pois, setPois] = useState<POI[]>([]);
  const [gpxTracks, setGpxTracks] = useState<GPXTrack[]>([]);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const [myStatus, setMyStatus] = useState<'riding' | 'fuel' | 'pause' | 'emergency'>('riding');
  
  // Données d'exemple pour l'itinéraire
  const stages: TripStage[] = [
    {
      id: '1',
      day: 1,
      title: 'Thonon → Chamonix',
      distance: 95,
      duration: 180,
      startLocation: 'Thonon-les-Bains',
      endLocation: 'Chamonix',
      description: 'Vue Mont-Blanc'
    },
    {
      id: '2',
      day: 2,
      title: 'Chamonix → Bourg-St-Maurice',
      distance: 120,
      duration: 210,
      startLocation: 'Chamonix',
      endLocation: 'Bourg-Saint-Maurice',
      description: 'Col des Montets'
    },
    {
      id: '3',
      day: 3,
      title: 'Bourg-St-Maurice → Val d\'Isère',
      distance: 85,
      duration: 150,
      startLocation: 'Bourg-Saint-Maurice',
      endLocation: 'Val d\'Isère',
      description: 'Haute altitude'
    }
  ];

  const addPOI = (lat: number, lng: number) => {
    const newPOI: POI = {
      id: Date.now().toString(),
      name: `Point ${pois.length + 1}`,
      type: 'other',
      lat,
      lng,
      addedBy: 'Utilisateur'
    };
    setPois([...pois, newPOI]);
  };

  const sendStatusUpdate = (status: 'fuel' | 'pause' | 'emergency') => {
    setMyStatus(status);
    // Vibration pour feedback tactile
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
    setTimeout(() => setMyStatus('riding'), 30000);
  };

  const toggleFullscreen = () => {
    setIsMapFullscreen(!isMapFullscreen);
    // Vibration pour feedback
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
  };

  // Mode plein écran
  if (isMapFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900">
        {/* Header de navigation plein écran */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-slate-900/90 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-white font-bold">Navigation Active</span>
            </div>
            <button
              onClick={toggleFullscreen}
              className="p-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
            >
              <Minimize2 className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Carte plein écran */}
        <div className="h-full pt-20 pb-32">
          <MapComponent 
            pois={pois}
            gpxTracks={gpxTracks}
            onAddPOI={addPOI}
            selectedStage={selectedStage}
          />
        </div>

        {/* Boutons rapides en overlay plein écran */}
        <div className="absolute bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-sm p-4">
          <div className="grid grid-cols-3 gap-3 mb-4">
            <button
              onClick={() => sendStatusUpdate('fuel')}
              disabled={myStatus === 'fuel'}
              className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                myStatus === 'fuel'
                  ? 'border-orange-500 bg-orange-500/30 text-orange-300'
                  : 'border-orange-500/70 bg-orange-500/20 text-orange-400 active:bg-orange-500/40'
              }`}
            >
              <Fuel className="w-8 h-8 mx-auto mb-1" />
              <p className="text-sm font-bold">ESSENCE</p>
            </button>

            <button
              onClick={() => sendStatusUpdate('pause')}
              disabled={myStatus === 'pause'}
              className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                myStatus === 'pause'
                  ? 'border-blue-500 bg-blue-500/30 text-blue-300'
                  : 'border-blue-500/70 bg-blue-500/20 text-blue-400 active:bg-blue-500/40'
              }`}
            >
              <Coffee className="w-8 h-8 mx-auto mb-1" />
              <p className="text-sm font-bold">PAUSE</p>
            </button>

            <button
              onClick={() => sendStatusUpdate('emergency')}
              className="p-4 rounded-2xl border-2 border-red-500/70 bg-red-500/20 text-red-400 active:bg-red-500/40 transition-all duration-200"
            >
              <AlertTriangle className="w-8 h-8 mx-auto mb-1" />
              <p className="text-sm font-bold">URGENCE</p>
            </button>
          </div>

          {/* Étape actuelle en plein écran */}
          {selectedStage && (
            <div className="bg-slate-800/90 rounded-xl p-4 border border-slate-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-400 font-bold text-lg">Étape Actuelle</p>
                  <p className="text-white text-xl font-bold">
                    {stages.find(s => s.id === selectedStage)?.title}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-slate-300 text-lg font-bold">
                    {stages.find(s => s.id === selectedStage)?.distance} km
                  </p>
                  <p className="text-slate-400 text-sm">
                    {Math.floor((stages.find(s => s.id === selectedStage)?.duration || 0) / 60)}h {(stages.find(s => s.id === selectedStage)?.duration || 0) % 60}min
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Mode normal
  return (
    <div className="space-y-6">
      {/* Carte Interactive - EN HAUT et prioritaire */}
      <div className="bg-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center">
              <MapPin className="w-6 h-6 mr-2 text-blue-400" />
              Navigation
            </h3>
            <button
              onClick={toggleFullscreen}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors"
            >
              <Maximize2 className="w-5 h-5" />
              <span className="font-medium">Plein Écran</span>
            </button>
          </div>
          <p className="text-slate-400 text-sm mt-1">Appuyez sur la carte pour ajouter des points</p>
        </div>
        <div className="h-80">
          <MapComponent 
            pois={pois}
            gpxTracks={gpxTracks}
            onAddPOI={addPOI}
            selectedStage={selectedStage}
          />
        </div>
      </div>

      {/* Étapes du parcours - Compactes */}
      <div className="bg-slate-800 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Route className="w-6 h-6 mr-2 text-blue-400" />
          Parcours Détaillé
        </h3>
        
        {/* Statistiques en ligne */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-slate-700 rounded-xl p-3 text-center">
            <Navigation className="w-6 h-6 text-blue-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-white">300</p>
            <p className="text-xs text-slate-400">km total</p>
          </div>
          <div className="bg-slate-700 rounded-xl p-3 text-center">
            <Clock className="w-6 h-6 text-orange-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-white">9h</p>
            <p className="text-xs text-slate-400">conduite</p>
          </div>
          <div className="bg-slate-700 rounded-xl p-3 text-center">
            <MapPin className="w-6 h-6 text-green-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-white">{pois.length}</p>
            <p className="text-xs text-slate-400">POIs</p>
          </div>
        </div>

        {/* Étapes simplifiées */}
        <div className="space-y-3">
          {stages.map((stage) => (
            <div
              key={stage.id}
              onClick={() => setSelectedStage(selectedStage === stage.id ? null : stage.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                selectedStage === stage.id
                  ? 'border-blue-500 bg-blue-500/20'
                  : 'border-slate-600 bg-slate-700 active:bg-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-bold bg-blue-600 text-white px-3 py-1 rounded-full">
                    J{stage.day}
                  </span>
                  <div>
                    <h4 className="font-bold text-white text-lg">{stage.title}</h4>
                    <p className="text-slate-400 text-sm">{stage.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{stage.distance} km</p>
                  <p className="text-slate-400 text-sm">
                    {Math.floor(stage.duration / 60)}h{stage.duration % 60}min
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions rapides pour la route */}
      <div className="grid grid-cols-2 gap-3">
        <button className="p-6 bg-green-600 hover:bg-green-700 active:bg-green-800 rounded-2xl transition-colors">
          <div className="flex flex-col items-center space-y-2">
            <Fuel className="w-10 h-10 text-white" />
            <span className="text-white font-bold text-lg">Stations</span>
            <span className="text-green-200 text-sm">Trouver essence</span>
          </div>
        </button>
        <button className="p-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-2xl transition-colors">
          <div className="flex flex-col items-center space-y-2">
            <Coffee className="w-10 h-10 text-white" />
            <span className="text-white font-bold text-lg">Pauses</span>
            <span className="text-blue-200 text-sm">Points d'arrêt</span>
          </div>
        </button>
      </div>
    </div>
  );
}