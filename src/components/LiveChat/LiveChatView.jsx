import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  HelpCircle,
  RefreshCw,
  Pin,
  Search,
  Camera,
  ExternalLink,
  Filter,
  CheckCheck,
  Radio,
  ArrowLeft,
  ChevronDown
} from 'lucide-react';
import { InstagramIcon } from '../Icons';
import { useApp } from '../../context/AppContext';
import { UserAvatar } from '../Common/UserAvatar';

// Conversas VIP / Fixadas por padrão (identificadores resilientes)
const DEFAULT_PINNED_HANDLES = ['@gustavo_branndao', '@yygor02', '@niclass19', '@itsdavixavier'];

export const LiveChatView = () => {
  const { 
    conversations, 
    setConversations,
    toggleBotPause, 
    sendLiveChatMessage, 
    updateContactAvatar,
    togglePinConversation,
    channels 
  } = useApp();

  // IDs e handles de conversas que o usuário fixou (persistem mesmo com reload ou sync da Meta)
  const [pinnedKeys, setPinnedKeys] = useState(() => {
    try {
      const saved = localStorage.getItem('webflow_pinned_keys');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return new Set(parsed);
        }
      }
      const oldSaved = localStorage.getItem('webflow_pinned_ids');
      if (oldSaved) {
        const oldParsed = JSON.parse(oldSaved);
        if (Array.isArray(oldParsed) && oldParsed.length > 0) {
          return new Set([...DEFAULT_PINNED_HANDLES, ...oldParsed]);
        }
      }
    } catch (e) {}
    return new Set(DEFAULT_PINNED_HANDLES);
  });

  const [activeConvId, setActiveConvId] = useState(conversations[0]?.id || null);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pinned' | 'unread' | 'paused'
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState(null);
  const [lastSyncTime, setLastSyncTime] = useState(new Date());
  const messagesEndRef = useRef(null);
  const isFetchingRef = useRef(false);

  // Helper para verificar se uma conversa está fixada
  const isPinned = (conv) => {
    if (!conv) return false;
    if (conv.handle && pinnedKeys.has(conv.handle)) return true;
    if (conv.id && pinnedKeys.has(conv.id)) return true;
    if (conv.contactId && pinnedKeys.has(conv.contactId)) return true;
    if (conv.pinned) return true;
    return false;
  };

  // Toggle de fixar/desafixar conversa com persistência dupla (por Handle e ID)
  const togglePin = (conv) => {
    if (!conv) return;
    const handleKey = conv.handle || '';
    const idKey = conv.id || '';
    const contactIdKey = conv.contactId || '';

    setPinnedKeys(prev => {
      const next = new Set(prev);
      const currentlyPinned = isPinned(conv);
      
      if (currentlyPinned) {
        if (handleKey) next.delete(handleKey);
        if (idKey) next.delete(idKey);
        if (contactIdKey) next.delete(contactIdKey);
      } else {
        if (handleKey) next.add(handleKey);
        if (idKey) next.add(idKey);
        if (contactIdKey) next.add(contactIdKey);
      }

      try {
        localStorage.setItem('webflow_pinned_keys', JSON.stringify([...next]));
        localStorage.setItem('webflow_pinned_ids', JSON.stringify([...next]));
      } catch (e) {}
      return next;
    });

    if (togglePinConversation && conv.id) {
      togglePinConversation(conv.id);
    }
  };

  // Conversas processadas e ordenadas: fixadas sempre no topo, depois as mais recentes
  const processedConversations = useMemo(() => {
    const list = conversations.map(c => ({
      ...c,
      pinned: isPinned(c)
    }));

    list.sort((a, b) => {
      if (a.pinned !== b.pinned) return b.pinned ? 1 : -1;
      const timeA = a.updatedTime ? new Date(a.updatedTime).getTime() : 0;
      const timeB = b.updatedTime ? new Date(b.updatedTime).getTime() : 0;
      return timeB - timeA;
    });

    return list;
  }, [conversations, pinnedKeys]);

  // Conversa ativa selecionada
  const activeConv = processedConversations.find(c => c.id === activeConvId) || processedConversations[0];

  // Mantém seleção válida
  useEffect(() => {
    if (!activeConvId && processedConversations.length > 0) {
      setActiveConvId(processedConversations[0].id);
    }
  }, [processedConversations, activeConvId]);

  // Auto-scroll para última mensagem ao trocar de conversa ou receber mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages?.length, activeConvId]);

  // Contagens dinâmicas para os filtros
  const pinnedCount = useMemo(() => processedConversations.filter(c => c.pinned).length, [processedConversations]);
  const unreadCount = useMemo(() => processedConversations.filter(c => c.unread).length, [processedConversations]);
  const pausedCount = useMemo(() => processedConversations.filter(c => c.botPaused).length, [processedConversations]);

  // Lista filtrada e buscada
  const filteredConversations = useMemo(() => {
    return processedConversations.filter(c => {
      // Filtro de aba
      if (activeTab === 'pinned' && !c.pinned) return false;
      if (activeTab === 'unread' && !c.unread) return false;
      if (activeTab === 'paused' && !c.botPaused) return false;

      // Filtro de busca
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = c.contactName?.toLowerCase().includes(q);
        const matchHandle = c.handle?.toLowerCase().includes(q);
        const matchLastMsg = c.lastMessage?.toLowerCase().includes(q);
        return matchName || matchHandle || matchLastMsg;
      }
      return true;
    });
  }, [processedConversations, activeTab, searchQuery]);

  // Mesclagem idempotente para nunca perder contatos já carregados ou fixados
  const mergeConversations = (existingList, incomingList) => {
    const map = new Map();
    // 1. Adiciona os que acabaram de chegar da API
    incomingList.forEach(c => {
      if (c && c.id) map.set(c.id, c);
    });
    // 2. Preserva os contatos existentes que não estavam na página atual (especialmente fixados)
    existingList.forEach(c => {
      if (!c || !c.id) return;
      if (!map.has(c.id)) {
        const existsByHandle = incomingList.some(inc => inc.handle && inc.handle === c.handle);
        if (!existsByHandle) {
          map.set(c.id, c);
        }
      }
    });
    return Array.from(map.values());
  };

  // Sincronização ao vivo com a API da Meta (com paginação 'after' para carregar todas as 250 conversas)
  const syncConversationsLive = async (showLoading = false, cursor = null) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    
    if (showLoading) {
      if (cursor) setIsLoadingMore(true);
      else setIsSyncing(true);
    }

    try {
      const url = cursor 
        ? `/api/conversations?limit=50&after=${encodeURIComponent(cursor)}` 
        : '/api/conversations?limit=50';
      const res = await fetch(url, { cache: 'no-store' });
      const data = await res.json();
      
      if (data.success && Array.isArray(data.conversations) && data.conversations.length > 0) {
        setConversations(prev => {
          const merged = mergeConversations(prev, data.conversations);
          try {
            localStorage.setItem('webflow_conversations_v27', JSON.stringify(merged));
          } catch (e) {}
          return merged;
        });

        setNextCursor(data.nextCursor || null);
        setHasMore(Boolean(data.hasMore));
        setLastSyncTime(new Date());
      }
    } catch (e) {
      console.warn('Live sync fallback:', e);
    } finally {
      isFetchingRef.current = false;
      if (showLoading) {
        setIsSyncing(false);
        setIsLoadingMore(false);
      }
    }
  };

  // Loop de polling ao vivo a cada 5 segundos
  useEffect(() => {
    syncConversationsLive(true);
    const interval = setInterval(() => {
      syncConversationsLive(false);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = async () => {
    if (!inputText.trim() || !activeConv) return;
    const msgText = inputText.trim();
    setInputText('');

    // Dispara no AppContext local
    if (sendLiveChatMessage) {
      sendLiveChatMessage(activeConv.id, msgText);
    }

    // Dispara envio real via API da Meta direto pro Instagram do seguidor
    try {
      await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientId: activeConv.contactId, text: msgText })
      });
      setTimeout(() => syncConversationsLive(false), 800);
    } catch (e) {
      console.warn('Erro ao enviar mensagem para Meta:', e);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem-3.5rem)] md:h-[calc(100vh-4rem)] flex overflow-hidden animate-in fade-in duration-300">
      {/* Coluna Esquerda: Lista de Conversas Ao Vivo (Estilo Meta Business Suite) */}
      <aside className={`w-full md:w-80 lg:w-96 min-w-[280px] max-w-full md:max-w-[340px] lg:max-w-[380px] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex-col shrink-0 overflow-hidden ${
        mobileShowChat ? 'hidden md:flex' : 'flex'
      }`}>
        {/* Header da Caixa de Entrada */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 space-y-2.5 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessagesSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h2 className="text-sm font-bold font-heading text-slate-900 dark:text-white">
                Caixa de Entrada
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 font-bold">
                {processedConversations.length}
              </span>
            </div>

            {/* Indicador AO VIVO pulsante */}
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Ao Vivo</span>
              </span>

              <button
                onClick={() => syncConversationsLive(true)}
                disabled={isSyncing}
                className={`p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center transition-all shrink-0 ${
                  isSyncing ? 'opacity-70 cursor-wait' : ''
                }`}
                title="Sincronizar mensagens agora"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isSyncing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Campo de Busca em Tempo Real */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar seguidor (@handle, nome ou texto)..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Abas de Filtros (Todas, Fixadas, Não Lidas, Humano) */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-[11px] scrollbar-none">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-2.5 py-1 rounded-md font-semibold shrink-0 transition-colors ${
                activeTab === 'all' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Todas ({processedConversations.length})
            </button>
            <button
              onClick={() => setActiveTab('pinned')}
              className={`px-2 py-1 rounded-md font-semibold shrink-0 flex items-center gap-1 transition-colors ${
                activeTab === 'pinned' 
                  ? 'bg-amber-500 text-white shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Pin className="w-3 h-3 fill-current" />
              <span>Fixadas ({pinnedCount})</span>
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`px-2 py-1 rounded-md font-semibold shrink-0 transition-colors ${
                activeTab === 'unread' 
                  ? 'bg-rose-600 text-white shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Não lidas ({unreadCount})
            </button>
            <button
              onClick={() => setActiveTab('paused')}
              className={`px-2 py-1 rounded-md font-semibold shrink-0 transition-colors ${
                activeTab === 'paused' 
                  ? 'bg-purple-600 text-white shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Humano ({pausedCount})
            </button>
          </div>
        </div>

        {/* Lista de Conversas Ao Vivo (Ordenadas com Fixadas no Topo) */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              Nenhuma conversa encontrada neste filtro.
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const isSelected = activeConv?.id === conv.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    setActiveConvId(conv.id);
                    setMobileShowChat(true);
                  }}
                  className={`p-3 flex items-start gap-3 cursor-pointer transition-colors relative group ${
                    isSelected 
                      ? 'bg-blue-50/80 dark:bg-slate-800/90 border-l-4 border-blue-600' 
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  {/* Foto Real de Perfil Garantida */}
                  <UserAvatar
                    name={conv.contactName}
                    handle={conv.handle}
                    avatar={conv.avatar}
                    channel={conv.channel}
                    size="md"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {conv.contactName}
                        </p>
                        {conv.pinned && (
                          <span title="Conversa Fixada">
                            <Pin className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                          </span>
                        )}
                      </div>
                      {/* Horário de Brasília */}
                      <span className="text-[10px] text-slate-400 shrink-0 ml-1 font-medium">{conv.lastTime}</span>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {conv.lastMessage || 'Conversa iniciada no Instagram'}
                    </p>

                    <div className="flex items-center justify-between mt-1.5">
                      <div className="flex items-center gap-1.5">
                        {conv.botPaused ? (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                            <User className="w-2.5 h-2.5" /> Atendente Humano
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                            <Bot className="w-2.5 h-2.5" /> Robô Ativo
                          </span>
                        )}

                        {conv.unread && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
                        )}
                      </div>

                      {/* Botão de Fixar / Desafixar com 1 clique */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePin(conv);
                        }}
                        className={`p-1 rounded transition-all hover:bg-slate-200 dark:hover:bg-slate-700 shrink-0 ${
                          conv.pinned 
                            ? 'opacity-100 text-amber-500' 
                            : 'opacity-0 group-hover:opacity-100 text-slate-400 hover:text-amber-500'
                        }`}
                        title={conv.pinned ? "Desafixar conversa" : "Fixar conversa no topo"}
                      >
                        <Pin className={`w-3.5 h-3.5 ${conv.pinned ? 'fill-amber-500' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Botão de Paginação para Carregar Todas as 250+ Conversas da Meta */}
          {hasMore && (
            <div className="p-3 bg-slate-50/70 dark:bg-slate-850 text-center border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => syncConversationsLive(true, nextCursor)}
                disabled={isLoadingMore}
                className="w-full py-2 px-3 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 font-bold text-xs flex items-center justify-center gap-2 border border-blue-200 dark:border-blue-800 transition-all shadow-2xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMore ? 'animate-spin' : ''}`} />
                <span>{isLoadingMore ? 'Carregando mais conversas...' : 'Carregar mais conversas (+50)'}</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Coluna Direita: Conversa Aberta Ao Vivo */}
      {activeConv ? (
        <main className={`flex-1 min-w-0 flex-col justify-between bg-slate-50 dark:bg-slate-950 overflow-hidden ${
          mobileShowChat ? 'flex' : 'hidden md:flex'
        }`}>
          {/* Header da Conversa: Perfil Real + Ações */}
          <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-2 sm:gap-3 min-w-0 shrink-0">
            {/* Botão Voltar para lista no Mobile */}
            <button
              onClick={() => setMobileShowChat(false)}
              className="p-1.5 -ml-1 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white md:hidden transition-colors shrink-0"
              title="Voltar para a caixa de entrada"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Informações do Contato com Foto Real Garantida */}
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
              <UserAvatar
                name={activeConv.contactName}
                handle={activeConv.handle}
                avatar={activeConv.avatar}
                channel={activeConv.channel}
                size="lg"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {activeConv.contactName}
                  </h3>
                  {activeConv.pinned && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center gap-1 font-bold shrink-0">
                      <Pin className="w-2.5 h-2.5 fill-current" /> Fixada
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="truncate">
                    Canal: <strong className="text-rose-600 capitalize">{activeConv.channel}</strong> ({activeConv.handle})
                  </span>
                  <a
                    href={`https://instagram.com/${activeConv.handle.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 text-[10px] font-semibold shrink-0"
                    title="Abrir perfil no Instagram"
                  >
                    <ExternalLink className="w-2.5 h-2.5" /> Ver Perfil
                  </a>
                </div>
              </div>
            </div>

            {/* Ações de Controle: Fixar e Alternar Atendente Humano / Robô */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => togglePin(activeConv)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border shadow-xs shrink-0 cursor-pointer ${
                  activeConv.pinned 
                    ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800' 
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
                title={activeConv.pinned ? "Desafixar conversa" : "Fixar conversa no topo"}
              >
                <Pin className={`w-3.5 h-3.5 ${activeConv.pinned ? 'fill-amber-500 text-amber-500' : ''}`} />
                <span className="hidden sm:inline">{activeConv.pinned ? 'Fixada' : 'Fixar'}</span>
              </button>

              <button
                onClick={() => toggleBotPause(activeConv.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs shrink-0 whitespace-nowrap cursor-pointer ${
                  activeConv.botPaused
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
                title={activeConv.botPaused ? "Clique para reativar o robô automático" : "Clique para pausar o robô e responder manualmente"}
              >
                {activeConv.botPaused ? (
                  <>
                    <PlayCircle className="w-4 h-4 shrink-0" />
                    <span>Humano Ativo</span>
                    <span className="text-[10px] opacity-80 font-normal hidden lg:inline">(Retomar Robô)</span>
                  </>
                ) : (
                  <>
                    <PauseCircle className="w-4 h-4 shrink-0" />
                    <span>Robô Ativo</span>
                    <span className="text-[10px] opacity-80 font-normal hidden lg:inline">(Assumir Chat)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Mensagens com Balões Estilo Instagram Direct e Horário de Brasília Correto */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-3 min-w-0">
            {activeConv.messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div 
                  key={msg.id} 
                  className={`flex flex-col ${isUser ? 'items-start' : 'items-end'}`}
                >
                  <div className={`max-w-[85%] md:max-w-[70%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    isUser
                      ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-xs border border-slate-200 dark:border-slate-700 shadow-xs'
                      : msg.sender === 'bot'
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-950 dark:text-blue-100 rounded-br-xs border border-blue-200 dark:border-blue-800 shadow-xs'
                      : 'bg-blue-600 text-white rounded-br-xs shadow-xs font-medium'
                  }`}>
                    <div className="flex items-center justify-between gap-3 text-[10px] text-slate-400 mb-1">
                      <span className="font-bold flex items-center gap-1">
                        {isUser ? (
                          <span>{activeConv.handle}</span>
                        ) : msg.sender === 'bot' ? (
                          <span>🤖 WebFlow Bot Automático</span>
                        ) : (
                          <span className="flex items-center gap-1 text-blue-200">
                            <img src="/avatar_ygorweb.jpg" className="w-3.5 h-3.5 rounded-full object-cover" alt="Ygor" />
                            <span>Ygor Souza (Atendente Humano)</span>
                          </span>
                        )}
                      </span>
                      {/* Horário local formatado */}
                      <span className="font-medium">{msg.time}</span>
                    </div>
                    <p className="whitespace-pre-line">{msg.text}</p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input de Envio Humano Direto pro Instagram */}
          <div className="p-3 md:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
            {activeConv.botPaused && (
              <div className="mb-2 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-1.5 font-medium">
                <User className="w-3.5 h-3.5 shrink-0" />
                <span>Atendimento Humano Ativo — O robô está pausado. Suas mensagens são enviadas diretamente pelo @ygorweb.</span>
              </div>
            )}

            <div className="flex items-center gap-2 min-w-0">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={`Escreva uma resposta direta para ${activeConv.handle}...`}
                className="flex-1 min-w-0 px-4 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 shadow-xs"
              />
              <button
                onClick={handleSend}
                className="shrink-0 px-4 md:px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Enviar</span>
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
