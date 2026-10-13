import React, { useState } from 'react';
import { 
  Zap, 
  MessageCircle, 
  Database, 
  Play, 
  User, 
  LogOut, 
  ShieldCheck, 
  Bell,
  ChevronDown
} from 'lucide-react';
import { InstagramIcon } from './Icons';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { getSupabaseConfig } from '../lib/supabase';

export const Navbar = ({ onOpenSimulator }) => {
  const { user, logout } = useAuth();
  const { channels, setCurrentView } = useApp();
  const supabaseConfig = getSupabaseConfig();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between z-30 sticky top-0">
      {/* Brand & Workspace */}
      <div className="flex items-center gap-4">
        <div 
          onClick={() => setCurrentView('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-bold text-lg text-white tracking-tight">VitrixFlow</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">Free Pro</span>
            </div>
            <p className="text-xs text-slate-400 -mt-0.5">{user?.workspace || 'Workspace Padrão'}</p>
          </div>
        </div>

        {/* Canais Conectados Pill */}
        <div className="hidden md:flex items-center gap-2 ml-6 pl-6 border-l border-slate-800 text-xs">
          <div 
            onClick={() => setCurrentView('channels')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
              channels.instagram.connected 
                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20' 
                : 'bg-slate-800 text-slate-500'
            }`}
          >
            <InstagramIcon className="w-3.5 h-3.5" />
            <span>{channels.instagram.connected ? channels.instagram.accountName : 'Instagram Off'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>

          <div 
            onClick={() => setCurrentView('channels')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
              channels.whatsapp.connected 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20' 
                : 'bg-slate-800 text-slate-500'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{channels.whatsapp.connected ? 'WhatsApp Cloud' : 'WhatsApp Off'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
        </div>
      </div>

      {/* Ações Rápidas & Usuário */}
      <div className="flex items-center gap-3">
        {/* Status Supabase */}
        <div 
          onClick={() => setCurrentView('settings')}
          className="cursor-pointer hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-xs text-slate-300 transition-colors"
          title="Clique para configurar o Supabase"
        >
          <Database className={`w-3.5 h-3.5 ${supabaseConfig.isConfigured ? 'text-emerald-400' : 'text-amber-400'}`} />
          <span>{supabaseConfig.isConfigured ? 'Supabase Conectado' : 'Storage Local / Conectar Supabase'}</span>
        </div>

        {/* Botão Simulador de Fluxo */}
        <button
          onClick={onOpenSimulator}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Testar Fluxo ao Vivo</span>
        </button>

        {/* Notificações / Sino */}
        <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500"></span>
        </button>

        {/* Perfil & Menu Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 pr-2.5 rounded-lg hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-700"
          >
            <img 
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"} 
              alt={user?.name || "User"} 
              className="w-7 h-7 rounded-full object-cover border border-indigo-500/50"
            />
            <span className="text-xs font-medium text-slate-200 hidden md:inline">{user?.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-700/80 shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-2 border-b border-slate-800">
                <p className="text-xs font-semibold text-white">{user?.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
              </div>

              <button
                onClick={() => { setProfileOpen(false); setCurrentView('settings'); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
              >
                <Database className="w-4 h-4 text-slate-400" />
                Configurar Banco Supabase
              </button>

              <button
                onClick={() => { setProfileOpen(false); setCurrentView('channels'); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                Gerenciar Conexões Meta
              </button>

              <div className="my-1 border-t border-slate-800"></div>

              <button
                onClick={() => { setProfileOpen(false); logout(); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sair da Conta
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
