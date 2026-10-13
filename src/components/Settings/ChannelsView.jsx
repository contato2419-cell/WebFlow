import React, { useState } from 'react';
import { Radio, MessageCircle, Copy, Check, ShieldCheck, Key, ExternalLink } from 'lucide-react';
import { InstagramIcon } from '../Icons';
import { useApp } from '../../context/AppContext';

export const ChannelsView = () => {
  const { channels, setChannels } = useApp();
  const [copiedField, setCopiedField] = useState(null);

  const webhookUrl = 'https://vitrixflow.pages.dev/api/webhook';
  const verifyToken = 'vitrixflow_meta_token_secret_2026';

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white tracking-tight flex items-center gap-2.5">
            <Radio className="w-6 h-6 text-indigo-400" />
            Conexão de Canais Oficiais (Meta Graph API)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Conecte suas contas oficiais do Instagram e WhatsApp Business Cloud API diretamente sem intermediários caros.
          </p>
        </div>

        <a
          href="https://developers.facebook.com/apps/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
        >
          <span>Abrir Meta Developers Console</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* URL de Webhook Global para a Meta */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-500/30 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Endpoint de Webhook Oficial (Colar no Meta Developers)
            </h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            SSL 256-bit Seguro
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Callback URL (URL de Retorno)</p>
              <p className="font-mono text-indigo-300 mt-0.5">{webhookUrl}</p>
            </div>
            <button
              onClick={() => copyToClipboard(webhookUrl, 'url')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {copiedField === 'url' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Verify Token (Token de Verificação)</p>
              <p className="font-mono text-indigo-300 mt-0.5">{verifyToken}</p>
            </div>
            <button
              onClick={() => copyToClipboard(verifyToken, 'token')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {copiedField === 'token' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Canais: Instagram e WhatsApp */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Instagram Direct & Reels */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <InstagramIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-heading">Instagram Messaging API</h3>
                <p className="text-[11px] text-slate-400">DMs, Comentários de Reels e Stories</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Conectado
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Nome de Usuário (@handle)</label>
              <input
                type="text"
                value={channels.instagram.accountName}
                onChange={(e) => setChannels({ ...channels, instagram: { ...channels.instagram, accountName: e.target.value } })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Facebook Page ID Conectada</label>
              <input
                type="text"
                value={channels.instagram.pageId}
                onChange={(e) => setChannels({ ...channels, instagram: { ...channels.instagram, pageId: e.target.value } })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Page Access Token de Longa Duração</label>
              <input
                type="password"
                value="EAAX9...token_permanente_meta"
                readOnly
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 font-mono"
              />
            </div>
          </div>
        </div>

        {/* WhatsApp Cloud API */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-heading">WhatsApp Cloud API (Meta)</h3>
                <p className="text-[11px] text-slate-400">Mensagens oficiais sem risco de banimento de chip</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Conectado
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Número de WhatsApp Oficial</label>
              <input
                type="text"
                value={channels.whatsapp.number}
                onChange={(e) => setChannels({ ...channels, whatsapp: { ...channels.whatsapp, number: e.target.value } })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">WhatsApp Business Account (WABA) ID</label>
              <input
                type="text"
                value={channels.whatsapp.wabaId}
                onChange={(e) => setChannels({ ...channels, whatsapp: { ...channels.whatsapp, wabaId: e.target.value } })}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">System User Token (Meta Cloud API)</label>
              <input
                type="password"
                value="EAAG5...whatsapp_permanent_token"
                readOnly
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 font-mono"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
