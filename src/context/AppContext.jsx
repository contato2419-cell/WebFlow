import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSupabaseClient } from '../lib/supabase';

const AppContext = createContext();

// Mock inicial de fluxos predefinidos
const INITIAL_FLOWS = [
  {
    id: 'flow_01_reels_anti_ban',
    name: 'Reels: Comentário → Caixinha Anti-Ban → WhatsApp',
    channel: 'instagram',
    active: true,
    folder: 'Tráfego & Leads',
    lastModified: 'Hoje, 14:10',
    stats: { sent: 1420, openRate: '98.4%', ctr: '64.2%' },
    nodes: [
      {
        id: 'node_start',
        type: 'trigger',
        title: 'Gatilho: Comentário no Reels',
        position: { x: 50, y: 150 },
        data: {
          keyword: 'VITRIX',
          matchType: 'contains',
          antiBanJitter: 12,
          spintaxCount: 8
        }
      },
      {
        id: 'node_prompt_box',
        type: 'message',
        title: '1ª DM: Caixinha de Confirmação (Anti-Spam)',
        position: { x: 400, y: 120 },
        data: {
          text: 'Oi {{first_name}}! Vi que você comentou no vídeo querendo saber mais sobre a Vitrix. Para eu liberar o seu acesso agora, toque no botão abaixo 👇',
          buttons: [
            { id: 'b1', title: '🚀 Quero Acessar Agora', targetNode: 'node_action_tag' }
          ]
        }
      },
      {
        id: 'node_action_tag',
        type: 'action',
        title: 'Ação: Aplicar Tag & Abrir Janela 24h',
        position: { x: 750, y: 120 },
        data: {
          actions: [
            { type: 'add_tag', value: 'lead_engajado_reels' },
            { type: 'set_field', field: 'Origem', value: 'Instagram_Reels' }
          ],
          targetNode: 'node_send_link'
        }
      },
      {
        id: 'node_send_link',
        type: 'message',
        title: '2ª DM: Entrega do Link Seguro',
        position: { x: 1080, y: 120 },
        data: {
          text: 'Show! Como você confirmou, aqui está o seu acesso direto ao nosso time no WhatsApp e catálogo completo: 📲 https://wa.me/5511999998888?text=QueroMeuAcessoVitrix',
          buttons: [
            { id: 'b2', title: 'Abrir no WhatsApp', url: 'https://wa.me/5511999998888' }
          ]
        }
      }
    ],
    edges: [
      { from: 'node_start', to: 'node_prompt_box', port: 'output' },
      { from: 'node_prompt_box', to: 'node_action_tag', port: 'b1' },
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
        position: { x: 400, y: 150 },
        data: {
          text: 'Olá! Seja muito bem-vindo à Vitrix. Você já é lojista ou compra no varejo?',
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
    name: 'Reels Vitrix Alta Conversão',
    postUrl: 'https://instagram.com/p/C8x9Y12z34',
    keyword: 'VITRIX',
    matchType: 'exact',
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
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    tags: ['lead_engajado_reels', 'cliente_vip'],
    customFields: { Origem: 'Instagram_Reels', SaldoPontos: 150 },
    lastInteraction: 'Há 12 minutos',
    windowHoursRemaining: 23.8,
    status: 'active'
  },
  {
    id: 'sub_002',
    name: 'Mariana Costa',
    handle: '@mari_costa',
    channel: 'whatsapp',
    phone: '+55 21 98877-6655',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    tags: ['lojista_atacado'],
    customFields: { Estado: 'RJ', Segmento: 'Moda' },
    lastInteraction: 'Há 2 horas',
    windowHoursRemaining: 22.0,
    status: 'active'
  },
  {
    id: 'sub_003',
    name: 'Lucas Mendes',
    handle: '@lucasmendes',
    channel: 'instagram',
    phone: '+55 31 97766-5544',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop',
    tags: ['aguardando_whatsapp'],
    customFields: { Origem: 'Direct' },
    lastInteraction: 'Ontem',
    windowHoursRemaining: 4.5,
    status: 'active'
  }
];

const INITIAL_CONVERSATIONS = [
  {
    id: 'conv_01',
    contactId: 'sub_001',
    contactName: 'Ygor Souza',
    handle: '@ygorsouza',
    channel: 'instagram',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    botPaused: false,
    lastMessage: 'Show! Como você confirmou, aqui está o seu acesso direto...',
    lastTime: '14:02',
    unread: false,
    messages: [
      { id: 'm1', sender: 'user', text: 'VITRIX', time: '14:00' },
      { id: 'm2', sender: 'bot', text: 'Oi Ygor! Vi que você comentou no vídeo querendo saber mais sobre a Vitrix. Para eu liberar o seu acesso agora, toque no botão abaixo 👇', time: '14:00', button: '🚀 Quero Acessar Agora' },
      { id: 'm3', sender: 'user', text: '[Clicou em: 🚀 Quero Acessar Agora]', time: '14:01' },
      { id: 'm4', sender: 'bot', text: 'Show! Como você confirmou, aqui está o seu acesso direto ao nosso time no WhatsApp e catálogo completo: 📲 https://wa.me/5511999998888', time: '14:02' }
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
      { id: 'mw2', sender: 'bot', text: 'Olá! Seja muito bem-vindo à Vitrix. Você já é lojista ou compra no varejo?', time: '13:40' },
      { id: 'mw3', sender: 'user', text: 'Vocês vendem para pessoa jurídica com CNPJ?', time: '13:45' }
    ]
  }
];

export const AppProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState('dashboard');
  
  // Estados principais
  const [flows, setFlows] = useState(() => {
    const saved = localStorage.getItem('vitrixflow_flows');
    return saved ? JSON.parse(saved) : INITIAL_FLOWS;
  });

  const [triggers, setTriggers] = useState(() => {
    const saved = localStorage.getItem('vitrixflow_triggers');
    return saved ? JSON.parse(saved) : INITIAL_TRIGGERS;
  });

  const [contacts, setContacts] = useState(() => {
    const saved = localStorage.getItem('vitrixflow_contacts');
    return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
  });

  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('vitrixflow_conversations');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [channels, setChannels] = useState(() => {
    const saved = localStorage.getItem('vitrixflow_channels');
    return saved ? JSON.parse(saved) : {
      instagram: { connected: true, accountName: '@vitrix.oficial', pageId: '10492817481920', verified: true },
      whatsapp: { connected: true, number: '+55 (11) 99999-8888', wabaId: 'waba_99410293', verified: true },
      messenger: { connected: false, pageId: '' },
      telegram: { connected: false, botUsername: '' }
    };
  });

  const [selectedFlowId, setSelectedFlowId] = useState(flows[0]?.id || null);

  // Sincronização localStorage
  useEffect(() => {
    localStorage.setItem('vitrixflow_flows', JSON.stringify(flows));
  }, [flows]);

  useEffect(() => {
    localStorage.setItem('vitrixflow_triggers', JSON.stringify(triggers));
  }, [triggers]);

  useEffect(() => {
    localStorage.setItem('vitrixflow_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('vitrixflow_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('vitrixflow_channels', JSON.stringify(channels));
  }, [channels]);

  // Ações de Fluxos
  const updateFlow = (flowId, updatedData) => {
    setFlows(prev => prev.map(f => f.id === flowId ? { ...f, ...updatedData, lastModified: 'Agora' } : f));
  };

  const createFlow = (name, channel) => {
    const newId = 'flow_' + Date.now();
    const newFlow = {
      id: newId,
      name,
      channel: channel || 'instagram',
      active: true,
      folder: 'Geral',
      lastModified: 'Agora',
      stats: { sent: 0, openRate: '0%', ctr: '0%' },
      nodes: [
        {
          id: 'node_start',
          type: 'trigger',
          title: 'Ponto de Partida',
          position: { x: 50, y: 150 },
          data: { keyword: 'COMEÇAR' }
        },
        {
          id: 'node_msg_1',
          type: 'message',
          title: 'Primeira Mensagem',
          position: { x: 400, y: 150 },
          data: { text: 'Olá {{first_name}}! Como posso te ajudar hoje?', buttons: [] }
        }
      ],
      edges: [
        { from: 'node_start', to: 'node_msg_1', port: 'output' }
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
