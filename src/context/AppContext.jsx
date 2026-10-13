import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSupabaseClient } from '../lib/supabase';

const AppContext = createContext();

// Mock inicial de fluxos predefinidos no padrão ManyChat com Trava de Seguidor
const INITIAL_FLOWS = [
  {
    id: 'flow_01_reels_anti_ban',
    name: 'Reels: Comentário → 🔒 Trava de Seguidor → Link Seguro',
    channel: 'instagram',
    active: true,
    folder: 'Tráfego & Leads',
    lastModified: 'Hoje, 19:35',
    stats: { sent: 1420, openRate: '98.4%', ctr: '64.2%' },
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
        title: '1ª DM: 🔒 Trava de Seguidor (Exigir Follow)',
        position: { x: 400, y: 120 },
        data: {
          text: 'Oi {{first_name}}! Preparei esse material com muito carinho exclusivamente para quem me acompanha aqui no Instagram 🎁\n\nDá um pulinho no meu perfil @ygorweb, começa a me seguir e depois toca no botão abaixo pra eu te mandar agora 👇',
          buttons: [
            { id: 'b_follow', title: '✅ Já estou te seguindo!', targetNode: 'node_action_tag' }
          ],
          fallbackText: 'Opa! Vi aqui que você ainda não começou a me seguir 👀\n\nDá um pulinho lá no perfil @ygorweb rapidinho, clica em Seguir e aperta no botão de novo que eu já te libero na hora!',
          profileHandle: '@ygorweb',
          requireFollow: true
        }
      },
      {
        id: 'node_action_tag',
        type: 'action',
        title: 'Ação: Aplicar Tag & Abrir Janela 24h',
        position: { x: 790, y: 120 },
        data: {
          actions: [
            { type: 'add_tag', value: 'seguidor_confirmado' },
            { type: 'set_field', field: 'Origem', value: 'Instagram_Reels' }
          ],
          targetNode: 'node_send_link'
        }
      },
      {
        id: 'node_send_link',
        type: 'message',
        title: '2ª DM: Entrega do Link Seguro',
        position: { x: 1150, y: 120 },
        data: {
          text: 'Show de bola, {{first_name}}! Muito obrigado por acompanhar meu trabalho! 🎉 Aqui está o seu acesso direto com todos os detalhes: 📲 https://wa.me/5511999998888?text=QueroMeuAcesso',
          buttons: [
            { id: 'b2', title: '👉 Acessar Agora no WhatsApp', url: 'https://wa.me/5511999998888' }
          ]
        }
      }
    ],
    edges: [
      { from: 'node_start', to: 'node_follower_gate', port: 'output' },
      { from: 'node_follower_gate', to: 'node_action_tag', port: 'b_follow' },
      { from: 'node_action_tag', to: 'node_send_link', port: 'output' }
    ]
  },
  {
    id: 'flow_02_whatsapp_qualifier',
    name: 'WhatsApp: Qualificação Automática de Vendas',
    channel: 'whatsapp',
    active: true,
    folder: 'Vendas Diretas',
    lastModified: 'Ontem, 18:30',
    stats: { sent: 890, openRate: '99.1%', ctr: '78.5%' },
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
    totalExecutions: 1420
  }
];

const INITIAL_CONTACTS = [
  {
    id: 'sub_001',
    name: 'Ygor Souza',
    handle: '@ygorsouza',
    channel: 'instagram',
    phone: '+55 11 99999-8888',
    status: 'Seguidor Verificado',
    tags: ['lead_engajado_reels', 'seguidor_confirmado', 'vip'],
    lastInteraction: 'Hoje, 14:02',
    conversationsCount: 12
  },
  {
    id: 'sub_002',
    name: 'Mariana Costa',
    handle: '+55 21 98877-6655',
    channel: 'whatsapp',
    phone: '+55 21 98877-6655',
    status: 'Em Atendimento',
    tags: ['whatsapp_inbound', 'atacado_interessado'],
    lastInteraction: 'Hoje, 13:45',
    conversationsCount: 4
  }
];

