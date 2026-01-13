
import React, { useState, useMemo } from 'react';
import { MedicalRecord, Patient } from '../types';
import CertificateGenerator from './CertificateGenerator';

interface MedicalRecordTableProps {
  records: MedicalRecord[];
  patients: Patient[];
}

const MedicalRecordTable: React.FC<MedicalRecordTableProps> = ({ records, patients }) => {
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleOpenCertificate = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setIsCertificateOpen(true);
  };

  // Lógica de "Tabela Dinâmica" (Agrupamento por Convênio)
  const financialPivot = useMemo(() => {
    const pivot: Record<string, { count: number; total: number; paid: number }> = {};
    
    records.forEach(r => {
      if (!pivot[r.nome_convenio]) {
        pivot[r.nome_convenio] = { count: 0, total: 0, paid: 0 };
      }
      pivot[r.nome_convenio].count += 1;
      pivot[r.nome_convenio].total += r.valor_total;
      pivot[r.nome_convenio].paid += r.valor_pago;
    });
    
    return pivot;
  }, [records]);

  const filteredRecords = records.filter(r => statusFilter === 'all' || r.status_pagamento === statusFilter);

  const exportToCSV = () => {
    const headers = ['ID Agendamento', 'Paciente', 'Convênio', 'Data', 'Procedimento', 'Valor Total', 'Valor Pago', 'Status'];
    const rows = records.map(r => [
      r.id_agendamento,
      r.nome_paciente,
      r.nome_convenio,
      r.data_consulta,
      r.procedimento,
      r.valor_total,
      r.valor_pago,
      r.status_pagamento
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(val => `"${val.toString().replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `faturamento_meditrack_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Pago': return 'bg-green-100 text-green-700 border-green-200';
      case 'Parcial': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Pendente': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const checkOverdue = (dateStr: string, status: string) => {
    if (status === 'Pago') return { isOverdue: false, days: 0 };
    const recordDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    recordDate.setHours(0, 0, 0, 0);
    const diffTime = Math.abs(today.getTime() - recordDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return { isOverdue: diffDays > 7, days: diffDays };
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gestão de Registros Clínicos</h1>
          <p className="text-slate-500 text-sm">Auditoria financeira e controle de recebimentos.</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={exportToCSV}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
          >
            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <span>Excel / CSV</span>
          </button>
           <div className="px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-lg">
              <p className="text-[10px] font-bold text-indigo-400 uppercase">Receita Total</p>
              <p className="text-lg font-bold text-indigo-900">R$ {records.reduce((acc, r) => acc + r.valor_total, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
           </div>
        </div>
      </div>

      {/* Resumo Dinâmico (Estilo Pivot Table) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(financialPivot).map(([name, data]) => (
          <div key={name} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{name}</h4>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-lg font-bold text-slate-800">R$ {data.total.toLocaleString('pt-BR')}</p>
                <p className="text-[10px] text-slate-500">{data.count} atendimentos</p>
              </div>
              <div className="text-right">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${data.paid >= data.total ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {((data.paid / data.total) * 100).toFixed(0)}% Pago
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="text-sm font-bold text-slate-700">Listagem de Registros</h3>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="all">Filtrar por Pagamento</option>
            <option value="Pago">Pago</option>
            <option value="Pendente">Pendente</option>
            <option value="Parcial">Parcial</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Agendamento</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Paciente</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Procedimento</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Convênio</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Valor Total</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Pagamento</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((record) => {
                const { isOverdue, days } = checkOverdue(record.data_consulta, record.status_pagamento);
                return (
                  <tr key={record.id_agendamento} className={`hover:bg-slate-50/80 transition-colors group relative ${isOverdue ? 'bg-red-50/30' : ''}`}>
                    <td className="px-6 py-4 text-sm font-bold text-indigo-600">
                      {isOverdue && <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-r"></div>}
                      {record.id_agendamento}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-700">{record.nome_paciente}</span>
                        <span className="text-[10px] text-slate-400">ID: {record.id_paciente}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{record.procedimento}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">{record.nome_convenio}</td>
                    <td className="px-6 py-4 text-sm text-center font-bold text-slate-700">R$ {record.valor_total.toFixed(2)}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center space-y-1">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-wider ${getStatusStyle(record.status_pagamento)}`}>
                          {record.status_pagamento}
                        </span>
                        {isOverdue && (
                          <span className="text-[9px] font-bold text-red-600 uppercase">Atraso: {days}d</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleOpenCertificate(record)}
                        className="inline-flex items-center space-x-1 text-indigo-600 hover:text-indigo-800 font-bold text-xs bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-all"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        <span>Atestado</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <CertificateGenerator 
        isOpen={isCertificateOpen}
        record={selectedRecord}
        onClose={() => setIsCertificateOpen(false)}
      />
    </div>
  );
};

export default MedicalRecordTable;
