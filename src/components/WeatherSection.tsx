import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Snowflake, Wind, Eye, AlertTriangle, Thermometer, Droplets } from 'lucide-react';
import { WeatherData, WeatherAlert, TripStage } from '../types';

interface WeatherSectionProps {
  stages: TripStage[];
}

export default function WeatherSection({ stages }: WeatherSectionProps) {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);

  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);

  const getWeatherIcon = (condition: WeatherData['condition']) => {
    switch (condition) {
      case 'sunny': return <Sun className="w-8 h-8 text-yellow-400" />;
      case 'cloudy': return <Cloud className="w-8 h-8 text-slate-400" />;
      case 'rainy': return <CloudRain className="w-8 h-8 text-blue-400" />;
      case 'stormy': return <AlertTriangle className="w-8 h-8 text-red-400" />;
      case 'snowy': return <Snowflake className="w-8 h-8 text-blue-200" />;
      case 'foggy': return <Eye className="w-8 h-8 text-slate-300" />;
      default: return <Cloud className="w-8 h-8 text-slate-400" />;
    }
  };

  const getConditionLabel = (condition: WeatherData['condition']) => {
    switch (condition) {
      case 'sunny': return 'Ensoleillé';
      case 'cloudy': return 'Nuageux';
      case 'rainy': return 'Pluvieux';
      case 'stormy': return 'Orageux';
      case 'snowy': return 'Neigeux';
      case 'foggy': return 'Brouillard';
      default: return 'Inconnu';
    }
  };

  const getAlertColor = (severity: WeatherAlert['severity']) => {
    switch (severity) {
      case 'low': return 'border-yellow-500 bg-yellow-500/20 text-yellow-300';
      case 'medium': return 'border-orange-500 bg-orange-500/20 text-orange-300';
      case 'high': return 'border-red-500 bg-red-500/20 text-red-300';
      case 'extreme': return 'border-red-600 bg-red-600/30 text-red-200';
      default: return 'border-slate-500 bg-slate-500/20 text-slate-300';
    }
  };

  const getAlertIcon = (type: WeatherAlert['type']) => {
    switch (type) {
      case 'storm': return <AlertTriangle className="w-6 h-6" />;
      case 'rain': return <CloudRain className="w-6 h-6" />;
      case 'snow': return <Snowflake className="w-6 h-6" />;
      case 'wind': return <Wind className="w-6 h-6" />;
      case 'fog': return <Eye className="w-6 h-6" />;
      case 'ice': return <Snowflake className="w-6 h-6" />;
      default: return <AlertTriangle className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Alertes météo urgentes - EN HAUT */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-lg font-bold text-white flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
            Alertes Météo
          </h4>
          {alerts.map((alert) => (
            <div key={alert.id} className={`p-4 rounded-xl border-2 ${getAlertColor(alert.severity)}`}>
              <div className="flex items-start space-x-3">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <h5 className="font-bold text-lg mb-1">{alert.title}</h5>
                  <p className="text-sm mb-2">{alert.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span>{alert.location}</span>
                    <span>
                      {alert.startTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - 
                      {alert.endTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Météo par étape - Cartes compactes */}
      <div>
        <h4 className="text-lg font-bold text-white mb-4 flex items-center">
          <Cloud className="w-5 h-5 mr-2 text-blue-400" />
          Météo du Parcours
        </h4>
        
        {weatherData.length === 0 ? (
          <div className="text-center py-8">
            <Cloud className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">Aucune donnée météo disponible</p>
            <p className="text-sm text-slate-500 mt-1">Les prévisions s'afficheront automatiquement</p>
          </div>
        ) : (
          <div className="space-y-3">
            {weatherData.map((weather, index) => {
              const stage = stages[index];
              return (
                <div key={weather.id} className="bg-slate-700 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-bold bg-blue-600 text-white px-2 py-1 rounded-full">
                        J{stage?.day || index + 1}
                      </span>
                      <div>
                        <h5 className="font-bold text-white">{weather.location}</h5>
                        <p className="text-slate-400 text-sm">{getConditionLabel(weather.condition)}</p>
                      </div>
                    </div>
                    {getWeatherIcon(weather.condition)}
                  </div>

                  {/* Données météo en grille */}
                  <div className="grid grid-cols-4 gap-3 text-center">
                    <div className="bg-slate-600 rounded-lg p-2">
                      <Thermometer className="w-4 h-4 text-red-400 mx-auto mb-1" />
                      <p className="text-white font-bold text-lg">{weather.temperature}°</p>
                      <p className="text-slate-400 text-xs">Temp</p>
                    </div>
                    <div className="bg-slate-600 rounded-lg p-2">
                      <Wind className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                      <p className="text-white font-bold text-lg">{weather.windSpeed}</p>
                      <p className="text-slate-400 text-xs">km/h {weather.windDirection}</p>
                    </div>
                    <div className="bg-slate-600 rounded-lg p-2">
                      <Droplets className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                      <p className="text-white font-bold text-lg">{weather.humidity}%</p>
                      <p className="text-slate-400 text-xs">Humidité</p>
                    </div>
                    <div className="bg-slate-600 rounded-lg p-2">
                      <Eye className="w-4 h-4 text-green-400 mx-auto mb-1" />
                      <p className="text-white font-bold text-white">{weather.visibility}</p>
                      <p className="text-slate-400 text-xs">km</p>
                    </div>
                  </div>
                  {/* Alertes spécifiques à cette étape */}
                  {alerts.filter(alert => alert.affectedStages.includes(stage?.id || '')).length > 0 && (
                    <div className="mt-3 p-2 bg-red-500/20 border border-red-500/50 rounded-lg">
                      <p className="text-red-300 text-sm font-medium flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Alerte sur cette étape
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        </div>
    </div>
  );
}