import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Users, Mail, Phone } from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'organizer' | 'member' | 'observer';
  joinedAt: Date;
}

export default function ParticipantsSection() {
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: '1',
      name: 'Marc Dubois',
      email: 'marc.dubois@email.com',
      phone: '+33 6 12 34 56 78',
      role: 'organizer',
      joinedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      name: 'Sophie Martin',
      email: 'sophie.martin@email.com',
      phone: '+33 6 98 76 54 32',
      role: 'member',
      joinedAt: new Date('2024-01-20')
    },
    {
      id: '3',
      name: 'Pierre Durand',
      email: 'pierre.durand@email.com',
      role: 'member',
      joinedAt: new Date('2024-01-25')
    },
    {
      id: '4',
      name: 'Julie Moreau',
      email: 'julie.moreau@email.com',
      phone: '+33 6 11 22 33 44',
      role: 'observer',
      joinedAt: new Date('2024-01-28')
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'member' as 'organizer' | 'member' | 'observer'
  });

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', role: 'member' });
    setShowAddForm(false);
    setEditingParticipant(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingParticipant) {
      setParticipants(participants.map(p => 
        p.id === editingParticipant.id 
          ? { ...p, ...formData }
          : p
      ));
    } else {
      const newParticipant: Participant = {
        id: Date.now().toString(),
        ...formData,
        joinedAt: new Date()
      };
      setParticipants([...participants, newParticipant]);
    }
    
    resetForm();
  };

  const handleEdit = (participant: Participant) => {
    setFormData({
      name: participant.name,
      email: participant.email,
      phone: participant.phone || '',
      role: participant.role
    });
    setEditingParticipant(participant);
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Supprimer ce participant ?')) {
      setParticipants(participants.filter(p => p.id !== id));
    }
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const organizers = participants.filter(p => p.role === 'organizer');
  const members = participants.filter(p => p.role === 'member');
  const observers = participants.filter(p => p.role === 'observer');

  return (
    <div className="space-y-6">
      {/* Statistiques compactes */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-slate-700 rounded-xl p-3 text-center">
          <Users className="w-6 h-6 text-blue-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-white">{participants.length}</p>
          <p className="text-xs text-slate-400">Total</p>
        </div>
        <div className="bg-slate-700 rounded-xl p-3 text-center">
          <Users className="w-6 h-6 text-green-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-white">{organizers.length}</p>
          <p className="text-xs text-slate-400">Orgas</p>
        </div>
        <div className="bg-slate-700 rounded-xl p-3 text-center">
          <Users className="w-6 h-6 text-orange-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-white">{members.length}</p>
          <p className="text-xs text-slate-400">Membres</p>
        </div>
        <div className="bg-slate-700 rounded-xl p-3 text-center">
          <Users className="w-6 h-6 text-purple-400 mx-auto mb-1" />
          <p className="text-xl font-bold text-white">{observers.length}</p>
          <p className="text-xs text-slate-400">Observateurs</p>
        </div>
      </div>

      {/* Bouton d'ajout */}
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-bold text-white">Contacts</h4>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter
        </button>
      </div>

      {/* Formulaire d'ajout/modification */}
      {showAddForm && (
        <div className="bg-slate-700 rounded-xl p-4">
          <h5 className="text-lg font-bold text-white mb-4">
            {editingParticipant ? 'Modifier' : 'Nouveau Contact'}
          </h5>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Nom *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nom complet"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="email@exemple.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+33 6 12 34 56 78"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Rôle
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'organizer' | 'member' | 'observer' })}
                className="w-full px-4 py-3 bg-slate-600 border border-slate-500 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="member">Membre</option>
                <option value="organizer">Organisateur</option>
                <option value="observer">Observateur</option>
              </select>
            </div>
            
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 py-3 text-slate-300 border border-slate-500 rounded-xl hover:bg-slate-600 active:bg-slate-500 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors"
              >
                {editingParticipant ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des participants - Optimisée mobile */}
      {participants.length === 0 ? (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <p className="text-slate-400">Aucun contact ajouté</p>
          <p className="text-sm text-slate-500 mt-1">Ajoutez les participants de votre voyage</p>
        </div>
      ) : (
        <div className="space-y-3">
          {participants.map((participant) => (
            <div key={participant.id} className="bg-slate-700 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {participant.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h5 className="font-bold text-white">{participant.name}</h5>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        participant.role === 'organizer' 
                          ? 'bg-green-500/20 text-green-400' 
                          : participant.role === 'member'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-purple-500/20 text-purple-400'
                      }`}>
                        {participant.role === 'organizer' ? 'Orga' : 
                         participant.role === 'member' ? 'Membre' : 'Observateur'}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-3 mt-1 text-sm text-slate-300">
                      <div className="flex items-center space-x-1">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{participant.email}</span>
                      </div>
                    </div>
                    
                    {participant.phone && (
                      <div className="flex items-center space-x-1 mt-1 text-sm text-slate-300">
                        <Phone className="w-3 h-3" />
                        <span>{participant.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  {participant.phone && (
                    <button
                      onClick={() => handleCall(participant.phone!)}
                      className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                  )}
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleEdit(participant)}
                      className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-600 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(participant.id)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-600 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}