
import React, { useEffect, useState, useMemo } from 'react';
import { Patient, Convenio, MedicalRecord } from '../types';
import { ATTENDANCE_TREND } from '../constants';
import { getAIPatientSummary } from '../services/geminiService';
import CalendarView from './CalendarView';
import { 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  XAxis, 
  YAxis,
  AreaChart,
  Area
} from 'recharts';

interface DashboardProps {
  patients: Patient[];
  convenios: Convenio[];
  records: MedicalRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ patients, convenios, records }) => {
  const [summary, setSummary] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(true);

  // Otimização: Cálculos memorizados para evitar reprocessamento em renders
  const stats = useMemo(() => {
    const particularId = 'C-00';
    const particularCount = patients.filter(p => p.convenioId === particularId).length;
    const profitability = patients.length > 0 ? (particularCount / patients.length) * 100 : 0;
    
    const critical = convenios.filter(c => c.prazoDias > 30);
    
    const sorted = [...convenios].sort((a, b) => {
      const scoreA = a.repassePercent - (a.prazoDias / 2);
      const scoreB = b.repassePercent - (b.prazoDias / 2);
      return scoreB - scoreA;
    });

    const best = sorted.find(c => c.id !== particularId) || sorted[0];

    const maxWait = convenios.length > 0 ? Math.max(...convenios.map(c => c.prazoDias)) : 0;

    return {
      profitability,
      particularCount,
      critical,
      sorted,
      best,
      maxWait
    };
  }, [patients, convenios]);

  useEffect(() => {
    let isMounted = true;
    const fetchSummary = async () => {
      setIsAiLoading(true);
      try {
        if (patients.length > 0) {
          const text = await getAIPatientSummary(patients, convenios);
          if (isMounted) setSummary(text || 'Análise indisponível no momento.');
        }
      } catch (error) {
        if (isMounted) setSummary('Erro ao processar insights financeiros.');
      } finally {
        if (isMounted) setIsAiLoading(false);
      }
    };
    fetchSummary();
    return () => { isMounted = false; };
  }, [patients, convenios]);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Painel de Gestão Clínica</h1>
          <p className="text-slate-500 text-sm">Visão estratégica de rentabilidade e fluxo operacional.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 flex items-center space-x-2">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Monitoramento Ativo</span>
        </div>
      </header>

      {/* Stats Cards memorizados */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Lucratividade Direta</span>
            <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-800">{stats.profitability.toFixed(0)}%</p>
          <p className="text-xs text-indigo-600 font-bold mt-2 uppercase tracking-tighter">{stats.particularCount} Pacientes Particulares</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 ring-2 ring-emerald-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3">
             <span className="bg-emerald-100 text-emerald-700 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Melhor Repasse</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Top Convênio</span>
          </div>
          <p className="text-xl font-bold text-slate-800 truncate pr-16">{stats.best?.name || '---'}</p>
          <div className="mt-3 flex items-center justify-between text-xs">
             <span className="text-slate-500">Eficiência Financeira</span>
             <span className="text-emerald-600 font-bold">{stats.best?.repassePercent}% retorno</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Prazo Máximo</span>
            <div className={`p-2 rounded-xl ${stats.critical.length > 0 ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-800">{stats.maxWait} dias</p>
          <p className="text-xs text-slate-500 mt-2 font-medium">Ciclo de faturamento atual</p>
        </div>
      </div>

      {/* Alertas dinâmicos */}
      {stats.critical.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.critical.map(c => (
            <div key={c.id} className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start space-x-3 shadow-sm animate-in zoom-in-95 duration-300">
              <div className="bg-amber-100 p-2 rounded-xl text-amber-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <div>
                <h4 className="text-sm font-bold text-amber-900">{c.name} - Prazo Crítico</h4>
                <p className="text-[11px] text-amber-700 mt-1 leading-relaxed">Reembolso em {c.prazoDias} dias. Risco ao capital de giro detectado.</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tendência Semestral - MOVIDO PARA ABAIXO DOS CARDS */}
      <div className="bg-white p-7 rounded-3xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Tendência de Atendimentos</h2>
            <p className="text-xs text-slate-400 mt-1">Evolução do volume de consultas no semestre vigente.</p>
          </div>
          <div className="flex items-center space-x-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-3 py-1 rounded-full">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            <span>+12% vs anterior</span>
          </div>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ATTENDANCE_TREND}>
              <defs>
                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 500}} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 500}} 
                dx={-10}
              />
              <Tooltip 
                cursor={{stroke: '#e2e8f0', strokeWidth: 1}}
                contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px'}} 
              />
              <Area 
                type="monotone" 
                dataKey="visits" 
                stroke="#6366f1" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorVisits)" 
                activeDot={{ r: 6, fill: '#6366f1', strokeWidth: 3, stroke: '#fff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Calendário */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Agenda Operacional</h2>
          <div className="h-px flex-1 bg-slate-200"></div>
        </div>
        <CalendarView records={records} patients={patients} convenios={convenios} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-800">Ranking de Performance</h2>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest bg-slate-50 px-2 py-1 rounded">Score Financeiro</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] uppercase text-slate-400 font-bold border-b border-slate-100">
                  <th className="pb-4">Convênio</th>
                  <th className="pb-4 text-center">Repasse</th>
                  <th className="pb-4 text-center">Prazo</th>
                  <th className="pb-4 text-right">Eficiência</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {stats.sorted.map((c) => {
                  const score = c.repassePercent - (c.prazoDias / 2);
                  return (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="py-4">
                        <div className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{c.name}</div>
                        <div className="text-[10px] text-slate-400">{c.coverage}</div>
                      </td>
                      <td className="py-4 text-center text-sm font-semibold text-slate-600">{c.repassePercent}%</td>
                      <td className="py-4 text-center text-sm text-slate-500">{c.prazoDias}d</td>
                      <td className="py-4 text-right">
                        <span className={`inline-block px-2 py-1 rounded-lg text-xs font-bold ${score > 50 ? 'bg-green-50 text-green-700' : 'bg-slate-50 text-slate-500'}`}>
                          {score.toFixed(0)} pts
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card de IA Otimizado */}
        <div className="bg-indigo-900 text-white p-7 rounded-3xl shadow-xl relative overflow-hidden flex flex-col min-h-[320px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-indigo-600/50 p-2 rounded-xl border border-indigo-400/30">
                <svg className="w-5 h-5 text-indigo-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h2 className="text-lg font-bold">Insights MediTrack AI</h2>
            </div>
            
            <div className="flex-1">
              {isAiLoading ? (
                <div className="space-y-4">
                  <div className="h-3 bg-indigo-800 rounded-full w-full animate-pulse"></div>
                  <div className="h-3 bg-indigo-800 rounded-full w-4/5 animate-pulse"></div>
                  <div className="h-3 bg-indigo-800 rounded-full w-2/3 animate-pulse"></div>
                  <div className="pt-4 flex items-center space-x-2 text-indigo-400">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                </div>
              ) : (
                <div className="text-indigo-50 leading-relaxed text-sm whitespace-pre-wrap animate-in fade-in duration-500 italic">
                  "{summary}"
                </div>
              )}
            </div>
            
            {!isAiLoading && (
              <div className="mt-6 pt-6 border-t border-indigo-800">
                <p className="text-[9px] uppercase font-bold text-indigo-400 mb-2 tracking-widest">Recomendação Automática</p>
                <div className="bg-indigo-800/40 p-3 rounded-2xl border border-indigo-700/50 flex items-start space-x-2">
                  <svg className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                  <p className="text-[11px] text-indigo-100 font-medium">
                    {stats.critical.length > 0 
                      ? `Revisar contratos com ${stats.critical[0].name} para reduzir o gap de ${stats.critical[0].prazoDias} dias.` 
                      : "Excelente! Estrutura de prazos está otimizada para o próximo ciclo."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
