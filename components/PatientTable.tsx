
import React, { useState } from 'react';
import { Patient, Convenio } from '../types';
import { getPatientDetailedAnalysis, getPatientFollowup } from '../services/geminiService';
import ShareModal from './ShareModal';
import FollowUpModal from './FollowUpModal';

interface PatientTableProps {
  patients: Patient[];
  convenios: Convenio[];
}

const PatientTable: React.FC<PatientTableProps> = ({ patients, convenios }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [aiSummaries, setAiSummaries] = useState<Record<string, { text: string; loading: boolean }>>({});
  
  // Share state
  const [sharingPatient, setSharingPatient] = useState<Patient | null>(null);

  // Follow-up state
  const [followUpPatient, setFollowUpPatient] = useState<Patient | null>(null);
  const [followUpActions, setFollowUpActions] = useState<any[] | null>(null);
  const [isFollowUpLoading, setIsFollowUpLoading] = useState(false);

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.cpf.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getConvenioName = (id: string) => convenios.find(c => c.id === id)?.name || 'N/A';

  const toggleExpand = async (patient: Patient) => {
    if (expandedId === patient.id) {
      setExpandedId(null);
      return;
    }

    setExpandedId(patient.id);

    // Fetch AI summary if not already fetched
    if (!aiSummaries[patient.id]) {
      setAiSummaries(prev => ({ ...prev, [patient.id]: { text: '', loading: true } }));
      try {
        const convenio = convenios.find(c => c.id === patient.convenioId);
        const analysis = await getPatientDetailedAnalysis(patient, convenio);
        setAiSummaries(prev => ({ ...prev, [patient.id]: { text: analysis || 'Sem análise disponível.', loading: false } }));
      } catch (err) {
        setAiSummaries(prev => ({ ...prev, [patient.id]: { text: 'Erro ao gerar análise.', loading: false } }));
      }
    }
  };

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  const handleShareClick = (e: React.MouseEvent, patient: Patient) => {
    handleActionClick(e, () => setSharingPatient(patient));
  };

  const handleFollowUpClick = async (e: React.MouseEvent, patient: Patient) => {
    handleActionClick(e, async () => {
      setFollowUpPatient(patient);
      setFollowUpActions(null);
      setIsFollowUpLoading(true);
      try {
        const actions = await getPatientFollowup(patient);
        setFollowUpActions(actions);
      } catch (err) {
        console.error("Erro ao carregar follow-up:", err);
      } finally {
        setIsFollowUpLoading(false);
      }
    });
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Nome', 'CPF', 'Telefone', 'Convenio', 'Plano', 'Status', 'Ultima Visita'];
    const rows = filteredPatients.map(p => [
      p.id,
      p.name,
      p.cpf,
      p.phone,
      getConvenioName(p.convenioId),
      p.plan,
      p.status,
      p.lastVisit || 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(val => `"${val.toString().replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `pacientes_meditrack_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-800">Base de Pacientes</h2>
        
        <div className="flex flex-col md:flex-row gap-3">
          <button 
            onClick={exportToCSV}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Exportar CSV</span>
          </button>

          <div className="relative min-w-[160px]">
            <select 
              className="appearance-none w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-600 font-medium cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos os Status</option>
              <option value="Ativo">Ativos</option>
              <option value="Pendente">Pendentes</option>
              <option value="Inativo">Inativos</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </span>
            <input 
              type="text" 
              placeholder="Buscar por nome ou CPF..."
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Paciente</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">CPF / Tel</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Convênio / Plano</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Última Visita</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredPatients.map((patient) => (
              <React.Fragment key={patient.id}>
                <tr 
                  className={`hover:bg-slate-50 transition-colors cursor-pointer ${expandedId === patient.id ? 'bg-slate-50' : ''}`}
                  onClick={() => toggleExpand(patient)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold mr-3">
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{patient.name}</p>
                        <p className="text-xs text-slate-400">ID: {patient.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600 font-medium">{patient.cpf}</p>
                    <p className="text-xs text-slate-400">{patient.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600 font-medium">{getConvenioName(patient.convenioId)}</p>
                    <p className="text-xs text-indigo-500 font-medium">{patient.plan}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      patient.status === 'Ativo' ? 'bg-green-100 text-green-700' : 
                      patient.status === 'Pendente' ? 'bg-amber-100 text-amber-700' : 
                      'bg-slate-100 text-slate-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        patient.status === 'Ativo' ? 'bg-green-500' : 
                        patient.status === 'Pendente' ? 'bg-amber-500' : 
                        'bg-slate-400'
                      }`}></span>
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {patient.lastVisit || 'Sem registro'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(patient);
                        }}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                          expandedId === patient.id 
                            ? 'bg-indigo-600 text-white border-indigo-600' 
                            : 'bg-white text-indigo-600 border-indigo-100 hover:bg-indigo-50'
                        }`}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{expandedId === patient.id ? 'Ocultar' : 'Ver Histórico'}</span>
                      </button>
                      <button 
                        onClick={(e) => handleFollowUpClick(e, patient)}
                        className="text-slate-400 hover:text-indigo-600 transition-all p-1.5 rounded-md hover:bg-indigo-50"
                        title="Follow-up IA"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                      </button>
                      <button 
                        onClick={(e) => handleShareClick(e, patient)}
                        className="text-slate-400 hover:text-indigo-600 transition-all p-1.5 rounded-md hover:bg-indigo-50"
                        title="Compartilhar resumo"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedId === patient.id && (
                  <tr>
                    <td colSpan={6} className="px-6 py-0 bg-slate-50/50">
                      <div className="py-6 border-t border-slate-100 animate-in fade-in slide-in-from-top-2">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          <div className="space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center">
                              <svg className="w-3.5 h-3.5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              Linha do Tempo de Visitas
                            </h3>
                            {patient.visitHistory && patient.visitHistory.length > 0 ? (
                              <div className="relative pl-3 space-y-6 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-px before:bg-slate-200">
                                {patient.visitHistory.map((h, i) => (
                                  <div key={i} className="relative">
                                    <div className="absolute -left-[15px] top-1.5 w-2 h-2 rounded-full border-2 border-white bg-indigo-500"></div>
                                    <div className="flex flex-col">
                                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{h.date}</p>
                                      <p className="text-sm font-bold text-slate-700 leading-tight">{h.procedure}</p>
                                      <p className="text-xs text-slate-500 mt-0.5">{h.notes}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-slate-400 italic">Nenhum registro encontrado.</p>
                            )}
                          </div>

                          <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Observações Médicas</h3>
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                              <p className="text-sm text-slate-600 leading-relaxed italic">
                                "{patient.observations || 'Nenhuma observação registrada para este paciente.'}"
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center">
                              <svg className="w-3.5 h-3.5 mr-2 text-indigo-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
                              Insights MediTrack AI
                            </h3>
                            <div className="bg-indigo-900 text-indigo-50 p-4 rounded-xl shadow-md border border-indigo-700 h-full">
                              {aiSummaries[patient.id]?.loading ? (
                                <div className="space-y-2 py-2">
                                  <div className="h-3 bg-indigo-800 rounded w-full animate-pulse"></div>
                                  <div className="h-3 bg-indigo-800 rounded w-4/5 animate-pulse"></div>
                                  <div className="h-3 bg-indigo-800 rounded w-2/3 animate-pulse"></div>
                                </div>
                              ) : (
                                <p className="text-xs md:text-sm leading-relaxed">
                                  {aiSummaries[patient.id]?.text}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <ShareModal 
        patient={sharingPatient}
        convenio={convenios.find(c => c.id === sharingPatient?.convenioId)}
        aiSummary={sharingPatient ? aiSummaries[sharingPatient.id]?.text : undefined}
        onClose={() => setSharingPatient(null)}
      />

      <FollowUpModal
        patient={followUpPatient}
        actions={followUpActions}
        loading={isFollowUpLoading}
        onClose={() => {
          setFollowUpPatient(null);
          setFollowUpActions(null);
        }}
      />
    </div>
  );
};

export default PatientTable;
