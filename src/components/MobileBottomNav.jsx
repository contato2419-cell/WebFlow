import React from 'react';
import { 
  LayoutDashboard, 
  GitFork, 
  Users, 
  MessagesSquare, 
  Menu
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MobileBottomNav = () => {
  const { currentView, setCurrentView, conversations, isMobileMenuOpen, setIsMobileMenuOpen } = useApp();

  const unreadCount = conversations.filter(c => c.unread).length;

  const items = [
    { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
    { id: 'flows', label: 'Fluxos', icon: GitFork },
    { 
      id: 'live-chat', 
      label: 'Chat', 
      icon: MessagesSquare, 
      badge: unreadCount > 0 ? unreadCount : null 
    },
    { id: 'audience', label: 'Leads', icon: Users },
  ];

  return (
    <nav 
      aria-label="Navegação Mobile" 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 transition-colors select-none shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id && !isMobileMenuOpen;

          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'text-blue-600 dark:text-blue-400 font-bold scale-105' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                {item.badge && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-blue-600 text-white text-[9px] font-black flex items-center justify-center border-2 border-white dark:border-slate-900">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
              {isActive && (
                <span className="absolute -bottom-1 w-5 h-1 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
              )}
            </button>
          );
        })}

        {/* Botão de Menu para abrir todas as opções no Drawer */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
            isMobileMenuOpen 
              ? 'text-blue-600 dark:text-blue-400 font-bold scale-105' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium'
          }`}
        >
          <Menu className={`w-5 h-5 transition-transform ${isMobileMenuOpen ? 'scale-110' : ''}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Mais</span>
          {isMobileMenuOpen && (
            <span className="absolute -bottom-1 w-5 h-1 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
          )}
        </button>
      </div>
    </nav>
  );
};
