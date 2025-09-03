import React from 'react';
import { Map, Route, Users, Settings, HelpCircle } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  const tabs = [
    { id: 'itinerary', label: 'Route', icon: Route },
    { id: 'coordination', label: 'Groupe', icon: Map },
    { id: 'organization', label: 'Infos', icon: Users },
    { id: 'settings', label: 'Config', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header compact pour mobile */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Route className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">RGA Trip</h1>
              </div>
            </div>
            <button 
              onClick={() => onTabChange('settings')}
              className={`p-2 transition-colors ${
                activeTab === 'settings' ? 'text-blue-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Navigation en bas pour mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 z-50">
        <div className="grid grid-cols-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center py-4 px-2 transition-all duration-200 ${
                  isActive
                    ? 'text-blue-400 bg-slate-700'
                    : 'text-slate-400 hover:text-white active:bg-slate-700'
                }`}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content avec padding pour navigation bottom */}
      <main className="pb-20 px-4 py-4">
        {children}
      </main>
    </div>
  );
}