const INITIAL_CONVERSATIONS = [
  {
    id: 'conv_01',
    contactId: 'sub_001',
    contactName: 'Ygor Souza',
    handle: '@ygorsouza',
    channel: 'instagram',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    botPaused: false,
    lastMessage: 'Show de bola, Ygor! Muito obrigado por acompanhar meu trabalho! 🎉',
    lastTime: '14:02',
    unread: false,
    messages: [
      { id: 'm1', sender: 'user', text: 'LISTA', time: '14:00' },
      { id: 'm2', sender: 'bot', text: 'Oi Ygor! Preparei esse material com muito carinho exclusivamente para quem me acompanha aqui no Instagram 🎁 Dá um pulinho no meu perfil @ygorweb, começa a me seguir e depois toca no botão abaixo pra eu te enviar na hora 👇', time: '14:00', button: '✅ Já estou te seguindo!' },
      { id: 'm3', sender: 'user', text: '[Clicou em: ✅ Já estou te seguindo!]', time: '14:01' },
      { id: 'm4', sender: 'bot', text: 'Show de bola, Ygor! Muito obrigado por acompanhar meu trabalho! 🎉 Aqui está o seu acesso direto com todos os detalhes: 📲 https://wa.me/5511999998888', time: '14:02' }
    ]
  },
  {
    id: 'conv_02',
    contactId: 'sub_002',
    contactName: 'Mariana Costa',
    handle: '+55 21 98877-6655',
    channel: 'whatsapp',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    botPaused: true,
    lastMessage: 'Vocês vendem para pessoa jurídica com CNPJ?',
    lastTime: '13:45',
    unread: true,
    messages: [
      { id: 'mw1', sender: 'user', text: 'Olá, gostaria de saber os preços de atacado', time: '13:40' },
      { id: 'mw2', sender: 'bot', text: 'Olá! Seja muito bem-vindo ao WebFlow. Você já é lojista ou compra no varejo?', time: '13:40' },
      { id: 'mw3', sender: 'user', text: 'Vocês vendem para pessoa jurídica com CNPJ?', time: '13:45' }
    ]
  }
];

export const AppProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState('flows'); // Abre diretamente no Flow Builder para fácil visualização
  
  // Tema: 'light' por padrão para a interface limpa ManyChat
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

  // Estados principais com garantia de Trava de Seguidor
  const [flows, setFlows] = useState(() => {
    const saved = localStorage.getItem('webflow_flows_v5');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.some(f => f.nodes?.some(n => n.type === 'follower_gate'))) {
          return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_FLOWS;
  });

  const [triggers, setTriggers] = useState(() => {
    const saved = localStorage.getItem('webflow_triggers_v5');
    return saved ? JSON.parse(saved) : INITIAL_TRIGGERS;
  });

  const [contacts, setContacts] = useState(() => {
    const saved = localStorage.getItem('webflow_contacts');
    return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
  });

  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('webflow_conversations_v5');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [channels, setChannels] = useState(() => {
    const saved = localStorage.getItem('webflow_channels');
    return saved ? JSON.parse(saved) : {
      instagram: { connected: false, accountName: '@ygorweb', pageId: '1299815348552748', verified: true },
      whatsapp: { connected: false, number: '', wabaId: '', verified: false },
      messenger: { connected: false, pageId: '' },
      telegram: { connected: false, botUsername: '' }
    };
  });

  const [selectedFlowId, setSelectedFlowId] = useState(flows[0]?.id || null);

  // Sincronização localStorage
  useEffect(() => {
    localStorage.setItem('webflow_flows_v5', JSON.stringify(flows));
  }, [flows]);

  useEffect(() => {
    localStorage.setItem('webflow_triggers_v5', JSON.stringify(triggers));
  }, [triggers]);

  useEffect(() => {
    localStorage.setItem('webflow_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('webflow_conversations_v5', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('webflow_channels', JSON.stringify(channels));
  }, [channels]);

  // Ações de Fluxos
  const updateFlow = (flowId, updatedData) => {
    setFlows(prev => prev.map(f => f.id === flowId ? { ...f, ...updatedData, lastModified: 'Agora' } : f));
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

  const toggleBotPause = (convId) => {
    setConversations(prev => prev.map(c => {
      if (c.id === convId) {
        return { ...c, botPaused: !c.botPaused };
      }
      return c;
    }));
  };

  const sendLiveChatMessage = (convId, text) => {
    setConversations(prev => prev.map(c => {
      if (c.id === convId) {
        const newMsg = {
          id: 'm_' + Date.now(),
          sender: 'agent',
          text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        return {
          ...c,
          lastMessage: text,
          lastTime: newMsg.time,
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    }));
  };

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
      toggleBotPause,
      sendLiveChatMessage,
      channels,
      setChannels
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
