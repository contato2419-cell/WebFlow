import React from 'react';
import { 
  LayoutDashboard, 
  GitFork, 
  Sparkles, 
  Users, 
  MessagesSquare, 
  Radio, 
  Settings,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar = () => {
  const { currentView, setCurrentView, conversations } = useApp();

  const unreadCount = conversations.filter(c => c.unread).length;

  const navItems = [
    { id: 'dashboard', label: 'Início & Guia', icon: LayoutDashboard, hint: 'Visão geral' },
    { id: 'flows', label: 'Flow Builder', icon: GitFork, badge: 'Visual DAG', hint: 'Editor de fluxos' },
    { id: 'growth-tools', label: 'Gatilhos de Reels', icon: Sparkles, badge: 'Spintax', hint: 'Comentários' },
    { id: 'audience', label: 'Contatos & CRM', icon: Users, badge: '24h Meta', hint: 'Lista de leads' },
    { id: 'live-chat', label: 'Live Chat Humano', icon: MessagesSquare, badge: unreadCount > 0 ? String(unreadCount) : null, badgeColor: 'bg-blue-600 text-white', hint: 'Atendimento' },
    { id: 'channels', label: 'Canais Meta', icon: Radio, hint: 'Instagram/WhatsApp' },
    { id: 'settings', label: 'Banco Supabase', icon: Settings, hint: 'Configurações' },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between p-4 shrink-0 transition-colors">
      <div className="space-y-6">
        {/* Navigation list */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
            Automação ManyChat
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-semibold border border-blue-100 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800/80 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/60 font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.badgeColor || (isActive ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400')
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Card Explicativo Anti-Bloqueio (Estilo ManyChat) */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
          <div className="flex items-center gap-2 mb-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Escudo Anti-Ban Ativo</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Spintax randômico e delay humano (8s-35s) protegendo sua conta do Instagram contra bloqueios.
          </p>
        </div>
      </div>

      {/* Footer / Documentação */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
        <a 
          href="https://github.com/contato2419-cell/WebFlow" 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center justify-between text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span className="font-medium">Documentação REA</span>
          </div>
          <ExternalLink className="w-3 h-3" />
        </a>
        <div className="px-2 text-[11px] text-slate-400 dark:text-slate-500">
          <span>WebFlow 1.0 • 100% Gratuito</span>
        </div>
      </div>
    </aside>
  );
};
