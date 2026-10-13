import React, { useState } from 'react';
import { Radio, MessageCircle, Copy, Check, ShieldCheck, Key, ExternalLink, HelpCircle } from 'lucide-react';
import { InstagramIcon } from '../Icons';
import { useApp } from '../../context/AppContext';

export const ChannelsView = () => {
  const { channels, setChannels } = useApp();
  const [copiedField, setCopiedField] = useState(null);

  const webhookUrl = 'https://webflow-app-b25.pages.dev/api/webhook';
  const verifyToken = 'webflow_meta_token_secret_2026';

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <Radio className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              Canais Meta: Instagram & WhatsApp
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-800">
              Meta Graph API v21.0
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Conecte suas contas oficiais do Instagram Direct e WhatsApp Cloud API diretamente, sem mensalidades.
          </p>
        </div>

        <a
          href="https://developers.facebook.com/apps/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs transition-colors"
        >
          <span>Abrir Painel Meta Developers</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* URL de Webhook Oficial da Meta */}
      <div className="p-5 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Endpoint de Webhook Oficial (Colar no Painel da Meta)
            </h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            HTTPS Seguro
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-750 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Callback URL (URL de Retorno)</p>
              <p className="font-mono text-blue-600 dark:text-blue-400 font-semibold mt-0.5">{webhookUrl}</p>
            </div>
            <button
              onClick={() => copyToClipboard(webhookUrl, 'url')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              {copiedField === 'url' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-750 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Verify Token (Token de Verificação)</p>
              <p className="font-mono text-blue-600 dark:text-blue-400 font-semibold mt-0.5">{verifyToken}</p>
            </div>
            <button
              onClick={() => copyToClipboard(verifyToken, 'token')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              {copiedField === 'token' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Canais: Instagram e WhatsApp */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Instagram Direct & Reels */}
        <div className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
                <InstagramIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">Instagram Messaging API</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">DMs, Comentários de Reels e Stories</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400">
              Conectado
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">Nome de Usuário (@handle)</label>
              <input
                type="text"
                value={channels.instagram.accountName}
                onChange={(e) => setChannels({ ...channels, instagram: { ...channels.instagram, accountName: e.target.value } })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">Facebook Page ID Conectada</label>
              <input
                type="text"
                value={channels.instagram.pageId}
                onChange={(e) => setChannels({ ...channels, instagram: { ...channels.instagram, pageId: e.target.value } })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">Page Access Token de Longa Duração</label>
              <input
                type="password"
                value="EAAX9...token_permanente_meta"
                readOnly
                className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* WhatsApp Cloud API */}
        <div className="p-6 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">WhatsApp Cloud API (Meta)</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Mensagens oficiais sem risco de banimento de chip</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400">
              Conectado
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">Número de WhatsApp Oficial</label>
              <input
                type="text"
                value={channels.whatsapp.number}
                onChange={(e) => setChannels({ ...channels, whatsapp: { ...channels.whatsapp, number: e.target.value } })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">WhatsApp Business Account (WABA) ID</label>
              <input
                type="text"
                value={channels.whatsapp.wabaId}
                onChange={(e) => setChannels({ ...channels, whatsapp: { ...channels.whatsapp, wabaId: e.target.value } })}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">System User Token (Meta Cloud API)</label>
              <input
                type="password"
                value="EAAG5...whatsapp_permanent_token"
                readOnly
                className="w-full px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 font-mono"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
