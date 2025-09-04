import React, { useState } from 'react';
import { Euro, Navigation, AlertTriangle, Clock, Car, Bike, Calculator, Route } from 'lucide-react';
import { TollCalculation, TrafficInfo, GPXTrack } from '../types';

interface TollTrafficSectionProps {
  activeGPXTrack?: GPXTrack | null;
}

export default function TollTrafficSection({ activeGPXTrack }: TollTrafficSectionProps) {
  const [tollCalculations, setTollCalculations] = useState<TollCalculation[]>([]);

  const [trafficAlerts, setTrafficAlerts] = useState<TrafficInfo[]>([]);

  const [vehicleType, setVehicleType] = useState<'moto' | 'car'>('moto');
  const [customRoute, setCustomRoute] = useState('');

  // Utiliser les données de trafic du GPX actif si disponibles
  React.useEffect(() => {
    if (activeGPXTrack?.routeTrafficInfo) {
      setTrafficAlerts(activeGPXTrack.routeTrafficInfo);
    } else {
      setTrafficAlerts([]);
    }
  }, [activeGPXTrack]);
  const totalTollCost = tollCalculations.reduce((sum, toll) => sum + toll.totalCost, 0);
  const totalDistance = tollCalculations.reduce((sum, toll) => 
    sum + toll.sections.reduce((sectionSum, section) => sectionSum + section.distance, 0), 0
  );

  const getTrafficColor = (severity: TrafficInfo['severity']) => {
    switch (severity) {
      case 'low': return 'border-yellow-500 bg-yellow-500/20 text-yellow-300';
      case 'medium': return 'border-orange-500 bg-orange-500/20 text-orange-300';
      case 'high': return 'border-red-500 bg-red-500/20 text-red-300';
      default: return 'border-slate-500 bg-slate-500/20 text-slate-300';
    }
  };

  const getTrafficIcon = (type: TrafficInfo['type']) => {
    switch (type) {
      case 'traffic': return <Car className="w-5 h-5" />;
      case 'accident': return <AlertTriangle className="w-5 h-5" />;
      case 'roadwork': return <Navigation className="w-5 h-5" />;
      case 'weather': return <AlertTriangle className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Calculateur de péages */}
      <div className="bg-slate-800 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Euro className="w-6 h-6 mr-2 text-green-400" />
          Calculateur Péages
        </h3>

        {/* Sélecteur véhicule */}
        <div className="flex items-center space-x-4 mb-4">
          <span className="text-slate-300 font-medium">Type véhicule :</span>
          <div className="flex space-x-2">
            <button
              onClick={() => setVehicleType('moto')}
              className={`flex items-center px-4 py-2 rounded-xl transition-colors ${
                vehicleType === 'moto'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <Bike className="w-4 h-4 mr-2" />
              Moto
            </button>
            <button
              onClick={() => setVehicleType('car')}
              className={`flex items-center px-4 py-2 rounded-xl transition-colors ${
                vehicleType === 'car'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <Car className="w-4 h-4 mr-2" />
              Voiture
            </button>
          </div>
        </div>

        {/* Résumé total */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-green-600/20 border border-green-500/50 rounded-xl p-3 text-center">
            <Euro className="w-6 h-6 text-green-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">{totalTollCost.toFixed(2)}€</p>
            <p className="text-xs text-green-300">Total péages</p>
          </div>
          <div className="bg-blue-600/20 border border-blue-500/50 rounded-xl p-3 text-center">
            <Navigation className="w-6 h-6 text-blue-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">{totalDistance}</p>
            <p className="text-xs text-blue-300">km autoroutes</p>
          </div>
          <div className="bg-orange-600/20 border border-orange-500/50 rounded-xl p-3 text-center">
            <Calculator className="w-6 h-6 text-orange-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-white">{(totalTollCost / 3).toFixed(2)}€</p>
            <p className="text-xs text-orange-300">par personne</p>
          </div>
        </div>

        {/* Détail des sections */}
        <div className="space-y-3">
          {tollCalculations.map((toll) => (
            <div key={toll.id} className="bg-slate-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-bold text-white">{toll.route}</h5>
                <span className="text-lg font-bold text-green-400">{toll.totalCost.toFixed(2)}€</span>
              </div>
              
              <div className="space-y-2">
                {toll.sections.map((section, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-slate-300">{section.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-400">{section.distance}km</span>
                      <span className="text-white font-medium">{section.cost.toFixed(2)}€</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Infos trafic en temps réel */}
      <div className="bg-slate-800 rounded-2xl p-6">
        <h4 className="text-lg font-bold text-white mb-4 flex items-center">
          <Route className="w-5 h-5 mr-2 text-blue-400" />
          {activeGPXTrack ? `Trafic - ${activeGPXTrack.name}` : 'Trafic en Temps Réel'}
        </h4>

        {trafficAlerts.length === 0 ? (
          <div className="text-center py-6">
            <Navigation className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <p className="text-green-400 font-bold">Trafic Fluide</p>
            <p className="text-sm text-slate-400">
              {activeGPXTrack ? 'Aucun problème signalé sur votre parcours' : 'Sélectionnez un tracé pour voir les conditions'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {trafficAlerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-xl border-2 ${getTrafficColor(alert.severity)}`}>
                <div className="flex items-start space-x-3">
                  {getTrafficIcon(alert.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-bold text-lg">{alert.route}</h5>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span className="font-bold">+{alert.delay}min</span>
                      </div>
                    </div>
                    
                    <p className="mb-2">{alert.description}</p>
                    
                    {alert.alternativeRoute && (
                      <div className="bg-slate-600/50 rounded-lg p-2">
                        <p className="text-sm">
                          <strong>Alternative :</strong> {alert.alternativeRoute}
                        </p>
                      </div>
                    )}
                    
                    <p className="text-xs mt-2 opacity-75">
                      Mis à jour il y a {Math.floor((Date.now() - alert.lastUpdate.getTime()) / 60000)}min
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Services d'urgence */}
      <div className="bg-slate-800 rounded-2xl p-6">
        <h4 className="text-lg font-bold text-white mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
          Services d'Urgence
        </h4>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => window.location.href = 'tel:15'}
            className="p-4 bg-red-600/20 border border-red-500/50 text-red-300 rounded-xl hover:bg-red-600/30 transition-colors"
          >
            <div className="text-center">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
              <p className="font-bold text-lg">SAMU</p>
              <p className="text-sm">15</p>
            </div>
          </button>
          
          <button
            onClick={() => window.location.href = 'tel:18'}
            className="p-4 bg-red-600/20 border border-red-500/50 text-red-300 rounded-xl hover:bg-red-600/30 transition-colors"
          >
            <div className="text-center">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
              <p className="font-bold text-lg">POMPIERS</p>
              <p className="text-sm">18</p>
            </div>
          </button>
          
          <button
            onClick={() => window.location.href = 'tel:17'}
            className="p-4 bg-blue-600/20 border border-blue-500/50 text-blue-300 rounded-xl hover:bg-blue-600/30 transition-colors"
          >
            <div className="text-center">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
              <p className="font-bold text-lg">POLICE</p>
              <p className="text-sm">17</p>
            </div>
          </button>
          
          <button
            onClick={() => window.location.href = 'tel:112'}
            className="p-4 bg-orange-600/20 border border-orange-500/50 text-orange-300 rounded-xl hover:bg-orange-600/30 transition-colors"
          >
            <div className="text-center">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
              <p className="font-bold text-lg">URGENCES</p>
              <p className="text-sm">112</p>
            </div>
          </button>
        </div>

        {/* Hôpitaux proches */}
        <div className="mt-4 bg-slate-700 rounded-xl p-4">
          <h5 className="font-bold text-white mb-3">Hôpitaux sur le Parcours</h5>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">CH Chamonix</span>
              <span className="text-blue-400">+33 4 50 53 84 00</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">CH Bourg-St-Maurice</span>
              <span className="text-blue-400">+33 4 79 41 79 79</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Clinique Val d'Isère</span>
              <span className="text-blue-400">+33 4 79 06 00 42</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}