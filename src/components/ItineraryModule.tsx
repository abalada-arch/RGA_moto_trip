import React, { useState } from 'react';
import { Upload, MapPin, Clock, Navigation, Route } from 'lucide-react';
import MapComponent from './MapComponent';
import StagesList from './StagesList';
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
      title: 'Thonon-les-Bains → Chamonix',
      distance: 95,
      duration: 180,
      startLocation: 'Thonon-les-Bains',
      endLocation: 'Chamonix',
      description: 'Départ vers la vallée de Chamonix avec vue sur le Mont-Blanc'
    },
    {
      id: '2',
      day: 2,
      title: 'Chamonix → Bourg-Saint-Maurice',
      distance: 120,
      duration: 210,
      startLocation: 'Chamonix',
      endLocation: 'Bourg-Saint-Maurice',
      description: 'Passage par le Col des Montets et la vallée de l\'Arve'
    },
    {
      id: '3',
      day: 3,
      title: 'Bourg-Saint-Maurice → Val d\'Isère',
      distance: 85,
      duration: 150,
      startLocation: 'Bourg-Saint-Maurice',
      endLocation: 'Val d\'Isère',
      description: 'Montée vers les stations de haute altitude'
    }
  ];

  const handleGPXUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.gpx')) {
      // Simulation de l'import GPX
      const newTrack: GPXTrack = {
        id: Date.now().toString(),
        name: file.name.replace('.gpx', ''),
        points: [
          { lat: 46.3720, lng: 6.4767 }, // Thonon
          { lat: 45.9237, lng: 6.8694 }, // Chamonix
        ],
        distance: 95,
        uploadedAt: new Date()
      };
      setGpxTracks([...gpxTracks, newTrack]);
    }
  };

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
    <div className="space-y-8">
      {/* En-tête du module */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Mon Itinéraire</h2>
            <p className="text-slate-600">
              Planifiez et visualisez votre parcours sur la Route des Grandes Alpes
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              Importer un GPX
              <input
                type="file"
                accept=".gpx"
                onChange={handleGPXUpload}
                className="hidden"
              />
            </label>
            <button className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              <Navigation className="w-4 h-4 mr-2" />
              Mode Hors Ligne
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Liste des étapes */}
        <div className="lg:col-span-1">
          <StagesList 
            stages={stages}
            selectedStage={selectedStage}
            onStageSelect={setSelectedStage}
          />
        </div>

        {/* Carte */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Carte Interactive
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Cliquez sur la carte pour ajouter des points d'intérêt
              </p>
            </div>
            <div className="h-96 lg:h-[500px]">
              <MapComponent 
                pois={pois}
                gpxTracks={gpxTracks}
                onAddPOI={addPOI}
                selectedStage={selectedStage}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Route className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Distance Totale</p>
              <p className="text-2xl font-bold text-slate-900">300 km</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Temps de Conduite</p>
              <p className="text-2xl font-bold text-slate-900">9h 00</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Points d'Intérêt</p>
              <p className="text-2xl font-bold text-slate-900">{pois.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}