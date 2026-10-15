import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  X, 
  CheckCircle2, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  BookOpen, 
  Layers, 
  ArrowRight,
  Info,
  Copy,
  Check
} from 'lucide-react';

const TUTORIAL_STEPS = [
  {
    id: 'step_01_meta_app_id',
    image: '/tutorial/step_01_meta_app_id.png',
    phase: '1. App Meta',
    title: 'Passo 1: Localizar o ID do Aplicativo',
    badge: 'Meta Developers',
    description: 'No portal developers.facebook.com, selecione seu aplicativo no canto superior e copie a sequência numérica de ID do App.',
    tip: 'O ID do app é a chave que identifica o seu robô dentro da infraestrutura da Meta.',
    link: 'https://developers.facebook.com/apps/',
    linkLabel: 'Abrir Meta Developers'
  },
  {
    id: 'step_02_business_suite_menu',
    image: '/tutorial/step_02_business_suite_menu.png',
    phase: '2. Business Suite',
    title: 'Passo 2: Abrir Todas as Ferramentas',
    badge: 'Business Suite',
    description: 'Acesse o Meta Business Suite da sua empresa (business.facebook.com) e clique no ícone "Todas as ferramentas" na barra lateral esquerda.',
    tip: 'Certifique-se de estar conectado com a conta administradora da sua Página e Instagram.',
    link: 'https://business.facebook.com',
    linkLabel: 'Abrir Meta Business Suite'
  },
  {
    id: 'step_03_adicionar_app',
    image: '/tutorial/step_03_adicionar_app.png',
    phase: '2. Business Suite',
    title: 'Passo 3: Acessar Contas → Apps',
    badge: 'Business Suite',
    description: 'Em Configurações do Negócio, vá no menu esquerdo "Contas → Apps" e clique no botão azul "+ Adicionar" no topo da lista.',
    tip: 'Isso vincula o aplicativo de desenvolvedor à sua organização empresarial oficial.',
    link: 'https://business.facebook.com/settings/apps',
    linkLabel: 'Ir para Contas de Apps'
  },
  {
    id: 'step_04_conectar_id_app',
    image: '/tutorial/step_04_conectar_id_app.png',
    phase: '2. Business Suite',
    title: 'Passo 4: Escolher "Conectar um ID do app"',
    badge: 'Business Suite',
    description: 'No modal que abrir, clique na segunda opção (com ícone de etiqueta) intitulada "Conectar um ID do app" e cole o ID copiado no Passo 1.',
    tip: 'Após colar o ID, clique em Solicitar Ativo ou Vincular para finalizar a conexão.',
    link: null
  },
  {
    id: 'step_05_usuarios_sistema',
    image: '/tutorial/step_05_usuarios_sistema.png',
    phase: '3. Usuário do Sistema',
    title: 'Passo 5: Acessar Usuários do Sistema',
    badge: 'Business Suite',
    description: 'No menu lateral esquerdo do Business Settings, sob a seção "Usuários", clique na opção "Usuários do sistema".',
    tip: 'Usuários do sistema são robôs que geram tokens permanentes que NUNCA expiram.',
    link: 'https://business.facebook.com/settings/system-users',
    linkLabel: 'Ir para Usuários do Sistema'
  },
  {
    id: 'step_06_criar_webflow_bot',
    image: '/tutorial/step_06_criar_webflow_bot.png',
    phase: '3. Usuário do Sistema',
    title: 'Passo 6: Criar Usuário "WebFlow Bot" como Admin',
    badge: 'System User',
    description: 'Clique em Adicionar, nomeie o usuário como "WebFlow Bot" e selecione rigorosamente a função "Administrador".',
    tip: 'A função Admin é indispensável para que o bot tenha permissão de ler directs e postar comentários.',
    link: null
  },
  {
    id: 'step_07_clicar_atribuir_ativos',
    image: '/tutorial/step_07_clicar_atribuir_ativos.png',
    phase: '4. Atribuir Ativos',
    title: 'Passo 7: Clicar em "Atribuir Ativos"',
    badge: 'System User',
    description: 'Com o WebFlow Bot selecionado na lista de usuários do sistema, clique no botão superior "Atribuir ativos".',
    tip: 'Aqui você concede ao robô permissão formal para atuar em nome da sua Página, App e Instagram.',
    link: null
  },
  {
    id: 'step_08_selecionar_ativos',
    image: '/tutorial/step_08_selecionar_ativos.png',
    phase: '4. Atribuir Ativos',
    title: 'Passo 8: Selecionar os 3 Tipos de Ativos',
    badge: 'Atribuição',
    description: 'Navegue pelas 3 abas da coluna esquerda: 1. Páginas, 2. Apps e 3. Contas do Instagram. Marque a caixinha do seu ativo em cada uma delas.',
    tip: 'É obrigatório selecionar os três para sincronização total de DMs e Reels.',
    link: null
  },
  {
    id: 'step_09_acesso_total',
    image: '/tutorial/step_09_acesso_total.png',
    phase: '4. Atribuir Ativos',
    title: 'Passo 9: Conceder "Acesso Total: Tudo"',
    badge: 'Permissões',
    description: 'Na coluna direita de permissões, role até o final e ative a chave "Acesso total (Tudo)". Em seguida, clique no botão azul "Salvar alterações".',
    tip: 'A Meta exibirá uma confirmação verde de ativos atribuídos com sucesso.',
    link: null
  },
  {
    id: 'step_10_clicar_gerar_token',
    image: '/tutorial/step_10_clicar_gerar_token.png',
    phase: '5. Token Permanente',
    title: 'Passo 10: Ativos Conectados → Clicar em "Gerar Token"',
    badge: 'Gerar Token',
    description: 'Com os ativos atribuídos, clique no botão "Gerar token" localizado ao lado de Atribuir ativos.',
    tip: 'Esse assistente criará a sua chave permanente que dispensa login manual periódico.',
    link: null
  },
  {
    id: 'step_11_selecionar_app_token',
    image: '/tutorial/step_11_selecionar_app_token.png',
    phase: '5. Token Permanente',
    title: 'Passo 11: Selecionar o Aplicativo WebFlow',
    badge: 'Gerar Token',
    description: 'No campo suspenso "Selecionar aplicativo", escolha o app "WebFlow Automação" que vinculamos e clique em Avançar.',
    tip: 'Certifique-se de que o nome do app confere com o que você criou no Passo 1.',
    link: null
  },
  {
    id: 'step_12_expiracao_nunca',
    image: '/tutorial/step_12_expiracao_nunca.png',
    phase: '5. Token Permanente',
    title: 'Passo 12: Definir Expiração do Token: NUNCA',
    badge: 'Permanente',
    description: 'REGRA DE OURO: No campo "Expiração do token", selecione obrigatoriamente a opção "Nunca". Depois clique em Avançar.',
    tip: 'Se você selecionar 60 dias, sua automação parará de funcionar após 2 meses. Escolha "Nunca" para estabilidade permanente.',
    link: null
  },
  {
    id: 'step_13_marcar_permissoes',
    image: '/tutorial/step_13_marcar_permissoes.png',
    phase: '5. Token Permanente',
    title: 'Passo 13: Marcar Todas as Permissões Oficiais',
    badge: 'Permissões API',
    description: 'Marque rigorosamente as permissões: instagram_manage_messages, instagram_manage_comments, instagram_basic e pages_manage_metadata.',
    tip: 'Essas 4 permissões oficiais habilitam resposta de comentários com Spintax, envio de DMs e verificação de seguidores.',
    link: null
  },
  {
    id: 'step_14_token_gerado_copiar',
    image: '/tutorial/step_14_token_gerado_copiar.png',
    phase: '5. Token Permanente',
    title: 'Passo 14: Token Permanente Gerado com Sucesso',
    badge: 'Token Copiado',
    description: 'Clique no botão azul "Copiar" para armazenar o token permanente com segurança no seu dispositivo.',
    tip: '🔒 Proteção de Privacidade: O código confidencial do token foi totalmente mascarado nesta demonstração para garantir conformidade de segurança.',
    link: null
  },
  {
    id: 'step_15_configurar_webhook',
    image: '/tutorial/step_15_configurar_webhook.png',
    phase: '6. Webhooks',
    title: 'Passo 15: Configurar Webhook no Meta Developers',
    badge: 'Webhooks',
    description: 'No portal Meta Developers, acesse Webhooks → Instagram, cole o URL de Callback do WebFlow, insira o Token de Verificação e assine "messages" e "comments".',
    tip: 'URL do Webhook: https://webflow-app-b25.pages.dev/api/webhook',
    link: 'https://developers.facebook.com',
    linkLabel: 'Painel de Webhooks'
  },
  {
    id: 'step_16_localizar_page_id',
    image: '/tutorial/step_16_localizar_page_id.png',
    phase: '7. Conectar ao WebFlow',
    title: 'Passo 16: Localizar o ID da Página de Facebook',
    badge: 'Page ID',
    description: 'Acesse as Configurações da sua Página de Facebook no Business Suite e copie o número de identificação da página (Page ID).',
    tip: 'O Page ID conecta os comentários dos Reels com os envios no Direct.',
    link: 'https://business.facebook.com/settings/pages',
    linkLabel: 'Ver Páginas no Business Suite'
  },
  {
    id: 'step_17_salvar_webflow',
    image: '/tutorial/step_17_salvar_webflow.png',
    phase: '7. Conectar ao WebFlow',
    title: 'Passo 17: Colar Credenciais e Salvar no WebFlow',
    badge: 'Conectado',
    description: 'Cole o Token Permanente e o Page ID nos campos da aba Canais Meta e clique em "Salvar Credenciais da Meta com Segurança".',
    tip: 'Pronto! Seu WebFlow agora está 100% conectado e pronto para responder comentários e enviar DMs automaticamente.',
    link: null
  }
];

