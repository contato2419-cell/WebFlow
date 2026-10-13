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
import { FlowSimulatorModal } from './components/FlowBuilder/FlowSimulatorModal';
import { AuthModal } from './components/Auth/AuthModal';

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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navbar Superior */}
      <Navbar 
        onOpenSimulator={() => setSimulatorOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Corpo da Aplicação */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Esquerda */}
        <Sidebar />

        {/* View Principal Ativa */}
        <main className="flex-1 overflow-y-auto bg-slate-950">
          {currentView === 'dashboard' && <DashboardView onNewFlow={handleCreateNewFlow} />}
          {currentView === 'flows' && <FlowCanvas onOpenSimulator={() => setSimulatorOpen(true)} />}
          {currentView === 'growth-tools' && <CommentsTriggerView />}
          {currentView === 'audience' && <ContactsView />}
          {currentView === 'live-chat' && <LiveChatView />}
          {currentView === 'channels' && <ChannelsView />}
          {currentView === 'settings' && <SupabaseConfigView />}
        </main>
      </div>

      {/* Modais Globais */}
      {simulatorOpen && (
        <FlowSimulatorModal onClose={() => setSimulatorOpen(false)} />
      )}

      {authModalOpen && (
        <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      )}
    </div>
  );
};

export default App;
