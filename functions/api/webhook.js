// Cloudflare Pages Function: Webhook Oficial da Meta (Instagram Direct & Comentários)
// REA: Arquitetura Estilo ManyChat com Trava Rigorosa de Seguidor, Kill-Switch Global e Zero Mensagens Não-Solicitadas

const PUBLIC_REPLIES = [
  "Acabei de te enviar no direct! Dá uma olhada 🚀",
  "Prontinho, já mandei lá nas suas mensagens ✨",
  "Dá uma olhadinha no seu direct, preparei tudo pra você! 📩",
  "Enviado com sucesso! Confere lá nas mensagens privadas 😉",
  "Te chamei no direct com todos os detalhes! 📲",
  "Chegou aí? Acabei de te mandar lá no chat 💥",
  "Informações enviadas! Confere a sua caixa de entrada 📥",
  "Mandei lá no direct, aproveita! 🎯"
];

const DEFAULT_STATE = {
  is_active: false,
  keyword: 'LISTA',
  delaySeconds: 15,
  antiBanJitter: 8,
  firstDmTitle: 'Me segue ai pra min te enviar ingrato(a) 🚀',
  firstDmSubtitle: 'Tô postando vídeo assim toda semana! Clica no botão abaixo pra liberar o link 👇',
  firstDmText: 'Tô postando vídeo assim toda semana! Clica no botão abaixo pra liberar o link 👇',
  buttonText: '✅ Já estou te seguindo!',
  finalLinkMessage: `Tá na mão🚀 \nhttps://x.com/Ithielix/status/2109527114760208745\n\nLink do melhor mousepad de 2026 🏆\nhttps://vt.tiktok.com/ZS9UR1CkPgovL-hgiWV/`,
  travaReminder: `Opa! Vi aqui que você ainda não começou a me seguir 👀\n\nDá um pulinho lá no perfil @ygorweb rapidinho, clica em Seguir e aperta no botão de novo que eu já te libero na hora!`
};

const CF_ACCOUNT_ID = 'be7db94a293732762035a5c23126dfae';
const CF_KV_ID = '6ffd8aa59e6a43ebaee8c87a7dd5ceb1';

async function getStoredState(env) {
  if (env && env.WEBFLOW_KV) {
    try {
      const stored = await env.WEBFLOW_KV.get('FLOW_STATE');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
  }

  const token = env?.CLOUDFLARE_API_TOKEN || env?.CF_TOKEN;
  if (!token) return null;

  try {
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${CF_KV_ID}/values/FLOW_STATE`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const text = await res.text();
      return JSON.parse(text);
    }
  } catch (e) {}

  return null;
}

// Casamento flexível para palavras-chave (suporta emojis, acentos e pontuação)
function matchesKeyword(text, keywordString) {
  if (!text || !keywordString) return false;
  const keywords = String(keywordString).split(/[,;|]/).map(k => k.trim().toLowerCase()).filter(Boolean);
  const cleanText = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return keywords.some(kw => {
    const cleanKw = kw.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|[^a-z0-9])${cleanKw}([^a-z0-9]|$)`, 'i');
    return regex.test(cleanText);
  });
}

function smartMetaCardSubtitle(str) {
  if (!str) return '';
  str = str.trim();
  if (str.length <= 80) return str;
  // Otimização de segurança: preserva emoji no final substituindo "seu link" por "o link"
  let opt = str.replace(/\bseu link\b/gi, 'o link').replace(/\s+/g, ' ');
  if (opt.length <= 80) return opt;
  // Truncamento seguro que nunca corta par substituto de emoji
  let sliced = opt.slice(0, 80);
  const lastCode = sliced.charCodeAt(sliced.length - 1);
  if (lastCode >= 0xD800 && lastCode <= 0xDBFF) {
    sliced = sliced.slice(0, -1);
  }
  return sliced.trim();
}

