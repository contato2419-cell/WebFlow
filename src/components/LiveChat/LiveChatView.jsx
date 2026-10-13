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
  Sparkles,
  HelpCircle
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
      {/* Coluna Esquerda: Lista de Conversas Estilo ManyChat */}
      <aside className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <MessagesSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h2 className="text-sm font-bold font-heading text-slate-900 dark:text-white">
              Caixa de Entrada Live Chat
            </h2>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
            Atendimento humano integrado (Human Takeover)
          </p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {conversations.map((conv) => {
            const isSelected = activeConv?.id === conv.id;
            return (
              <div
                key={conv.id}
                onClick={() => setActiveConvId(conv.id)}
                className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                  isSelected 
                    ? 'bg-blue-50/70 dark:bg-slate-800/90 border-l-4 border-blue-600' 
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="relative">
                  <img 
                    src={conv.avatar} 
                    alt={conv.contactName} 
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-white dark:bg-slate-900 shadow-xs">
                    {conv.channel === 'instagram' ? (
                      <InstagramIcon className="w-3.5 h-3.5 text-rose-500" />
                    ) : (
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                    )}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{conv.contactName}</p>
                    <span className="text-[10px] text-slate-400">{conv.lastTime}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{conv.lastMessage}</p>

                  <div className="flex items-center gap-2 mt-1.5">
                    {conv.botPaused ? (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                        <User className="w-2.5 h-2.5" /> Atendente Humano
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                        <Bot className="w-2.5 h-2.5" /> Robô Ativo
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
        <main className="flex-1 flex flex-col justify-between bg-slate-50 dark:bg-slate-950">
          {/* Header da Conversa */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={activeConv.avatar} 
                alt={activeConv.contactName} 
                className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700"
              />
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">{activeConv.contactName}</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Canal: <span className="capitalize font-semibold text-blue-600 dark:text-blue-400">{activeConv.channel}</span> ({activeConv.handle})
                </p>
              </div>
            </div>

            {/* O Interruptor de Human Takeover Estilo ManyChat */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleBotPause(activeConv.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-xs ${
                  activeConv.botPaused
                    ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {activeConv.botPaused ? (
                  <>
                    <PlayCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
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
          <div className="flex-1 p-6 overflow-y-auto space-y-3">
            {activeConv.messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col ${msg.sender === 'user' ? 'items-start' : 'items-end'}`}
              >
                <div className={`max-w-[70%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-xs border border-slate-200 dark:border-slate-700 shadow-xs'
                    : msg.sender === 'bot'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-950 dark:text-blue-100 rounded-br-xs border border-blue-200 dark:border-blue-800 shadow-xs'
                    : 'bg-blue-600 text-white rounded-br-xs shadow-xs font-medium'
                }`}>
                  <div className="flex items-center justify-between gap-3 text-[10px] text-slate-400 mb-1">
                    <span className="font-bold">
                      {msg.sender === 'user' ? activeConv.contactName : msg.sender === 'bot' ? '🤖 Robô Automático' : '👤 Atendente Humano'}
                    </span>
                    <span>{msg.time}</span>
                  </div>
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input de Envio Humano */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            {activeConv.botPaused && (
              <div className="mb-2 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-1.5 font-medium">
                <User className="w-3.5 h-3.5 shrink-0" />
                <span>O robô está pausado nesta conversa. Suas respostas aqui são 100% humanas e diretas.</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escreva uma resposta direta para o cliente..."
                className="flex-1 px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 shadow-xs"
              />
              <button
                onClick={handleSend}
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Enviar</span>
              </button>
            </div>
          </div>
        </main>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
          Nenhuma conversa selecionada
        </div>
      )}
    </div>
  );
};
