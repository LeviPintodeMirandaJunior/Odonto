
import React from 'react';
import { ViewType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewType;
  setView: (view: ViewType) => void;
  onCameraClick: () => void;
  captureCount?: number;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setView, onCameraClick, captureCount = 0 }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white flex flex-col hidden md:flex">
        <div className="p-6 flex items-center space-x-3 border-b border-indigo-800">
          <div className="bg-white p-2 rounded-lg">
            <svg className="w-6 h-6 text-indigo-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">MediTrack Pro</span>
        </div>
        
        <nav className="flex-1 mt-6 px-4 space-y-2">
          <button 
            onClick={() => setView(ViewType.DASHBOARD)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeView === ViewType.DASHBOARD ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-800'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
            <span className="font-medium">Dashboard</span>
          </button>
          
          <button 
            onClick={() => setView(ViewType.PATIENTS)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeView === ViewType.PATIENTS ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-800'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            <span className="font-medium">Pacientes</span>
          </button>

          <button 
            onClick={() => setView(ViewType.RECORDS)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeView === ViewType.RECORDS ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-800'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <span className="font-medium">Faturamento & Registros</span>
          </button>
          
          <button 
            onClick={() => setView(ViewType.AI_ASSISTANT)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeView === ViewType.AI_ASSISTANT ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-800'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
            <span className="font-medium">Assistente AI</span>
          </button>
        </nav>
        
        <div className="p-4 mt-auto border-t border-indigo-800">
          <div className="flex items-center space-x-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-indigo-400 flex items-center justify-center text-indigo-900 font-bold">DR</div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">Dr. Ricardo G.</p>
              <p className="text-xs text-indigo-300 truncate">Cardiologista</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        {/* Universal Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 md:px-8 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center">
            <div className="md:hidden mr-4">
               <span className="text-indigo-900 font-bold">MTP</span>
            </div>
            <h2 className="text-sm font-semibold text-slate-500 hidden md:block">MediTrack Pro • Versão 2.0</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Botão de Câmera Refinado */}
            <button 
              onClick={onCameraClick}
              className="relative group flex items-center space-x-2 px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white rounded-xl transition-all duration-300 border border-indigo-100"
              title="Abrir Câmera de Captura"
            >
              <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm font-bold hidden sm:block">Nova Captura</span>
              {captureCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {captureCount}
                </span>
              )}
            </button>
            
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
            
            <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Mobile Sub-Nav */}
        <div className="md:hidden bg-indigo-900 text-white p-3 flex justify-around items-center sticky top-[60px] z-40 border-t border-indigo-800">
          <button onClick={() => setView(ViewType.DASHBOARD)} className={`text-xs font-medium px-2 py-1 rounded-full ${activeView === ViewType.DASHBOARD ? 'bg-indigo-700' : ''}`}>Dash</button>
          <button onClick={() => setView(ViewType.PATIENTS)} className={`text-xs font-medium px-2 py-1 rounded-full ${activeView === ViewType.PATIENTS ? 'bg-indigo-700' : ''}`}>Pacientes</button>
          <button onClick={() => setView(ViewType.RECORDS)} className={`text-xs font-medium px-2 py-1 rounded-full ${activeView === ViewType.RECORDS ? 'bg-indigo-700' : ''}`}>Financeiro</button>
          <button onClick={() => setView(ViewType.AI_ASSISTANT)} className={`text-xs font-medium px-2 py-1 rounded-full ${activeView === ViewType.AI_ASSISTANT ? 'bg-indigo-700' : ''}`}>AI</button>
        </div>
        
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
