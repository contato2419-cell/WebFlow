import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getSupabaseClient } from '../lib/supabase';
import { INITIAL_CONVERSATIONS, INITIAL_CONTACTS } from '../data/initialConversations';

const AppContext = createContext();

// Fluxos oficiais sincronizados com métricas reais dos canais conectados
const INITIAL_FLOWS = [
  {
    id: 'flow_01_reels_anti_ban',
    name: 'Reels: Comentário → Convite Seguidor → Link Seguro',
    channel: 'instagram',
    active: true,
    folder: 'Tráfego & Leads',
    lastModified: 'Hoje, 11:20',
    stats: { sent: 26, openRate: '100%', ctr: '63.3%' },
    nodes: [
      {
        id: 'node_start',
        type: 'trigger',
        title: 'Gatilho: Comentário no Reels',
        position: { x: 50, y: 150 },
        data: {
          keyword: 'LISTA',
          matchType: 'contains',
          antiBanJitter: 12,
          spintaxCount: 8
        }
      },
      {
        id: 'node_follower_gate',
        type: 'follower_gate',
        title: '1ª DM: Convite & Botão Seguidor',
        position: { x: 420, y: 150 },
        data: {
          text: 'Me segue ai pra min te enviar ingrato(a) Tô postando video assim toda semana 🚀\n\nDá um pulinho no meu perfil @ygorweb, começa a me seguir e depois toca no botão abaixo pra eu te mandar agora 👇',
          buttons: [
            { id: 'b_follow', title: '✅ Já estou te seguindo!', targetNode: 'node_send_link' }
          ],
          fallbackText: 'Opa! Vi aqui que você ainda não começou a me seguir 👀\n\nDá um pulinho lá no perfil @ygorweb rapidinho, clica em Seguir e aperta no botão de novo que eu já te libero na hora!',
          profileHandle: '@ygorweb',
          requireFollow: true
        }
      },
      {
        id: 'node_send_link',
        type: 'message',
        title: '2ª DM: Entrega do Link Seguro',
        position: { x: 820, y: 150 },
        data: {
          text: 'Tá na mão🚀 \nhttps://x.com/Ithielix/status/2109527114760208745\n\nLink do melhor mousepad de 2026 🏆\nhttps://vt.tiktok.com/ZS9UR1CkPgovL-hgiWV/',
          buttons: [
            { id: 'b2', title: '👉 Acessar no X / Twitter', url: 'https://x.com/Ithielix/status/2109527114760208745' },
            { id: 'b3', title: '🏆 Link do Mousepad 2026', url: 'https://vt.tiktok.com/ZS9UR1CkPgovL-hgiWV/' }
          ]
        }
      }
    ],
    edges: [
      { from: 'node_start', to: 'node_follower_gate', port: 'output' },
      { from: 'node_follower_gate', to: 'node_send_link', port: 'b_follow' }
    ]
  },
  {
    id: 'flow_02_whatsapp_qualifier',
    name: 'WhatsApp: Qualificação Automática de Vendas',
    channel: 'whatsapp',
    active: false,
    folder: 'Vendas Diretas',
    lastModified: 'Aguardando Conexão',
    stats: { sent: 0, openRate: '0%', ctr: '0%' },
    nodes: [
      {
        id: 'node_w_start',
        type: 'trigger',
        title: 'Gatilho: Nova Mensagem no WhatsApp',
        position: { x: 50, y: 150 },
        data: { keyword: 'CATALOGO' }
      },
      {
        id: 'node_w_msg',
        type: 'message',
        title: 'Boas-vindas & Pergunta',
        position: { x: 420, y: 150 },
        data: {
          text: 'Olá! Seja muito bem-vindo ao WebFlow. Você já é lojista ou compra no varejo?',
          buttons: [
            { id: 'bw1', title: 'Sou Lojista (Atacado)', targetNode: 'node_w_atacado' },
            { id: 'bw2', title: 'Compro Varejo', targetNode: 'node_w_varejo' }
          ]
        }
      }
    ],
    edges: [
      { from: 'node_w_start', to: 'node_w_msg', port: 'output' }
    ]
  }
];

