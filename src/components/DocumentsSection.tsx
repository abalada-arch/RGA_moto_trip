import React, { useState } from 'react';
import { Upload, FileText, Download, Shield } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'license' | 'insurance' | 'registration' | 'other';
  uploadedAt: Date;
  size: string;
}

export default function DocumentsSection() {
  const [documents, setDocuments] = useState<Document[]>([]);

  const documentTypes = {
    license: { label: 'Permis de conduire', color: 'blue' },
    insurance: { label: 'Assurance', color: 'green' },
    registration: { label: 'Carte grise', color: 'orange' },
    other: { label: 'Autre', color: 'slate' }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newDoc: Document = {
        id: Date.now().toString(),
        name: file.name,
        type: 'other',
        uploadedAt: new Date(),
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`
      };
      setDocuments([...documents, newDoc]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Information de sécurité */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="w-6 h-6 text-green-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-green-900">Coffre-fort Sécurisé</h4>
            <p className="text-sm text-green-700 mt-1">
              Vos documents sont stockés de manière sécurisée et accessibles hors ligne. 
              Seul vous pouvez accéder à vos documents personnels.
            </p>
          </div>
        </div>
      </div>

      {/* Zone d'upload */}
      <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
        <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h4 className="text-lg font-semibold text-slate-900 mb-2">Ajouter un Document</h4>
        <p className="text-slate-600 mb-4">
          Téléversez vos documents importants (PDF, images)
        </p>
        <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
          <Upload className="w-4 h-4 mr-2" />
          Choisir un fichier
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Liste des documents */}
      <div className="space-y-3">
        <h4 className="text-lg font-semibold text-slate-900">Mes Documents</h4>
        {documents.map((doc) => {
          const typeInfo = documentTypes[doc.type];
          return (
            <div key={doc.id} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-${typeInfo.color}-100 rounded-lg flex items-center justify-center`}>
                    <FileText className={`w-5 h-5 text-${typeInfo.color}-600`} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{doc.name}</p>
                    <p className="text-sm text-slate-600">
                      {typeInfo.label} • {doc.size} • {doc.uploadedAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button className="p-2 text-slate-600 hover:text-blue-600 transition-colors">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}