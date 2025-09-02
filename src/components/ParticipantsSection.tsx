import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Users, Mail, Phone } from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'organizer' | 'member';
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
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'member' as 'organizer' | 'member'
  });

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', role: 'member' });
    setShowAddForm(false);
    setEditingParticipant(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingParticipant) {
      // Modifier un participant existant
      setParticipants(participants.map(p => 
        p.id === editingParticipant.id 
          ? { ...p, ...formData }
          : p
      ));
    } else {
      // Ajouter un nouveau participant
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
    if (confirm('Êtes-vous sûr de vouloir supprimer ce participant ?')) {
      setParticipants(participants.filter(p => p.id !== id));
    }
  };

  const organizers = participants.filter(p => p.role === 'organizer');
  const members = participants.filter(p => p.role === 'member');

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-600">Total Participants</p>
              <p className="text-2xl font-bold text-blue-900">{participants.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-600">Organisateurs</p>
              <p className="text-2xl font-bold text-green-900">{organizers.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-orange-600" />
            <div>
              <p className="text-sm font-medium text-orange-600">Membres</p>
              <p className="text-2xl font-bold text-orange-900">{members.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton d'ajout */}
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold text-slate-900">Participants du Voyage</h4>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un Participant
        </button>
      </div>

      {/* Formulaire d'ajout/modification */}
      {showAddForm && (
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h5 className="text-lg font-semibold text-slate-900 mb-4">
            {editingParticipant ? 'Modifier le Participant' : 'Nouveau Participant'}
          </h5>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nom et prénom"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="email@exemple.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Rôle
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'organizer' | 'member' })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="member">Membre</option>
                  <option value="organizer">Organisateur</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingParticipant ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des participants */}
      <div className="space-y-4">
        {participants.map((participant) => (
          <div key={participant.id} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {participant.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h5 className="font-semibold text-slate-900">{participant.name}</h5>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      participant.role === 'organizer' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {participant.role === 'organizer' ? 'Organisateur' : 'Membre'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-1 text-sm text-slate-600">
                    <div className="flex items-center space-x-1">
                      <Mail className="w-4 h-4" />
                      <span>{participant.email}</span>
                    </div>
                    {participant.phone && (
                      <div className="flex items-center space-x-1">
                        <Phone className="w-4 h-4" />
                        <span>{participant.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-xs text-slate-500 mt-1">
                    Rejoint le {participant.joinedAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(participant)}
                  className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(participant.id)}
                  className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}