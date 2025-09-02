import React, { useState } from 'react';
import { Plus, Euro, Users } from 'lucide-react';
import { Expense } from '../types';

export default function ExpensesSection() {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      description: 'Essence station A6',
      amount: 65.50,
      paidBy: 'Marc',
      category: 'fuel',
      date: new Date(),
      participants: ['Marc', 'Sophie', 'Pierre']
    },
    {
      id: '2',
      description: 'Repas midi Chamonix',
      amount: 87.20,
      paidBy: 'Sophie',
      category: 'food',
      date: new Date(),
      participants: ['Marc', 'Sophie', 'Pierre']
    }
  ]);

  const participants = ['Marc', 'Sophie', 'Pierre'];

  const calculateBalances = () => {
    const balances: { [key: string]: number } = {};
    participants.forEach(p => balances[p] = 0);

    expenses.forEach(expense => {
      const sharePerPerson = expense.amount / expense.participants.length;
      
      // La personne qui a payé doit recevoir
      balances[expense.paidBy] += expense.amount - sharePerPerson;
      
      // Chaque participant doit sa part
      expense.participants.forEach(participant => {
        if (participant !== expense.paidBy) {
          balances[participant] -= sharePerPerson;
        }
      });
    });

    return balances;
  };

  const balances = calculateBalances();
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6">
      {/* Résumé */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Euro className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-600">Total des Dépenses</p>
              <p className="text-2xl font-bold text-blue-900">{totalExpenses.toFixed(2)} €</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <Users className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-600">Par Personne</p>
              <p className="text-2xl font-bold text-green-900">
                {(totalExpenses / participants.length).toFixed(2)} €
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Équilibre des comptes */}
      <div className="bg-slate-50 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-slate-900 mb-4">Équilibre des Comptes</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {participants.map((participant) => {
            const balance = balances[participant];
            return (
              <div key={participant} className="bg-white rounded-lg p-4 border border-slate-200">
                <p className="font-medium text-slate-900">{participant}</p>
                <p className={`text-lg font-bold ${
                  balance > 0 ? 'text-green-600' : balance < 0 ? 'text-red-600' : 'text-slate-600'
                }`}>
                  {balance > 0 ? '+' : ''}{balance.toFixed(2)} €
                </p>
                <p className="text-xs text-slate-500">
                  {balance > 0 ? 'À recevoir' : balance < 0 ? 'À rembourser' : 'Équilibré'}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Liste des dépenses */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h4 className="text-lg font-semibold text-slate-900">Dépenses</h4>
          <button className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </button>
        </div>
        
        <div className="divide-y divide-slate-200">
          {expenses.map((expense) => (
            <div key={expense.id} className="p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{expense.description}</p>
                  <p className="text-sm text-slate-600">
                    Payé par {expense.paidBy} • {expense.participants.length} participants
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-900">{expense.amount.toFixed(2)} €</p>
                  <p className="text-sm text-slate-600 capitalize">{expense.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}