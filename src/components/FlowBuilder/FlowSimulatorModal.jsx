import React, { useState } from 'react';
import { X, Send, RotateCcw, Smartphone, ShieldCheck, CheckCircle2, Sparkles, HelpCircle, UserCheck, Lock, Unlock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FlowSimulatorModal = ({ onClose }) => {
  const { flows, selectedFlowId } = useApp();
  const currentFlow = flows.find(f => f.id === selectedFlowId) || flows[0];

  const [inputVal, setInputVal] = useState('LISTA');
  const [simMode, setSimMode] = useState('follower_gate'); // 'follower_gate' | 'standard'
  const [isFollowingUser, setIsFollowingUser] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'system',
      text: 'Simulação ao vivo. Comente no Reel abaixo como se fosse um seguidor no Instagram:'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [logTrace, setLogTrace] = useState([
    'Iniciando motor WebFlow com Trava de Seguidor...',
    'Aguardando comentário no Reel...'
  ]);

  const handleSendMessage = () => {
    if (!inputVal.trim()) return;
    const userText = inputVal.trim();
    setInputVal('');

    // Adiciona comentário do usuário
    setMessages(prev => [
      ...prev,
      { id: Date.now(), sender: 'user', text: `Comentou no Reel: "${userText}"` }
    ]);

    setLogTrace(prev => [
      ...prev,
      `[1. Comentário Detectado] Seguidor comentou "${userText}".`,
      `[2. Escudo Anti-Ban] Sorteando 1 de 8 variações de Spintax para resposta pública no Reel...`,
      `[3. Atraso Jitter] Aguardando 12s programados (simulando digitação humana)...`
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
            text: 'Oi! Preparei esse material com muito carinho exclusivamente para quem me acompanha aqui no Instagram 🎁 Dá um pulinho no meu perfil @ygorweb, começa a me seguir e depois toca no botão abaixo pra eu te enviar na hora 👇',
            buttonText: '✅ Já estou te seguindo!',
            isGate: true
          }
        ]);
        setLogTrace(prev => [
          ...prev,
          `[4. Trava de Seguidor Disparada] Mensagem de convite amigável enviada.`,
          `[5. Aguardando Confirmação] O link fica travado até o usuário começar a seguir.`
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
    }, 1200);
  };

  const handleButtonClick = (isGate) => {
    const btnLabel = isGate ? '✅ Já estou te seguindo!' : '👉 Liberar Meu Acesso Agora';
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
              text: 'Opa! Vi aqui que você ainda não começou a me seguir 👀 Dá um pulinho lá no perfil @ygorweb rapidinho, clica em Seguir e aperta no botão de novo que eu já te libero na hora!',
              buttonText: '✅ Já estou te seguindo!',
              isGate: true
            }
          ]);
          setLogTrace(prev => [
            ...prev,
            `[Checagem de Seguidor] Usuário clicou mas AINDA NÃO segue @ygorweb.`,
            `[Trava Mantida] O link NÃO foi liberado. Lembrete amigável enviado.`,
            `[Crescimento Orgânico] Lead direcionado a seguir seu perfil.`
          ]);
        } else {
          // Liberado humanizado: seguiu de verdade!
          setMessages(prev => [
            ...prev,
            {
              id: Date.now() + 1,
              sender: 'bot',
              text: 'Show de bola! Muito obrigado por acompanhar meu trabalho! 🎉 Aqui está o seu acesso direto com todos os detalhes: 📲 https://wa.me/5511999998888?text=QueroMeuAcesso',
              url: 'https://wa.me/5511999998888?text=QueroMeuAcesso'
            }
          ]);
          setLogTrace(prev => [
            ...prev,
            `[Checagem de Seguidor] Confirmado! Usuário agora é seguidor oficial de @ygorweb.`,
            `[Trava Desbloqueada] Material liberado com sucesso!`,
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
          text: 'Perfeito! Como você confirmou, aqui está o seu acesso direto ao material e grupo VIP no WhatsApp: 📲 https://wa.me/5511999998888',
          url: 'https://wa.me/5511999998888'
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
      { id: 1, sender: 'system', text: 'Simulação reiniciada. Comente a palavra-chave configurada:' }
    ]);
    setLogTrace([
      'Reiniciando simulador...',
      'Aguardando novo comentário...'
    ]);
    setInputVal('LISTA');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="w-full max-w-4xl h-[670px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex overflow-hidden">
        {/* Lado Esquerdo: Simulador de Celular Realista */}
        <div className="w-[370px] bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between shrink-0">
          {/* Topo do Celular (Instagram Direct Header) */}
          <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img 
                src="/logo.jpg" 
                alt="WebFlow" 
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

                    {m.url && (
                      <a
                        href={m.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block mt-2 text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-bold"
                      >
                        Abrir no WhatsApp ↗
                      </a>
                    )}
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
              placeholder="Digite LISTA..."
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
        <div className="flex-1 p-6 flex flex-col justify-between bg-white dark:bg-slate-900">
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
