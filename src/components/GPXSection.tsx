import React, { useState } from 'react';
import { Upload, Download, Share2, FileText, Users, Clock, Trash2 } from 'lucide-react';
import { SharedGPX } from '../types';

export default function GPXSection() {
  const [sharedGPX, setSharedGPX] = useState<SharedGPX[]>([
    {
      id: '1',
      name: 'Route des Grandes Alpes - Jour 1',
      uploadedBy: 'Marc',
      uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      fileSize: '2.3 MB',
      downloadCount: 3,
      stages: ['1'],
      description: 'Thonon → Chamonix via Col des Gets'
    },
    {
      id: '2',
      name: 'Route des Grandes Alpes - Jour 2',
      uploadedBy: 'Sophie',
      uploadedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      fileSize: '3.1 MB',
      downloadCount: 2,
      stages: ['2'],
      description: 'Chamonix → Bourg-St-Maurice via Col des Montets'
    },
    {
      id: '3',
      name: 'Route Complète RGA',
      uploadedBy: 'Marc',
      uploadedAt: new Date(Date.now() - 30 * 60 * 1000),
      fileSize: '8.7 MB',
      downloadCount: 3,
      stages: ['1', '2', '3'],
      description: 'Parcours complet des 3 jours avec tous les POIs'
    }
  ]);

  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.gpx')) {
      setIsUploading(true);
      
      // Simulation d'upload
      setTimeout(() => {
        const newGPX: SharedGPX = {
          id: Date.now().toString(),
          name: file.name.replace('.gpx', ''),
          uploadedBy: 'Vous',
          uploadedAt: new Date(),
          fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          downloadCount: 0,
          stages: ['1'],
          description: 'Nouveau parcours partagé'
        };
        setSharedGPX([newGPX, ...sharedGPX]);
        setIsUploading(false);
        
        // Vibration de confirmation
        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
      }, 2000);
    }
  };

  const downloadGPX = (gpx: SharedGPX) => {
    // Simulation de téléchargement
    setSharedGPX(prev => 
      prev.map(item => 
        item.id === gpx.id 
          ? { ...item, downloadCount: item.downloadCount + 1 }
          : item
      )
    );
    
    // Vibration de confirmation
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
  };

  const deleteGPX = (id: string) => {
    if (confirm('Supprimer ce fichier GPX ?')) {
      setSharedGPX(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="space-y-4">
      {/* Zone d'upload - Optimisée tactile */}
      <div className="border-2 border-dashed border-blue-500/50 rounded-xl p-6 text-center bg-blue-500/10">
        <Upload className="w-12 h-12 text-blue-400 mx-auto mb-3" />
        <h4 className="text-lg font-bold text-white mb-2">Partager un GPX</h4>
        <p className="text-slate-300 text-sm mb-4">
          Téléversez votre fichier GPX pour le partager avec le groupe
        </p>
        
        <label className={`inline-flex items-center px-6 py-4 rounded-xl transition-all duration-200 cursor-pointer ${
          isUploading 
            ? 'bg-slate-600 text-slate-400' 
            : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
        }`}>
          {isUploading ? (
            <>
              <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin mr-2" />
              Téléversement...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 mr-2" />
              Choisir un fichier GPX
            </>
          )}
          <input
            type="file"
            accept=".gpx"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Statistiques de partage */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-700 rounded-xl p-3 text-center">
          <FileText className="w-6 h-6 text-blue-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-white">{sharedGPX.length}</p>
          <p className="text-xs text-slate-400">Fichiers</p>
        </div>
        <div className="bg-slate-700 rounded-xl p-3 text-center">
          <Users className="w-6 h-6 text-green-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-white">3</p>
          <p className="text-xs text-slate-400">Participants</p>
        </div>
        <div className="bg-slate-700 rounded-xl p-3 text-center">
          <Download className="w-6 h-6 text-orange-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-white">
            {sharedGPX.reduce((sum, gpx) => sum + gpx.downloadCount, 0)}
          </p>
          <p className="text-xs text-slate-400">Téléchargements</p>
        </div>
      </div>

      {/* Liste des fichiers GPX partagés */}
      <div>
        <h4 className="text-lg font-bold text-white mb-4 flex items-center">
          <Share2 className="w-5 h-5 mr-2 text-blue-400" />
          Fichiers Partagés
        </h4>
        <div className="space-y-3">
          {sharedGPX.map((gpx) => (
            <div key={gpx.id} className="bg-slate-700 rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-bold text-white text-lg">{gpx.name}</h5>
                    <p className="text-slate-300 text-sm mb-1">{gpx.description}</p>
                    <div className="flex items-center space-x-4 text-xs text-slate-400">
                      <span>Par {gpx.uploadedBy}</span>
                      <span>{gpx.fileSize}</span>
                      <span>{gpx.downloadCount} téléchargements</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => downloadGPX(gpx)}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 active:bg-green-800 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    <span className="font-medium">Télécharger</span>
                  </button>
                  
                  {gpx.uploadedBy === 'Vous' && (
                    <button
                      onClick={() => deleteGPX(gpx.id)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-600 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Étapes couvertes */}
              <div className="flex items-center space-x-2">
                <span className="text-slate-400 text-sm">Étapes :</span>
                <div className="flex space-x-1">
                  {gpx.stages.map((stageId) => (
                    <span key={stageId} className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                      J{stageId}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>
                    Partagé il y a {Math.floor((Date.now() - gpx.uploadedAt.getTime()) / 60000)}min
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions d'utilisation */}
      <div className="bg-blue-600/20 border border-blue-500/50 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <Info className="w-6 h-6 text-blue-400 mt-0.5" />
          <div>
            <h5 className="font-bold text-blue-300 mb-2">Comment utiliser les fichiers GPX</h5>
            <ul className="text-sm text-blue-200 space-y-1">
              <li>• Téléchargez les fichiers sur votre GPS/smartphone</li>
              <li>• Importez dans votre app de navigation (Waze, Google Maps, etc.)</li>
              <li>• Tous les participants auront le même parcours</li>
              <li>• Les POIs sont inclus dans les fichiers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}