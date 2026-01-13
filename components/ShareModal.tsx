
import React, { useState } from 'react';
import { Patient, Convenio } from '../types';

interface ShareModalProps {
  patient: Patient | null;
  convenio: Convenio | undefined;
  aiSummary?: string;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ patient, convenio, aiSummary, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!patient) return null;

  const shareText = `
📄 *Ficha Resumida - MediTrack Pro*
----------------------------------
👤 *Paciente:* ${patient.name}
🆔 *ID:* ${patient.id}
💳 *Convênio:* ${convenio?.name || 'Particular'}
📑 *Plano:* ${patient.plan}
📞 *Contato:* ${patient.phone}
📅 *Última Visita:* ${patient.lastVisit || 'N/A'}

🤖 *Resumo Clínico (IA):*
${aiSummary || 'Análise da IA não solicitada para este compartilhamento.'}

----------------------------------
_Enviado via MediTrack Pro_
  `.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800 flex items-center">
            <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Compartilhar Paciente
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6">
          <p className="text-xs text-slate-500 mb-4 font-medium uppercase tracking-wider">Prévia do Resumo</p>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-h-64 overflow-y-auto">
            <pre className="text-[13px] text-slate-700 font-sans whitespace-pre-wrap leading-relaxed">
              {shareText}
            </pre>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col space-y-3">
          <button
            onClick={handleCopy}
            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center transition-all shadow-lg ${
              copied 
                ? 'bg-green-500 text-white shadow-green-100 scale-95' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 active:scale-95'
            }`}
          >
            {copied ? (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                Copiado para Área de Transferência!
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                Copiar Resumo
              </>
            )}
          </button>
          <p className="text-[10px] text-slate-400 text-center">
            Este resumo contém informações sensíveis. Certifique-se de enviá-lo por canais seguros.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
