import React, { useState } from 'react';
import { 
  HelpCircle, 
  Settings, 
  Info, 
  MapPin, 
  Users, 
  Route,
  Play,
  Square,
  Navigation,
  Gauge,
  Cloud,
  Mountain,
  Share2,
  CheckSquare,
  FileText,
  Calculator,
  Phone,
  AlertTriangle,
  Download,
  Upload,
  Eye,
  Fuel,
  Coffee,
  ThumbsUp,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

export default function SettingsModule() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [autoRecording, setAutoRecording] = useState(true);
  const [gpsAccuracy, setGpsAccuracy] = useState('high');
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const helpSections = [
    {
      id: 'general',
      title: 'Vue d\'ensemble',
      icon: Info,
      content: [
        {
          title: 'À propos de RGA Trip',
          description: 'Application dédiée aux voyages moto en groupe sur la Route des Grandes Alpes. Conçue pour être utilisée pendant la conduite avec des gants.',
          features: [
            'Interface tactile optimisée pour les gants',
            'Mode sombre pour réduire l\'éblouissement',
            'Feedback vibratoire pour les confirmations',
            'Boutons d\'urgence toujours accessibles'
          ]
        }
      ]
    },
    {
      id: 'route',
      title: 'Section Route',
      icon: Route,
      content: [
        {
          title: 'Carte Interactive',
          description: 'Navigation GPS avec mode plein écran pour le guidage.',
          features: [
            'Appuyez sur "Plein Écran" pour la navigation',
            'Cliquez sur la carte pour ajouter des POIs',
            'Boutons rapides accessibles en navigation',
            'Zoom automatique sur votre position'
          ]
        },
        {
          title: 'Météo Géolocalisée',
          description: 'Prévisions météo pour chaque étape du parcours.',
          features: [
            'Alertes météo en temps réel',
            'Conditions par col et altitude',
            'Prévisions vent et visibilité',
            'Alertes de sécurité automatiques'
          ]
        },
        {
          title: 'État des Routes',
          description: 'Informations sur l\'ouverture des cols et routes.',
          features: [
            'Statut en temps réel des cols',
            'Conditions de circulation',
            'Alertes fermetures/restrictions',
            'Informations d\'altitude'
          ]
        },
        {
          title: 'Partage GPX',
          description: 'Partage de fichiers GPX avec tout le groupe.',
          features: [
            'Upload de vos parcours GPX',
            'Téléchargement des parcours du groupe',
            'Synchronisation automatique',
            'Export vers GPS/navigation'
          ]
        },
        {
          title: 'Enregistrement Auto',
          description: 'Enregistrement automatique de vos trajets.',
          features: [
            'Démarrage automatique en mouvement',
            'Arrêt automatique à l\'arrêt prolongé',
            'Statistiques en temps réel',
            'Export GPX automatique'
          ]
        }
      ]
    },
    {
      id: 'coordination',
      title: 'Section Groupe',
      icon: Users,
      content: [
        {
          title: 'Actions Rapides',
          description: 'Communication instantanée avec le groupe.',
          features: [
            'ESSENCE : Signaler un arrêt carburant',
            'PAUSE : Demander un arrêt',
            'URGENCE : Alerte immédiate au groupe',
            'Feedback vibratoire sur chaque action'
          ]
        },
        {
          title: 'Statut Groupe',
          description: 'Suivi en temps réel de tous les participants.',
          features: [
            'Position GPS de chaque membre',
            'Statut actuel (en route, pause, etc.)',
            'Bouton "VU" pour confirmer réception',
            'Historique des dernières actions'
          ]
        },
        {
          title: 'Position GPS',
          description: 'Localisation temps réel du groupe.',
          features: [
            'Carte avec positions de tous',
            'Mise à jour automatique',
            'Calcul des distances entre membres',
            'Mode économie batterie disponible'
          ]
        }
      ]
    },
    {
      id: 'organization',
      title: 'Section Infos',
      icon: FileText,
      content: [
        {
          title: 'Contacts',
          description: 'Gestion des participants et contacts d\'urgence.',
          features: [
            'Appel direct depuis l\'app',
            'Rôles organisateur/membre',
            'Informations de contact complètes',
            'Ajout/modification facile'
          ]
        },
        {
          title: 'Listes de Vérification',
          description: 'Checklists partagées et personnelles.',
          features: [
            'Liste groupe (hébergements, météo, etc.)',
            'Liste personnelle (équipement, moto)',
            'Progression visuelle',
            'Synchronisation avec le groupe'
          ]
        },
        {
          title: 'Documents',
          description: 'Coffre-fort sécurisé pour vos papiers.',
          features: [
            'Stockage sécurisé hors ligne',
            'Permis, assurance, carte grise',
            'Accès rapide en cas de contrôle',
            'Sauvegarde automatique'
          ]
        },
        {
          title: 'Frais Partagés',
          description: 'Gestion des dépenses du voyage.',
          features: [
            'Calcul automatique des parts',
            'Équilibrage des comptes',
            'Catégories (essence, repas, etc.)',
            'Export des résumés'
          ]
        }
      ]
    },
    {
      id: 'safety',
      title: 'Sécurité & Urgences',
      icon: AlertTriangle,
      content: [
        {
          title: 'Bouton d\'Urgence',
          description: 'Alerte immédiate en cas de problème.',
          features: [
            'Accessible depuis toutes les sections',
            'Envoie position GPS au groupe',
            'Vibration d\'alerte forte',
            'Appel automatique services d\'urgence'
          ]
        },
        {
          title: 'Localisation d\'Urgence',
          description: 'Partage de position en cas de besoin.',
          features: [
            'Coordonnées GPS précises',
            'Plus3Words pour les secours',
            'Partage par SMS automatique',
            'Historique des positions'
          ]
        }
      ]
    },
    {
      id: 'tips',
      title: 'Conseils d\'Utilisation',
      icon: HelpCircle,
      content: [
        {
          title: 'Utilisation en Moto',
          description: 'Conseils pour une utilisation optimale.',
          features: [
            'Fixez le téléphone en position portrait',
            'Utilisez des gants compatibles tactile',
            'Activez le mode "Ne pas déranger"',
            'Gardez une batterie externe'
          ]
        },
        {
          title: 'Économie de Batterie',
          description: 'Optimiser l\'autonomie pendant le voyage.',
          features: [
            'Mode économie GPS activable',
            'Réduction de la luminosité auto',
            'Mise en veille intelligente',
            'Alertes niveau batterie'
          ]
        },
        {
          title: 'Connectivité',
          description: 'Gestion de la connexion réseau.',
          features: [
            'Fonctionne hors ligne',
            'Synchronisation automatique',
            'Mode données limitées',
            'Partage par Bluetooth/WiFi'
          ]
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-slate-800 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-orange-500 rounded-xl flex items-center justify-center">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Configuration</h2>
            <p className="text-slate-400">Paramètres et aide de l'application</p>
          </div>
        </div>

        {/* Paramètres rapides */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-700 rounded-xl">
            <div>
              <p className="font-medium text-white">Enregistrement Automatique</p>
              <p className="text-sm text-slate-400">Démarre automatiquement en mouvement</p>
            </div>
            <button
              onClick={() => setAutoRecording(!autoRecording)}
              className={`w-12 h-6 rounded-full transition-colors ${
                autoRecording ? 'bg-green-500' : 'bg-slate-600'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                autoRecording ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-700 rounded-xl">
            <div>
              <p className="font-medium text-white">Vibrations</p>
              <p className="text-sm text-slate-400">Feedback tactile pour les actions</p>
            </div>
            <button
              onClick={() => setVibrationEnabled(!vibrationEnabled)}
              className={`w-12 h-6 rounded-full transition-colors ${
                vibrationEnabled ? 'bg-green-500' : 'bg-slate-600'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                vibrationEnabled ? 'translate-x-6' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <div className="p-4 bg-slate-700 rounded-xl">
            <p className="font-medium text-white mb-2">Précision GPS</p>
            <select
              value={gpsAccuracy}
              onChange={(e) => setGpsAccuracy(e.target.value)}
              className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white"
            >
              <option value="high">Haute précision (plus de batterie)</option>
              <option value="medium">Précision normale</option>
              <option value="low">Économie batterie</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section d'aide */}
      <div className="bg-slate-800 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <HelpCircle className="w-8 h-8 text-blue-400" />
          <div>
            <h3 className="text-xl font-bold text-white">Guide d'Utilisation</h3>
            <p className="text-slate-400">Fonctionnalités détaillées de l'application</p>
          </div>
        </div>

        <div className="space-y-3">
          {helpSections.map((section) => {
            const Icon = section.icon;
            const isExpanded = expandedSection === section.id;
            
            return (
              <div key={section.id} className="border border-slate-600 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-4 bg-slate-700 hover:bg-slate-600 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-6 h-6 text-blue-400" />
                    <span className="font-bold text-white text-lg">{section.title}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  )}
                </button>
                
                {isExpanded && (
                  <div className="p-4 bg-slate-750 space-y-4">
                    {section.content.map((item, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <h5 className="font-bold text-white text-lg mb-2">{item.title}</h5>
                        <p className="text-slate-300 mb-3">{item.description}</p>
                        <ul className="space-y-2">
                          {item.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start space-x-2 text-sm">
                              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-slate-200">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Informations système */}
      <div className="bg-slate-800 rounded-2xl p-6">
        <h4 className="text-lg font-bold text-white mb-4 flex items-center">
          <Info className="w-5 h-5 mr-2 text-blue-400" />
          Informations Système
        </h4>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-slate-700 rounded-lg p-3">
            <p className="text-slate-400">Version</p>
            <p className="text-white font-bold">1.0.0</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-3">
            <p className="text-slate-400">GPS</p>
            <p className="text-green-400 font-bold">Actif</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-3">
            <p className="text-slate-400">Stockage</p>
            <p className="text-white font-bold">2.3 MB</p>
          </div>
          <div className="bg-slate-700 rounded-lg p-3">
            <p className="text-slate-400">Dernière sync</p>
            <p className="text-white font-bold">Il y a 2min</p>
          </div>
        </div>
      </div>

      {/* Actions système */}
      <div className="bg-slate-800 rounded-2xl p-6">
        <h4 className="text-lg font-bold text-white mb-4">Actions</h4>
        <div className="space-y-3">
          <button className="w-full p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors font-medium">
            Synchroniser avec le Groupe
          </button>
          <button className="w-full p-4 bg-green-600 text-white rounded-xl hover:bg-green-700 active:bg-green-800 transition-colors font-medium">
            Exporter Toutes les Données
          </button>
          <button className="w-full p-4 bg-orange-600 text-white rounded-xl hover:bg-orange-700 active:bg-orange-800 transition-colors font-medium">
            Vider le Cache
          </button>
        </div>
      </div>
    </div>
  );
}