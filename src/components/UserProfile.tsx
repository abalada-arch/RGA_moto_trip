import React, { useState } from 'react';
import { User, LogOut, Shield, Settings, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function UserProfile() {
  const { user, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.user_metadata?.name || '');

  const handleSignOut = async () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      await signOut();
    }
  };

  const handleSave = async () => {
    // Ici vous pourriez mettre à jour le profil utilisateur dans Supabase
    setIsEditing(false);
  };

  return (
    <div className="bg-slate-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center">
          <User className="w-6 h-6 mr-2 text-blue-400" />
          Mon Profil
        </h3>
        <button
          onClick={handleSignOut}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 active:bg-red-800 transition-colors"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Déconnexion
        </button>
      </div>

      <div className="space-y-4">
        {/* Avatar */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">
              {(user?.user_metadata?.name || user?.email || 'U').charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            {isEditing ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  placeholder="Votre nom"
                />
                <button
                  onClick={handleSave}
                  className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Save className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <div>
                  <p className="font-bold text-white text-lg">
                    {user?.user_metadata?.name || 'Utilisateur'}
                  </p>
                  <p className="text-slate-400 text-sm">{user?.email}</p>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Informations du compte */}
        <div className="bg-slate-700 rounded-xl p-4">
          <h4 className="font-bold text-white mb-3 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-green-400" />
            Sécurité du Compte
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Statut</span>
              <span className="text-green-400 font-medium">Connecté</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Email vérifié</span>
              <span className={`font-medium ${
                user?.email_confirmed_at ? 'text-green-400' : 'text-orange-400'
              }`}>
                {user?.email_confirmed_at ? 'Oui' : 'En attente'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Dernière connexion</span>
              <span className="text-slate-400">
                {user?.last_sign_in_at 
                  ? new Date(user.last_sign_in_at).toLocaleDateString('fr-FR')
                  : 'Inconnue'
                }
              </span>
            </div>
          </div>
        </div>

        {/* Actions du compte */}
        <div className="space-y-3">
          <button className="w-full p-4 bg-slate-700 text-white rounded-xl hover:bg-slate-600 active:bg-slate-500 transition-colors text-left">
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5 text-blue-400" />
              <div>
                <p className="font-medium">Paramètres du compte</p>
                <p className="text-sm text-slate-400">Modifier mot de passe, préférences</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}