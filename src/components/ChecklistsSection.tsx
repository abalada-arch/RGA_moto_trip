import React, { useState } from 'react';
import { Plus, Check, X } from 'lucide-react';
import { ChecklistItem } from '../types';

export default function ChecklistsSection() {
  const [groupItems, setGroupItems] = useState<ChecklistItem[]>([
    { id: '1', text: 'Réserver les hébergements', completed: true, category: 'group' },
    { id: '2', text: 'Vérifier la météo', completed: false, category: 'group' },
    { id: '3', text: 'Planifier les arrêts essence', completed: false, category: 'group' },
  ]);

  const [personalItems, setPersonalItems] = useState<ChecklistItem[]>([
    { id: '4', text: 'Vérifier la moto', completed: true, category: 'personal' },
    { id: '5', text: 'Préparer les vêtements', completed: false, category: 'personal' },
    { id: '6', text: 'Charger les appareils', completed: false, category: 'personal' },
  ]);

  const [newItemText, setNewItemText] = useState('');
  const [showAddForm, setShowAddForm] = useState<'group' | 'personal' | null>(null);

  const toggleItem = (id: string, category: 'group' | 'personal') => {
    if (category === 'group') {
      setGroupItems(items => 
        items.map(item => 
          item.id === id ? { ...item, completed: !item.completed } : item
        )
      );
    } else {
      setPersonalItems(items => 
        items.map(item => 
          item.id === id ? { ...item, completed: !item.completed } : item
        )
      );
    }
  };

  const addItem = (category: 'group' | 'personal') => {
    if (!newItemText.trim()) return;

    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text: newItemText,
      completed: false,
      category
    };

    if (category === 'group') {
      setGroupItems([...groupItems, newItem]);
    } else {
      setPersonalItems([...personalItems, newItem]);
    }

    setNewItemText('');
    setShowAddForm(null);
  };

  const ChecklistComponent = ({ 
    title, 
    items, 
    category, 
    description 
  }: { 
    title: string; 
    items: ChecklistItem[]; 
    category: 'group' | 'personal';
    description: string;
  }) => {
    const completedCount = items.filter(item => item.completed).length;
    
    return (
      <div className="bg-slate-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-semibold text-slate-900">{title}</h4>
            <p className="text-sm text-slate-600">{description}</p>
            <div className="mt-2">
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${items.length > 0 ? (completedCount / items.length) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-sm text-slate-600">
                  {completedCount}/{items.length}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(category)}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-3 p-2 hover:bg-white rounded-lg transition-colors">
              <button
                onClick={() => toggleItem(item.id, category)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                  item.completed
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-slate-300 hover:border-green-400'
                }`}
              >
                {item.completed && <Check className="w-3 h-3" />}
              </button>
              <span className={`flex-1 ${item.completed ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                {item.text}
              </span>
            </div>
          ))}

          {showAddForm === category && (
            <div className="flex items-center space-x-2 p-2 bg-white rounded-lg border border-slate-200">
              <input
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="Nouvel élément..."
                className="flex-1 px-3 py-2 border-0 focus:ring-0 text-sm"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addItem(category);
                  if (e.key === 'Escape') setShowAddForm(null);
                }}
              />
              <button
                onClick={() => addItem(category)}
                className="p-1 text-green-600 hover:bg-green-100 rounded"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowAddForm(null)}
                className="p-1 text-slate-400 hover:bg-slate-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <ChecklistComponent
        title="Équipement du Groupe"
        items={groupItems}
        category="group"
        description="Tâches partagées pour l'organisation du voyage"
      />
      
      <ChecklistComponent
        title="Équipement Personnel"
        items={personalItems}
        category="personal"
        description="Votre checklist individuelle"
      />
    </div>
  );
}