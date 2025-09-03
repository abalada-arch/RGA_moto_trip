import React, { useState } from 'react';
import { CheckSquare, FileText, Calculator, Users, Phone } from 'lucide-react';
import ChecklistsSection from './ChecklistsSection';
import ExpensesSection from './ExpensesSection';
import DocumentsSection from './DocumentsSection';
import ParticipantsSection from './ParticipantsSection';

type OrganizationSection = 'participants' | 'checklists' | 'documents' | 'expenses';

export default function OrganizationModule() {
  const [activeSection, setActiveSection] = useState<OrganizationSection>('participants');

  const sections = [
    { id: 'participants', label: 'Contacts', icon: Users },
    { id: 'checklists', label: 'Listes', icon: CheckSquare },
    { id: 'documents', label: 'Docs', icon: FileText },
    { id: 'expenses', label: 'Frais', icon: Calculator },
  ] as const;

  const renderSection = () => {
    switch (activeSection) {
      case 'participants':
        return <ParticipantsSection />;
      case 'checklists':
        return <ChecklistsSection />;
      case 'documents':
        return <DocumentsSection />;
      case 'expenses':
        return <ExpensesSection />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation des sections - Adaptée mobile */}
      <div className="bg-slate-800 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-4">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex flex-col items-center justify-center py-4 px-2 transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700 active:bg-slate-600'
                }`}
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{section.label}</span>
              </button>
            );
          })}
        </div>
      </div>
        
      {/* Contenu de la section */}
      <div className="bg-slate-800 rounded-2xl p-6">
        {renderSection()}
      </div>
    </div>
  );
}