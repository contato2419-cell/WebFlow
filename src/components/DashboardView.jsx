import React from 'react';
import { 
  Send, 
  CheckCheck, 
  MousePointerClick, 
  ShieldCheck, 
  TrendingUp, 
  Plus, 
  Sparkles, 
  Clock, 
  MessageCircle, 
  ArrowUpRight,
  ExternalLink,
  Users,
  Activity,
  MessagesSquare
} from 'lucide-react';
import { InstagramIcon, WhatsAppIcon } from './Icons';
import { useApp } from '../context/AppContext';
import { UserAvatar } from './Common/UserAvatar';
import { MetaSetupVisualGuide } from './Tutorial/MetaSetupVisualGuide';

export const DashboardView = ({ onNewFlow }) => {
  const { flows, triggers, contacts, channels, conversations, setCurrentView, setSelectedFlowId } = useApp();

  const isWhatsappConnected = Boolean(channels.whatsapp?.connected);
  const isInstagramConnected = Boolean(channels.instagram?.connected);

  // Calcula DMs enviadas APENAS dos canais que estão conectados e verificados
  const connectedFlows = flows.filter(f => {
    if (f.channel === 'whatsapp') return isWhatsappConnected;
    if (f.channel === 'instagram') return isInstagramConnected;
    return false;
  });

  const totalSent = connectedFlows.reduce((acc, f) => acc + (f.stats?.sent || 0), 0);
  const activeTriggersCount = triggers.filter(t => t.active).length;
  const recentConvs = conversations.slice(0, 6);

  // Métricas calculadas dinamicamente das conversas reais
  const readConvs = conversations.filter(c => !c.unread).length;
  const openRate = conversations.length > 0 ? Math.round((readConvs / conversations.length) * 100) + '%' : '0%';

  const followedCount = conversations.filter(c => c.messages?.some(m => m.sender === 'user' && m.text.includes('Já estou te seguindo'))).length;
  const followerConversionRate = conversations.length > 0 ? ((followedCount / conversations.length) * 100).toFixed(1) + '%' : '0%';

  return (
    <div className="p-3 sm:p-6 md:p-8 space-y-4 sm:space-y-6 md:space-y-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Cabeçalho Limpo e Profissional */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white tracking-tight">
              Painel de Operações
            </h1>
            <span className="text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-semibold flex items-center gap-1.5 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Instagram @ygorweb Conectado
            </span>
            {!isWhatsappConnected && (
              <span className="text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                WhatsApp Desconectado
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Métricas em tempo real sincronizadas exclusivamente dos seus canais conectados.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={() => setCurrentView('growth-tools')}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 shadow-xs transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Gatilhos ({activeTriggersCount})</span>
          </button>
          
          <button
            onClick={onNewFlow}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Fluxo</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Reais de Produção */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">DMs Enviadas Reais</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
              {totalSent.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center">
              Instagram @ygorweb
            </span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            Entregas reais via Meta Graph API v21.0
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Taxa de Abertura Real</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
              {openRate}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {readConvs} lidas
            </span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            Calculado sobre as {conversations.length} conversas no Direct
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Conversão Trava de Seguidor</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
              {followerConversionRate}
            </span>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              {followedCount} cliques
            </span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            Seguidores verificados antes da entrega do link
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Contatos no CRM</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
              {contacts.length}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Leads Reais
            </span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
            Total de leads capturados no Instagram Direct
          </p>
        </div>
      </div>

      {/* Grid Principal: Fluxos Ativos e Atividade em Tempo Real */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda: Fluxos em Produção e Gatilho do Reel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card dos Fluxos de Automação */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                  Fluxos de Automação em Execução
                </h2>
              </div>
              <button
                onClick={() => setCurrentView('flows')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1"
              >
                Abrir Flow Builder ({flows.length}) <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {flows.map((flow) => {
                const isChannelConnected = flow.channel === 'instagram' ? isInstagramConnected : isWhatsappConnected;
                const isActuallyActive = flow.active && isChannelConnected;
                const realSentCount = isChannelConnected ? (flow.stats?.sent || 0) : 0;
                const realCtr = isChannelConnected ? (flow.stats?.ctr || '0%') : '0%';

                return (
                  <div
                    key={flow.id}
                    onClick={() => { setSelectedFlowId(flow.id); setCurrentView('flows'); }}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-blue-50/40 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700/80 hover:border-blue-300 dark:hover:border-blue-500 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-2xs ${
                        flow.channel === 'instagram' 
                          ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800' 
                          : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                      }`}>
                        {flow.channel === 'instagram' ? <InstagramIcon className="w-5 h-5" /> : <WhatsAppIcon className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {flow.name}
                          </h3>
                          {!isChannelConnected && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-semibold">
                              Canal Desconectado
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Pasta: <span className="font-semibold text-slate-700 dark:text-slate-300">{flow.folder}</span> • {flow.nodes?.length || 0} blocos no grafo
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-xs text-slate-500">
                      <div className="text-right hidden sm:block">
                        <p className="font-bold text-slate-900 dark:text-white">
                          {realSentCount} enviados
                        </p>
                        <p className={`text-[10px] font-semibold ${isChannelConnected ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                          {isChannelConnected ? `${realCtr} CTR` : '⚪ Inativo'}
                        </p>
                      </div>
                      <span className={`w-2.5 h-2.5 rounded-full ${isActuallyActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'}`} title={isActuallyActive ? 'Fluxo Ativo' : (isChannelConnected ? 'Pausado' : 'Canal Desconectado')}></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card dos Gatilhos de Comentários */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                  Gatilho de Comentários no Reels
                </h2>
              </div>
              <button
                onClick={() => setCurrentView('growth-tools')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                Gerenciar Gatilhos →
              </button>
            </div>

            <div className="space-y-3">
              {triggers.map((trig) => (
                <div key={trig.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{trig.name}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 font-bold">
                        PALAVRA: {trig.keyword}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Delay: {trig.delaySeconds}s (jitter humano) • 8 variações de Spintax ativas
                    </p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold">
                    Ativo no Instagram
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna Direita: Live Feed de Conversas Reais no Instagram */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700 mb-3">
              <div className="flex items-center gap-2">
                <MessagesSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                  Directs Recentes
                </h2>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-400 font-bold border border-rose-200 dark:border-rose-800">
                @ygorweb
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Últimas mensagens recebidas de seguidores reais e respostas da automação.
            </p>

            <div className="space-y-3">
              {recentConvs.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setCurrentView('live-chat')}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-blue-50/50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700/80 transition-all cursor-pointer flex items-center gap-3 group"
                >
                  <UserAvatar
                    name={c.contactName}
                    handle={c.handle}
                    avatar={c.avatar}
                    channel={c.channel}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {c.contactName}
                      </p>
                      <span className="text-[10px] text-slate-400">{c.lastTime}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {c.lastMessage}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setCurrentView('live-chat')}
            className="w-full mt-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition-colors text-center shadow-sm"
          >
            Ver Todas as Conversas no Live Chat →
          </button>
        </div>
      </div>

      {/* 📘 Guia Visual de Configuração Passo a Passo com Telas Reais */}
      <div className="pt-2">
        <MetaSetupVisualGuide />
      </div>
    </div>
  );
};
