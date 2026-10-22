import React, { useEffect, useState } from 'react';
import { Lock, Zap } from 'lucide-react';
import { PANEL_KEY_EVENT, savePanelKey } from '../../lib/panelKey';

// Aparece quando o servidor recusa uma chamada por falta da senha do painel
export const PanelKeyModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState('');

  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener(PANEL_KEY_EVENT, open);
    return () => window.removeEventListener(PANEL_KEY_EVENT, open);
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    savePanelKey(value.trim());
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <Zap className="w-5 h-5 fill-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-heading">Senha do painel</h2>
            <p className="text-[11px] text-slate-400">Pra salvar fluxos e usar o Live Chat neste navegador</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Senha</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="password"
                autoFocus
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};
