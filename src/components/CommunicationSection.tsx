import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Volume2, VolumeX, Radio, Users, MessageSquare, Phone } from 'lucide-react';
import { VoiceMessage } from '../types';

export default function CommunicationSection() {
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<VoiceMessage[]>([]);

  const [quickMessage, setQuickMessage] = useState('');
  const [isConnected, setIsConnected] = useState(true);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const quickMessages = [
    'OK reçu',
    'Pause dans 10min',
    'Station essence',
    'Ralentissez',
    'Problème mécanique',
    'Tout va bien'
  ];

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        // Ici on simule l'envoi du message vocal
        const newMessage: VoiceMessage = {
          id: Date.now().toString(),
          senderId: '1',
          senderName: 'Vous',
          message: 'Message vocal',
          timestamp: new Date(),
          isVoice: true,
          duration: 5,
          acknowledged: []
        };
        setMessages([newMessage, ...messages]);
        
        // Vibration de confirmation
        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      // Vibration de démarrage
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
    } catch (error) {
      console.error('Erreur microphone:', error);
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const sendQuickMessage = (message: string) => {
    const newMessage: VoiceMessage = {
      id: Date.now().toString(),
      senderId: '1',
      senderName: 'Vous',
      message,
      timestamp: new Date(),
      isVoice: false,
      acknowledged: []
    };
    setMessages([newMessage, ...messages]);
    
    // Vibration de confirmation
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
  };

  const acknowledgeMessage = (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, acknowledged: [...msg.acknowledged, 'Vous'] }
          : msg
      )
    );
  };

  return (
    <div className="space-y-4">
      {/* Statut connexion */}
      <div className="bg-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center">
            <Radio className="w-6 h-6 mr-2 text-blue-400" />
            Intercom Groupe
          </h3>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className={`text-sm font-medium ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
              {isConnected ? 'Connecté' : 'Déconnecté'}
            </span>
          </div>
        </div>

        {/* Contrôles audio principaux */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <button
            onMouseDown={startVoiceRecording}
            onMouseUp={stopVoiceRecording}
            onTouchStart={startVoiceRecording}
            onTouchEnd={stopVoiceRecording}
            className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
              isRecording
                ? 'border-red-500 bg-red-500/30 text-red-300'
                : 'border-blue-500/70 bg-blue-500/20 text-blue-400 active:bg-blue-500/40'
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              {isRecording ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
              <span className="font-bold text-lg">
                {isRecording ? 'PARLER...' : 'APPUYER'}
              </span>
              <span className="text-sm opacity-80">
                {isRecording ? 'Relâchez pour envoyer' : 'Maintenir pour parler'}
              </span>
            </div>
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-6 rounded-2xl border-2 transition-all duration-200 ${
              isMuted
                ? 'border-red-500 bg-red-500/20 text-red-400'
                : 'border-green-500/70 bg-green-500/20 text-green-400'
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              {isMuted ? <VolumeX className="w-10 h-10" /> : <Volume2 className="w-10 h-10" />}
              <span className="font-bold text-lg">
                {isMuted ? 'MUET' : 'AUDIO'}
              </span>
              <span className="text-sm opacity-80">
                {isMuted ? 'Réactiver le son' : 'Couper le son'}
              </span>
            </div>
          </button>
        </div>

        {/* Messages rapides */}
        <div className="grid grid-cols-2 gap-2">
          {quickMessages.map((message, index) => (
            <button
              key={index}
              onClick={() => sendQuickMessage(message)}
              className="p-3 bg-slate-700 text-white rounded-xl hover:bg-slate-600 active:bg-slate-500 transition-colors text-sm font-medium"
            >
              {message}
            </button>
          ))}
        </div>
      </div>

      {/* Historique des messages */}
      <div className="bg-slate-800 rounded-2xl p-6">
        <h4 className="text-lg font-bold text-white mb-4 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2 text-blue-400" />
          Messages Récents
        </h4>

        <div className="space-y-3 max-h-80 overflow-y-auto">
          {messages.map((message) => (
            <div key={message.id} className="bg-slate-700 rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {message.senderName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-bold text-white">{message.senderName}</p>
                    <p className="text-xs text-slate-400">
                      {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                
                {message.isVoice && (
                  <div className="flex items-center space-x-2">
                    <Volume2 className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-slate-400">{message.duration}s</span>
                  </div>
                )}
              </div>

              <p className="text-slate-200 mb-3">{message.message}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {message.acknowledged.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-400">
                        Vu par {message.acknowledged.length}
                      </span>
                    </div>
                  )}
                </div>
                
                {message.senderId !== '1' && !message.acknowledged.includes('Vous') && (
                  <button
                    onClick={() => acknowledgeMessage(message.id)}
                    className="flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    VU
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Codes radio rapides */}
      <div className="bg-slate-800 rounded-2xl p-6">
        <h4 className="text-lg font-bold text-white mb-4">Codes Radio</h4>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => sendQuickMessage('Code 1 - Ralentir')}
            className="p-4 bg-orange-600/20 border border-orange-500/50 text-orange-300 rounded-xl hover:bg-orange-600/30 transition-colors"
          >
            <p className="font-bold">CODE 1</p>
            <p className="text-sm">Ralentir</p>
          </button>
          <button
            onClick={() => sendQuickMessage('Code 2 - Danger')}
            className="p-4 bg-red-600/20 border border-red-500/50 text-red-300 rounded-xl hover:bg-red-600/30 transition-colors"
          >
            <p className="font-bold">CODE 2</p>
            <p className="text-sm">Danger</p>
          </button>
          <button
            onClick={() => sendQuickMessage('Code 3 - Pause')}
            className="p-4 bg-blue-600/20 border border-blue-500/50 text-blue-300 rounded-xl hover:bg-blue-600/30 transition-colors"
          >
            <p className="font-bold">CODE 3</p>
            <p className="text-sm">Pause</p>
          </button>
          <button
            onClick={() => sendQuickMessage('Code 4 - Tout va bien')}
            className="p-4 bg-green-600/20 border border-green-500/50 text-green-300 rounded-xl hover:bg-green-600/30 transition-colors"
          >
            <p className="font-bold">CODE 4</p>
            <p className="text-sm">OK</p>
          </button>
        </div>
      </div>
    </div>
  );
}