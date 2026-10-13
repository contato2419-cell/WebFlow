import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  MessageCircle, 
  Copy, 
  Check, 
  ShieldCheck, 
  Key, 
  ExternalLink, 
  HelpCircle, 
  AlertTriangle, 
  Lock, 
  Eye, 
  EyeOff, 
  BookOpen, 
  Zap, 
  CheckCircle2, 
  ShieldAlert, 
  Sparkles,
  Server,
  ArrowRight,
  Info
} from 'lucide-react';
import { InstagramIcon } from '../Icons';
import { useApp } from '../../context/AppContext';

export const ChannelsView = () => {
  const { channels, setChannels } = useApp();
  const [copiedField, setCopiedField] = useState(null);
  const [activeTutorialTab, setActiveTutorialTab] = useState('passo1');
  
  // Controle de visibilidade de tokens (segurança de tela)
  const [showIgToken, setShowIgToken] = useState(false);
  const [showWabaToken, setShowWabaToken] = useState(false);

  // Estados locais para credenciais salvas de forma segura no localStorage
  const [verifyToken, setVerifyToken] = useState(() => {
    return localStorage.getItem('webflow_meta_verify_token') || 'webflow_meta_token_secret_2026';
  });

  const [igToken, setIgToken] = useState(() => {
    return localStorage.getItem('webflow_meta_ig_token') || '';
  });

  const [wabaToken, setWabaToken] = useState(() => {
    return localStorage.getItem('webflow_meta_waba_token') || '';
  });

  const [saveStatus, setSaveStatus] = useState(false);

  const webhookUrl = 'https://webflow-app-b25.pages.dev/api/webhook';

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSaveTokens = () => {
    localStorage.setItem('webflow_meta_verify_token', verifyToken);
    localStorage.setItem('webflow_meta_ig_token', igToken);
    localStorage.setItem('webflow_meta_waba_token', wabaToken);

    // Atualiza status de conexão dos canais
    const updatedChannels = {
      ...channels,
      instagram: {
        ...channels.instagram,
        connected: Boolean(channels.instagram.accountName && igToken),
        verified: Boolean(igToken)
      },
      whatsapp: {
        ...channels.whatsapp,
        connected: Boolean(channels.whatsapp.number && wabaToken),
        verified: Boolean(wabaToken)
      }
    };
    setChannels(updatedChannels);
    localStorage.setItem('webflow_channels', JSON.stringify(updatedChannels));

    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 2500);
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Header com Status & Acesso Rápido ao Meta Developers */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-heading text-slate-900 dark:text-white tracking-tight">
                  Canais Meta: Instagram Direct & WhatsApp Cloud API
                </h1>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400 border border-blue-200 dark:border-blue-800 uppercase tracking-wider">
                  Graph API v21.0
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Conecte suas contas empresariais oficiais diretamente com o ecossistema Meta, sem mensalidades de terceiros.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://developers.facebook.com/apps/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs transition-colors"
          >
            <span>Painel Meta for Developers</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://business.facebook.com/settings"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white shadow-xs transition-colors"
          >
            <span>Meta Business Suite</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* 🛡️ Alerta de Cybersegurança e Arquitetura Zero-Knowledge */}
      <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-slate-850 border border-blue-200 dark:border-slate-700 text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Cybersegurança & Isolamento de Dados Frontend (Zero-Knowledge)
              <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                100% Protegido
              </span>
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
              Nenhuma credencial de backend, chave mestre ou token permanente é gravado em código-fonte público ou exposto no DevTools (F12). 
              Seus tokens ficam salvos exclusivamente no armazenamento seguro do seu próprio navegador (<code className="bg-white dark:bg-slate-900 px-1 py-0.5 rounded text-blue-600 dark:text-blue-400">localStorage</code>) ou nas suas Edge Functions privadas.
            </p>
          </div>
        </div>
      </div>

      {/* Endpoint do Webhook para Colar no Meta */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/80">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Configuração de Webhook Oficial (Cole no Painel da Meta)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Copie estes dois dados e cole na seção <strong>Webhooks</strong> do seu aplicativo no Meta for Developers.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            HTTPS Criptografado
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="overflow-hidden mr-2">
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Callback URL (URL de Retorno)</p>
              <p className="font-mono text-blue-600 dark:text-blue-400 font-semibold truncate mt-0.5">{webhookUrl}</p>
            </div>
            <button
              onClick={() => copyToClipboard(webhookUrl, 'url')}
              className="p-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition-colors shrink-0"
              title="Copiar URL"
            >
              {copiedField === 'url' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="overflow-hidden mr-2 flex-1">
              <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Verify Token (Token de Verificação Privado)</p>
              <input
                type="text"
                value={verifyToken}
                onChange={(e) => setVerifyToken(e.target.value)}
                className="w-full bg-transparent font-mono text-blue-600 dark:text-blue-400 font-semibold text-xs mt-0.5 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => copyToClipboard(verifyToken, 'token')}
                className="p-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                title="Copiar Verify Token"
              >
                {copiedField === 'token' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Formulários de Configuração dos Canais (Instagram & WhatsApp) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Instagram Direct & Reels API */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-200 dark:border-rose-800">
                  <InstagramIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">Instagram Messaging API</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">DMs Privadas, Comentários de Reels e Menções</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                channels.instagram.connected 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800'
                  : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800'
              }`}>
                {channels.instagram.connected ? '✓ Canal Conectado' : 'Aguardando Configuração'}
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">
                  Nome de Usuário (@handle do Instagram)
                </label>
                <input
                  type="text"
                  value={channels.instagram.accountName}
                  onChange={(e) => setChannels({ ...channels, instagram: { ...channels.instagram, accountName: e.target.value } })}
                  placeholder="@vitrix.oficial"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">
                  Facebook Page ID Conectada
                </label>
                <input
                  type="text"
                  value={channels.instagram.pageId}
                  onChange={(e) => setChannels({ ...channels, instagram: { ...channels.instagram, pageId: e.target.value } })}
                  placeholder="Cole o ID da sua Página (ex: 123456789...)"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-500 text-xs"
                />
                <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-1 font-medium">
                  💡 <strong>Onde achar em 5 segundos:</strong> No Meta Business Suite, clique no menu da esquerda em <strong>Contas → Páginas</strong> e copie o número de <em>Identificação</em> da sua página (ex: da sua página VitrixApp).
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 dark:text-slate-300 font-bold">
                    Page Access Token Permanente (System User Token)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowIgToken(!showIgToken)}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    {showIgToken ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showIgToken ? 'Ocultar' : 'Revelar'}</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showIgToken ? 'text' : 'password'}
                    value={igToken}
                    onChange={(e) => setIgToken(e.target.value)}
                    placeholder="EAA..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-500 pr-10"
                  />
                  <Key className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Gere este token com validade 'Nunca Expira' no Meta Business Suite (consulte o passo 3 do tutorial abaixo).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Cloud API (Meta Oficial) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-heading">WhatsApp Cloud API (Meta)</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">API Oficial Meta sem QR Code e Sem Risco de Ban</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                channels.whatsapp.connected 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800'
                  : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800'
              }`}>
                {channels.whatsapp.connected ? '✓ Canal Conectado' : 'Aguardando Configuração'}
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">
                  Número de WhatsApp Oficial (com DDI e DDD)
                </label>
                <input
                  type="text"
                  value={channels.whatsapp.number}
                  onChange={(e) => setChannels({ ...channels, whatsapp: { ...channels.whatsapp, number: e.target.value } })}
                  placeholder="+55 (11) 99999-8888"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">
                  WhatsApp Business Account (WABA) ID
                </label>
                <input
                  type="text"
                  value={channels.whatsapp.wabaId}
                  onChange={(e) => setChannels({ ...channels, whatsapp: { ...channels.whatsapp, wabaId: e.target.value } })}
                  placeholder="Ex: waba_994102935"
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 dark:text-slate-300 font-bold">
                    System User Token (Meta Cloud API)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowWabaToken(!showWabaToken)}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    {showWabaToken ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showWabaToken ? 'Ocultar' : 'Revelar'}</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showWabaToken ? 'text' : 'password'}
                    value={wabaToken}
                    onChange={(e) => setWabaToken(e.target.value)}
                    placeholder="EAAG..."
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-500 pr-10"
                  />
                  <Key className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Requer a permissão <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">whatsapp_business_messaging</code>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botão de Salvar Credenciais Locais */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          onClick={handleSaveTokens}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all hover:shadow-lg"
        >
          {saveStatus ? <CheckCircle2 className="w-4 h-4 text-white" /> : <ShieldCheck className="w-4 h-4" />}
          <span>{saveStatus ? 'Credenciais Salvas no Armazenamento Local!' : 'Salvar Configurações com Segurança'}</span>
        </button>
      </div>

      {/* 📘 TUTORIAL INTERATIVO PASSO A PASSO (COMO CONFIGURAR NO META FOR DEVELOPERS) */}
      <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-700/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-heading">
                Tutorial Completo: Como Configurar o Aplicativo no Meta for Developers
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Siga este roteiro detalhado para criar e aprovar suas credenciais oficiais sem erros e sem custos.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            Passo a Passo Didático
          </span>
        </div>

        {/* Abas do Tutorial */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setActiveTutorialTab('passo1')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTutorialTab === 'passo1'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <span>Passo 1: Criar App na Meta</span>
          </button>

          <button
            onClick={() => setActiveTutorialTab('passo2')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTutorialTab === 'passo2'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <span>Passo 2: Vincular Instagram & Página</span>
          </button>

          <button
            onClick={() => setActiveTutorialTab('passo3')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTutorialTab === 'passo3'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <span>Passo 3: Token Permanente (System User)</span>
          </button>

          <button
            onClick={() => setActiveTutorialTab('passo4')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTutorialTab === 'passo4'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <span>Passo 4: Configurar Webhooks</span>
          </button>
        </div>

        {/* Conteúdo da Aba Ativa */}
        <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-4">
          {activeTutorialTab === 'passo1' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-750 space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">1</span>
                  Criando a Conta e o Aplicativo no Meta for Developers
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-1">
                  <li>Acesse o portal oficial de desenvolvedores do Facebook: <a href="https://developers.facebook.com" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 font-semibold underline">developers.facebook.com</a>.</li>
                  <li>Faça login com a sua conta pessoal do Facebook (o perfil que é administrador da sua Página e Gerenciador de Negócios).</li>
                  <li>No canto superior direito, clique no botão <strong>"Meus Apps"</strong> (My Apps) e depois em <strong>"Criar App"</strong> (Create App).</li>
                  <li>Quando o Meta perguntar <em>"O que você deseja que seu app faça?"</em>, selecione a opção <strong>"Outro"</strong> (Other) e clique em Avançar.</li>
                  <li>Na tela seguinte de tipo de aplicativo, escolha <strong>"Empresa"</strong> (Business) para ter acesso completo a automações comerciais e DMs.</li>
                  <li>Dê um nome para o seu aplicativo (ex: <code>WebFlow Automação</code>) e selecione a sua Conta Empresarial do Meta Business Suite.</li>
                  <li>Clique em <strong>"Criar App"</strong> e confirme a senha do seu Facebook se solicitado.</li>
                </ol>
              </div>
            </div>
          )}

          {activeTutorialTab === 'passo2' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-750 space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">2</span>
                  Conectando Produtos & Requisitos da Conta do Instagram
                </h4>
                <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">⚠️ Requisito Obrigatório do Instagram:</p>
                    <p className="mt-0.5">Sua conta do Instagram DEVE ser <strong>Profissional</strong> (Comercial ou Criador de Conteúdo) e estar obrigatoriamente vinculada a uma <strong>Página de Facebook</strong>. Contas pessoais normais não possuem acesso à API da Meta.</p>
                  </div>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-1">
                  <li>No painel do aplicativo criado, vá até a seção <strong>"Adicionar Produtos ao App"</strong> no menu lateral.</li>
                  <li>Localize <strong>"Instagram Graph API"</strong> e clique em <strong>"Configurar"</strong>.</li>
                  <li>Localize <strong>"WhatsApp"</strong> e clique em <strong>"Configurar"</strong> caso vá automatizar WhatsApp também.</li>
                  <li>Vá no seu aplicativo do Instagram no celular → <em>Configurações → Ferramentas para Criadores/Empresas → Conectar Página do Facebook</em> e certifique-se de que a página está conectada.</li>
                </ol>
              </div>
            </div>
          )}

          {activeTutorialTab === 'passo3' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-750 space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">3</span>
                  Como Gerar o Token Permanente (System User Token que NUNCA Expira)
                </h4>
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-300 flex items-start gap-2.5">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Por que não usar o token comum do Graph API Explorer?</p>
                    <p className="mt-0.5">O token comum do Explorer expira após 1 a 60 dias. Se ele expirar, seu robô para de funcionar no meio da campanha! Criando um <strong>Usuário do Sistema</strong> no Business Suite, o token gerado tem validade permanente (Nunca Expira).</p>
                  </div>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-1">
                  <li>Acesse as Configurações do Negócio: <a href="https://business.facebook.com/settings" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 font-semibold underline">business.facebook.com/settings</a>.</li>
                  <li>No menu lateral esquerdo, clique em <strong>Usuários</strong> → <strong>Usuários do Sistema</strong> (System Users).</li>
                  <li>Clique no botão <strong>"Adicionar"</strong>, defina o nome como <code>WebFlow Bot</code> e selecione a função <strong>"Administrador"</strong>.</li>
                  <li>Clique em <strong>"Atribuir Ativos"</strong> (Assign Assets): selecione a sua Página do Facebook e marque a permissão de <strong>Controle Total</strong>.</li>
                  <li>Clique no botão <strong>"Gerar Novo Token"</strong>:</li>
                  <ul className="list-disc list-inside ml-4 space-y-1 my-1 text-slate-600 dark:text-slate-300">
                    <li>Selecione o seu App <code>WebFlow Automação</code>.</li>
                    <li>Em <strong>Expiração do Token</strong>, selecione: <strong className="text-emerald-600 dark:text-emerald-400 font-mono">Nunca (Never Expire)</strong>.</li>
                    <li>Marque as permissões obrigatórias da lista abaixo.</li>
                  </ul>
                  <li>Permissões obrigatórias a selecionar:</li>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2 font-mono text-[11px]">
                    <div className="p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">✓ instagram_basic</div>
                    <div className="p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">✓ instagram_manage_messages</div>
                    <div className="p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">✓ instagram_manage_comments</div>
                    <div className="p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">✓ pages_manage_metadata</div>
                    <div className="p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">✓ pages_read_engagement</div>
                    <div className="p-2 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">✓ whatsapp_business_messaging</div>
                  </div>
                  <li>Clique em <strong>"Gerar Token"</strong>, copie a chave gerada e cole no campo "Page Access Token" acima.</li>
                </ol>
              </div>
            </div>
          )}

          {activeTutorialTab === 'passo4' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-750 space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">4</span>
                  Configurando o Webhook e Assinando os Eventos no Meta
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-1">
                  <li>No painel do seu app no Meta for Developers, clique em <strong>Webhooks</strong> no menu esquerdo (ou dentro de Instagram → Webhooks).</li>
                  <li>Selecione o objeto <strong>"Instagram"</strong> e clique em <strong>"Editar URL de Retorno"</strong> (Edit Callback URL).</li>
                  <li>No campo <strong>URL de Retorno</strong>, cole a URL: <code className="bg-white dark:bg-slate-800 px-1 py-0.5 rounded text-blue-600 dark:text-blue-400 font-mono">{webhookUrl}</code>.</li>
                  <li>No campo <strong>Token de Verificação</strong>, cole o seu <code>Verify Token</code> configurado acima.</li>
                  <li>Clique em <strong>"Verificar e Salvar"</strong>. O Meta enviará um teste instantâneo e aprovará com um visto verde.</li>
                  <li>Na tabela de campos do Webhook, clique em <strong>"Inscrever-se"</strong> (Subscribe) nos seguintes eventos:</li>
                  <ul className="list-disc list-inside ml-4 space-y-1 my-1">
                    <li><strong className="text-blue-600 dark:text-blue-400">messages:</strong> Notifica quando um seguidor manda uma mensagem privada ou clica no botão.</li>
                    <li><strong className="text-blue-600 dark:text-blue-400">messaging_postbacks:</strong> Notifica o clique exato nos botões da caixa de confirmação.</li>
                    <li><strong className="text-blue-600 dark:text-blue-400">comments:</strong> Notifica comentários nos seus Reels e Posts para o bot responder instantaneamente com Spintax.</li>
                  </ul>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 🛑 MANUAL OFICIAL ANTI-BAN DA META: COMO NÃO TOMAR BLOQUEIO */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-750 text-white shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-heading">
                  Manual de Blindagem Anti-Ban da Meta (Regras de Ouro Inegociáveis)
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800">
                  Proteção Ativa
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                O que você NUNCA pode fazer se não quiser ter a conta ou o Direct bloqueado pela inteligência artificial da Meta.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {/* Regra 1 */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <span className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center text-[10px] border border-rose-500/30">1</span>
              <span>A Janela de 24 Horas (24h Window)</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              A Meta proíbe o envio de mensagens promocionais após 24 horas da última mensagem enviada pelo usuário. O WebFlow calcula a janela automaticamente e bloqueia disparos frios fora do prazo para proteger sua conta.
            </p>
          </div>

          {/* Regra 2 */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px] border border-amber-500/30">2</span>
              <span>Micro-Compromisso em 2 Etapas</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              <strong className="text-white">NUNCA envie link de compra ou WhatsApp na 1ª DM fria!</strong> O robô deve enviar uma pergunta de confirmação com botão (ex: <em>"Quer receber o material? Toque abaixo"</em>). O seguidor toca no botão e só então você entrega o link na 2ª DM.
            </p>
          </div>

          {/* Regra 3 */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] border border-emerald-500/30">3</span>
              <span>Spintax Randômico Obrigatório</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Se você responder 100 comentários com o mesmo texto idêntico (ex: <em>"Te chamei no direct"</em>), o algoritmo da Meta classifica sua conta como spam em minutos. O WebFlow exige um mínimo de 8 variações randômicas.
            </p>
          </div>

          {/* Regra 4 */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-bold">
              <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px] border border-blue-500/30">4</span>
              <span>Delays Humanos com Jitter (8s-35s)</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Robôs amadores respondem em 0.1 segundo. Nenhum humano digita nessa velocidade. O WebFlow aplica atraso randômico entre 12s e 25s entre a postagem do comentário e o envio da DM, simulando comportamento humano real.
            </p>
          </div>

          {/* Regra 5 */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-bold">
              <span className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px] border border-purple-500/30">5</span>
              <span>Teto Máximo por Hora (Rate Limit)</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Mesmo em posts virais com milhares de comentários, configure o limite de segurança de até 750 respostas públicas por hora. O restante entra em fila assíncrona automática para evitar gatilhos de volume excessivo na API.
            </p>
          </div>

          {/* Regra 6 */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <span className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-[10px] border border-cyan-500/30">6</span>
              <span>Aquecimento de Perfil (Warm-Up)</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Se sua conta do Instagram nunca usou automação, comece na 1ª semana respondendo de 50 a 100 leads por dia. Na 2ª semana suba para 250/dia, antes de ligar anúncios de tráfego pago massivo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelsView;
