import React, { useState } from 'react';
import { Camera, Plus, MapPin, Heart, Share2, Download, Tag, Clock, User } from 'lucide-react';
import { TripMemory } from '../types';

export default function MemoriesSection() {
  const [memories, setMemories] = useState<TripMemory[]>([
    {
      id: '1',
      type: 'photo',
      title: 'Vue Mont-Blanc',
      content: 'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800',
      lat: 45.9237,
      lng: 6.8694,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      addedBy: 'Marc',
      tags: ['montagne', 'panorama', 'chamonix']
    },
    {
      id: '2',
      type: 'note',
      title: 'Restaurant excellent',
      content: 'Superbe accueil au restaurant La Bergerie. Parking moto sécurisé, spécialités savoyardes délicieuses. À recommander !',
      lat: 45.9200,
      lng: 6.8650,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      addedBy: 'Sophie',
      tags: ['restaurant', 'recommandation']
    },
    {
      id: '3',
      type: 'achievement',
      title: 'Premier col à 2000m',
      content: 'Col des Montets franchi ! Premier col au-dessus de 2000m pour Pierre.',
      lat: 46.0069,
      lng: 6.9242,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      addedBy: 'Pierre',
      tags: ['col', 'altitude', 'première']
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newMemory, setNewMemory] = useState({
    type: 'note' as 'photo' | 'note' | 'achievement',
    title: '',
    content: '',
    tags: ''
  });

  const addMemory = () => {
    if (!newMemory.title.trim()) return;

    // Simuler la géolocalisation actuelle
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const memory: TripMemory = {
          id: Date.now().toString(),
          type: newMemory.type,
          title: newMemory.title,
          content: newMemory.content,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: new Date(),
          addedBy: 'Vous',
          tags: newMemory.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        };
        
        setMemories([memory, ...memories]);
        setNewMemory({ type: 'note', title: '', content: '', tags: '' });
        setShowAddForm(false);
        
        // Vibration de confirmation
        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
      },
      () => {
        // Fallback sans géolocalisation
        const memory: TripMemory = {
          id: Date.now().toString(),
          type: newMemory.type,
          title: newMemory.title,
          content: newMemory.content,
          timestamp: new Date(),
          addedBy: 'Vous',
          tags: newMemory.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        };
        
        setMemories([memory, ...memories]);
        setNewMemory({ type: 'note', title: '', content: '', tags: '' });
        setShowAddForm(false);
      }
    );
  };

  const shareMemory = (memory: TripMemory) => {
    if (navigator.share) {
      navigator.share({
        title: memory.title,
        text: memory.content,
        url: window.location.href
      });
    } else {
      // Fallback pour navigateurs sans Web Share API
      navigator.clipboard.writeText(`${memory.title}\n${memory.content}\n\nPartagé depuis RGA Trip`);
      // Vibration de confirmation
      if (navigator.vibrate) {
        navigator.vibrate(100);
      }
    }
  };

  const getMemoryIcon = (type: TripMemory['type']) => {
    switch (type) {
      case 'photo': return <Camera className="w-6 h-6 text-blue-400" />;
      case 'note': return <MapPin className="w-6 h-6 text-green-400" />;
      case 'achievement': return <Heart className="w-6 h-6 text-red-400" />;
      default: return <MapPin className="w-6 h-6 text-slate-400" />;
    }
  };

  const getMemoryColor = (type: TripMemory['type']) => {
    switch (type) {
      case 'photo': return 'border-blue-500 bg-blue-500/20';
      case 'note': return 'border-green-500 bg-green-500/20';
      case 'achievement': return 'border-red-500 bg-red-500/20';
      default: return 'border-slate-500 bg-slate-500/20';
    }
  };

  return (
    <div className="space-y-4">
      {/* Statistiques des souvenirs */}
      <div className="bg-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Camera className="w-6 h-6 mr-2 text-blue-400" />
            Carnet de Voyage
          </h3>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-700 rounded-xl p-3 text-center">
            <Camera className="w-6 h-6 text-blue-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-white">
              {memories.filter(m => m.type === 'photo').length}
            </p>
            <p className="text-xs text-slate-400">Photos</p>
          </div>
          <div className="bg-slate-700 rounded-xl p-3 text-center">
            <MapPin className="w-6 h-6 text-green-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-white">
              {memories.filter(m => m.type === 'note').length}
            </p>
            <p className="text-xs text-slate-400">Notes</p>
          </div>
          <div className="bg-slate-700 rounded-xl p-3 text-center">
            <Heart className="w-6 h-6 text-red-400 mx-auto mb-1" />
            <p className="text-xl font-bold text-white">
              {memories.filter(m => m.type === 'achievement').length}
            </p>
            <p className="text-xs text-slate-400">Exploits</p>
          </div>
        </div>
      </div>

      {/* Formulaire d'ajout */}
      {showAddForm && (
        <div className="bg-slate-800 rounded-2xl p-6">
          <h4 className="text-lg font-bold text-white mb-4">Nouveau Souvenir</h4>
          
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {(['note', 'photo', 'achievement'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setNewMemory({ ...newMemory, type })}
                  className={`p-3 rounded-xl border-2 transition-colors ${
                    newMemory.type === type
                      ? getMemoryColor(type)
                      : 'border-slate-600 bg-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-1">
                    {getMemoryIcon(type)}
                    <span className="text-sm font-medium capitalize">{type}</span>
                  </div>
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Titre du souvenir"
              value={newMemory.title}
              onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400"
            />

            <textarea
              placeholder="Description, notes, impressions..."
              value={newMemory.content}
              onChange={(e) => setNewMemory({ ...newMemory, content: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 resize-none"
            />

            <input
              type="text"
              placeholder="Tags (séparés par des virgules)"
              value={newMemory.tags}
              onChange={(e) => setNewMemory({ ...newMemory, tags: e.target.value })}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400"
            />

            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 py-3 text-slate-300 border border-slate-600 rounded-xl hover:bg-slate-700 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={addMemory}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timeline des souvenirs */}
      <div className="bg-slate-800 rounded-2xl p-6">
        <h4 className="text-lg font-bold text-white mb-4">Timeline</h4>
        
        <div className="space-y-4">
          {memories.map((memory) => (
            <div key={memory.id} className={`p-4 rounded-xl border-2 ${getMemoryColor(memory.type)}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {getMemoryIcon(memory.type)}
                  <div>
                    <h5 className="font-bold text-white text-lg">{memory.title}</h5>
                    <div className="flex items-center space-x-2 text-sm text-slate-400">
                      <User className="w-3 h-3" />
                      <span>{memory.addedBy}</span>
                      <Clock className="w-3 h-3" />
                      <span>{memory.timestamp.toLocaleString('fr-FR')}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => shareMemory(memory)}
                  className="p-2 text-slate-400 hover:text-blue-400 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {memory.type === 'photo' && memory.content.startsWith('http') ? (
                <img 
                  src={memory.content} 
                  alt={memory.title}
                  className="w-full h-48 object-cover rounded-lg mb-3"
                />
              ) : (
                <p className="text-slate-200 mb-3">{memory.content}</p>
              )}

              {memory.lat && memory.lng && (
                <div className="flex items-center space-x-2 text-sm text-slate-400 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>Position : {memory.lat.toFixed(4)}, {memory.lng.toFixed(4)}</span>
                </div>
              )}

              {memory.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {memory.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-slate-600 text-slate-300 text-xs rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}