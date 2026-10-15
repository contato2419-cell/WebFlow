import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  BookOpen, 
  Sliders, 
  MessageSquare, 
  ShieldCheck, 
  CheckCircle2, 
  Save, 
  Plus, 
  Trash2,
  Send,
  Zap,
  HelpCircle,
  AlertCircle,
  ArrowRight,
  UserCheck,
  UserX,
  RefreshCw,
  Edit2,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AiKnowledgeView = () => {
  const { channels } = useApp();

  const [aiEnabled, setAiEnabled] = useState(() => {
    return localStorage.getItem('webflow_ai_enabled') === 'true';
  });

  const [tone, setTone] = useState(() => {
    return localStorage.getItem('webflow_ai_tone') || 'friendly';
  });

  const [model, setModel] = useState('gpt-4o-mini');

  const [systemPrompt, setSystemPrompt] = useState(() => {
    return localStorage.getItem('webflow_ai_prompt') || 
      'Você é o Assistente Virtual Oficial do @ygorweb no Instagram e WhatsApp. Seu objetivo é tirar dúvidas sobre automações, links dos Reels e direcionar interessados para nossos conteúdos e serviços VIP. Seja sempre direto, humano, use emojis moderados e nunca invente links que não estão na base.';
  });

  const [handoverEnabled, setHandoverEnabled] = useState(true);

  const [faqItems, setFaqItems] = useState(() => {
    const saved = localStorage.getItem('webflow_ai_faqs_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: 'faq_1',
        question: 'Qual é o link do mousepad de 2026 citado no vídeo?',
        answer: 'O mousepad oficial de 2026 está no link seguro da TikTok Shop: https://vt.tiktok.com/ZS9UR1CkPgovL-hgiWV/'
      },
      {
        id: 'faq_2',
        question: 'Como entro no grupo VIP de networking?',
        answer: 'O grupo oficial de networking no WhatsApp pode ser acessado aqui: https://chat.whatsapp.com/DEkEzthpu8ODOjRhyLYPWS'
      },
      {
        id: 'faq_3',
        question: 'Como funciona a mentoria e criação de automações?',
        answer: 'Trabalhamos com implementação personalizada de automações anti-ban para Instagram e WhatsApp. Chame no direct @ygorweb para agendar um diagnóstico!'
      },
      {
        id: 'faq_4',
        question: 'Por que preciso seguir o perfil para liberar o link?',
        answer: 'Nossos materiais e links exclusivos são reservados para nossa comunidade de seguidores. Assim que você segue o @ygorweb, nosso sistema valida e libera na hora!'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('webflow_ai_enabled', aiEnabled);
    localStorage.setItem('webflow_ai_tone', tone);
    localStorage.setItem('webflow_ai_prompt', systemPrompt);
    localStorage.setItem('webflow_ai_faqs_v3', JSON.stringify(faqItems));
  }, [aiEnabled, tone, systemPrompt, faqItems]);

  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [editingFaqId, setEditingFaqId] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Test Playground
  const [testInput, setTestInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { 
      role: 'assistant', 
      text: 'Olá! Sou o Assistente de IA treinado na sua base de conhecimento. Faça qualquer pergunta ou clique nas sugestões abaixo para ver como responderei aos seus seguidores:' 
    }
  ]);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleAddFaq = (e) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    if (editingFaqId) {
      setFaqItems(faqItems.map(f => f.id === editingFaqId ? { ...f, question: newQuestion, answer: newAnswer } : f));
      setEditingFaqId(null);
    } else {
      setFaqItems([
        ...faqItems,
        { id: 'faq_' + Date.now(), question: newQuestion, answer: newAnswer }
      ]);
    }

    setNewQuestion('');
    setNewAnswer('');
    triggerSaveSuccess();
  };

  const handleEditFaq = (faq) => {
    setEditingFaqId(faq.id);
    setNewQuestion(faq.question);
    setNewAnswer(faq.answer);
  };

  const handleDeleteFaq = (id) => {
    setFaqItems(faqItems.filter(f => f.id !== id));
    triggerSaveSuccess();
  };

  const triggerSaveSuccess = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const generateAnswer = (userMsg) => {
    const lower = userMsg.toLowerCase().trim();

    // 1. Verificação de Pedido de Atendimento Humano
    if (lower.includes('humano') || lower.includes('atendente') || lower.includes('falar com alguém') || lower.includes('pessoa real')) {
      return {
        text: 'Entendido! Estou pausando a automação e transferindo seu chamado para um especialista humano da nossa equipe no Live Chat. Em instantes alguém vai te responder por aqui! 🔔',
        isHandover: true
      };
    }

    // 2. Busca Semântica / Palavras-chave na Base de Conhecimento
    const matchedFaq = faqItems.find(f => {
      const qLower = f.question.toLowerCase();
      // Match por termos chave
      if (lower.includes('mousepad') && qLower.includes('mousepad')) return true;
      if ((lower.includes('grupo') || lower.includes('networking')) && (qLower.includes('grupo') || qLower.includes('networking'))) return true;
      if ((lower.includes('mentoria') || lower.includes('serviço') || lower.includes('automação')) && qLower.includes('mentoria')) return true;
      if (lower.includes('seguir') && qLower.includes('seguir')) return true;
      
      // Match de palavras comuns
      const words = lower.split(' ').filter(w => w.length > 3);
      return words.some(w => qLower.includes(w));
    });

    if (matchedFaq) {
      if (tone === 'friendly') {
        return { text: `${matchedFaq.answer} Se precisar de mais alguma coisa, só me avisar aqui! 😉`, isHandover: false };
      } else if (tone === 'professional') {
        return { text: `Prezado(a), informamos que: ${matchedFaq.answer}`, isHandover: false };
      } else if (tone === 'direct') {
        return { text: matchedFaq.answer, isHandover: false };
      } else {
        return { text: `Com certeza! 🚀 ${matchedFaq.answer} Aproveite muito! 💥`, isHandover: false };
      }
    }

    // 3. Fallback inteligente quando a pergunta não está na base
    if (handoverEnabled) {
      return {
        text: 'Não encontrei uma resposta exata para essa dúvida na minha base de conhecimento oficial. Para não te passar nenhuma informação errada, já notifiquei a equipe no Live Chat para te responder pessoalmente! 🤝',
        isHandover: true
      };
    } else {
      return {
        text: 'Opa! No momento não tenho essa informação cadastrada na minha base. Dá uma conferida nos posts fixados do perfil @ygorweb ou mande sua dúvida detalhada para nossa equipe!',
        isHandover: false
      };
    }
  };

  const handleSendTestMessage = (textToSend) => {
    const msg = (textToSend || testInput).trim();
    if (!msg || isSimulating) return;

    setChatMessages(prev => [...prev, { role: 'user', text: msg }]);
    if (!textToSend) setTestInput('');
    setIsSimulating(true);

    setTimeout(() => {
      const result = generateAnswer(msg);
      setChatMessages(prev => [...prev, { 
        role: 'assistant', 
        text: result.text,
        isHandover: result.isHandover
      }]);
      setIsSimulating(false);
    }, 700);
  };

  return (
    <div className="p-3 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Engenharia Reversa REA ManyChat AI
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
              RAG & Human Handover
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Base de Conhecimento & Assistente de IA
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Responda automaticamente a dúvidas abertas no Instagram Direct usando a inteligência do seu negócio, sem perder o controle humano.
          </p>
        </div>

        <button
          onClick={triggerSaveSuccess}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm transition-all shadow-md shadow-blue-500/20 active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>Salvar Configurações de IA</span>
        </button>
      </div>

      {/* REA Architecture Explanation Card (Como Funciona na Prática) */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-900 dark:text-blue-200 font-bold text-xs uppercase tracking-wide">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Como o Motor de IA do ManyChat Funciona (Arquitetura REA)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Ativar IA no Direct:</span>
            <button
              onClick={() => {
                setAiEnabled(!aiEnabled);
                triggerSaveSuccess();
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                aiEnabled ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 'bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${aiEnabled ? 'bg-white animate-pulse' : 'bg-slate-400'}`}></span>
              <span>{aiEnabled ? 'IA Ligada no Direct' : 'IA Desligada'}</span>
            </button>
          </div>
        </div>

        {/* 4-Step Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700 text-xs space-y-1">
            <span className="font-bold text-blue-600 dark:text-blue-400 block">1. Mensagem Aberta</span>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              O seguidor envia uma dúvida no Instagram que não é palavra-chave de Reels (ex: "tem cupom?", "quanto custa?").
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700 text-xs space-y-1">
            <span className="font-bold text-purple-600 dark:text-purple-400 block">2. Consulta RAG</span>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              O motor consulta a Base de Perguntas Frequentes (FAQ) e o Prompt de Personalidade da marca.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700 text-xs space-y-1">
            <span className="font-bold text-emerald-600 dark:text-emerald-400 block">3. Resposta Humanizada</span>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              A resposta é gerada em tempo real com o tom de voz escolhido e enviada direto no Direct do seguidor.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700 text-xs space-y-1">
            <span className="font-bold text-amber-600 dark:text-amber-400 block">4. Human Takeover</span>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Se a IA não tiver a resposta ou o usuário pedir um humano, o bot pausa e chama você no Live Chat!
            </p>
          </div>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Configurações salvas e sincronizadas com sucesso!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Instructions and FAQs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Persona & Tone */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>Personalidade & Tom de Voz</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Tom de Conversa
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-blue-500 font-semibold"
                >
                  <option value="friendly">Amigável & Empático (Recomendado)</option>
                  <option value="professional">Profissional & Corporativo</option>
                  <option value="direct">Curto & Direto ao Ponto</option>
                  <option value="enthusiastic">Descontraído & Entusiasta</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                  Modelo de IA Subjacente
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-blue-500 font-semibold"
                >
                  <option value="gpt-4o-mini">OpenAI GPT-4o Mini (Ultra-rápido / Custo zero)</option>
                  <option value="gpt-4o">OpenAI GPT-4o (Máxima precisão analítica)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Prompt Mestre (Instruções Globais do Sistema)
              </label>
              <textarea
                rows={4}
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-blue-500 font-mono leading-relaxed"
              />
            </div>

            {/* Handover Toggle */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Transferir para Atendimento Humano (Takeover)
                </span>
                <p className="text-[11px] text-slate-400">
                  Pausa o robô e sinaliza no Live Chat quando o seguidor fizer perguntas fora da base.
                </p>
              </div>
              <input
                type="checkbox"
                checked={handoverEnabled}
                onChange={(e) => setHandoverEnabled(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* FAQ Knowledge Base CRUD */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                <BookOpen className="w-4 h-4 text-amber-500" />
                <span>Base de Conhecimento (Perguntas & Respostas Frequentes)</span>
              </div>
              <span className="text-xs text-slate-400 font-medium">{faqItems.length} itens cadastrados</span>
            </div>

            {/* List */}
            <div className="space-y-3">
              {faqItems.map(f => (
                <div key={f.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-start justify-between gap-3 group">
                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-slate-900 dark:text-white">Q: {f.question}</p>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">R: {f.answer}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleEditFaq(f)}
                      className="text-slate-400 hover:text-blue-500 transition-colors p-1"
                      title="Editar este conhecimento"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteFaq(f.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                      title="Excluir este conhecimento"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add/Edit FAQ form */}
            <form onSubmit={handleAddFaq} className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  {editingFaqId ? '✏️ Editando Conhecimento Selecionado' : '➕ Adicionar Novo Conhecimento à Base'}
                </span>
                {editingFaqId && (
                  <button
                    type="button"
                    onClick={() => { setEditingFaqId(null); setNewQuestion(''); setNewAnswer(''); }}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Cancelar Edição
                  </button>
                )}
              </div>
              <input
                type="text"
                placeholder="Ex: Como comprar no atacado?"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-blue-500"
              />
              <textarea
                rows={2}
                placeholder="Ex: Para comprar no atacado, nosso pedido mínimo é de R$ 500,00..."
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {editingFaqId ? <Check className="w-3.5 h-3.5 text-blue-600" /> : <Plus className="w-3.5 h-3.5" />}
                <span>{editingFaqId ? 'Atualizar Conhecimento' : 'Salvar Item no FAQ'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right: Live Interactive Simulator */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col h-[700px]">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Simulador em Tempo Real</h3>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                aiEnabled ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-600'
              }`}>
                {aiEnabled ? '🟢 Ativo no Direct' : '⚪ Modo Teste'}
              </span>
            </div>

            {/* Sugestões de Teste Rápidas */}
            <div className="mb-3 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Clique para simular pergunta de seguidor:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => handleSendTestMessage('Qual o link do mousepad de 2026?')}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-300 text-[11px] font-semibold transition-colors"
                >
                  Link do mousepad?
                </button>
                <button
                  onClick={() => handleSendTestMessage('Como entro no grupo VIP de networking?')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-600 dark:text-emerald-300 text-[11px] font-semibold transition-colors"
                >
                  Grupo de networking?
                </button>
                <button
                  onClick={() => handleSendTestMessage('Quero falar com uma pessoa real')}
                  className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 text-purple-600 dark:text-purple-300 text-[11px] font-semibold transition-colors"
                >
                  Falar com humano
                </button>
              </div>
            </div>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-xs'
                        : msg.isHandover
                        ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800 rounded-bl-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-xs border border-slate-200/50 dark:border-slate-700/50'
                    }`}
                  >
                    {msg.isHandover && (
                      <div className="flex items-center gap-1.5 font-bold text-[11px] text-amber-700 dark:text-amber-300 mb-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Protocolo de Atendimento Humano Acionado</span>
                      </div>
                    )}
                    {msg.text}
                  </div>
                </div>
              ))}
              {isSimulating && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl rounded-bl-xs text-xs text-slate-400 animate-pulse">
                    Consultando Base de Conhecimento e gerando resposta...
                  </div>
                </div>
              )}
            </div>

            {/* Input bar */}
            <form onSubmit={(e) => { e.preventDefault(); handleSendTestMessage(); }} className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <input
                type="text"
                placeholder="Pergunte algo sobre mousepad, link, networking ou teste..."
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                disabled={isSimulating}
                className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AiKnowledgeView;
