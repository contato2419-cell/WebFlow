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
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar = () => {
  const { currentView, setCurrentView, conversations } = useApp();

  const unreadCount = conversations.filter(c => c.unread).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'flows', label: 'Flow Builder', icon: GitFork, badge: 'DAG' },
    { id: 'growth-tools', label: 'Growth Tools (Reels)', icon: Sparkles, badge: 'Anti-Ban' },
    { id: 'audience', label: 'Contatos & CRM', icon: Users },
    { id: 'live-chat', label: 'Live Chat', icon: MessagesSquare, badge: unreadCount > 0 ? String(unreadCount) : null, badgeColor: 'bg-indigo-600' },
    { id: 'channels', label: 'Canais Meta', icon: Radio },
    { id: 'settings', label: 'Supabase & API', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900/60 backdrop-blur-md flex flex-col justify-between p-4 shrink-0">
      <div className="space-y-6">
        {/* Navigation list */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Menu Principal</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.badgeColor || (isActive ? 'bg-indigo-500/40 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700')
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Banner Anti-Bloqueio Ativo */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/20 shadow-inner">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-xs font-semibold text-indigo-300">Escudo Anti-Ban Ativo</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Spintax randômico e delay inteligente ativados para respostas de Reels.
          </p>
        </div>
      </div>

      {/* Footer / Info */}
      <div className="pt-4 border-t border-slate-800/80 space-y-2 text-xs text-slate-500">
        <a 
          href="https://developers.facebook.com" 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center justify-between hover:text-slate-300 transition-colors p-2 rounded-lg hover:bg-slate-800/40"
        >
          <span>Meta Graph API v21.0</span>
          <ExternalLink className="w-3 h-3" />
        </a>
        <div className="px-2 text-[11px]">
          <span>WebFlow v1.0.0 • Open Source</span>
        </div>
      </div>
    </aside>
  );
};
