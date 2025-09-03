import React, { useState } from 'react';
import { Fuel, Coffee, AlertTriangle, Navigation, Users, ThumbsUp, Check, MapPin, Phone, Radio, MessageSquare } from 'lucide-react';
import { RiderStatus } from '../types';
import CommunicationSection from './CommunicationSection';

export default function CoordinationModule() {
  const [myStatus, setMyStatus] = useState<'riding' | 'fuel' | 'pause' | 'emergency'>('riding');
  const [activeSection, setActiveSection] = useState<'status' | 'communication'>('status');
  
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
      statusMessage: 'Station Total A40',
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
  ];

  const [riderStatuses, setRiderStatuses] = useState<RiderStatus[]>(riders);
  const currentUser = 'Marc';

  const sendStatusUpdate = (status: 'fuel' | 'pause' | 'emergency') => {
    setMyStatus(status);
    // Vibration pour feedback tactile
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
    setTimeout(() => setMyStatus('riding'), 30000);
  };

  const validateStatus = (riderId: string) => {
    setRiderStatuses(prevStatuses => 
      prevStatuses.map(rider => 
        rider.id === riderId 
          ? { 
              ...rider, 
              validatedBy: [...rider.validatedBy, currentUser],
              needsValidation: rider.validatedBy.length === 0
            }
          : rider
      )
    );
    // Vibration pour confirmation
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'riding': return 'text-green-400';
      case 'fuel': return 'text-orange-400';
      case 'pause': return 'text-blue-400';
      case 'emergency': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'riding': return 'En route';
      case 'fuel': return 'Essence';
      case 'pause': return 'Pause';
      case 'emergency': return 'URGENCE';
      default: return 'Inconnu';
    }
  };

  return (
    <div className="space-y-6">
      {/* Indicateur de mode */}
      <div className="bg-blue-600/20 border border-blue-500/50 rounded-xl p-4">
        <div className="flex items-center space-x-3">
          <Coffee className="w-6 h-6 text-blue-400" />
          <div>
            <p className="font-bold text-blue-300">Mode Préparation</p>
            <p className="text-sm text-blue-200">Configuration et test des communications</p>
          </div>
        </div>
      </div>

      {/* Navigation communication */}
      <div className="bg-slate-800 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-2">
          <button
            onClick={() => setActiveSection('status')}
            className={`flex items-center justify-center py-4 px-4 transition-all duration-200 ${
              activeSection === 'status'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Users className="w-6 h-6 mr-2" />
            <span className="font-medium">Statuts</span>
          </button>
          <button
            onClick={() => setActiveSection('communication')}
            className={`flex items-center justify-center py-4 px-4 transition-all duration-200 ${
              activeSection === 'communication'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Radio className="w-6 h-6 mr-2" />
            <span className="font-medium">Intercom</span>
          </button>
        </div>
      </div>

      {activeSection === 'communication' ? (
        <CommunicationSection />
      ) : (
        <>
      {/* Statuts Rapides - Gros boutons tactiles */}
      <div className="bg-slate-800 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 text-center">Actions Rapides</h3>
        <div className="space-y-4">
          <button
            onClick={() => sendStatusUpdate('fuel')}
            disabled={myStatus === 'fuel'}
            className={`w-full p-6 rounded-2xl border-2 transition-all duration-200 ${
              myStatus === 'fuel'
                ? 'border-orange-500 bg-orange-500/20 text-orange-300'
                : 'border-orange-500/50 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 active:bg-orange-500/30'
            }`}
          >
            <div className="flex items-center justify-center space-x-4">
              <Fuel className="w-10 h-10" />
              <div className="text-left">
                <p className="text-xl font-bold">ESSENCE</p>
                <p className="text-sm opacity-80">Signaler au groupe</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => sendStatusUpdate('pause')}
            disabled={myStatus === 'pause'}
            className={`w-full p-6 rounded-2xl border-2 transition-all duration-200 ${
              myStatus === 'pause'
                ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                : 'border-blue-500/50 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 active:bg-blue-500/30'
            }`}
          >
            <div className="flex items-center justify-center space-x-4">
              <Coffee className="w-10 h-10" />
              <div className="text-left">
                <p className="text-xl font-bold">PAUSE</p>
                <p className="text-sm opacity-80">Demander un arrêt</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => sendStatusUpdate('emergency')}
            className="w-full p-6 rounded-2xl border-2 border-red-500/50 bg-red-500/10 text-red-400 hover:bg-red-500/20 active:bg-red-500/30 transition-all duration-200"
          >
            <div className="flex items-center justify-center space-x-4">
              <AlertTriangle className="w-10 h-10" />
              <div className="text-left">
                <p className="text-xl font-bold">URGENCE</p>
                <p className="text-sm opacity-80">Alerte groupe</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Statut du groupe - Cards simplifiées */}
      <div className="bg-slate-800 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <Users className="w-6 h-6 mr-2 text-blue-400" />
          Statut Groupe
        </h3>
        <div className="space-y-3">
          {riderStatuses.map((rider) => (
            <div key={rider.id} className="bg-slate-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${
                    rider.status === 'riding' ? 'bg-green-500' :
                    rider.status === 'fuel' ? 'bg-orange-500' :
                    rider.status === 'pause' ? 'bg-blue-500' :
                    'bg-red-500'
                  }`} />
                  <div>
                    <p className="font-bold text-white text-lg">{rider.name}</p>
                    <p className={`text-sm font-medium ${getStatusColor(rider.status)}`}>
                      {getStatusLabel(rider.status)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">
                    {Math.floor((Date.now() - rider.lastUpdate.getTime()) / 60000)}min
                  </p>
                </div>
              </div>
              
              {rider.statusMessage && (
                <p className="text-sm text-slate-300 mb-3 bg-slate-600 p-2 rounded-lg">
                  {rider.statusMessage}
                </p>
              )}
              
              <div className="flex items-center justify-between">
                {rider.validatedBy.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <ThumbsUp className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-400">
                      Vu par {rider.validatedBy.join(', ')}
                    </span>
                  </div>
                )}
                
                {rider.needsValidation && rider.name !== currentUser && !rider.validatedBy.includes(currentUser) && (
                  <button
                    onClick={() => validateStatus(rider.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 active:bg-green-800 transition-colors font-medium"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span>VU</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Position Temps Réel - Section séparée */}
      <div className="bg-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center">
            <MapPin className="w-6 h-6 mr-2 text-blue-400" />
            Position GPS
          </h3>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-400 font-medium">GPS Actif</span>
          </div>
        </div>
        
        {/* Carte GPS */}
        <div className="h-48 bg-slate-700 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-600 mb-4">
          <div className="text-center">
            <Navigation className="w-12 h-12 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-300 font-medium">Carte GPS</p>
            <p className="text-sm text-slate-500">Positions en temps réel</p>
          </div>
        </div>
        
        {/* Positions compactes */}
        <div className="space-y-2">
          {riderStatuses.map((rider) => (
            <div key={rider.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  rider.status === 'riding' ? 'bg-green-500' :
                  rider.status === 'fuel' ? 'bg-orange-500' :
                  rider.status === 'pause' ? 'bg-blue-500' :
                  'bg-red-500'
                }`} />
                <span className="text-white font-medium">{rider.name}</span>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400">
                  {Math.floor((Date.now() - rider.lastUpdate.getTime()) / 60000)}min
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bouton d'urgence fixe */}
      <div className="fixed top-4 right-4 z-40">
        <button
          onClick={() => sendStatusUpdate('emergency')}
          className="w-16 h-16 bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-full flex items-center justify-center shadow-lg transition-all duration-200"
        >
          <AlertTriangle className="w-8 h-8 text-white" />
        </button>
      </div>
        </>
      )}
    </div>
  );
}