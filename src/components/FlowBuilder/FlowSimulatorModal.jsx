import React, { useState } from 'react';
import { X, Send, RotateCcw, Smartphone, ShieldCheck, CheckCircle2, Sparkles, HelpCircle, UserCheck, Lock, Unlock, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FlowSimulatorModal = ({ onClose }) => {
  const { flows, selectedFlowId, triggers } = useApp();
  const currentFlow = flows.find(f => f.id === selectedFlowId) || flows[0];

  // Recupera nós reais configurados pelo usuário no FlowBuilder
  const gateNode = currentFlow?.nodes?.find(n => n.type === 'follower_gate');
  const deliveryNode = currentFlow?.nodes?.find(n => n.type === 'message' || n.id === 'node_send_link');
  const triggerNode = currentFlow?.nodes?.find(n => n.type === 'trigger');
  const activeTrigger = triggers?.find(t => t.flowId === currentFlow?.id) || triggers?.[0];

  // Textos dinâmicos exatos definidos pelo usuário
  const keyword = triggerNode?.data?.keyword || activeTrigger?.keyword || 'LISTA';
  const gateMessage = gateNode?.data?.text?.replace(/\{\{first_name\}\}/g, 'Visitante') || 'Me segue aí pra mim te enviar ingrato(a) Tô postando video assim toda semana 🚀';
  const gateButtonLabel = gateNode?.data?.buttons?.[0]?.title || 'Já estou te seguindo!';
  const gateFallbackText = gateNode?.data?.fallbackText || 'Opa! Vi aqui que você ainda não começou a me seguir 👀 Dá um pulinho no meu perfil @ygorweb, começa a me seguir e depois clica no botão de novo que eu já te libero na hora!';

  const deliveryMessage = deliveryNode?.data?.text?.replace(/\{\{first_name\}\}/g, 'Visitante') || 'Ta na mão! Link seguro liberado 🚀';
  const deliveryButtons = deliveryNode?.data?.buttons || [];
  const primaryDeliveryUrl = deliveryButtons[0]?.url || (deliveryMessage.match(/https?:\/\/[^\s]+/)?.[0] || '');

  const [inputVal, setInputVal] = useState(keyword);
  const [simMode, setSimMode] = useState('follower_gate'); // 'follower_gate' | 'standard'
  const [mobileTab, setMobileTab] = useState('phone'); // 'phone' | 'logs'
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'system',
      text: `Simulação ao vivo. Comente a palavra-chave "${keyword}" no Reel como se fosse um seguidor:`
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [logTrace, setLogTrace] = useState([
    'Iniciando motor WebFlow com Trava de Seguidor...',
    `Aguardando comentário com palavra-chave "${keyword}" no Reel...`
  ]);

  const handleSendMessage = () => {
    if (!inputVal.trim()) return;
    const userText = inputVal.trim();
    setInputVal('');

    // Adiciona comentário do seguidor
    setMessages(prev => [
      ...prev,
      { id: Date.now(), sender: 'user', text: `Comentou no Reel: "${userText}"` }
    ]);

    setLogTrace(prev => [
      ...prev,
      `[1. Comentário Detectado] Seguidor comentou "${userText}".`,
      `[2. Escudo Anti-Ban] Sorteando resposta humanizada de Spintax para o comentário público...`,
      `[3. Atraso Jitter] Aguardando intervalo de segurança para simular digitação humana...`
    ]);

    setIsTyping(true);

    // Simula resposta do bot após delay
    setTimeout(() => {
      setIsTyping(false);
      if (simMode === 'follower_gate') {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            text: gateMessage,
            buttonText: gateButtonLabel,
            isGate: true
          }
        ]);
        setLogTrace(prev => [
          ...prev,
          `[4. 1ª DM: Trava de Seguidor Disparada] Enviando mensagem configurada no fluxo.`,
          `[5. Aguardando Confirmação] O link fica 100% retido até o usuário começar a seguir @ygorweb.`
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: 'bot',
            text: 'Oi! Vi que você comentou no vídeo querendo o material exclusivo. Para liberar o seu acesso agora, toque no botão abaixo 👇',
            buttonText: '👉 Liberar Meu Acesso Agora',
            isGate: false
          }
        ]);
        setLogTrace(prev => [
          ...prev,
          `[4. 1ª DM Privada Enviada] Disparada caixa com botão interativo (SEM LINK DIRETO para evitar bloqueio).`,
          `[5. Status Meta] Aguardando clique do usuário para abrir legalmente a Janela de 24 Horas.`
        ]);
      }
    }, 1100);
  };

  const handleButtonClick = (isGate) => {
    const btnLabel = isGate ? gateButtonLabel : '👉 Liberar Meu Acesso Agora';
    setMessages(prev => [
      ...prev,
      { id: Date.now(), sender: 'user', text: `[Clicou no botão: ${btnLabel}]` }
    ]);

    setIsTyping(true);

    if (isGate) {
      setTimeout(() => {
        setIsTyping(false);
        if (!isFollowingUser) {
          // Bloqueado humanizado: ainda não seguiu!
          setMessages(prev => [
            ...prev,
            {
              id: Date.now() + 1,
              sender: 'bot',
              text: gateFallbackText,
              buttonText: gateButtonLabel,
              isGate: true
            }
          ]);
          setLogTrace(prev => [
            ...prev,
            `[Checagem de Seguidor] Usuário clicou no botão mas AINDA NÃO segue @ygorweb.`,
            `[Trava Mantida] O link NÃO foi liberado. Mensagem de lembrete enviada.`,
            `[Crescimento Orgânico] Lead convidado amigavelmente a seguir para desbloquear.`
          ]);
        } else {
          // Liberado humanizado: seguiu de verdade!
          setMessages(prev => [
            ...prev,
            {
              id: Date.now() + 1,
              sender: 'bot',
              text: deliveryMessage,
              url: primaryDeliveryUrl,
              buttons: deliveryButtons
            }
          ]);
          setLogTrace(prev => [
            ...prev,
            `[Checagem de Seguidor] Confirmado! Usuário agora é seguidor oficial de @ygorweb.`,
            `[Trava Desbloqueada] 2ª DM de Entrega disparada com sucesso!`,
            `[Tag Aplicada] Adicionada tag "seguidor_confirmado".`,
            `[Entrega Segura] Link enviado diretamente na caixa de entrada principal.`
          ]);
        }
      }, 900);
      return;
    }

    setLogTrace(prev => [
      ...prev,
      `[6. Micro-Compromisso Concluído!] Usuário tocou no botão de confirmação.`,
      `[7. Janela de 24 Horas Meta ABERTA] O Direct registrou interação consentida!`,
      `[8. Tag Aplicada] Lead etiquetado como "lead_qualificado_reels".`
    ]);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: deliveryMessage,
          url: primaryDeliveryUrl,
          buttons: deliveryButtons
        }
      ]);
      setLogTrace(prev => [
        ...prev,
        `[9. Link Seguro Entregue] Mensagem entregue na caixa principal do seguidor (0% risco de spam).`
      ]);
    }, 800);
  };

  const handleReset = () => {
    setMessages([
      { id: 1, sender: 'system', text: `Simulação reiniciada. Comente a palavra-chave "${keyword}":` }
    ]);
    setLogTrace([
      'Reiniciando simulador...',
      `Aguardando novo comentário com "${keyword}"...`
    ]);
    setInputVal(keyword);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-4xl h-[92vh] sm:h-[670px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative">
        {/* Mobile Tab Bar */}
        <div className="md:hidden flex items-center justify-between p-2 border-b border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-850 shrink-0">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMobileTab('phone')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                mobileTab === 'phone'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              📱 Celular Direct
            </button>
            <button
              onClick={() => setMobileTab('logs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                mobileTab === 'logs'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              ⚙️ Logs do Motor REA
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lado Esquerdo: Simulador de Celular Realista */}
        <div className={`w-full md:w-[370px] bg-slate-50 dark:bg-slate-950 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between shrink-0 h-full overflow-hidden ${mobileTab === 'phone' ? 'flex' : 'hidden md:flex'}`}>
          {/* Topo do Celular (Instagram Direct Header) */}
          <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <img 
                src="/avatar_ygorweb.jpg" 
                alt="Ygor Souza (@ygorweb)" 
                className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700" 
              />
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">@ygorweb</p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Online no Direct
                </p>
              </div>
            </div>

            <button onClick={handleReset} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800" title="Reiniciar">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Seletor de Modo & Teste de Seguidor */}
          <div className="p-2.5 bg-slate-100 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-700 dark:text-slate-300">Modo do Teste:</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSimMode('follower_gate')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                    simMode === 'follower_gate' 
                      ? 'bg-indigo-600 text-white shadow-xs' 
                      : 'bg-white dark:bg-slate-750 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  🔒 Trava de Seguidor
                </button>
                <button
                  onClick={() => setSimMode('standard')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                    simMode === 'standard' 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : 'bg-white dark:bg-slate-750 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  🛡️ Anti-Ban Normal
                </button>
              </div>
            </div>

            {simMode === 'follower_gate' && (
              <label className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer select-none transition-colors hover:border-indigo-300">
                <input
                  type="checkbox"
                  checked={isFollowingUser}
                  onChange={(e) => setIsFollowingUser(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  {isFollowingUser ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Unlock className="w-3.5 h-3.5" /> Seguidor Já Segue @ygorweb
                    </span>
                  ) : (
                    <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> NÃO Segue (Testar Bloqueio)
                    </span>
                  )}
                </span>
              </label>
            )}
          </div>

          {/* Área de Balões do Instagram Direct */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3">
            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                {m.sender === 'system' ? (
                  <div className="w-full text-center py-2 text-[11px] text-slate-500 bg-slate-100 dark:bg-slate-900 rounded-lg">
                    {m.text}
                  </div>
                ) : (
                  <div className={`max-w-[85%] p-3 rounded-2xl text-xs ${
                    m.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-xs shadow-xs font-medium' 
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-xs border border-slate-200 dark:border-slate-700 shadow-xs'
                  }`}>
                    <p className="leading-relaxed whitespace-pre-line">{m.text}</p>
                    
                    {/* Botão Interativo da Caixinha / Trava */}
                    {m.buttonText && (
                      <button
                        onClick={() => handleButtonClick(m.isGate)}
                        className={`w-full mt-2.5 py-2 px-3 rounded-xl text-white font-bold text-[11px] shadow-xs transition-transform active:scale-95 text-center flex items-center justify-center gap-1.5 ${
                          m.isGate ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                      >
                        <span>{m.buttonText}</span>
                      </button>
                    )}

                    {/* Botões Dinâmicos da 2ª DM (Entrega de Links Reais) */}
                    {m.buttons && m.buttons.length > 0 ? (
                      <div className="mt-2.5 space-y-1.5">
                        {m.buttons.map((b, idx) => (
                          <a
                            key={idx}
                            href={b.url || '#'}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow-xs text-center flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <span>{b.title}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ))}
                      </div>
                    ) : m.url ? (
                      <a
                        href={m.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 mt-2 text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-bold"
                      >
                        <span>Abrir Link Seguro</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : null}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white dark:bg-slate-800 text-slate-400 text-xs w-20 border border-slate-200 dark:border-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}
          </div>

          {/* Input do Chat do Seguidor */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={`Digite ${keyword}...`}
              className="flex-1 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white font-bold uppercase focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Lado Direito: Console de Auditoria e Explicação Passo a Passo */}
        <div className={`flex-1 p-4 sm:p-6 flex-col justify-between bg-white dark:bg-slate-900 overflow-y-auto h-full ${mobileTab === 'logs' ? 'flex' : 'hidden md:flex'}`}>
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Monitor Anti-Bloqueio & Trava de Seguidor
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Processamento seguro de micro-compromisso para crescimento de seguidores orgânicos.
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-slate-700 dark:text-slate-300 space-y-2 h-[410px] overflow-y-auto">
              {logTrace.map((log, lidx) => (
                <div key={lidx} className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 select-none font-bold">&gt;</span>
                  <span className={
                    log.includes('Confirmado') || log.includes('Desbloqueada') ? 'text-emerald-600 dark:text-emerald-400 font-bold' :
                    log.includes('AINDA NÃO') || log.includes('Mantida') ? 'text-rose-600 dark:text-rose-400 font-bold' :
                    log.includes('Anti-Ban') || log.includes('Trava') ? 'text-amber-600 dark:text-amber-400 font-semibold' : ''
                  }>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-0.5">
              <p className="font-bold text-slate-900 dark:text-white">Fluxo Humanizado de Alta Conversão</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Sem jargões robóticos. Comunicação direta, calorosa e engajadora.
              </p>
            </div>
            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition-colors">
              Fechar Simulador
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
