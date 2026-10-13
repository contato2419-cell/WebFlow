import React, { useState } from 'react';
import { X, Send, RotateCcw, Smartphone, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FlowSimulatorModal = ({ onClose }) => {
  const { flows, selectedFlowId } = useApp();
  const currentFlow = flows.find(f => f.id === selectedFlowId) || flows[0];

  const [inputVal, setInputVal] = useState('VITRIX');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'system',
      text: 'Simulação Iniciada. Digite um comentário como se estivesse no Reels do Instagram:'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [logTrace, setLogTrace] = useState([
    'Iniciando Interpretador de Grafo VitrixFlow...',
    'Aguardando evento webhook: feed/comments...'
  ]);

  const handleSendMessage = () => {
    if (!inputVal.trim()) return;
    const userText = inputVal.trim();
    setInputVal('');

    // Adiciona comentário do usuário
    setMessages(prev => [
      ...prev,
      { id: Date.now(), sender: 'user', text: `Comentou no Reels: "${userText}"` }
    ]);

    setLogTrace(prev => [
      ...prev,
      `[Webhook Inbound] Evento recebido com palavra: "${userText}"`,
      `[Anti-Ban Shield] Sorteando 1 de 8 variações de Spintax...`,
      `[Delay Humano] Aguardando 12s simulados para resposta orgânica...`
    ]);

    setIsTyping(true);

    // Simula resposta do bot após delay
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: 'Oi Ygor! Vi que você comentou no vídeo querendo saber mais sobre a Vitrix. Para eu liberar o seu acesso agora, toque no botão abaixo 👇',
          buttonText: '🚀 Quero Acessar Agora'
        }
      ]);
      setLogTrace(prev => [
        ...prev,
        `[Private Reply Disparada] 1ª DM enviada com Caixinha de Micro-Compromisso (SEM LINK DIRETO).`,
        `[Status Meta] Aguardando interação do usuário para abrir a Janela de 24h oficial.`
      ]);
    }, 1200);
  };

  const handleButtonClick = () => {
    setMessages(prev => [
      ...prev,
      { id: Date.now(), sender: 'user', text: '[Clicou em: 🚀 Quero Acessar Agora]' }
    ]);

    setLogTrace(prev => [
      ...prev,
      `[Interação Confirmada] Usuário tocou no botão persistente.`,
      `[Janela de 24 Horas ABERTA] Meta Graph API autorizou envio livre de mensagens!`,
      `[Ação Atômica] Tag "lead_engajado_reels" gravada no contato.`
    ]);

    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: 'Perfeito! Como você confirmou, aqui está o seu acesso direto ao WhatsApp e catálogo oficial da Vitrix: https://wa.me/5511999998888?text=QueroMeuAcessoVitrix 📲',
          url: 'https://wa.me/5511999998888'
        }
      ]);
      setLogTrace(prev => [
        ...prev,
        `[Link Seguro Entregue] Mensagem entregue na caixa principal (0% de chance de spam).`
      ]);
    }, 800);
  };

  const handleReset = () => {
    setMessages([
      { id: 1, sender: 'system', text: 'Simulação Reiniciada. Digite a palavra-chave configurada:' }
    ]);
    setLogTrace([
      'Resetando máquina de estados...',
      'Aguardando novo input...'
    ]);
    setInputVal('VITRIX');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-4xl h-[650px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex overflow-hidden">
        {/* Lado Esquerdo: Simulador de Celular */}
        <div className="w-[360px] bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0">
          {/* Topo do Celular */}
          <div className="p-4 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-indigo-500 p-0.5">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-[10px] font-bold text-white">
                  VF
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-white">Vitrix Oficial</p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online
                </p>
              </div>
            </div>

            <button onClick={handleReset} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800" title="Reiniciar">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Área de Mensagens do Chat */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                {m.sender === 'system' ? (
                  <div className="w-full text-center py-2 text-[11px] text-slate-500 bg-slate-900/50 rounded-xl">
                    {m.text}
                  </div>
                ) : (
                  <div className={`max-w-[85%] p-3 rounded-2xl text-xs ${
                    m.sender === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-md' 
                      : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700/60'
                  }`}>
                    <p className="leading-relaxed">{m.text}</p>
                    
                    {/* Botão Interativo da Caixinha */}
                    {m.buttonText && (
                      <button
                        onClick={handleButtonClick}
                        className="w-full mt-2.5 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-[11px] shadow-lg transition-transform active:scale-95 text-center flex items-center justify-center gap-1.5"
                      >
                        <span>{m.buttonText}</span>
                      </button>
                    )}

                    {m.url && (
                      <a
                        href={m.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block mt-2 text-[11px] text-cyan-400 hover:underline font-semibold"
                      >
                        Abrir Link Externo ↗
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-slate-800 text-slate-400 text-xs w-20">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}
          </div>

          {/* Input do Chat */}
          <div className="p-3 border-t border-slate-800/80 bg-slate-900/60 flex items-center gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Digite VITRIX..."
              className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleSendMessage}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Lado Direito: Console de Auditoria & Execução da Máquina de Estados */}
        <div className="flex-1 p-6 flex flex-col justify-between bg-slate-900">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white font-heading">
                  Console de Execução do Grafo (State Machine)
                </h3>
              </div>
              <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-slate-300 space-y-1.5 h-80 overflow-y-auto">
              {logTrace.map((log, lidx) => (
                <div key={lidx} className="flex items-start gap-2">
                  <span className="text-slate-600 select-none">&gt;</span>
                  <span className={log.includes('ABERTA') ? 'text-emerald-400 font-bold' : log.includes('Anti-Ban') ? 'text-amber-400' : 'text-slate-300'}>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-indigo-300">Validação Completa</p>
              <p className="text-[11px] text-slate-400">
                O fluxo está configurado de acordo com as diretrizes da Meta Graph API v21.0.
              </p>
            </div>
            <button onClick={onClose} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white">
              Pronto
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
