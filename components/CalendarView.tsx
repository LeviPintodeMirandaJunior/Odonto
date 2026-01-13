
import React, { useState, useMemo } from 'react';
import { MedicalRecord, Patient, Convenio } from '../types';

interface CalendarViewProps {
  records: MedicalRecord[];
  patients: Patient[];
  convenios: Convenio[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ records, patients, convenios }) => {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 4, 1)); // Iniciando em Maio/2024 para alinhar com os dados
  const [filterPatient, setFilterPatient] = useState<string>('all');
  const [filterConvenio, setFilterConvenio] = useState<string>('all');

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchesPatient = filterPatient === 'all' || r.id_paciente === filterPatient;
      const matchesConvenio = filterConvenio === 'all' || r.id_convenio === filterConvenio;
      return matchesPatient && matchesConvenio;
    });
  }, [records, filterPatient, filterConvenio]);

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);
    
    const result = [];
    // Fill empty slots
    for (let i = 0; i < startDay; i++) {
      result.push(null);
    }
    // Fill days
    for (let d = 1; d <= days; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayRecords = filteredRecords.filter(r => r.data_consulta === dateStr);
      result.push({ day: d, records: dayRecords });
    }
    return result;
  }, [currentDate, filteredRecords]);

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col lg:flex-row h-full min-h-[500px]">
      {/* Calendar Section */}
      <div className="flex-1 p-6 border-b lg:border-b-0 lg:border-r border-slate-100">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-bold text-slate-800">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button onClick={() => changeMonth(-1)} className="p-1.5 hover:bg-white rounded-md transition-all text-slate-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button onClick={() => changeMonth(1)} className="p-1.5 hover:bg-white rounded-md transition-all text-slate-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <select 
              value={filterPatient} 
              onChange={(e) => setFilterPatient(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none flex-1 sm:flex-none min-w-[120px]"
            >
              <option value="all">Todos Pacientes</option>
              {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <select 
              value={filterConvenio} 
              onChange={(e) => setFilterConvenio(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none flex-1 sm:flex-none min-w-[120px]"
            >
              <option value="all">Todos Convênios</option>
              {convenios.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-slate-100 border border-slate-100 rounded-xl overflow-hidden">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
            <div key={d} className="bg-slate-50 py-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">{d}</div>
          ))}
          {calendarDays.map((dayData, idx) => (
            <div 
              key={idx} 
              className={`min-h-[70px] bg-white p-2 relative group hover:bg-indigo-50/30 transition-colors ${!dayData ? 'bg-slate-50/50' : ''}`}
            >
              {dayData && (
                <>
                  <span className={`text-xs font-semibold ${dayData.records.length > 0 ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {dayData.day}
                  </span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {dayData.records.slice(0, 3).map((r, i) => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-500" title={r.procedimento} />
                    ))}
                    {dayData.records.length > 3 && (
                      <span className="text-[8px] text-slate-400 font-bold">+{dayData.records.length - 3}</span>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Agenda Detail Sidebar */}
      <div className="w-full lg:w-80 bg-slate-50/50 p-6 overflow-y-auto">
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-2 h-6 bg-indigo-500 rounded-full"></div>
          <h4 className="font-bold text-slate-800">Agenda do Mês</h4>
        </div>

        <div className="space-y-4">
          {filteredRecords.length > 0 ? (
            filteredRecords
              .filter(r => {
                const rDate = new Date(r.data_consulta);
                return rDate.getMonth() === currentDate.getMonth() && rDate.getFullYear() === currentDate.getFullYear();
              })
              .sort((a, b) => a.data_consulta.localeCompare(b.data_consulta))
              .map((r, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded">
                      {new Date(r.data_consulta).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">#{r.id_agendamento}</span>
                  </div>
                  <h5 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{r.nome_paciente}</h5>
                  <p className="text-xs text-slate-500 mt-1">{r.procedimento}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-tighter">{r.nome_convenio}</span>
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-slate-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <p className="text-sm text-slate-400 italic">Nenhum atendimento filtrado para este mês.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
