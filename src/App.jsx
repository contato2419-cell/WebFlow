import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { FlowCanvas } from './components/FlowBuilder/FlowCanvas';
import { CommentsTriggerView } from './components/GrowthTools/CommentsTriggerView';
import { ContactsView } from './components/Audience/ContactsView';
import { LiveChatView } from './components/LiveChat/LiveChatView';
import { ChannelsView } from './components/Settings/ChannelsView';
import { SupabaseConfigView } from './components/Settings/SupabaseConfigView';
import { BroadcastsView } from './components/Broadcasts/BroadcastsView';
import { SequencesView } from './components/Sequences/SequencesView';
import { AiKnowledgeView } from './components/AI/AiKnowledgeView';
import { FlowSimulatorModal } from './components/FlowBuilder/FlowSimulatorModal';
import { AuthModal } from './components/Auth/AuthModal';
import { PanelKeyModal } from './components/Auth/PanelKeyModal';
import { MobileBottomNav } from './components/MobileBottomNav';

export const App = () => {
  const { currentView, setCurrentView, createFlow } = useApp();
  const { user } = useAuth();
  const [simulatorOpen, setSimulatorOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleCreateNewFlow = () => {
    const newId = createFlow('Novo Fluxo Automatizado', 'instagram');
    setCurrentView('flows');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Navbar Superior */}
      <Navbar 
        onOpenSimulator={() => setSimulatorOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Corpo da Aplicação */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar Esquerda (Desktop + Mobile Drawer) */}
        <Sidebar />

        {/* View Principal Ativa */}
        <main className={`flex-1 min-w-0 ${
          currentView === 'live-chat' 
            ? 'overflow-hidden flex flex-col pb-14 md:pb-0' 
            : currentView === 'flows' 
              ? 'overflow-hidden flex flex-col pb-14 md:pb-0' 
              : 'overflow-y-auto pb-16 md:pb-0'
        } bg-[#F8FAFC] dark:bg-[#0B0F19] transition-colors duration-200`}>
          {currentView === 'dashboard' && <DashboardView onNewFlow={handleCreateNewFlow} />}
          {currentView === 'flows' && <FlowCanvas onOpenSimulator={() => setSimulatorOpen(true)} />}
          {currentView === 'growth-tools' && <CommentsTriggerView />}
          {currentView === 'broadcasts' && <BroadcastsView />}
          {currentView === 'sequences' && <SequencesView />}
          {currentView === 'ai' && <AiKnowledgeView />}
          {currentView === 'audience' && <ContactsView />}
          {currentView === 'live-chat' && <LiveChatView />}
          {currentView === 'channels' && <ChannelsView />}
          {currentView === 'settings' && <SupabaseConfigView />}
        </main>
      </div>

      {/* Barra de Navegação Inferior no Mobile */}
      <MobileBottomNav />

      {/* Modais Globais */}
      {simulatorOpen && (
        <FlowSimulatorModal onClose={() => setSimulatorOpen(false)} />
      )}

      {authModalOpen && (
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      )}

      <PanelKeyModal />
    </div>
  );
};

export default App;
