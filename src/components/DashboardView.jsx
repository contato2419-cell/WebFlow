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
  ArrowUpRight
} from 'lucide-react';
import { InstagramIcon } from './Icons';
import { useApp } from '../context/AppContext';

export const DashboardView = ({ onNewFlow }) => {
  const { flows, triggers, contacts, setCurrentView, setSelectedFlowId } = useApp();

  const totalSent = flows.reduce((acc, f) => acc + (f.stats?.sent || 0), 0);
  const activeTriggersCount = triggers.filter(t => t.active).length;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Hero Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white tracking-tight flex items-center gap-2">
            Visão Geral de Automações
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-sans font-medium">
              Sistemas Saudáveis
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Monitore o desempenho das automações no Instagram e WhatsApp com proteção contra bloqueios.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('growth-tools')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Novo Gatilho de Reels</span>
          </button>
          
          <button
            onClick={onNewFlow}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Novo Fluxo DAG</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Total DMs Enviadas</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-heading text-white">{totalSent.toLocaleString()}</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">+18.4%</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Disparadas com atraso anti-ban</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Taxa de Abertura Real</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-heading text-white">98.6%</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">Alta entrega</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Fora da pasta de solicitações ocultas</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Taxa de Cliques (CTR)</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-heading text-white">68.5%</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">+12.1%</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Cliques no botão da caixinha</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Janela 24h Meta Status</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-heading text-white">100% OK</span>
            <span className="text-xs font-semibold text-emerald-400">0 Bloqueios</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Respeitando teto de 750/hora da Meta</p>
        </div>
      </div>

      {/* Seção 2: Fluxos em Destaque & Triggers de Reels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fluxos Ativos (2 Colunas) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <h2 className="text-base font-semibold text-white font-heading">Automações Ativas (DAG Flows)</h2>
            </div>
            <button 
              onClick={() => setCurrentView('flows')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              Ver Todos ({flows.length}) <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {flows.map((flow) => (
              <div 
                key={flow.id}
                onClick={() => { setSelectedFlowId(flow.id); setCurrentView('flows'); }}
                className="p-4 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 hover:border-indigo-500/50 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    flow.channel === 'instagram' ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {flow.channel === 'instagram' ? <InstagramIcon className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                      {flow.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Pasta: <span className="text-slate-300">{flow.folder}</span> • {flow.nodes?.length || 0} nós no grafo
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs text-slate-400">
                  <div className="text-right hidden sm:block">
                    <p className="font-semibold text-white">{flow.stats?.sent || 0} enviados</p>
                    <p className="text-[10px] text-emerald-400 font-medium">{flow.stats?.ctr || '0%'} CTR</p>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Triggers Rápidos de Comentários Reels */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h2 className="text-base font-semibold text-white font-heading">Reels Growth Tool</h2>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
                {activeTriggersCount} Ativos
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Ao comentar a palavra-chave no vídeo, a resposta no feed é rotacionada em 8 variações com delay humano para blindagem anti-ban.
            </p>

            <div className="space-y-2.5">
              {triggers.slice(0, 2).map((t) => (
                <div key={t.id} className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs">
                  <div className="flex items-center justify-between font-medium text-white mb-1">
                    <span>{t.name}</span>
                    <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                      PALAVRA: {t.keyword}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" /> Delay: {t.delaySeconds}s
                    </span>
                    <span className="text-emerald-400 font-medium">8 Spintax Ativos</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setCurrentView('growth-tools')}
            className="w-full mt-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors text-center"
          >
            Gerenciar Todos os Gatilhos de Comentários
          </button>
        </div>
      </div>
    </div>
  );
};
