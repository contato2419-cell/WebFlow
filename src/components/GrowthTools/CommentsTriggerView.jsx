import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  RotateCw,
  ExternalLink
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
    <div className="p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white tracking-tight flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-amber-400" />
            Growth Tools: Automação de Comentários (Instagram)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Responda comentários de Reels automaticamente com Spintax anti-bloqueio e envie a DM instantânea.
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
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Novo Gatilho</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Gatilhos Cadastrados */}
        <div className="space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">Gatilhos Configurados</p>
          {triggers.map((trig) => {
            const isSelected = editingTrigger?.id === trig.id;
            return (
              <div
                key={trig.id}
                onClick={() => setEditingTrigger(trig)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-slate-800/90 border-indigo-500 shadow-xl shadow-indigo-500/10' 
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <InstagramIcon className="w-4 h-4 text-rose-400" />
                    <span className="text-xs font-bold text-white truncate max-w-[150px]">{trig.name}</span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleToggleActive(trig.id); }}
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border transition-colors ${
                      trig.active 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                        : 'bg-slate-800 text-slate-500 border-slate-700'
                    }`}
                  >
                    {trig.active ? 'Ativo' : 'Pausado'}
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded">
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
          <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-base font-bold text-white font-heading">{editingTrigger.name}</h2>
                <p className="text-xs text-slate-400">Configuração de Blindagem Anti-Bloqueio da Meta</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Escudo Ativo
                </span>
              </div>
            </div>

            {/* Parâmetros do Gatilho */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Nome da Automação</label>
                <input
                  type="text"
                  value={editingTrigger.name}
                  onChange={(e) => {
                    const updated = { ...editingTrigger, name: e.target.value };
                    setEditingTrigger(updated);
                    setTriggers(prev => prev.map(t => t.id === updated.id ? updated : t));
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Palavra-Chave Obrigatória</label>
                <input
                  type="text"
                  value={editingTrigger.keyword}
                  onChange={(e) => {
                    const updated = { ...editingTrigger, keyword: e.target.value.toUpperCase() };
                    setEditingTrigger(updated);
                    setTriggers(prev => prev.map(t => t.id === updated.id ? updated : t));
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-mono uppercase"
                  placeholder="EX: VITRIX"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">Fluxo a Disparar no Direct</label>
                <select
                  value={editingTrigger.flowId}
                  onChange={(e) => {
                    const updated = { ...editingTrigger, flowId: e.target.value };
                    setEditingTrigger(updated);
                    setTriggers(prev => prev.map(t => t.id === updated.id ? updated : t));
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  {flows.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Atraso Inteligente (Jitter Anti-Ban)
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
                    className="flex-1 accent-indigo-500"
                  />
                  <span className="text-xs font-bold text-indigo-300 w-12 text-right">
                    {editingTrigger.delaySeconds}s
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Simula o tempo de digitação de um ser humano.</p>
              </div>
            </div>

            {/* Gerador de Spintax: Respostas Públicas Variadas */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <RotateCw className="w-3.5 h-3.5 text-indigo-400" />
                    Spintax: Rotação de Respostas no Feed ({editingTrigger.publicReplies.length} cadastradas)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    O bot sorteia uma resposta diferente para cada comentário, quebrando o filtro de repetição do Instagram.
                  </p>
                </div>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {editingTrigger.publicReplies.map((reply, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200">
                    <span className="truncate max-w-[90%]">{reply}</span>
                    <button
                      onClick={() => handleRemoveReply(idx)}
                      className="text-slate-500 hover:text-rose-400 p-1"
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
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
                <button
                  onClick={handleAddReply}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
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
