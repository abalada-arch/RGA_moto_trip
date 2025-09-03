import React, { useState } from 'react';
import { Mountain, AlertTriangle, CheckCircle, XCircle, Info, Navigation, Clock } from 'lucide-react';
import { RoadInfo } from '../types';

export default function RoadInfoSection() {
  const [roadInfos, setRoadInfos] = useState<RoadInfo[]>([
    {
      id: '1',
      name: 'Col des Montets',
      type: 'col',
      elevation: 1461,
      status: 'open',
      conditions: 'Route sèche, bonne visibilité',
      lastUpdate: new Date(),
      warnings: []
    },
    {
      id: '2',
      name: 'Col du Galibier',
      type: 'col',
      elevation: 2642,
      status: 'restricted',
      conditions: 'Neige possible en altitude',
      lastUpdate: new Date(Date.now() - 30 * 60 * 1000),
      warnings: ['Vents forts', 'Température basse']
    },
    {
      id: '3',
      name: 'Col de l\'Iseran',
      type: 'col',
      elevation: 2764,
      status: 'closed',
      conditions: 'Fermé pour déneigement',
      lastUpdate: new Date(Date.now() - 60 * 60 * 1000),
      warnings: ['Route fermée', 'Neige abondante']
    },
    {
      id: '4',
      name: 'Tunnel du Mont-Blanc',
      type: 'tunnel',
      status: 'open',
      conditions: 'Trafic normal',
      lastUpdate: new Date(Date.now() - 15 * 60 * 1000),
      warnings: []
    }
  ]);

  const getStatusIcon = (status: RoadInfo['status']) => {
    switch (status) {
      case 'open': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'restricted': return <AlertTriangle className="w-5 h-5 text-orange-400" />;
      case 'closed': return <XCircle className="w-5 h-5 text-red-400" />;
      default: return <Info className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: RoadInfo['status']) => {
    switch (status) {
      case 'open': return 'border-green-500 bg-green-500/20';
      case 'restricted': return 'border-orange-500 bg-orange-500/20';
      case 'closed': return 'border-red-500 bg-red-500/20';
      default: return 'border-slate-500 bg-slate-500/20';
    }
  };

  const getStatusLabel = (status: RoadInfo['status']) => {
    switch (status) {
      case 'open': return 'Ouvert';
      case 'restricted': return 'Restrictions';
      case 'closed': return 'Fermé';
      default: return 'Inconnu';
    }
  };

  const getTypeIcon = (type: RoadInfo['type']) => {
    switch (type) {
      case 'col': return <Mountain className="w-6 h-6 text-blue-400" />;
      case 'tunnel': return <Navigation className="w-6 h-6 text-slate-400" />;
      case 'bridge': return <Navigation className="w-6 h-6 text-cyan-400" />;
      case 'dangerous_curve': return <AlertTriangle className="w-6 h-6 text-orange-400" />;
      default: return <Info className="w-6 h-6 text-slate-400" />;
    }
  };

  const openRoads = roadInfos.filter(road => road.status === 'open');
  const restrictedRoads = roadInfos.filter(road => road.status === 'restricted');
  const closedRoads = roadInfos.filter(road => road.status === 'closed');

  return (
    <div className="space-y-4">
      {/* Statistiques rapides */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-green-600/20 border border-green-500/50 rounded-xl p-3 text-center">
          <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-white">{openRoads.length}</p>
          <p className="text-xs text-green-300">Ouverts</p>
        </div>
        <div className="bg-orange-600/20 border border-orange-500/50 rounded-xl p-3 text-center">
          <AlertTriangle className="w-6 h-6 text-orange-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-white">{restrictedRoads.length}</p>
          <p className="text-xs text-orange-300">Restrictions</p>
        </div>
        <div className="bg-red-600/20 border border-red-500/50 rounded-xl p-3 text-center">
          <XCircle className="w-6 h-6 text-red-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-white">{closedRoads.length}</p>
          <p className="text-xs text-red-300">Fermés</p>
        </div>
      </div>

      {/* Liste des routes et cols */}
      <div>
        <h4 className="text-lg font-bold text-white mb-4 flex items-center">
          <Mountain className="w-5 h-5 mr-2 text-blue-400" />
          État des Routes & Cols
        </h4>
        <div className="space-y-3">
          {roadInfos.map((road) => (
            <div key={road.id} className={`p-4 rounded-xl border-2 ${getStatusColor(road.status)}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {getTypeIcon(road.type)}
                  <div>
                    <h5 className="font-bold text-white text-lg">{road.name}</h5>
                    {road.elevation && (
                      <p className="text-slate-300 text-sm">{road.elevation}m d'altitude</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(road.status)}
                  <span className="font-bold text-sm">{getStatusLabel(road.status)}</span>
                </div>
              </div>

              <div className="bg-slate-600/50 rounded-lg p-3 mb-3">
                <p className="text-slate-200 text-sm">{road.conditions}</p>
              </div>

              {road.warnings && road.warnings.length > 0 && (
                <div className="space-y-2">
                  {road.warnings.map((warning, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <AlertTriangle className="w-4 h-4 text-orange-400" />
                      <span className="text-orange-300">{warning}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Mis à jour il y a {Math.floor((Date.now() - road.lastUpdate.getTime()) / 60000)}min</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}