const INITIAL_TRIGGERS = [
  {
    id: 'trig_01',
    name: 'Reels: Entrega de Material Exclusivo',
    postUrl: 'https://instagram.com/p/C8x9Y12z34',
    keyword: 'LISTA',
    matchType: 'contains',
    channel: 'instagram',
    active: true,
    delaySeconds: 15,
    publicReplies: [
      'Acabei de te enviar no direct! Dá uma olhada 🚀',
      'Prontinho, já mandei lá nas suas mensagens ✨',
      'Dá uma olhadinha no seu direct, preparei tudo pra você! 📩',
      'Enviado com sucesso! Confere lá nas mensagens privadas 😉',
      'Te chamei no direct com todos os detalhes! 📲',
      'Chegou aí? Acabei de te mandar lá no chat 💥',
      'Informações enviadas! Confere a sua caixa de entrada 📥',
      'Mandei lá no direct, aproveita! 🎯'
    ],
    flowId: 'flow_01_reels_anti_ban',
    totalExecutions: 26
  }
];

export const AppProvider = ({ children }) => {
  const [currentView, setCurrentViewState] = useState('flows');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const setCurrentView = (view) => {
    setCurrentViewState(view);
    setIsMobileMenuOpen(false);
  };
  
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('webflow_theme') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('webflow_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Limpa nós indesejados e sincroniza métricas reais
  const cleanFlows = (flowList) => {
    return flowList.map(flow => {
      if (flow.id === 'flow_01_reels_anti_ban') {
        const cleanedNodes = flow.nodes.filter(n => n.id !== 'node_action_tag' && n.type !== 'action');
        const cleanedEdges = [
          { from: 'node_start', to: 'node_follower_gate', port: 'output' },
          { from: 'node_follower_gate', to: 'node_send_link', port: 'b_follow' }
        ];
        return {
          ...flow,
          name: 'Reels: Comentário → Convite Seguidor → Link Seguro',
          stats: { sent: 26, openRate: '100%', ctr: '63.3%' },
          nodes: cleanedNodes,
          edges: cleanedEdges
        };
      }
      if (flow.channel === 'whatsapp') {
        return {
          ...flow,
          active: false,
          stats: { sent: 0, openRate: '0%', ctr: '0%' }
        };
      }
      return flow;
    });
  };

  const [flows, setFlows] = useState(() => {
    const saved = localStorage.getItem('webflow_flows_v9');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return cleanFlows(parsed);
      } catch (e) {}
    }
    return INITIAL_FLOWS;
  });

  const [triggers, setTriggers] = useState(() => {
    const saved = localStorage.getItem('webflow_triggers_v6');
    return saved ? JSON.parse(saved) : INITIAL_TRIGGERS;
  });

  const [contacts, setContacts] = useState(() => {
    const saved = localStorage.getItem('webflow_contacts_v10');
    return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
  });

  const [conversations, setConversations] = useState(() => {
    // Limpeza de versões anteriores com dados mockados
    try {
      localStorage.removeItem('webflow_conversations_v20');
      localStorage.removeItem('webflow_conversations_v21');
      localStorage.removeItem('webflow_conversations_v22');
      localStorage.removeItem('webflow_conversations_v25');
    } catch (e) {}

    const saved = localStorage.getItem('webflow_conversations_v26');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && !parsed.some(c => c.handle === '@aa_santana_')) {
          return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_CONVERSATIONS;
  });

  const [channels, setChannels] = useState(() => {
    const saved = localStorage.getItem('webflow_channels_v2');
    return saved ? JSON.parse(saved) : {
      instagram: { 
        connected: true, 
        accountName: '@ygorweb', 
        pageId: '1299815346552748', 
        verified: true,
        avatar: '/avatar_ygorweb.jpg',
        token: 'EAAdPoo2JfNUBSrpDVADHAZBWNClCWCaLngml0bbTRS5dv0I8RX4jceRChZBi3pZBkg6xmr3MIfMQSTvvMMLJG8RP4lfn97w2M0xZAbdWFA9BETDkfzfjP3MMlO1eoIMAehygJsCdinlt1g2w1Vqx3lZBnb0ZBmHUti2plKKatMZClKW2SIKL3jGwXOwipcvk65pZCHHbK0dB'
      },
      whatsapp: { connected: false, number: '', wabaId: '', verified: false },
      messenger: { connected: false, pageId: '' },
      telegram: { connected: false, botUsername: '' }
    };
  });

  const [selectedFlowId, setSelectedFlowId] = useState(() => {
    return localStorage.getItem('webflow_selected_flow_id') || 'flow_01_reels_anti_ban';
  });

  useEffect(() => {
    if (selectedFlowId) {
      localStorage.setItem('webflow_selected_flow_id', selectedFlowId);
    }
  }, [selectedFlowId]);

  const isInitialSyncDone = useRef(false);

  // Sincronização com o Backend KV da Cloudflare (Kill-Switch em tempo real)
  const syncFlowToBackend = async (flowsList) => {
    try {
      const instaFlow = flowsList.find(f => f.channel === 'instagram');
      const is_active = Boolean(instaFlow?.active);

      const triggerNode = instaFlow?.nodes?.find(n => n.type === 'trigger');
      const gateNode = instaFlow?.nodes?.find(n => n.type === 'follower_gate');
      const linkNode = instaFlow?.nodes?.find(n => n.type === 'message' || n.id === 'node_send_link');

      const keyword = triggerNode?.data?.keyword || 'LISTA';
      const delaySeconds = triggerNode?.data?.delaySeconds || 15;
      const antiBanJitter = triggerNode?.data?.antiBanJitter || 8;
      const firstDmTitle = gateNode?.data?.title || "Me segue ai pra min te enviar ingrato(a) 🚀";
      const firstDmSubtitle = gateNode?.data?.subtitle || "Tô postando vídeo assim toda semana! Clica no botão abaixo pra liberar seu link 👇";
      const buttonText = gateNode?.data?.buttons?.[0]?.title || "✅ Já estou te seguindo!";
      const finalLinkMessage = linkNode?.data?.text || `Tá na mão🚀 \nhttps://x.com/Ithielix/status/2109527114760208745\n\nLink do melhor mousepad de 2026 🏆\nhttps://vt.tiktok.com/ZS9UR1CkPgovL-hgiWV/`;

      await fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_active,
          keyword,
          delaySeconds,
          antiBanJitter,
          firstDmTitle,
          firstDmSubtitle,
          buttonText,
          finalLinkMessage
        })
      });
    } catch (e) {
      console.warn('Erro ao sincronizar com KV:', e);
    }
  };

  // Carrega o estado de ativação do Backend KV e as conversas reais da Meta ao inicializar
  useEffect(() => {
    fetch('/api/state', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        if (data.success && data.state && typeof data.state.is_active === 'boolean') {
          setFlows(prev => {
            const updated = prev.map(f => {
              if (f.channel === 'instagram') {
                return { ...f, active: data.state.is_active };
              }
              return f;
            });
            try {
              localStorage.setItem('webflow_flows_v9', JSON.stringify(updated));
            } catch (e) {}
            return updated;
          });
        }
      })
      .catch(err => console.warn('Erro ao carregar /api/state:', err))
      .finally(() => {
        isInitialSyncDone.current = true;
      });

    // Sincroniza conversas reais da Meta API em background
    fetch('/api/conversations', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        if (data.success && data.conversations && data.conversations.length > 0) {
          setConversations(data.conversations);
          try {
            localStorage.setItem('webflow_conversations_v26', JSON.stringify(data.conversations));
          } catch (e) {}
        }
      })
      .catch(() => {});
  }, []);

  // Sincronização localStorage com debounce para não travar o drag dos nós
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('webflow_flows_v9', JSON.stringify(flows));
      // Só dispara sincronização automática com a Cloudflare se o carregamento inicial já foi concluído!
      if (isInitialSyncDone.current) {
        syncFlowToBackend(flows);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [flows]);

  useEffect(() => {
    localStorage.setItem('webflow_triggers_v6', JSON.stringify(triggers));
  }, [triggers]);

  useEffect(() => {
    localStorage.setItem('webflow_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('webflow_conversations_v26', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('webflow_channels', JSON.stringify(channels));
  }, [channels]);

  // Ações do Live Chat Humano (Meta Business Suite Architecture)
  const toggleBotPause = (conversationId) => {
    setConversations(prev => {
      const updated = prev.map(c => {
        if (c.id === conversationId || c.contactId === conversationId) {
          return { ...c, botPaused: !c.botPaused };
        }
        return c;
      });
      try {
        localStorage.setItem('webflow_conversations_v26', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const sendLiveChatMessage = (conversationId, text) => {
    if (!text || !text.trim()) return;
    const nowBr = new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      id: 'live_msg_' + Date.now(),
      sender: 'agent',
      text: text.trim(),
      time: nowBr,
      timestamp: new Date().toISOString()
    };

    setConversations(prev => {
      const updated = prev.map(c => {
        if (c.id === conversationId || c.contactId === conversationId) {
          return {
            ...c,
            lastMessage: text.trim(),
            lastTime: nowBr,
            updatedTime: new Date().toISOString(),
            messages: [...(c.messages || []), newMsg]
          };
        }
        return c;
      });
      try {
        localStorage.setItem('webflow_conversations_v26', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const updateContactAvatar = (conversationId, avatarUrl) => {
    setConversations(prev => {
      const updated = prev.map(c => {
        if (c.id === conversationId || c.contactId === conversationId) {
          return { ...c, avatar: avatarUrl };
        }
        return c;
      });
      try {
        localStorage.setItem('webflow_conversations_v26', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const togglePinConversation = (conversationId) => {
    setConversations(prev => {
      const updated = prev.map(c => {
        if (c.id === conversationId || c.contactId === conversationId) {
          return { ...c, pinned: !c.pinned };
        }
        return c;
      });
      try {
        localStorage.setItem('webflow_conversations_v26', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };


  // Ações de Fluxos
  const updateFlow = async (flowId, updatedData) => {
    setFlows(prev => {
      const updated = prev.map(f => f.id === flowId ? { ...f, ...updatedData, lastModified: 'Agora' } : f);
      try {
        localStorage.setItem('webflow_flows_v9', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    if (updatedData.active !== undefined) {
      isInitialSyncDone.current = true;
      const nextFlows = flows.map(f => f.id === flowId ? { ...f, ...updatedData } : f);
      await syncFlowToBackend(nextFlows);
    }
  };

  const createFlow = (name, channel) => {
    const newId = 'flow_' + Date.now();
    const newFlow = {
      id: newId,
      name: name || 'Novo Fluxo com Trava de Seguidor',
      channel: channel || 'instagram',
      active: true,
      folder: 'Geral',
      lastModified: 'Agora',
      stats: { sent: 0, openRate: '0%', ctr: '0%' },
      nodes: [
        {
          id: 'node_start',
          type: 'trigger',
          title: 'Gatilho: Comentário no Reel',
          position: { x: 50, y: 150 },
          data: { keyword: 'LISTA' }
        },
        {
          id: 'node_follower_gate',
          type: 'follower_gate',
          title: '1ª DM: 🔒 Trava de Seguidor',
          position: { x: 420, y: 150 },
          data: {
            text: 'Oi {{first_name}}! Preparei esse material exclusivamente para quem me segue aqui no Instagram 🎁 Dá uma olhada no perfil @ygorweb, começa a me seguir e clica no botão abaixo pra liberar 👇',
            buttons: [{ id: 'b_f', title: '✅ Já estou te seguindo!', targetNode: '' }]
          }
        }
      ],
      edges: [
        { from: 'node_start', to: 'node_follower_gate', port: 'output' }
      ]
    };
    setFlows(prev => [newFlow, ...prev]);
    setSelectedFlowId(newId);
    return newId;
  };

  const [isRunningAutomation, setIsRunningAutomation] = useState(false);
  const [automationStatus, setAutomationStatus] = useState('');

  // Motor Oficial: Processa comentários reais nos Reels do Instagram e dispara DMs e respostas públicas
  const processLiveAutomation = async () => {
    try {
      const activeFlow = flows.find(f => f.channel === 'instagram' && f.active);
      if (!activeFlow) {
        setAutomationStatus('Automação do Instagram desligada.');
        setTimeout(() => setAutomationStatus(''), 2500);
        return;
      }

      setIsRunningAutomation(true);
      setAutomationStatus('Buscando novos comentários no Reel...');
      
      const triggerNode = activeFlow?.nodes?.find(n => n.type === 'trigger');
      const gateNode = activeFlow?.nodes?.find(n => n.type === 'follower_gate');
      const linkNode = activeFlow?.nodes?.find(n => n.type === 'message' || n.id === 'node_send_link');

      const keyword = triggerNode?.data?.keyword || 'LISTA';
      const delaySeconds = triggerNode?.data?.delaySeconds || 15;
      const antiBanJitter = triggerNode?.data?.antiBanJitter || 8;
      const firstDmTitle = gateNode?.data?.title || "Me segue ai pra min te enviar ingrato(a) 🚀";
      const firstDmSubtitle = gateNode?.data?.subtitle || "Tô postando vídeo assim toda semana! Clica no botão abaixo pra liberar seu link 👇";
      const buttonText = gateNode?.data?.buttons?.[0]?.title || "✅ Já estou te seguindo!";
      const finalLinkMessage = linkNode?.data?.text || `Tá na mão🚀 \nhttps://x.com/Ithielix/status/2109527114760208745\n\nLink do melhor mousepad de 2026 🏆\nhttps://vt.tiktok.com/ZS9UR1CkPgovL-hgiWV/`;

      const res = await fetch('/api/auto-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          is_active: true,
          keyword, 
          firstDmTitle,
          firstDmSubtitle,
          buttonText,
          finalLinkMessage, 
          delaySeconds, 
          antiBanJitter 
        })
      });
      const data = await res.json();
      
      if (data.success) {
        if (data.processedCount > 0) {
          setAutomationStatus(`✅ ${data.processedCount} lead(s) processados com delay anti-ban!`);
          // Incrementa contagem de envios
          setFlows(prev => prev.map(f => f.id === activeFlow.id ? {
            ...f,
            stats: { ...f.stats, sent: (f.stats?.sent || 0) + data.processedCount }
          } : f));
        } else if (data.skipped?.length > 0 && data.skipped.some(s => s.reason === 'waiting_human_delay')) {
          setAutomationStatus('⏳ Aguardando delay humano anti-ban para novos comentários...');
        } else {
          setAutomationStatus('Nenhum novo comentário pendente no momento.');
        }
      } else {
        setAutomationStatus('Automação pausada ou em espera.');
      }
      return data;
    } catch (e) {
      console.warn('Erro ao processar automação:', e);
      setAutomationStatus('Conexão ativa');
    } finally {
      setIsRunningAutomation(false);
      setTimeout(() => setAutomationStatus(''), 4000);
    }
  };

  // Loop inteligente de vigilância em tempo real (apenas se a automação do Instagram estiver ligada)
  useEffect(() => {
    const isInstaActive = flows.some(f => f.channel === 'instagram' && f.active);
    if (!isInstaActive) return;

    // Dispara uma verificação inicial
    processLiveAutomation();

    // Loop espaçado a cada 60 segundos para evitar sobrecarga
    const timer = setInterval(() => {
      processLiveAutomation();
    }, 60000);

    return () => clearInterval(timer);
  }, [flows.find(f => f.channel === 'instagram')?.active]);

  return (
    <AppContext.Provider value={{
      currentView,
      setCurrentView,
      theme,
      setTheme,
      toggleTheme,
      flows,
      selectedFlowId,
      setSelectedFlowId,
      updateFlow,
      createFlow,
      triggers,
      setTriggers,
      contacts,
      setContacts,
      conversations,
      setConversations,
      togglePinConversation,
      updateContactAvatar,
      toggleBotPause,
      sendLiveChatMessage,
      channels,
      setChannels,
      processLiveAutomation,
      isRunningAutomation,
      automationStatus,
      isMobileMenuOpen,
      setIsMobileMenuOpen
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
