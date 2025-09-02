import React from 'react';
import { MapPin, Clock, Navigation } from 'lucide-react';
import { TripStage } from '../types';

interface StagesListProps {
  stages: TripStage[];
  selectedStage: string | null;
  onStageSelect: (stageId: string) => void;
}

export default function StagesList({ stages, selectedStage, onStageSelect }: StagesListProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-4 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Étapes du Voyage</h3>
        <p className="text-sm text-slate-600 mt-1">3 jours • 300 km</p>
      </div>
      
      <div className="p-4 space-y-3">
        {stages.map((stage) => (
          <div
            key={stage.id}
            onClick={() => onStageSelect(stage.id)}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              selectedStage === stage.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold bg-blue-600 text-white px-2 py-1 rounded-full">
                  J{stage.day}
                </span>
                <h4 className="font-semibold text-slate-900 text-sm">
                  {stage.title}
                </h4>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-slate-600 text-sm">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{stage.startLocation} → {stage.endLocation}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-slate-600">
                  <Navigation className="w-4 h-4 mr-1" />
                  <span>{stage.distance} km</span>
                </div>
                <div className="flex items-center text-slate-600">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{Math.floor(stage.duration / 60)}h {stage.duration % 60}min</span>
                </div>
              </div>
              
              {stage.description && (
                <p className="text-xs text-slate-500 mt-2">{stage.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}