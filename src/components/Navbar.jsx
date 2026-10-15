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
  HelpCircle,
  Menu
} from 'lucide-react';
import { InstagramIcon } from './Icons';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { getSupabaseConfig } from '../lib/supabase';

export const Navbar = ({ onOpenSimulator }) => {
  const { user, logout } = useAuth();
  const { channels, setCurrentView, theme, toggleTheme, isMobileMenuOpen, setIsMobileMenuOpen } = useApp();
  const supabaseConfig = getSupabaseConfig();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 sm:px-6 flex items-center justify-between z-30 sticky top-0 transition-colors">
      {/* Brand & Official WebFlow Logo */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Hamburger Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden transition-colors"
          aria-label="Abrir menu lateral"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div 
          onClick={() => setCurrentView('dashboard')}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
        >
          {/* Logo Oficial WebFlow */}
          <div className="relative shrink-0">
            <img 
              src="/logo.jpg" 
              alt="WebFlow Logo" 
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl object-cover shadow-sm border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform" 
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" title="Sistema Online"></span>
          </div>

          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-heading font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">WebFlow</span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                PRO
              </span>
            </div>
            <p className="hidden sm:block text-[11px] text-slate-500 dark:text-slate-400 -mt-0.5 font-medium">Automação Omnichannel</p>
          </div>
        </div>

        {/* Canais Conectados no Topo */}
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
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Alternador de Tema Claro / Escuro */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-medium transition-colors"
          title={theme === 'light' ? 'Mudar para Tema Escuro' : 'Mudar para Tema Claro'}
        >
          {theme === 'light' ? (
            <>
              <Moon className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden md:inline">Modo Escuro</span>
            </>
          ) : (
            <>
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Modo Claro</span>
            </>
          )}
        </button>

        {/* Botão Simulador de Fluxo */}
        <button
          onClick={onOpenSimulator}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all hover:shadow shrink-0"
        >
          <Play className="w-3.5 h-3.5 fill-white shrink-0" />
          <span className="hidden sm:inline">Simulador</span>
          <span className="hidden md:inline">de Celular</span>
        </button>

        {/* Perfil & Dropdown com Foto Real (@ygorweb) */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 pr-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
          >
            <img 
              src="/avatar_ygorweb.jpg" 
              alt="Ygor Souza" 
              className="w-7 h-7 rounded-full object-cover border border-slate-300 dark:border-slate-600 shadow-xs"
            />
            <span className="text-xs font-medium text-slate-800 dark:text-slate-200 hidden md:inline">Ygor Souza</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
                <p className="text-xs font-semibold text-slate-900 dark:text-white">Ygor Souza</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">@ygorweb</p>
              </div>

              <button
                onClick={() => { setProfileOpen(false); setCurrentView('dashboard'); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
                Painel Principal
              </button>

              <button
                onClick={() => { setProfileOpen(false); setCurrentView('settings'); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Database className="w-4 h-4 text-slate-500" />
                Configurações da Conta
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
