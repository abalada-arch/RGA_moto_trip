import React, { useState } from 'react';
import { Upload, MapPin, Clock, Navigation, Route, Fuel, Coffee } from 'lucide-react';
import MapComponent from './MapComponent';
import { TripStage, POI, GPXTrack } from '../types';

export default function ItineraryModule() {
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [pois, setPois] = useState<POI[]>([]);
  const [gpxTracks, setGpxTracks] = useState<GPXTrack[]>([]);
  
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

  return (
    <div className="space-y-6">
      {/* Statistiques compactes */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-800 rounded-xl p-4 text-center">
          <Route className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">300</p>
          <p className="text-xs text-slate-400">km</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 text-center">
          <Clock className="w-8 h-8 text-orange-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">9h</p>
          <p className="text-xs text-slate-400">conduite</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 text-center">
          <MapPin className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{pois.length}</p>
          <p className="text-xs text-slate-400">POIs</p>
        </div>
      </div>

      {/* Étapes - Cards simplifiées */}
      <div className="bg-slate-800 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Étapes du Jour</h3>
        <div className="space-y-3">
          {stages.map((stage) => (
            <div
              key={stage.id}
              onClick={() => setSelectedStage(stage.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                selectedStage === stage.id
                  ? 'border-blue-500 bg-blue-500/20'
                  : 'border-slate-600 bg-slate-700 active:bg-slate-600'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-bold bg-blue-600 text-white px-3 py-1 rounded-full">
                    J{stage.day}
                  </span>
                  <h4 className="font-bold text-white text-lg">
                    {stage.title}
                  </h4>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-slate-300">
                  <Navigation className="w-4 h-4 mr-1" />
                  <span className="font-medium">{stage.distance} km</span>
                </div>
                <div className="flex items-center text-slate-300">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="font-medium">{Math.floor(stage.duration / 60)}h {stage.duration % 60}min</span>
                </div>
              </div>
              
              {stage.description && (
                <p className="text-sm text-slate-400 mt-2">{stage.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Carte - Optimisée mobile */}
      <div className="bg-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-700">
          <h3 className="text-lg font-bold text-white flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-400" />
            Carte Interactive
          </h3>
        </div>
        <div className="h-64">
          <MapComponent 
            pois={pois}
            gpxTracks={gpxTracks}
            onAddPOI={addPOI}
            selectedStage={selectedStage}
          />
        </div>
      </div>

      {/* Actions rapides en bas */}
      <div className="grid grid-cols-2 gap-3">
        <button className="p-4 bg-green-600 hover:bg-green-700 active:bg-green-800 rounded-xl transition-colors">
          <div className="flex items-center justify-center space-x-2">
            <Fuel className="w-6 h-6 text-white" />
            <span className="text-white font-medium">Stations</span>
          </div>
        </button>
        <button className="p-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl transition-colors">
          <div className="flex items-center justify-center space-x-2">
            <Coffee className="w-6 h-6 text-white" />
            <span className="text-white font-medium">Pauses</span>
          </div>
        </button>
      </div>
    </div>
  );
}