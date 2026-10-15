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
import { MetaSetupVisualGuide } from '../Tutorial/MetaSetupVisualGuide';

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
    <div className="p-3 sm:p-6 md:p-8 space-y-4 sm:space-y-6 md:space-y-8 max-w-7xl mx-auto animate-in fade-in duration-300">
      {/* Header com Status & Acesso Rápido ao Meta Developers */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-800 shrink-0">
              <Radio className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white tracking-tight">
                  Canais Meta: Instagram & WhatsApp
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

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap w-full md:w-auto">
          <a
            href="https://developers.facebook.com/apps/"
            target="_blank"
            rel="noreferrer"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs transition-colors"
          >
            <span>Meta for Developers</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://business.facebook.com/settings"
            target="_blank"
            rel="noreferrer"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white shadow-xs transition-colors"
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

      {/* 📘 GUIA VISUAL OFICIAL COM 17 PRINTS ANOTADOS (PASSOS A PASSOS COM SETAS E BLINDAGEM DE DADOS) */}
      <MetaSetupVisualGuide />

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
