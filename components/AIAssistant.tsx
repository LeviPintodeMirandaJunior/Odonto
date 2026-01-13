
import React, { useState, useRef, useEffect } from 'react';
import { chatWithMedicalAI } from '../services/geminiService';
import { Patient } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: any[];
}

interface AIAssistantProps {
  patients: Patient[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ patients }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Olá! Sou o assistente MediTrack AI. Como posso ajudar com a gestão da clínica ou informações médicas hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedSources, setExpandedSources] = useState<Record<number, boolean>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const clinicContext = `A clínica possui ${patients.length} pacientes. Alguns convênios comuns são ${[...new Set(patients.map(p => p.plan))].join(', ')}.`;
      const aiResponse = await chatWithMedicalAI(userMsg, clinicContext);
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: aiResponse.text || 'Desculpe, não consegui processar sua solicitação.',
        sources: aiResponse.sources
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Houve um erro técnico. Verifique sua conexão ou chave de API.' }]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSources = (idx: number) => {
    setExpandedSources(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-h-[800px] bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="p-4 bg-indigo-600 text-white flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-400 rounded-full flex items-center justify-center shadow-inner">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <div>
            <h2 className="font-bold tracking-tight">IA Clínica - Gemini Flash</h2>
            <p className="text-xs text-indigo-100 flex items-center">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
              Conectado ao Google Search
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
           <span className="text-[10px] bg-indigo-500/50 border border-indigo-400/30 px-2 py-0.5 rounded uppercase font-bold tracking-wider">v2.5 Hybrid</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[90%] md:max-w-[80%] rounded-2xl shadow-sm overflow-hidden ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
            }`}>
              <div className="px-5 py-4 text-sm md:text-base whitespace-pre-wrap leading-relaxed">
                {msg.content}
              </div>
              
              {msg.sources && msg.sources.length > 0 && (
                <div className={`border-t transition-all duration-300 ${msg.role === 'user' ? 'border-indigo-500 bg-indigo-700/30' : 'border-slate-100 bg-slate-50/80'}`}>
                  <button 
                    onClick={() => toggleSources(idx)}
                    className="w-full flex items-center justify-between px-5 py-2.5 text-[11px] font-bold uppercase tracking-wider hover:bg-black/5 transition-colors"
                  >
                    <span className="flex items-center">
                      <svg className="w-3.5 h-3.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      {msg.sources.length} {msg.sources.length === 1 ? 'Fonte Verificada' : 'Fontes Verificadas'}
                    </span>
                    <svg className={`w-4 h-4 transition-transform duration-300 ${expandedSources[idx] ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  
                  {expandedSources[idx] && (
                    <div className="px-4 pb-4 pt-1 space-y-2 animate-in slide-in-from-top-2 duration-200">
                      {msg.sources.map((source, sIdx) => (
                        <a 
                          key={sIdx} 
                          href={source.uri} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className={`flex flex-col p-2.5 rounded-xl border transition-all hover:scale-[1.01] active:scale-[0.99] ${
                            msg.role === 'user' 
                              ? 'bg-indigo-600/50 border-indigo-400/50 hover:bg-indigo-600/80' 
                              : 'bg-white border-slate-200 hover:border-indigo-300 shadow-sm'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-[10px] font-bold truncate ${msg.role === 'user' ? 'text-indigo-200' : 'text-indigo-600'}`}>
                              {new URL(source.uri).hostname.replace('www.', '')}
                            </span>
                            <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                          </div>
                          <p className={`text-xs font-semibold leading-tight ${msg.role === 'user' ? 'text-white' : 'text-slate-800'}`}>
                            {source.title || 'Referência de Pesquisa'}
                          </p>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start animate-in fade-in slide-in-from-left-2">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-5 py-4 shadow-sm flex items-center space-x-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">IA está processando...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-200 bg-white">
        <div className="flex space-x-3">
          <input 
            type="text" 
            placeholder="Pergunte sobre gestão de pacientes, planos ou dúvidas médicas..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:shadow-none text-white p-3 rounded-xl transition-all shadow-md shadow-indigo-100 active:scale-95 group"
          >
            <svg className={`w-6 h-6 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${loading ? 'animate-pulse' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
        <div className="mt-3 flex items-center justify-center space-x-4">
          <p className="text-[10px] text-slate-400 flex items-center">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Valide informações clínicas críticas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
