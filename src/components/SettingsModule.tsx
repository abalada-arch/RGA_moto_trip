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
          description: 'Application dédiée aux voyages moto en groupe sur la Route des Grandes Alpes. Interface adaptative selon votre situation : préparation ou conduite.',
          features: [
            '2 modes distincts : Préparation (complet) et Conduite (simplifié)',
            'Basculement automatique selon le mouvement détecté',
            'Interface tactile optimisée pour les gants épais',
            'Mode sombre anti-éblouissement en plein soleil',
            'Feedback vibratoire pour toutes les confirmations',
            'Boutons d\'urgence accessibles en permanence'
          ]
        },
        {
          title: 'Mode Préparation ☕',
          description: 'Interface complète pour planifier et organiser votre voyage avant le départ ou pendant les pauses.',
          features: [
            '4 sections complètes : Itinéraire, Groupe, Organisation, Paramètres',
            'Planification détaillée : météo, routes, hébergements',
            'Gestion groupe : contacts, communications, frais',
            'Organisation : listes, documents, souvenirs',
            'Configuration : paramètres, aide, synchronisation'
          ]
        },
        {
          title: 'Mode Conduite 🏍️',
          description: 'Interface simplifiée et sécurisée pour l\'utilisation pendant la conduite.',
          features: [
            '3 onglets essentiels : Navigation, Groupe, Urgence',
            'Boutons géants (60px+) compatibles gants épais',
            'Actions rapides : ESSENCE, PAUSE, URGENCE',
            'Données temps réel : vitesse, distance, durée',
            'Intercom simplifié : maintenir pour parler',
            'Carte plein écran pour navigation GPS'
          ]
        }
      ]
    },
    {
      id: 'route',
      title: 'Module Itinéraire',
      icon: Route,
      content: [
        {
          title: 'Navigation GPS',
          description: 'Carte interactive avec basculement automatique en mode conduite.',
          features: [
            'Mode Préparation : planification détaillée du parcours',
            'Mode Conduite : carte plein écran avec boutons rapides',
            'Ajout POIs : clic sur carte (préparation uniquement)',
            'Géolocalisation temps réel avec précision haute',
            'Zoom automatique sur position actuelle',
            'Enregistrement automatique du trajet'
          ]
        },
        {
          title: 'Gestion Carburant Avancée',
          description: 'Suivi intelligent de votre consommation et autonomie.',
          features: [
            'Calculateur d\'autonomie : km restants en temps réel',
            'Barre visuelle du niveau de carburant',
            'Alertes automatiques : réserve, stations proches',
            'Historique consommation avec calcul L/100km',
            'Base de données stations : prix, services, horaires',
            'Statistiques voyage : consommation moyenne, coûts'
          ]
        },
        {
          title: 'Météo & Routes',
          description: 'Conditions météo et état des routes en temps réel.',
          features: [
            'Prévisions météo géolocalisées par étape',
            'Alertes météo : pluie, vent, neige, brouillard',
            'Statut en temps réel des cols',
            'Conditions circulation : ouvert/fermé/restrictions',
            'Alertes sécurité : fermetures, dangers',
            'Informations altitude et conditions spécifiques'
          ]
        },
        {
          title: 'Trafic & Péages',
          description: 'Informations trafic et calcul des coûts de péages.',
          features: [
            'Alertes trafic temps réel : bouchons, accidents, travaux',
            'Calcul péages automatique : moto vs voiture',
            'Routes alternatives suggérées',
            'Délais estimés et coûts détaillés',
            'Hôpitaux et services d\'urgence sur parcours'
          ]
        },
        {
          title: 'Partage GPX & Enregistrement',
          description: 'Gestion des fichiers GPX et enregistrement automatique.',
          features: [
            'Upload/téléchargement GPX avec le groupe',
            'POIs inclus : restaurants, hôtels, stations, pauses',
            'Démarrage automatique en mouvement',
            'Arrêt automatique à l\'arrêt prolongé',
            'Statistiques temps réel : vitesse, distance, inclinaison',
            'Export GPX automatique avec tous les POIs'
          ]
        }
      ]
    },
    {
      id: 'coordination',
      title: 'Module Groupe',
      icon: Users,
      content: [
        {
          title: 'Communication Avancée',
          description: 'Système d\'intercom virtuel et communication groupe.',
          features: [
            'Intercom virtuel : maintenir pour parler au groupe',
            'Messages vocaux avec durée et lecture',
            'Messages rapides prédéfinis pour situations courantes',
            'Codes radio standardisés (CODE 1-4)',
            'Accusés réception "VU" pour chaque message',
            'Statut connexion temps réel avec indicateur visuel'
          ]
        },
        {
          title: 'Actions Rapides',
          description: 'Communication instantanée des statuts au groupe.',
          features: [
            'ESSENCE : signaler arrêt carburant avec station',
            'PAUSE : demander arrêt avec durée estimée',
            'URGENCE : alerte immédiate avec géolocalisation',
            'Feedback vibratoire pour chaque action',
            'Retour automatique en "En route" après 30s'
          ]
        },
        {
          title: 'Suivi Groupe Temps Réel',
          description: 'Positions et statuts de tous les participants.',
          features: [
            'Carte GPS avec positions de tous les membres',
            'Statuts visuels : en route, pause, essence, urgence',
            'Validation "VU" pour confirmer réception des statuts',
            'Calcul distances entre membres du groupe',
            'Historique des dernières actions et positions',
            'Mode économie batterie pour longues étapes'
          ]
        }
      ]
    },
    {
      id: 'organization',
      title: 'Module Organisation',
      icon: FileText,
      content: [
        {
          title: 'Contacts',
          description: 'Gestion complète des participants et observateurs.',
          features: [
            '3 types : Organisateur, Membre, Observateur',
            'Observateurs : suivent sans participer physiquement',
            'Appel direct depuis l\'app avec numérotation',
            'Informations complètes : email, téléphone, rôle',
            'Statistiques : nombre par type de participant'
          ]
        },
        {
          title: 'Frais Partagés Avancés',
          description: 'Gestion intelligente des dépenses du voyage.',
          features: [
            'Calcul automatique des parts par participant',
            'Équilibrage des comptes en temps réel',
            'Catégories : essence, repas, hébergement, péages',
            'Qui doit combien à qui : calcul intelligent',
            'Export résumés pour remboursements',
            'Historique complet des dépenses'
          ]
        },
        {
          title: 'Souvenirs & Social',
          description: 'Carnet de voyage numérique géolocalisé.',
          features: [
            '3 types : Photos, Notes, Exploits/Achievements',
            'Géolocalisation automatique de chaque souvenir',
            'Tags pour organiser et retrouver facilement',
            'Timeline chronologique du voyage',
            'Partage social natif (Instagram, Facebook)',
            'Export carnet de voyage complet'
          ]
        },
        {
          title: 'Documents & Listes',
          description: 'Coffre-fort numérique et checklists intelligentes.',
          features: [
            'Coffre-fort sécurisé : permis, assurance, carte grise',
            'Accès hors ligne pour contrôles routiers',
            'Listes groupe : hébergements, météo, organisation',
            'Listes personnelles : équipement, moto, bagages',
            'Progression visuelle et synchronisation groupe'
          ]
        }
      ]
    },
    {
      id: 'safety',
      title: 'Sécurité & Modes',
      icon: AlertTriangle,
      content: [
        {
          title: 'Modes d\'Utilisation',
          description: 'Basculement intelligent entre préparation et conduite.',
          features: [
            'Détection automatique : bascule en conduite si mouvement',
            'Mode Préparation : interface complète (4 onglets)',
            'Mode Conduite : interface simplifiée (3 onglets)',
            'Boutons géants en conduite : compatibles gants',
            'Basculement manuel : bouton DÉMARRER/ARRÊT',
            'Sauvegarde contexte lors du changement de mode'
          ]
        },
        {
          title: 'Système d\'Urgence',
          description: 'Alertes et secours en cas de problème.',
          features: [
            'Bouton URGENCE : accessible dans tous les modes',
            'Alerte automatique au groupe avec position GPS',
            'Appels directs : 15 (SAMU), 17 (Police), 18 (Pompiers)',
            'Hôpitaux sur parcours avec coordonnées',
            'Partage position par SMS automatique',
            'Vibration d\'alerte forte pour attirer l\'attention'
          ]
        }
      ]
    },
    {
      id: 'tips',
      title: 'Conseils & Optimisations',
      icon: HelpCircle,
      content: [
        {
          title: 'Utilisation Optimale en Moto',
          description: 'Conseils pour une expérience sécurisée et efficace.',
          features: [
            'Fixation téléphone : position portrait, support étanche',
            'Gants tactiles : compatibilité testée avec boutons 60px+',
            'Mode "Ne pas déranger" : éviter distractions',
            'Batterie externe : autonomie longues étapes',
            'Basculement modes : automatique ou manuel selon préférence'
          ]
        },
        {
          title: 'Gestion Intelligente',
          description: 'Optimisations automatiques pour l\'autonomie et la sécurité.',
          features: [
            'Enregistrement automatique : démarre/arrête selon mouvement',
            'GPS adaptatif : précision haute en conduite, économie en pause',
            'Luminosité automatique : adaptation conditions lumineuses',
            'Mise en veille intelligente : préserve batterie',
            'Alertes proactives : carburant, batterie, météo'
          ]
        },
        {
          title: 'Connectivité & Synchronisation',
          description: 'Gestion réseau et partage de données groupe.',
          features: [
            'Fonctionnement hors ligne : cartes, documents, contacts',
            'Synchronisation automatique : dès que réseau disponible',
            'Mode données limitées : optimisation consommation',
            'Partage multi-canal : WiFi, Bluetooth, données mobiles',
            'Sauvegarde cloud : récupération en cas de problème'
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