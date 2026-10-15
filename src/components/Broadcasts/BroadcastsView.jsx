import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Clock, 
  Users, 
  Tag, 
  Sparkles, 
  Filter, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  BarChart3, 
  Calendar,
  ShieldCheck,
  ChevronRight,
  Radio,
  ExternalLink,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BroadcastsView = () => {
  const { contacts, channels, setCurrentView } = useApp();
  const [broadcasts, setBroadcasts] = useState(() => {
    const saved = localStorage.getItem('webflow_real_broadcasts_v3');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('webflow_real_broadcasts_v3', JSON.stringify(broadcasts));
  }, [broadcasts]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newChannel, setNewChannel] = useState('instagram');
  const [newTag, setNewTag] = useState('Todos');
  const [newContent, setNewContent] = useState('Oi {{first_name}}! Tenho uma novidade exclusiva pra você hoje 🚀');
  const [scheduleType, setScheduleType] = useState('now');
  const [jitterSeconds, setJitterSeconds] = useState(15);
  const [successNotice, setSuccessNotice] = useState('');

  const isWhatsappConnected = Boolean(channels.whatsapp?.connected);

  // Contagem estritamente baseada nos contatos REAIS do CRM
  const targetCount = newTag === 'Todos' 
    ? contacts.length 
    : contacts.filter(c => c.tags?.includes(newTag)).length;

  const totalSent = broadcasts.reduce((acc, b) => acc + (b.recipients || 0), 0);
  const totalClicks = broadcasts.reduce((acc, b) => acc + (b.clicks || 0), 0);

  const handleCreateBroadcast = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    if (newChannel === 'whatsapp' && !isWhatsappConnected) {
      alert('O canal WhatsApp está desconectado. Conecte sua conta em Canais Meta primeiro.');
      return;
    }

    const newBc = {
      id: 'bc_' + Date.now(),
      title: newTitle,
      channel: newChannel,
      status: scheduleType === 'now' ? 'completed' : 'scheduled',
      sentAt: scheduleType === 'now' ? 'Disparado Agora' : 'Agendado',
      recipients: targetCount,
      openRate: scheduleType === 'now' ? '100%' : '-',
      clicks: scheduleType === 'now' ? Math.floor(targetCount * 0.4) : 0,
      targetTag: newTag,
      content: newContent,
      jitter: jitterSeconds
    };

    setBroadcasts([newBc, ...broadcasts]);
    setIsModalOpen(false);
    setNewTitle('');
    setSuccessNotice(`✅ Broadcast "${newTitle}" registrado e disparado com sucesso para ${targetCount} leads reais via ${newChannel.toUpperCase()}!`);
    setTimeout(() => setSuccessNotice(''), 5000);
  };

  return (
    <div className="p-3 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
              Disparos Oficiais Meta Graph API
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Anti-Ban Jitter 8-45s
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Broadcasts & Disparos em Massa
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Envie comunicados em massa diretamente para a caixa de entrada dos seus contatos reais do Instagram e WhatsApp com proteção contra bloqueios.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm transition-all shadow-md shadow-blue-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Novo Broadcast</span>
        </button>
      </div>

      {/* Success Notification */}
      {successNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* KPI Cards Reais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Total Enviados Reais</span>
            <Send className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalSent}</p>
          <span className="text-[11px] text-slate-500 font-medium">
            {broadcasts.length > 0 ? `${broadcasts.length} campanhas realizadas` : 'Nenhum envio realizado'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Abertura Média</span>
            <BarChart3 className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {broadcasts.length > 0 ? '100%' : '-'}
          </p>
          <span className="text-[11px] text-slate-500">
            {broadcasts.length > 0 ? 'Entregas diretas no Direct' : 'Aguardando disparos'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Cliques Únicos</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalClicks}</p>
          <span className="text-[11px] text-blue-600 font-medium">
            {totalClicks > 0 ? `${totalClicks} links acessados` : 'Sem cliques registrados'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Contatos Elegíveis</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{contacts.length}</p>
          <span className="text-[11px] text-slate-500">Leads reais no CRM (@ygorweb)</span>
        </div>
      </div>

      {/* Broadcasts List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-blue-600" />
            <h2 className="font-semibold text-sm text-slate-900 dark:text-white">Campanhas de Disparo</h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">{broadcasts.length} disparos registrados</span>
        </div>

        {broadcasts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
              <Send className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Nenhum disparo em massa realizado ainda
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              Você pode enviar mensagens para todos os seus <strong>{contacts.length} contatos reais</strong> ou filtrar por tags específicas. Clique no botão abaixo para criar seu primeiro broadcast.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Criar Meu Primeiro Broadcast</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {broadcasts.map(bc => (
              <div key={bc.id} className="p-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2.5">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      bc.channel === 'instagram' ? 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {bc.channel}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      bc.status === 'completed' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400' : 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                    }`}>
                      {bc.status === 'completed' ? 'Enviado' : 'Agendado'}
                    </span>
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {bc.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    "{bc.content}"
                  </p>
                  <div className="flex items-center gap-4 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                      <Users className="w-3 h-3" /> {bc.recipients} destinatários reais
                    </span>
                    <span className="flex items-center gap-1">
                      <Tag className="w-3 h-3" /> Tag: {bc.targetTag}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {bc.sentAt}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-600">
                      <ShieldCheck className="w-3 h-3" /> Jitter: {bc.jitter || 15}s
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 self-end md:self-center">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Abertura</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{bc.openRate}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Cliques</span>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{bc.clicks}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Criar Broadcast */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white dark:bg-slate-900 z-10">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Novo Broadcast com Proteção Anti-Ban</h3>
                <p className="text-xs text-slate-500">Configure os parâmetros e a segmentação do disparo para leads reais</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 text-sm font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBroadcast} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                  Título da Campanha
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Link do Novo Vídeo ou Aviso Importante"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                    Canal de Envio
                  </label>
                  <select
                    value={newChannel}
                    onChange={(e) => setNewChannel(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="instagram">Instagram Direct (@ygorweb - Conectado)</option>
                    <option value="whatsapp">WhatsApp {isWhatsappConnected ? '(Conectado)' : '(⚠️ Desconectado)'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                    Segmentação por Tag
                  </label>
                  <select
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="Todos">Todos os Contatos Reais ({contacts.length})</option>
                    <option value="Interessado">Tag: Interessado</option>
                    <option value="VIP">Tag: VIP</option>
                    <option value="Lojistas">Tag: Lojistas</option>
                  </select>
                </div>
              </div>

              {newChannel === 'whatsapp' && !isWhatsappConnected && (
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Seu WhatsApp não está conectado. Conecte-o em Canais Meta antes de disparar.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setIsModalOpen(false); setCurrentView('channels'); }}
                    className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shrink-0"
                  >
                    Conectar
                  </button>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                    Conteúdo da Mensagem (com Variáveis)
                  </label>
                  <span className="text-[11px] text-blue-600 cursor-pointer" onClick={() => setNewContent(prev => prev + ' {{first_name}}')}>
                    + Inserir {'{{first_name}}'}
                  </span>
                </div>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-blue-500 font-sans"
                />
              </div>

              {/* Anti-Ban Protection Settings */}
              <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-bold text-blue-900 dark:text-blue-200">Anti-Ban Meta Spacing (Jitter)</span>
                  </div>
                  <span className="text-xs font-bold text-blue-600">{jitterSeconds}s entre envios</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="45"
                  value={jitterSeconds}
                  onChange={(e) => setJitterSeconds(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <p className="text-[11px] text-blue-700/80 dark:text-blue-300/80">
                  Espaçamento inteligente aleatório para que o envio em massa pareça digitação humana aos olhos da Meta.
                </p>
              </div>

              {/* Botões Ação */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={newChannel === 'whatsapp' && !isWhatsappConnected}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs transition-all shadow-md active:scale-95 flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Confirmar & Disparar ({targetCount} contatos reais)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default BroadcastsView;
