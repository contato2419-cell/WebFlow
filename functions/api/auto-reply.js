// Cloudflare Pages Function: Motor de Comentários em Background (Meta Graph API v21.0)
// REA: Sincronizado com KV, Delay Humano Configurável, Anti-Duplicação e Zero Spam em DMs

const PAGE_ID = '1299815346552748';
const IG_USER_ID = '17841428469294913';

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
  finalLinkMessage: `Tá na mão🚀 \nhttps://x.com/Ithielix/status/2109527114760208745\n\nLink do melhor mousepad de 2026 🏆\nhttps://vt.tiktok.com/ZS9UR1CkPgovL-hgiWV/`
};

const CF_ACCOUNT_ID = 'be7db94a293732762035a5c23126dfae';
const CF_KV_ID = '6ffd8aa59e6a43ebaee8c87a7dd5ceb1';

let inMemoryStateCache = null;
let cacheTimestamp = 0;

async function getStoredState(env) {
  if (inMemoryStateCache && (Date.now() - cacheTimestamp < 15000)) return inMemoryStateCache;

  if (env && env.WEBFLOW_KV) {
    try {
      const stored = await env.WEBFLOW_KV.get('FLOW_STATE');
      if (stored) {
        inMemoryStateCache = JSON.parse(stored);
        cacheTimestamp = Date.now();
        return inMemoryStateCache;
      }
    } catch (e) {
      console.warn('Erro ao ler do KV em auto-reply:', e.message);
    }
  }

  const token = env?.CLOUDFLARE_API_TOKEN || env?.CF_TOKEN;
  if (!token) return inMemoryStateCache;

  try {
    const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${CF_KV_ID}/values/FLOW_STATE`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const text = await res.text();
      inMemoryStateCache = JSON.parse(text);
      cacheTimestamp = Date.now();
      return inMemoryStateCache;
    }
  } catch (e) {}

  return inMemoryStateCache;
}

async function putStoredState(env, stateObj) {
  inMemoryStateCache = stateObj;
  cacheTimestamp = Date.now();
  const jsonStr = JSON.stringify(stateObj);

  if (env && env.WEBFLOW_KV) {
    try {
      // PROTEÇÃO DE COTA: se for idêntico, zero PUTs gastos!
      const currentRaw = await env.WEBFLOW_KV.get('FLOW_STATE');
      if (currentRaw === jsonStr) {
        return;
      }
      await env.WEBFLOW_KV.put('FLOW_STATE', jsonStr);
      return;
    } catch (e) {
      console.warn('KV temporariamente limitado ou indisponível em auto-reply:', e.message);
      return;
    }
  }

  const token = env?.CLOUDFLARE_API_TOKEN || env?.CF_TOKEN;
  if (!token) return;

  try {
    await fetch(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${CF_KV_ID}/values/FLOW_STATE`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'text/plain'
      },
      body: jsonStr
    });
  } catch (e) {}
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function matchesKeyword(text, keywordString) {
  if (!text || !keywordString) return false;
  const keywords = String(keywordString).split(/[,;|]/).map(k => k.trim().toLowerCase()).filter(Boolean);
  const cleanText = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return keywords.some(kw => {
    const cleanKw = kw.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|[^a-z0-9])${cleanKw}([^a-z0-9]|$)`, 'i');
    if (regex.test(cleanText)) return true;
    if (cleanKw === 'lista' && /(^|[^a-z0-9])lixta([^a-z0-9]|$)/i.test(cleanText)) return true;
    return false;
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

  // Substituições inteligentes para frases padrão de verificação de seguidor
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
  return onRequestPost(context);
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const PAGE_TOKEN = env.META_PAGE_ACCESS_TOKEN;

  try {
    // 1. CARREGA ESTADO GLOBAL DO KV COM FALLBACK REST
    const stored = await getStoredState(env);
    const state = stored ? { ...DEFAULT_STATE, ...stored } : DEFAULT_STATE;

    const body = await request.json().catch(() => ({}));
    const isActive = body.is_active !== undefined ? Boolean(body.is_active) : state.is_active;

    // REGRA DE SEGURANÇA: Se estiver pausado no painel ou no KV, não processa nada!
    if (!isActive) {
      return new Response(JSON.stringify({ 
        success: true, 
        is_active: false,
        message: 'Automação pausada no painel. Nenhum envio efetuado.', 
        processedCount: 0 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const keyword = (body.keyword || state.keyword || 'LISTA').trim().toLowerCase();
    const baseDelaySeconds = Number(body.delaySeconds || state.delaySeconds) || 15;
    const jitterSeconds = Number(body.antiBanJitter || state.antiBanJitter) || 8;
    
    // Suporte prioritário aos textos configurados pelo usuário nas caixinhas do Flow
    const firstDmText = body.firstDmText || body.firstDmSubtitle || state.firstDmSubtitle || state.firstDmText || 'Tô postando vídeo assim toda semana! Clica no botão abaixo pra liberar o link 👇';
    const rawTitle = body.firstDmTitle || state.firstDmTitle || 'Só me seguir e clicar no botão pra min não tomar ban';
    const firstDmTitle = rawTitle.length <= 80 ? rawTitle : rawTitle.slice(0, 80);
    const firstDmSubtitle = smartMetaCardSubtitle(firstDmText);
    const rawBtn = body.buttonText || state.buttonText || '✅ Já estou seguindo';
    const buttonText = formatMetaButtonTitle(rawBtn);

    // 2. Busca até 25 mídias recentes em uma única chamada Meta
    const mediaRes = await fetch(`https://graph.facebook.com/v21.0/${IG_USER_ID}/media?fields=id,caption,media_type,timestamp,comments_count&limit=25&access_token=${PAGE_TOKEN}`);
    const mediaData = await mediaRes.json();
    const mediaList = mediaData.data || [];
    
    if (mediaList.length === 0) {
      return new Response(JSON.stringify({ success: true, processedCount: 0, message: 'Nenhuma mídia encontrada na conta' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // Priorização Inteligente de Mídias Ativas:
    // 1. Mídias com comentários > 0
    const withComments = mediaList.filter(m => (m.comments_count || 0) > 0);
    // 2. Garante que reels virais (com alto engajamento, >= 20 comentários) NUNCA sejam deslocados por posts novos
    const viralReels = withComments.filter(m => (m.comments_count || 0) >= 20);
    // 3. Reels recentes com comentários (< 20 comentários)
    const recentWithComments = withComments.filter(m => (m.comments_count || 0) < 20).slice(0, 3);
    // 4. Junta tudo com limite de segurança para respeitar o orçamento de subrequests do Cloudflare
    const combined = [...viralReels, ...recentWithComments];
    const targetReels = combined.length > 0 ? combined.slice(0, 5) : mediaList.slice(0, 1);

    // Verifica resfriamento anti-spam temporário do Instagram (limite horário da Meta)
    const isForced = Boolean(body.force);
    const cooldownUntil = isForced ? 0 : (state.metaCooldownUntil || 0);
    if (!isForced && Date.now() < cooldownUntil) {
      const waitMinutes = Math.ceil((cooldownUntil - Date.now()) / 60000);
      return new Response(JSON.stringify({
        success: true,
        rateLimited: true,
        cooldownMinutes: waitMinutes,
        message: `Instagram em resfriamento anti-spam. O envio será retomado em ${waitMinutes} min para segurança da conta.`,
        processedCount: 0,
        hasMore: false,
        processed: [],
        skipped: []
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const processed = [];
    const skipped = [];
    let commentsProcessed = 0;
    const MAX_COMMENTS_PER_RUN = 6;
    let hasMorePending = false;
    let isRateLimited = false;
    let lastMetaError = null;
    let subrequestBudget = 25; // Orçamento estrito para nunca estourar o limite de 50 do Cloudflare Worker

    for (const reel of targetReels) {
      if (commentsProcessed >= MAX_COMMENTS_PER_RUN || isRateLimited || subrequestBudget <= 3) {
        if (!isRateLimited && commentsProcessed >= MAX_COMMENTS_PER_RUN) hasMorePending = true;
        break;
      }

      // Varredura focada: 1 ou 2 páginas dos comentários mais recentes (ordem cronológica reversa)
      let commentsUrl = `https://graph.facebook.com/v21.0/${reel.id}/comments?fields=id,text,timestamp,from,username,replies{id,from}&order=reverse_chronological&limit=50&access_token=${PAGE_TOKEN}`;
      let pageCount = 0;
      const MAX_PAGES_PER_REEL = 2;

      while (commentsUrl && pageCount < MAX_PAGES_PER_REEL && commentsProcessed < MAX_COMMENTS_PER_RUN && !isRateLimited && subrequestBudget > 2) {
        pageCount++;
        subrequestBudget--;
        const commRes = await fetch(commentsUrl);
        const commData = await commRes.json();
        const comments = commData.data || [];

        if (comments.length === 0) break;

        for (const comment of comments) {
          if (commentsProcessed >= MAX_COMMENTS_PER_RUN || subrequestBudget <= 2) {
            hasMorePending = true;
            break;
          }

          const text = (comment.text || '').trim();
          const user = (comment.username || comment.from?.username || '').toLowerCase();

          if (!user || user === 'ygorweb') continue;

          // REGRA DE SEGURANÇA: Casamento flexível para palavra-chave
          if (matchesKeyword(text, keyword)) {
            const replies = comment.replies?.data || [];
            const alreadyHasYgorReply = replies.some(r => r.from?.username === 'ygorweb');

            // REGRA DE OURO 1: ANTI-DUPLICAÇÃO ABSOLUTA
            if (alreadyHasYgorReply) {
              skipped.push({ commentId: comment.id, reelId: reel.id, user, reason: 'already_has_public_reply' });
              continue;
            }

            // REGRA DE OURO 2: DELAY HUMANO ANTI-BAN
            const commentAgeSeconds = (Date.now() - new Date(comment.timestamp).getTime()) / 1000;
            const targetDelay = baseDelaySeconds + Math.floor(Math.random() * jitterSeconds);

            if (commentAgeSeconds < targetDelay) {
              skipped.push({ 
                commentId: comment.id, 
                reelId: reel.id,
                user, 
                ageSeconds: Math.round(commentAgeSeconds), 
                targetDelay, 
                reason: 'waiting_human_delay' 
              });
              continue;
            }

            let dmStatus = 'skipped';

            // Resolução Dinâmica de Esteiras e Blocos no DAG
            let branchTitle = firstDmTitle;
            let branchSubtitle = firstDmSubtitle;
            let branchButtonText = buttonText;
            let branchPayload = "FOLLOW_CONFIRMED";

            const flowsList = state.flows || body.flows;
            if (Array.isArray(flowsList)) {
              const activeInstaFlow = flowsList.find(f => f.channel === 'instagram' && f.active);
              if (activeInstaFlow && Array.isArray(activeInstaFlow.nodes)) {
                const matchedTrig = activeInstaFlow.nodes.find(n => n.type === 'trigger' && matchesKeyword(text, n.data?.keyword));
                if (matchedTrig) {
                  const edgeFromTrig = (activeInstaFlow.edges || []).find(e => e.from === matchedTrig.id);
                  const connectedGate = edgeFromTrig 
                    ? activeInstaFlow.nodes.find(n => n.id === edgeFromTrig.to && n.type === 'follower_gate')
                    : null;
                  if (connectedGate) {
                    const rawT = connectedGate.data?.title || branchTitle;
                    const rawSub = connectedGate.data?.text || connectedGate.data?.subtitle || branchSubtitle;
                    const btn = connectedGate.data?.buttons?.[0];
                    const rawB = btn?.title || branchButtonText;
                    const targetNodeId = btn?.targetNode || '';

                    branchTitle = rawT.length <= 80 ? rawT : rawT.slice(0, 80);
                    branchSubtitle = smartMetaCardSubtitle(rawSub);
                    branchButtonText = formatMetaButtonTitle(rawB);
                    if (targetNodeId) {
                      branchPayload = `FOLLOW_CONFIRMED:${targetNodeId}`;
                    }
                  }
                }
              }
            }

            // 1ª DM: Envia a Caixinha Interativa (Generic Template)
            const caixinhaPayload = {
              recipient: { comment_id: comment.id },
              message: {
                attachment: {
                  type: "template",
                  payload: {
                    template_type: "generic",
                    elements: [
                      {
                        title: branchTitle,
                        subtitle: branchSubtitle,
                        buttons: [
                          {
                            type: "postback",
                            title: branchButtonText,
                            payload: branchPayload
                          }
                        ]
                      }
                    ]
                  }
                }
              }
            };

            try {
              const dmRes = await fetch(`https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_TOKEN}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(caixinhaPayload)
              });
              const dmJson = await dmRes.json();
              if (dmJson.message_id) {
                dmStatus = 'success_interactive_card';
              } else {
                const subcode = dmJson.error?.error_subcode;
                if (subcode === 2534001 || subcode === 2534066) {
                  isRateLimited = true;
                  lastMetaError = dmJson.error?.message;
                  break; // Pausa imediata para respeitar resfriamento anti-spam da Meta
                }

                // SUBCODE 2534023: "O comentário ao qual você está tentando responder já tem uma resposta"
                // SIGNIFICA: A DM PRIVADA JÁ FOI ENTREGUE ANTERIORMENTE AO USUÁRIO!
                if (subcode === 2534023) {
                  dmStatus = 'already_delivered';
                } else {
                  // Fallback de texto com Quick Reply
                  const fallbackRes = await fetch(`https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_TOKEN}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      recipient: { comment_id: comment.id },
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
                  const fallbackJson = await fallbackRes.json();
                  if (fallbackJson.message_id) {
                    dmStatus = 'success_quick_reply';
                  } else {
                    if (fallbackJson.error?.error_subcode === 2534023) {
                      dmStatus = 'already_delivered';
                    } else if (fallbackJson.error?.error_subcode === 2534001 || fallbackJson.error?.error_subcode === 2534066) {
                      isRateLimited = true;
                      lastMetaError = fallbackJson.error?.message;
                      break;
                    } else {
                      dmStatus = 'failed';
                    }
                  }
                }
              }
            } catch (e) {
              dmStatus = 'error_network';
            }

            // APENAS processa resposta pública se a DM teve sucesso real (ou já foi entregue anteriormente)!
            let pubStatus = 'skipped';
            if (dmStatus === 'success_interactive_card' || dmStatus === 'success_quick_reply' || dmStatus === 'already_delivered') {
              await sleep(300);
              try {
                const replyText = PUBLIC_REPLIES[Math.floor(Math.random() * PUBLIC_REPLIES.length)];
                const pubRes = await fetch(`https://graph.facebook.com/v21.0/${comment.id}/replies?access_token=${PAGE_TOKEN}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ message: replyText })
                });
                const pubJson = await pubRes.json();
                if (pubJson.id) pubStatus = 'success';
              } catch (e) {
                pubStatus = 'error';
              }

              processed.push({
                commentId: comment.id,
                reelId: reel.id,
                user,
                text,
                dmStatus,
                pubStatus
              });
              commentsProcessed++;
              await sleep(800); // 800ms entre envios reais para não sobrecarregar e evitar timeouts
            } else {
              skipped.push({
                commentId: comment.id,
                reelId: reel.id,
                user,
                reason: isRateLimited ? 'meta_rate_limited' : 'dm_failed'
              });
            }

            if (isRateLimited) break;
          }
        }

        if (isRateLimited) break;
        commentsUrl = commData.paging?.next || null;
      }
    }

    // Se detectou resfriamento anti-spam da Meta, registra cooldown de 15 minutos no KV
    if (isRateLimited) {
      const cooldownMinutes = 15;
      const metaCooldownUntil = Date.now() + cooldownMinutes * 60 * 1000;
      await putStoredState(env, { ...state, metaCooldownUntil });

      return new Response(JSON.stringify({
        success: true,
        rateLimited: true,
        cooldownMinutes,
        message: `A Meta ativou resfriamento temporário anti-spam (${lastMetaError || 'Aguarde alguns minutos'}). O envio foi pausado para proteger sua conta.`,
        mediaCount: mediaList.length,
        processedCount: processed.length,
        hasMore: false,
        processed,
        skipped
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // Se saiu do cooldown com sucesso ou foi liberado, limpa a flag no KV
    if (state.metaCooldownUntil) {
      await putStoredState(env, { ...state, metaCooldownUntil: 0 });
    }

    return new Response(JSON.stringify({
      success: true,
      rateLimited: false,
      mediaCount: mediaList.length,
      processedCount: processed.length,
      hasMore: hasMorePending,
      processed,
      skipped
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}
