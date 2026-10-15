import React, { useState, useEffect } from 'react';
import { 
  GitCommit, 
  Clock, 
  Plus, 
  Sparkles, 
  Tag, 
  CheckCircle2, 
  Power, 
  Layers, 
  ChevronRight,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Edit2,
  Trash2,
  Save,
  X,
  MessageSquare,
  Link2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SequencesView = () => {
  const { channels, contacts, setCurrentView } = useApp();
  const isWhatsappConnected = Boolean(channels.whatsapp?.connected);

  const [sequences, setSequences] = useState(() => {
    const saved = localStorage.getItem('webflow_real_sequences_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: 'seq_01',
        title: 'Nutrição Drip: Pós-Comentário Reel (3 Passos)',
        channel: 'instagram',
        active: true,
        subscribersCount: 0,
        steps: [
          {
            id: 'step_1',
            delay: 'Imediatamente',
            title: 'Passo 1: Entrega do Link Seguro + Trava de Seguidor',
            messageText: 'Me segue ai pra min te enviar ingrato(a) 🚀 Dá um pulinho lá no perfil @ygorweb, começa a me seguir e clica no botão abaixo:',
            buttonTitle: '✅ Já estou te seguindo!',
            buttonUrl: '',
            active: true,
            sent: 0,
            openRate: '-',
            ctr: '-'
          },
          {
            id: 'step_2',
            delay: 'Após 24 horas (Dentro da Janela Meta)',
            title: 'Passo 2: Pergunta de Acompanhamento ("Conseguiu abrir o material?")',
            messageText: 'Fala {{first_name}}! Conseguiu conferir o link que te mandei ontem? Qualquer dúvida sobre a configuração é só mandar aqui!',
            buttonTitle: '👉 Acessar de novo',
            buttonUrl: 'https://vt.tiktok.com/ZS9UR1CkPgovL-hgiWV/',
            active: true,
            sent: 0,
            openRate: '-',
            ctr: '-'
          },
          {
            id: 'step_3',
            delay: 'Após 48 horas',
            title: 'Passo 3: Acesso ao Grupo VIP de Networking',
            messageText: 'Liberei mais 5 vagas para o nosso grupo de networking exclusivo no WhatsApp! Entra lá:',
            buttonTitle: '📲 Entrar no Grupo VIP',
            buttonUrl: 'https://chat.whatsapp.com/DEkEzthpu8ODOjRhyLYPWS',
            active: false,
            sent: 0,
            openRate: '-',
            ctr: '-'
          }
        ]
      },
      {
        id: 'seq_02',
        title: 'Boas-Vindas Lojistas (WhatsApp)',
        channel: 'whatsapp',
        active: false,
        subscribersCount: 0,
        steps: [
          {
            id: 'step_w1',
            delay: 'Imediatamente',
            title: 'Catálogo de Produtos em PDF',
            messageText: 'Olá! Seja muito bem-vindo ao nosso atendimento via WhatsApp. Aqui está nosso catálogo em PDF:',
            buttonTitle: '📥 Baixar Catálogo',
            buttonUrl: 'https://seusite.com/catalogo.pdf',
            active: false,
            sent: 0,
            openRate: '-',
            ctr: '-'
          }
        ]
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('webflow_real_sequences_v3', JSON.stringify(sequences));
  }, [sequences]);

  const [selectedSeqId, setSelectedSeqId] = useState(sequences[0]?.id);
  const selectedSeq = sequences.find(s => s.id === selectedSeqId) || sequences[0];

  // Modais de Edição
  const [editingStep, setEditingStep] = useState(null); // Step object being edited
  const [editingSeqTitle, setEditingSeqTitle] = useState(false);
  const [seqTitleDraft, setSeqTitleDraft] = useState('');
  const [feedbackNotice, setFeedbackNotice] = useState('');

  const showNotice = (msg) => {
    setFeedbackNotice(msg);
    setTimeout(() => setFeedbackNotice(''), 4000);
  };

  const toggleSequenceActive = (seqId) => {
    setSequences(prev => prev.map(s => {
      if (s.id === seqId) {
        if (s.channel === 'whatsapp' && !isWhatsappConnected && !s.active) {
          alert('Canal WhatsApp desconectado. Conecte seu número em Canais Meta antes de ativar sequências no WhatsApp.');
          return s;
        }
        return { ...s, active: !s.active };
      }
      return s;
    }));
  };

  const toggleStepActive = (seqId, stepId) => {
    setSequences(prev => prev.map(s => {
      if (s.id === seqId) {
        return {
          ...s,
          steps: s.steps.map(st => st.id === stepId ? { ...st, active: !st.active } : st)
        };
      }
      return s;
    }));
  };

  const handleSaveStep = (e) => {
    e.preventDefault();
    if (!editingStep) return;

    setSequences(prev => prev.map(s => {
      if (s.id === selectedSeq.id) {
        return {
          ...s,
          steps: s.steps.map(st => st.id === editingStep.id ? editingStep : st)
        };
      }
      return s;
    }));

    setEditingStep(null);
    showNotice('✅ Passo atualizado com sucesso!');
  };

  const handleDeleteStep = (stepId) => {
    if (selectedSeq.steps.length <= 1) {
      alert('A sequência deve conter pelo menos um passo.');
      return;
    }
    if (confirm('Tem certeza que deseja excluir este passo da sequência?')) {
      setSequences(prev => prev.map(s => {
        if (s.id === selectedSeq.id) {
          return {
            ...s,
            steps: s.steps.filter(st => st.id !== stepId)
          };
        }
        return s;
      }));
      showNotice('🗑️ Passo excluído com sucesso.');
    }
  };

  const handleAddNewStep = () => {
    const newStep = {
      id: 'step_' + Date.now(),
      delay: 'Após 24 horas',
      title: `Passo ${selectedSeq.steps.length + 1}: Follow-up`,
      messageText: 'Oi {{first_name}}! Passando aqui para saber se ficou com alguma dúvida sobre o material:',
      buttonTitle: '👉 Acessar Material',
      buttonUrl: 'https://x.com/Ithielix/status/2109527114760208745',
      active: true,
      sent: 0,
      openRate: '-',
      ctr: '-'
    };

    setSequences(prev => prev.map(s => {
      if (s.id === selectedSeq.id) {
        return { ...s, steps: [...s.steps, newStep] };
      }
      return s;
    }));

    // Abre o modal diretamente para editar o novo passo
    setEditingStep(newStep);
  };

  const handleSaveSeqTitle = (e) => {
    e.preventDefault();
    if (!seqTitleDraft.trim()) return;

    setSequences(prev => prev.map(s => s.id === selectedSeq.id ? { ...s, title: seqTitleDraft } : s));
    setEditingSeqTitle(false);
    showNotice('✅ Título da sequência alterado!');
  };

  const handleCreateNewSequence = () => {
    const newSeq = {
      id: 'seq_' + Date.now(),
      title: 'Nova Sequência Drip Personalizada',
      channel: 'instagram',
      active: true,
      subscribersCount: 0,
      steps: [
        {
          id: 'step_' + Date.now(),
          delay: 'Imediatamente',
          title: 'Passo 1: Boas-vindas',
          messageText: 'Olá {{first_name}}! Seja bem-vindo à nossa comunidade 🚀',
          buttonTitle: '👉 Ver Conteúdo',
          buttonUrl: '',
          active: true,
          sent: 0,
          openRate: '-',
          ctr: '-'
        }
      ]
    };

    setSequences([newSeq, ...sequences]);
    setSelectedSeqId(newSeq.id);
    showNotice('🎉 Nova sequência criada! Clique em "Editar" nos passos para personalizar o conteúdo.');
  };

  return (
    <div className="p-3 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300">
              ManyChat Drip Funnel 100% Editável
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Janela 24h Meta
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Sequências Drip de Automação
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Crie funis de nutrição automáticos temporizados com Smart Delay. Personalize o texto, delay e botões de cada passo.
          </p>
        </div>

        <button
          onClick={handleCreateNewSequence}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs sm:text-sm transition-all shadow-md shadow-purple-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Nova Sequência</span>
        </button>
      </div>

      {feedbackNotice && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{feedbackNotice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List of Sequences */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">
            Sequências Disponíveis ({sequences.length})
          </h2>
          <div className="space-y-2">
            {sequences.map(seq => {
              const isSelected = seq.id === selectedSeq?.id;
              const isChannelConnected = seq.channel === 'instagram' ? Boolean(channels.instagram?.connected) : isWhatsappConnected;

              return (
                <div
                  key={seq.id}
                  onClick={() => setSelectedSeqId(seq.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-purple-50/80 border-purple-300 dark:bg-purple-950/40 dark:border-purple-700 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        seq.channel === 'instagram' ? 'bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-300' : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}>
                        {seq.channel}
                      </span>
                      {!isChannelConnected && (
                        <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                          ⚪ Desconectado
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSequenceActive(seq.id);
                      }}
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        seq.active && isChannelConnected 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300' 
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      <Power className="w-3 h-3" />
                      {seq.active && isChannelConnected ? 'Ativo' : 'Pausado'}
                    </button>
                  </div>

                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                    {seq.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>{seq.steps.length} passos</span>
                    <span className="font-semibold">{seq.subscribersCount} inscritos reais</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Detail of Selected Sequence Steps */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">
                  Linha do Tempo da Sequência ({selectedSeq?.channel.toUpperCase()})
                </span>
                {editingSeqTitle ? (
                  <form onSubmit={handleSaveSeqTitle} className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={seqTitleDraft}
                      onChange={(e) => setSeqTitleDraft(e.target.value)}
                      className="px-3 py-1 rounded-lg border border-purple-400 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white"
                      autoFocus
                    />
                    <button type="submit" className="p-1 text-emerald-600 hover:text-emerald-700">
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                    <button type="button" onClick={() => setEditingSeqTitle(false)} className="p-1 text-slate-400 hover:text-slate-600">
                      <X className="w-5 h-5" />
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      {selectedSeq?.title}
                    </h2>
                    <button
                      onClick={() => {
                        setSeqTitleDraft(selectedSeq.title);
                        setEditingSeqTitle(true);
                      }}
                      className="text-slate-400 hover:text-purple-600 transition-colors p-1"
                      title="Editar título da sequência"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={handleAddNewStep}
                className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 text-purple-600 dark:text-purple-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Passo</span>
              </button>
            </div>

            {selectedSeq?.channel === 'whatsapp' && !isWhatsappConnected && (
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>WhatsApp Desconectado:</strong> Esta sequência está em modo rascunho e não enviará mensagens até que o WhatsApp seja conectado.
                  </span>
                </div>
                <button
                  onClick={() => setCurrentView('channels')}
                  className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shrink-0"
                >
                  Conectar
                </button>
              </div>
            )}

            {/* Stepper Visualization */}
            <div className="space-y-4 relative before:absolute before:top-4 before:bottom-4 before:left-5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {selectedSeq?.steps.map((st, idx) => (
                <div key={st.id} className="relative flex items-start gap-4 pl-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 text-xs font-bold shadow-xs ${
                    st.active ? 'bg-purple-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                  }`}>
                    {idx + 1}
                  </div>

                  <div className="flex-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-purple-500" />
                          {st.delay}
                        </span>
                        <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                          {st.title}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Botão Editar Passo */}
                        <button
                          onClick={() => setEditingStep({ ...st })}
                          className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-purple-600 dark:text-purple-300 hover:bg-purple-50 text-[11px] font-bold flex items-center gap-1 transition-colors"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Editar</span>
                        </button>

                        {/* Botão Excluir */}
                        <button
                          onClick={() => handleDeleteStep(st.id)}
                          className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                          title="Excluir este passo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => toggleStepActive(selectedSeq.id, st.id)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            st.active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                          }`}
                        >
                          {st.active ? 'Ligado' : 'Desligado'}
                        </button>
                      </div>
                    </div>

                    {/* Preview da Mensagem */}
                    <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                      <p className="line-clamp-2 italic">"{st.messageText}"</p>
                      {st.buttonTitle && (
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 text-[11px] font-semibold border border-blue-200 dark:border-blue-800">
                          <Link2 className="w-3 h-3" /> {st.buttonTitle}
                        </div>
                      )}
                    </div>

                    {/* Métricas Reais do Passo */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-center">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Enviados Reais</span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{st.sent}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Abertura</span>
                        <span className="text-xs font-bold text-purple-600 dark:text-purple-400">{st.openRate}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Cliques (CTR)</span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{st.ctr}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Smart Advice Box */}
            <div className="p-4 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-800/80 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div className="text-xs text-purple-900 dark:text-purple-200 space-y-1">
                <span className="font-bold">Regra Oficial da Janela de 24 Horas Meta:</span>
                <p className="text-[11px] text-purple-800/80 dark:text-purple-300/80 leading-relaxed">
                  Passos agendados para mais de 24 horas após o primeiro contato devem conter perguntas de re-engajamento ou serem disparados via template pré-aprovado no WhatsApp para evitar punições pela Meta.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Edição de Passo */}
      {editingStep && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg overflow-hidden animate-scaleUp">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Editar Passo da Sequência</h3>
                <p className="text-xs text-slate-500">Configure o tempo de espera, texto e link da mensagem</p>
              </div>
              <button onClick={() => setEditingStep(null)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStep} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Título do Passo
                </label>
                <input
                  type="text"
                  required
                  value={editingStep.title}
                  onChange={(e) => setEditingStep({ ...editingStep, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-purple-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                  Tempo de Espera (Smart Delay)
                </label>
                <select
                  value={editingStep.delay}
                  onChange={(e) => setEditingStep({ ...editingStep, delay: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-purple-500 font-semibold"
                >
                  <option value="Imediatamente">Imediatamente (Ao entrar no funil)</option>
                  <option value="Após 15 minutos">Após 15 minutos</option>
                  <option value="Após 1 hora">Após 1 hora</option>
                  <option value="Após 4 horas">Após 4 horas</option>
                  <option value="Após 24 horas (Dentro da Janela Meta)">Após 24 horas (Limite da Janela Meta)</option>
                  <option value="Após 48 horas">Após 48 horas</option>
                  <option value="Após 72 horas">Após 72 horas</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                    Conteúdo da Mensagem
                  </label>
                  <span 
                    className="text-[11px] text-purple-600 cursor-pointer" 
                    onClick={() => setEditingStep({ ...editingStep, messageText: editingStep.messageText + ' {{first_name}}' })}
                  >
                    + {'{{first_name}}'}
                  </span>
                </div>
                <textarea
                  rows={4}
                  required
                  value={editingStep.messageText}
                  onChange={(e) => setEditingStep({ ...editingStep, messageText: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-purple-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Texto do Botão
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 👉 Acessar Link"
                    value={editingStep.buttonTitle || ''}
                    onChange={(e) => setEditingStep({ ...editingStep, buttonTitle: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                    Link de Destino (URL)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={editingStep.buttonUrl || ''}
                    onChange={(e) => setEditingStep({ ...editingStep, buttonUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingStep.active}
                    onChange={(e) => setEditingStep({ ...editingStep, active: e.target.checked })}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <span>Passo Ativo na Linha do Tempo</span>
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingStep(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Salvar Alterações</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default SequencesView;