function formatMetaButtonTitle(str) {
  if (!str) return '✅ Já estou seguindo';
  str = String(str).trim();
  if (str.length <= 20) return str;

  if (/já\s+estou\s+te\s+seguindo/i.test(str)) {
    return '✅ Já estou seguindo'; // 19 caracteres exatos!
  }
  if (/estou\s+te\s+seguindo/i.test(str)) {
    return 'Já estou seguindo'; // 17 caracteres exatos!
  }
  if (/já\s+te\s+sigo/i.test(str)) {
    return '✅ Já te sigo!'; // 12 caracteres!
  }

  let clean = str.replace(/[!?.]$/, '').trim();
  if (clean.length <= 20) return clean;

  let truncated = clean.slice(0, 20);
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > 8) {
    truncated = truncated.slice(0, lastSpace);
  }
  return truncated.trim() || 'Já estou seguindo';
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const mode = url.searchParams.get('hub.mode');
  const token = url.searchParams.get('hub.verify_token');
  const challenge = url.searchParams.get('hub.challenge');

  const EXPECTED_TOKEN = env.META_VERIFY_TOKEN || 'webflow_meta_token_secret_2026';

  if (mode === 'subscribe' && (token === EXPECTED_TOKEN || token === 'webflow_meta_token_secret_2026')) {
    return new Response(challenge, {
      status: 200,
      headers: { 
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store'
      }
    });
  }

  return new Response('Forbidden', { status: 403 });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const PAGE_TOKEN = env.META_PAGE_ACCESS_TOKEN || 'EAAdPoo2JfNUBSrpDVADHAZBWNClCWCaLngml0bbTRS5dv0I8RX4jceRChZBi3pZBkg6xmr3MIfMQSTvvMMLJG8RP4lfn97w2M0xZAbdWFA9BETDkfzfjP3MMlO1eoIMAehygJsCdinlt1g2w1Vqx3lZBnb0ZBmHUti2plKKatMZClKW2SIKL3jGwXOwipcvk65pZCHHbK0dB';
  const MY_PAGE_ID = '1299815346552748';
  const MY_IG_ID = '17841428469294913';

  try {
    // 1. CARREGAMENTO DO ESTADO GLOBAL DA AUTOMAÇÃO (KILL-SWITCH VIA KV COM FALLBACK)
    const stored = await getStoredState(env);
    const state = stored ? { ...DEFAULT_STATE, ...stored } : DEFAULT_STATE;

    // REGRA DE SEGURANÇA 1: SE A AUTOMAÇÃO ESTIVER DESLIGADA NO WEBFLOW, ABORTA IMEDIATAMENTE!
    if (!state.is_active) {
      console.log('[WebFlow Webhook] Automação DESLIGADA no painel. Nenhum disparo permitido.');
      return new Response('AUTOMATION_DISABLED', {
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    const payload = await request.json();
    if (!payload || (payload.object !== 'instagram' && payload.object !== 'page')) {
      return new Response('EVENT_RECEIVED', { status: 200 });
    }

    const entries = payload.entry || [];
    for (const entry of entries) {
      
      // =========================================================================
      // 2. PROCESSAMENTO DE COMENTÁRIOS EM POSTS / REELS
      // =========================================================================
      if (entry.changes) {
        for (const change of entry.changes) {
          if (change.field === 'comments') {
            const commentData = change.value;
            const commentText = (commentData.text || '').trim();
            const username = commentData.from?.username;

            // Ignora comentários feitos pelo próprio dono da conta (@ygorweb)
            if (!username || username.toLowerCase() === 'ygorweb') continue;

            // REGRA DE SEGURANÇA 2: CASAMENTO FLEXÍVEL DE PALAVRA-CHAVE (suporta emojis e pontuações)
            if (!matchesKeyword(commentText, state.keyword)) {
              continue; // Comentário comum sem a palavra-chave. NÃO FAZ NADA!
            }

            // Suporte aos textos configurados pelo usuário
            const firstDmText = state.firstDmSubtitle || state.firstDmText || "Tô postando vídeo assim toda semana! Clica no botão abaixo pra liberar o link 👇";
            const rawTitle = state.firstDmTitle || "Só me seguir e clicar no botão pra min não tomar ban";
            const firstDmTitle = rawTitle.length <= 80 ? rawTitle : rawTitle.slice(0, 80);
            const firstDmSubtitle = smartMetaCardSubtitle(firstDmText);
            const rawBtn = state.buttonText || "✅ Já estou seguindo";
            const buttonText = formatMetaButtonTitle(rawBtn);

            // Envia a Caixinha Interativa (Generic Template) com o botão nativo da Meta
            const caixinhaPayload = {
              recipient: { comment_id: commentData.id },
              message: {
                attachment: {
                  type: "template",
                  payload: {
                    template_type: "generic",
                    elements: [
                      {
                        title: firstDmTitle,
                        subtitle: firstDmSubtitle,
                        buttons: [
                          {
                            type: "postback",
                            title: buttonText,
                            payload: "FOLLOW_CONFIRMED"
                          }
                        ]
                      }
                    ]
                  }
                }
              }
            };

            let dmSuccess = false;
            try {
              const dmRes = await fetch(`https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_TOKEN}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(caixinhaPayload)
              });
              const dmJson = await dmRes.json();
              if (dmJson.message_id) {
                dmSuccess = true;
              } else {
                // Fallback se template genérico não for suportado no direct do usuário
                const fbRes = await fetch(`https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_TOKEN}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    recipient: { comment_id: commentData.id },
                    message: {
                      text: firstDmTitle ? `${firstDmTitle}\n\n${firstDmText}` : firstDmText,
                      quick_replies: [
                        {
                          content_type: "text",
                          title: buttonText,
                          payload: "FOLLOW_CONFIRMED"
                        }
                      ]
                    }
                  })
                });
                const fbJson = await fbRes.json();
                if (fbJson.message_id) dmSuccess = true;
              }
            } catch (e) {
              console.error('Erro ao enviar DM privada para o comentário:', e);
            }

            // Resposta pública humanizada no comentário (APENAS se a DM teve sucesso!)
            if (dmSuccess) {
              try {
                const replyText = PUBLIC_REPLIES[Math.floor(Math.random() * PUBLIC_REPLIES.length)];
                await fetch(`https://graph.facebook.com/v21.0/${commentData.id}/replies?access_token=${PAGE_TOKEN}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ message: replyText })
                });
              } catch (e) {
                console.error('Erro ao enviar resposta pública no comentário:', e);
              }
            }
          }
        }
      }

      // =========================================================================
      // 3. PROCESSAMENTO DE MENSAGENS NO DIRECT (DM)
      // REGRA MÁXIMA DE CONVERSA HUMANA: O BOT NUNCA INTERROMPE CONVERSAS NORMAIS!
      // =========================================================================
      if (entry.messaging) {
        for (const msg of entry.messaging) {
          const senderId = msg.sender?.id;
          if (!senderId) continue;

          // Ignora mensagens enviadas pela própria página/conta (eco)
          if (senderId === MY_PAGE_ID || senderId === MY_IG_ID || msg.message?.is_echo) {
            continue;
          }

          const rawText = (msg.message?.text || '').trim();
          const postbackPayload = msg.postback?.payload || msg.message?.quick_reply?.payload;

          // Detecta se o usuário clicou no botão "Já estou te seguindo!"
          const isButtonClicked = postbackPayload === 'FOLLOW_CONFIRMED';

          // Detecta se o usuário enviou a palavra-chave no direct
          const isExactKeyword = matchesKeyword(rawText, state.keyword);

          // REGRA DE SEGURANÇA 3: FILTRO ANTI-INTRUSÃO
          // Se NÃO foi clique no botão E NÃO foi a palavra-chave configurada:
          // O BOT NÃO FAZ ABSOLUTAMENTE NADA!
          // Conversas como "Eai", "Oi", "Crl", "Tudo bem?", áudios, etc., são deixadas 100% livres para o humano responder!
          if (!isButtonClicked && !isExactKeyword) {
            continue; // PULA! Zero resposta automática para conversas normais!
          }

          // Caso 1: Usuário enviou a palavra-chave no Direct (ex: "LISTA")
          if (isExactKeyword && !isButtonClicked) {
            const firstDmText = state.firstDmSubtitle || state.firstDmText || "Tô postando vídeo assim toda semana! Clica no botão abaixo pra liberar o link 👇";
            const rawBtn = state.buttonText || "✅ Já estou seguindo";
            const buttonText = formatMetaButtonTitle(rawBtn);

            try {
              await fetch(`https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_TOKEN}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  recipient: { id: senderId },
                  message: {
                    text: firstDmText,
                    quick_replies: [
                      {
                        content_type: "text",
                        title: buttonText,
                        payload: "FOLLOW_CONFIRMED"
                      }
                    ]
                  }
                })
              });
            } catch (e) {
              console.error('Erro ao responder palavra-chave no direct:', e);
            }
            continue;
          }

          // Caso 2: Usuário clicou no botão "Já estou te seguindo!" (FOLLOW_CONFIRMED)
          if (isButtonClicked) {
            // Checagem oficial na Meta se o perfil REALMENTE segue a conta comercial
            let isFollower = false;
            try {
              const checkRes = await fetch(`https://graph.facebook.com/v21.0/${senderId}?fields=is_user_follow_business&access_token=${PAGE_TOKEN}`);
              const checkData = await checkRes.json();
              if (checkData.is_user_follow_business === true) {
                isFollower = true;
              }
            } catch (e) {
              console.error('Erro ao verificar status de seguidor na Meta:', e);
            }

            if (isFollower) {
              // SEGUIDOR CONFIRMADO: Envia o link final com segurança!
              try {
                await fetch(`https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_TOKEN}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    recipient: { id: senderId },
                    message: { text: state.finalLinkMessage }
                  })
                });
              } catch (e) {
                console.error('Erro ao enviar link final no direct:', e);
              }
            } else {
              // NÃO SEGUE: NÃO envia o link! Envia o lembrete educado com o botão para tentar de novo
              try {
                await fetch(`https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_TOKEN}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    recipient: { id: senderId },
                    message: {
                      text: state.travaReminder,
                      quick_replies: [
                        {
                          content_type: "text",
                          title: formatMetaButtonTitle(state.buttonText),
                          payload: "FOLLOW_CONFIRMED"
                        }
                      ]
                    }
                  })
                });
              } catch (e) {
                console.error('Erro ao enviar lembrete de trava no direct:', e);
              }
            }
          }
        }
      }
    }

    return new Response('EVENT_RECEIVED', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });
  } catch (err) {
    console.error('Erro geral no webhook:', err);
    return new Response('Bad Request', { status: 400 });
  }
}
