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
  HelpCircle,
  Smartphone,
  Radio,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { InstagramIcon } from './Icons';
import { useApp } from '../context/AppContext';

export const DashboardView = ({ onNewFlow }) => {
  const { flows, triggers, contacts, channels, setCurrentView, setSelectedFlowId } = useApp();

  const totalSent = flows.reduce((acc, f) => acc + (f.stats?.sent || 0), 0);
  const activeTriggersCount = triggers.filter(t => t.active).length;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Cabeçalho Limpo Estilo ManyChat */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white tracking-tight">
              Painel de Automações
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Sistemas Saudáveis
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gerencie seus fluxos no Instagram e WhatsApp com proteção contra bloqueios da Meta.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('growth-tools')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 shadow-xs transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Gatilho de Comentários</span>
          </button>
          
          <button
            onClick={onNewFlow}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Criar Novo Fluxo DAG</span>
          </button>
        </div>
      </div>

      {/* 🧭 GUIA PASSO A PASSO: "COMO FAZER" (Para nunca ficar perdido!) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              🚀
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Guia Rápido: Como colocar sua automação no ar em 3 passos
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Siga este checklist para começar a capturar leads no Instagram sem pagar mensalidade.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-full">
            Passo a Passo Oficial
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Passo 1 */}
          <div 
            onClick={() => setCurrentView('channels')}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 bg-slate-50/50 dark:bg-slate-850 cursor-pointer transition-all hover:shadow-xs group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                PASSO 1
              </span>
              <Radio className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
              Conectar Canais Meta
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Vincule sua conta comercial do Instagram ou WhatsApp na aba de Canais.
            </p>
            <div className="mt-3 text-[11px] text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
              {channels.instagram.connected ? '✓ Instagram Conectado' : 'Configurar Canal →'}
            </div>
          </div>

          {/* Passo 2 */}
          <div 
            onClick={() => setCurrentView('growth-tools')}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 bg-slate-50/50 dark:bg-slate-850 cursor-pointer transition-all hover:shadow-xs group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                PASSO 2
              </span>
              <Sparkles className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
              Criar Gatilho no Reel
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Escolha a palavra-chave que os seguidores vão comentar (ex: "QUERO") com Spintax.
            </p>
            <div className="mt-3 text-[11px] text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
              Configurar Palavra-Chave →
            </div>
          </div>

          {/* Passo 3 */}
          <div 
            onClick={() => setCurrentView('flows')}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 bg-slate-50/50 dark:bg-slate-850 cursor-pointer transition-all hover:shadow-xs group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                PASSO 3
              </span>
              <Smartphone className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-1">
              Montar Fluxo & Testar
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Adicione a caixa de confirmação em 2 etapas e teste ao vivo no Simulador de Celular.
            </p>
            <div className="mt-3 text-[11px] text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
              Abrir Flow Builder →
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Estilo ManyChat */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">DMs Enviadas</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-heading text-slate-900 dark:text-white">{totalSent.toLocaleString()}</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">+18.4%</span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Disparadas com atraso anti-ban</p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Taxa de Abertura</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-heading text-slate-900 dark:text-white">98.6%</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Alta entrega</span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Direto na caixa principal</p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Cliques no Botão (CTR)</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-heading text-slate-900 dark:text-white">68.5%</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">+12.1%</span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Micro-compromisso 2 etapas</p>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Status Anti-Bloqueio</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-heading text-slate-900 dark:text-white">100% SEGURO</span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">0 Alertas</span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Janela de 24h Meta ativa</p>
        </div>
      </div>

      {/* Seção 2: Fluxos e Gatilhos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fluxos Ativos */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                Fluxos de Automação (Flow Builder)
              </h2>
            </div>
            <button 
              onClick={() => setCurrentView('flows')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1"
            >
              Ver Todos ({flows.length}) <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {flows.map((flow) => (
              <div 
                key={flow.id}
                onClick={() => { setSelectedFlowId(flow.id); setCurrentView('flows'); }}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 hover:bg-blue-50/50 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    flow.channel === 'instagram' ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  }`}>
                    {flow.channel === 'instagram' ? <InstagramIcon className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {flow.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Pasta: <span className="font-medium text-slate-700 dark:text-slate-300">{flow.folder}</span> • {flow.nodes?.length || 0} nós no grafo
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs text-slate-500">
                  <div className="text-right hidden sm:block">
                    <p className="font-bold text-slate-900 dark:text-white">{flow.stats?.sent || 0} enviados</p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{flow.stats?.ctr || '0%'} CTR</p>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gatilhos de Comentários no Reel */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-750 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700 mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                  Gatilho de Comentários
                </h2>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-800">
                {activeTriggersCount} Ativos
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              Quando alguém comenta a palavra-chave no seu Reel, o robô responde publicamente com Spintax variado e chama no Direct no privado.
            </p>

            <div className="space-y-3">
              {triggers.slice(0, 2).map((t) => (
                <div key={t.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white mb-1">
                    <span>{t.name}</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      PALAVRA: {t.keyword}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3 text-slate-400" /> Delay: {t.delaySeconds}s
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">8 Spintax Ativos</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setCurrentView('growth-tools')}
            className="w-full mt-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-650 text-xs font-semibold text-slate-800 dark:text-slate-100 transition-colors text-center"
          >
            Configurar Gatilhos de Reels
          </button>
        </div>
      </div>
    </div>
  );
};
