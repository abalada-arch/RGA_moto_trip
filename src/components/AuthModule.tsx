import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, User, Shield, Fingerprint, Smartphone } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AuthModule() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [biometricSupported, setBiometricSupported] = useState(false);

  const { signIn, signUp } = useAuth();

  // Vérifier le support biométrique au montage
  React.useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    try {
      // Vérifier si WebAuthn est supporté
      if (window.PublicKeyCredential && 
          await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()) {
        setBiometricSupported(true);
      }
    } catch (error) {
      setBiometricSupported(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('Les mots de passe ne correspondent pas');
        }
        if (formData.password.length < 6) {
          throw new Error('Le mot de passe doit contenir au moins 6 caractères');
        }
        
        const { error } = await signUp(formData.email, formData.password, formData.name);
        if (error) throw error;
        
        setError('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
        setIsSignUp(false);
        setFormData({ email: '', password: '', name: '', confirmPassword: '' });
      } else {
        const { error } = await signIn(formData.email, formData.password);
        if (error) throw error;
      }
    } catch (error: any) {
      setError(error.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricAuth = async () => {
    try {
      if (!biometricSupported) {
        setError('Authentification biométrique non supportée sur cet appareil');
        return;
      }

      // Créer une credential WebAuthn
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: new Uint8Array(32),
          rp: {
            name: "RGA Moto Trip",
            id: window.location.hostname,
          },
          user: {
            id: new Uint8Array(16),
            name: formData.email || "user@example.com",
            displayName: formData.name || "Utilisateur",
          },
          pubKeyCredParams: [{alg: -7, type: "public-key"}],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required"
          },
          timeout: 60000,
          attestation: "direct"
        }
      });

      if (credential) {
        // Ici vous pourriez stocker l'identifiant biométrique
        // et l'associer au compte utilisateur dans Supabase
        setError('Authentification biométrique configurée avec succès !');
      }
    } catch (error: any) {
      setError('Erreur lors de la configuration biométrique : ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">RGA Moto Trip</h1>
          <p className="text-slate-400">Accès sécurisé requis</p>
        </div>

        {/* Formulaire d'authentification */}
        <div className="bg-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-center mb-6">
            <div className="flex bg-slate-700 rounded-xl p-1">
              <button
                onClick={() => setIsSignUp(false)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  !isSignUp 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Connexion
              </button>
              <button
                onClick={() => setIsSignUp(true)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  isSignUp 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Inscription
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Nom complet
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Votre nom complet"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className={`p-4 rounded-xl ${
                error.includes('succès') 
                  ? 'bg-green-600/20 border border-green-500/50 text-green-300'
                  : 'bg-red-600/20 border border-red-500/50 text-red-300'
              }`}>
                <p className="text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{isSignUp ? 'Création...' : 'Connexion...'}</span>
                </div>
              ) : (
                isSignUp ? 'Créer le compte' : 'Se connecter'
              )}
            </button>
          </form>

          {/* Authentification biométrique (si supportée) */}
          {biometricSupported && !isSignUp && (
            <div className="mt-6 pt-6 border-t border-slate-600">
              <button
                onClick={handleBiometricAuth}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 active:from-purple-800 active:to-blue-800 transition-all duration-200 font-bold"
              >
                <div className="flex items-center justify-center space-x-3">
                  <Fingerprint className="w-6 h-6" />
                  <span>Authentification Biométrique</span>
                </div>
              </button>
              <p className="text-xs text-slate-400 text-center mt-2">
                Utilisez votre empreinte ou reconnaissance faciale
              </p>
            </div>
          )}

          {/* Informations de sécurité */}
          <div className="mt-6 p-4 bg-slate-700/50 rounded-xl">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <h4 className="font-bold text-green-300 text-sm">Sécurité Renforcée</h4>
                <p className="text-xs text-slate-300 mt-1">
                  Vos données de voyage sont protégées par chiffrement et accessibles uniquement avec votre compte.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Informations PWA */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-2 text-slate-400 text-sm">
            <Smartphone className="w-4 h-4" />
            <span>Application PWA optimisée pour mobile</span>
          </div>
        </div>
      </div>
    </div>
  );
}