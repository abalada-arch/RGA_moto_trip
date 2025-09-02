import React, { useState } from 'react';
import { CheckSquare, FileText, Calculator, Users } from 'lucide-react';
import ChecklistsSection from './ChecklistsSection';
import ExpensesSection from './ExpensesSection';
import DocumentsSection from './DocumentsSection';
import ParticipantsSection from './ParticipantsSection';

type OrganizationSection = 'checklists' | 'documents' | 'expenses' | 'participants';

export default function OrganizationModule() {
  const [activeSection, setActiveSection] = useState<OrganizationSection>('checklists');

  const sections = [
    { id: 'checklists', label: 'Checklists', icon: CheckSquare },
    { id: 'participants', label: 'Participants', icon: Users },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'expenses', label: 'Dépenses', icon: Calculator },
  ] as const;

  const renderSection = () => {
    switch (activeSection) {
      case 'checklists':
        return <ChecklistsSection />;
      case 'participants':
        return <ParticipantsSection />;
      case 'documents':
        return <DocumentsSection />;
      case 'expenses':
        return <ExpensesSection />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Organisation</h2>
        <p className="text-slate-600">
          Gérez les préparatifs, documents et dépenses du voyage
        </p>
      </div>

      {/* Navigation des sections */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="flex border-b border-slate-200">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{section.label}</span>
              </button>
            );
          })}
        </div>
        
        <div className="p-6">
          {renderSection()}
        </div>
      </div>
    </div>
  );
}