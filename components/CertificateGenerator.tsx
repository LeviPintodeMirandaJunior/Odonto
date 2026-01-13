
import React, { useState } from 'react';
import { MedicalRecord } from '../types';
import CameraModal from './CameraModal';

interface CertificateGeneratorProps {
  isOpen: boolean;
  record: MedicalRecord | null;
  onClose: () => void;
}

const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({ isOpen, record, onClose }) => {
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [isLocalCameraOpen, setIsLocalCameraOpen] = useState(false);

  if (!isOpen || !record) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCapture = (image: string) => {
    setAttachedImage(image);
  };

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 no-print-overlay">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col no-print-modal">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 no-print">
          <h3 className="font-bold text-slate-800">Atestado de Comparecimento Digital</h3>
          <div className="flex space-x-2">
            <button 
              onClick={() => setIsLocalCameraOpen(true)}
              className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all flex items-center shadow-sm"
            >
              <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {attachedImage ? 'Trocar Foto' : 'Anexar Foto'}
            </button>
            <button onClick={handlePrint} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all flex items-center shadow-md shadow-indigo-100">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
              Imprimir
            </button>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <div className="p-12 print:p-8 bg-white min-h-[600px] flex flex-col items-center text-center overflow-y-auto">
          <div className="w-20 h-20 bg-indigo-900 rounded-2xl mb-8 flex items-center justify-center text-white print:border print:border-indigo-900">
             <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
          
          <h1 className="text-3xl font-serif font-bold text-slate-900 mb-12">ATESTADO MÉDICO</h1>
          
          <div className="max-w-prose text-lg text-slate-800 leading-relaxed font-serif text-justify mb-8">
            <p className="mb-8">
              Atesto para os devidos fins que o(a) Sr(a). <strong>{record.nome_paciente}</strong>, 
              portador(a) do registro <strong>#{record.id_paciente}</strong>, esteve em atendimento nesta unidade de saúde 
              no dia <strong>{new Date(record.data_consulta).toLocaleDateString('pt-BR')}</strong> para a realização do 
              procedimento de <strong>{record.procedimento}</strong>.
            </p>
            
            <p className="mb-4">
              O paciente compareceu às dependências da clínica MediTrack Pro e encontra-se apto para o retorno 
              às suas atividades após a conclusão da consulta.
            </p>
          </div>

          {/* Área de Imagem Anexada */}
          {attachedImage && (
            <div className="w-full mt-4 p-6 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 flex flex-col items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Comprovante de Identidade / Procedimento</span>
              <div className="relative group">
                <img 
                  src={attachedImage} 
                  alt="Anexo" 
                  className="max-h-64 rounded-2xl shadow-lg border border-white"
                />
                <button 
                  onClick={() => setAttachedImage(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md no-print opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            </div>
          )}
          
          <div className="mt-auto pt-16 w-full flex flex-col items-center">
             <div className="w-64 h-px bg-slate-400 mb-2"></div>
             <p className="font-bold text-slate-900 uppercase">Dr. Ricardo G.</p>
             <p className="text-slate-500 text-sm italic">MediTrack Pro - CRM 123456</p>
             <p className="text-[10px] text-slate-300 mt-12">Documento gerado eletronicamente em {new Date().toLocaleString('pt-BR')}</p>
          </div>
        </div>
      </div>

      <CameraModal 
        isOpen={isLocalCameraOpen}
        onClose={() => setIsLocalCameraOpen(false)}
        onCapture={handleCapture}
      />

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .no-print-modal, .no-print-modal * { visibility: visible; }
          .no-print-modal { position: fixed; left: 0; top: 0; width: 100%; height: 100%; border: none; box-shadow: none; margin: 0; padding: 0; }
          .no-print { display: none !important; }
          .no-print-overlay { background: white !important; backdrop-filter: none !important; }
        }
      `}</style>
    </div>
  );
};

export default CertificateGenerator;
