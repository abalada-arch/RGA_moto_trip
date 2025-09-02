import React, { useState } from 'react';
import { Fuel, Coffee, AlertTriangle, Navigation, Users, ThumbsUp, Check, MapPin } from 'lucide-react';
import { RiderStatus } from '../types';

export default function CoordinationModule() {
  const [myStatus, setMyStatus] = useState<'riding' | 'fuel' | 'pause' | 'emergency'>('riding');
  
  // Données d'exemple des participants
  const riders: RiderStatus[] = [
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
      statusMessage: 'Station Total A40 - Sortie 13',
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
      statusMessage: 'Pause café - Aire de repos',
      validatedBy: [],
      needsValidation: true
    }
  ];

  const [riderStatuses, setRiderStatuses] = useState<RiderStatus[]>(riders);
  const currentUser = 'Marc'; // Utilisateur actuel

  const sendStatusUpdate = (status: 'fuel' | 'pause') => {
    setMyStatus(status);
    // Simulation de l'envoi du statut
    setTimeout(() => setMyStatus('riding'), 30000); // Reset après 30 secondes
  };

  const validateStatus = (riderId: string) => {
    setRiderStatuses(prevStatuses => 
      prevStatuses.map(rider => 
        rider.id === riderId 
          ? { 
              ...rider, 
              validatedBy: [...rider.validatedBy, currentUser],
              needsValidation: rider.validatedBy.length === 0 // Plus besoin de validation si c'est le premier
            }
          : rider
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'riding': return 'text-green-600';
      case 'fuel': return 'text-orange-600';
      case 'pause': return 'text-blue-600';
      case 'emergency': return 'text-red-600';
      default: return 'text-slate-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'riding': return 'En route';
      case 'fuel': return 'Ravitaillement';
      case 'pause': return 'En pause';
      case 'emergency': return 'Urgence';
      default: return 'Inconnu';
    }
  };

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Coordination Groupe</h2>
            <p className="text-slate-600">
              Suivez la position de chaque membre et communiquez vos statuts
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span className="text-lg font-semibold text-slate-900">{riders.length}</span>
          </div>
        </div>
      </div>

      {/* Boutons de statut rapide */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Statuts Rapides</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => sendStatusUpdate('fuel')}
            disabled={myStatus === 'fuel'}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              myStatus === 'fuel'
                ? 'border-orange-600 bg-orange-50 text-orange-700'
                : 'border-orange-200 hover:border-orange-400 hover:bg-orange-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-3">
              <Fuel className="w-8 h-8" />
              <div className="text-left">
                <p className="font-semibold">J'ai besoin d'essence</p>
                <p className="text-sm text-slate-600">Signaler au groupe</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => sendStatusUpdate('pause')}
            disabled={myStatus === 'pause'}
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              myStatus === 'pause'
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-blue-200 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            <div className="flex items-center justify-center space-x-3">
              <Coffee className="w-8 h-8" />
              <div className="text-left">
                <p className="font-semibold">Je demande une pause</p>
                <p className="text-sm text-slate-600">Signaler au groupe</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Statut du groupe */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Statut du Groupe</h3>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            {riderStatuses.map((rider) => (
              <div key={rider.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    rider.status === 'riding' ? 'bg-green-500' :
                    rider.status === 'fuel' ? 'bg-orange-500' :
                    rider.status === 'pause' ? 'bg-blue-500' :
                    'bg-red-500'
                  }`} />
                  <div>
                    <p className="font-medium text-slate-900">{rider.name}</p>
                    <p className={`text-sm ${getStatusColor(rider.status)}`}>
                      {getStatusLabel(rider.status)}
                    </p>
                    {rider.statusMessage && (
                      <p className="text-xs text-slate-600 mt-1">{rider.statusMessage}</p>
                    )}
                    {rider.validatedBy.length > 0 && (
                      <div className="flex items-center space-x-1 mt-1">
                        <ThumbsUp className="w-3 h-3 text-green-600" />
                        <span className="text-xs text-green-600">
                          Vu par {rider.validatedBy.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {rider.needsValidation && rider.name !== currentUser && !rider.validatedBy.includes(currentUser) && (
                    <button
                      onClick={() => validateStatus(rider.id)}
                      className="flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-xs"
                    >
                      <Check className="w-3 h-3" />
                      <span>Vu</span>
                    </button>
                  )}
                  <div className="text-right">
                    <p className="text-xs text-slate-500">
                      Dernière mise à jour
                    </p>
                    <p className="text-xs text-slate-600">
                      {Math.floor((Date.now() - rider.lastUpdate.getTime()) / 60000)}min
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Position Temps Réel */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" />
              Position Temps Réel
            </h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 font-medium">En ligne</span>
            </div>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Localisation GPS de tous les participants en temps réel
          </p>
        </div>
        <div className="p-4">
          {/* Carte des positions */}
          <div className="h-64 bg-slate-100 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300">
            <div className="text-center">
              <Navigation className="w-12 h-12 text-slate-400 mx-auto mb-2" />
              <p className="text-slate-500 font-medium">Carte GPS Temps Réel</p>
              <p className="text-sm text-slate-400">Fonctionnalité en cours de développement</p>
            </div>
          </div>
          
          {/* Liste des positions */}
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Positions Actuelles</h4>
            {riderStatuses.map((rider) => (
              <div key={rider.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    rider.status === 'riding' ? 'bg-green-500' :
                    rider.status === 'fuel' ? 'bg-orange-500' :
                    rider.status === 'pause' ? 'bg-blue-500' :
                    'bg-red-500'
                  }`} />
                  <span className="text-sm font-medium text-slate-900">{rider.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-600">
                    {rider.lat.toFixed(4)}, {rider.lng.toFixed(4)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {Math.floor((Date.now() - rider.lastUpdate.getTime()) / 60000)}min
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
      {/* Carte du groupe */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center">
            <Navigation className="w-5 h-5 mr-2 text-blue-600" />
            Position Temps Réel
          </h3>
        </div>
        <div className="h-64 bg-slate-100 rounded-b-xl flex items-center justify-center">
          <p className="text-slate-500">Carte temps réel en cours de développement</p>
        </div>
      </div>
    </div>
  );
}