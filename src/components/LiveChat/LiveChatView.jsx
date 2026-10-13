import React, { useState } from 'react';
import { 
  MessagesSquare, 
  Send, 
  PauseCircle, 
  PlayCircle, 
  User, 
  Bot, 
  MessageCircle, 
  Check, 
  Clock,
  Sparkles
} from 'lucide-react';
import { InstagramIcon } from '../Icons';
import { useApp } from '../../context/AppContext';

export const LiveChatView = () => {
  const { conversations, toggleBotPause, sendLiveChatMessage } = useApp();
  const [activeConvId, setActiveConvId] = useState(conversations[0]?.id || null);
  const [inputText, setInputText] = useState('');

  const activeConv = conversations.find(c => c.id === activeConvId) || conversations[0];

  const handleSend = () => {
    if (!inputText.trim() || !activeConv) return;
    sendLiveChatMessage(activeConv.id, inputText.trim());
    setInputText('');
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden animate-in fade-in duration-300">
      {/* Coluna Esquerda: Lista de Conversas */}
      <aside className="w-80 border-r border-slate-800 bg-slate-900/60 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-800">
          <h2 className="text-sm font-bold font-heading text-white flex items-center gap-2">
            <MessagesSquare className="w-4 h-4 text-indigo-400" />
            Caixa de Entrada Live Chat
          </h2>
          <p className="text-[11px] text-slate-400 mt-0.5">Atendimento humano com pausa inteligente de bot</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
          {conversations.map((conv) => {
            const isSelected = activeConv?.id === conv.id;
            return (
              <div
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                  isSelected ? 'bg-slate-800/90' : 'hover:bg-slate-800/40'
                }`}
              >
                <div className="relative">
                  <img 
                    src={conv.avatar} 
                    alt={conv.contactName} 
                    className="w-10 h-10 rounded-full object-cover border border-slate-700"
                  />
                  <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-slate-900">
                    {conv.channel === 'instagram' ? (
                      <InstagramIcon className="w-3.5 h-3.5 text-rose-400" />
                    ) : (
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-semibold text-white truncate">{conv.contactName}</p>
                    <span className="text-[10px] text-slate-500">{conv.lastTime}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{conv.lastMessage}</p>

                  <div className="flex items-center gap-2 mt-1.5">
                    {conv.botPaused ? (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                        <User className="w-2.5 h-2.5" /> Atendente Humano
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center gap-1">
                        <Bot className="w-2.5 h-2.5" /> Bot Ativo
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Coluna Direita: Conversa Aberta */}
      {activeConv ? (
        <main className="flex-1 flex flex-col justify-between bg-slate-950">
          {/* Header da Conversa com Botão de Human Takeover */}
          <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={activeConv.avatar} 
                alt={activeConv.contactName} 
                className="w-10 h-10 rounded-full object-cover border border-slate-700"
              />
              <div>
                <h3 className="text-xs font-bold text-white">{activeConv.contactName}</h3>
                <p className="text-[11px] text-slate-400">
                  Canal: <span className="capitalize text-indigo-400 font-medium">{activeConv.channel}</span> ({activeConv.handle})
                </p>
              </div>
            </div>

            {/* O Interruptor de Human Takeover */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleBotPause(activeConv.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeConv.botPaused
                    ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20'
                }`}
              >
                {activeConv.botPaused ? (
                  <>
                    <PlayCircle className="w-4 h-4 text-amber-400" />
                    <span>Bot Pausado (Clique para Reativar)</span>
                  </>
                ) : (
                  <>
                    <PauseCircle className="w-4 h-4 text-white" />
                    <span>Pausar Bot (Assumir Conversa)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Mensagens */}
          <div className="flex-1 p-6 overflow-y-auto space-y-3.5">
            {activeConv.messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col ${msg.sender === 'user' ? 'items-start' : 'items-end'}`}
              >
                <div className={`max-w-[70%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700'
                    : msg.sender === 'bot'
                    ? 'bg-indigo-950/70 text-indigo-100 rounded-br-none border border-indigo-500/30 shadow-md'
                    : 'bg-indigo-600 text-white rounded-br-none shadow-md'
                }`}>
                  <div className="flex items-center justify-between gap-3 text-[10px] text-slate-400 mb-1">
                    <span className="font-semibold text-slate-300">
                      {msg.sender === 'user' ? activeConv.contactName : msg.sender === 'bot' ? '🤖 Robô WebFlow' : '👤 Atendente'}
                    </span>
                    <span>{msg.time}</span>
                  </div>
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input de Mensagem */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/60">
            {activeConv.botPaused && (
              <div className="mb-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                <span>O bot está em pausa. Todas as respostas enviadas aqui são manuais pelo operador humano.</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Digite uma mensagem para o cliente..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleSend}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar</span>
              </button>
            </div>
          </div>
        </main>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
          Nenhuma conversa selecionada
        </div>
      )}
    </div>
  );
};
