import React, { useState, useEffect } from 'react';
import { Map, Route, Users, Settings, Car, Coffee, AlertTriangle, Navigation, Maximize2, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import UserProfile from './UserProfile';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isDrivingMode: boolean;
  onModeChange: (isDriving: boolean) => void;
}

export default function Layout({ children, activeTab, onTabChange, isDrivingMode, onModeChange }: LayoutProps) {
  const [isMoving, setIsMoving] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [showProfile, setShowProfile] = useState(false);
  const { user } = useAuth();

  // Détection automatique du mouvement
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const currentSpeed = position.coords.speed ? position.coords.speed * 3.6 : 0;
        setSpeed(currentSpeed);
        setIsMoving(currentSpeed > 5);
        
        // Basculer automatiquement en mode conduite si mouvement détecté
        if (currentSpeed > 15 && !isDrivingMode) {
          onModeChange(true);
        }
      },
      (error) => {
        console.error('Erreur GPS Layout:', error);
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 2000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isDrivingMode, onModeChange]);

  // Mode Conduite - Interface simplifiée
  if (isDrivingMode) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        {/* Header conduite - Minimal */}
        <header className="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <h1 className="text-lg font-bold text-white">MODE CONDUITE</h1>
                  <p className="text-sm text-green-400">{speed.toFixed(0)} km/h</p>
                </div>
              </div>
              <button
                onClick={() => onModeChange(false)}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-700 text-white rounded-xl hover:bg-slate-600 transition-colors"
              >
                <Coffee className="w-5 h-5" />
                <span className="font-medium">ARRÊT</span>
              </button>
            </div>
          </div>
        </header>

        {/* Navigation conduite - 3 boutons essentiels */}
        <div className="fixed bottom-0 left-0 right-0 bg-slate-800/95 backdrop-blur-sm border-t border-slate-700 z-50">
          <div className="grid grid-cols-3 gap-2 p-4">
            <button
              onClick={() => onTabChange('navigation')}
              className={`flex flex-col items-center justify-center py-6 px-4 rounded-2xl transition-all duration-200 ${
                activeTab === 'navigation'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 active:bg-slate-600'
              }`}
            >
              <Navigation className="w-8 h-8 mb-2" />
              <span className="text-sm font-bold">NAVIGATION</span>
            </button>
            
            <button
              onClick={() => onTabChange('communication')}
              className={`flex flex-col items-center justify-center py-6 px-4 rounded-2xl transition-all duration-200 ${
                activeTab === 'communication'
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-700 text-slate-300 active:bg-slate-600'
              }`}
            >
              <Users className="w-8 h-8 mb-2" />
              <span className="text-sm font-bold">GROUPE</span>
            </button>
            
            <button
              onClick={() => onTabChange('emergency')}
              className="flex flex-col items-center justify-center py-6 px-4 bg-red-600/20 border-2 border-red-500 text-red-400 rounded-2xl active:bg-red-600/40 transition-all duration-200"
            >
              <AlertTriangle className="w-8 h-8 mb-2" />
              <span className="text-sm font-bold">URGENCE</span>
            </button>
          </div>
        </div>

        {/* Contenu conduite */}
        <main className="pb-32 px-4 py-4">
          {children}
        </main>
      </div>
    );
  }

  // Mode Préparation - Interface complète
  const preparationTabs = [
    { id: 'itinerary', label: 'Itinéraire', icon: Route },
    { id: 'coordination', label: 'Groupe', icon: Users },
    { id: 'organization', label: 'Organisation', icon: Map },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header préparation */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Route className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">RGA Trip</h1>
                <p className="text-sm text-slate-400">Mode Préparation</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center hover:from-blue-600 hover:to-purple-700 transition-all"
              >
                <span className="text-white font-bold text-sm">
                  {(user?.user_metadata?.name || user?.email || 'U').charAt(0).toUpperCase()}
                </span>
              </button>
              <button
                onClick={() => onModeChange(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
              >
                <Car className="w-5 h-5" />
                <span className="font-medium">DÉMARRER</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation préparation - 4 onglets complets */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 z-50">
        <div className="grid grid-cols-4">
          {preparationTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center py-4 px-2 transition-all duration-200 ${
                  isActive
                    ? 'text-blue-400 bg-slate-700'
                    : 'text-slate-400 hover:text-white active:bg-slate-700'
                }`}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenu préparation */}
      <main className="pb-20 px-4 py-4">
        {showProfile && (
          <div className="mb-6">
            <UserProfile />
          </div>
        )}
        {children}
      </main>
    </div>
  );
}