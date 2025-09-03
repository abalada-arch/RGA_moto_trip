import React, { useState, useEffect } from 'react';
import { Fuel, Plus, MapPin, Euro, TrendingUp, AlertTriangle, Clock, Navigation } from 'lucide-react';
import { FuelData, FuelConsumption } from '../types';

export default function FuelManagementSection() {
  const [fuelStations, setFuelStations] = useState<FuelData[]>([]);

  const [fuelHistory, setFuelHistory] = useState<FuelConsumption[]>([]);

  const [currentOdometer, setCurrentOdometer] = useState(0);
  const [tankCapacity] = useState(18); // Litres
  const [lastFuelUp, setLastFuelUp] = useState<FuelConsumption | null>(null);
  const [showAddStation, setShowAddStation] = useState(false);
  const [showAddFuelUp, setShowAddFuelUp] = useState(false);

  // Calculs automatiques
  const kmSinceLastFuel = lastFuelUp ? currentOdometer - lastFuelUp.odometer : 0;
  const defaultConsumption = 5.5;
  const estimatedFuelLeft = lastFuelUp 
    ? tankCapacity - (kmSinceLastFuel * lastFuelUp.consumption / 100)
    : tankCapacity;
  const estimatedRange = lastFuelUp 
    ? estimatedFuelLeft * (100 / lastFuelUp.consumption)
    : estimatedFuelLeft * (100 / defaultConsumption);
  const averageConsumption = fuelHistory.length > 0 
    ? fuelHistory.reduce((sum, fuel) => sum + fuel.consumption, 0) / fuelHistory.length 
    : defaultConsumption;

  const addFuelStation = (stationData: Omit<FuelData, 'id' | 'lastUpdate' | 'addedBy'>) => {
    const newStation: FuelData = {
      ...stationData,
      id: Date.now().toString(),
      lastUpdate: new Date(),
      addedBy: 'Vous'
    };
    setFuelStations([newStation, ...fuelStations]);
    setShowAddStation(false);
  };

  const addFuelUp = (fuelData: Omit<FuelConsumption, 'id' | 'consumption'>) => {
    const consumption = lastFuelUp 
      ? (fuelData.liters / (fuelData.odometer - lastFuelUp.odometer)) * 100
      : defaultConsumption;
    
    const newFuelUp: FuelConsumption = {
      ...fuelData,
      id: Date.now().toString(),
      consumption
    };
    
    setFuelHistory([newFuelUp, ...fuelHistory]);
    setLastFuelUp(newFuelUp);
    setShowAddFuelUp(false);
  };

  return (
    <div className="space-y-4">
      {/* Statut carburant actuel */}
      <div className="bg-slate-800 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Fuel className="w-6 h-6 mr-2 text-orange-400" />
          État du Réservoir
        </h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-700 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Fuel className={`w-8 h-8 ${estimatedFuelLeft > 5 ? 'text-green-400' : estimatedFuelLeft > 2 ? 'text-orange-400' : 'text-red-400'}`} />
            </div>
            <p className="text-3xl font-bold text-white">{estimatedFuelLeft.toFixed(1)}</p>
            <p className="text-sm text-slate-400">Litres restants</p>
          </div>
          
          <div className="bg-slate-700 rounded-xl p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Navigation className={`w-8 h-8 ${estimatedRange > 100 ? 'text-green-400' : estimatedRange > 50 ? 'text-orange-400' : 'text-red-400'}`} />
            </div>
            <p className="text-3xl font-bold text-white">{estimatedRange.toFixed(0)}</p>
            <p className="text-sm text-slate-400">km autonomie</p>
          </div>
        </div>

        {/* Barre de carburant visuelle */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Niveau estimé</span>
            <span className="text-sm text-white font-bold">{((estimatedFuelLeft / tankCapacity) * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full bg-slate-600 rounded-full h-4">
            <div 
              className={`h-4 rounded-full transition-all duration-500 ${
                estimatedFuelLeft > 5 ? 'bg-green-500' : 
                estimatedFuelLeft > 2 ? 'bg-orange-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.max(0, (estimatedFuelLeft / tankCapacity) * 100)}%` }}
            />
          </div>
        </div>

        {/* Alerte carburant - seulement si on a des données */}
        {lastFuelUp && estimatedFuelLeft < 3 && (
          <div className="bg-red-600/20 border border-red-500/50 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <div>
                <p className="font-bold text-red-300">Niveau Carburant Bas</p>
                <p className="text-sm text-red-200">Trouvez une station rapidement</p>
              </div>
            </div>
          </div>
        )}

        {/* Statistiques de consommation */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-700 rounded-lg p-3 text-center">
            <TrendingUp className="w-5 h-5 text-blue-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-white">{averageConsumption.toFixed(1)}</p>
            <p className="text-xs text-slate-400">L/100km moy</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-3 text-center">
            <Navigation className="w-5 h-5 text-green-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-white">{kmSinceLastFuel}</p>
            <p className="text-xs text-slate-400">km depuis plein</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-3 text-center">
            <Euro className="w-5 h-5 text-orange-400 mx-auto mb-1" />
            <p className="text-lg font-bold text-white">{lastFuelUp ? lastFuelUp.cost.toFixed(0) : '0'}</p>
            <p className="text-xs text-slate-400">€ dernier plein</p>
          </div>
        </div>
      </div>

      {/* Stations essence proches */}
      <div className="bg-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold text-white flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-blue-400" />
            Stations Proches
          </h4>
          <button
            onClick={() => setShowAddStation(true)}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </button>
        </div>

        {fuelStations.length === 0 ? (
          <div className="text-center py-8">
            <Fuel className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">Aucune station enregistrée</p>
            <p className="text-sm text-slate-500 mt-1">Ajoutez des stations sur votre parcours</p>
          </div>
        ) : (
          <div className="space-y-3">
            {fuelStations.map((station) => (
              <div key={station.id} className="bg-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h5 className="font-bold text-white">{station.stationName}</h5>
                    <p className="text-slate-400 text-sm">{station.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-orange-400">{station.price.toFixed(2)}€</p>
                    <p className="text-xs text-slate-400">par litre</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {station.services.map((service, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded-full">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historique consommation */}
      <div className="bg-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold text-white">Historique</h4>
          <button
            onClick={() => setShowAddFuelUp(true)}
            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Plein
          </button>
        </div>

        {fuelHistory.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">Aucun plein enregistré</p>
            <p className="text-sm text-slate-500 mt-1">Ajoutez vos pleins pour suivre la consommation</p>
          </div>
        ) : (
          <div className="space-y-3">
            {fuelHistory.map((fuel) => (
              <div key={fuel.id} className="bg-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white">{fuel.stationName}</p>
                    <p className="text-slate-400 text-sm">
                      {fuel.date.toLocaleDateString('fr-FR')} • {fuel.liters}L
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">{fuel.cost.toFixed(2)}€</p>
                    <p className="text-sm text-slate-400">{fuel.consumption.toFixed(1)} L/100km</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}