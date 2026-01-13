
import React from 'react';
import { Patient } from '../types';

interface FollowUpAction {
  action: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  description: string;
}

interface FollowUpModalProps {
  patient: Patient | null;
  actions: FollowUpAction[] | null;
  loading: boolean;
  onClose: () => void;
}

const FollowUpModal: React.FC<FollowUpModalProps> = ({ patient, actions, loading, onClose }) => {
  if (!patient) return null;

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'bg-red-100 text-red-700 border-red-200';
      case 'Média': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Baixa': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Plano de Follow-up IA</h3>
              <p className="text-xs text-slate-500">Paciente: <span className="font-semibold">{patient.name}</span></p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 bg-slate-50/50">
          {loading ? (
            <div className="space-y-4 py-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-1/4 mb-3"></div>
                  <div className="h-3 bg-slate-100 rounded w-full mb-2"></div>
                  <div className="h-3 bg-slate-100 rounded w-2/3"></div>
                </div>
              ))}
              <p className="text-center text-xs text-slate-400 font-medium">Gemini está analisando o histórico do paciente...</p>
            </div>
          ) : actions && actions.length > 0 ? (
            actions.map((item, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-slate-800 text-sm">{item.action}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getPriorityStyles(item.priority)}`}>
                    {item.priority}
                  </span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-500">Nenhuma sugestão disponível no momento.</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 bg-white">
          <button
            onClick={onClose}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-100"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default FollowUpModal;