export const MetaSetupVisualGuide = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const step = TUTORIAL_STEPS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < TUTORIAL_STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText('https://webflow-app-b25.pages.dev/api/webhook');
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // Suporte a teclas de seta
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxOpen && e.key === 'Escape') {
        setLightboxOpen(false);
      } else if (e.key === 'ArrowRight') {
        if (currentStepIndex < TUTORIAL_STEPS.length - 1) {
          setCurrentStepIndex(prev => prev + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentStepIndex > 0) {
          setCurrentStepIndex(prev => prev - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStepIndex, lightboxOpen]);

  return (
    <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 shadow-sm space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-200 dark:border-rose-800 shadow-2xs">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold font-heading text-slate-900 dark:text-white">
                Guia Visual com Telas Reais: Configuração Meta Passo a Passo
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                17 Telas Reais Anotadas
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Siga cada seta vermelha e caixas de destaque para configurar seu robô sem nenhuma chance de erro.
            </p>
          </div>
        </div>

        {/* Badge de Privacidade & Anonimização */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 text-xs">
          <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
            Tokens e dados pessoais 100% blindados e protegidos
          </span>
        </div>
      </div>

      {/* Seletor Rápido de Fases & Passos */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {TUTORIAL_STEPS.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentStepIndex(idx)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              idx === currentStepIndex
                ? 'bg-rose-600 text-white shadow-xs scale-102'
                : idx < currentStepIndex
                ? 'bg-emerald-50 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-slate-700'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <span>{idx + 1}</span>
            <span className="hidden sm:inline text-[11px] font-normal truncate max-w-[120px]">
              {s.title.replace(/Passo \d+: /, '')}
            </span>
          </button>
        ))}
      </div>

      {/* Área Central: Visualizador do Passo a Passo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Coluna Esquerda: Tela Anotada com Setas */}
        <div className="lg:col-span-8 space-y-3">
          <div className="relative group rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900 shadow-md">
            {/* Imagem do Passo Anotada com Sharp */}
            <img
              src={step.image}
              alt={step.title}
              className="w-full h-auto max-h-[540px] object-contain mx-auto select-none cursor-pointer transition-transform duration-300 group-hover:scale-[1.01]"
              onClick={() => setLightboxOpen(true)}
            />

            {/* Botão de Zoom Expandir no Hover */}
            <button
              onClick={() => setLightboxOpen(true)}
              className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white border border-slate-700 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity shadow-lg flex items-center gap-1.5 text-xs font-semibold"
              title="Expandir Imagem em Alta Resolução"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Expandir Zoom</span>
            </button>

            {/* Indicador do Passo na Imagem */}
            <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-slate-900/85 backdrop-blur-md border border-slate-700 text-white text-[11px] font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              <span>Passo {currentStepIndex + 1} de {TUTORIAL_STEPS.length}</span>
              <span className="text-slate-400">•</span>
              <span className="text-rose-400">{step.badge}</span>
            </div>
          </div>

          {/* Barra de Controles Anterior / Próximo */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Passo Anterior</span>
            </button>

            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Use as setas do teclado ← e → para navegar
            </span>

            <button
              onClick={handleNext}
              disabled={currentStepIndex === TUTORIAL_STEPS.length - 1}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-semibold text-white shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <span>Próximo Passo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Coluna Direita: Instruções Didáticas & Ações Diretas */}
        <div className="lg:col-span-4 space-y-4">
          {/* Card Didático */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-750 space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                  {step.phase}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">
                  {currentStepIndex + 1}/{TUTORIAL_STEPS.length}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading mt-2">
                {step.title}
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {step.description}
            </p>

            {/* Dica de Ouro */}
            {step.tip && (
              <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-[11px] uppercase tracking-wider text-blue-700 dark:text-blue-300">
                    Dica Importante:
                  </span>
                  <p className="text-[11px] leading-relaxed text-blue-800 dark:text-blue-200">
                    {step.tip}
                  </p>
                </div>
              </div>
            )}

            {/* Botões de Ação Rápida */}
            <div className="pt-2 space-y-2">
              {step.link && (
                <a
                  href={step.link}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-xs transition-colors"
                >
                  <span>{step.linkLabel || 'Abrir Página Oficial'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {step.id === 'step_15_configurar_webhook' && (
                <button
                  onClick={copyWebhookUrl}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  {copiedUrl ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedUrl ? 'URL do Webhook Copiada!' : 'Copiar URL do Webhook'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Checklist Resumo de Progresso */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-750 text-xs space-y-2.5">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Etapas da Conexão</span>
            </h4>
            <div className="space-y-1.5 text-[11px]">
              <div className={`flex items-center justify-between p-1.5 rounded ${currentStepIndex >= 0 ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400'}`}>
                <span>1. Criar App & Copiar ID</span>
                <span>{currentStepIndex >= 3 ? '✓' : 'Passo 1-4'}</span>
              </div>
              <div className={`flex items-center justify-between p-1.5 rounded ${currentStepIndex >= 4 ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400'}`}>
                <span>2. Usuário WebFlow Bot Admin</span>
                <span>{currentStepIndex >= 6 ? '✓' : 'Passo 5-6'}</span>
              </div>
              <div className={`flex items-center justify-between p-1.5 rounded ${currentStepIndex >= 7 ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400'}`}>
                <span>3. Atribuir Páginas, Apps & IG</span>
                <span>{currentStepIndex >= 9 ? '✓' : 'Passo 7-9'}</span>
              </div>
              <div className={`flex items-center justify-between p-1.5 rounded ${currentStepIndex >= 10 ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400'}`}>
                <span>4. Gerar Token Permanente (Nunca)</span>
                <span>{currentStepIndex >= 13 ? '✓' : 'Passo 10-14'}</span>
              </div>
              <div className={`flex items-center justify-between p-1.5 rounded ${currentStepIndex >= 14 ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400'}`}>
                <span>5. Assinar Webhooks (DMs & Comentários)</span>
                <span>{currentStepIndex >= 15 ? '✓' : 'Passo 15-16'}</span>
              </div>
              <div className={`flex items-center justify-between p-1.5 rounded ${currentStepIndex >= 16 ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-slate-400'}`}>
                <span>6. Conectar ao WebFlow</span>
                <span>{currentStepIndex === 16 ? '✓ Ativo' : 'Passo 17'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox / Modal Full-screen de Zoom */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 md:p-8 animate-in fade-in duration-200"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Header do Lightbox */}
          <div className="flex items-center justify-between text-white pb-3 border-b border-slate-800" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <div>
                <h3 className="text-sm md:text-base font-bold font-heading">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-400">
                  {step.description}
                </p>
              </div>
            </div>

            <button
              onClick={() => setLightboxOpen(false)}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <X className="w-5 h-5" />
              <span className="hidden sm:inline">Fechar (ESC)</span>
            </button>
          </div>

          {/* Imagem Central Expandida */}
          <div className="flex-1 flex items-center justify-center p-2 overflow-hidden" onClick={e => e.stopPropagation()}>
            <img
              src={step.image}
              alt={step.title}
              className="max-h-[85vh] max-w-full object-contain rounded-xl shadow-2xl border border-slate-800 select-none"
            />
          </div>

          {/* Footer do Lightbox com Navegação */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-white" onClick={e => e.stopPropagation()}>
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            <span className="text-xs text-slate-400 font-mono">
              Passo {currentStepIndex + 1} de {TUTORIAL_STEPS.length}
            </span>

            <button
              onClick={handleNext}
              disabled={currentStepIndex === TUTORIAL_STEPS.length - 1}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-semibold transition-colors"
            >
              <span>Próximo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
