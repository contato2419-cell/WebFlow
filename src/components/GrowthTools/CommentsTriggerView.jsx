import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  RotateCw,
  ExternalLink,
  HelpCircle,
  Check
} from 'lucide-react';
import { InstagramIcon } from '../Icons';
import { useApp } from '../../context/AppContext';

export const CommentsTriggerView = () => {
  const { triggers, setTriggers, flows } = useApp();
  const [editingTrigger, setEditingTrigger] = useState(triggers[0] || null);
  const [newReplyText, setNewReplyText] = useState('');

  const handleToggleActive = (id) => {
    setTriggers(prev => prev.map(t => t.id === id ? { ...t, active: !t.active } : t));
    if (editingTrigger?.id === id) {
      setEditingTrigger(prev => ({ ...prev, active: !prev.active }));
    }
  };

  const handleAddReply = () => {
    if (!newReplyText.trim() || !editingTrigger) return;
    const updatedReplies = [...editingTrigger.publicReplies, newReplyText.trim()];
    const updated = { ...editingTrigger, publicReplies: updatedReplies };
    setEditingTrigger(updated);
    setTriggers(prev => prev.map(t => t.id === updated.id ? updated : t));
    setNewReplyText('');
  };

  const handleRemoveReply = (index) => {
    if (!editingTrigger) return;
    const updatedReplies = editingTrigger.publicReplies.filter((_, idx) => idx !== index);
    const updated = { ...editingTrigger, publicReplies: updatedReplies };
    setEditingTrigger(updated);
    setTriggers(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  return (
    <div className="p-3 sm:p-6 md:p-8 space-y-4 sm:space-y-6 md:space-y-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Header Limpo Estilo ManyChat */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white tracking-tight flex items-center gap-2 sm:gap-2.5">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
              Gatilhos de Comentários no Reels
            </h1>
            <span className="text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200 dark:border-blue-800 font-semibold">
              Growth Tool • Reels
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Responda automaticamente a quem comentar no seu Reel e envie a mensagem privada com o botão no Direct.
          </p>
        </div>

        <button
          onClick={() => {
            const newTrig = {
              id: 'trig_' + Date.now(),
              name: 'Novo Reels / Post',
              postUrl: '',
              keyword: 'QUERO',
              matchType: 'contains',
              channel: 'instagram',
              active: true,
              delaySeconds: 15,
              publicReplies: [
                'Acabei de te enviar no direct! 🚀',
                'Mandei lá nas suas mensagens ✨',
                'Dá uma olhadinha no seu direct 📩'
              ],
              flowId: flows[0]?.id || '',
              totalExecutions: 0
            };
            setTriggers(prev => [newTrig, ...prev]);
            setEditingTrigger(newTrig);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Novo Gatilho</span>
        </button>
      </div>

      {/* Explicação Didática: Como Funciona */}
      <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs text-blue-950 dark:text-blue-200 space-y-1">
          <p className="font-bold">Como funciona a blindagem contra bloqueios?</p>
          <p className="text-blue-800 dark:text-blue-300 leading-relaxed">
            1. Quando alguém comenta a <strong>palavra-chave</strong> no seu vídeo, o sistema aguarda um <strong>atraso humano (Jitter) de 8s a 35s</strong> para simular uma pessoa real digitando.
            <br />
            2. O sistema sorteia 1 das suas <strong>respostas variadas (Spintax)</strong> para responder publicamente na publicação.
            <br />
            3. Em seguida, ele abre o Direct enviando a <strong>caixinha com botão</strong> para o seguidor clicar e liberar o link com 100% de segurança.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Gatilhos Cadastrados */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
            Seus Vídeos / Gatilhos
          </p>
          {triggers.map((trig) => {
            const isSelected = editingTrigger?.id === trig.id;
            return (
              <div
                key={trig.id}
                onClick={() => setEditingTrigger(trig)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-blue-50/50 dark:bg-slate-800 border-blue-500 shadow-xs ring-1 ring-blue-500/20' 
                    : 'bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center">
                      <InstagramIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{trig.name}</span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleToggleActive(trig.id); }}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                      trig.active 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300' 
                        : 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800'
                    }`}
                  >
                    {trig.active ? 'Ativo' : 'Pausado'}
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-mono bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    PALAVRA: {trig.keyword}
                  </span>
                  <span>{trig.publicReplies.length} variações</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Editor Detalhado do Gatilho com Spintax */}
        {editingTrigger && (
          <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white font-heading">{editingTrigger.name}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Configuração de Blindagem Anti-Bloqueio do Instagram</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Escudo Ativo
                </span>
              </div>
            </div>

            {/* Parâmetros do Gatilho */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Nome do Gatilho</label>
                <input
                  type="text"
                  value={editingTrigger.name ?? ''}
                  onChange={(e) => {
                    const updated = { ...editingTrigger, name: e.target.value };
                    setEditingTrigger(updated);
                    setTriggers(prev => prev.map(t => t.id === updated.id ? updated : t));
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Palavra-Chave no Comentário
                </label>
                <input
                  type="text"
                  value={editingTrigger.keyword ?? ''}
                  onChange={(e) => {
                    const updated = { ...editingTrigger, keyword: e.target.value.toUpperCase() };
                    setEditingTrigger(updated);
                    setTriggers(prev => prev.map(t => t.id === updated.id ? updated : t));
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-mono uppercase font-bold focus:ring-2 focus:ring-blue-500"
                  placeholder="EX: QUERO"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Fluxo a Disparar no Direct</label>
                <select
                  value={editingTrigger.flowId}
                  onChange={(e) => {
                    const updated = { ...editingTrigger, flowId: e.target.value };
                    setEditingTrigger(updated);
                    setTriggers(prev => prev.map(t => t.id === updated.id ? updated : t));
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 font-medium"
                >
                  {flows.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  Atraso de Resposta (Jitter Anti-Ban)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="5"
                    max="45"
                    value={editingTrigger.delaySeconds}
                    onChange={(e) => {
                      const updated = { ...editingTrigger, delaySeconds: Number(e.target.value) };
                      setEditingTrigger(updated);
                      setTriggers(prev => prev.map(t => t.id === updated.id ? updated : t));
                    }}
                    className="flex-1 accent-blue-600"
                  />
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 w-12 text-right">
                    {editingTrigger.delaySeconds}s
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Atraso seguro para simular digitação humana.</p>
              </div>
            </div>

            {/* Gerador de Spintax: Respostas Variadas no Feed */}
            <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <RotateCw className="w-3.5 h-3.5 text-blue-600" />
                    Spintax: Rotação de Respostas no Feed ({editingTrigger.publicReplies.length} cadastradas)
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    O robô sorteia uma resposta diferente para cada seguidor, impedindo que o Instagram marque como spam.
                  </p>
                </div>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {editingTrigger.publicReplies.map((reply, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200">
                    <span className="truncate max-w-[90%] font-medium">{reply}</span>
                    <button
                      onClick={() => handleRemoveReply(idx)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  value={newReplyText}
                  onChange={(e) => setNewReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddReply()}
                  placeholder="Nova frase de resposta com emoji..."
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleAddReply}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
                >
                  Adicionar Frase
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
