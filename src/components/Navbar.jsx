import React, { useState } from 'react';
import { 
  MessageCircle, 
  Database, 
  Play, 
  User, 
  LogOut, 
  ShieldCheck, 
  Bell,
  ChevronDown,
  Sun,
  Moon,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { InstagramIcon } from './Icons';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { getSupabaseConfig } from '../lib/supabase';

export const Navbar = ({ onOpenSimulator }) => {
  const { user, logout } = useAuth();
  const { channels, setCurrentView, theme, toggleTheme } = useApp();
  const supabaseConfig = getSupabaseConfig();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 flex items-center justify-between z-30 sticky top-0 transition-colors">
      {/* Brand & Nano Banana Mascot */}
      <div className="flex items-center gap-4">
        <div 
          onClick={() => setCurrentView('dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          {/* Logo Nano Banana */}
          <div className="relative">
            <img 
              src="/logo.jpg" 
              alt="Nano Banana WebFlow" 
              className="w-10 h-10 rounded-xl object-cover shadow-sm border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform" 
            />
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" title="Sistema Online"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">WebFlow</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                ManyChat Free
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 -mt-0.5 font-medium">Nano Banana Automation</p>
          </div>
        </div>

        {/* Canais Conectados no Topo (Estilo ManyChat) */}
        <div className="hidden lg:flex items-center gap-2 ml-6 pl-6 border-l border-slate-200 dark:border-slate-800 text-xs">
          <div 
            onClick={() => setCurrentView('channels')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full cursor-pointer transition-colors ${
              channels.instagram.connected 
                ? 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800' 
                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            <InstagramIcon className="w-3.5 h-3.5" />
            <span className="font-medium">{channels.instagram.connected ? channels.instagram.accountName : 'Conectar Instagram'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          </div>

          <div 
            onClick={() => setCurrentView('channels')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full cursor-pointer transition-colors ${
              channels.whatsapp.connected 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800' 
                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="font-medium">{channels.whatsapp.connected ? 'WhatsApp Ativo' : 'Conectar WhatsApp'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          </div>
        </div>
      </div>

      {/* Ações Rápidas & Usuário */}
      <div className="flex items-center gap-3">
        {/* Alternador de Tema Claro / Escuro */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-medium transition-colors"
          title={theme === 'light' ? 'Mudar para Tema Escuro' : 'Mudar para Tema Claro'}
        >
          {theme === 'light' ? (
            <>
              <Moon className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Modo Escuro</span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Modo Claro</span>
            </>
          )}
        </button>

        {/* Status do Banco Supabase */}
        <div 
          onClick={() => setCurrentView('settings')}
          className="cursor-pointer hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
          title="Clique para gerenciar o Supabase"
        >
          <Database className="w-3.5 h-3.5 text-emerald-500" />
          <span className="font-medium">Supabase Conectado</span>
        </div>

        {/* Botão Simulador de Fluxo (Estilo ManyChat Blue) */}
        <button
          onClick={onOpenSimulator}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all hover:shadow"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Simulador de Celular</span>
        </button>

        {/* Perfil & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 pr-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          >
            <img 
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"} 
              alt={user?.name || "User"} 
              className="w-7 h-7 rounded-full object-cover border border-slate-300 dark:border-slate-600"
            />
            <span className="text-xs font-medium text-slate-800 dark:text-slate-200 hidden md:inline">{user?.name}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
                <p className="text-xs font-semibold text-slate-900 dark:text-white">{user?.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
              </div>

              <button
                onClick={() => { setProfileOpen(false); setCurrentView('dashboard'); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
                Guia Rápido de Início
              </button>

              <button
                onClick={() => { setProfileOpen(false); setCurrentView('settings'); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Database className="w-4 h-4 text-slate-500" />
                Configurações do Supabase
              </button>

              <button
                onClick={() => { setProfileOpen(false); setCurrentView('channels'); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-slate-500" />
                Gerenciar Conexões Meta
              </button>

              <div className="my-1 border-t border-slate-100 dark:border-slate-700"></div>

              <button
                onClick={() => { setProfileOpen(false); logout(); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
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
