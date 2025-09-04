import React, { useState } from 'react';
import { Upload, Download, Share2, FileText, Users, Clock, Trash2, Info, Navigation, Play } from 'lucide-react';
import { SharedGPX, GPXTrack } from '../types';

interface GPXSectionProps {
  onGPXTrackUpload: (track: GPXTrack) => void;
  onSelectGPXForNavigation: (gpxTrack: GPXTrack) => void;
  gpxTracks: GPXTrack[];
  activeNavigationGPXTrack: GPXTrack | null;
}

export default function GPXSection({ 
  onGPXTrackUpload, 
  onSelectGPXForNavigation, 
  gpxTracks, 
  activeNavigationGPXTrack 
}: GPXSectionProps) {
  const [sharedGPX, setSharedGPX] = useState<SharedGPX[]>([]);

  const [isUploading, setIsUploading] = useState(false);

  const parseGPXFile = (gpxContent: string, fileName: string): GPXTrack | null => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(gpxContent, 'text/xml');
      
      // Vérifier les erreurs de parsing
      const parseError = xmlDoc.querySelector('parsererror');
      if (parseError) {
        throw new Error('Fichier GPX invalide');
      }
      
      // Extraire les points de trace
      const trackPoints = xmlDoc.querySelectorAll('trkpt');
      const points: Array<{ lat: number; lng: number; elevation?: number }> = [];
      
      trackPoints.forEach(point => {
        const lat = parseFloat(point.getAttribute('lat') || '0');
        const lng = parseFloat(point.getAttribute('lon') || '0');
        const eleElement = point.querySelector('ele');
        const elevation = eleElement ? parseFloat(eleElement.textContent || '0') : undefined;
        
        if (lat && lng) {
          points.push({ lat, lng, elevation });
        }
      });
      
      if (points.length === 0) {
        throw new Error('Aucun point de trace trouvé dans le fichier GPX');
      }
      
      // Calculer la distance approximative
      let totalDistance = 0;
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const distance = calculateDistance(prev.lat, prev.lng, curr.lat, curr.lng);
        totalDistance += distance;
      }
      
      return {
        id: Date.now().toString(),
        name: fileName.replace('.gpx', ''),
        points,
        distance: totalDistance,
        uploadedAt: new Date()
      };
    } catch (error) {
      console.error('Erreur parsing GPX:', error);
      return null;
    }
  };
  
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.gpx')) {
      setIsUploading(true);
      
      // Lire le fichier GPX
      const reader = new FileReader();
      reader.onload = (e) => {
        const gpxContent = e.target?.result as string;
        const gpxTrack = parseGPXFile(gpxContent, file.name);
        
        if (gpxTrack) {
          // Ajouter à la liste des GPX partagés
          const newGPX: SharedGPX = {
            id: gpxTrack.id,
            name: gpxTrack.name,
            uploadedBy: 'Vous',
            uploadedAt: gpxTrack.uploadedAt,
            fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
            downloadCount: 0,
            stages: ['1'],
            description: `Parcours de ${gpxTrack.distance.toFixed(1)} km`
          };
          setSharedGPX([newGPX, ...sharedGPX]);
          
          // Ajouter à la carte
          onGPXTrackUpload(gpxTrack);
          
          // Vibration de confirmation
          if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
          }
        } else {
          alert('Erreur lors du traitement du fichier GPX');
        }
        
        setIsUploading(false);
      };
      
      reader.onerror = () => {
        alert('Erreur lors de la lecture du fichier');
        setIsUploading(false);
      };
      
      reader.readAsText(file);
    }
  };

  const activateGPXForNavigation = (gpxId: string) => {
    const gpxTrack = gpxTracks.find(track => track.id === gpxId);
    if (gpxTrack) {
      onSelectGPXForNavigation(gpxTrack);
      // Vibration de confirmation
      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
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
      {/* Tracé actif pour navigation */}
      {activeNavigationGPXTrack && (
        <div className="bg-green-600/20 border-2 border-green-500 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <Navigation className="w-6 h-6 text-green-400" />
            <div>
              <p className="font-bold text-green-300">Navigation Active</p>
              <p className="text-sm text-green-200">
                Tracé : {activeNavigationGPXTrack.name} ({activeNavigationGPXTrack.distance.toFixed(1)} km)
              </p>
            </div>
          </div>
        </div>
      )}

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
          <p className="text-xl font-bold text-white">{gpxTracks.length}</p>
          <p className="text-xs text-slate-400">Fichiers</p>
        </div>
        <div className="bg-slate-700 rounded-xl p-3 text-center">
          <Users className="w-6 h-6 text-green-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-white">3</p>
          <p className="text-xs text-slate-400">Participants</p>
        </div>
        <div className="bg-slate-700 rounded-xl p-3 text-center">
          <Navigation className="w-6 h-6 text-orange-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-white">{activeNavigationGPXTrack ? '1' : '0'}</p>
          <p className="text-xs text-slate-400">Actif</p>
        </div>
      </div>

      {/* Liste des fichiers GPX téléchargés */}
      <div>
        <h4 className="text-lg font-bold text-white mb-4 flex items-center">
          <Share2 className="w-5 h-5 mr-2 text-blue-400" />
          Mes Fichiers GPX
        </h4>
        
        {gpxTracks.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">Aucun fichier GPX téléchargé</p>
            <p className="text-sm text-slate-500 mt-1">Téléchargez vos tracés pour commencer</p>
          </div>
        ) : (
          <div className="space-y-3">
            {gpxTracks.map((gpxTrack) => {
              const isActive = activeNavigationGPXTrack?.id === gpxTrack.id;
              
              return (
                <div key={gpxTrack.id} className={`rounded-xl p-4 border-2 transition-all duration-200 ${
                  isActive 
                    ? 'border-green-500 bg-green-500/20' 
                    : 'border-slate-600 bg-slate-700'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isActive 
                          ? 'bg-gradient-to-br from-green-500 to-blue-500' 
                          : 'bg-gradient-to-br from-blue-500 to-purple-500'
                      }`}>
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-white text-lg">{gpxTrack.name}</h5>
                        <p className="text-slate-300 text-sm mb-1">
                          {gpxTrack.distance.toFixed(1)} km • {gpxTrack.points.length} points
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-slate-400">
                          <span>Ajouté le {gpxTrack.uploadedAt.toLocaleDateString('fr-FR')}</span>
                          {isActive && (
                            <span className="px-2 py-1 bg-green-500/30 text-green-300 rounded-full font-medium">
                              ACTIF
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      {!isActive ? (
                        <button
                          onClick={() => activateGPXForNavigation(gpxTrack.id)}
                          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 active:bg-green-800 transition-colors"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          <span className="font-medium">Activer</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onSelectGPXForNavigation(null as any)}
                          className="flex items-center px-4 py-2 bg-slate-600 text-white rounded-xl hover:bg-slate-500 transition-colors"
                        >
                          <span className="font-medium">Désactiver</span>
                        </button>
                      )}
                      
                      <button
                        onClick={() => downloadGPX({ 
                          id: gpxTrack.id, 
                          name: gpxTrack.name, 
                          uploadedBy: 'Vous', 
                          uploadedAt: gpxTrack.uploadedAt, 
                          fileSize: '0 MB', 
                          downloadCount: 0, 
                          stages: [] 
                        })}
                        className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-600 rounded-xl transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Liste des fichiers GPX partagés par d'autres */}
      {sharedGPX.length > 0 && (
        <div>
          <h4 className="text-lg font-bold text-white mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-purple-400" />
            Fichiers Partagés par le Groupe
          </h4>
          <div className="space-y-3">
            {sharedGPX.map((gpx) => (
              <div key={gpx.id} className="bg-slate-700 rounded-xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
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
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors"
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
      )}

      {/* Instructions d'utilisation */}
      <div className="bg-blue-600/20 border border-blue-500/50 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <Info className="w-6 h-6 text-blue-400 mt-0.5" />
          <div>
            <h5 className="font-bold text-blue-300 mb-2">Comment utiliser les fichiers GPX</h5>
            <ul className="text-sm text-blue-200 space-y-1">
              <li>• Téléchargez vos fichiers GPX (J1, J2, J3, etc.)</li>
              <li>• Cliquez sur "Activer" pour lancer la navigation sur un tracé</li>
              <li>• La carte se centrera automatiquement sur le tracé actif</li>
              <li>• Un seul tracé peut être actif à la fois</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
          // Vibration de confirmation
          if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
          }
        } else {
          alert('Erreur lors du traitement du fichier GPX');
        }
        
        setIsUploading(false);
      };
      
      reader.onerror = () => {
        alert('Erreur lors de la lecture du fichier');
        setIsUploading(false);
      };
      
      reader.readAsText(file);
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